import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
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
  TrendingUp,
  Mail,
  MapPin,
  DollarSign,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  CheckCircle
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

const jobPostingSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  location: z.string().min(1, "Location is required"),
  experience: z.string().min(1, "Experience level is required"),
  employmentType: z.string().min(1, "Employment type is required"),
  salaryMin: z.number().min(0, "Minimum salary must be positive"),
  salaryMax: z.number().min(0, "Maximum salary must be positive"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z.string().min(10, "Requirements are required"),
  benefits: z.string().optional(),
  skills: z.string().min(1, "Required skills are needed")
});

type JobPostingFormData = z.infer<typeof jobPostingSchema>;

function PostJobForm({ user, onSuccess }: { user: User; onSuccess: () => void }) {
  const { toast } = useToast();
  
  const form = useForm<JobPostingFormData>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      title: "",
      location: "",
      experience: "",
      employmentType: "",
      salaryMin: 0,
      salaryMax: 0,
      description: "",
      requirements: "",
      benefits: "",
      skills: ""
    }
  });

  const createJobMutation = useMutation({
    mutationFn: async (data: JobPostingFormData) => {
      return apiRequest("POST", "/api/jobs", {
        ...data,
        companyId: 1, // Default company for now
        isActive: true,
        jobCategoryId: 1
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Job posted successfully!"
      });
      form.reset();
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post job",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: JobPostingFormData) => {
    createJobMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Senior Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Bangalore, Mumbai, Remote" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="2-4">2-4 years</SelectItem>
                    <SelectItem value="5-7">5-7 years</SelectItem>
                    <SelectItem value="8-10">8-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salaryMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Salary (LPA)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g. 10" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salaryMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Salary (LPA)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g. 18" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description *</FormLabel>
              <FormControl>
                <Textarea 
                  rows={6}
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements *</FormLabel>
              <FormControl>
                <Textarea 
                  rows={4}
                  placeholder="List the key qualifications and requirements..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Skills *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. React, Node.js, Python, AWS (comma separated)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="benefits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Benefits & Perks</FormLabel>
              <FormControl>
                <Textarea 
                  rows={3}
                  placeholder="Describe the benefits, perks, and company culture..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
            disabled={createJobMutation.isPending}
          >
            {createJobMutation.isPending ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Posting...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Clear Form
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function EmployerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in and is an employer
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (!parsedUser.role || !parsedUser.role.startsWith('employer_')) {
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
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="post-job">Post Job</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                  <Button 
                    className="h-20 flex flex-col gap-2" 
                    variant="outline"
                    onClick={() => setActiveTab("post-job")}
                  >
                    <Plus className="h-5 w-5" />
                    Post New Job
                  </Button>
                  <Button 
                    className="h-20 flex flex-col gap-2" 
                    variant="outline"
                    onClick={() => setActiveTab("candidates")}
                  >
                    <Search className="h-5 w-5" />
                    Search Candidates
                  </Button>
                  <Button 
                    className="h-20 flex flex-col gap-2" 
                    variant="outline"
                    onClick={() => setActiveTab("team")}
                  >
                    <UserPlus className="h-5 w-5" />
                    Invite HR Member
                  </Button>
                  <Button 
                    className="h-20 flex flex-col gap-2" 
                    variant="outline"
                    onClick={() => setActiveTab("analytics")}
                  >
                    <TrendingUp className="h-5 w-5" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Post Job Tab */}
          <TabsContent value="post-job" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
              <CardHeader>
                <CardTitle>Post New Job</CardTitle>
                <CardDescription>Create a new job posting to attract top talent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <PostJobForm user={user} onSuccess={() => {
                  toast({
                    title: "Job Posted Successfully",
                    description: "Your job posting is now live and visible to candidates."
                  });
                  setActiveTab("overview");
                }} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates" className="space-y-6">
            {/* Enhanced Candidate Search with Usage Tracking */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
              <CardHeader>
                <CardTitle>Search Candidates</CardTitle>
                <CardDescription>Find potential candidates with advanced search filters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search-skills">Required Skills</Label>
                    <Input id="search-skills" placeholder="React, Node.js, Python" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="search-location">Location</Label>
                    <Input id="search-location" placeholder="Bangalore, Mumbai, Remote" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="search-experience">Experience Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-2">0-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="6-8">6-8 years</SelectItem>
                        <SelectItem value="9+">9+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {companyData?.monthlySearchLimit - companyData?.searchesUsed || 0} searches remaining this month
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Advanced Filters
                    </Button>
                    <Button>
                      <Search className="h-4 w-4 mr-2" />
                      Search Candidates
                    </Button>
                  </div>
                </div>
                
                {/* Premium Feature Notice for Free Users */}
                {companyData?.subscriptionPlan === 'free' && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-green-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Crown className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="font-medium text-purple-900">Limited Free Search</h4>
                        <p className="text-sm text-purple-700">Basic search with 10 searches/month. Upgrade for advanced filters and 30 searches + 15 downloads.</p>
                      </div>
                      <Button size="sm" onClick={() => setActiveTab("subscription")}>
                        Upgrade ₹500/month
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Search Results */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
              <CardHeader>
                <CardTitle>Recent Search Results</CardTitle>
                <CardDescription>Candidates matching your recent searches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Priya Sharma", skills: "React, Node.js, TypeScript", experience: "4 years", location: "Bangalore", salary: "₹12-15 LPA" },
                    { name: "Rahul Kumar", skills: "Python, Django, AWS, Docker", experience: "6 years", location: "Mumbai", salary: "₹18-22 LPA" },
                    { name: "Anita Singh", skills: "Java, Spring Boot, Microservices", experience: "5 years", location: "Pune", salary: "₹15-18 LPA" }
                  ].map((candidate, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-green-600 text-white">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h5 className="font-medium">{candidate.name}</h5>
                          <p className="text-sm text-gray-600">{candidate.skills}</p>
                          <p className="text-xs text-gray-500">{candidate.experience} • {candidate.location} • {candidate.salary}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Profile
                        </Button>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download Resume
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            {/* Invite HR Member */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
              <CardHeader>
                <CardTitle>Invite HR Team Member</CardTitle>
                <CardDescription>Add HR staff to help with recruitment and candidate management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hr-email">HR Email Address</Label>
                    <Input id="hr-email" type="email" placeholder="hr@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hr-role">Role Assignment</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr">HR Staff - Basic Access</SelectItem>
                        <SelectItem value="senior_hr">Senior HR - Advanced Access</SelectItem>
                        <SelectItem value="recruiter">Recruiter - Search & Contact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Switch id="search-candidates" />
                      <Label htmlFor="search-candidates" className="text-sm">Search Candidates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="download-resumes" />
                      <Label htmlFor="download-resumes" className="text-sm">Download Resumes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="post-jobs" />
                      <Label htmlFor="post-jobs" className="text-sm">Post Jobs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="manage-applications" />
                      <Label htmlFor="manage-applications" className="text-sm">Manage Applications</Label>
                    </div>
                  </div>
                </div>
                <Button className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </CardContent>
            </Card>

            {/* Current Team Members */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
              <CardHeader>
                <CardTitle>Current Team Members</CardTitle>
                <CardDescription>Manage existing HR team members and their access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "You (Admin)", email: user?.email, role: "Company Admin", status: "Active", permissions: ["Full Access"] },
                    { name: "Sarah HR", email: "hr@techcorp.com", role: "HR Manager", status: "Active", permissions: ["Search", "Download", "Post Jobs"] },
                    { name: "Mike Recruiter", email: "mike@techcorp.com", role: "Recruiter", status: "Pending", permissions: ["Search", "Contact"] }
                  ].map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-green-600 text-white">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h5 className="font-medium">{member.name}</h5>
                          <p className="text-sm text-gray-600">{member.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>
                              {member.status}
                            </Badge>
                            <span className="text-xs text-gray-500">{member.role}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit Permissions
                        </Button>
                        {member.name !== "You (Admin)" && (
                          <Button size="sm" variant="outline">
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            {/* Current Plan Status */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>Your current plan and usage statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-green-50 rounded-lg border border-purple-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-purple-600" />
                      <h3 className="text-xl font-semibold">
                        {companyData?.subscriptionPlan?.charAt(0).toUpperCase() + companyData?.subscriptionPlan?.slice(1) || 'Free'} Plan
                      </h3>
                    </div>
                    <p className="text-gray-600 mt-1">
                      {companyData?.monthlySearchLimit || 10} searches • {companyData?.monthlyDownloadLimit || 5} downloads per month
                    </p>
                    <div className="flex gap-4 mt-3">
                      <div className="text-sm">
                        <span className="text-gray-500">Searches: </span>
                        <span className="font-medium">{companyData?.searchesUsed || 0}/{companyData?.monthlySearchLimit || 10}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Downloads: </span>
                        <span className="font-medium">{companyData?.downloadsUsed || 0}/{companyData?.monthlyDownloadLimit || 5}</span>
                      </div>
                    </div>
                  </div>
                  {companyData?.subscriptionPlan === 'free' && (
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-green-600">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Upgrade Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Available Plans */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
              <CardHeader>
                <CardTitle>Available Plans</CardTitle>
                <CardDescription>Choose the plan that fits your hiring needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Free Plan */}
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold">Free Plan</h3>
                      <div className="text-3xl font-bold mt-2">₹0</div>
                      <p className="text-gray-600">per month</p>
                    </div>
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">10 candidate searches</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">5 resume downloads</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Basic job posting</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Email support</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-6"
                      disabled={companyData?.subscriptionPlan === 'free'}
                    >
                      {companyData?.subscriptionPlan === 'free' ? 'Current Plan' : 'Downgrade'}
                    </Button>
                  </div>

                  {/* Basic Plan */}
                  <div className="border-2 border-purple-500 rounded-lg p-6 bg-white relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-600">Recommended</Badge>
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold">Basic Plan</h3>
                      <div className="text-3xl font-bold mt-2 text-purple-600">₹500</div>
                      <p className="text-gray-600">per month</p>
                    </div>
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">30 candidate searches</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">15 resume downloads</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Advanced job posting</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Priority support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Analytics dashboard</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-6 bg-gradient-to-r from-purple-600 to-green-600"
                      disabled={companyData?.subscriptionPlan === 'basic'}
                    >
                      {companyData?.subscriptionPlan === 'basic' ? 'Current Plan' : 'Upgrade to Basic'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
              <CardHeader>
                <CardTitle>HR Analytics & Usage</CardTitle>
                <CardDescription>Track your team's hiring performance and platform usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-semibold">HR Searches</h4>
                        <p className="text-2xl font-bold">24</p>
                        <p className="text-xs text-gray-500">This month</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Download className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-semibold">Downloads</h4>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-xs text-gray-500">This month</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <PieChart className="h-8 w-8 text-purple-600" />
                      <div>
                        <h4 className="font-semibold">Hires</h4>
                        <p className="text-2xl font-bold">3</p>
                        <p className="text-xs text-gray-500">This month</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-8 w-8 text-orange-600" />
                      <div>
                        <h4 className="font-semibold">Success Rate</h4>
                        <p className="text-2xl font-bold">12.5%</p>
                        <p className="text-xs text-gray-500">Hire/Search ratio</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
                <CardHeader>
                  <CardTitle>Team Search Activity</CardTitle>
                  <CardDescription>Search activity by team members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "You (Admin)", searches: 15, downloads: 8, hires: 2 },
                      { name: "Sarah HR", searches: 9, downloads: 4, hires: 1 },
                      { name: "Mike Recruiter", searches: 0, downloads: 0, hires: 0 }
                    ].map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.name}</span>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>{member.searches} searches</span>
                          <span>{member.downloads} downloads</span>
                          <span>{member.hires} hires</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
                <CardHeader>
                  <CardTitle>Subscription Usage</CardTitle>
                  <CardDescription>Monthly usage vs limits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Candidate Searches</span>
                        <span>{companyData?.searchesUsed || 0}/{companyData?.monthlySearchLimit || 10}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min((companyData?.searchesUsed || 0) / (companyData?.monthlySearchLimit || 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Resume Downloads</span>
                        <span>{companyData?.downloadsUsed || 0}/{companyData?.monthlyDownloadLimit || 5}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min((companyData?.downloadsUsed || 0) / (companyData?.monthlyDownloadLimit || 5) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    {companyData?.subscriptionPlan === 'free' && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                          Upgrade to Basic plan for 3x more searches and downloads. Perfect for growing teams.
                        </p>
                        <Button size="sm" className="mt-2" onClick={() => setActiveTab("subscription")}>
                          View Plans
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Company Profile Settings */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>Update your company information displayed to candidates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" placeholder="Your company name" defaultValue={companyData?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-website">Website URL</Label>
                    <Input id="company-website" placeholder="https://company.com" defaultValue={companyData?.website} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-location">Location</Label>
                    <Input id="company-location" placeholder="Bangalore, India" defaultValue={companyData?.location} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-industry">Industry</Label>
                    <Input id="company-industry" placeholder="Technology, Healthcare, etc." defaultValue={companyData?.industry} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-description">Company Description</Label>
                  <Textarea 
                    id="company-description" 
                    rows={4}
                    placeholder="Brief description of your company, culture, and mission..."
                    defaultValue={companyData?.description}
                  />
                </div>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Update Company Profile
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage email notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">New Job Applications</Label>
                      <p className="text-sm text-gray-600">Get notified when candidates apply to your jobs</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Monthly Usage Reports</Label>
                      <p className="text-sm text-gray-600">Receive monthly analytics and usage summaries</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Subscription Alerts</Label>
                      <p className="text-sm text-gray-600">Alerts when approaching usage limits</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Team Activity Updates</Label>
                      <p className="text-sm text-gray-600">Notifications about HR team member activities</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <Button variant="outline">
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}