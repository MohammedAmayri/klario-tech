import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { 
  Plus, Send, MessageSquare, Users, Zap, Loader2, 
  Edit, Trash2, Copy, RotateCcw, Phone, Mail, 
  ArrowLeft, MoreVertical, Nfc 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import Footer from '@/components/Footer';
import LanguageToggle from '@/components/LanguageToggle';
import { useTranslation } from '@/lib/i18n';

interface Campaign {
  id: number;
  businessId: number;
  name: string;
  message: string;
  subject?: string;
  type: string;
  status: string;
  targetAudience?: string[];
  createdAt: string;
  sentAt?: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  consentGiven: boolean;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingCampaign, setSendingCampaign] = useState<number | null>(null);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [smsFrom, setSmsFrom] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    subject: '',
    message: '',
    type: 'sms' as 'sms' | 'email'
  });
  const { t } = useTranslation();
  
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [campaignsRes, customersRes] = await Promise.all([
        fetch('/api/campaigns', { credentials: 'include' }),
        fetch('/api/customers', { credentials: 'include' })
      ]);

      // Check for unauthorized access
      if (campaignsRes.status === 401 || customersRes.status === 401) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access your campaigns.",
          variant: "destructive",
        });
        // Redirect to sign-in page after a short delay
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
        return;
      }

      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        setCampaigns(campaignsData.campaigns);
      }

      if (customersRes.ok) {
        const customersData = await customersRes.json();
        setCustomers(customersData.customers);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Connection Error",
        description: "Unable to load campaign data. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };



  // Campaign management functions
  const editCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setEditForm({
      name: campaign.name,
      subject: campaign.subject || '',
      message: campaign.message,
      type: campaign.type as 'sms' | 'email'
    });
    setIsEditDialogOpen(true);
  };

  const saveCampaignEdit = async () => {
    if (!selectedCampaign) return;
    
    try {
      const response = await fetch(`/api/campaigns/${selectedCampaign.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm)
      });

      if (response.status === 401) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
        return;
      }

      if (response.ok) {
        toast({
          title: 'Campaign Updated',
          description: 'Campaign has been updated successfully.',
        });
        setIsEditDialogOpen(false);
        fetchData();
      } else {
        throw new Error('Failed to update campaign');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update campaign',
        variant: 'destructive',
      });
    }
  };

  const deleteCampaign = async (campaignId: number) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.status === 401) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
        return;
      }

      if (response.ok) {
        // Immediately update the local state by removing the deleted campaign
        setCampaigns(prevCampaigns => prevCampaigns.filter(c => c.id !== campaignId));
        
        toast({
          title: 'Campaign Deleted',
          description: 'Campaign has been deleted successfully.',
        });
        
        // Also refresh data from server to ensure consistency
        fetchData();
      } else {
        throw new Error('Failed to delete campaign');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete campaign',
        variant: 'destructive',
      });
    }
  };

  const duplicateCampaign = async (campaignId: number) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/duplicate`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.status === 401) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
        return;
      }

      if (response.ok) {
        toast({
          title: 'Campaign Duplicated',
          description: 'Campaign has been duplicated successfully.',
        });
        fetchData();
      } else {
        throw new Error('Failed to duplicate campaign');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to duplicate campaign',
        variant: 'destructive',
      });
    }
  };

  const sendSMSCampaign = async (campaignId: number) => {
    // Validate SMS sender name for SMS campaigns
    if (selectedCampaign?.type === 'sms') {
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

    setSendingCampaign(campaignId);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          customerIds: selectedCustomers.length > 0 ? selectedCustomers : undefined,
          smsFrom: selectedCampaign?.type === 'sms' ? smsFrom.trim() : undefined
        })
      });

      if (response.status === 401) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
        return;
      }

      if (response.ok) {
        const result = await response.json();
        toast({
          title: 'SMS Campaign Sent',
          description: `Successfully sent to ${result.summary.sent} customers. ${result.summary.failed} failed.`,
        });
        setIsSendDialogOpen(false);
        setSelectedCustomers([]);
        setSmsFrom('');
        fetchData();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send SMS campaign',
        variant: 'destructive',
      });
    } finally {
      setSendingCampaign(null);
    }
  };

  const openSendDialog = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setSelectedCustomers([]);
    setSmsFrom(''); // Reset SMS sender name
    setIsSendDialogOpen(true);
  };

  const toggleCustomerSelection = (customerId: number) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('campaigns.backToDashboard')}
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Nfc className="h-8 w-8 text-blue-600" />
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-gray-900">Klario</span>
                  <span className="text-sm text-gray-600 -mt-1">{t('campaigns.title')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <Link href="/create-campaign">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {t('campaigns.createNew')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">

      {/* Campaign Management Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">NFC Customer Campaigns</h2>
        <p className="text-sm text-gray-600 mt-1">Send exclusive deals to customers who scanned your NFC tags</p>
      </div>

      {/* Campaigns Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="relative hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/60 backdrop-blur-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{campaign.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={campaign.status === 'sent' ? 'default' : 'secondary'}>
                    {campaign.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => editCampaign(campaign)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateCampaign(campaign.id)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openSendDialog(campaign)}>
                        <Send className="h-4 w-4 mr-2" />
                        Resend
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteCampaign(campaign.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardDescription>
                Created {new Date(campaign.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {campaign.type === 'sms' ? (
                    <Phone className="h-4 w-4" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  <span>{campaign.type.toUpperCase()} Campaign</span>
                </div>
                
                {campaign.subject && (
                  <p className="text-sm font-medium text-gray-800">
                    Subject: {campaign.subject}
                  </p>
                )}
                
                <p className="text-sm text-gray-700 line-clamp-3">
                  {campaign.message}
                </p>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => editCampaign(campaign)}
                    className="flex-1 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => openSendDialog(campaign)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {campaigns.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-lg max-w-md mx-auto p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No campaigns yet</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Create your first AI-powered campaign to engage with your NFC customers</p>
              <Link href="/create-campaign">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg px-6 py-3">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Campaign
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Edit Campaign Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Campaign Name</Label>
              <Input
                id="editName"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter campaign name..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editType">Campaign Type</Label>
              <Select 
                value={editForm.type} 
                onValueChange={(value) => setEditForm(prev => ({ ...prev, type: value as 'sms' | 'email' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editForm.type === 'email' && (
              <div className="space-y-2">
                <Label htmlFor="editSubject">Email Subject</Label>
                <Input
                  id="editSubject"
                  value={editForm.subject}
                  onChange={(e) => setEditForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject..."
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="editMessage">
                {editForm.type === 'sms' ? 'SMS Message' : 'Email Content'}
              </Label>
              <Textarea
                id="editMessage"
                value={editForm.message}
                onChange={(e) => setEditForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder={
                  editForm.type === 'sms' 
                    ? "Write your SMS message..." 
                    : "Write your email content..."
                }
                className="min-h-[120px]"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={saveCampaignEdit}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Campaign Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Campaign</DialogTitle>
          </DialogHeader>
          
          {selectedCampaign && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Campaign: {selectedCampaign.name}</h4>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  {selectedCampaign.subject && (
                    <div className="font-medium mb-1">Subject: {selectedCampaign.subject}</div>
                  )}
                  {selectedCampaign.message}
                </div>
              </div>

              {/* SMS Sender Name Input for SMS campaigns */}
              {selectedCampaign.type === 'sms' && (
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
                  <h4 className="font-medium">Select Customers</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const validCustomers = customers.filter(c => c.phone);
                      if (selectedCustomers.length === validCustomers.length) {
                        setSelectedCustomers([]);
                      } else {
                        setSelectedCustomers(validCustomers.map(c => c.id));
                      }
                    }}
                    className="text-xs h-8"
                  >
                    {selectedCustomers.length === customers.filter(c => c.phone).length ? 
                      'Deselect All' : 'Send to All'
                    }
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Select specific customers or use "Send to All" for everyone with phone numbers
                </p>
                
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {customers.filter(c => c.phone).map((customer) => (
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
                        {customer.name} - {customer.phone}
                      </label>
                    </div>
                  ))}
                </div>

                {customers.filter(c => c.phone).length === 0 && (
                  <p className="text-sm text-gray-500 py-4 text-center">
                    No customers with phone numbers available
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsSendDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => sendSMSCampaign(selectedCampaign.id)}
                  disabled={sendingCampaign === selectedCampaign.id}
                  className="flex-1"
                >
                  {sendingCampaign === selectedCampaign.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send {selectedCampaign.type.toUpperCase()}
                    </>
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