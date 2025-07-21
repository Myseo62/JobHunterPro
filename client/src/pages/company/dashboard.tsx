import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Building, 
  Edit, 
  Save, 
  X, 
  Users, 
  Briefcase, 
  Eye, 
  MapPin, 
  Globe, 
  Star,
  Calendar,
  TrendingUp,
  UserPlus
} from "lucide-react";

interface Company {
  id: number;
  name: string;
  description: string;
  industry: string;
  website: string;
  location: string;
  logo: string;
  employeeCount: string;
  rating: number;
  reviewCount: number;
  companyType: string;
}

interface Job {
  id: number;
  title: string;
  location: string;
  experience: string;
  salaryMin: number;
  salaryMax: number;
  applicationCount: number;
  postedAt: string;
  isActive: boolean;
  companyId?: number;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface CompanyDashboardProps {
  user: User | null;
}

export default function CompanyDashboard({ user }: CompanyDashboardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Company>>({});

  // Fetch company data (assuming user is associated with a company)
  const { data: company, isLoading: companyLoading } = useQuery<Company>({
    queryKey: ['/api/companies', 1], // For demo purposes, using company ID 1
    enabled: !!user,
  });

  // Fetch company jobs
  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
    enabled: !!user,
  });

  // Update company mutation
  const updateCompanyMutation = useMutation({
    mutationFn: async (data: Partial<Company>) => {
      const response = await apiRequest("PUT", `/api/companies/${company?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      setIsEditing(false);
      setEditData({});
      toast({
        title: "Company Updated",
        description: "Your company information has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "There was an error updating your company information.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(company || {});
  };

  const handleSave = () => {
    updateCompanyMutation.mutate(editData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center">
        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md p-8">
          <div className="text-center">
            <Building className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-4">Please log in to access the company dashboard.</p>
            <Button onClick={() => setLocation("/employer/login")}>
              Sign In
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (companyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Building className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading company dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user.firstName}! Manage your company profile and job postings.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setLocation("/employer/post-job")}
                className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/company/profile")}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Public Profile
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:flex">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Company Profile</TabsTrigger>
            <TabsTrigger value="jobs">Job Postings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stats Cards */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Total Jobs</p>
                      <p className="text-2xl font-bold">{jobs.length}</p>
                    </div>
                    <Briefcase className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-600 to-green-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Active Jobs</p>
                      <p className="text-2xl font-bold">{jobs.filter(job => job.isActive).length}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Applications</p>
                      <p className="text-2xl font-bold">
                        {jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0)}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Company Rating</p>
                      <p className="text-2xl font-bold">{company?.rating || "N/A"}</p>
                    </div>
                    <Star className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Jobs */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Recent Job Postings</CardTitle>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Loading jobs...</p>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No job postings yet</p>
                    <Button
                      onClick={() => setLocation("/employer/post-job")}
                      className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                    >
                      Post Your First Job
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{job.title}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </span>
                            <span>{job.experience}</span>
                            <span>{job.applicationCount} applications</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={job.isActive ? "default" : "secondary"}>
                            {job.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-gray-900">Company Information</CardTitle>
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      size="sm"
                      disabled={updateCompanyMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {!isEditing ? (
                  // View Mode
                  <div className="space-y-6">
                    <div className="flex items-start gap-6">
                      <div className="w-24 h-24 bg-purple-100 rounded-lg flex items-center justify-center">
                        {company?.logo ? (
                          <img src={company.logo} alt={company.name} className="w-16 h-16 object-contain" />
                        ) : (
                          <Building className="h-12 w-12 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900">{company?.name || "Company Name"}</h3>
                        <p className="text-gray-600 mt-1">{company?.industry || "Industry"}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {company?.location || "Location"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {company?.employeeCount || "N/A"} employees
                          </span>
                          {company?.website && (
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                                Website
                              </a>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">About Company</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {company?.description || "No description available."}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <Input
                          value={editData.name || ""}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                        <Input
                          value={editData.industry || ""}
                          onChange={(e) => setEditData(prev => ({ ...prev, industry: e.target.value }))}
                          placeholder="e.g. Technology, Finance"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <Input
                          value={editData.location || ""}
                          onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Enter company location"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee Count</label>
                        <Input
                          value={editData.employeeCount || ""}
                          onChange={(e) => setEditData(prev => ({ ...prev, employeeCount: e.target.value }))}
                          placeholder="e.g. 50-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <Input
                          value={editData.website || ""}
                          onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://company.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
                        <Input
                          value={editData.companyType || ""}
                          onChange={(e) => setEditData(prev => ({ ...prev, companyType: e.target.value }))}
                          placeholder="e.g. MNC, Startup, Product"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                      <Textarea
                        value={editData.description || ""}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your company, culture, and values..."
                        className="h-32"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-gray-900">Job Postings</CardTitle>
                <Button
                  onClick={() => setLocation("/employer/post-job")}
                  className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading job postings...</p>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Job Postings Yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Start building your team by posting your first job opening. Reach thousands of qualified candidates today.
                    </p>
                    <Button
                      onClick={() => setLocation("/employer/post-job")}
                      className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                    >
                      Create First Job Posting
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
                              <Badge variant={job.isActive ? "default" : "secondary"}>
                                {job.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {job.experience}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(job.postedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                              <span className="text-green-600 font-medium">
                                ₹{job.salaryMin?.toLocaleString()} - ₹{job.salaryMax?.toLocaleString()}
                              </span>
                              <span className="text-blue-600 font-medium">
                                {job.applicationCount} applications
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Company Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Get insights into your job posting performance, application trends, and candidate analytics.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}