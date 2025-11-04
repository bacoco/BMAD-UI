import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload, Link, FileCode, Sparkles, Copy, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { VALIDATION, ERROR_MESSAGES } from "@/config/constants";
import { useToast } from "@/hooks/use-toast";

interface HTMLSample {
  id: string;
  title: string;
  code: string;
  preview: string;
}

interface VisualBuilderProps {
  onCodeGeneration?: (code: string) => void;
  className?: string;
}

export function VisualBuilder({ onCodeGeneration, className }: VisualBuilderProps) {
  const [inputType, setInputType] = useState<'image' | 'url' | 'css'>('image');
  const [inputValue, setInputValue] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [htmlSamples, setHtmlSamples] = useState<HTMLSample[]>([]);
  const [selectedSample, setSelectedSample] = useState<HTMLSample | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const lastUploadTime = useRef<number>(0);
  const { toast } = useToast();

  /**
   * Validate image file content by checking magic bytes
   */
  const validateImageContent = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arr = new Uint8Array(e.target?.result as ArrayBuffer);

        // Check magic bytes for common image formats
        const signatures = {
          jpeg: [0xFF, 0xD8, 0xFF],
          png: [0x89, 0x50, 0x4E, 0x47],
          gif: [0x47, 0x49, 0x46],
          webp: [0x52, 0x49, 0x46, 0x46], // RIFF
          svg: [0x3C, 0x73, 0x76, 0x67], // <svg or
          svgAlt: [0x3C, 0x3F, 0x78, 0x6D], // <?xml
        };

        // Check if file matches any known image signature
        const isValid = Object.values(signatures).some(sig => {
          return sig.every((byte, index) => arr[index] === byte);
        });

        resolve(isValid);
      };
      reader.onerror = () => resolve(false);
      reader.readAsArrayBuffer(file.slice(0, 12)); // Read first 12 bytes
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Rate limiting check
    const now = Date.now();
    if (now - lastUploadTime.current < VALIDATION.RATE_LIMIT_DELAY) {
      setUploadError(ERROR_MESSAGES.UPLOAD_RATE_LIMIT);
      toast({
        title: "Too Fast",
        description: ERROR_MESSAGES.UPLOAD_RATE_LIMIT,
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!VALIDATION.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setUploadError(ERROR_MESSAGES.INVALID_FILE_TYPE);
      toast({
        title: "Invalid File Type",
        description: ERROR_MESSAGES.INVALID_FILE_TYPE,
        variant: "destructive",
      });
      event.target.value = ''; // Reset input
      return;
    }

    // Validate file size
    if (file.size > VALIDATION.MAX_FILE_SIZE) {
      setUploadError(ERROR_MESSAGES.FILE_TOO_LARGE);
      toast({
        title: "File Too Large",
        description: ERROR_MESSAGES.FILE_TOO_LARGE,
        variant: "destructive",
      });
      event.target.value = ''; // Reset input
      return;
    }

    // Validate actual file content (magic bytes check)
    const isValidContent = await validateImageContent(file);
    if (!isValidContent) {
      setUploadError(ERROR_MESSAGES.INVALID_IMAGE_CONTENT);
      toast({
        title: "Invalid Image",
        description: ERROR_MESSAGES.INVALID_IMAGE_CONTENT,
        variant: "destructive",
      });
      event.target.value = ''; // Reset input
      return;
    }

    setUploadError(null);
    lastUploadTime.current = now;

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setUploadedImage(result);
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      }
    };

    reader.onerror = () => {
      setUploadError(ERROR_MESSAGES.FILE_READ_ERROR);
      toast({
        title: "Upload Error",
        description: ERROR_MESSAGES.FILE_READ_ERROR,
        variant: "destructive",
      });
    };

    reader.readAsDataURL(file);
  };

  const generateHtmlSamples = async () => {
    setIsGenerating(true);
    
    // Mock HTML samples generation - in real app would call AI service
    const mockSamples: HTMLSample[] = [
      {
        id: '1',
        title: 'Modern Card Layout',
        code: `<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
  <div class="p-6">
    <h2 class="text-xl font-bold text-gray-800">Sample Design</h2>
    <p class="text-gray-600 mt-2">Clean and modern card design</p>
    <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Action</button>
  </div>
</div>`,
        preview: 'Modern card with shadow and rounded corners'
      },
      {
        id: '2', 
        title: 'Hero Section',
        code: `<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
  <div class="container mx-auto text-center">
    <h1 class="text-4xl font-bold mb-4">Welcome</h1>
    <p class="text-xl mb-8">Beautiful hero section design</p>
    <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold">Get Started</button>
  </div>
</div>`,
        preview: 'Gradient hero section with centered content'
      },
      {
        id: '3',
        title: 'Navigation Bar',
        code: `<nav class="bg-white shadow-lg">
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center py-4">
      <div class="font-bold text-xl">Brand</div>
      <div class="space-x-4">
        <a href="#" class="text-gray-600 hover:text-blue-600">Home</a>
        <a href="#" class="text-gray-600 hover:text-blue-600">About</a>
        <a href="#" class="text-gray-600 hover:text-blue-600">Contact</a>
      </div>
    </div>
  </div>
</nav>`,
        preview: 'Clean navigation with logo and menu items'
      },
      {
        id: '4',
        title: 'Feature Grid',
        code: `<div class="grid md:grid-cols-3 gap-6 p-6">
  <div class="text-center">
    <div class="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4"></div>
    <h3 class="font-semibold mb-2">Feature 1</h3>
    <p class="text-gray-600">Description of feature</p>
  </div>
  <div class="text-center">
    <div class="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4"></div>
    <h3 class="font-semibold mb-2">Feature 2</h3>
    <p class="text-gray-600">Description of feature</p>
  </div>
  <div class="text-center">
    <div class="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4"></div>
    <h3 class="font-semibold mb-2">Feature 3</h3>
    <p class="text-gray-600">Description of feature</p>
  </div>
</div>`,
        preview: 'Responsive grid layout for features'
      }
    ];

    setTimeout(() => {
      setHtmlSamples(mockSamples);
      setIsGenerating(false);
    }, 2000);
  };

  const selectSample = (sample: HTMLSample) => {
    setSelectedSample(sample);
    onCodeGeneration?.(sample.code);
    setChatMessages([{
      role: 'assistant',
      content: `I've selected the "${sample.title}" design. How would you like me to improve or modify it?`
    }]);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim() || !selectedSample) return;
    
    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
    
    // Mock AI response - in real app would call AI service
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: `I understand you want to modify the ${selectedSample.title}. I can help you adjust colors, layout, typography, and functionality. What specific changes would you like?`
      }]);
    }, 1000);
    
    setChatInput('');
  };

  return (
    <div className={cn("h-full flex gap-6", className)}>
      {/* Left Panel - Input Options */}
      <div className="w-80">
        <Card className="h-full p-4">
          <h3 className="font-semibold mb-4">Design Input</h3>
          
          <Tabs value={inputType} onValueChange={(value) => setInputType(value as 'image' | 'url' | 'css')} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="image" className="flex items-center gap-1">
                <Upload className="h-3 w-3" />
                Image
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-1">
                <Link className="h-3 w-3" />
                URL
              </TabsTrigger>
              <TabsTrigger value="css" className="flex items-center gap-1">
                <FileCode className="h-3 w-3" />
                CSS
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="image" className="mt-4">
              <div className="space-y-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                  aria-label="Upload image file"
                />
                {uploadError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                    {uploadError}
                  </div>
                )}
                {uploadedImage && (
                  <div className="border rounded-lg p-2">
                    <img src={uploadedImage} alt="Uploaded design preview" className="w-full h-32 object-cover rounded" />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="url" className="mt-4">
              <Input
                placeholder="Enter URL to extract design..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </TabsContent>
            
            <TabsContent value="css" className="mt-4">
              <Textarea
                placeholder="Paste CSS code..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="min-h-32"
              />
            </TabsContent>
          </Tabs>
          
          <Button 
            onClick={generateHtmlSamples}
            disabled={isGenerating || (!uploadedImage && !inputValue.trim())}
            className="w-full mt-4"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate 4 HTML Samples'}
          </Button>
        </Card>
      </div>

      {/* Center Panel - HTML Samples */}
      <div className="flex-1">
        <Card className="h-full p-4">
          <h3 className="font-semibold mb-4">Generated HTML Samples</h3>
          
          {isGenerating ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Sparkles className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Generating HTML samples...</p>
              </div>
            </div>
          ) : htmlSamples.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Upload an image, enter a URL, or paste CSS to generate HTML samples
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 h-full overflow-auto">
              {htmlSamples.map((sample) => (
                <Card 
                  key={sample.id}
                  className={cn(
                    "p-4 cursor-pointer transition-all hover:shadow-md",
                    selectedSample?.id === sample.id && "ring-2 ring-primary"
                  )}
                  onClick={() => selectSample(sample)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{sample.title}</h4>
                      <Button size="sm" variant="ghost" onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(sample.code);
                      }}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{sample.preview}</p>
                    <div className="bg-muted/30 rounded p-2 text-xs font-mono max-h-32 overflow-auto">
                      {sample.code.slice(0, 100)}...
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Right Panel - Improvement Chat */}
      <div className="w-80">
        <Card className="h-full p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Improve Design</h3>
          </div>
          
          {!selectedSample ? (
            <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
              Select an HTML sample to start improving it
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-3 overflow-auto mb-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-lg",
                      message.role === 'user' 
                        ? "bg-primary text-primary-foreground ml-4" 
                        : "bg-muted mr-4"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Textarea
                  placeholder="How would you like to improve this design?"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="min-h-16"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendChatMessage();
                    }
                  }}
                />
                <Button 
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim()}
                  className="w-full"
                  size="sm"
                >
                  Send Message
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}