import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Users, MessageSquare, TrendingUp, Plus, Search, Filter, Send, Eye, MoreHorizontal, ArrowLeft, Shield, Mail, Phone, Settings, LogOut, Nfc } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import AddCustomerForm from '@/components/AddCustomerForm';
import Footer from '@/components/Footer';
import LanguageToggle from '@/components/LanguageToggle';
import { useTranslation } from '@/lib/i18n';

interface Business {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  consentGiven: boolean;
  source: string;
  createdAt: string;
}

interface Campaign {
  id: number;
  name: string;
  type: string;
  status: string;
  message: string;
  createdAt: string;
}

function Dashboard() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [business, setBusiness] = useState<Business | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchBusinessData(),
          fetchCustomers(),
          fetchCampaigns()
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Fallback timeout to prevent infinite loading
    const fallbackTimer = setTimeout(() => {
      if (!business) {
        console.warn('Loading timeout - setting fallback business');
        setBusiness({
          id: 0,
          name: 'Business Dashboard',
          email: '',
          phone: '',
          createdAt: new Date().toISOString()
        });
      }
      setIsLoading(false);
    }, 10000); // 10 second timeout
    
    return () => clearTimeout(fallbackTimer);
  }, []);

  const fetchBusinessData = async () => {
    try {
      const response = await fetch('/api/business/profile');
      if (response.ok) {
        const data = await response.json();
        console.log('Business profile data:', data);
        setBusiness(data.business || data);
      } else {
        console.error('Failed to fetch business profile:', response.status);
        // Set a default business to prevent infinite loading
        setBusiness({
          id: 0,
          name: 'Business Dashboard',
          email: '',
          phone: '',
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
      // Set a default business to prevent infinite loading
      setBusiness({
        id: 0,
        name: 'Business Dashboard',
        email: '',
        phone: '',
        createdAt: new Date().toISOString()
      });
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(Array.isArray(data.customers) ? data.customers : []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(Array.isArray(data.campaigns) ? data.campaigns : []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    }
  };

  const handleCustomerAdded = (newCustomer: Customer) => {
    setCustomers(prev => [newCustomer, ...prev]);
    setIsAddCustomerOpen(false);
    toast({
      title: t('dashboard.customerAdded'),
      description: t('dashboard.customerAddedDescription'),
    });
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const filteredCustomers = Array.isArray(customers) ? customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase())
  ) : [];

  const totalCustomers = Array.isArray(customers) ? customers.length : 0;
  const consentedCustomers = Array.isArray(customers) ? customers.filter(c => c.consentGiven).length : 0;
  const activeCampaigns = Array.isArray(campaigns) ? campaigns.filter(c => c.status === 'sent').length : 0;

  if (isLoading && !business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('dashboard.loadingDashboard') || 'Loading dashboard...'}</p>
        </div>
      </div>
    );
  }

  // Fallback business if loading failed
  const displayBusiness = business || {
    id: 0,
    name: 'Business Dashboard',
    email: '',
    phone: '',
    createdAt: new Date().toISOString()
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Nfc className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">Klario</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <LanguageToggle />
              
              
              
              
              
              <Link href="/campaigns">
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50 shadow-sm flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {t('dashboard.viewCampaigns')}
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleSignOut} className="hover:bg-red-50 text-red-600 flex items-center gap-2">
                <LogOut className="h-4 w-4" />
               {t('nav.logout')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Top Header with Back Button and New Campaign */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('dashboard.businessDashboard') || 'Business Dashboard'}</h1>
                <p className="text-sm text-gray-500">{t('dashboard.merchantId') || 'Merchant ID'}: {displayBusiness.name.toLowerCase().replace(/\s+/g, '-')}</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">{t('dashboard.totalCustomers')}</p>
                <p className="text-3xl font-bold text-blue-900">{totalCustomers}</p>
                <p className="text-xs text-blue-600 mt-1">{t('dashboard.totalCustomersGrowth')}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">{t('dashboard.activeCustomers')}</p>
                <p className="text-3xl font-bold text-green-900">{consentedCustomers}</p>
                <p className="text-xs text-green-600 mt-1">{t('dashboard.activeCustomersDesc')}</p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">{t('dashboard.consentRate')}</p>
                <p className="text-3xl font-bold text-purple-900">
                  {totalCustomers > 0 ? Math.round((consentedCustomers / totalCustomers) * 100) : 100}%
                </p>
                <p className="text-xs text-purple-600 mt-1">{t('dashboard.gdprCompliant')}</p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-medium">{t('dashboard.avgResponse')}</p>
                <p className="text-3xl font-bold text-orange-900">2.3 hours</p>
                <p className="text-xs text-orange-600 mt-1">{t('dashboard.responseTime')}</p>
              </div>
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>



        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{t('dashboard.activeCampaigns')}</p>
                <p className="text-3xl font-bold text-gray-900">{activeCampaigns}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Send className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{t('dashboard.messagesSent')}</p>
                <p className="text-3xl font-bold text-gray-900">24</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{t('dashboard.avgOpenRate')}</p>
                <p className="text-3xl font-bold text-gray-900">75%</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Campaign List */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t('dashboard.campaignList')}</h2>
              <p className="text-sm text-gray-500">{t('dashboard.campaignListDesc')}</p>
            </div>
            <Link href="/create-campaign">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2">
                <Plus className="h-4 w-4" />
{t('dashboard.addCampaign')}
              </Button>
            </Link>
          </div>
          
          <div className="p-6">
            {Array.isArray(campaigns) && campaigns.length > 0 ? (
              <div className="space-y-4">
                {campaigns.slice(0, 3).map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                        <p className="text-sm text-gray-500">
{campaign.type === 'email' ? t('dashboard.emailCampaign') : t('dashboard.smsCampaign')}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={campaign.status === 'sent' ? 'default' : campaign.status === 'draft' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
{campaign.status === 'sent' ? t('dashboard.active') : campaign.status}
                          </Badge>
                          <span className="text-xs text-gray-400">
{t('dashboard.next')}: {new Date(campaign.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('dashboard.noCampaignsYet')}</h3>
                <p className="text-gray-500 mb-4">{t('dashboard.noCampaignsDesc')}</p>
                <Link href="/create-campaign">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
{t('dashboard.createCampaign')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Customer Database Section */}
        <div className="bg-white rounded-xl border border-gray-200 mt-8">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t('dashboard.customerDatabase')}</h2>
              <p className="text-sm text-gray-500">{t('dashboard.customerDatabaseDesc')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {t('dashboard.addCustomer')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t('dashboard.addNewCustomer')}</DialogTitle>
                  </DialogHeader>
                  <AddCustomerForm onCustomerAdded={handleCustomerAdded} />
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {t('dashboard.filter')}
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                {t('dashboard.export')}
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t('dashboard.searchCustomers')}
                value={customerSearchTerm}
                onChange={(e) => setCustomerSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {filteredCustomers.length > 0 ? (
              <div className="space-y-3">
                {filteredCustomers.slice(0, 5).map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{customer.name}</h3>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={customer.consentGiven ? 'default' : 'secondary'} className="text-xs">
{customer.consentGiven ? t('dashboard.vip') : t('dashboard.regular')}
                          </Badge>
                          <Badge variant={customer.consentGiven ? 'default' : 'outline'} className="text-xs">
{customer.consentGiven ? t('dashboard.active') : t('dashboard.newCustomer')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                          <span>{t('dashboard.consent')}: {new Date(customer.createdAt).toLocaleDateString()}</span>
                          <span>{t('dashboard.source')}: {customer.source}</span>
                          <span>{t('dashboard.lastContact')}: {new Date(customer.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('dashboard.noCustomersYet')}</h3>
                <p className="text-gray-500 mb-4">{t('dashboard.noCustomersMessage')}</p>
                <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
{t('dashboard.addCustomer')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{t('dashboard.addNewCustomer')}</DialogTitle>
                    </DialogHeader>
                    <AddCustomerForm onCustomerAdded={handleCustomerAdded} />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Dashboard;