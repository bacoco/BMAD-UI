import { Message, Agent } from "../types/bmad";
import { AgentAvatar } from "./AgentAvatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, FileText, Code, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  agent: Agent;
  isLatest?: boolean;
}

export function ChatMessage({ message, agent, isLatest = false }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTypeIcon = () => {
    switch (message.type) {
      case 'document':
        return <FileText className="h-3 w-3" />;
      case 'code':
        return <Code className="h-3 w-3" />;
      case 'command':
        return <Terminal className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div className={cn(
      "flex gap-3 p-4 transition-all duration-200",
      isLatest && "animate-fade-in"
    )}>
      <AgentAvatar agent={agent} size="md" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-foreground">{agent.name}</span>
          <Badge variant="secondary" className="text-xs">
            {agent.title}
          </Badge>
          {message.type !== 'text' && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              {getTypeIcon()}
              {message.type}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground ml-auto">
            {formatTime(message.timestamp)}
          </span>
        </div>
        
        <Card className="p-4 bg-card border-border/50">
          <div className="prose prose-sm max-w-none">
            {message.type === 'code' ? (
              <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                <code className={`language-${message.metadata?.codeLanguage || 'text'}`}>
                  {message.content}
                </code>
              </pre>
            ) : (
              <div className="whitespace-pre-wrap text-card-foreground">
                {message.content}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <div className="flex gap-2">
              {message.metadata?.documentId && (
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  View Document
                </Button>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-7 text-xs"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}