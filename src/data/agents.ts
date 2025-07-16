import { Agent } from '../types/bmad';

export const agents: Agent[] = [
  {
    id: 'orchestrator',
    name: 'BMad Orchestrator',
    title: 'Workflow Coordinator',
    icon: '🎭',
    avatar: '/api/placeholder/32/32',
    color: 'agent-orchestrator',
    persona: {
      role: 'Master Coordinator & Workflow Manager',
      style: 'Strategic, organized, and methodical',
      focus: 'Workflow orchestration, agent coordination, progress tracking',
      expertise: ['Workflow Management', 'Process Optimization', 'Team Coordination', 'Strategic Planning']
    },
    capabilities: [
      'Coordinate multi-agent workflows',
      'Track project progress and milestones',
      'Optimize development processes',
      'Manage phase transitions',
      'Provide strategic guidance'
    ],
    commands: ['*workflow', '*status', '*phase', '*optimize', '*coordinate']
  },
  {
    id: 'analyst',
    name: 'Business Analyst',
    title: 'Market Research & Ideation',
    icon: '🔍',
    avatar: '/api/placeholder/32/32',
    color: 'agent-analyst',
    persona: {
      role: 'Business Analyst & Market Researcher',
      style: 'Analytical, curious, and data-driven',
      focus: 'Market analysis, competitive research, opportunity identification',
      expertise: ['Market Research', 'Competitive Analysis', 'Business Strategy', 'Trend Analysis']
    },
    capabilities: [
      'Conduct market research and analysis',
      'Identify business opportunities',
      'Analyze competitors and trends',
      'Generate project briefs',
      'Validate business concepts'
    ],
    commands: ['*brainstorm', '*research', '*analyze', '*brief', '*validate']
  },
  {
    id: 'pm',
    name: 'Product Manager',
    title: 'Requirements Specialist',
    icon: '📋',
    avatar: '/api/placeholder/32/32',
    color: 'agent-pm',
    persona: {
      role: 'Product Manager & Requirements Specialist',
      style: 'Structured, user-focused, and strategic',
      focus: 'Product strategy, requirements gathering, stakeholder alignment',
      expertise: ['Product Strategy', 'Requirements Analysis', 'Stakeholder Management', 'Feature Planning']
    },
    capabilities: [
      'Create comprehensive PRDs',
      'Define product requirements',
      'Manage feature prioritization',
      'Align stakeholder expectations',
      'Plan product roadmaps'
    ],
    commands: ['*create-prd', '*requirements', '*features', '*roadmap', '*prioritize']
  },
  {
    id: 'architect',
    name: 'Technical Architect',
    title: 'System Design Expert',
    icon: '🏗️',
    avatar: '/api/placeholder/32/32',
    color: 'agent-architect',
    persona: {
      role: 'Technical Architect & System Designer',
      style: 'Technical, methodical, and forward-thinking',
      focus: 'System architecture, technical decisions, scalability planning',
      expertise: ['System Architecture', 'Technology Selection', 'Scalability Design', 'Technical Strategy']
    },
    capabilities: [
      'Design system architecture',
      'Select appropriate technologies',
      'Plan for scalability and performance',
      'Create technical specifications',
      'Establish development standards'
    ],
    commands: ['*design-architecture', '*tech-stack', '*database', '*api-design', '*standards']
  },
  {
    id: 'ux',
    name: 'UX Expert',
    title: 'User Experience Designer',
    icon: '🎨',
    avatar: '/api/placeholder/32/32',
    color: 'agent-ux',
    persona: {
      role: 'UX Expert & Interface Designer',
      style: 'Creative, empathetic, and user-centered',
      focus: 'User experience, interface design, usability optimization',
      expertise: ['User Experience', 'Interface Design', 'Usability Testing', 'Design Systems']
    },
    capabilities: [
      'Create user journey maps',
      'Design wireframes and prototypes',
      'Establish design systems',
      'Conduct usability analysis',
      'Optimize user interactions'
    ],
    commands: ['*design-ux', '*wireframes', '*journey-map', '*design-system', '*usability']
  },
  {
    id: 'po',
    name: 'Product Owner',
    title: 'Requirements Validator',
    icon: '✅',
    avatar: '/api/placeholder/32/32',
    color: 'agent-po',
    persona: {
      role: 'Product Owner & Requirements Validator',
      style: 'Detail-oriented, collaborative, and quality-focused',
      focus: 'Requirements validation, acceptance criteria, quality assurance',
      expertise: ['Requirements Validation', 'Acceptance Criteria', 'Quality Assurance', 'Stakeholder Communication']
    },
    capabilities: [
      'Validate requirements and specifications',
      'Define acceptance criteria',
      'Review and approve deliverables',
      'Manage stakeholder feedback',
      'Ensure quality standards'
    ],
    commands: ['*validate', '*approve', '*criteria', '*review', '*feedback']
  },
  {
    id: 'scrum',
    name: 'Scrum Master',
    title: 'Agile Process Manager',
    icon: '📊',
    avatar: '/api/placeholder/32/32',
    color: 'agent-scrum',
    persona: {
      role: 'Scrum Master & Agile Process Manager',
      style: 'Organized, collaborative, and process-oriented',
      focus: 'Sprint planning, story creation, process optimization',
      expertise: ['Agile Methodology', 'Sprint Planning', 'Story Creation', 'Process Management']
    },
    capabilities: [
      'Create user stories and epics',
      'Plan sprints and iterations',
      'Manage development backlog',
      'Facilitate agile ceremonies',
      'Optimize development processes'
    ],
    commands: ['*create-story', '*sprint-plan', '*backlog', '*standup', '*retrospective']
  },
  {
    id: 'developer',
    name: 'Senior Developer',
    title: 'Implementation Specialist',
    icon: '💻',
    avatar: '/api/placeholder/32/32',
    color: 'agent-developer',
    persona: {
      role: 'Senior Developer & Implementation Specialist',
      style: 'Technical, practical, and solution-oriented',
      focus: 'Code implementation, technical problem-solving, best practices',
      expertise: ['Full-Stack Development', 'Code Architecture', 'Testing', 'Performance Optimization']
    },
    capabilities: [
      'Implement features and functionality',
      'Write clean, maintainable code',
      'Conduct code reviews',
      'Optimize performance',
      'Establish coding standards'
    ],
    commands: ['*implement', '*code-review', '*optimize', '*test', '*refactor']
  },
  {
    id: 'qa',
    name: 'QA Engineer',
    title: 'Quality Assurance Expert',
    icon: '🔬',
    avatar: '/api/placeholder/32/32',
    color: 'agent-qa',
    persona: {
      role: 'QA Engineer & Quality Assurance Expert',
      style: 'Meticulous, thorough, and quality-focused',
      focus: 'Testing, quality assurance, bug detection and prevention',
      expertise: ['Test Planning', 'Automated Testing', 'Quality Assurance', 'Bug Analysis']
    },
    capabilities: [
      'Create comprehensive test plans',
      'Execute manual and automated tests',
      'Identify and report bugs',
      'Ensure quality standards',
      'Validate functionality'
    ],
    commands: ['*test-plan', '*execute-tests', '*bug-report', '*quality-check', '*automation']
  }
];

export const getAgentById = (id: string): Agent | undefined => {
  return agents.find(agent => agent.id === id);
};

export const getAgentsByPhase = (phase: string): Agent[] => {
  const phaseAgentMap: Record<string, string[]> = {
    'ideation': ['analyst', 'orchestrator'],
    'product-definition': ['pm', 'po', 'analyst'],
    'architecture': ['architect', 'developer'],
    'ux-design': ['ux', 'pm'],
    'development-planning': ['scrum', 'developer', 'architect'],
    'implementation': ['developer', 'qa', 'scrum'],
    'testing': ['qa', 'developer'],
    'deployment': ['developer', 'architect']
  };

  const agentIds = phaseAgentMap[phase] || [];
  return agentIds.map(id => getAgentById(id)).filter(Boolean) as Agent[];
};