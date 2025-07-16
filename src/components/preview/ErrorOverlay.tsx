import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ErrorOverlayProps {
  errors: string[];
  onDismiss: () => void;
  className?: string;
}

export function ErrorOverlay({ errors, onDismiss, className }: ErrorOverlayProps) {
  if (errors.length === 0) return null;

  return (
    <div className={`absolute inset-0 bg-background/95 backdrop-blur-sm z-20 p-4 ${className}`}>
      <Card className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-semibold">Build Errors ({errors.length})</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Error List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {errors.map((error, index) => (
              <div 
                key={index}
                className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <pre className="text-sm text-destructive font-mono whitespace-pre-wrap">
                  {error}
                </pre>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Fix these errors in the chat to see your preview update automatically.
          </p>
        </div>
      </Card>
    </div>
  );
}