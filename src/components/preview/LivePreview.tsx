import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, ExternalLink, Bug } from "lucide-react";
import { DeviceSelector } from "./DeviceSelector";
import { ErrorOverlay } from "./ErrorOverlay";

interface LivePreviewProps {
  generatedCode?: string;
  isBuilding?: boolean;
  buildErrors?: string[];
  onRefresh?: () => void;
  onOpenExternal?: () => void;
  className?: string;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const deviceDimensions = {
  desktop: { width: '100%', height: '100%' },
  tablet: { width: '768px', height: '1024px' },
  mobile: { width: '375px', height: '667px' }
};

export function LivePreview({ 
  generatedCode = '', 
  isBuilding = false, 
  buildErrors = [], 
  onRefresh,
  onOpenExternal,
  className = ''
}: LivePreviewProps) {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop');
  const [previewContent, setPreviewContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Generate preview HTML content
  useEffect(() => {
    if (generatedCode) {
      setIsLoading(true);
      
      // Create a complete HTML document for preview
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>BMAD Preview</title>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { 
              margin: 0; 
              padding: 16px; 
              font-family: system-ui, -apple-system, sans-serif;
              background-color: #f8fafc;
            }
            .preview-container {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .error-display {
              background: #fee2e2;
              border: 1px solid #fecaca;
              color: #dc2626;
              padding: 16px;
              border-radius: 8px;
              margin: 16px;
            }
          </style>
        </head>
        <body>
          <div id="preview-root" class="preview-container">
            <div style="text-align: center; color: #64748b;">
              <h2>BMAD Live Preview</h2>
              <p>Generated content will appear here...</p>
            </div>
          </div>
          
          <script type="text/babel">
            try {
              ${generatedCode || `
                const App = () => {
                  return (
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                      <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Welcome to BMAD
                      </h1>
                      <p className="text-gray-600 mb-4">
                        Your AI-driven development journey starts here.
                      </p>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                        Get Started
                      </button>
                    </div>
                  );
                };
              `}
              
              const root = ReactDOM.createRoot(document.getElementById('preview-root'));
              root.render(<App />);
            } catch (error) {
              document.getElementById('preview-root').innerHTML = 
                '<div class="error-display"><h3>Preview Error</h3><pre>' + 
                error.toString() + '</pre></div>';
            }
          </script>
        </body>
        </html>
      `;
      
      setPreviewContent(htmlContent);
      
      // Simulate loading time for better UX
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [generatedCode]);

  const handleRefresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
    onRefresh?.();
    setTimeout(() => setIsLoading(false), 500);
  };

  const dimensions = deviceDimensions[selectedDevice];

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-foreground">Live Preview</h3>
          {isBuilding && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Building...
            </div>
          )}
          {buildErrors.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <Bug className="h-4 w-4" />
              {buildErrors.length} error(s)
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <DeviceSelector 
            selectedDevice={selectedDevice} 
            onDeviceChange={setSelectedDevice} 
          />
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onOpenExternal}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/30">
        <div 
          className="relative bg-background border border-border rounded-lg shadow-lg overflow-hidden transition-all duration-300"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading preview...
              </div>
            </div>
          )}
          
          {buildErrors.length > 0 && (
            <ErrorOverlay errors={buildErrors} onDismiss={() => {}} />
          )}
          
          <iframe
            ref={iframeRef}
            srcDoc={previewContent}
            className="w-full h-full border-0"
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </Card>
  );
}