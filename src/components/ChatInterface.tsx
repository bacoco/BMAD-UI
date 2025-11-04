import { useState, useRef, useEffect } from "react";
import { Message, Agent, ChatState } from "../types/bmad";
import { ChatMessage } from "./ChatMessage";
import { AgentSelector } from "./AgentSelector";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, Sparkles, Command } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  chatState: ChatState;
  availableAgents: Agent[];
  onSendMessage: (content: string, type?: Message['type']) => void;
  onAgentChange: (agent: Agent) => void;
  onCodeGeneration?: (code: string) => void;
  className?: string;
}

export function ChatInterface({ 
  chatState, 
  availableAgents, 
  onSendMessage, 
  onAgentChange,
  onCodeGeneration,
  className 
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatState.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    const trimmedInput = input.trim();
    if (!trimmedInput || chatState.isTyping) return;

    // Validate length (max 5000 characters)
    if (trimmedInput.length > 5000) {
      console.warn('Message too long. Maximum 5000 characters allowed.');
      return;
    }

    const messageType = trimmedInput.startsWith('*') ? 'command' : 'text';
    onSendMessage(trimmedInput, messageType);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestedCommands = [
    { command: "*help", description: "Show available commands" },
    { command: "*status", description: "Check project status" },
    { command: "*workflow", description: "View workflow phases" },
    { command: "*create-prd", description: "Create PRD document" }
  ];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Agent Header */}
      <div className="flex-shrink-0 p-4 border-b bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                aria-label="Agent online status"
              />
              <span className="text-sm font-medium">Active Agent</span>
            </div>
            <Badge variant="outline" className="text-xs" aria-label="Current active agent">
              {chatState.activeAgent.name}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
            aria-label="Switch to different agent"
            aria-expanded={isExpanded}
          >
            Switch Agent
          </Button>
        </div>
        
        {isExpanded && (
          <div className="mt-4 animate-fade-in">
            <AgentSelector
              agents={availableAgents}
              activeAgent={chatState.activeAgent}
              onAgentSelect={(agent) => {
                onAgentChange(agent);
                setIsExpanded(false);
              }}
            />
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-background">
        {chatState.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full p-8">
            <Card className="p-8 text-center max-w-md">
              <div className="mb-4">
                <Sparkles className="h-12 w-12 mx-auto text-primary/60" />
              </div>
              <h3 className="font-semibold mb-2">Welcome to BMAD UI Builder</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start your AI-driven development workflow with the {chatState.activeAgent.name}
              </p>
              <div className="space-y-2">
                {suggestedCommands.map((cmd) => (
                  <Button
                    key={cmd.command}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => setInput(cmd.command)}
                  >
                    <Command className="h-3 w-3 mr-2" />
                    <span className="font-mono">{cmd.command}</span>
                    <span className="ml-2 text-muted-foreground">- {cmd.description}</span>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-1">
            {chatState.messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                agent={availableAgents.find(a => a.id === message.agentId) || chatState.activeAgent}
                isLatest={index === chatState.messages.length - 1}
              />
            ))}
            
            {chatState.isTyping && (
              <div className="flex gap-3 p-4 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm">{chatState.activeAgent.name}</span>
                    <Badge variant="secondary" className="text-xs">typing...</Badge>
                  </div>
                  <Card className="p-3 bg-muted/50">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-200" />
                    </div>
                  </Card>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t bg-card">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${chatState.activeAgent.name}... (use * for commands)`}
              disabled={chatState.isTyping}
              className="pr-10"
              maxLength={5000}
              aria-label="Message input"
              aria-describedby="input-help"
            />
            {input.startsWith('*') && (
              <Badge
                variant="secondary"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                aria-label="Command mode indicator"
              >
                CMD
              </Badge>
            )}
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || chatState.isTyping}
            size="sm"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground" id="input-help">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Commands start with * (max 5000 characters)</span>
        </div>
      </div>
    </div>
  );
}