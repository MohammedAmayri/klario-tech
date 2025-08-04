
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Star, Users, MessageSquare, TrendingUp, Shield, Zap, Globe, Phone, Mail, MapPin, Smartphone, Nfc, QrCode } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import CustomerForm from "@/components/CustomerForm";
import Dashboard from "@/components/Dashboard";
import LanguageToggle from "@/components/LanguageToggle";
import { useTranslation } from "@/lib/i18n";
import KlarioLogo from "@/components/KlarioLogo";

const Index = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'customer-form' | 'dashboard'>('home');
  const [merchantId, setMerchantId] = useState("demo-merchant-123");
  const { t } = useTranslation();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
    }
  };

  if (currentView === 'customer-form') {
    return <CustomerForm merchantId={merchantId} onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'dashboard') {
    return <Dashboard merchantId={merchantId} onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <Nfc className="h-8 w-8 text-blue-600" />
              <div className="flex flex-col">
                <span className="font-bold text-xl text-gray-900">Klario</span>
                <span className="text-sm text-gray-600 -mt-1">{t('landing.subtitle').split('.')[0]}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <nav className="hidden md:flex space-x-6">
                <a href="#hem" className="text-gray-600 hover:text-blue-600">{t('nav.home')}</a>
                <a href="#om" className="text-gray-600 hover:text-blue-600">{t('nav.about')}</a>
                <a href="#funktioner" className="text-gray-600 hover:text-blue-600">{t('nav.features')}</a>
                <a href="#kontakt" className="text-gray-600 hover:text-blue-600">{t('nav.contact')}</a>
              </nav>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => window.location.href = '/business/signin'}
              >
                {t('nav.login')}
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section id="hem" className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 animate-fade-in">
            {t('landing.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {t('landing.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg"
              onClick={() => setCurrentView('customer-form')}
            >
              {t('landing.getStarted')}
            </Button>
            <Button 
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-full"
              onClick={() => setCurrentView('dashboard')}
            >
              {t('dashboard.title')}
            </Button>
            <Button 
              variant="outline" 
              className="border-green-600 text-green-600 hover:bg-green-50 font-bold py-3 px-8 rounded-full"
              onClick={() => window.location.href = '/ai-campaigns'}
            >
              {t('dashboard.aiCampaigns')}
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="om" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('nav.about')} Klario
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              {t('landing.aboutDescription')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Nfc className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('landing.nfcInnovation')}</h3>
              <p className="text-gray-600">{t('landing.nfcInnovationDesc')}</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('landing.aiPowered')}</h3>
              <p className="text-gray-600">{t('landing.aiPoweredDesc')}</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('landing.customerFirst')}</h3>
              <p className="text-gray-600">{t('landing.customerFirstDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funktioner" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('landing.featuresTitle')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('landing.featuresSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center"><Nfc className="mr-2 text-blue-500" /> {t('landing.smartNfc')}</CardTitle>
                <CardDescription>{t('landing.smartNfcDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                {t('landing.smartNfcContent')}
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center"><Star className="mr-2 text-yellow-500" /> {t('landing.aiCampaigns')}</CardTitle>
                <CardDescription>{t('landing.aiCampaignsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                {t('landing.aiCampaignsContent')}
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center"><Users className="mr-2 text-green-500" /> {t('landing.customerInsights')}</CardTitle>
                <CardDescription>{t('landing.customerInsightsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                {t('landing.customerInsightsContent')}
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center"><MessageSquare className="mr-2 text-purple-500" /> {t('landing.multichannel')}</CardTitle>
                <CardDescription>{t('landing.multichannelDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                {t('landing.multichannelContent')}
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center"><TrendingUp className="mr-2 text-orange-500" /> {t('landing.realTimeAnalytics')}</CardTitle>
                <CardDescription>{t('landing.realTimeAnalyticsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                {t('landing.realTimeAnalyticsContent')}
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center"><Shield className="mr-2 text-teal-500" /> {t('landing.gdprSecure')}</CardTitle>
                <CardDescription>{t('landing.gdprSecureDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                {t('landing.gdprSecureContent')}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="priser" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('landing.pricingTitle')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('landing.pricingSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 relative">
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-100 text-green-800">{t('landing.freeTrial')}</Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-purple-600">399</span>
                  <span className="text-gray-600"> SEK/månad</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{t('landing.monthlyContract')}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {t('landing.upTo100Customers')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {t('landing.oneNfcCard')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {t('landing.basicAnalytics')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {t('landing.emailSupport')}
                  </li>
                </ul>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => window.location.href = '/api/payment/initiate?plan=starter'}
                >
                  {t('landing.startFreeTrial')}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  {t('landing.cancelAnytime')}
                </p>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 relative border-purple-200">
              <div className="absolute top-4 right-4">
                <Badge className="bg-purple-100 text-purple-800">{t('landing.popular')}</Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">Professional</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-purple-600">799</span>
                  <span className="text-gray-600"> SEK/månad</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{t('landing.monthlyContract')}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {t('landing.upTo500Customers')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {t('landing.fiveNfcCards')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {t('landing.aiMessageGeneration')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {t('landing.multichannelCampaigns')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {t('landing.advancedAnalytics')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {t('landing.prioritySupport')}
                  </li>
                </ul>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => window.location.href = '/api/payment/initiate?plan=professional'}
                >
                  {t('landing.startFreeTrial')}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  {t('landing.cancelAnytime')}
                </p>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 relative">
              <div className="absolute top-4 right-4">
                <Badge className="bg-blue-100 text-blue-800">{t('landing.custom')}</Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-purple-600">{t('landing.custom')}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{t('landing.forLargeOrgs')}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {t('landing.unlimitedCustomers')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {t('landing.customNfcCards')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {t('landing.whiteLabelSolution')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {t('landing.customIntegrations')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {t('landing.dedicatedSupport')}
                  </li>
                </ul>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => window.location.href = '/contact'}
                >
                  {t('landing.contactSales')}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  {t('landing.customTerms')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose KLARIO Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
{t('landing.whyChooseTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center justify-center">
                <Nfc className="mr-2 text-purple-500" /> {t('landing.instantNfcConnection')}
              </h3>
              <p className="text-gray-600">
                {t('landing.instantNfcDesc')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center justify-center">
                <Zap className="mr-2 text-blue-500" /> {t('landing.aiDrivenAutomation')}
              </h3>
              <p className="text-gray-600">
                {t('landing.aiDrivenDesc')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center justify-center">
                <Smartphone className="mr-2 text-green-500" /> {t('landing.mobileFocusedDesign')}
              </h3>
              <p className="text-gray-600">
                {t('landing.mobileFocusedDesc')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center justify-center">
                <Globe className="mr-2 text-orange-500" /> {t('landing.multichannelIntegration')}
              </h3>
              <p className="text-gray-600">
                {t('landing.multichannelIntegrationDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Book a Meeting Section */}
      <section id="bokning" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('landing.readyToTransform')}
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('landing.ctaDescription')}
          </p>
          <div className="max-w-md mx-auto">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg mb-4"
              onClick={() => window.open('https://calendly.com/klario-demo', '_blank')}
            >
              {t('landing.bookFreeDemo')}
            </Button>
            <p className="text-sm text-gray-500">
              {t('landing.noCommitment')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontakt" className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
{t('landing.contactUsToday')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <Phone className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Telefon</h3>
              <p>+46 8 123 456 78</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">E-post</h3>
              <p>hej@klario.se</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Adress</h3>
              <p>Storgatan 123<br />111 22 Stockholm</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Index;
