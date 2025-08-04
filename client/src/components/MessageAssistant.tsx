
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Check, Wand2, MessageSquare, Mail, Phone } from 'lucide-react';
import { useAiOfferEnhancer, MessageVariant } from '@/hooks/useAiOfferEnhancer';
import { useToast } from '@/hooks/use-toast';

interface MessageAssistantProps {
  onMessageSelect: (message: string) => void;
  initialIdea?: string;
  initialChannel?: string;
}

const MessageAssistant = ({ onMessageSelect, initialIdea = "", initialChannel = "sms" }: MessageAssistantProps) => {
  const [idea, setIdea] = useState(initialIdea);
  const [tone, setTone] = useState("friendly");
  const [channel, setChannel] = useState(initialChannel);
  const [variants, setVariants] = useState<MessageVariant[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const { generateMessages, isGenerating } = useAiOfferEnhancer();
  const { toast } = useToast();

  const handleGenerate = async () => {
    const newVariants = await generateMessages({ idea, tone, channel });
    setVariants(newVariants);
  };

  const handleCopyMessage = async (message: string, id: string) => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const handleUseMessage = (message: string) => {
    onMessageSelect(message);
    toast({
      title: "Message Selected",
      description: "The AI-generated message has been added to your campaign.",
    });
  };

  const getChannelIcon = (channelType: string) => {
    switch (channelType) {
      case "email":
        return <Mail className="w-4 h-4" />;
      case "sms":
        return <Phone className="w-4 h-4" />;
      case "whatsapp":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span>AI Message Assistant</span>
        </CardTitle>
        <CardDescription>
          Let AI help you craft engaging messages for your customers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="message-idea">Your Message Idea *</Label>
            <Textarea
              id="message-idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g., 20% off all services this weekend only"
              className="mt-1 min-h-20"
            />
            <p className="text-xs text-gray-500 mt-1">
              Describe your offer, promotion, or message goal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tone-select">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="channel-select">Channel</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>SMS</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="whatsapp">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !idea.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Messages...</span>
              </div>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate AI Messages
              </>
            )}
          </Button>
        </div>

        {/* Generated Variants */}
        {variants.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">Generated Messages</h3>
              <Badge variant="secondary">{variants.length} variants</Badge>
            </div>
            
            <div className="space-y-3">
              {variants.map((variant, index) => (
                <Card key={variant.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            Variant {index + 1}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            {getChannelIcon(variant.channel)}
                            <span className="capitalize">{variant.tone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm">{variant.content}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyMessage(variant.content, variant.id)}
                          className="flex-1"
                        >
                          {copiedId === variant.id ? (
                            <>
                              <Check className="w-4 h-4 mr-2 text-green-600" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleUseMessage(variant.content)}
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                          Use This Message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-md">
              💡 <strong>Tip:</strong> Use placeholders like {"{customer_name}"}, {"{business_name}"} for personalization
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageAssistant;
