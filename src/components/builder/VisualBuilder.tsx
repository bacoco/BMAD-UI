import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComponentLibrary } from "./ComponentLibrary";
import { DropZone } from "./DropZone";
import { LivePreview } from "../preview/LivePreview";
import { Palette, Layout, Eye, Code, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface DroppedComponent {
  id: string;
  name: string;
  code: string;
  position: { x: number; y: number };
}

interface VisualBuilderProps {
  onCodeGeneration?: (code: string) => void;
  className?: string;
}

export function VisualBuilder({ onCodeGeneration, className }: VisualBuilderProps) {
  const [droppedComponents, setDroppedComponents] = useState<DroppedComponent[]>([]);
  const [activeTab, setActiveTab] = useState('design');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleComponentDrop = (component: any, position: { x: number; y: number }) => {
    const newComponent: DroppedComponent = {
      id: `${component.id}-${Date.now()}`,
      name: component.name,
      code: component.code,
      position
    };
    
    setDroppedComponents(prev => [...prev, newComponent]);
    regenerateCode([...droppedComponents, newComponent]);
  };

  const handleComponentEdit = (componentId: string) => {
    // TODO: Open component edit dialog
    console.log('Edit component:', componentId);
  };

  const handleComponentDelete = (componentId: string) => {
    const updatedComponents = droppedComponents.filter(comp => comp.id !== componentId);
    setDroppedComponents(updatedComponents);
    regenerateCode(updatedComponents);
  };

  const handleComponentDuplicate = (componentId: string) => {
    const component = droppedComponents.find(comp => comp.id === componentId);
    if (component) {
      const duplicated: DroppedComponent = {
        ...component,
        id: `${component.id}-copy-${Date.now()}`,
        position: {
          x: component.position.x + 20,
          y: component.position.y + 20
        }
      };
      
      const updatedComponents = [...droppedComponents, duplicated];
      setDroppedComponents(updatedComponents);
      regenerateCode(updatedComponents);
    }
  };

  const regenerateCode = (components: DroppedComponent[]) => {
    if (components.length === 0) {
      setGeneratedCode('');
      onCodeGeneration?.('');
      return;
    }

    // Generate complete app code from components
    const componentCode = components.map(comp => comp.code).join('\n\n');
    
    const fullAppCode = `
const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      ${components.map((comp, index) => `
      <div key="${comp.id}" className="relative">
        ${comp.code.replace('const ', `const Component${index} = `).replace(/;\s*$/, '')}
        <Component${index} />
      </div>`).join('\n')}
    </div>
  );
};
`;

    setGeneratedCode(fullAppCode);
    onCodeGeneration?.(fullAppCode);
  };

  return (
    <div className={cn("h-full flex gap-6", className)}>
      {/* Left Panel - Component Library */}
      <div className="w-80">
        <ComponentLibrary
          onComponentSelect={(component) => {
            // Auto-place component in center when selected
            handleComponentDrop(component, { x: 100, y: 100 });
          }}
          onDragStart={(component) => {
            console.log('Drag started:', component.name);
          }}
        />
      </div>

      {/* Center Panel - Design Canvas & Preview */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Design
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="flex-1 mt-6">
            <DropZone
              droppedComponents={droppedComponents}
              onComponentDrop={handleComponentDrop}
              onComponentEdit={handleComponentEdit}
              onComponentDelete={handleComponentDelete}
              onComponentDuplicate={handleComponentDuplicate}
              className="h-full"
            />
          </TabsContent>

          <TabsContent value="preview" className="flex-1 mt-6">
            <LivePreview
              generatedCode={generatedCode}
              isBuilding={false}
              buildErrors={[]}
              onRefresh={() => regenerateCode(droppedComponents)}
              onOpenExternal={() => {}}
              className="h-full"
            />
          </TabsContent>

          <TabsContent value="code" className="flex-1 mt-6">
            <Card className="h-full p-4">
              <div className="h-full bg-muted/30 rounded-lg p-4 font-mono text-sm overflow-auto">
                <pre className="whitespace-pre-wrap">
                  {generatedCode || '// No components added yet\n// Drag components from the library to generate code'}
                </pre>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Panel - Properties */}
      <div className="w-64">
        <Card className="h-full p-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Properties</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Components</label>
              <p className="text-sm text-muted-foreground">
                {droppedComponents.length} component(s) added
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium">App Settings</label>
              <div className="mt-2 space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Palette className="h-4 w-4 mr-2" />
                  Theme Settings
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Layout className="h-4 w-4 mr-2" />
                  Layout Options
                </Button>
              </div>
            </div>

            {droppedComponents.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Quick Actions</label>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setDroppedComponents([])}
                  >
                    Clear All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => regenerateCode(droppedComponents)}
                  >
                    Regenerate Code
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}