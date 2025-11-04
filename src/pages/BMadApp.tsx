import { useState, useCallback } from "react";
import { Project } from "../types/bmad";
import { agents } from "../data/agents";
import { workflowPhases } from "../data/workflows";
import { useBmadChat } from "../hooks/useBmadChat";
import { ProjectHeader } from "../components/ProjectHeader";
import { ChatInterface } from "../components/ChatInterface";
import { WorkflowProgress } from "../components/WorkflowProgress";
import { LivePreview } from "../components/preview/LivePreview";
import { VisualBuilder } from "../components/builder/VisualBuilder";
import { DocumentManager } from "../components/documents/DocumentManager";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Eye, FileText, Palette } from "lucide-react";
import { sanitizePreviewCode } from "../utils/codeSanitizer";
import { API_CONFIG, UI_CONFIG } from "../config/constants";
import { useToast } from "@/hooks/use-toast";

const mockProject: Project = {
  id: "bmad-project-1",
  name: "BMAD UI Builder",
  description: "AI-driven development workflow application",
  type: "fullstack",
  currentPhase: "ideation",
  activeAgent: "orchestrator",
  phases: workflowPhases,
  documents: [],
  messages: [],
  createdAt: new Date(),
  config: {
    llm: {
      provider: API_CONFIG.LLM_PROVIDER,
      apiKey: "",
      model: API_CONFIG.DEFAULT_MODEL,
      baseUrl: API_CONFIG.BASE_URL
    },
    bmad: {
      version: API_CONFIG.BMAD_VERSION,
      agentTeam: API_CONFIG.DEFAULT_TEAM,
      templates: {}
    }
  }
};

export default function BMadApp() {
  const [project] = useState<Project>(mockProject);
  const { chatState, sendMessage, changeAgent } = useBmadChat(agents[0]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildErrors, setBuildErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('chat');
  const { toast } = useToast();

  const handleCodeGeneration = useCallback((code: string) => {
    setIsBuilding(true);
    setGeneratedCode(code);
    setBuildErrors([]); // Clear previous errors

    // Process code generation (in real app, this would call build service)
    setTimeout(() => {
      setIsBuilding(false);
      // Build errors would be populated by actual build service
      // For now, code generation is successful
    }, 2000);
  }, []);

  const handleRefreshPreview = () => {
    if (generatedCode) {
      handleCodeGeneration(generatedCode);
    }
  };

  const handleOpenExternal = () => {
    if (!generatedCode) {
      toast({
        title: "No Code to Preview",
        description: "Please generate some code first.",
        variant: "destructive",
      });
      return;
    }

    // Sanitize code before opening
    const sanitizedCode = sanitizePreviewCode(generatedCode);

    // Create a blob URL for safer preview handling
    const previewHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>BMAD Preview</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com/3.3.5"></script>
          <style>
            body {
              margin: 0;
              padding: 16px;
              font-family: system-ui, -apple-system, sans-serif;
            }
          </style>
        </head>
        <body>
          <div id="root">${sanitizedCode}</div>
        </body>
      </html>
    `;

    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');

    // Properly clean up blob URL
    if (newWindow) {
      // Wait for window to load before revoking URL
      newWindow.addEventListener('load', () => {
        setTimeout(() => URL.revokeObjectURL(url), UI_CONFIG.BLOB_URL_CLEANUP_DELAY);
      });
    } else {
      // If window.open was blocked, revoke immediately
      URL.revokeObjectURL(url);
      toast({
        title: "Popup Blocked",
        description: "Please allow popups for this site to open the preview.",
        variant: "destructive",
      });
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background flex flex-col">
        <ProjectHeader project={project} />

        <div className="flex-1 flex gap-6 p-6">
          {/* Left Panel - Chat & Documents */}
          <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="builder" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Builder
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 mt-6">
              <Card className="h-full flex flex-col">
                <ChatInterface
                  chatState={chatState}
                  availableAgents={agents}
                  onSendMessage={sendMessage}
                  onAgentChange={changeAgent}
                  onCodeGeneration={handleCodeGeneration}
                  className="h-full"
                />
              </Card>
            </TabsContent>
            
            <TabsContent value="builder" className="flex-1 mt-6">
              <VisualBuilder
                onCodeGeneration={handleCodeGeneration}
                className="h-full"
              />
            </TabsContent>
            
            <TabsContent value="preview" className="flex-1 mt-6">
              <LivePreview
                generatedCode={generatedCode}
                isBuilding={isBuilding}
                buildErrors={buildErrors}
                onRefresh={handleRefreshPreview}
                onOpenExternal={handleOpenExternal}
                className="h-full"
              />
            </TabsContent>
            
            <TabsContent value="documents" className="flex-1 mt-6">
              <DocumentManager
                documents={project.documents}
                onDocumentCreate={(template) => console.log('Create doc from template:', template)}
                onDocumentEdit={(id) => console.log('Edit document:', id)}
                onDocumentDelete={(id) => console.log('Delete document:', id)}
                onDocumentShare={(id) => console.log('Share document:', id)}
                className="h-full"
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Workflow & Tools */}
        <div className="w-80 space-y-6">
          <WorkflowProgress
            phases={project.phases}
            currentPhase={project.currentPhase}
          />
          
          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('preview')}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Preview
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleRefreshPreview}
              >
                <Code className="h-4 w-4 mr-2" />
                Rebuild App
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}