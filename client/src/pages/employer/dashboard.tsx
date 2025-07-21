import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Users, Eye, TrendingUp, Plus, MapPin, IndianRupee, Clock } from "lucide-react";
import { useLocation } from "wouter";

interface EmployerDashboardProps {
  user: any;
}

export default function EmployerDashboard({ user }: EmployerDashboardProps) {
  const [, setLocation] = useLocation();

  // Mock data for employer dashboard - in a real app, this would come from API
  const stats = {
    activeJobs: 5,
    totalApplications: 124,
    viewsThisMonth: 2847,
    hireRate: 15
  };

  const recentJobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      applications: 23,
      views: 156,
      status: "Active",
      postedAt: "2 days ago"
    },
    {
      id: 2,
      title: "Product Manager",
      applications: 31,
      views: 234,
      status: "Active",
      postedAt: "5 days ago"
    },
    {
      id: 3,
      title: "UI/UX Designer",
      applications: 18,
      views: 189,
      status: "Paused",
      postedAt: "1 week ago"
    }
  ];

  const recentApplications = [
    {
      id: 1,
      candidateName: "Rahul Sharma",
      jobTitle: "Senior Software Engineer",
      appliedAt: "2 hours ago",
      experience: "5 years",
      status: "New"
    },
    {
      id: 2,
      candidateName: "Priya Patel",
      jobTitle: "Product Manager",
      appliedAt: "4 hours ago",
      experience: "7 years",
      status: "Reviewed"
    },
    {
      id: 3,
      candidateName: "Amit Kumar",
      jobTitle: "UI/UX Designer",
      appliedAt: "1 day ago",
      experience: "3 years",
      status: "Shortlisted"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your job postings.</p>
          </div>
          <Button 
            onClick={() => setLocation("/employer/post-job")}
            className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeJobs}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Views This Month</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.viewsThisMonth.toLocaleString()}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hire Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.hireRate}%</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Job Postings</span>
                <Button variant="outline" size="sm" onClick={() => setLocation("/employer/jobs")}>
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {job.applications} applications
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {job.views} views
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.postedAt}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={job.status === 'Active' ? 'default' : 'secondary'}>
                        {job.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Applications</span>
                <Button variant="outline" size="sm" onClick={() => setLocation("/employer/applications")}>
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {application.candidateName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{application.candidateName}</h3>
                        <p className="text-sm text-gray-600">{application.jobTitle}</p>
                        <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                          <span>{application.experience} experience</span>
                          <span>•</span>
                          <span>{application.appliedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={
                          application.status === 'New' ? 'default' : 
                          application.status === 'Reviewed' ? 'secondary' : 
                          'outline'
                        }
                      >
                        {application.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center space-y-2"
                onClick={() => setLocation("/employer/post-job")}
              >
                <Plus className="h-6 w-6" />
                <span>Post New Job</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center space-y-2"
                onClick={() => setLocation("/employer/search-resume")}
              >
                <Users className="h-6 w-6" />
                <span>Search Resumes</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center space-y-2"
                onClick={() => setLocation("/employer/analytics")}
              >
                <TrendingUp className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}