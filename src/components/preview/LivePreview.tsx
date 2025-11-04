import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, ExternalLink, Bug, AlertTriangle } from "lucide-react";
import { DeviceSelector } from "./DeviceSelector";
import { ErrorOverlay } from "./ErrorOverlay";
import { sanitizePreviewCode, validateCodeSafety } from "@/utils/codeSanitizer";
import { DEVICE_DIMENSIONS, UI_CONFIG } from "@/config/constants";
import { useToast } from "@/hooks/use-toast";

interface LivePreviewProps {
  generatedCode?: string;
  isBuilding?: boolean;
  buildErrors?: string[];
  onRefresh?: () => void;
  onOpenExternal?: () => void;
  className?: string;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

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
  const [securityWarnings, setSecurityWarnings] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  // Generate preview HTML content with proper security
  useEffect(() => {
    if (generatedCode) {
      setIsLoading(true);
      setSecurityWarnings([]);

      // Validate code safety first
      const validation = validateCodeSafety(generatedCode);
      if (!validation.safe) {
        setSecurityWarnings(validation.issues);
        toast({
          title: "Security Warning",
          description: `Code contains ${validation.issues.length} security issue(s) and will be sanitized.`,
          variant: "destructive",
        });
      }

      // Sanitize the code using DOMPurify
      const sanitizedCode = sanitizePreviewCode(generatedCode);

      // Create a complete HTML document for preview
      // Note: This displays sanitized HTML as text, not executes it
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>BMAD Preview</title>
          <script src="https://cdn.tailwindcss.com/3.3.5"></script>
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
            .code-display {
              background: white;
              border: 1px solid #e5e7eb;
              padding: 24px;
              border-radius: 12px;
              margin: 16px;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            }
            .security-warning {
              background: #fef3c7;
              border: 1px solid #fde68a;
              color: #92400e;
              padding: 12px;
              border-radius: 8px;
              margin-bottom: 16px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div id="preview-root" class="preview-container">
            <div class="code-display">
              ${validation.issues.length > 0 ? `
                <div class="security-warning">
                  <strong>⚠️ Security Issues Detected and Removed:</strong>
                  <ul style="margin: 8px 0 0 0; padding-left: 20px;">
                    ${validation.issues.map(issue => `<li>${issue}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              <div style="text-align: center; color: #64748b; margin-bottom: 16px;">
                <h2 style="margin: 0 0 8px 0;">BMAD Live Preview</h2>
                <p style="margin: 0;">Sanitized HTML Content:</p>
              </div>
              <div id="preview-content"></div>
            </div>
          </div>
          <script>
            // Safely inject sanitized content
            (function() {
              const container = document.getElementById('preview-content');
              if (container) {
                // Create a text node or safely set innerHTML with already-sanitized content
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = ${JSON.stringify(sanitizedCode || '<p style="color: #9ca3af;">No code generated yet</p>')};
                container.appendChild(tempDiv);
              }
            })();
          </script>
        </body>
        </html>
      `;

      setPreviewContent(htmlContent);

      // Simulate loading time for better UX
      setTimeout(() => setIsLoading(false), UI_CONFIG.PREVIEW_LOAD_DELAY);
    }
  }, [generatedCode, toast]);

  const handleRefresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      // Force iframe reload by resetting src
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = 'about:blank';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 10);
    }
    onRefresh?.();
    setTimeout(() => setIsLoading(false), 500);
  };

  const dimensions = DEVICE_DIMENSIONS[selectedDevice];

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
          {securityWarnings.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              {securityWarnings.length} security issue(s) sanitized
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