
import { UserContext } from './types';
import { responses, intentKeywords } from './constants';

export const detectLanguage = (text: string, currentLanguage: 'en' | 'sv'): 'en' | 'sv' => {
  const swedishWords = ['hej', 'tack', 'ja', 'nej', 'hur', 'vad', 'när', 'var', 'varför', 'pris', 'kostnad', 'gratis', 'boka', 'möte'];
  const words = text.toLowerCase().split(' ');
  const swedishMatches = words.filter(word => swedishWords.includes(word)).length;
  
  if (swedishMatches > 0) return 'sv';
  return currentLanguage;
};

export const detectIntent = (message: string, language: 'en' | 'sv'): 'helpSeeking' | 'serviceInterest' | 'salesLead' | 'general' => {
  const lowerMessage = message.toLowerCase();
  const keywords = intentKeywords[language];
  
  // Check for sales lead intent first (highest priority)
  if (keywords.salesLead.some(keyword => lowerMessage.includes(keyword))) {
    return 'salesLead';
  }
  
  // Check for service interest
  if (keywords.serviceInterest.some(keyword => lowerMessage.includes(keyword))) {
    return 'serviceInterest';
  }
  
  // Check for help seeking
  if (keywords.helpSeeking.some(keyword => lowerMessage.includes(keyword))) {
    return 'helpSeeking';
  }
  
  return 'general';
};

export const analyzeUserIntent = (message: string, userContext: UserContext): { interest: boolean; needsFollowUp: boolean; shouldCaptureLead: boolean } => {
  const lowerMessage = message.toLowerCase();
  const intent = detectIntent(message, userContext.language);
  const interestKeywords = ['interested', 'want', 'need', 'how much', 'price', 'cost', 'demo', 'trial', 'sign up', 'intresserad', 'vill', 'behöver', 'pris', 'kostnad'];
  const urgentKeywords = ['now', 'today', 'asap', 'urgent', 'nu', 'idag', 'brådskande'];
  
  const showsInterest = interestKeywords.some(keyword => lowerMessage.includes(keyword)) || intent === 'serviceInterest' || intent === 'salesLead';
  const isUrgent = urgentKeywords.some(keyword => lowerMessage.includes(keyword));
  const shouldCaptureLead = (userContext.questionsAsked >= 2 && showsInterest) || isUrgent || intent === 'salesLead';
  
  return {
    interest: showsInterest,
    needsFollowUp: showsInterest || userContext.questionsAsked >= 1,
    shouldCaptureLead
  };
};

export const getWelcomeMessage = (language: 'en' | 'sv', visitDuration: number) => {
  const currentResponses = responses[language];
  
  if (visitDuration > 30) {
    return language === 'sv' 
      ? "Jag märker att du har tittat runt lite - " + currentResponses.welcome
      : "I notice you've been exploring - " + currentResponses.welcome;
  }
  
  return currentResponses.welcome;
};

// Track conversation topics to avoid repetition
let conversationTopics: Set<string> = new Set();
let lastResponseType: string = '';

export const generateResponse = (
  userMessage: string, 
  userContext: UserContext, 
  conversationHistory: Array<{text: string, sender: 'user' | 'bot'}>
): { text: string; showLeadForm?: boolean; showBookingForm?: boolean } => {
  const message = userMessage.toLowerCase();
  const currentResponses = responses[userContext.language];
  const intent = detectIntent(userMessage, userContext.language);
  const userIntent = analyzeUserIntent(userMessage, userContext);
  
  // Get recent conversation context
  const recentMessages = conversationHistory.slice(-6);
  const recentBotMessages = recentMessages.filter(m => m.sender === 'bot').map(m => m.text);
  const userMessages = recentMessages.filter(m => m.sender === 'user').map(m => m.text.toLowerCase());
  
  // Handle greetings with personalized response
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('hej') || message.includes('hallå')) {
    if (!conversationTopics.has('greeting')) {
      conversationTopics.add('greeting');
      const greeting = userContext.language === 'sv' 
        ? `Hej${userContext.name ? ` ${userContext.name}` : ''}! Trevligt att träffa dig! 😊`
        : `Hello${userContext.name ? ` ${userContext.name}` : ''}! Nice to meet you! 😊`;
      
      return { text: greeting + " " + currentResponses.welcome };
    } else {
      // Follow-up greeting
      const followUpGreeting = userContext.language === 'sv'
        ? "Hej igen! Vad mer kan jag hjälpa dig med idag?"
        : "Hello again! What else can I help you with today?";
      return { text: followUpGreeting };
    }
  }

  // Handle yes/no responses contextually
  if (message.includes('yes') || message.includes('ja') || message.includes('sure') || message.includes('ok')) {
    if (lastResponseType === 'booking') {
      return { 
        text: currentResponses.booking,
        showBookingForm: true
      };
    } else if (lastResponseType === 'leadCapture' || userIntent.shouldCaptureLead) {
      return { 
        text: currentResponses.leadCapture,
        showLeadForm: true
      };
    } else if (lastResponseType === 'trial') {
      return { 
        text: currentResponses.leadCapture,
        showLeadForm: true
      };
    }
  }

  if (message.includes('no') || message.includes('nej') || message.includes('not interested')) {
    const politeResponse = userContext.language === 'sv'
      ? "Inga problem! Finns det något annat jag kan hjälpa dig med? Kanske information om våra tjänster eller svar på andra frågor?"
      : "No problem! Is there anything else I can help you with? Perhaps information about our services or answers to other questions?";
    return { text: politeResponse };
  }

  // Handle specific topics with context awareness
  if (message.includes('price') || message.includes('cost') || message.includes('sek') || message.includes('pris') || message.includes('kostnad')) {
    if (!conversationTopics.has('pricing')) {
      conversationTopics.add('pricing');
      lastResponseType = 'pricing';
      return { 
        text: currentResponses.pricing,
        showLeadForm: userIntent.shouldCaptureLead
      };
    } else {
      // Follow-up pricing question
      const followUpPricing = userContext.language === 'sv'
        ? "Behöver du mer specifik prisinformation? Jag kan boka en kort demo där vi går igenom exakt vad som passar ditt företag bäst. Vill du att jag bokar det?"
        : "Do you need more specific pricing information? I can book a short demo where we go through exactly what would work best for your business. Would you like me to book that?";
      lastResponseType = 'booking';
      return { text: followUpPricing };
    }
  }

  if (message.includes('trial') || message.includes('free') || message.includes('gratis') || message.includes('provperiod')) {
    if (!conversationTopics.has('trial')) {
      conversationTopics.add('trial');
      lastResponseType = 'trial';
      return { 
        text: currentResponses.trial,
        showLeadForm: userIntent.shouldCaptureLead
      };
    } else {
      const followUpTrial = userContext.language === 'sv'
        ? "Perfekt! För att sätta upp din gratis provperiod behöver jag bara några snabba uppgifter. Ska vi göra det nu?"
        : "Perfect! To set up your free trial, I just need a few quick details. Shall we do that now?";
      return { 
        text: followUpTrial,
        showLeadForm: true
      };
    }
  }

  if (message.includes('nfc') || message.includes('card') || message.includes('kort')) {
    if (!conversationTopics.has('nfc')) {
      conversationTopics.add('nfc');
      return { text: currentResponses.nfc };
    } else {
      const followUpNfc = userContext.language === 'sv'
        ? "Har du några specifika frågor om NFC-korten? Till exempel om design, antal eller hur kunder använder dem?"
        : "Do you have any specific questions about the NFC cards? For example about design, quantity, or how customers use them?";
      return { text: followUpNfc };
    }
  }

  if (message.includes('demo') || message.includes('meeting') || message.includes('call') || message.includes('book') || message.includes('möte') || message.includes('samtal') || message.includes('boka')) {
    lastResponseType = 'booking';
    return { 
      text: currentResponses.booking,
      showBookingForm: true
    };
  }

  if (message.includes('marketing') || message.includes('campaign') || message.includes('marknadsföring') || message.includes('kampanj')) {
    if (!conversationTopics.has('marketing')) {
      conversationTopics.add('marketing');
      return { text: currentResponses.marketing };
    } else {
      const followUpMarketing = userContext.language === 'sv'
        ? "Vilken typ av marknadsföringsutmaningar har ditt företag just nu? Jag kan visa hur vår NFC-plattform löser dem."
        : "What kind of marketing challenges is your business facing right now? I can show how our NFC platform solves them.";
      return { text: followUpMarketing };
    }
  }

  // Intent-based routing with context
  switch (intent) {
    case 'helpSeeking':
      if (userContext.questionsAsked === 1) {
        return { text: currentResponses.helpSeeking };
      } else {
        const contextualHelp = userContext.language === 'sv'
          ? "Jag hjälper gärna! Baserat på vad vi pratat om, verkar du mest intresserad av [NFC-lösningar/priser/demo]. Vill du att jag fokuserar på det?"
          : "I'd be happy to help! Based on what we've discussed, you seem most interested in [NFC solutions/pricing/demo]. Would you like me to focus on that?";
        return { text: contextualHelp };
      }
    
    case 'serviceInterest':
      if (!conversationTopics.has('serviceInterest')) {
        conversationTopics.add('serviceInterest');
        return { 
          text: currentResponses.serviceInterest,
          showLeadForm: userContext.questionsAsked >= 1
        };
      } else {
        const deeperInterest = userContext.language === 'sv'
          ? "Fantastiskt att du är intresserad! Vad är det viktigaste för ditt företag just nu - att öka kundengagemang, förbättra marknadsföring eller något annat?"
          : "Great that you're interested! What's most important for your business right now - increasing customer engagement, improving marketing, or something else?";
        return { text: deeperInterest };
      }
    
    case 'salesLead':
      lastResponseType = 'leadCapture';
      return { 
        text: currentResponses.conversion,
        showLeadForm: true
      };
  }

  // Conversion-focused fallback with context
  if (userIntent.shouldCaptureLead) {
    lastResponseType = 'leadCapture';
    return {
      text: currentResponses.conversion,
      showLeadForm: true
    };
  }

  // Smart contextual fallback
  if (userContext.questionsAsked >= 3) {
    const smartFallback = userContext.language === 'sv'
      ? "Jag märker att du har flera frågor! Skulle det vara enklare om jag bokar en kort 15-minuters demo där jag kan visa allt och svara på dina frågor direkt?"
      : "I notice you have several questions! Would it be easier if I book a short 15-minute demo where I can show everything and answer your questions directly?";
    lastResponseType = 'booking';
    return { text: smartFallback };
  }

  // Standard fallback
  return {
    text: currentResponses.fallback
  };
};

// Reset conversation state (call when chat is reopened)
export const resetConversationState = () => {
  conversationTopics.clear();
  lastResponseType = '';
};
