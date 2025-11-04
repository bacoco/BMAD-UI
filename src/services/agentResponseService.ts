import { Agent } from "../types/bmad";

export function generateAgentResponse(userInput: string, agent: Agent, type: string): string {
  const isCommand = userInput.startsWith('*');

  if (isCommand) {
    return handleCommand(userInput, agent);
  } else {
    return generateContextualResponse(userInput, agent);
  }
}

function handleCommand(command: string, agent: Agent): string {
  const cmd = command.toLowerCase().trim();

  switch (cmd) {
    case '*help':
      return `## Available Commands for ${agent.name}

**General Commands:**
- *help - Show this help message
- *status - Check current project status
- *workflow - View workflow phases
- *agent [name] - Switch to different agent

**${agent.name} Specific Commands:**
${agent.commands.map(cmd => `- ${cmd} - ${getCommandDescription(cmd, agent)}`).join('\n')}

**Capabilities:**
${agent.capabilities.map(cap => `• ${cap}`).join('\n')}`;

    case '*status':
      return `## Project Status Report

**Current Phase:** Ideation & Research
**Active Agent:** ${agent.name}
**Progress:** 15% complete

**Recent Activity:**
- Project initialized
- ${agent.name} activated
- Waiting for user input to begin workflow

**Next Steps:**
1. Start with ideation and market research
2. Define project requirements
3. Create initial project brief`;

    case '*workflow':
      return `## BMAD Workflow Overview

**Phase 1: Ideation & Research** 🔍
- Market research and competitor analysis
- Initial concept development
- Agents: Business Analyst, Orchestrator

**Phase 2: Product Definition** 📋
- Create comprehensive PRD
- Define features and requirements
- Agents: Product Manager, Product Owner

**Phase 3: Technical Architecture** 🏗️
- System design and technology selection
- Architecture planning
- Agents: Technical Architect, Developer

**Phase 4: UX/UI Design** 🎨
- User experience design
- Wireframes and design systems
- Agents: UX Expert, Product Manager

**Phase 5: Development Planning** 📊
- Sprint planning and story creation
- Development roadmap
- Agents: Scrum Master, Developer

**Phase 6: Implementation** 💻
- Code development and integration
- Feature implementation
- Agents: Developer, QA Engineer

**Phase 7: Testing & QA** 🔬
- Quality assurance and testing
- Bug resolution
- Agents: QA Engineer, Developer

**Phase 8: Deployment** 🚀
- Production deployment
- Launch preparation
- Agents: Developer, Technical Architect`;

    default:
      if (agent.commands.includes(cmd.split(' ')[0])) {
        return generateSpecificCommandResponse(cmd, agent);
      }
      return `Unknown command: ${command}. Type *help to see available commands.`;
  }
}

function generateSpecificCommandResponse(command: string, agent: Agent): string {
  const baseCmd = command.split(' ')[0];

  switch (baseCmd) {
    case '*brainstorm':
      return `🔍 **Starting Brainstorming Session**

I'm ready to help you explore ideas and opportunities! Let's dive into:

1. **Market Analysis** - What industry or market are you targeting?
2. **Problem Identification** - What specific problems are you looking to solve?
3. **Competitive Landscape** - Who are the key players in this space?
4. **Innovation Opportunities** - Where can we create unique value?

What aspect would you like to explore first?`;

    case '*create-prd':
      return `📋 **PRD Creation Wizard**

I'll guide you through creating a comprehensive Product Requirements Document. Here's what we'll cover:

**1. Executive Summary**
- Product vision and objectives
- Key success metrics

**2. User Requirements**
- Target user personas
- User stories and use cases

**3. Functional Requirements**
- Core features and functionality
- Technical specifications

**4. Non-Functional Requirements**
- Performance, security, scalability

**5. Implementation Plan**
- Timeline and milestones
- Resource requirements

Ready to start? Tell me about your product vision.`;

    case '*design-architecture':
      return `🏗️ **Architecture Design Session**

Let's design a robust system architecture for your project. I'll help you with:

**1. System Overview**
- High-level architecture
- Component relationships

**2. Technology Stack**
- Frontend technologies
- Backend frameworks
- Database selection
- Infrastructure choices

**3. Data Architecture**
- Database schema design
- Data flow patterns
- API specifications

**4. Scalability & Performance**
- Load balancing strategies
- Caching mechanisms
- Performance optimization

What type of system are we building?`;

    default:
      return `Executing ${command} for ${agent.name}...`;
  }
}

function generateContextualResponse(input: string, agent: Agent): string {
  const responses: Record<string, string[]> = {
    'orchestrator': [
      "I'll help coordinate this workflow. Let me break this down into manageable phases and assign the right agents for each task.",
      "As the orchestrator, I can see how this fits into our overall development strategy. Let me outline the next steps.",
      "I'll coordinate with the appropriate agents to handle this request efficiently."
    ],
    'analyst': [
      "This is an interesting market opportunity. Let me analyze the competitive landscape and identify key differentiators.",
      "I can help research this space thoroughly. Let me gather some market data and competitor insights.",
      "From a business perspective, this has potential. Let me dive deeper into the market dynamics."
    ],
    'pm': [
      "I'll help translate this into clear product requirements. Let me break down the features and user stories.",
      "This aligns well with our product strategy. Let me create a detailed specification for this.",
      "I can help prioritize these features based on user impact and business value."
    ],
    'architect': [
      "I need to consider the technical implications here. Let me design an architecture that supports these requirements.",
      "From a technical standpoint, this will require careful system design. Let me outline the architectural approach.",
      "I'll ensure our technical foundation can scale to meet these needs."
    ],
    'ux': [
      "The user experience is crucial here. Let me design an intuitive interface that meets user needs.",
      "I'll focus on creating a seamless user journey. Let me map out the interaction flows.",
      "User-centered design is key. Let me ensure this provides real value to our users."
    ],
    'po': [
      "I need to validate these requirements against our acceptance criteria. Let me review this carefully.",
      "This needs to align with our business objectives. Let me ensure we're meeting stakeholder expectations.",
      "I'll help ensure this delivers the expected business value."
    ],
    'scrum': [
      "Let me break this down into manageable user stories and plan the implementation sprints.",
      "I'll help structure this work into actionable tasks with clear acceptance criteria.",
      "From an agile perspective, we can deliver this incrementally for faster feedback."
    ],
    'developer': [
      "I can implement this feature. Let me consider the technical approach and any dependencies.",
      "This is achievable with our current tech stack. Let me outline the implementation plan.",
      "I'll ensure clean, maintainable code that follows our development standards."
    ],
    'qa': [
      "I'll ensure this meets our quality standards. Let me define the testing strategy and acceptance criteria.",
      "Quality is paramount. I'll create comprehensive test cases to validate this functionality.",
      "I'll help identify potential edge cases and ensure robust testing coverage."
    ]
  };

  const agentResponses = responses[agent.id] || [
    "I understand your request. Let me help you with this.",
    "I'll work on this from my area of expertise.",
    "This is within my capabilities. Let me assist you."
  ];

  return agentResponses[Math.floor(Math.random() * agentResponses.length)];
}

function getCommandDescription(command: string, agent: Agent): string {
  const descriptions: Record<string, string> = {
    '*brainstorm': 'Start a brainstorming session',
    '*research': 'Conduct market research',
    '*create-prd': 'Generate a Product Requirements Document',
    '*design-architecture': 'Create system architecture',
    '*create-story': 'Generate user stories',
    '*implement': 'Start implementation',
    '*test': 'Execute testing procedures',
    '*optimize': 'Optimize workflows',
    '*coordinate': 'Coordinate team activities'
  };

  return descriptions[command] || 'Specialized command';
}
