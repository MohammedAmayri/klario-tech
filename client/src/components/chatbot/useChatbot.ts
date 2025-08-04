
import { useState, useRef, useEffect } from "react";
import { Message, UserContext, LeadData, BookingData } from './types';
import { detectLanguage, getWelcomeMessage, generateResponse, resetConversationState } from './utils';
import { useToast } from "@/hooks/use-toast";

export const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userContext, setUserContext] = useState<UserContext>({
    language: 'en',
    visitDuration: 0,
    questionsAsked: 0,
    showsInterest: false
  });
  const [gdprConsent, setGdprConsent] = useState(false);
  const visitStartTime = useRef<number>(Date.now());
  const { toast } = useToast();

  // Track visit duration
  useEffect(() => {
    const interval = setInterval(() => {
      setUserContext(prev => ({
        ...prev,
        visitDuration: Math.floor((Date.now() - visitStartTime.current) / 1000)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Auto-detect language and initialize
  useEffect(() => {
    const browserLang = navigator.language.toLowerCase();
    const detectedLang = browserLang.includes('sv') ? 'sv' : 'en';
    
    setUserContext(prev => ({ ...prev, language: detectedLang }));
    
    const welcomeMessage = getWelcomeMessage(detectedLang, userContext.visitDuration);
    
    setMessages([{
      id: '1',
      text: welcomeMessage,
      sender: 'bot',
      timestamp: new Date()
    }]);

    // Reset conversation state when chatbot initializes
    resetConversationState();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToProcess = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Update language detection
    const detectedLang = detectLanguage(messageToProcess, userContext.language);
    if (detectedLang !== userContext.language) {
      setUserContext(prev => ({ ...prev, language: detectedLang }));
    }

    // Update user context
    setUserContext(prev => ({ 
      ...prev, 
      questionsAsked: prev.questionsAsked + 1,
      language: detectedLang
    }));

    // Realistic typing delay
    const delay = 800 + Math.random() * 800;
    setTimeout(() => {
      // Get conversation history for context
      const conversationHistory = [...messages, userMessage].map(msg => ({
        text: msg.text,
        sender: msg.sender
      }));

      const response = generateResponse(
        messageToProcess, 
        { ...userContext, language: detectedLang },
        conversationHistory
      );
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        showLeadForm: response.showLeadForm,
        showBookingForm: response.showBookingForm
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, delay);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleLeadCapture = (leadData: LeadData) => {
    setUserContext(prev => ({ ...prev, ...leadData }));
    setGdprConsent(true);
    
    console.log('Lead captured:', leadData);
    
    toast({
      title: userContext.language === 'sv' ? "Tack!" : "Thank you!",
      description: userContext.language === 'sv' 
        ? "Vi kommer att kontakta dig snart med relevant information."
        : "We'll contact you soon with relevant information.",
    });

    const thankYouMessage: Message = {
      id: Date.now().toString(),
      text: userContext.language === 'sv'
        ? `Tack ${leadData.name}! Jag har dina uppgifter och någon från vårt team kommer att kontakta dig inom 24 timmar. Har du några andra frågor just nu?`
        : `Thank you ${leadData.name}! I have your details and someone from our team will contact you within 24 hours. Do you have any other questions right now?`,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, thankYouMessage]);
  };

  const handleBooking = (bookingData: BookingData) => {
    console.log('Booking scheduled:', bookingData);
    
    toast({
      title: userContext.language === 'sv' ? "Möte bokat!" : "Meeting booked!",
      description: userContext.language === 'sv'
        ? `Ditt möte är bokat för ${bookingData.date} kl ${bookingData.time}`
        : `Your meeting is booked for ${bookingData.date} at ${bookingData.time}`,
    });

    const confirmationMessage: Message = {
      id: Date.now().toString(),
      text: userContext.language === 'sv'
        ? `Perfekt! Ditt demo-möte är bokat för ${bookingData.date} kl ${bookingData.time} (${bookingData.timezone}). Du kommer att få en bekräftelse via e-post med alla detaljer. Ser fram emot att träffa dig!`
        : `Perfect! Your demo meeting is booked for ${bookingData.date} at ${bookingData.time} (${bookingData.timezone}). You'll receive an email confirmation with all the details. Looking forward to meeting you!`,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, confirmationMessage]);
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    userContext,
    setUserContext,
    gdprConsent,
    handleSendMessage,
    handleSuggestedQuestion,
    handleLeadCapture,
    handleBooking
  };
};
