import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Building2, 
  Users, 
  MessageSquare, 
  Activity, 
  AlertTriangle,
  LogOut,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface SuperAdmin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
}

interface Business {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface PlatformStats {
  totalBusinesses: number;
  totalCustomers: number;
  totalCampaigns: number;
}

interface DashboardData {
  statistics: PlatformStats;
  recentBusinesses: Business[];
  chartData: any[];
}

export default function SuperAdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [admin, setAdmin] = useState<SuperAdmin | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAdminData();
    loadDashboardData();
  }, []);

  const loadAdminData = async () => {
    try {
      const response = await fetch('/api/superadmin/me');
      if (response.ok) {
        const data = await response.json();
        setAdmin(data);
      } else {
        setLocation('/superadmin/login');
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setLocation('/superadmin/login');
    }
  };

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/superadmin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('Network error loading dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/superadmin/logout', { method: 'POST' });
      toast({
        title: 'Logged Out',
        description: 'You have been securely logged out',
      });
      setLocation('/superadmin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Admin Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-red-400">Error</CardTitle>
            <CardDescription className="text-gray-300">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Klario Super Admin
                </h1>
                <p className="text-sm text-gray-300">Platform Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {admin && (
                <div className="text-right">
                  <p className="text-white font-medium">{admin.firstName} {admin.lastName}</p>
                  <p className="text-xs text-gray-300">{admin.email}</p>
                </div>
              )}
              <Button 
                variant="ghost" 
                onClick={handleLogout} 
                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-sm border-white/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
              <Activity className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="businesses" className="text-white data-[state=active]:bg-white/20">
              <Building2 className="w-4 h-4 mr-2" />
              Businesses
            </TabsTrigger>
            <TabsTrigger value="audit" className="text-white data-[state=active]:bg-white/20">
              <Shield className="w-4 h-4 mr-2" />
              Audit Log
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {dashboardData && (
              <>
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Total Businesses</CardTitle>
                      <Building2 className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{dashboardData.statistics.totalBusinesses}</div>
                      <p className="text-xs text-gray-400">Active business accounts</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Total Customers</CardTitle>
                      <Users className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{dashboardData.statistics.totalCustomers}</div>
                      <p className="text-xs text-gray-400">Registered customers</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Total Campaigns</CardTitle>
                      <MessageSquare className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{dashboardData.statistics.totalCampaigns}</div>
                      <p className="text-xs text-gray-400">Marketing campaigns</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Businesses */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Business Registrations</CardTitle>
                    <CardDescription className="text-gray-300">
                      Latest businesses that joined the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.recentBusinesses.map((business) => (
                        <div key={business.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <p className="font-medium text-white">{business.name}</p>
                            <p className="text-sm text-gray-400">{business.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-300">
                              {format(new Date(business.createdAt), 'MMM dd, yyyy')}
                            </p>
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                              Active
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Businesses Tab */}
          <TabsContent value="businesses">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Business Management</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage all business accounts on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Business management interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Audit Log</CardTitle>
                <CardDescription className="text-gray-300">
                  Track all administrative actions and system events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Audit log interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}