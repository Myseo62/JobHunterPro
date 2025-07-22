import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Search, MapPin, Calendar, Building2, DollarSign, Bookmark, Trash2, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";

interface SavedJob {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  savedAt: string;
  deadline: string;
  logo?: string;
}

export default function SavedJobs({ user }: { user: any }) {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  
  // Mock saved jobs data - in real app, this would come from API
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Tata Consultancy Services",
      location: "Bangalore",
      salary: "12-18 LPA",
      type: "Full-time",
      savedAt: "2025-01-20",
      deadline: "2025-02-15"
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "Infosys",
      location: "Hyderabad",
      salary: "8-12 LPA",
      type: "Full-time",
      savedAt: "2025-01-18",
      deadline: "2025-02-10"
    },
    {
      id: 3,
      title: "Product Manager",
      company: "Wipro",
      location: "Mumbai",
      salary: "15-22 LPA",
      type: "Full-time",
      savedAt: "2025-01-15",
      deadline: "2025-02-20"
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: "HCL Technologies",
      location: "Pune",
      salary: "10-15 LPA",
      type: "Full-time",
      savedAt: "2025-01-12",
      deadline: "2025-02-08"
    }
  ]);

  const removeSavedJob = (jobId: number) => {
    setSavedJobs(savedJobs.filter(job => job.id !== jobId));
  };

  const navigateToJob = (jobId: number) => {
    setLocation(`/jobs/${jobId}`);
  };

  const filteredJobs = savedJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      case "deadline":
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case "salary":
        return parseInt(b.salary.split("-")[1]) - parseInt(a.salary.split("-")[1]);
      case "company":
        return a.company.localeCompare(b.company);
      default:
        return 0;
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please log in to view your saved jobs</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
          <p className="text-gray-600">Your bookmarked job opportunities</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bookmark className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{savedJobs.length}</p>
                  <p className="text-sm text-gray-600">Saved Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {savedJobs.filter(job => new Date(job.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
                  </p>
                  <p className="text-sm text-gray-600">Expiring Soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {savedJobs.filter(job => new Date(job.savedAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                  </p>
                  <p className="text-sm text-gray-600">Added This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search saved jobs..."
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
                    <SelectItem value="recent">Recently Saved</SelectItem>
                    <SelectItem value="deadline">Application Deadline</SelectItem>
                    <SelectItem value="salary">Salary Range</SelectItem>
                    <SelectItem value="company">Company Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Jobs List */}
        <div className="space-y-4">
          {sortedJobs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {searchTerm ? "No jobs found matching your search" : "No saved jobs yet"}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "Start saving jobs you're interested in"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setLocation("/jobs")}>
                    Browse Jobs
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            sortedJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <Building2 className="w-4 h-4 mr-1" />
                            <span className="mr-4">{job.company}</span>
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigateToJob(job.id)}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSavedJob(job.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {job.salary}
                        </div>
                        <Badge variant="secondary">{job.type}</Badge>
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          Saved on {new Date(job.savedAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Apply by {new Date(job.deadline).toLocaleDateString()}
                          {new Date(job.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                            <Badge variant="destructive" className="ml-2">Expiring Soon</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quick Actions */}
        {savedJobs.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your saved jobs efficiently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setLocation("/jobs")}
                >
                  Find More Jobs
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSavedJobs([])}
                  className="text-red-600 hover:text-red-800"
                >
                  Clear All Saved Jobs
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation("/job-alerts")}
                >
                  Set Up Job Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}