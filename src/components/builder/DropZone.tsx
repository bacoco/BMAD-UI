import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Copy, Move } from "lucide-react";
import { cn } from "@/lib/utils";

interface DroppedComponent {
  id: string;
  name: string;
  code: string;
  position: { x: number; y: number };
}

interface DropZoneProps {
  droppedComponents: DroppedComponent[];
  onComponentDrop: (component: any, position: { x: number; y: number }) => void;
  onComponentEdit: (componentId: string) => void;
  onComponentDelete: (componentId: string) => void;
  onComponentDuplicate: (componentId: string) => void;
  className?: string;
}

export function DropZone({
  droppedComponents,
  onComponentDrop,
  onComponentEdit,
  onComponentDelete,
  onComponentDuplicate,
  className
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const componentData = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      onComponentDrop(componentData, position);
    } catch (error) {
      console.error('Failed to parse dropped component data:', error);
    }
  };

  return (
    <Card 
      className={cn(
        "relative min-h-[600px] overflow-hidden transition-all duration-200",
        isDragOver && "border-primary border-2 bg-primary/5",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop Zone Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {droppedComponents.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-lg flex items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Start Building Your App</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Drag components from the library to start creating your application layout.
            </p>
            <div className="text-xs text-muted-foreground">
              💡 Tip: You can also use chat commands like "*create hero section"
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-full">
          {droppedComponents.map((component) => (
            <div
              key={component.id}
              className={cn(
                "absolute border-2 border-transparent rounded-lg transition-all duration-200 group",
                selectedComponent === component.id && "border-primary bg-primary/5"
              )}
              style={{
                left: component.position.x,
                top: component.position.y,
                minWidth: '200px',
                minHeight: '100px'
              }}
              onClick={() => setSelectedComponent(component.id)}
            >
              {/* Component Preview */}
              <div className="bg-background border border-border rounded-lg p-4 shadow-sm group-hover:shadow-md transition-shadow">
                <div className="text-sm font-medium mb-2">{component.name}</div>
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded font-mono">
                  {component.code.slice(0, 100)}...
                </div>
              </div>

              {/* Component Controls */}
              {selectedComponent === component.id && (
                <div className="absolute -top-10 left-0 flex gap-1 bg-background border border-border rounded-lg p-1 shadow-lg">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onComponentEdit(component.id);
                    }}
                    title="Edit Component"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onComponentDuplicate(component.id);
                    }}
                    title="Duplicate Component"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onComponentDelete(component.id);
                    }}
                    title="Delete Component"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop Indicator */}
      {isDragOver && (
        <div className="absolute inset-4 border-2 border-dashed border-primary rounded-lg bg-primary/10 flex items-center justify-center">
          <div className="text-primary font-medium">Drop component here</div>
        </div>
      )}
    </Card>
  );
}