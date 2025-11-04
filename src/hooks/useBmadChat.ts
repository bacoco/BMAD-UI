import { useReducer, useCallback } from "react";
import { Message, Agent, ChatState } from "../types/bmad";
import { agents } from "../data/agents";
import { generateAgentResponse } from "../services/agentResponseService";
import { UI_CONFIG } from "../config/constants";

// Action types for reducer
type ChatAction =
  | { type: 'SET_AGENT'; agent: Agent }
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'SET_TYPING'; isTyping: boolean; agentId?: string }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'ADD_AGENT_MESSAGE'; message: Message };

// Reducer for better state management
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_AGENT':
      return { ...state, activeAgent: action.agent };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    case 'ADD_AGENT_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
        isTyping: false,
      };
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.isTyping,
        typingAgent: action.agentId,
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
      };
    default:
      return state;
  }
}

export function useBmadChat(initialAgent?: Agent) {
  const [chatState, dispatch] = useReducer(chatReducer, {
    activeAgent: initialAgent || agents[0],
    messages: [],
    isTyping: false,
    context: {
      recentDocuments: []
    }
  });

  const sendMessage = useCallback(async (content: string, type: Message['type'] = 'text') => {
    // Validate input - note: validation is also done in ChatInterface
    const sanitizedContent = content.trim();
    if (!sanitizedContent) {
      console.warn('Empty message - validation should be handled by UI');
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      agentId: 'user',
      content: sanitizedContent,
      timestamp: new Date(),
      type
    };

    // Add user message and set typing state
    dispatch({ type: 'ADD_MESSAGE', message: userMessage });
    dispatch({ type: 'SET_TYPING', isTyping: true, agentId: chatState.activeAgent.id });

    // Simulate agent response with proper async handling
    try {
      const delay = UI_CONFIG.TYPING_SIMULATION_MIN +
        Math.random() * (UI_CONFIG.TYPING_SIMULATION_MAX - UI_CONFIG.TYPING_SIMULATION_MIN);

      await new Promise(resolve => setTimeout(resolve, delay));

      const isCommand = sanitizedContent.startsWith('*');
      const responseContent = generateAgentResponse(
        sanitizedContent,
        chatState.activeAgent,
        type
      );

      const agentResponse: Message = {
        id: crypto.randomUUID(),
        agentId: chatState.activeAgent.id,
        content: responseContent,
        timestamp: new Date(),
        type: isCommand ? 'command' : 'text'
      };

      dispatch({ type: 'ADD_AGENT_MESSAGE', message: agentResponse });
    } catch (error) {
      console.error('Error generating agent response:', error);

      // Add error message to chat
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        agentId: chatState.activeAgent.id,
        content: '❌ Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date(),
        type: 'text'
      };

      dispatch({ type: 'ADD_AGENT_MESSAGE', message: errorMessage });
    }
  }, [chatState.activeAgent]);

  const changeAgent = useCallback((agent: Agent) => {
    dispatch({ type: 'SET_AGENT', agent });
  }, []);

  const clearChat = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  return {
    chatState,
    sendMessage,
    changeAgent,
    clearChat
  };
}
