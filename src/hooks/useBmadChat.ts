import { useState, useCallback, useRef } from "react";
import { Message, Agent, ChatState } from "../types/bmad";
import { agents } from "../data/agents";
import { generateAgentResponse } from "../services/agentResponseService";

export function useBmadChat(initialAgent?: Agent) {
  const [chatState, setChatState] = useState<ChatState>({
    activeAgent: initialAgent || agents[0],
    messages: [],
    isTyping: false,
    context: {
      recentDocuments: []
    }
  });

  // Use ref to avoid stale closure
  const activeAgentRef = useRef<Agent>(chatState.activeAgent);
  activeAgentRef.current = chatState.activeAgent;

  const sendMessage = useCallback(async (content: string, type: Message['type'] = 'text') => {
    // Validate input
    if (!content || content.trim().length === 0) {
      return;
    }

    const sanitizedContent = content.trim();

    const userMessage: Message = {
      id: crypto.randomUUID(),
      agentId: 'user',
      content: sanitizedContent,
      timestamp: new Date(),
      type
    };

    // Add user message
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true
    }));

    // Simulate agent response with proper async handling
    try {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Use ref to get current agent (avoid stale closure)
      const currentAgent = activeAgentRef.current;
      const isCommand = sanitizedContent.startsWith('*');
      const responseContent = generateAgentResponse(sanitizedContent, currentAgent, type);

      const agentResponse: Message = {
        id: crypto.randomUUID(),
        agentId: currentAgent.id,
        content: responseContent,
        timestamp: new Date(),
        type: isCommand ? 'command' : 'text'
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, agentResponse],
        isTyping: false
      }));
    } catch (error) {
      console.error('Error generating agent response:', error);
      setChatState(prev => ({
        ...prev,
        isTyping: false
      }));
    }
  }, []);

  const changeAgent = useCallback((agent: Agent) => {
    setChatState(prev => ({
      ...prev,
      activeAgent: agent
    }));
    activeAgentRef.current = agent;
  }, []);

  const clearChat = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      messages: []
    }));
  }, []);

  return {
    chatState,
    sendMessage,
    changeAgent,
    clearChat
  };
}
