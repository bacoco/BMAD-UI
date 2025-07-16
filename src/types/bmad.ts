export interface Agent {
  id: string;
  name: string;
  title: string;
  icon: string;
  avatar: string;
  color: string;
  persona: {
    role: string;
    style: string;
    focus: string;
    expertise: string[];
  };
  capabilities: string[];
  commands: string[];
}

export interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'document' | 'code' | 'command';
  metadata?: {
    documentId?: string;
    codeLanguage?: string;
    commandType?: string;
  };
}

export interface WorkflowPhase {
  id: string;
  name: string;
  description: string;
  agents: string[];
  status: 'pending' | 'active' | 'completed';
  progress: number;
  documents: string[];
  estimatedTime: string;
}

export interface Document {
  id: string;
  type: 'prd' | 'architecture' | 'story' | 'brief' | 'ux-spec' | 'tech-doc';
  title: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'review' | 'approved';
  version: number;
  collaborators: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'fullstack' | 'backend' | 'frontend' | 'mobile';
  currentPhase: string;
  activeAgent: string;
  phases: WorkflowPhase[];
  documents: Document[];
  messages: Message[];
  createdAt: Date;
  config: {
    llm: {
      provider: string;
      apiKey: string;
      model: string;
      baseUrl: string;
    };
    bmad: {
      version: string;
      agentTeam: string;
      templates: Record<string, string>;
    };
  };
}

export interface ChatState {
  activeAgent: Agent;
  messages: Message[];
  isTyping: boolean;
  typingAgent?: string;
  context: {
    currentDocument?: Document;
    currentPhase?: WorkflowPhase;
    recentDocuments: Document[];
  };
}