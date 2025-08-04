// Internationalization (i18n) system for Klario
// Default language: Swedish (sv), Secondary: English (en)

import { useState, useEffect } from 'react';

export type Language = 'sv' | 'en';

export interface Translations {
  [key: string]: {
    sv: string;
    en: string;
  } | Translations;
}

export const translations: Translations = {
  // Common/Global
  common: {
    loading: { sv: 'Laddar...', en: 'Loading...' },
    save: { sv: 'Spara', en: 'Save' },
    cancel: { sv: 'Avbryt', en: 'Cancel' },
    delete: { sv: 'Ta bort', en: 'Delete' },
    edit: { sv: 'Redigera', en: 'Edit' },
    close: { sv: 'Stäng', en: 'Close' },
    confirm: { sv: 'Bekräfta', en: 'Confirm' },
    back: { sv: 'Tillbaka', en: 'Back' },
    next: { sv: 'Nästa', en: 'Next' },
    previous: { sv: 'Föregående', en: 'Previous' },
    submit: { sv: 'Skicka', en: 'Submit' },
    search: { sv: 'Sök', en: 'Search' },
    filter: { sv: 'Filtrera', en: 'Filter' },
    sort: { sv: 'Sortera', en: 'Sort' },
    language: { sv: 'Språk', en: 'Language' },
    swedish: { sv: 'Svenska', en: 'Swedish' },
    english: { sv: 'Engelska', en: 'English' },
    error: { sv: 'Fel', en: 'Error' }
  },

  // Navigation & Header
  nav: {
    home: { sv: 'Hem', en: 'Home' },
    about: { sv: 'Om oss', en: 'About' },
    features: { sv: 'Funktioner', en: 'Features' },
    contact: { sv: 'Kontakt', en: 'Contact' },
    dashboard: { sv: 'Översikt', en: 'Dashboard' },
    campaigns: { sv: 'Kampanjer', en: 'Campaigns' },
    customers: { sv: 'Kunder', en: 'Customers' },
    settings: { sv: 'Inställningar', en: 'Settings' },
    logout: { sv: 'Logga ut', en: 'Logout' },
    login: { sv: 'Logga in', en: 'Login' },
    signup: { sv: 'Registrera', en: 'Sign Up' }
  },

  // Landing Page
  landing: {
    title: { 
      sv: 'NFC-kundengagemang för moderna företag', 
      en: 'NFC Customer Engagement for Modern Businesses' 
    },
    subtitle: { 
      sv: 'Koppla upp kunder direkt med NFC-teknik. Scanna, registrera och ta emot exklusiva erbjudanden - gör kundengagemang enkelt med Klario.', 
      en: 'Connect customers instantly with NFC technology. Scan, register, and receive exclusive deals - making customer engagement effortless with Klario.' 
    },
    getStarted: { sv: 'Kom igång', en: 'Get Started' },
    learnMore: { sv: 'Läs mer', en: 'Learn More' },
    howItWorks: { sv: 'Så fungerar det', en: 'How It Works' },
    features: { sv: 'Funktioner', en: 'Features' },
    pricing: { sv: 'Priser', en: 'Pricing' },
    aboutDescription: { 
      sv: 'Klario är Sveriges ledande NFC-marknadsföringsplattform som kombinerar avancerad närfältskommunikationsteknologi med AI-driven automation för att skapa meningsfulla kundkontakter genom smarta, berörningsfria interaktioner.',
      en: 'Klario is Sweden\'s leading NFC marketing platform that combines advanced near-field communication technology with AI-driven automation to create meaningful customer connections through smart, contactless interactions.'
    },
    nfcInnovation: { sv: 'NFC Innovation', en: 'NFC Innovation' },
    nfcInnovationDesc: { sv: 'Avancerad NFC-teknik som förvandlar fysiska prylar till digitala kundmöten', en: 'Advanced NFC technology that transforms physical objects into digital customer encounters' },
    aiPowered: { sv: 'AI-Powered', en: 'AI-Powered' },
    aiPoweredDesc: { sv: 'Intelligenta kampanjer som förbättras automatiskt med maskininlärning', en: 'Intelligent campaigns that improve automatically with machine learning' },
    customerFirst: { sv: 'Customer First', en: 'Customer First' },
    customerFirstDesc: { sv: 'Kundcentrerat fokus med GDPR-kompatibel datainsamling', en: 'Customer-focused approach with GDPR-compliant data collection' },
    
    // Features section
    featuresTitle: { sv: 'Kraftfulla funktioner för ditt företag', en: 'Powerful features for your business' },
    featuresSubtitle: { sv: 'Allt du behöver för att skåpa framgångsrika NFC-kampanjer och engagera dina kunder', en: 'Everything you need to create successful NFC campaigns and engage your customers' },
    smartNfc: { sv: 'Smart NFC-teknik', en: 'Smart NFC Technology' },
    smartNfcDesc: { sv: 'Avancerad närfältskommunikation', en: 'Advanced near-field communication' },
    smartNfcContent: { sv: 'Förvandla vanliga föremål till interaktiva kundupplevelser med våra anpassade NFC-taggar och -kort.', en: 'Transform everyday objects into interactive customer experiences with our custom NFC tags and cards.' },
    aiCampaigns: { sv: 'AI-kampanjer', en: 'AI Campaigns' },
    aiCampaignsDesc: { sv: 'Intelligenta marknadsföringsmeddelanden', en: 'Intelligent marketing messages' },
    aiCampaignsContent: { sv: 'Låt AI förbättra dina kampanjmeddelanden för maximalt genomslag och kundengagemang.', en: 'Let AI enhance your campaign messages for maximum impact and customer engagement.' },
    customerInsights: { sv: 'Kundinsikter', en: 'Customer Insights' },
    customerInsightsDesc: { sv: 'Djup förståelse för dina kunder', en: 'Deep understanding of your customers' },
    customerInsightsContent: { sv: 'Få värdefull data om kundbeteenden och preferenser genom detaljerad analys.', en: 'Get valuable data about customer behaviors and preferences through detailed analytics.' },
    multichannel: { sv: 'Flerkanalskommunikation', en: 'Multi-channel Communication' },
    multichannelDesc: { sv: 'SMS, e-post och WhatsApp', en: 'SMS, email and WhatsApp' },
    multichannelContent: { sv: 'Nå dina kunder där de är med personaliserade meddelanden via deras föredragna kanaler.', en: 'Reach your customers where they are with personalized messages via their preferred channels.' },
    realTimeAnalytics: { sv: 'Realtidsanalys', en: 'Real-time Analytics' },
    realTimeAnalyticsDesc: { sv: 'Kampanjresultat på direkten', en: 'Campaign results instantly' },
    realTimeAnalyticsContent: { sv: 'Följ kampanjprestanda i realtid och optimera för bättre resultat automatiskt.', en: 'Track campaign performance in real-time and optimize for better results automatically.' },
    gdprSecure: { sv: 'GDPR-säker', en: 'GDPR Secure' },
    gdprSecureDesc: { sv: 'Fullständig integritetsskydd', en: 'Complete privacy protection' },
    gdprSecureContent: { sv: '100% GDPR-kompatibel hantering av kunddata med transparent samtycke och integritetskontroll.', en: '100% GDPR-compliant customer data handling with transparent consent and privacy controls.' },
    
    // Pricing section
    pricingTitle: { sv: 'Enkla, transparenta priser', en: 'Simple, transparent pricing' },
    pricingSubtitle: { sv: 'Välj den perfekta planen för ditt företag. Alla planer inkluderar 1 månads gratis provperiod med årsavtal. Säg upp när som helst med 3 månaders varsel.', en: 'Choose the perfect plan for your business. All plans include 1 month free trial with annual contract. Cancel anytime with 3 months notice.' },
    
    // Plan details
    freeTrial: { sv: '1 månad gratis', en: '1 month free' },
    monthlyContract: { sv: 'Årsavtal krävs', en: 'Annual contract required' },
    startFreeTrial: { sv: 'Starta gratis provperiod', en: 'Start free trial' },
    cancelAnytime: { sv: 'Säg upp när som helst, 3 månaders varsel', en: 'Cancel anytime, 3 months notice' },
    contactSales: { sv: 'Kontakta försäljning', en: 'Contact sales' },
    customTerms: { sv: 'Anpassade villkor tillgängliga', en: 'Custom terms available' },
    popular: { sv: 'Populärast', en: 'Most Popular' },
    custom: { sv: 'Anpassad', en: 'Custom' },
    
    // Plan features
    upTo100Customers: { sv: 'Upp till 100 kunder/månad', en: 'Up to 100 customers/month' },
    upTo500Customers: { sv: 'Upp till 500 kunder/månad', en: 'Up to 500 customers/month' },
    unlimitedCustomers: { sv: 'Obegränsat antal kunder', en: 'Unlimited customers' },
    oneNfcCard: { sv: '1 NFC-kort inkluderat', en: '1 NFC card included' },
    fiveNfcCards: { sv: '5 NFC-kort inkluderade', en: '5 NFC cards included' },
    customNfcCards: { sv: 'Anpassade NFC-kort', en: 'Custom NFC cards' },
    basicAnalytics: { sv: 'Grundläggande analys', en: 'Basic analytics' },
    advancedAnalytics: { sv: 'Avancerad analys', en: 'Advanced analytics' },
    emailSupport: { sv: 'E-postsupport', en: 'Email support' },
    prioritySupport: { sv: 'Prioriterad support', en: 'Priority support' },
    dedicatedSupport: { sv: 'Dedikerad support', en: 'Dedicated support' },
    aiMessageGeneration: { sv: 'AI-meddelandegenerering', en: 'AI message generation' },
    multichannelCampaigns: { sv: 'Flerkanalskampanjer', en: 'Multi-channel campaigns' },
    whiteLabelSolution: { sv: 'White-label lösning', en: 'White-label solution' },
    customIntegrations: { sv: 'Anpassade integrationer', en: 'Custom integrations' },
    forLargeOrgs: { sv: 'För stora organisationer', en: 'For large organizations' },
    
    // Why choose section
    whyChooseTitle: { sv: 'Varför välja KLARIO NFC-marknadsföring?', en: 'Why choose KLARIO NFC marketing?' },
    instantNfcConnection: { sv: 'Omedelbar NFC-anslutning', en: 'Instant NFC connection' },
    instantNfcDesc: { sv: 'Kunder trycker bara sin telefon mot ditt NFC-kort för att omedelbart ansluta och registrera sig.', en: 'Customers simply tap their phone against your NFC card to instantly connect and register.' },
    aiDrivenAutomation: { sv: 'AI-driven automation', en: 'AI-driven automation' },
    aiDrivenDesc: { sv: 'Vår AI skapar personliga kampanjer och optimerar kundengagemang automatiskt.', en: 'Our AI creates personal campaigns and optimizes customer engagement automatically.' },
    mobileFocusedDesign: { sv: 'Mobilfokuserad design', en: 'Mobile-focused design' },
    mobileFocusedDesc: { sv: 'Sömlös upplevelse optimerad för mobila enheter och modernt kundbeteende.', en: 'Seamless experience optimized for mobile devices and modern customer behavior.' },
    multichannelIntegration: { sv: 'Flerkanalsintegration', en: 'Multi-channel integration' },
    multichannelIntegrationDesc: { sv: 'Koppla NFC-interaktioner med e-post, SMS, WhatsApp och sociala medier-kampanjer.', en: 'Connect NFC interactions with email, SMS, WhatsApp and social media campaigns.' },
    
    // CTA section
    readyToTransform: { sv: 'Redo att transformera din marknadsföring?', en: 'Ready to transform your marketing?' },
    ctaDescription: { sv: 'Boka en gratis 15-minuters konsultation med våra NFC-marknadsföringsexperter. Vi visar dig exakt hur KLARIO kan hjälpa ditt företag växa genom smart, beröringsfri kundengagemang.', en: 'Book a free 15-minute consultation with our NFC marketing experts. We\'ll show you exactly how KLARIO can help your business grow through smart, contactless customer engagement.' },
    bookFreeDemo: { sv: 'Boka din gratis demo', en: 'Book your free demo' },
    noCommitment: { sv: 'Ingen förpliktelse • 15 minuter • Gratis konsultation', en: 'No commitment • 15 minutes • Free consultation' },
    contactUsToday: { sv: 'Kontakta oss idag', en: 'Contact us today' }
  },

  // Dashboard
  dashboard: {
    title: { sv: 'Klario Översikt', en: 'Klario Dashboard' },
    subtitle: { sv: 'NFC-kundengagemang • {businessName}', en: 'NFC Customer Engagement • {businessName}' },
    totalCustomers: { sv: 'Totalt antal kunder', en: 'Total Customers' },
    activeCampaigns: { sv: 'Aktiva kampanjer', en: 'Active Campaigns' },
    thisMonth: { sv: 'Denna månad', en: 'This Month' },
    quickActions: { sv: 'Snabbåtgärder', en: 'Quick Actions' },
    viewCampaigns: { sv: 'Visa kampanjer', en: 'View Campaigns' },
    addCustomer: { sv: 'Lägg till kund', en: 'Add Customer' },
    newCampaign: { sv: 'Ny NFC-kampanj', en: 'New NFC Campaign' },
    recentCustomers: { sv: 'Senaste kunder', en: 'Recent Customers' },
    noCampaigns: { sv: 'Inga kampanjer än', en: 'No campaigns yet' },
    createFirst: { sv: 'Skapa din första kampanj', en: 'Create Your First Campaign' },
    manageCampaigns: { sv: 'Hantera kampanjer', en: 'Manage Campaigns' },
    manageCustomers: { sv: 'Hantera kunder', en: 'Manage Customers' },
    businessSettings: { sv: 'Företagsinställningar', en: 'Business Settings' },
    logOut: { sv: 'Logga ut', en: 'Log Out' },
    welcomeBack: { sv: 'Välkommen tillbaka', en: 'Welcome Back' },
    currentMonth: { sv: 'Aktuell månad', en: 'Current Month' },
    newCustomers: { sv: 'Nya kunder', en: 'New Customers' },
    recentActivity: { sv: 'Senaste aktivitet', en: 'Recent Activity' },
    noCustomersYet: { sv: 'Inga kunder än', en: 'No customers yet' },
    addFirstCustomer: { sv: 'Lägg till din första kund', en: 'Add your first customer' },
    name: { sv: 'Namn', en: 'Name' },
    email: { sv: 'E-post', en: 'Email' },
    phone: { sv: 'Telefon', en: 'Phone' },
    source: { sv: 'Källa', en: 'Source' },
    joined: { sv: 'Gick med', en: 'Joined' },
    withMarketingConsent: { sv: 'med marknadsföringssamtycke', en: 'with marketing consent' },
    inDraft: { sv: 'som utkast', en: 'in draft' },
    engagementRate: { sv: 'Engagemangsgrad', en: 'Engagement Rate' },
    analyticsComingSoon: { sv: 'Kampanjanalys kommer snart', en: 'Campaign analytics coming soon' },
    aiCampaigns: { sv: 'AI-kampanjer', en: 'AI Campaigns' },
    ready: { sv: 'Redo', en: 'Ready' },
    openaiActive: { sv: 'OpenAI-integration aktiv', en: 'OpenAI integration active' },
    myCustomers: { sv: 'Mina kunder', en: 'My Customers' },
    manageCustomerRelationships: { sv: 'Hantera dina kundrelationer', en: 'Manage your customer relationships' },
    searchCustomers: { sv: 'Sök kunder...', en: 'Search customers...' },
    consent: { sv: 'Samtycke', en: 'Consent' },
    myCampaigns: { sv: 'Mina kampanjer', en: 'My Campaigns' },
    marketingCampaignsAutomation: { sv: 'Marknadsföringskampanjer och automation', en: 'Marketing campaigns and automation' },
    quickActionsTitle: { sv: 'Snabbåtgärder', en: 'Quick Actions' },
    quickActionsSubtitle: { sv: 'Kom igång med din marknadsföringsautomation', en: 'Get started with your marketing automation' },
    viewCampaignsDescription: { sv: 'Hantera alla dina kampanjer', en: 'Manage all your campaigns' },
    addCustomerDescription: { sv: 'Bygg upp din kundbas', en: 'Grow your customer base' },
    newCampaignDescription: { sv: 'Skicka exklusiva erbjudanden till NFC-kunder', en: 'Send exclusive deals to NFC customers' },
    noMatchingCustomers: { sv: 'Inga kunder matchar din sökning', en: 'No customers match your search' },
    noCampaignsYet: { sv: 'Inga kampanjer än', en: 'No campaigns yet' },
    createFirstCampaign: { sv: 'Skapa din första kampanj', en: 'Create Your First Campaign' },
    customerName: { sv: 'Kundnamn', en: 'Customer Name' },
    emailAddress: { sv: 'E-postadress', en: 'Email Address' },
    phoneNumber: { sv: 'Telefonnummer', en: 'Phone Number' },
    marketingConsent: { sv: 'Kunden har gett samtycke för marknadsföringskommunikation', en: 'Customer has given consent for marketing communications' },
    addingCustomer: { sv: 'Lägger till kund...', en: 'Adding Customer...' },
    customerAdded: { sv: 'Kund tillagd', en: 'Customer Added' },
    customerAddedDescription: { sv: '{name} har lagts till i din kundlista.', en: '{name} has been added to your customer list.' },
    failedToAddCustomer: { sv: 'Kunde inte lägga till kund. Försök igen.', en: 'Failed to add customer. Please try again.' },
    
    // Additional dashboard translations
    businessDashboard: { sv: 'Företagsöversikt', en: 'Business Dashboard' },
    merchantId: { sv: 'Handlar-ID', en: 'Merchant ID' },
    loadingDashboard: { sv: 'Laddar översikt...', en: 'Loading dashboard...' },
    totalCustomersGrowth: { sv: '+12% från förra månaden', en: '+12% from last month' },
    activeCustomersDesc: { sv: 'Engagerade denna vecka', en: 'Engaged this week' },
    consentRate: { sv: 'Samtyckesgrad', en: 'Consent Rate' },
    gdprCompliant: { sv: 'GDPR-kompatibel', en: 'GDPR Compliant' },
    avgResponse: { sv: 'Snitt svarstid', en: 'Avg Response' },
    responseTime: { sv: 'Svarstid', en: 'Response time' },
    messagesSent: { sv: 'Meddelanden skickade', en: 'Messages Sent' },
    avgOpenRate: { sv: 'Snitt öppningsgrad', en: 'Avg Open Rate' },
    campaignList: { sv: 'Kampanjlista', en: 'Campaign List' },
    campaignListDesc: { sv: 'Hantera dina kundengagemangskampanjer', en: 'Manage your customer engagement campaigns' },
    addCampaign: { sv: 'Lägg till kampanj', en: 'Add Campaign' },
    emailCampaign: { sv: 'E-postkampanj', en: 'Email Campaign' },
    smsCampaign: { sv: 'SMS-kampanj', en: 'SMS Campaign' },
    active: { sv: 'Aktiv', en: 'Active' },
    next: { sv: 'Nästa', en: 'Next' },
    noCampaignsDesc: { sv: 'Skapa din första kampanj för att engagera dina NFC-kunder', en: 'Create your first campaign to engage with your NFC customers' },
    createCampaign: { sv: 'Skapa kampanj', en: 'Create Campaign' },
    customerDatabase: { sv: 'Kunddatabas', en: 'Customer Database' },
    customerDatabaseDesc: { sv: 'Hantera dina GDPR-kompatibla kundkontakter', en: 'Manage your GDPR-compliant customer contacts' },
    addNewCustomer: { sv: 'Lägg till ny kund', en: 'Add New Customer' },
    filter: { sv: 'Filtrera', en: 'Filter' },
    export: { sv: 'Exportera', en: 'Export' },
    vip: { sv: 'VIP', en: 'VIP' },
    regular: { sv: 'Vanlig', en: 'Regular' },
    newCustomer: { sv: 'Ny kund', en: 'New Customer' },
    lastContact: { sv: 'Senaste kontakt', en: 'Last Contact' },
    noCustomersMessage: { sv: 'Kunder kommer att visas här när de skannar dina NFC-taggar', en: 'Customers will appear here when they scan your NFC tags' }
  },

  // Campaigns
  campaigns: {
    title: { sv: 'NFC-kampanjhantering', en: 'NFC Campaign Management' },
    subtitle: { sv: 'Hantera exklusiva erbjudanden för dina NFC-kunder', en: 'Manage exclusive deals for your NFC customers' },
    createNew: { sv: 'Skapa ny kampanj', en: 'Create New Campaign' },
    campaignName: { sv: 'Kampanjnamn', en: 'Campaign Name' },
    message: { sv: 'Meddelande', en: 'Message' },
    type: { sv: 'Typ', en: 'Type' },
    status: { sv: 'Status', en: 'Status' },
    created: { sv: 'Skapad', en: 'Created' },
    actions: { sv: 'Åtgärder', en: 'Actions' },
    edit: { sv: 'Redigera', en: 'Edit' },
    duplicate: { sv: 'Duplicera', en: 'Duplicate' },
    resend: { sv: 'Skicka igen', en: 'Resend' },
    delete: { sv: 'Ta bort', en: 'Delete' },
    confirmDelete: { sv: 'Är du säker på att du vill ta bort denna kampanj?', en: 'Are you sure you want to delete this campaign?' },
    sms: { sv: 'SMS', en: 'SMS' },
    email: { sv: 'E-post', en: 'Email' },
    draft: { sv: 'Utkast', en: 'Draft' },
    sent: { sv: 'Skickad', en: 'Sent' },
    scheduled: { sv: 'Schemalagd', en: 'Scheduled' },
    sendCampaign: { sv: 'Skicka kampanj', en: 'Send Campaign' },
    selectCustomers: { sv: 'Välj kunder', en: 'Select Customers' },
    allCustomers: { sv: 'Alla kunder', en: 'All Customers' },
    selectedCustomers: { sv: 'Valda kunder', en: 'Selected Customers' },
    sendToSelected: { sv: 'Skicka till valda', en: 'Send to Selected' },
    noCampaigns: { sv: 'Inga kampanjer hittades', en: 'No campaigns found' },
    getStarted: { sv: 'Kom igång med din första kampanj', en: 'Get started with your first campaign' },
    editCampaign: { sv: 'Redigera kampanj', en: 'Edit Campaign' },
    updateCampaign: { sv: 'Uppdatera kampanj', en: 'Update Campaign' },
    duplicateCampaign: { sv: 'Duplicera kampanj', en: 'Duplicate Campaign' },
    backToDashboard: { sv: 'Tillbaka till Dashboard', en: 'Back to Dashboard' },
    createNFCCampaign: { sv: 'Skapa NFC-kampanj', en: 'Create NFC Campaign' },
    campaignDetails: { sv: 'NFC-kampanjdetaljer', en: 'NFC Campaign Details' },
    campaignDetailsDescription: { sv: 'Skapa exklusiva erbjudanden för kunder som skannat dina NFC-taggar', en: 'Create exclusive deals for customers who scanned your NFC tags' },
    campaignType: { sv: 'Kampanjtyp', en: 'Campaign Type' },
    smsCampaign: { sv: 'SMS-kampanj', en: 'SMS Campaign' },
    emailCampaign: { sv: 'E-postkampanj', en: 'Email Campaign' },
    enterCampaignName: { sv: 'Ange kampanjnamn...', en: 'Enter campaign name...' },
    emailSubject: { sv: 'E-postämne', en: 'Email Subject' },
    enterEmailSubject: { sv: 'Ange e-postämne...', en: 'Enter email subject...' },
    smsMessage: { sv: 'SMS-meddelande', en: 'SMS Message' },
    emailContent: { sv: 'E-postinnehåll', en: 'Email Content' },
    writeSMSMessage: { sv: 'Skriv ditt SMS-meddelande...', en: 'Write your SMS message...' },
    writeEmailContent: { sv: 'Skriv ditt e-postinnehåll...', en: 'Write your email content...' },
    characters: { sv: 'tecken', en: 'characters' },
    templateVariables: { sv: 'Mallvariabler', en: 'Template Variables' },
    clickToInsert: { sv: 'Klicka för att infoga i ditt meddelande:', en: 'Click to insert into your message:' },
    aiEnhancement: { sv: 'AI-förbättring', en: 'AI Enhancement' },
    aiWillImprove: { sv: 'AI kommer att förbättra ditt innehåll', en: 'AI will improve your content' },
    manualContentOnly: { sv: 'Endast manuellt innehåll', en: 'Manual content only' },
    aiOff: { sv: 'AI Av', en: 'AI Off' },
    createCampaign: { sv: 'Skapa kampanj', en: 'Create Campaign' },
    enhancingWithAI: { sv: 'Förbättrar med AI...', en: 'Enhancing with AI...' },
    enhanceContentWithAI: { sv: 'Förbättra innehåll med AI', en: 'Enhance Content with AI' },
    reEnhance: { sv: 'Förbättra igen', en: 'Re-enhance' },
    creatingCampaign: { sv: 'Skapar kampanj...', en: 'Creating Campaign...' }
  },

  // Create Campaign
  createCampaign: {
    title: { sv: 'Skapa NFC-kampanj', en: 'Create NFC Campaign' },
    subtitle: { sv: 'Skicka exklusiva erbjudanden till kunder som scannat dina NFC-taggar', en: 'Send exclusive deals to customers who scanned your NFC tags' },
    campaignName: { sv: 'Kampanjnamn', en: 'Campaign Name' },
    campaignNamePlaceholder: { sv: 't.ex. Vinterrea 2025', en: 'e.g. Winter Sale 2025' },
    campaignType: { sv: 'Kampanjtyp', en: 'Campaign Type' },
    selectType: { sv: 'Välj typ', en: 'Select type' },
    message: { sv: 'Meddelande', en: 'Message' },
    messagePlaceholder: { sv: 'Skriv ditt kampanjmeddelande...', en: 'Write your campaign message...' },
    enhanceWithAI: { sv: 'Förbättra med AI', en: 'Enhance with AI' },
    create: { sv: 'Skapa kampanj', en: 'Create Campaign' },
    preview: { sv: 'Förhandsvisning', en: 'Preview' },
    customerWillReceive: { sv: 'Kunder kommer att få:', en: 'Customers will receive:' },
    backToCampaigns: { sv: 'Tillbaka till kampanjer', en: 'Back to Campaigns' },
    subject: { sv: 'Ämne', en: 'Subject' },
    subjectPlaceholder: { sv: 't.ex. Exklusivt erbjudande bara för dig!', en: 'e.g. Exclusive offer just for you!' },
    smsFrom: { sv: 'SMS från', en: 'SMS From' },
    smsFromPlaceholder: { sv: 't.ex. Ditt Företag', en: 'e.g. Your Business' },
    aiEnhancement: { sv: 'AI-förbättring', en: 'AI Enhancement' },
    enhancing: { sv: 'Förbättrar...', en: 'Enhancing...' },
    useAI: { sv: 'Använd AI för att förbättra meddelandet', en: 'Use AI to enhance the message' },
    campaignCreated: { sv: 'Kampanj skapad!', en: 'Campaign Created!' },
    campaignCreatedSuccess: { sv: 'Din kampanj har skapats framgångsrikt och är redo att skickas.', en: 'Your campaign has been created successfully and is ready to send.' },
    sendNow: { sv: 'Skicka nu', en: 'Send Now' },
    viewCampaigns: { sv: 'Visa kampanjer', en: 'View Campaigns' },
    creating: { sv: 'Skapar kampanj...', en: 'Creating campaign...' }
  },

  // Customer Form
  customerForm: {
    title: { sv: 'Registrera dig för exklusiva erbjudanden', en: 'Register for Exclusive Offers' },
    subtitle: { sv: 'Vi vill gärna hålla kontakten!', en: 'We\'d love to stay in touch!' },
    firstName: { sv: 'Förnamn', en: 'First Name' },
    lastName: { sv: 'Efternamn', en: 'Last Name' },
    email: { sv: 'E-post', en: 'Email' },
    phone: { sv: 'Telefon', en: 'Phone' },
    consent: { sv: 'Jag godkänner att mina uppgifter används för marknadsföring', en: 'I agree to receive marketing communications' },
    privacy: { sv: 'Jag har läst och godkänner integritetspolicyn', en: 'I have read and agree to the privacy policy' },
    submit: { sv: 'Registrera mig', en: 'Register Me' },
    success: { sv: 'Tack för din registrering!', en: 'Thank you for registering!' },
    successMessage: { sv: 'Du kommer snart att få exklusiva erbjudanden från oss.', en: 'You will soon receive exclusive offers from us.' }
  },

  // Authentication
  auth: {
    signIn: { sv: 'Logga in', en: 'Sign In' },
    signUp: { sv: 'Registrera konto', en: 'Sign Up' },
    email: { sv: 'Företagets e-postadress', en: 'Business Email Address' },
    password: { sv: 'Lösenord', en: 'Password' },
    confirmPassword: { sv: 'Bekräfta lösenord', en: 'Confirm Password' },
    businessName: { sv: 'Företagsnamn', en: 'Business Name' },
    forgotPassword: { sv: 'Glömt lösenord?', en: 'Forgot Password?' },
    noAccount: { sv: 'Har du inget företagskonto?', en: 'Don\'t have a business account?' },
    hasAccount: { sv: 'Har du redan ett konto?', en: 'Already have an account?' },
    welcome: { sv: 'Välkommen', en: 'Welcome' },
    loginToContinue: { sv: 'Logga in på ditt företagskonto för att hantera dina kundrelationer', en: 'Sign in to your business account to manage your customer relationships' },
    createBusinessAccount: { sv: 'Skapa företagskonto', en: 'Create Business Account' },
    joinBusinesses: { sv: 'Gå med tusentals företag som använder Klario för att utveckla sitt NFC-kundengagemang', en: 'Join thousands of businesses using Klario to grow their NFC customer engagement' },
    secureLogin: { sv: 'Säker inloggning', en: 'Secure Login' },
    mobileReady: { sv: 'Mobilvänlig', en: 'Mobile Ready' },
    rememberMe: { sv: 'Kom ihåg mig', en: 'Remember me' },
    signingIn: { sv: 'Loggar in...', en: 'Signing In...' },
    needHelp: { sv: 'Behöver du hjälp?', en: 'Need Help?' },
    contactSupport: { sv: 'Kontakta support', en: 'Contact support' },
    callUs: { sv: 'Ring oss', en: 'Call us' },
    visitHelpCenter: { sv: 'Besök vårt', en: 'Visit our' },
    helpCenter: { sv: 'Hjälpcenter', en: 'Help Center' },
    dataProtection: { sv: 'Din data är skyddad med företagssäkerhet på högsta nivå', en: 'Your data is protected with enterprise-grade security' },
    backHome: { sv: 'Tillbaka Hem', en: 'Back Home' },
    signInFailed: { sv: 'Inloggning misslyckades', en: 'Sign In Failed' },
    invalidCredentials: { sv: 'Ogiltiga uppgifter. Försök igen.', en: 'Invalid credentials. Please try again.' }
  },

  // Contact Page
  contact: {
    title: { sv: 'Kontakta oss', en: 'Contact Us' },
    subtitle: { sv: 'Vi hjälper dig gärna med dina frågor om NFC-kundengagemang och Klario-plattformen', en: 'We\'re happy to help with your questions about NFC customer engagement and the Klario platform' },
    contactInfo: { sv: 'Kontaktinformation', en: 'Contact Information' },
    email: { sv: 'E-post', en: 'Email' },
    phone: { sv: 'Telefon', en: 'Phone' },
    address: { sv: 'Adress', en: 'Address' },
    hours: { sv: 'Öppettider', en: 'Hours' },
    sendMessage: { sv: 'Skicka oss ett meddelande', en: 'Send us a message' },
    firstName: { sv: 'Förnamn', en: 'First Name' },
    lastName: { sv: 'Efternamn', en: 'Last Name' },
    company: { sv: 'Företag (valfritt)', en: 'Company (optional)' },
    subject: { sv: 'Ämne', en: 'Subject' },
    messageText: { sv: 'Meddelande', en: 'Message' },
    send: { sv: 'Skicka meddelande', en: 'Send Message' }
  },

  // Error Messages
  errors: {
    required: { sv: 'Detta fält är obligatoriskt', en: 'This field is required' },
    invalidEmail: { sv: 'Ogiltig e-postadress', en: 'Invalid email address' },
    invalidPhone: { sv: 'Ogiltigt telefonnummer', en: 'Invalid phone number' },
    passwordTooShort: { sv: 'Lösenordet måste vara minst 8 tecken', en: 'Password must be at least 8 characters' },
    passwordsDontMatch: { sv: 'Lösenorden stämmer inte överens', en: 'Passwords don\'t match' },
    networkError: { sv: 'Nätverksfel. Försök igen.', en: 'Network error. Please try again.' },
    unknownError: { sv: 'Ett okänt fel uppstod', en: 'An unknown error occurred' }
  },

  // Success Messages
  success: {
    campaignCreated: { sv: 'Kampanj skapad framgångsrikt!', en: 'Campaign created successfully!' },
    campaignUpdated: { sv: 'Kampanj uppdaterad framgångsrikt!', en: 'Campaign updated successfully!' },
    campaignDeleted: { sv: 'Kampanj borttagen framgångsrikt!', en: 'Campaign deleted successfully!' },
    customerAdded: { sv: 'Kund tillagd framgångsrikt!', en: 'Customer added successfully!' },
    messagesSent: { sv: 'Meddelanden skickade framgångsrikt!', en: 'Messages sent successfully!' }
  }
};

// Helper function to get nested translation
export function getTranslation(path: string, lang: Language, params?: { [key: string]: string }): string {
  const keys = path.split('.');
  let current: any = translations;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      console.warn(`Translation not found for path: ${path}`);
      return path; // Return the path as fallback
    }
  }
  
  if (current && typeof current === 'object' && lang in current) {
    let result = current[lang];
    
    // Replace parameters in the string
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        result = result.replace(`{${key}}`, value);
      });
    }
    
    return result;
  }
  
  console.warn(`Translation not found for path: ${path} and language: ${lang}`);
  return path; // Return the path as fallback
}

// Global language state
let currentLanguage: Language = 'sv';
let listeners: (() => void)[] = [];

// Initialize language from localStorage
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('klario-language');
  if (stored === 'sv' || stored === 'en') {
    currentLanguage = stored;
  }
}

// Hook for using translations with reactive updates
export function useTranslation() {
  const [language, setLanguageState] = useState<Language>(currentLanguage);

  useEffect(() => {
    // Subscribe to language changes
    const updateLanguage = () => {
      setLanguageState(currentLanguage);
    };
    listeners.push(updateLanguage);
    
    // Cleanup subscription
    return () => {
      listeners = listeners.filter(listener => listener !== updateLanguage);
    };
  }, []);

  const setLanguage = (lang: Language) => {
    currentLanguage = lang;
    if (typeof window !== 'undefined') {
      localStorage.setItem('klario-language', lang);
    }
    // Notify all listeners
    listeners.forEach(listener => listener());
  };

  const t = (path: string, params?: { [key: string]: string }) => {
    return getTranslation(path, language, params);
  };

  return { language, setLanguage, t };
}