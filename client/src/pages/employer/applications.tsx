import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Calendar, 
  Mail, 
  Phone, 
  Download, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Users
} from "lucide-react";

interface Application {
  id: number;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  jobTitle: string;
  jobId: number;
  appliedDate: string;
  status: "new" | "reviewed" | "shortlisted" | "interview" | "rejected" | "hired";
  experience: string;
  location: string;
  expectedSalary: string;
  resumeUrl?: string;
  coverLetter?: string;
  skills: string[];
}

export default function EmployerApplications({ user }: { user: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Mock applications data
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      candidateName: "Rahul Sharma",
      candidateEmail: "rahul.sharma@email.com",
      candidatePhone: "+91 98765 43210",
      jobTitle: "Senior Software Engineer",
      jobId: 1,
      appliedDate: "2025-01-20",
      status: "new",
      experience: "5 years",
      location: "Bangalore",
      expectedSalary: "15 LPA",
      skills: ["React", "Node.js", "Python", "AWS"],
      coverLetter: "I am excited about this opportunity to join your team..."
    },
    {
      id: 2,
      candidateName: "Priya Patel",
      candidateEmail: "priya.patel@email.com",
      candidatePhone: "+91 87654 32109",
      jobTitle: "Frontend Developer",
      jobId: 2,
      appliedDate: "2025-01-19",
      status: "reviewed",
      experience: "3 years",
      location: "Mumbai",
      expectedSalary: "12 LPA",
      skills: ["React", "JavaScript", "CSS", "TypeScript"],
      coverLetter: "With 3 years of frontend development experience..."
    },
    {
      id: 3,
      candidateName: "Amit Kumar",
      candidateEmail: "amit.kumar@email.com",
      candidatePhone: "+91 76543 21098",
      jobTitle: "Senior Software Engineer",
      jobId: 1,
      appliedDate: "2025-01-18",
      status: "shortlisted",
      experience: "7 years",
      location: "Hyderabad",
      expectedSalary: "18 LPA",
      skills: ["Java", "Spring Boot", "Docker", "Kubernetes"],
      coverLetter: "I bring extensive backend development experience..."
    },
    {
      id: 4,
      candidateName: "Sneha Reddy",
      candidateEmail: "sneha.reddy@email.com",
      candidatePhone: "+91 65432 10987",
      jobTitle: "Product Manager",
      jobId: 3,
      appliedDate: "2025-01-17",
      status: "interview",
      experience: "4 years",
      location: "Pune",
      expectedSalary: "20 LPA",
      skills: ["Product Strategy", "Analytics", "Agile", "User Research"],
      coverLetter: "As a product manager with strong analytical skills..."
    },
    {
      id: 5,
      candidateName: "Vikram Singh",
      candidateEmail: "vikram.singh@email.com",
      candidatePhone: "+91 54321 09876",
      jobTitle: "DevOps Engineer",
      jobId: 4,
      appliedDate: "2025-01-16",
      status: "rejected",
      experience: "2 years",
      location: "Chennai",
      expectedSalary: "10 LPA",
      skills: ["AWS", "Docker", "CI/CD", "Terraform"]
    }
  ]);

  const jobs = [
    { id: 1, title: "Senior Software Engineer" },
    { id: 2, title: "Frontend Developer" },
    { id: 3, title: "Product Manager" },
    { id: 4, title: "DevOps Engineer" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "reviewed": return "bg-yellow-100 text-yellow-800";
      case "shortlisted": return "bg-green-100 text-green-800";
      case "interview": return "bg-purple-100 text-purple-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "hired": return "bg-emerald-100 text-emerald-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return <Clock className="w-4 h-4" />;
      case "reviewed": return <Eye className="w-4 h-4" />;
      case "shortlisted": return <UserCheck className="w-4 h-4" />;
      case "interview": return <Calendar className="w-4 h-4" />;
      case "rejected": return <UserX className="w-4 h-4" />;
      case "hired": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const updateApplicationStatus = (id: number, newStatus: Application["status"]) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesJob = jobFilter === "all" || app.jobId.toString() === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      case "oldest":
        return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
      case "name":
        return a.candidateName.localeCompare(b.candidateName);
      default:
        return 0;
    }
  });

  const getStatusCounts = () => {
    return {
      total: applications.length,
      new: applications.filter(app => app.status === "new").length,
      reviewed: applications.filter(app => app.status === "reviewed").length,
      shortlisted: applications.filter(app => app.status === "shortlisted").length,
      interview: applications.filter(app => app.status === "interview").length,
      rejected: applications.filter(app => app.status === "rejected").length,
      hired: applications.filter(app => app.status === "hired").length,
    };
  };

  const statusCounts = getStatusCounts();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please log in as an employer to view applications</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Applications</h1>
          <p className="text-gray-600">Manage and review candidate applications</p>
        </div>

        {/* Application Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-2" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{statusCounts.total}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-blue-600 mr-2" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{statusCounts.new}</p>
                  <p className="text-xs text-gray-600">New</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Eye className="h-6 w-6 text-yellow-600 mr-2" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{statusCounts.reviewed}</p>
                  <p className="text-xs text-gray-600">Reviewed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <UserCheck className="h-6 w-6 text-green-600 mr-2" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{statusCounts.shortlisted}</p>
                  <p className="text-xs text-gray-600">Shortlisted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-purple-600 mr-2" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{statusCounts.interview}</p>
                  <p className="text-xs text-gray-600">Interview</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-emerald-600 mr-2" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{statusCounts.hired}</p>
                  <p className="text-xs text-gray-600">Hired</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by candidate name, email, or job title..."
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
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={jobFilter} onValueChange={setJobFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Job Position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    {jobs.map(job => (
                      <SelectItem key={job.id} value={job.id.toString()}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {sortedApplications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No applications found</p>
                <p className="text-sm text-gray-500">
                  {searchTerm || statusFilter !== "all" || jobFilter !== "all" 
                    ? "Try adjusting your filters"
                    : "Applications will appear here when candidates apply to your jobs"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>
                          {application.candidateName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.candidateName}
                          </h3>
                          <Badge className={`${getStatusColor(application.status)} flex items-center gap-1`}>
                            {getStatusIcon(application.status)}
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-2">{application.jobTitle}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Experience:</span> {application.experience}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {application.location}
                          </div>
                          <div>
                            <span className="font-medium">Expected Salary:</span> {application.expectedSalary}
                          </div>
                          <div>
                            <span className="font-medium">Applied:</span> {new Date(application.appliedDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {application.skills.slice(0, 4).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {application.skills.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{application.skills.length - 4} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {application.candidateEmail}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {application.candidatePhone}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Resume
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        {application.status === "new" && (
                          <Button 
                            size="sm" 
                            onClick={() => updateApplicationStatus(application.id, "shortlisted")}
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Shortlist
                          </Button>
                        )}
                        
                        {application.status === "shortlisted" && (
                          <Button 
                            size="sm" 
                            onClick={() => updateApplicationStatus(application.id, "interview")}
                          >
                            <Calendar className="w-4 h-4 mr-1" />
                            Interview
                          </Button>
                        )}
                        
                        {(application.status === "new" || application.status === "reviewed") && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => updateApplicationStatus(application.id, "rejected")}
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {application.coverLetter && (
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                      <p className="font-medium mb-1">Cover Letter:</p>
                      <p className="line-clamp-2">{application.coverLetter}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Bulk Actions */}
        {sortedApplications.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Bulk Actions</CardTitle>
              <CardDescription>Perform actions on multiple applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="outline">
                  Export Selected
                </Button>
                <Button variant="outline">
                  Send Bulk Email
                </Button>
                <Button variant="outline">
                  Archive Applications
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}