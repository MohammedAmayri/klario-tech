import OpenAI from "openai";
import { Campaign, Customer } from '@shared/schema';

export interface CampaignGenerationRequest {
  businessName: string;
  businessType: string;
  campaignType: 'email' | 'sms' | 'whatsapp';
  campaignGoal: 'promotion' | 'welcome' | 'retention' | 'announcement' | 'survey';
  targetAudience?: string;
  productService?: string;
  tone?: 'professional' | 'friendly' | 'casual' | 'urgent' | 'formal';
  keyMessage?: string;
  callToAction?: string;
  maxLength?: number;
}

export interface CampaignEnhancementRequest {
  originalMessage: string;
  campaignType: 'email' | 'sms' | 'whatsapp';
  improvements: ('tone' | 'clarity' | 'engagement' | 'cta' | 'personalization' | 'length')[];
  businessName: string;
  targetAudience?: string;
}

export interface AIGeneratedCampaign {
  subject?: string;
  message: string;
  suggestions: string[];
  wordCount: number;
  estimatedEngagement: 'low' | 'medium' | 'high';
}

export class AICampaignService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    this.openai = new OpenAI({ apiKey });
  }

  async generateCampaign(request: CampaignGenerationRequest): Promise<AIGeneratedCampaign> {
    try {
      const prompt = this.buildGenerationPrompt(request);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert marketing campaign writer specializing in multi-channel customer engagement. Create compelling, conversion-focused content that resonates with target audiences."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1000,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        subject: result.subject,
        message: result.message,
        suggestions: result.suggestions || [],
        wordCount: result.message?.split(' ').length || 0,
        estimatedEngagement: result.estimatedEngagement || 'medium',
      };
    } catch (error) {
      console.error('AI Campaign Generation Error:', error);
      throw new Error('Failed to generate campaign content');
    }
  }

  async enhanceCampaign(request: CampaignEnhancementRequest): Promise<AIGeneratedCampaign> {
    try {
      const prompt = this.buildEnhancementPrompt(request);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert multilingual marketing copy editor. Analyze and improve marketing campaigns to maximize engagement and conversion rates. CRITICAL: Always respond in the SAME LANGUAGE as the input text. Detect the language of the original message and maintain it throughout your enhancement. If the input is in Swedish, respond in Swedish. If in English, respond in English. Never change the language."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.6,
        max_tokens: 1000,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        subject: result.subject,
        message: result.enhanced_message,
        suggestions: result.improvement_suggestions || [],
        wordCount: result.enhanced_message?.split(' ').length || 0,
        estimatedEngagement: result.estimatedEngagement || 'medium',
      };
    } catch (error) {
      console.error('AI Campaign Enhancement Error:', error);
      throw new Error('Failed to enhance campaign content');
    }
  }

  async personalizeCampaignForCustomer(campaign: Campaign, customer: Customer, businessName: string): Promise<string> {
    try {
      const prompt = `
        Personalize this campaign message for a specific customer:
        
        Business: ${businessName}
        Campaign: ${campaign.message}
        Customer Name: ${customer.name}
        Customer Info: ${customer.email ? `Email: ${customer.email}` : ''} ${customer.phone ? `Phone: ${customer.phone}` : ''}
        Customer Tags: ${customer.tags?.join(', ') || 'None'}
        
        Create a personalized version that:
        1. Uses the customer's name naturally  
        2. References relevant customer information if appropriate
        3. Maintains the original message's intent and call-to-action
        4. Keeps the same tone and style
        5. ${campaign.type === 'sms' ? 'Stays under 160 characters for SMS' : 'Maintains appropriate length'}
        
        Return only the personalized message text, no additional formatting.
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a personalization expert. Create natural, personalized marketing messages that feel genuine and relevant to each customer."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 300,
      });

      return response.choices[0].message.content?.trim() || campaign.message;
    } catch (error) {
      console.error('AI Personalization Error:', error);
      // Fallback to basic personalization
      return campaign.message.replace(/\{\{name\}\}/g, customer.name);
    }
  }

  async generateCampaignVariations(originalMessage: string, count: number = 3): Promise<string[]> {
    try {
      const prompt = `
        Create ${count} variations of this marketing message:
        "${originalMessage}"
        
        Each variation should:
        1. Maintain the same core message and call-to-action
        2. Use different wording and structure
        3. Appeal to different psychological triggers (urgency, benefit, social proof, etc.)
        4. Be roughly the same length
        
        Respond with a JSON array of variations: {"variations": ["variation1", "variation2", "variation3"]}
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 500,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.variations || [];
    } catch (error) {
      console.error('AI Variations Error:', error);
      return [];
    }
  }

  private buildGenerationPrompt(request: CampaignGenerationRequest): string {
    const maxLength = request.campaignType === 'sms' ? 120 : 
                     request.campaignType === 'email' ? 500 : 300;

    return `
      Generate a ${request.campaignType} marketing campaign with the following requirements:
      
      Business: ${request.businessName} (${request.businessType})
      Campaign Goal: ${request.campaignGoal}
      Target Audience: ${request.targetAudience || 'General customers'}
      Product/Service: ${request.productService || 'Not specified'}
      Tone: ${request.tone || 'friendly'}
      Key Message: ${request.keyMessage || 'Not specified'}
      Call to Action: ${request.callToAction || 'Contact us'}
      Max Length: ${request.maxLength || maxLength} characters
      
      ${request.campaignType === 'sms' ? `
      SMS SPECIFIC REQUIREMENTS:
      - MAXIMUM 120 characters including spaces and emojis
      - Use 1-2 relevant emojis to make it engaging and eye-catching
      - Be punchy, direct, and exciting - no filler words
      - Include {{name}} for personalization
      - Strong, clear call-to-action
      - Add "STOP to opt out" only if space allows
      - Examples of great SMS style:
        "🔥 {{name}}! Flash sale - 50% off today only! Shop now: bit.ly/sale STOP=unsubscribe"
        "🍕 Hey {{name}}! Free pizza with any order over $20! Order: link.co/pizza"
        "⚡ {{name}}, your exclusive 30% discount expires tonight! Use code SAVE30"
      ` : ''}
      
      Requirements:
      ${request.campaignType === 'email' ? '- Include both subject line and message body' : '- Single message only'}
      - Include clear call-to-action
      - Make it engaging and conversion-focused  
      - Use personalization placeholders like {{name}} where appropriate
      - For SMS: Use emojis creatively but keep total under 120 characters
      - Make it exciting and action-oriented
      
      Respond in JSON format:
      {
        ${request.campaignType === 'email' ? '"subject": "Email subject line",' : ''}
        "message": "Campaign message content",
        "suggestions": ["tip1", "tip2", "tip3"],
        "estimatedEngagement": "low|medium|high"
      }
    `;
  }

  private buildEnhancementPrompt(request: CampaignEnhancementRequest): string {
    const improvements = request.improvements.join(', ');
    
    // Detect language from original message
    const detectedLanguage = this.detectLanguage(request.originalMessage);
    const languageInstruction = this.getLanguageInstruction(detectedLanguage);
    
    return `
      CRITICAL: ${languageInstruction}
      
      Enhance this ${request.campaignType} marketing campaign:
      
      Original Message: "${request.originalMessage}"
      Business: ${request.businessName}
      Target Audience: ${request.targetAudience || 'General customers'}
      Focus Improvements: ${improvements}
      Detected Language: ${detectedLanguage}
      
      Please improve the campaign by focusing on: ${improvements}
      IMPORTANT: Keep the enhanced message in the SAME LANGUAGE (${detectedLanguage}) as the original.
      
      ${request.campaignType === 'sms' ? 'Keep the enhanced version under 160 characters.' : ''}
      ${request.campaignType === 'email' ? 'Provide both enhanced subject and message if applicable.' : ''}
      
      Respond in JSON format:
      {
        ${request.campaignType === 'email' ? '"subject": "Enhanced subject line IN THE SAME LANGUAGE",' : ''}
        "enhanced_message": "Improved campaign message IN THE SAME LANGUAGE",
        "improvement_suggestions": ["what was improved", "why it works better"],
        "estimatedEngagement": "low|medium|high"
      }
    `;
  }

  private detectLanguage(text: string): string {
    // Simple language detection based on common words and patterns
    const swedishWords = /\b(och|eller|är|det|att|för|med|på|av|till|från|som|en|ett|den|de|vi|du|han|hon|här|där|när|vad|hur|varför|hej|tack|ja|nej|viktminskning|skräddarsydda|lättare|vardag|börja|resa|upplev|våra|din|nu)\b/gi;
    const englishWords = /\b(and|or|is|the|to|for|with|on|of|from|as|a|an|we|you|he|she|here|there|when|what|how|why|hello|thank|yes|no|weight|loss|custom|easier|daily|start|journey|discover|your|now)\b/gi;
    
    const swedishMatches = (text.match(swedishWords) || []).length;
    const englishMatches = (text.match(englishWords) || []).length;
    
    // Check for specific Swedish characters
    const swedishChars = /[åäöÅÄÖ]/g;
    const hasSwedishChars = swedishChars.test(text);
    
    if (hasSwedishChars || swedishMatches > englishMatches) {
      return 'Swedish';
    } else if (englishMatches > 0) {
      return 'English';
    } else {
      // Default based on character patterns
      return swedishChars.test(text) ? 'Swedish' : 'English';
    }
  }

  private getLanguageInstruction(language: string): string {
    if (language === 'Swedish') {
      return 'Du MÅSTE svara på svenska. Originalmeddelandet är på svenska och din förbättrade version MÅSTE också vara på svenska. Använd svenska ord, fraser och grammatik.';
    } else {
      return 'You MUST respond in English. The original message is in English and your enhanced version MUST also be in English. Use English words, phrases, and grammar.';
    }
  }
}

// Export service instance (will throw error if API key is missing)
let aiCampaignService: AICampaignService | null = null;

export const getAICampaignService = (): AICampaignService => {
  if (!aiCampaignService) {
    aiCampaignService = new AICampaignService();
  }
  return aiCampaignService;
};