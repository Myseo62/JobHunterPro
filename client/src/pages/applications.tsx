import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Search, MapPin, Calendar, Building2, Clock, CheckCircle, XCircle, Eye, Download } from "lucide-react";
import { useLocation } from "wouter";

interface Application {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: "pending" | "reviewed" | "shortlisted" | "interview" | "rejected" | "hired";
  salary: string;
  type: string;
  notes?: string;
  interviewDate?: string;
}

export default function Applications({ user }: { user: any }) {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Mock applications data
  const [applications] = useState<Application[]>([
    {
      id: 1,
      jobTitle: "Senior Software Engineer",
      company: "Tata Consultancy Services",
      location: "Bangalore",
      appliedDate: "2025-01-20",
      status: "interview",
      salary: "12-18 LPA",
      type: "Full-time",
      notes: "Technical interview scheduled for next week",
      interviewDate: "2025-01-28"
    },
    {
      id: 2,
      jobTitle: "Frontend Developer",
      company: "Infosys",
      location: "Hyderabad",
      appliedDate: "2025-01-18",
      status: "shortlisted",
      salary: "8-12 LPA",
      type: "Full-time",
      notes: "Portfolio review completed"
    },
    {
      id: 3,
      jobTitle: "Product Manager",
      company: "Wipro",
      location: "Mumbai",
      appliedDate: "2025-01-15",
      status: "pending",
      salary: "15-22 LPA",
      type: "Full-time"
    },
    {
      id: 4,
      jobTitle: "DevOps Engineer",
      company: "HCL Technologies",
      location: "Pune",
      appliedDate: "2025-01-12",
      status: "rejected",
      salary: "10-15 LPA",
      type: "Full-time",
      notes: "Position filled internally"
    },
    {
      id: 5,
      jobTitle: "UI/UX Designer",
      company: "Tech Mahindra",
      location: "Chennai",
      appliedDate: "2025-01-10",
      status: "reviewed",
      salary: "7-10 LPA",
      type: "Full-time"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "reviewed": return "bg-blue-100 text-blue-800";
      case "shortlisted": return "bg-green-100 text-green-800";
      case "interview": return "bg-purple-100 text-purple-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "hired": return "bg-emerald-100 text-emerald-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "reviewed": return <Eye className="w-4 h-4" />;
      case "shortlisted": return <CheckCircle className="w-4 h-4" />;
      case "interview": return <Calendar className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "hired": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      case "status":
        return a.status.localeCompare(b.status);
      case "company":
        return a.company.localeCompare(b.company);
      default:
        return 0;
    }
  });

  const getStatusCounts = () => {
    return {
      total: applications.length,
      pending: applications.filter(app => app.status === "pending").length,
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
            <CardDescription>Please log in to view your job applications</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track all your job applications and their progress</p>
        </div>

        {/* Application Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
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
                <Clock className="h-6 w-6 text-yellow-600 mr-2" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{statusCounts.pending}</p>
                  <p className="text-xs text-gray-600">Pending</p>
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
                  <p className="text-xs text-gray-600">Interviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{statusCounts.shortlisted}</p>
                  <p className="text-xs text-gray-600">Shortlisted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
            <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>All ({statusCounts.total})</TabsTrigger>
            <TabsTrigger value="pending" onClick={() => setStatusFilter("pending")}>Pending ({statusCounts.pending})</TabsTrigger>
            <TabsTrigger value="reviewed" onClick={() => setStatusFilter("reviewed")}>Reviewed ({statusCounts.reviewed})</TabsTrigger>
            <TabsTrigger value="shortlisted" onClick={() => setStatusFilter("shortlisted")}>Shortlisted ({statusCounts.shortlisted})</TabsTrigger>
            <TabsTrigger value="interview" onClick={() => setStatusFilter("interview")}>Interview ({statusCounts.interview})</TabsTrigger>
            <TabsTrigger value="rejected" onClick={() => setStatusFilter("rejected")}>Rejected ({statusCounts.rejected})</TabsTrigger>
            <TabsTrigger value="hired" onClick={() => setStatusFilter("hired")}>Hired ({statusCounts.hired})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
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
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      {searchTerm ? "No applications found matching your search" : "No job applications yet"}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {searchTerm ? "Try adjusting your search terms" : "Start applying to jobs to track your progress"}
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => setLocation("/jobs")}>
                        Browse Jobs
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                sortedApplications.map((application) => (
                  <Card key={application.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">{application.jobTitle}</h3>
                              <div className="flex items-center text-gray-600 mb-2">
                                <Building2 className="w-4 h-4 mr-1" />
                                <span className="mr-4">{application.company}</span>
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{application.location}</span>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(application.status)} flex items-center gap-1`}>
                              {getStatusIcon(application.status)}
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                            <span>{application.salary}</span>
                            <span>{application.type}</span>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Applied on {new Date(application.appliedDate).toLocaleDateString()}
                            </div>
                          </div>

                          {application.interviewDate && (
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                              <div className="flex items-center text-purple-700">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span className="font-medium">Interview Scheduled: </span>
                                <span className="ml-1">{new Date(application.interviewDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          )}

                          {application.notes && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                              <p className="text-sm text-gray-700">{application.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          Application #{application.id.toString().padStart(4, '0')}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation(`/jobs/${application.id}`)}
                          >
                            View Job
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download Resume
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Similar content for other tabs would be filtered versions */}
        </Tabs>

        {/* Quick Actions */}
        {applications.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>Recommended actions to improve your job search</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" onClick={() => setLocation("/jobs")}>
                  Apply to More Jobs
                </Button>
                <Button variant="outline" onClick={() => setLocation("/profile")}>
                  Update Profile
                </Button>
                <Button variant="outline" onClick={() => setLocation("/saved-jobs")}>
                  View Saved Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}