import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Agent } from "../types/bmad";
import { cn } from "@/lib/utils";

interface AgentAvatarProps {
  agent: Agent;
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
  showStatus?: boolean;
}

export function AgentAvatar({ agent, size = "md", isActive = false, showStatus = false }: AgentAvatarProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-12 w-12 text-lg"
  };

  return (
    <div className="relative">
      <Avatar className={cn(
        sizeClasses[size],
        "transition-all duration-200",
        isActive && "ring-2 ring-primary ring-offset-2 shadow-glow"
      )}>
        <AvatarFallback 
          className={cn(
            "font-semibold transition-all duration-200",
            `bg-${agent.color}/10 text-${agent.color} border border-${agent.color}/20`,
            isActive && `bg-${agent.color}/20`
          )}
        >
          {agent.icon}
        </AvatarFallback>
      </Avatar>
      
      {showStatus && (
        <div className={cn(
          "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
          isActive ? "bg-green-500" : "bg-gray-400"
        )} />
      )}
    </div>
  );
}