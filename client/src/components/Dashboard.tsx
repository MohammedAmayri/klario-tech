
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, Search, Filter, MessageSquare, Mail, Phone, Download, Plus, TrendingUp, Clock, Shield, Star } from "lucide-react";
import CampaignManager from "./CampaignManager";

interface DashboardProps {
  merchantId: string;
  onBack: () => void;
}

const Dashboard = ({ merchantId, onBack }: DashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("customers");

  // Mock customer data
  const customers = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 234 567 8901",
      consentGiven: true,
      consentDate: "2024-01-15",
      source: "NFC Card #001",
      status: "Active",
      lastContact: "2024-01-20",
      tags: ["VIP", "Regular"]
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 234 567 8902",
      consentGiven: true,
      consentDate: "2024-01-14",
      source: "NFC Card #002",
      status: "Active",
      lastContact: "2024-01-19",
      tags: ["New Customer"]
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike.wilson@email.com",
      phone: "",
      consentGiven: true,
      consentDate: "2024-01-13",
      source: "NFC Card #001",
      status: "Inactive",
      lastContact: "2024-01-13",
      tags: ["Follow-up Needed"]
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === "Active").length,
    consentRate: 100,
    avgResponseTime: "2.3 hours"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="hover:bg-blue-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Business Dashboard</h1>
                  <p className="text-sm text-gray-500">Merchant ID: {merchantId}</p>
                </div>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Customers</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.totalCustomers}</p>
                  <p className="text-xs text-blue-600 mt-2 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700 mb-1">Active Customers</p>
                  <p className="text-3xl font-bold text-emerald-900">{stats.activeCustomers}</p>
                  <p className="text-xs text-emerald-600 mt-2 flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                    Engaged this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-1">Consent Rate</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.consentRate}%</p>
                  <p className="text-xs text-purple-600 mt-2 flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    GDPR Compliant
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700 mb-1">Avg Response</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.avgResponseTime}</p>
                  <p className="text-xs text-orange-600 mt-2 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Response time
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white shadow-sm border-0">
            <TabsTrigger value="customers" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Users className="w-4 h-4 mr-2" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Star className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customers">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl text-gray-900">Customer Database</CardTitle>
                    <CardDescription className="text-gray-500">
                      Manage your GDPR-compliant customer contacts
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="hover:bg-gray-50">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-gray-50">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCustomers.map((customer) => (
                    <div key={customer.id} className="border border-gray-100 rounded-xl p-5 hover:bg-gray-50/50 hover:border-blue-200 transition-all duration-200 hover:shadow-md">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{customer.name}</h3>
                              <p className="text-sm text-gray-600">{customer.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {customer.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">
                                {tag}
                              </Badge>
                            ))}
                            <Badge 
                              variant={customer.status === "Active" ? "default" : "outline"}
                              className={`text-xs ${customer.status === "Active" ? "bg-emerald-100 text-emerald-700" : ""}`}
                            >
                              {customer.status}
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-gray-500 space-y-1">
                            <p className="flex items-center">
                              <Shield className="w-3 h-3 mr-1" />
                              Consent: {customer.consentDate} | Source: {customer.source}
                            </p>
                            <p className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              Last Contact: {customer.lastContact}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {customer.phone && (
                            <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300">
                              <Phone className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignManager merchantId={merchantId} />
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Analytics & Insights</CardTitle>
                <CardDescription className="text-gray-500">
                  Track your customer engagement performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Star className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Analytics Coming Soon</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Detailed analytics and reporting features will be available in the next update. Track engagement rates, campaign performance, and customer insights.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
