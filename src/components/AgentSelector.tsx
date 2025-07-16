import { Agent } from "../types/bmad";
import { AgentAvatar } from "./AgentAvatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AgentSelectorProps {
  agents: Agent[];
  activeAgent: Agent;
  onAgentSelect: (agent: Agent) => void;
  className?: string;
}

export function AgentSelector({ agents, activeAgent, onAgentSelect, className }: AgentSelectorProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="mb-3">
        <h3 className="font-semibold text-sm text-foreground">Active Agent</h3>
        <p className="text-xs text-muted-foreground">Select an agent to continue the conversation</p>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {agents.map((agent) => {
          const isActive = agent.id === activeAgent.id;
          
          return (
            <Button
              key={agent.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "h-auto p-3 justify-start transition-all duration-200",
                isActive && "bg-primary/10 border-primary/20 shadow-md"
              )}
              onClick={() => onAgentSelect(agent)}
            >
              <div className="flex items-center gap-3 w-full">
                <AgentAvatar agent={agent} size="sm" isActive={isActive} />
                
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">{agent.name}</span>
                    {isActive && (
                      <Badge variant="secondary" className="text-xs">Active</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {agent.title}
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}