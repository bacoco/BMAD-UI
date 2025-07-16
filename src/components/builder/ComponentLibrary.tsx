import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Palette, 
  Layout, 
  Type, 
  Image, 
  FileText,
  Navigation,
  Database,
  Activity,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComponentItem {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  code: string;
  preview: string;
  tags: string[];
}

interface ComponentLibraryProps {
  onComponentSelect: (component: ComponentItem) => void;
  onDragStart?: (component: ComponentItem) => void;
  className?: string;
}

const componentCategories = [
  { id: 'layout', name: 'Layout', icon: Layout },
  { id: 'typography', name: 'Typography', icon: Type },
  { id: 'forms', name: 'Forms', icon: FileText },
  { id: 'navigation', name: 'Navigation', icon: Navigation },
  { id: 'media', name: 'Media', icon: Image },
  { id: 'data', name: 'Data', icon: Database },
  { id: 'feedback', name: 'Feedback', icon: Activity },
  { id: 'advanced', name: 'Advanced', icon: Zap }
];

const components: ComponentItem[] = [
  // Layout Components
  {
    id: 'hero-section',
    name: 'Hero Section',
    category: 'layout',
    icon: Layout,
    description: 'Hero section with title, subtitle, and CTA button',
    tags: ['hero', 'landing', 'header'],
    preview: '🎯 Hero with CTA',
    code: `
const HeroSection = () => (
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
    <div className="container mx-auto text-center">
      <h1 className="text-5xl font-bold mb-4">Build Amazing Apps</h1>
      <p className="text-xl mb-8">With AI-powered development workflow</p>
      <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
        Get Started
      </button>
    </div>
  </div>
);
`
  },
  {
    id: 'card-grid',
    name: 'Card Grid',
    category: 'layout',
    icon: Layout,
    description: 'Responsive grid of cards',
    tags: ['grid', 'cards', 'responsive'],
    preview: '📱 Responsive Cards',
    code: `
const CardGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {[1,2,3].map(i => (
      <div key={i} className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-2">Card {i}</h3>
        <p className="text-gray-600">Card description content here.</p>
      </div>
    ))}
  </div>
);
`
  },
  
  // Typography Components
  {
    id: 'heading-stack',
    name: 'Heading Stack',
    category: 'typography',
    icon: Type,
    description: 'Hierarchical heading structure',
    tags: ['headings', 'typography', 'hierarchy'],
    preview: '📝 H1-H6 Stack',
    code: `
const HeadingStack = () => (
  <div className="space-y-4">
    <h1 className="text-4xl font-bold">Heading 1</h1>
    <h2 className="text-3xl font-semibold">Heading 2</h2>
    <h3 className="text-2xl font-medium">Heading 3</h3>
    <h4 className="text-xl">Heading 4</h4>
    <h5 className="text-lg">Heading 5</h5>
    <h6 className="text-base">Heading 6</h6>
  </div>
);
`
  },
  
  // Form Components
  {
    id: 'contact-form',
    name: 'Contact Form',
    category: 'forms',
    icon: FileText,
    description: 'Complete contact form with validation',
    tags: ['form', 'contact', 'validation'],
    preview: '📋 Contact Form',
    code: `
const ContactForm = () => (
  <form className="max-w-md mx-auto space-y-4">
    <div>
      <label className="block text-sm font-medium mb-1">Name</label>
      <input type="text" className="w-full px-3 py-2 border rounded-lg" />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Email</label>
      <input type="email" className="w-full px-3 py-2 border rounded-lg" />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Message</label>
      <textarea className="w-full px-3 py-2 border rounded-lg h-24"></textarea>
    </div>
    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
      Send Message
    </button>
  </form>
);
`
  },
  
  // Navigation Components
  {
    id: 'navbar',
    name: 'Navigation Bar',
    category: 'navigation',
    icon: Navigation,
    description: 'Responsive navigation with menu',
    tags: ['nav', 'menu', 'header'],
    preview: '🧭 Responsive Nav',
    code: `
const Navbar = () => (
  <nav className="bg-white shadow-lg">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center py-4">
        <div className="text-xl font-bold">Logo</div>
        <div className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">About</a>
          <a href="#" className="hover:text-blue-600">Contact</a>
        </div>
      </div>
    </div>
  </nav>
);
`
  }
];

export function ComponentLibrary({ onComponentSelect, onDragStart, className }: ComponentLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (e: React.DragEvent, component: ComponentItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    onDragStart?.(component);
  };

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Component Library</h2>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="grid grid-cols-4 gap-1 h-auto p-1">
            <TabsTrigger value="all" className="text-xs p-2">All</TabsTrigger>
            <TabsTrigger value="layout" className="text-xs p-2">Layout</TabsTrigger>
            <TabsTrigger value="forms" className="text-xs p-2">Forms</TabsTrigger>
            <TabsTrigger value="navigation" className="text-xs p-2">Nav</TabsTrigger>
          </TabsList>
        </div>

        {/* Component List */}
        <TabsContent value={selectedCategory} className="flex-1 mt-4">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {filteredComponents.map((component) => (
                <div
                  key={component.id}
                  className="group border border-border rounded-lg p-3 hover:border-primary/50 transition-colors cursor-move"
                  draggable
                  onDragStart={(e) => handleDragStart(e, component)}
                  onClick={() => onComponentSelect(component)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                      <component.icon className="h-4 w-4 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm truncate">{component.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {component.category}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {component.description}
                      </p>
                      
                      <div className="text-xs bg-muted/50 rounded p-2 font-mono">
                        {component.preview}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {component.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredComponents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Palette className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No components found</p>
                  <p className="text-xs">Try adjusting your search or category</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}