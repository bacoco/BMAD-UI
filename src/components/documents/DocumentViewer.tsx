import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Document } from "../../types/bmad";
import { 
  ArrowLeft, 
  Edit3, 
  Share, 
  Download, 
  Calendar,
  User,
  FileText,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentViewerProps {
  document: Document;
  onEdit: () => void;
  onBack: () => void;
  onShare: () => void;
  className?: string;
}

export function DocumentViewer({ document, onEdit, onBack, onShare, className }: DocumentViewerProps) {
  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting for display
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold mb-4 mt-6">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-semibold mb-3 mt-5">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-medium mb-2 mt-4">{line.slice(4)}</h3>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-4 mb-1">{line.slice(2)}</li>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="mb-2">{line}</p>;
      });
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">{document.title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(document.status)}>
            {document.status}
          </Badge>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Document Metadata */}
      <Card className="m-4 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <User className="h-3 w-3" />
              Created by
            </div>
            <div className="font-medium">{document.createdBy}</div>
          </div>
          
          <div>
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <Calendar className="h-3 w-3" />
              Created
            </div>
            <div className="font-medium">{document.createdAt.toLocaleDateString()}</div>
          </div>
          
          <div>
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <Calendar className="h-3 w-3" />
              Last updated
            </div>
            <div className="font-medium">{document.updatedAt.toLocaleDateString()}</div>
          </div>
          
          <div>
            <div className="text-muted-foreground mb-1">Version</div>
            <div className="font-medium">v{document.version}</div>
          </div>
        </div>
        
        {document.collaborators.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-2">Collaborators</div>
            <div className="flex flex-wrap gap-2">
              {document.collaborators.map((collaborator) => (
                <Badge key={collaborator} variant="secondary" className="text-xs">
                  {collaborator}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Document Content */}
      <ScrollArea className="flex-1 mx-4 mb-4">
        <Card className="p-6">
          <div className="prose prose-sm max-w-none">
            {formatContent(document.content)}
          </div>
        </Card>
      </ScrollArea>
    </div>
  );
}