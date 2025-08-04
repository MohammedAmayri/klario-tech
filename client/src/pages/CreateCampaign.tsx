import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Phone, Mail, Zap, Send, Nfc, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
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

export default function CreateCampaign() {
  const [, setLocation] = useLocation();
  const [campaignType, setCampaignType] = useState<'sms' | 'email'>('sms');
  const [campaignName, setCampaignName] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [createdCampaign, setCreatedCampaign] = useState<Campaign | null>(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [sendingCampaign, setSendingCampaign] = useState(false);
  const [smsFrom, setSmsFrom] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const handleEnhanceWithAI = async () => {
    if (!campaignMessage.trim()) {
      toast({
        title: "No Content to Enhance",
        description: "Please write your campaign content first, then AI can enhance it.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/ai/enhance-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: campaignType,
          name: campaignName,
          subject: campaignSubject,
          message: campaignMessage,
          tone: 'professional'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setCampaignMessage(result.enhancedMessage);
        if (campaignType === 'email' && result.enhancedSubject) {
          setCampaignSubject(result.enhancedSubject);
        }
        setHasGenerated(true);
        toast({
          title: "Content Enhanced",
          description: "AI has improved your campaign content!",
        });
      } else {
        throw new Error('Failed to enhance content');
      }
    } catch (error: any) {
      toast({
        title: "AI Enhancement Failed",
        description: error.message || "Failed to enhance content with AI",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const campaignData = {
        name: campaignName,
        type: campaignType,
        subject: campaignType === 'email' ? campaignSubject : null,
        message: campaignMessage,
        status: 'draft'
      };

      const response = await fetch('/api/campaigns/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(campaignData),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Campaign Created",
          description: `${campaignName} has been created successfully.`,
        });
        setCreatedCampaign(result.campaign);
        await fetchCustomers();
        setIsSuccessDialogOpen(true);
      } else {
        throw new Error('Failed to create campaign');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCustomerSelection = (customerId: number) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const sendCampaignNow = async () => {
    if (!createdCampaign) return;
    
    // Validate SMS sender name for SMS campaigns
    if (createdCampaign.type === 'sms') {
      if (!smsFrom.trim()) {
        toast({
          title: 'SMS Sender Required',
          description: 'Please enter a sender name for your SMS campaign.',
          variant: 'destructive',
        });
        return;
      }
      
      if (smsFrom.length > 11) {
        toast({
          title: 'Sender Name Too Long',
          description: 'SMS sender name must be 11 characters or less.',
          variant: 'destructive',
        });
        return;
      }
      
      if (!/^[a-zA-Z0-9\s]+$/.test(smsFrom)) {
        toast({
          title: 'Invalid Characters',
          description: 'SMS sender name can only contain letters, numbers, and spaces.',
          variant: 'destructive',
        });
        return;
      }
    }
    
    setSendingCampaign(true);
    try {
      const endpoint = createdCampaign.type === 'sms' ? 'send-sms' : 'send-email';
      const response = await fetch(`/api/campaigns/${createdCampaign.id}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          customerIds: selectedCustomers.length > 0 ? selectedCustomers : [],
          smsFrom: createdCampaign.type === 'sms' ? smsFrom.trim() : undefined
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: 'Campaign Sent Successfully',
          description: `Sent to ${result.summary?.sent || 0} customers`,
        });
        setIsSuccessDialogOpen(false);
        setSmsFrom('');
        setLocation('/dashboard');
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send campaign',
        variant: 'destructive',
      });
    } finally {
      setSendingCampaign(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {t('campaigns.backToDashboard')}
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Nfc className="h-8 w-8 text-blue-600" />
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-gray-900">Klario</span>
                  <span className="text-sm text-gray-600 -mt-1">{t('campaigns.createNFCCampaign')}</span>
                </div>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-3xl p-6 border-b border-gray-200/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NFC Campaign Details</h1>
                <p className="text-sm text-gray-600">Create exclusive deals for customers who scanned your NFC tags</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campaign Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t('campaigns.campaignType')}</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={campaignType === 'sms' ? 'default' : 'outline'}
                    onClick={() => setCampaignType('sms')}
                    className="h-20 flex-col gap-2"
                  >
                    <Phone className="h-6 w-6" />
                    <span>{t('campaigns.smsCampaign')}</span>
                  </Button>
                  <Button
                    type="button"
                    variant={campaignType === 'email' ? 'default' : 'outline'}
                    onClick={() => setCampaignType('email')}
                    className="h-20 flex-col gap-2"
                  >
                    <Mail className="h-6 w-6" />
                    <span>{t('campaigns.emailCampaign')}</span>
                  </Button>
                </div>
              </div>

              {/* Campaign Content */}
              <div className="space-y-4">
                {/* Campaign Name */}
                <div className="space-y-2">
                  <Label htmlFor="campaignName">{t('campaigns.campaignName')}</Label>
                  <Input
                    id="campaignName"
                    placeholder={t('campaigns.enterCampaignName')}
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    required
                  />
                </div>

                {/* Email Subject (only for email campaigns) */}
                {campaignType === 'email' && (
                  <div className="space-y-2">
                    <Label htmlFor="campaignSubject">{t('campaigns.emailSubject')}</Label>
                    <Input
                      id="campaignSubject"
                      placeholder={t('campaigns.enterEmailSubject')}
                      value={campaignSubject}
                      onChange={(e) => setCampaignSubject(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Campaign Message */}
                <div className="space-y-2">
                  <Label htmlFor="campaignMessage">
                    {campaignType === 'sms' ? t('campaigns.smsMessage') : t('campaigns.emailContent')}
                  </Label>
                  <Textarea
                    id="campaignMessage"
                    placeholder={
                      campaignType === 'sms' 
                        ? t('campaigns.writeSMSMessage')
                        : t('campaigns.writeEmailContent')
                    }
                    value={campaignMessage}
                    onChange={(e) => setCampaignMessage(e.target.value)}
                    className="min-h-[120px]"
                    required
                  />
                  {campaignType === 'sms' && (
                    <p className="text-sm text-gray-500">
{campaignMessage.length} {t('campaigns.characters')}
                    </p>
                  )}
                </div>

                {/* Template Variables Help */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">{t('campaigns.templateVariables')}</h4>
                  <p className="text-sm text-blue-700 mb-3">{t('campaigns.clickToInsert')}</p>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const textarea = document.getElementById('campaignMessage') as HTMLTextAreaElement;
                        if (textarea) {
                          const cursorPos = textarea.selectionStart;
                          const textBefore = campaignMessage.substring(0, cursorPos);
                          const textAfter = campaignMessage.substring(cursorPos);
                          setCampaignMessage(textBefore + '{{name}}' + textAfter);
                          setTimeout(() => {
                            textarea.focus();
                            textarea.setSelectionRange(cursorPos + 8, cursorPos + 8);
                          }, 0);
                        }
                      }}
                    >
                      {'{{name}}'}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const textarea = document.getElementById('campaignMessage') as HTMLTextAreaElement;
                        if (textarea) {
                          const cursorPos = textarea.selectionStart;
                          const textBefore = campaignMessage.substring(0, cursorPos);
                          const textAfter = campaignMessage.substring(cursorPos);
                          setCampaignMessage(textBefore + '{{email}}' + textAfter);
                          setTimeout(() => {
                            textarea.focus();
                            textarea.setSelectionRange(cursorPos + 9, cursorPos + 9);
                          }, 0);
                        }
                      }}
                    >
                      {'{{email}}'}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const textarea = document.getElementById('campaignMessage') as HTMLTextAreaElement;
                        if (textarea) {
                          const cursorPos = textarea.selectionStart;
                          const textBefore = campaignMessage.substring(0, cursorPos);
                          const textAfter = campaignMessage.substring(cursorPos);
                          setCampaignMessage(textBefore + '{{phone}}' + textAfter);
                          setTimeout(() => {
                            textarea.focus();
                            textarea.setSelectionRange(cursorPos + 9, cursorPos + 9);
                          }, 0);
                        }
                      }}
                    >
                      {'{{phone}}'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI Enhancement Toggle */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{t('campaigns.aiEnhancement')}</h3>
                    <p className="text-sm text-gray-600">{useAI ? t('campaigns.aiWillImprove') : t('campaigns.manualContentOnly')}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant={useAI ? 'default' : 'outline'}
                  onClick={() => setUseAI(!useAI)}
                  className="min-w-[80px]"
                >
{useAI ? 'AI On' : t('campaigns.aiOff')}
                </Button>
              </div>

              {/* AI Enhancement Button */}
              {useAI && (
                <div className="space-y-3">
                  <Button
                    type="button"
                    onClick={handleEnhanceWithAI}
                    disabled={isGeneratingAI || !campaignMessage.trim()}
                    variant="outline"
                    className="w-full"
                  >
                    {isGeneratingAI ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
{t('campaigns.enhancingWithAI')}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
{t('campaigns.enhanceContentWithAI')}
                      </div>
                    )}
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {useAI && hasGenerated && (
                  <Button
                    type="button"
                    onClick={handleEnhanceWithAI}
                    disabled={isGeneratingAI || !campaignMessage.trim()}
                    variant="outline"
                    className="flex-1"
                  >
                    <Zap className="h-4 w-4 mr-2" />
{t('campaigns.reEnhance')}
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting || !campaignName || !campaignMessage}
                  className={`${useAI && hasGenerated ? 'flex-1' : 'w-full'} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
{t('campaigns.creatingCampaign')}
                    </div>
                  ) : (
t('campaigns.createCampaign')
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Campaign Success Dialog */}
        <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
          <DialogContent className="w-[90vw] max-w-xl">
            <DialogHeader>
              <DialogTitle>Campaign Created Successfully!</DialogTitle>
            </DialogHeader>
            
            {createdCampaign && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Campaign: {createdCampaign.name}</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    {createdCampaign.message}
                  </div>
                </div>

                {/* SMS Sender Name Input for SMS campaigns */}
                {createdCampaign.type === 'sms' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      SMS Sender Name *
                    </label>
                    <input
                      type="text"
                      value={smsFrom}
                      onChange={(e) => setSmsFrom(e.target.value)}
                      placeholder="Enter sender name (max 11 chars)"
                      maxLength={11}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>• Must be 11 characters or less</div>
                      <div>• Only letters, numbers, and spaces allowed</div>
                      <div>• This appears as the sender on recipient's phone</div>
                      <div>• Examples: "YourBrand", "Sale Alert", "Restaurant"</div>
                      <div className={`font-medium ${smsFrom.length > 11 ? 'text-red-600' : smsFrom.length > 8 ? 'text-orange-600' : 'text-green-600'}`}>
                        {smsFrom.length}/11 characters
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Send Campaign Now?</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const validCustomers = customers.filter(c => c.consentGiven && 
                          (createdCampaign.type === 'sms' ? c.phone : c.email));
                        if (selectedCustomers.length === validCustomers.length) {
                          setSelectedCustomers([]);
                        } else {
                          setSelectedCustomers(validCustomers.map(c => c.id));
                        }
                      }}
                      className="text-xs h-8"
                    >
                      {selectedCustomers.length === customers.filter(c => c.consentGiven && 
                        (createdCampaign.type === 'sms' ? c.phone : c.email)).length ? 
                        'Deselect All' : 'Send to All'
                      }
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Select customers or use "Send to All" for everyone with consent
                  </p>
                  
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {customers.filter(c => c.consentGiven && 
                      (createdCampaign.type === 'sms' ? c.phone : c.email)).map((customer) => (
                      <div key={customer.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`customer-${customer.id}`}
                          checked={selectedCustomers.includes(customer.id)}
                          onCheckedChange={() => toggleCustomerSelection(customer.id)}
                        />
                        <label 
                          htmlFor={`customer-${customer.id}`}
                          className="text-sm flex-1 cursor-pointer"
                        >
                          {customer.name} - {createdCampaign.type === 'sms' ? customer.phone : customer.email}
                        </label>
                      </div>
                    ))}
                  </div>

                  {customers.filter(c => c.consentGiven && 
                    (createdCampaign.type === 'sms' ? c.phone : c.email)).length === 0 && (
                    <p className="text-sm text-gray-500 py-4 text-center">
                      No eligible customers found for {createdCampaign.type} campaigns
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsSuccessDialogOpen(false);
                      setSmsFrom('');
                      toast({
                        title: 'Campaign Saved',
                        description: 'Your campaign has been saved and can be sent later from the campaigns page.',
                      });
                      setLocation('/campaigns');
                    }}
                    className="flex-1"
                  >
                    Send Later
                  </Button>
                  <Button 
                    onClick={sendCampaignNow}
                    disabled={sendingCampaign}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {sendingCampaign ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Now
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <Footer />
    </div>
  );
}