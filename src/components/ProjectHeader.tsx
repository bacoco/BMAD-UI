import { Project } from "../types/bmad";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Save, 
  Download, 
  Share, 
  Play, 
  Pause,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectHeaderProps {
  project: Project;
  onSave?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
}

export function ProjectHeader({ 
  project, 
  onSave, 
  onExport, 
  onShare, 
  onSettings 
}: ProjectHeaderProps) {
  const getProjectTypeColor = (type: Project['type']) => {
    switch (type) {
      case 'fullstack':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'frontend':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'backend':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'mobile':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex-shrink-0 bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">{project.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="outline" 
                className={`text-xs ${getProjectTypeColor(project.type)}`}
              >
                {project.type}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Created {new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }).format(project.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSettings}>
                <Settings className="h-4 w-4 mr-2" />
                Project Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}