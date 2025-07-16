import { WorkflowPhase } from '../types/bmad';

export const workflowPhases: WorkflowPhase[] = [
  {
    id: 'ideation',
    name: 'Ideation & Research',
    description: 'Market research, competitor analysis, and initial concept development',
    agents: ['analyst', 'orchestrator'],
    status: 'pending',
    progress: 0,
    documents: ['project-brief'],
    estimatedTime: '2-3 days'
  },
  {
    id: 'product-definition',
    name: 'Product Definition',
    description: 'Create comprehensive PRD with features, requirements, and specifications',
    agents: ['pm', 'po', 'analyst'],
    status: 'pending',
    progress: 0,
    documents: ['prd', 'feature-specs'],
    estimatedTime: '3-5 days'
  },
  {
    id: 'architecture',
    name: 'Technical Architecture',
    description: 'System design, technology selection, and architecture planning',
    agents: ['architect', 'developer'],
    status: 'pending',
    progress: 0,
    documents: ['architecture-doc', 'tech-specs'],
    estimatedTime: '2-4 days'
  },
  {
    id: 'ux-design',
    name: 'UX/UI Design',
    description: 'User experience design, wireframes, and design system creation',
    agents: ['ux', 'pm'],
    status: 'pending',
    progress: 0,
    documents: ['ux-specs', 'design-system'],
    estimatedTime: '3-5 days'
  },
  {
    id: 'development-planning',
    name: 'Development Planning',
    description: 'Sprint planning, story creation, and development roadmap',
    agents: ['scrum', 'developer', 'architect'],
    status: 'pending',
    progress: 0,
    documents: ['user-stories', 'sprint-plan'],
    estimatedTime: '1-2 days'
  },
  {
    id: 'implementation',
    name: 'Implementation',
    description: 'Code development, feature implementation, and integration',
    agents: ['developer', 'qa', 'scrum'],
    status: 'pending',
    progress: 0,
    documents: ['code-docs', 'implementation-notes'],
    estimatedTime: '2-4 weeks'
  },
  {
    id: 'testing',
    name: 'Testing & QA',
    description: 'Quality assurance, testing, and bug resolution',
    agents: ['qa', 'developer'],
    status: 'pending',
    progress: 0,
    documents: ['test-plan', 'qa-report'],
    estimatedTime: '1-2 weeks'
  },
  {
    id: 'deployment',
    name: 'Deployment & Launch',
    description: 'Production deployment, monitoring setup, and launch preparation',
    agents: ['developer', 'architect'],
    status: 'pending',
    progress: 0,
    documents: ['deployment-guide', 'monitoring-setup'],
    estimatedTime: '3-5 days'
  }
];

export const getPhaseById = (id: string): WorkflowPhase | undefined => {
  return workflowPhases.find(phase => phase.id === id);
};

export const getNextPhase = (currentPhaseId: string): WorkflowPhase | undefined => {
  const currentIndex = workflowPhases.findIndex(phase => phase.id === currentPhaseId);
  if (currentIndex >= 0 && currentIndex < workflowPhases.length - 1) {
    return workflowPhases[currentIndex + 1];
  }
  return undefined;
};

export const getPreviousPhase = (currentPhaseId: string): WorkflowPhase | undefined => {
  const currentIndex = workflowPhases.findIndex(phase => phase.id === currentPhaseId);
  if (currentIndex > 0) {
    return workflowPhases[currentIndex - 1];
  }
  return undefined;
};