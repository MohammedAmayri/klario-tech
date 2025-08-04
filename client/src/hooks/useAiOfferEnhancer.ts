
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface MessageGenerationRequest {
  idea: string;
  tone: string;
  channel: string;
}

export interface MessageVariant {
  id: string;
  content: string;
  tone: string;
  channel: string;
}

export const useAiOfferEnhancer = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateMessages = async ({ idea, tone, channel }: MessageGenerationRequest): Promise<MessageVariant[]> => {
    if (!idea.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your message idea first.",
        variant: "destructive",
      });
      return [];
    }

    setIsGenerating(true);
    
    try {
      // Mock API call for now - replace with actual OpenAI integration
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      // Mock variants based on inputs
      const mockVariants: MessageVariant[] = [
        {
          id: '1',
          content: generateMockMessage(idea, tone, channel, 'variant1'),
          tone,
          channel
        },
        {
          id: '2', 
          content: generateMockMessage(idea, tone, channel, 'variant2'),
          tone,
          channel
        },
        {
          id: '3',
          content: generateMockMessage(idea, tone, channel, 'variant3'),  
          tone,
          channel
        }
      ];

      console.log('Generated message variants:', mockVariants);
      
      toast({
        title: "Messages Generated",
        description: "AI has created 3 message variants for you.",
      });

      return mockVariants;
    } catch (error) {
      console.error('Error generating messages:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate messages. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateMessages, isGenerating };
};

// Mock message generator - replace with actual OpenAI integration
const generateMockMessage = (idea: string, tone: string, channel: string, variant: string): string => {
  const baseTemplates = {
    casual: {
      sms: "Hey {customer_name}! 👋 " + idea + " Tap here to claim it!",
      email: "Hi {customer_name}, hope you're doing well! We've got something special: " + idea,
      whatsapp: "Hey there {customer_name}! 🎉 " + idea + " What do you think?"
    },
    formal: {
      sms: "Dear {customer_name}, " + idea + " Please reply to accept this offer.",
      email: "Dear {customer_name}, We are pleased to present: " + idea + " Kind regards, {business_name}",
      whatsapp: "Good day {customer_name}. " + idea + " Please let us know if interested."
    },
    urgent: {
      sms: "🚨 {customer_name}, LIMITED TIME: " + idea + " Expires soon!",
      email: "URGENT: {customer_name}, " + idea + " - Don't miss out!",
      whatsapp: "⏰ URGENT {customer_name}! " + idea + " Limited availability!"
    },
    friendly: {
      sms: "Hi {customer_name}! 😊 " + idea + " Hope to see you soon!",
      email: "Hello {customer_name}! We miss you and wanted to share: " + idea,
      whatsapp: "Hello {customer_name}! 🤗 " + idea + " Looking forward to hearing from you!"
    }
  };

  const template = baseTemplates[tone as keyof typeof baseTemplates]?.[channel as keyof typeof baseTemplates.casual] || idea;
  
  // Add variation based on variant type
  if (variant === 'variant2') {
    return template + " 💫";
  } else if (variant === 'variant3') {
    return template.replace(/[!]/g, '.') + " Thank you!";
  }
  
  return template;
};
