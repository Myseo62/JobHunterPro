import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  FileText, 
  Briefcase, 
  Heart, 
  Bell, 
  MessageCircle, 
  Calendar,
  Settings,
  LogOut,
  MapPin,
  Mail,
  Phone,
  Clock,
  Building,
  Eye,
  Download,
  Edit,
  Trash2,
  Search,
  Filter
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const { user, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/login";
    }
  }, [user, isLoading]);

  const { data: applications } = useQuery({
    queryKey: ["/api/applications", user?.id],
    enabled: !!user?.id,
  });

  const { data: savedJobs } = useQuery({
    queryKey: ["/api/jobs/saved", user?.id],
    enabled: !!user?.id,
  });

  const { data: jobAlerts } = useQuery({
    queryKey: ["/api/job-alerts", user?.id],
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const dashboardStats = {
    totalApplications: Array.isArray(applications) ? applications.length : 0,
    savedJobs: Array.isArray(savedJobs) ? savedJobs.length : 0,
    profileViews: 127,
    jobAlerts: Array.isArray(jobAlerts) ? jobAlerts.length : 0,
  };

  const DashboardOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cb-glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalApplications}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="cb-glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.savedJobs}</p>
              </div>
              <Heart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="cb-glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.profileViews}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="cb-glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Job Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.jobAlerts}</p>
              </div>
              <Bell className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="cb-glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Recent Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(applications) && applications.slice(0, 3).map((app: any) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{app.job?.title}</p>
                    <p className="text-sm text-gray-600">{app.job?.company?.name}</p>
                  </div>
                  <Badge 
                    variant={app.status === 'pending' ? 'secondary' : 
                            app.status === 'accepted' ? 'default' : 'destructive'}
                  >
                    {app.status}
                  </Badge>
                </div>
              ))}
              {(!Array.isArray(applications) || applications.length === 0) && (
                <p className="text-gray-500 text-center py-4">No applications yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="cb-glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-green-600" />
              Recently Saved Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(savedJobs) && savedJobs.slice(0, 3).map((job: any) => (
                <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-600">{job.company?.name}</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
              {(!Array.isArray(savedJobs) || savedJobs.length === 0) && (
                <p className="text-gray-500 text-center py-4">No saved jobs yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ProfileTab = () => (
    <Card className="cb-glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-purple-600" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <p className="p-3 bg-gray-50 rounded-lg">{user?.firstName || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <p className="p-3 bg-gray-50 rounded-lg">{user?.lastName || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <p className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              {user?.email}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <p className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              {user?.phone || 'Not provided'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <p className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              {user?.location || 'Not provided'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
            <p className="p-3 bg-gray-50 rounded-lg">
              {user?.experience ? `${user.experience} years` : 'Not provided'}
            </p>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
          <div className="flex flex-wrap gap-2">
            {user?.skills?.map((skill: string, index: number) => (
              <Badge key={index} variant="secondary">{skill}</Badge>
            )) || <p className="text-gray-500">No skills added</p>}
          </div>
        </div>

        <div className="flex gap-3">
          <Button className="cb-gradient-primary">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ResumeTab = () => (
    <Card className="cb-glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600" />
          Resume Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {user?.resumeUrl ? (
          <div className="p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Current Resume</p>
                  <p className="text-sm text-gray-600">PDF • Uploaded on Jan 15, 2025</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No resume uploaded yet</p>
            <Button className="cb-gradient-primary">
              Upload Resume
            </Button>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Resume Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Keep it Updated</h4>
              <p className="text-sm text-purple-700">Update your resume regularly with new skills and experiences.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Use Keywords</h4>
              <p className="text-sm text-green-700">Include industry-specific keywords to pass ATS filters.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ApplicationsTab = () => (
    <Card className="cb-glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-purple-600" />
            My Applications
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.isArray(applications) && applications.map((app: any) => (
            <div key={app.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{app.job?.title}</h3>
                    <Badge 
                      variant={app.status === 'pending' ? 'secondary' : 
                              app.status === 'accepted' ? 'default' : 'destructive'}
                    >
                      {app.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {app.job?.company?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {app.job?.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {app.coverLetter && (
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {app.coverLetter.substring(0, 100)}...
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {(!Array.isArray(applications) || applications.length === 0) && (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No applications yet</p>
              <Button className="cb-gradient-primary mt-4" onClick={() => window.location.href = '/jobs'}>
                Browse Jobs
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const tabItems = [
    { id: "dashboard", label: "User Dashboard", icon: User, component: DashboardOverview },
    { id: "profile", label: "Profile", icon: User, component: ProfileTab },
    { id: "resume", label: "My Resume", icon: FileText, component: ResumeTab },
    { id: "applications", label: "My Applied", icon: Briefcase, component: ApplicationsTab },
    { id: "following", label: "Following Employers", icon: Heart, component: () => <div>Following tab coming soon...</div> },
    { id: "alerts", label: "Alerts Jobs", icon: Bell, component: () => <div>Job alerts coming soon...</div> },
    { id: "messages", label: "Messages", icon: MessageCircle, component: () => <div>Messages coming soon...</div> },
    { id: "meetings", label: "Meetings", icon: Calendar, component: () => <div>Meetings coming soon...</div> },
    { id: "password", label: "Change Password", icon: Settings, component: () => <div>Change password coming soon...</div> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <Card className="cb-glass-card sticky top-8">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <CardTitle className="text-xl">{user?.firstName} {user?.lastName}</CardTitle>
                <p className="text-gray-600">{user?.email}</p>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-purple-50 transition-colors ${
                          activeTab === item.id 
                            ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-600' 
                            : 'text-gray-700'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </button>
                    );
                  })}
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-6 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tabItems.find(item => item.id === activeTab)?.label}
              </h1>
              <p className="text-gray-600">
                Welcome back, {user?.firstName}! Here's your dashboard overview.
              </p>
            </div>

            {tabItems.find(item => item.id === activeTab)?.component()}
          </div>
        </div>
      </div>
    </div>
  );
}
