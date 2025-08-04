import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Mail, Phone, Send, Calendar, Users, Eye, Plus, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MessageAssistant from "./MessageAssistant";

interface CampaignManagerProps {
  merchantId: string;
}

const CampaignManager = ({ merchantId }: CampaignManagerProps) => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "",
    message: "",
    schedule: "immediate",
    audience: "all"
  });

  // Mock campaign data
  const campaigns = [
    {
      id: 1,
      name: "Welcome Series",
      type: "email",
      status: "Active",
      sent: 24,
      opened: 18,
      clicked: 12,
      createdAt: "2024-01-15",
      nextSend: "2024-01-21"
    },
    {
      id: 2,
      name: "Review Request",
      type: "sms",
      status: "Scheduled",
      sent: 0,
      opened: 0,
      clicked: 0,
      createdAt: "2024-01-20",
      nextSend: "2024-01-22"
    },
    {
      id: 3,
      name: "Special Offer",
      type: "whatsapp",
      status: "Draft",
      sent: 0,
      opened: 0,
      clicked: 0,
      createdAt: "2024-01-19",
      nextSend: null
    }
  ];

  const templates = [
    {
      id: 1,
      name: "Welcome Message",
      type: "email",
      subject: "Welcome to our community!",
      content: "Thank you for joining us. We're excited to serve you!"
    },
    {
      id: 2,
      name: "Review Request",
      type: "sms",
      subject: null,
      content: "Hi {{name}}! We hope you enjoyed your experience. Could you leave us a review? {{review_link}}"
    },
    {
      id: 3,
      name: "Follow-up",
      type: "whatsapp",
      subject: null,
      content: "Hello {{name}}! Just checking in to see how everything is going. Let us know if you need anything!"
    }
  ];

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.type || !newCampaign.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    console.log("Creating campaign:", newCampaign);
    toast({
      title: "Campaign Created",
      description: `${newCampaign.name} has been created successfully.`,
    });

    // Reset form
    setNewCampaign({
      name: "",
      type: "",
      message: "",
      schedule: "immediate",
      audience: "all"
    });
  };

  const handleAiMessageSelect = (message: string) => {
    setNewCampaign({...newCampaign, message});
    setShowAiAssistant(false);
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="w-4 h-4" />;
      case "sms":
        return <Phone className="w-4 h-4" />;
      case "whatsapp":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create Campaign</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                    <p className="text-3xl font-bold">
                      {campaigns.filter(c => c.status === "Active").length}
                    </p>
                  </div>
                  <Send className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                    <p className="text-3xl font-bold">
                      {campaigns.reduce((sum, c) => sum + c.sent, 0)}
                    </p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Open Rate</p>
                    <p className="text-3xl font-bold">75%</p>
                  </div>
                  <Eye className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Campaign List</CardTitle>
                  <CardDescription>
                    Manage your customer engagement campaigns
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setSelectedTab("create")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                            {getChannelIcon(campaign.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{campaign.name}</h3>
                            <p className="text-sm text-gray-600 capitalize">{campaign.type} Campaign</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                          {campaign.nextSend && (
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              Next: {campaign.nextSend}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Sent:</span> {campaign.sent}
                          </div>
                          <div>
                            <span className="font-medium">Opened:</span> {campaign.opened}
                          </div>
                          <div>
                            <span className="font-medium">Clicked:</span> {campaign.clicked}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
              <CardDescription>
                Design and launch your customer engagement campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name *</Label>
                    <Input
                      id="campaign-name"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                      placeholder="Enter campaign name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="campaign-type">Channel *</Label>
                    <Select 
                      value={newCampaign.type} 
                      onValueChange={(value) => setNewCampaign({...newCampaign, type: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>Email</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="sms">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>SMS</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="whatsapp">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4" />
                            <span>WhatsApp</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="campaign-message">Message *</Label>
                    <Dialog open={showAiAssistant} onOpenChange={setShowAiAssistant}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-purple-600 border-purple-200 hover:bg-purple-50"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          AI Assist
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>AI Message Assistant</DialogTitle>
                          <DialogDescription>
                            Generate engaging messages with AI assistance
                          </DialogDescription>
                        </DialogHeader>
                        <MessageAssistant 
                          onMessageSelect={handleAiMessageSelect}
                          initialChannel={newCampaign.type}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Textarea
                    id="campaign-message"
                    value={newCampaign.message}
                    onChange={(e) => setNewCampaign({...newCampaign, message: e.target.value})}
                    placeholder="Enter your message (use placeholders for personalization)"
                    className="mt-1 min-h-32"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tip: Use placeholders like [NAME], [EMAIL], or [REVIEW_LINK] for personalization
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="campaign-schedule">Schedule</Label>
                    <Select 
                      value={newCampaign.schedule} 
                      onValueChange={(value) => setNewCampaign({...newCampaign, schedule: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Send Immediately</SelectItem>
                        <SelectItem value="delayed">Send Later</SelectItem>
                        <SelectItem value="recurring">Recurring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="campaign-audience">Audience</Label>
                    <Select 
                      value={newCampaign.audience} 
                      onValueChange={(value) => setNewCampaign({...newCampaign, audience: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        <SelectItem value="active">Active Customers</SelectItem>
                        <SelectItem value="new">New Customers</SelectItem>
                        <SelectItem value="vip">VIP Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline">Save as Draft</Button>
                  <Button 
                    onClick={handleCreateCampaign}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Create Campaign
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
              <CardDescription>
                Pre-built templates to speed up your campaign creation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        {getChannelIcon(template.type)}
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className="w-fit capitalize">
                        {template.type}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      {template.subject && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-600">Subject:</p>
                          <p className="text-sm">{template.subject}</p>
                        </div>
                      )}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600">Content:</p>
                        <p className="text-sm text-gray-700 line-clamp-3">{template.content}</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignManager;
