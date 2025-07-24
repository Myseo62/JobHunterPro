import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Search, MapPin, Clock, Building2, Eye, Trash2, Share2 } from "lucide-react";
import { useLocation } from "wouter";

interface SavedJob {
  id: number;
  title: string;
  company: string;
  location: string;
  savedDate: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  isActive: boolean;
}

export default function SavedJobs({ user }: { user: any }) {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Mock saved jobs data
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Tata Consultancy Services",
      location: "Bangalore",
      savedDate: "2025-01-22",
      salary: "12-18 LPA",
      type: "Full-time",
      description: "Looking for experienced software engineer with expertise in React and Node.js",
      requirements: ["React", "Node.js", "TypeScript", "5+ years experience"],
      isActive: true
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "Infosys",
      location: "Hyderabad",
      savedDate: "2025-01-20",
      salary: "8-12 LPA",
      type: "Full-time",
      description: "Frontend developer role focusing on modern JavaScript frameworks",
      requirements: ["JavaScript", "React", "CSS", "3+ years experience"],
      isActive: true
    },
    {
      id: 3,
      title: "Product Manager",
      company: "Wipro",
      location: "Mumbai",
      savedDate: "2025-01-18",
      salary: "15-22 LPA",
      type: "Full-time",
      description: "Strategic product management role for enterprise solutions",
      requirements: ["Product Management", "Strategy", "Analytics", "MBA preferred"],
      isActive: false
    }
  ]);

  const filteredJobs = savedJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && job.isActive) ||
                         (statusFilter === "inactive" && !job.isActive);
    return matchesSearch && matchesStatus;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
      case "company":
        return a.company.localeCompare(b.company);
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const removeSavedJob = (jobId: number) => {
    setSavedJobs(savedJobs.filter(job => job.id !== jobId));
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-600">Expired</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
          <p className="text-gray-600">Manage your saved job opportunities</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search saved jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="title">Job Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{savedJobs.length}</p>
                  <p className="text-sm text-gray-600">Total Saved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{savedJobs.filter(j => j.isActive).length}</p>
                  <p className="text-sm text-gray-600">Active Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{new Set(savedJobs.map(j => j.company)).size}</p>
                  <p className="text-sm text-gray-600">Companies</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Jobs List */}
        <div className="space-y-4">
          {sortedJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Saved {new Date(job.savedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(job.isActive)}
                    </div>
                    <p className="text-gray-700 mb-3">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.requirements.map((req, index) => (
                        <Badge key={index} variant="secondary">{req}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-medium text-purple-600">{job.salary}</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4 lg:mt-0 lg:ml-6">
                    <Button 
                      className="cb-gradient-primary"
                      onClick={() => setLocation(`/job/${job.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Job
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeSavedJob(job.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {sortedJobs.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved jobs found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your filters to see more results."
                    : "Start saving jobs to build your shortlist of opportunities."
                  }
                </p>
                <Button 
                  className="cb-gradient-primary"
                  onClick={() => setLocation('/jobs')}
                >
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}