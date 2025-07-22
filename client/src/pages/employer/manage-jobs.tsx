import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Play, 
  Pause, 
  BarChart3, 
  Users, 
  Calendar,
  DollarSign,
  MapPin,
  Building2,
  TrendingUp
} from "lucide-react";
import { useLocation } from "wouter";

interface JobPosting {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  status: "active" | "paused" | "draft" | "closed";
  applications: number;
  views: number;
  postedDate: string;
  expiryDate: string;
  description: string;
}

export default function ManageJobs({ user }: { user: any }) {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Mock job postings data
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Bangalore",
      type: "Full-time",
      salary: "12-18 LPA",
      status: "active",
      applications: 24,
      views: 156,
      postedDate: "2025-01-15",
      expiryDate: "2025-02-15",
      description: "We are looking for a Senior Software Engineer to join our team..."
    },
    {
      id: 2,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Mumbai",
      type: "Full-time",
      salary: "8-12 LPA",
      status: "active",
      applications: 18,
      views: 98,
      postedDate: "2025-01-18",
      expiryDate: "2025-02-18",
      description: "Join our frontend team to build amazing user experiences..."
    },
    {
      id: 3,
      title: "Product Manager",
      department: "Product",
      location: "Hyderabad",
      type: "Full-time",
      salary: "15-22 LPA",
      status: "paused",
      applications: 31,
      views: 203,
      postedDate: "2025-01-10",
      expiryDate: "2025-02-10",
      description: "Lead product strategy and development for our core platform..."
    },
    {
      id: 4,
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Pune",
      type: "Full-time",
      salary: "10-15 LPA",
      status: "draft",
      applications: 0,
      views: 0,
      postedDate: "2025-01-20",
      expiryDate: "2025-02-20",
      description: "Help us scale our infrastructure and improve deployment processes..."
    },
    {
      id: 5,
      title: "UX Designer",
      department: "Design",
      location: "Chennai",
      type: "Contract",
      salary: "5-8 LPA",
      status: "closed",
      applications: 45,
      views: 287,
      postedDate: "2025-01-05",
      expiryDate: "2025-01-25",
      description: "Create beautiful and intuitive user experiences..."
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "draft": return "bg-blue-100 text-blue-800";
      case "closed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Play className="w-4 h-4" />;
      case "paused": return <Pause className="w-4 h-4" />;
      case "draft": return <Edit className="w-4 h-4" />;
      case "closed": return <Eye className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const updateJobStatus = (id: number, newStatus: JobPosting["status"]) => {
    setJobPostings(jobPostings.map(job => 
      job.id === id ? { ...job, status: newStatus } : job
    ));
  };

  const deleteJob = (id: number) => {
    setJobPostings(jobPostings.filter(job => job.id !== id));
  };

  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      case "applications":
        return b.applications - a.applications;
      case "views":
        return b.views - a.views;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getJobStats = () => {
    return {
      total: jobPostings.length,
      active: jobPostings.filter(job => job.status === "active").length,
      paused: jobPostings.filter(job => job.status === "paused").length,
      draft: jobPostings.filter(job => job.status === "draft").length,
      closed: jobPostings.filter(job => job.status === "closed").length,
      totalApplications: jobPostings.reduce((sum, job) => sum + job.applications, 0),
      totalViews: jobPostings.reduce((sum, job) => sum + job.views, 0),
    };
  };

  const stats = getJobStats();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please log in as an employer to manage jobs</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Job Postings</h1>
            <p className="text-gray-600">Create, edit, and track your job listings</p>
          </div>
          <Button onClick={() => setLocation("/employer/post-job")}>
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Job Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Building2 className="h-6 w-6 text-blue-600 mr-2" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-600">Total Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Play className="h-6 w-6 text-green-600 mr-2" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{stats.active}</p>
                  <p className="text-xs text-gray-600">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Pause className="h-6 w-6 text-yellow-600 mr-2" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{stats.paused}</p>
                  <p className="text-xs text-gray-600">Paused</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Edit className="h-6 w-6 text-blue-600 mr-2" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{stats.draft}</p>
                  <p className="text-xs text-gray-600">Draft</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-purple-600 mr-2" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{stats.totalApplications}</p>
                  <p className="text-xs text-gray-600">Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Eye className="h-6 w-6 text-indigo-600 mr-2" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{stats.totalViews}</p>
                  <p className="text-xs text-gray-600">Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-orange-600 mr-2" />
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {stats.totalApplications > 0 ? Math.round(stats.totalApplications / stats.active) : 0}
                  </p>
                  <p className="text-xs text-gray-600">Avg/Job</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search job titles, departments, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="applications">Applications</SelectItem>
                    <SelectItem value="views">Views</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="space-y-4">
          {sortedJobs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No job postings found</p>
                <p className="text-sm text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filters"
                    : "Create your first job posting to get started"
                  }
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Button onClick={() => setLocation("/employer/post-job")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Post Your First Job
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            sortedJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                            <Badge className={`${getStatusColor(job.status)} flex items-center gap-1`}>
                              {getStatusIcon(job.status)}
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Building2 className="w-4 h-4 mr-1" />
                              {job.department}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {job.salary}
                            </div>
                            <Badge variant="outline">{job.type}</Badge>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">{job.applications}</p>
                            <p className="text-gray-500">Applications</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <Eye className="w-4 h-4 mr-2 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">{job.views}</p>
                            <p className="text-gray-500">Views</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {new Date(job.postedDate).toLocaleDateString()}
                            </p>
                            <p className="text-gray-500">Posted</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-red-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {new Date(job.expiryDate).toLocaleDateString()}
                            </p>
                            <p className="text-gray-500">Expires</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-6">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Analytics
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4 mr-1" />
                          Duplicate
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        {job.status === "active" ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateJobStatus(job.id, "paused")}
                          >
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                          </Button>
                        ) : job.status === "paused" ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateJobStatus(job.id, "active")}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Resume
                          </Button>
                        ) : job.status === "draft" ? (
                          <Button 
                            size="sm"
                            onClick={() => updateJobStatus(job.id, "active")}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Publish
                          </Button>
                        ) : null}
                        
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteJob(job.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Status Toggle */}
                  {job.status === "active" && (
                    <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Label htmlFor={`auto-renew-${job.id}`} className="text-sm">
                          Auto-renew this job posting
                        </Label>
                        <Switch id={`auto-renew-${job.id}`} />
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setLocation(`/employer/applications?job=${job.id}`)}>
                        View {job.applications} Applications →
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Bulk Actions */}
        {sortedJobs.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Bulk Actions</CardTitle>
              <CardDescription>Perform actions on multiple job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline">
                  Pause Selected Jobs
                </Button>
                <Button variant="outline">
                  Activate Selected Jobs
                </Button>
                <Button variant="outline">
                  Export Job Data
                </Button>
                <Button variant="outline">
                  Clone Selected Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}