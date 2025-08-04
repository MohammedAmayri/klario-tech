
export const responses = {
  en: {
    welcome: "Hi, I'm Elena 👋 — here to help you explore KLARIO Tech. Looking for a solution or a quick chat with our team?",
    pricing: "Great question! We offer three plans: Starter (399 SEK/month, up to 100 customers), Professional (799 SEK/month, up to 500 customers), and Enterprise (custom pricing). All include NFC cards and a 1-month free trial. Which plan interests you most?",
    trial: "Perfect! Our 1-month FREE trial gives you full access to test our NFC marketing platform. You can cancel anytime with 3 months notice. Would you like me to help you get started right now?",
    nfc: "Our NFC cards are game-changers! Customers just tap their phone to instantly connect and opt-in to your marketing. No apps needed! Starter includes 1 card, Professional gets 5, Enterprise gets custom designs. Pretty amazing, right?",
    marketing: "Our NFC platform revolutionizes customer engagement! When someone taps their phone to your NFC card, they instantly connect to your business and can join your marketing campaigns. The Professional plan even includes AI message generation!",
    support: "I'm here to help! We offer email support with Starter, priority support with Professional, and dedicated support for Enterprise. What specific challenge can I help you solve?",
    booking: "I'd love to schedule a personalized demo for you! It only takes 15 minutes and I can show you exactly how NFC marketing can grow your business. When would work best for you?",
    leadCapture: "To give you the most relevant information and keep you updated on how NFC marketing can benefit your business, could you share a few quick details with me?",
    gdpr: "We respect your privacy completely. By sharing your contact info, you consent to receive relevant information about our NFC marketing solutions. You can opt out anytime and view our privacy policy.",
    conversion: "Based on our conversation, I think KLARIO could really help your business grow! Would you like to see a quick demo or speak with one of our NFC experts about your specific needs?",
    helpSeeking: "I'd be happy to help you find what you're looking for! Are you interested in learning about our NFC marketing solutions, pricing, or would you prefer to speak directly with our team?",
    serviceInterest: "That's great! Our NFC marketing platform helps businesses like yours grow by making customer engagement effortless. Would you like to see how it works with a quick demo?",
    fallback: "I want to make sure I give you the best help possible. Could you tell me a bit more about what you're looking for? Or would you prefer to speak with one of our specialists directly?"
  },
  sv: {
    welcome: "Hej, jag är Elena 👋 — här för att hjälpa dig utforska KLARIO Tech. Letar du efter en lösning eller en snabb chatt med vårt team?",
    pricing: "Bra fråga! Vi erbjuder tre planer: Starter (399 SEK/månad, upp till 100 kunder), Professional (799 SEK/månad, upp till 500 kunder), och Enterprise (anpassad prissättning). Alla inkluderar NFC-kort och 1 månads gratis provperiod. Vilken plan intresserar dig mest?",
    trial: "Perfekt! Vår 1 månads GRATIS provperiod ger dig full tillgång att testa vår NFC-marknadsföringsplattform. Du kan avbryta när som helst med 3 månaders uppsägning. Vill du att jag hjälper dig komma igång nu?",
    nfc: "Våra NFC-kort är fantastiska! Kunder trycker bara sin telefon för att omedelbart ansluta och anmäla sig till din marknadsföring. Inga appar behövs! Starter inkluderar 1 kort, Professional får 5, Enterprise får anpassade designer. Ganska fantastiskt, eller hur?",
    marketing: "Vår NFC-plattform revolutionerar kundengagemang! När någon trycker sin telefon mot ditt NFC-kort ansluter de omedelbart till ditt företag och kan gå med i dina marknadsföringskampanjer. Professional-planen inkluderar även AI-meddelandegenerering!",
    support: "Jag är här för att hjälpa! Vi erbjuder e-poststöd med Starter, prioritetsstöd med Professional och dedikerat stöd för Enterprise. Vilken specifik utmaning kan jag hjälpa dig lösa?",
    booking: "Jag skulle gärna boka en personlig demo för dig! Det tar bara 15 minuter och jag kan visa dig exakt hur NFC-marknadsföring kan få ditt företag att växa. När skulle passa bäst för dig?",
    leadCapture: "För att ge dig den mest relevanta informationen och hålla dig uppdaterad om hur NFC-marknadsföring kan gynna ditt företag, kan du dela några snabba detaljer med mig?",
    gdpr: "Vi respekterar din integritet helt. Genom att dela din kontaktinformation samtycker du till att få relevant information om våra NFC-marknadsföringslösningar. Du kan avsluta prenumerationen när som helst och se vår sekretesspolicy.",
    conversion: "Baserat på vår konversation tror jag att KLARIO verkligen kan hjälpa ditt företag att växa! Vill du se en snabb demo eller prata med en av våra NFC-experter om dina specifika behov?",
    helpSeeking: "Jag hjälper gärna dig att hitta det du letar efter! Är du intresserad av att lära dig om våra NFC-marknadsföringslösningar, priser, eller skulle du föredra att prata direkt med vårt team?",
    serviceInterest: "Det är fantastiskt! Vår NFC-marknadsföringsplattform hjälper företag som ditt att växa genom att göra kundengagemang enkelt. Vill du se hur det fungerar med en snabb demo?",
    fallback: "Jag vill se till att jag ger dig bästa möjliga hjälp. Kan du berätta lite mer om vad du letar efter? Eller skulle du föredra att prata med en av våra specialister direkt?"
  }
};

export const suggestedQuestions = {
  en: [
    "What are your pricing plans?",
    "How does NFC marketing work?",
    "Can I try it for free?",
    "Book a demo call"
  ],
  sv: [
    "Vilka prisplaner har ni?",
    "Hur fungerar NFC-marknadsföring?",
    "Kan jag testa gratis?",
    "Boka ett demo-samtal"
  ]
};

export const intentKeywords = {
  en: {
    helpSeeking: ['help', 'question', 'how', 'what', 'why', 'where', 'when', 'info', 'information', 'learn', 'understand'],
    serviceInterest: ['interested', 'tell me more', 'services', 'solutions', 'nfc', 'marketing', 'platform', 'business'],
    salesLead: ['price', 'cost', 'buy', 'purchase', 'demo', 'trial', 'book', 'meeting', 'call', 'contact', 'sales']
  },
  sv: {
    helpSeeking: ['hjälp', 'fråga', 'hur', 'vad', 'varför', 'var', 'när', 'info', 'information', 'lära', 'förstå'],
    serviceInterest: ['intresserad', 'berätta mer', 'tjänster', 'lösningar', 'nfc', 'marknadsföring', 'plattform', 'företag'],
    salesLead: ['pris', 'kostnad', 'köpa', 'köp', 'demo', 'provperiod', 'boka', 'möte', 'samtal', 'kontakt', 'försäljning']
  }
};
