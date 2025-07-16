import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Layers, 
  Users, 
  Target, 
  Palette, 
  Code,
  Plus
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: React.ComponentType<{ className?: string }>;
  content: string;
  tags: string[];
}

interface TemplateLibraryProps {
  onTemplateSelect: (templateId: string) => void;
}

const templates: Template[] = [
  {
    id: 'prd-template',
    name: 'Product Requirements Document',
    description: 'Comprehensive PRD template with all essential sections',
    type: 'prd',
    icon: Target,
    tags: ['product', 'requirements', 'planning'],
    content: `# Product Requirements Document

## Executive Summary
Brief overview of the product and its objectives.

## Product Overview
### Vision Statement
What is the long-term vision for this product?

### Objectives
- Primary objective 1
- Primary objective 2
- Primary objective 3

## User Requirements
### Target Users
Who are the primary users of this product?

### User Personas
- Persona 1: Description
- Persona 2: Description

### User Stories
- As a [user type], I want [goal] so that [benefit]

## Functional Requirements
### Core Features
1. Feature 1: Description
2. Feature 2: Description
3. Feature 3: Description

### Feature Specifications
Detailed specifications for each feature.

## Non-Functional Requirements
- Performance requirements
- Security requirements
- Scalability requirements
- Accessibility requirements

## Success Metrics
How will we measure the success of this product?

## Timeline and Milestones
Key milestones and delivery dates.

## Resources Required
Team members, tools, and other resources needed.

## Risk Assessment
Potential risks and mitigation strategies.`
  },
  {
    id: 'architecture-template',
    name: 'System Architecture Document',
    description: 'Technical architecture template for system design',
    type: 'architecture',
    icon: Layers,
    tags: ['architecture', 'technical', 'design'],
    content: `# System Architecture Document

## Overview
High-level overview of the system architecture.

## Architecture Goals
- Scalability
- Performance
- Security
- Maintainability

## System Components
### Frontend
- Technology stack
- Component architecture
- State management

### Backend
- API architecture
- Database design
- Service layer

### Infrastructure
- Deployment architecture
- Monitoring and logging
- Security considerations

## Data Flow
Description of how data flows through the system.

## API Specifications
### Endpoints
- GET /api/endpoint1
- POST /api/endpoint2

### Authentication
How authentication is handled.

## Database Schema
### Tables
- Table 1: Description
- Table 2: Description

### Relationships
How tables relate to each other.

## Security Considerations
- Authentication and authorization
- Data encryption
- API security

## Performance Considerations
- Caching strategies
- Load balancing
- Database optimization

## Monitoring and Logging
- Application monitoring
- Error tracking
- Performance metrics

## Deployment
- Environment setup
- CI/CD pipeline
- Rollback strategies`
  },
  {
    id: 'user-story-template',
    name: 'User Story Template',
    description: 'Standard user story format with acceptance criteria',
    type: 'story',
    icon: Users,
    tags: ['agile', 'story', 'development'],
    content: `# User Story: [Feature Name]

## Story Description
As a [user type],
I want [goal/desire]
So that [benefit/value]

## Acceptance Criteria
### Scenario 1: [Scenario Name]
- Given [context]
- When [action]
- Then [outcome]

### Scenario 2: [Scenario Name]
- Given [context]
- When [action]
- Then [outcome]

## Definition of Done
- [ ] Feature is implemented
- [ ] Unit tests are written
- [ ] Integration tests pass
- [ ] Code review is completed
- [ ] Documentation is updated
- [ ] Feature is tested in staging
- [ ] Stakeholder approval received

## Technical Notes
Any technical considerations or constraints.

## Dependencies
- Dependency 1
- Dependency 2

## Estimate
Story points or time estimate.

## Priority
High/Medium/Low

## Tags
#tag1 #tag2 #tag3`
  },
  {
    id: 'project-brief-template',
    name: 'Project Brief',
    description: 'Initial project overview and planning document',
    type: 'brief',
    icon: FileText,
    tags: ['project', 'planning', 'overview'],
    content: `# Project Brief: [Project Name]

## Project Overview
Brief description of the project and its purpose.

## Background
Why is this project needed? What problem does it solve?

## Objectives
### Primary Objectives
- Objective 1
- Objective 2

### Secondary Objectives
- Objective 1
- Objective 2

## Scope
### In Scope
What is included in this project?

### Out of Scope
What is explicitly not included?

## Stakeholders
- Project sponsor
- Product owner
- Development team
- End users

## Success Criteria
How will we know the project is successful?

## Timeline
- Project start date
- Key milestones
- Target completion date

## Budget and Resources
- Budget allocation
- Team members required
- Tools and technology needed

## Risks and Assumptions
### Risks
- Risk 1: Description and mitigation
- Risk 2: Description and mitigation

### Assumptions
- Assumption 1
- Assumption 2

## Next Steps
Immediate actions to get the project started.`
  },
  {
    id: 'ux-spec-template',
    name: 'UX Specification',
    description: 'User experience design specification document',
    type: 'ux-spec',
    icon: Palette,
    tags: ['ux', 'design', 'specification'],
    content: `# UX Specification: [Feature/Product Name]

## Overview
Brief description of the user experience being designed.

## User Research
### User Personas
- Primary persona: Description
- Secondary persona: Description

### User Needs
- Need 1: Description
- Need 2: Description

## User Journey
### Current User Journey
How users currently accomplish their goals.

### Proposed User Journey
How the new experience will work.

## Design Principles
- Principle 1: Description
- Principle 2: Description

## Information Architecture
### Site Map
High-level structure of the application.

### Navigation
How users will navigate through the experience.

## Wireframes
### Key Screens
- Screen 1: Description
- Screen 2: Description

## Interaction Design
### User Flows
Step-by-step flows for key user actions.

### Micro-interactions
Small interactions that enhance the user experience.

## Visual Design
### Style Guide
- Color palette
- Typography
- Spacing and layout

### Component Library
Reusable UI components.

## Accessibility
- Accessibility standards to follow
- Specific accessibility considerations

## Responsive Design
How the design adapts to different screen sizes.

## Usability Testing
Plans for testing the user experience.

## Success Metrics
How we'll measure the success of the UX design.`
  }
];

export function TemplateLibrary({ onTemplateSelect }: TemplateLibraryProps) {
  return (
    <div className="h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Document Templates</h2>
        <p className="text-sm text-muted-foreground">
          Choose a template to start creating your document
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <template.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => onTemplateSelect(template.id)}
                className="w-full"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Use Template
              </Button>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}