import { WorkflowPhase } from "../types/bmad";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowProgressProps {
  phases: WorkflowPhase[];
  currentPhase: string;
  className?: string;
}

export function WorkflowProgress({ phases, currentPhase, className }: WorkflowProgressProps) {
  const getStatusIcon = (status: WorkflowPhase['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'active':
        return <Clock className="h-4 w-4 text-primary animate-pulse" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: WorkflowPhase['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'active':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const overallProgress = phases.reduce((acc, phase) => acc + phase.progress, 0) / phases.length;

  return (
    <Card className={cn("p-6", className)}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">Project Workflow</h3>
          <Badge variant="outline" className="text-xs">
            {Math.round(overallProgress)}% Complete
          </Badge>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      <div className="space-y-4">
        {phases.map((phase, index) => {
          const isActive = phase.id === currentPhase;
          const isNext = phases[index - 1]?.status === 'active' && phase.status === 'pending';
          
          return (
            <div
              key={phase.id}
              className={cn(
                "relative p-4 rounded-lg border transition-all duration-200",
                isActive && "bg-primary/5 border-primary/20 shadow-md",
                isNext && "bg-secondary/50 border-secondary",
                !isActive && !isNext && "bg-card"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getStatusIcon(phase.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-sm">{phase.name}</h4>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getStatusColor(phase.status))}
                    >
                      {phase.status}
                    </Badge>
                    {isNext && (
                      <Badge variant="secondary" className="text-xs">Next</Badge>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3">
                    {phase.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{phase.agents.length} agents</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{phase.estimatedTime}</span>
                    </div>
                    
                    {phase.progress > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {phase.progress}%
                      </div>
                    )}
                  </div>
                  
                  {phase.progress > 0 && (
                    <Progress value={phase.progress} className="h-1 mt-2" />
                  )}
                </div>
              </div>
              
              {index < phases.length - 1 && (
                <div className="absolute left-[23px] bottom-0 w-px h-4 bg-border" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}