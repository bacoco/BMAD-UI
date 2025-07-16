import { useState } from "react";
import { Project } from "../types/bmad";
import { agents } from "../data/agents";
import { workflowPhases } from "../data/workflows";
import { useBmadChat } from "../hooks/useBmadChat";
import { ProjectHeader } from "../components/ProjectHeader";
import { ChatInterface } from "../components/ChatInterface";
import { WorkflowProgress } from "../components/WorkflowProgress";
import { Card } from "@/components/ui/card";

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
      provider: "claude-code",
      apiKey: "",
      model: "claude-3-sonnet-20240229",
      baseUrl: "https://api.anthropic.com/v1"
    },
    bmad: {
      version: "4.30.1",
      agentTeam: "full-stack",
      templates: {}
    }
  }
};

export default function BMadApp() {
  const [project] = useState<Project>(mockProject);
  const { chatState, sendMessage, changeAgent } = useBmadChat(agents[0]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProjectHeader project={project} />
      
      <div className="flex-1 flex gap-6 p-6">
        {/* Chat Interface */}
        <Card className="flex-1 flex flex-col min-h-[600px]">
          <ChatInterface
            chatState={chatState}
            availableAgents={agents}
            onSendMessage={sendMessage}
            onAgentChange={changeAgent}
            className="h-full"
          />
        </Card>

        {/* Workflow Sidebar */}
        <div className="w-80 space-y-6">
          <WorkflowProgress
            phases={project.phases}
            currentPhase={project.currentPhase}
          />
        </div>
      </div>
    </div>
  );
}