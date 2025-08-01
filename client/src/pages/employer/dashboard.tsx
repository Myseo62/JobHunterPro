import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Building2, 
  Users, 
  Briefcase, 
  Search, 
  Settings, 
  CreditCard,
  Plus,
  Download,
  Eye,
  UserPlus,
  Crown,
  Activity,
  TrendingUp
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Company {
  id: number;
  name: string;
  subscriptionPlan: string;
  monthlySearchLimit: number;
  monthlyDownloadLimit: number;
  searchesUsed: number;
  downloadsUsed: number;
}

interface Stats {
  activeJobs: number;
  totalApplications: number;
}

export default function EmployerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  useEffect(() => {
    // TEMPORARILY DISABLED: Employer dashboard is under maintenance
    toast({
      title: "Dashboard Temporarily Unavailable",
      description: "The employer dashboard is currently under maintenance. Please check back later.",
      variant: "destructive",
    });
    window.location.href = "/";
    return;

    // Original code commented out for temporary disable
    /*
    // Check if user is logged in and is an employer
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (!parsedUser.role.startsWith('employer_')) {
        toast({
          title: "Access Denied",
          description: "This area is for employers only.",
          variant: "destructive",
        });
        window.location.href = "/";
        return;
      }
      setUser(parsedUser);
    } else {
      window.location.href = "/auth/employer-login";
    }
    */
  }, [toast]);

  const { data: companyData } = useQuery<Company>({
    queryKey: ["/api/employer/company"],
    enabled: !!user,
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/employer/stats"],
    enabled: !!user,
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage your job postings, candidates, and team from one place</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activeJobs || 0}</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalApplications || 0}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Searches Used</CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {companyData?.searchesUsed || 0}/{companyData?.monthlySearchLimit || 10}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Downloads Used</CardTitle>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {companyData?.downloadsUsed || 0}/{companyData?.monthlyDownloadLimit || 5}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks to get you started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col gap-2" variant="outline">
                    <Plus className="h-5 w-5" />
                    Post New Job
                  </Button>
                  <Button className="h-20 flex flex-col gap-2" variant="outline">
                    <Search className="h-5 w-5" />
                    Search Candidates
                  </Button>
                  <Button className="h-20 flex flex-col gap-2" variant="outline">
                    <UserPlus className="h-5 w-5" />
                    Invite HR Member
                  </Button>
                  <Button className="h-20 flex flex-col gap-2" variant="outline">
                    <TrendingUp className="h-5 w-5" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
              <CardHeader>
                <CardTitle>Job Management</CardTitle>
                <CardDescription>Manage your job postings and applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Job Management</h3>
                  <p className="text-gray-600 mb-6">Coming soon! Manage all your job postings and track applications here.</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Job
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
              <CardHeader>
                <CardTitle>Candidate Search</CardTitle>
                <CardDescription>
                  Search and download candidate profiles based on your subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Candidate Search</h3>
                  <p className="text-gray-600 mb-6">
                    Find the perfect candidates for your job openings. 
                    You have {companyData?.monthlySearchLimit - companyData?.searchesUsed || 0} searches remaining this month.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button>
                      <Search className="h-4 w-4 mr-2" />
                      Search Candidates
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Search History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>Manage HR employees and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Team Management</h3>
                  <p className="text-gray-600 mb-6">Invite HR members and assign role-based permissions for job posting and candidate search.</p>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite HR Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>Manage your subscription plan and usage limits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current Plan */}
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-green-50 rounded-lg">
                    <div>
                      <h3 className="text-lg font-semibold">Current Plan: {companyData?.subscriptionPlan?.charAt(0).toUpperCase() + companyData?.subscriptionPlan?.slice(1) || 'Free'}</h3>
                      <p className="text-gray-600">
                        {companyData?.monthlySearchLimit || 10} searches & {companyData?.monthlyDownloadLimit || 5} downloads per month
                      </p>
                    </div>
                    <Button>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  </div>

                  {/* Usage Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Candidate Searches</span>
                        <span>{companyData?.searchesUsed || 0}/{companyData?.monthlySearchLimit || 10}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-green-600 h-2 rounded-full" 
                          style={{ width: `${((companyData?.searchesUsed || 0) / (companyData?.monthlySearchLimit || 10)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Profile Downloads</span>
                        <span>{companyData?.downloadsUsed || 0}/{companyData?.monthlyDownloadLimit || 5}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-green-600 h-2 rounded-full" 
                          style={{ width: `${((companyData?.downloadsUsed || 0) / (companyData?.monthlyDownloadLimit || 5)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
              <CardHeader>
                <CardTitle>Company Settings</CardTitle>
                <CardDescription>Manage your company profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Company Settings</h3>
                  <p className="text-gray-600 mb-6">Update your company information, billing details, and notification preferences.</p>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}