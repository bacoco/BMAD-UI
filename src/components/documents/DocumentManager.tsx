import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document } from "../../types/bmad";
import { DocumentViewer } from "./DocumentViewer";
import { DocumentEditor } from "./DocumentEditor";
import { TemplateLibrary } from "./TemplateLibrary";
import { mockDocuments } from "../../data/mockDocuments";
import {
  Search,
  FileText,
  Plus,
  Calendar,
  User,
  Edit3,
  Eye,
  Share
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentManagerProps {
  documents: Document[];
  onDocumentCreate: (template: string) => void;
  onDocumentEdit: (documentId: string) => void;
  onDocumentDelete: (documentId: string) => void;
  onDocumentShare: (documentId: string) => void;
  className?: string;
}

const documentTypes = [
  { id: 'all', name: 'All Documents', icon: FileText },
  { id: 'prd', name: 'PRD', icon: FileText },
  { id: 'architecture', name: 'Architecture', icon: FileText },
  { id: 'story', name: 'User Stories', icon: FileText },
  { id: 'brief', name: 'Project Brief', icon: FileText },
  { id: 'ux-spec', name: 'UX Spec', icon: FileText },
  { id: 'tech-doc', name: 'Technical', icon: FileText }
];

export function DocumentManager({
  documents = mockDocuments,
  onDocumentCreate,
  onDocumentEdit,
  onDocumentDelete,
  onDocumentShare,
  className
}: DocumentManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'view' | 'edit'>('list');

  // Memoize filtered documents for performance
  const filteredDocuments = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchLower) ||
                           doc.content.toLowerCase().includes(searchLower);
      const matchesType = selectedType === 'all' || doc.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [documents, searchTerm, selectedType]);

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
    setViewMode('view');
  };

  const handleCreateDocument = () => {
    setViewMode('edit');
    setSelectedDocument(null);
  };

  if (viewMode === 'view' && selectedDocument) {
    return (
      <DocumentViewer
        document={selectedDocument}
        onEdit={() => setViewMode('edit')}
        onBack={() => setViewMode('list')}
        onShare={() => onDocumentShare(selectedDocument.id)}
        className={className}
      />
    );
  }

  if (viewMode === 'edit') {
    return (
      <DocumentEditor
        document={selectedDocument}
        onSave={(savedDoc) => {
          setSelectedDocument(savedDoc);
          setViewMode('view');
        }}
        onCancel={() => setViewMode('list')}
        className={className}
      />
    );
  }

  return (
    <div className={cn("h-full", className)}>
      <Tabs defaultValue="documents" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="flex-1 flex flex-col space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Documents</h2>
            <Button onClick={handleCreateDocument} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Document
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              {documentTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          {/* Document List */}
          <ScrollArea className="flex-1">
            <div className="space-y-3">
              {filteredDocuments.map((document) => (
                <Card 
                  key={document.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleDocumentSelect(document)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <h3 className="font-medium truncate">{document.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(document.status)}
                        >
                          {document.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {document.content.slice(0, 120)}...
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {document.createdBy}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {document.updatedAt.toLocaleDateString()}
                        </div>
                        <div>v{document.version}</div>
                        <div>{document.collaborators.length} collaborators</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDocument(document);
                          setViewMode('view');
                        }}
                        title="View Document"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDocument(document);
                          setViewMode('edit');
                        }}
                        title="Edit Document"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDocumentShare(document.id);
                        }}
                        title="Share Document"
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              {filteredDocuments.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">No documents found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchTerm || selectedType !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'Create your first document to get started'
                    }
                  </p>
                  <Button onClick={handleCreateDocument} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Document
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="templates" className="flex-1">
          <TemplateLibrary onTemplateSelect={onDocumentCreate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}