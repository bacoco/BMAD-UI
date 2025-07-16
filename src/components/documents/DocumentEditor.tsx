import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Document } from "../../types/bmad";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  FileText,
  User,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentEditorProps {
  document?: Document | null;
  onSave: (document: Document) => void;
  onCancel: () => void;
  className?: string;
}

export function DocumentEditor({ document, onSave, onCancel, className }: DocumentEditorProps) {
  const [title, setTitle] = useState(document?.title || '');
  const [content, setContent] = useState(document?.content || '');
  const [type, setType] = useState<Document['type']>(document?.type || 'brief');
  const [status, setStatus] = useState<Document['status']>(document?.status || 'draft');

  const documentTypes: Array<{ value: Document['type']; label: string }> = [
    { value: 'prd', label: 'Product Requirements Document' },
    { value: 'architecture', label: 'Technical Architecture' },
    { value: 'story', label: 'User Story' },
    { value: 'brief', label: 'Project Brief' },
    { value: 'ux-spec', label: 'UX Specification' },
    { value: 'tech-doc', label: 'Technical Documentation' }
  ];

  const statusOptions: Array<{ value: Document['status']; label: string }> = [
    { value: 'draft', label: 'Draft' },
    { value: 'review', label: 'In Review' },
    { value: 'approved', label: 'Approved' }
  ];

  const handleSave = () => {
    const savedDocument: Document = {
      id: document?.id || `doc-${Date.now()}`,
      type,
      title,
      content,
      createdBy: document?.createdBy || 'current-user',
      createdAt: document?.createdAt || new Date(),
      updatedAt: new Date(),
      status,
      version: (document?.version || 0) + 1,
      collaborators: document?.collaborators || []
    };
    
    onSave(savedDocument);
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">
              {document ? 'Edit Document' : 'Create New Document'}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Editor Panel */}
        <div className="flex-1 flex flex-col">
          {/* Document Settings */}
          <Card className="m-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Document Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as Document['type'])}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  {documentTypes.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Document['status'])}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  {statusOptions.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Version</label>
                <div className="px-3 py-2 border border-border rounded-md bg-muted text-sm">
                  v{(document?.version || 0) + 1}
                </div>
              </div>
            </div>
          </Card>

          {/* Title Input */}
          <div className="mx-4 mb-4">
            <label className="block text-sm font-medium mb-2">Document Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title..."
              className="text-lg font-medium"
            />
          </div>

          {/* Content Editor */}
          <div className="flex-1 mx-4 mb-4">
            <label className="block text-sm font-medium mb-2">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your document content here..."
              className="h-full resize-none font-mono text-sm"
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-1/3 border-l border-border">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="font-medium">Preview</span>
            </div>
          </div>
          
          <div className="p-4 h-full overflow-auto">
            <div className="prose prose-sm max-w-none">
              {title && <h1 className="text-xl font-bold mb-4">{title}</h1>}
              {content.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-lg font-bold mb-3 mt-4">{line.slice(2)}</h1>;
                }
                if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-base font-semibold mb-2 mt-3">{line.slice(3)}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-sm font-medium mb-2 mt-3">{line.slice(4)}</h3>;
                }
                if (line.startsWith('- ')) {
                  return <li key={index} className="ml-4 mb-1 text-sm">{line.slice(2)}</li>;
                }
                if (line.trim() === '') {
                  return <br key={index} />;
                }
                return <p key={index} className="mb-2 text-sm">{line}</p>;
              })}
              
              {!content && (
                <div className="text-muted-foreground text-sm italic">
                  Preview will appear here as you type...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}