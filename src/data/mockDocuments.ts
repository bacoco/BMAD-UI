import { Document } from '../types/bmad';

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    type: 'prd',
    title: 'BMAD UI Builder - Product Requirements',
    content: '# Product Requirements Document\n\n## Overview\nThe BMAD UI Builder is a comprehensive visual development platform...',
    createdBy: 'product-manager',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    status: 'approved',
    version: 2,
    collaborators: ['business-analyst', 'architect']
  },
  {
    id: 'doc-2',
    type: 'architecture',
    title: 'System Architecture Design',
    content: '# System Architecture\n\n## Frontend Architecture\n- React with TypeScript\n- Vite for build tooling...',
    createdBy: 'architect',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-22'),
    status: 'review',
    version: 1,
    collaborators: ['developer']
  },
  {
    id: 'doc-3',
    type: 'story',
    title: 'User Story: Component Library',
    content: '# User Story: Component Library\n\nAs a developer, I want to drag and drop components...',
    createdBy: 'scrum-master',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    status: 'draft',
    version: 1,
    collaborators: ['ux-expert', 'developer']
  }
];
