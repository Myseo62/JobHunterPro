import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Filter,
  Plus,
  X,
  Save
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import RewardPointsWidget from "@/components/rewards/reward-points-widget";
import { useRewardTracking } from "@/hooks/useRewardTracking";
import { SimpleResumeUploader } from "@/components/resume/SimpleResumeUploader";

export default function Profile({ user }: { user: any }) {
  const { trackAndNotify } = useRewardTracking(user?.id);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Extract tab from URL hash or default to dashboard
  const getTabFromUrl = () => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['dashboard', 'profile', 'resume', 'applications', 'saved', 'following', 'alerts', 'messages', 'meetings', 'settings', 'password'];
    return validTabs.includes(hash) ? hash : 'dashboard';
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromUrl);
  
  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editableProfile, setEditableProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    location: user?.location || '',
    experience: user?.experience || '',
    skills: user?.skills || [],
    profileSummary: user?.profileSummary || '',
    linkedinUrl: user?.linkedinUrl || '',
    githubUrl: user?.githubUrl || '',
    portfolioUrl: user?.portfolioUrl || ''
  });
  
  // Resume upload states
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // All hooks must be called before any early returns
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

  // State for various tabs - moved to top level to avoid hooks order issues
  const [savedJobsSearchTerm, setSavedJobsSearchTerm] = useState("");
  const [savedJobsFilter, setSavedJobsFilter] = useState("all");
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: "",
    keywords: "",
    location: "",
    salary: "",
    experience: "",
    frequency: "daily"
  });
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMeetingView, setSelectedMeetingView] = useState("upcoming");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Update URL hash when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.history.pushState(null, '', `#${tabId}`);
  };

  // Update editable profile when user data changes
  useEffect(() => {
    if (user) {
      setEditableProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        location: user.location || '',
        experience: user.experience || '',
        skills: user.skills || [],
        profileSummary: user.profileSummary || '',
        linkedinUrl: user.linkedinUrl || '',
        githubUrl: user.githubUrl || '',
        portfolioUrl: user.portfolioUrl || ''
      });
    }
  }, [user]);

  // Listen for hash changes and redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const handleHashChange = () => {
      const newTab = getTabFromUrl();
      setActiveTab(newTab);
    };
    
    // Set initial tab from URL hash
    const initialTab = getTabFromUrl();
    setActiveTab(initialTab);
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  // Additional effect to handle direct navigation
  useEffect(() => {
    if (user) {
      const currentTab = getTabFromUrl();
      if (currentTab !== activeTab) {
        setActiveTab(currentTab);
      }
    }
  }, [user]);

  // Profile handling functions
  const handleProfileSave = async () => {
    console.log('Starting profile save...', editableProfile);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          firstName: editableProfile.firstName || '',
          lastName: editableProfile.lastName || '',
          phone: editableProfile.phone || '',
          location: editableProfile.location || '',
          experience: editableProfile.experience ? parseInt(editableProfile.experience) : null,
          profileSummary: editableProfile.profileSummary || '',
          linkedinUrl: editableProfile.linkedinUrl || '',
          githubUrl: editableProfile.githubUrl || '',
          portfolioUrl: editableProfile.portfolioUrl || '',
        }),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const updatedUser = await response.json();
        console.log('Profile updated successfully:', updatedUser);
        alert('Profile updated successfully!');
        window.location.reload(); // Simple refresh for now
        setIsEditingProfile(false);
      } else {
        const errorData = await response.text();
        console.error('Update failed:', errorData);
        if (response.status === 401) {
          alert('Session expired. Please log in again.');
          window.location.href = '/login';
        } else {
          alert('Failed to update profile. Please try again.');
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);

      const response = await fetch('/api/upload-resume-file', {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update user with resume URL
        await fetch(`/api/users/${user.id}/resume`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for authentication
          body: JSON.stringify({
            resumeUrl: `/uploads/${result.fileInfo.filename}`,
            originalName: result.fileInfo.originalName,
          }),
        });

        window.location.reload(); // Refresh to show updated resume
      }
    } catch (error) {
      console.error('Failed to upload resume:', error);
      alert('Failed to upload resume. Please try again.');
    } finally {
      setIsUploadingResume(false);
      setSelectedFile(null);
    }
  };

  const handleResumeDelete = async () => {
    try {
      await fetch(`/api/users/${user.id}/resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeUrl: null,
          originalName: null,
        }),
      });
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete resume:', error);
    }
  };

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

      {/* Reward Points Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RewardPointsWidget user={user} />
        </div>
        <div className="lg:col-span-2">
          <Card className="cb-glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-auto hover:bg-purple-50"
                  onClick={() => trackAndNotify('PROFILE_UPDATE')}
                >
                  <User className="h-6 w-6 mb-2" />
                  <span className="text-sm">Update Profile</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-auto hover:bg-green-50"
                  onClick={() => trackAndNotify('RESUME_UPLOAD')}
                >
                  <FileText className="h-6 w-6 mb-2" />
                  <span className="text-sm">Upload Resume</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-auto hover:bg-blue-50"
                  onClick={() => trackAndNotify('SKILL_ADD')}
                >
                  <Plus className="h-6 w-6 mb-2" />
                  <span className="text-sm">Add Skills</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-auto hover:bg-orange-50"
                >
                  <Building className="h-6 w-6 mb-2" />
                  <span className="text-sm">Find Jobs</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
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
          <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
            <DialogTrigger asChild>
              <Button className="cb-gradient-primary">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={editableProfile.firstName}
                      onChange={(e) => setEditableProfile({...editableProfile, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={editableProfile.lastName}
                      onChange={(e) => setEditableProfile({...editableProfile, lastName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editableProfile.phone}
                      onChange={(e) => setEditableProfile({...editableProfile, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editableProfile.location}
                      onChange={(e) => setEditableProfile({...editableProfile, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience (years)</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={editableProfile.experience}
                      onChange={(e) => setEditableProfile({...editableProfile, experience: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <Input
                      id="linkedinUrl"
                      value={editableProfile.linkedinUrl}
                      onChange={(e) => setEditableProfile({...editableProfile, linkedinUrl: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="githubUrl">GitHub URL</Label>
                    <Input
                      id="githubUrl"
                      value={editableProfile.githubUrl}
                      onChange={(e) => setEditableProfile({...editableProfile, githubUrl: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                    <Input
                      id="portfolioUrl"
                      value={editableProfile.portfolioUrl}
                      onChange={(e) => setEditableProfile({...editableProfile, portfolioUrl: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="profileSummary">Profile Summary</Label>
                  <Textarea
                    id="profileSummary"
                    rows={4}
                    value={editableProfile.profileSummary}
                    onChange={(e) => setEditableProfile({...editableProfile, profileSummary: e.target.value})}
                    placeholder="Write a brief summary about yourself..."
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="cb-gradient-primary" 
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Save button clicked');
                      handleProfileSave();
                    }}
                    type="button"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => window.open(`/candidate/${user.id}`, '_blank')}>
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
                <Button variant="outline" size="sm" onClick={() => window.open(user.resumeUrl, '_blank')}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  const link = document.createElement('a');
                  link.href = user.resumeUrl;
                  link.download = 'resume.pdf';
                  link.click();
                }}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={async () => {
                  if (confirm('Are you sure you want to delete your resume?')) {
                    await handleResumeDelete();
                  }
                }}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <SimpleResumeUploader 
            userId={user?.id}
            onUploadComplete={() => {
              // Refresh user data
              queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
            }}
          />
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

  const SavedJobsTab = () => {

    const mockSavedJobs = [
      {
        id: 1,
        title: "Senior React Developer",
        company: { name: "TechCorp India", logo: "" },
        location: "Mumbai, Maharashtra",
        salary: "₹15-25 LPA",
        type: "Full-time",
        savedAt: "2024-01-15",
        status: "active"
      },
      {
        id: 2,
        title: "Product Manager",
        company: { name: "StartupXYZ", logo: "" },
        location: "Bangalore, Karnataka",
        salary: "₹20-30 LPA",
        type: "Full-time",
        savedAt: "2024-01-12",
        status: "applied"
      }
    ];

    const filteredJobs = mockSavedJobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(savedJobsSearchTerm.toLowerCase()) ||
                           job.company.name.toLowerCase().includes(savedJobsSearchTerm.toLowerCase());
      const matchesFilter = savedJobsFilter === "all" || job.status === savedJobsFilter;
      return matchesSearch && matchesFilter;
    });

    return (
      <div className="space-y-6">
        {/* Search and Filter */}
        <Card className="cb-glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search saved jobs..."
                    value={savedJobsSearchTerm}
                    onChange={(e) => setSavedJobsSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={savedJobsFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSavedJobsFilter("all")}
                >
                  All ({mockSavedJobs.length})
                </Button>
                <Button
                  variant={savedJobsFilter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSavedJobsFilter("active")}
                >
                  Active
                </Button>
                <Button
                  variant={savedJobsFilter === "applied" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSavedJobsFilter("applied")}
                >
                  Applied
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Jobs List */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="cb-glass-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-gray-600 mb-2">{job.company.name}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Badge variant="secondary">{job.type}</Badge>
                          </span>
                          <span>{job.salary}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Saved on {new Date(job.savedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" className="cb-gradient-primary">
                      <Eye className="h-4 w-4 mr-2" />
                      View Job
                    </Button>
                    <Button variant="outline" size="sm">
                      {job.status === "applied" ? "Applied" : "Apply Now"}
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Heart className="h-4 w-4 mr-2" />
                      Unsave
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredJobs.length === 0 && (
            <Card className="cb-glass-card">
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved jobs found</h3>
                <p className="text-gray-600 mb-6">
                  {savedJobsSearchTerm ? "Try adjusting your search terms" : "Start saving jobs you're interested in"}
                </p>
                <Button className="cb-gradient-primary" onClick={() => window.location.href = '/jobs'}>
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const JobAlertsTab = () => {

    const mockAlerts = [
      {
        id: 1,
        title: "React Developer Jobs",
        keywords: "React, JavaScript, Frontend",
        location: "Mumbai, Delhi, Bangalore",
        salary: "₹10-20 LPA",
        experience: "3-5 years",
        frequency: "daily",
        active: true,
        createdAt: "2024-01-10",
        lastTriggered: "2024-01-20"
      },
      {
        id: 2,
        title: "Product Manager Opportunities",
        keywords: "Product Manager, Strategy, Analytics",
        location: "Any",
        salary: "₹15+ LPA",
        experience: "5+ years",
        frequency: "weekly",
        active: false,
        createdAt: "2024-01-05",
        lastTriggered: "2024-01-15"
      }
    ];

    const handleCreateAlert = () => {
      setIsCreatingAlert(false);
      setNewAlert({
        title: "",
        keywords: "",
        location: "",
        salary: "",
        experience: "",
        frequency: "daily"
      });
    };

    return (
      <div className="space-y-6">
        {/* Create New Alert */}
        <Card className="cb-glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Job Alerts
              </div>
              <Button 
                onClick={() => setIsCreatingAlert(!isCreatingAlert)}
                className="cb-gradient-primary"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </CardTitle>
          </CardHeader>
          {isCreatingAlert && (
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Alert Title</label>
                    <Input
                      placeholder="e.g., Senior Developer Jobs"
                      value={newAlert.title}
                      onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Keywords</label>
                    <Input
                      placeholder="e.g., React, Node.js, JavaScript"
                      value={newAlert.keywords}
                      onChange={(e) => setNewAlert({...newAlert, keywords: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                    <Input
                      placeholder="e.g., Mumbai, Delhi, Remote"
                      value={newAlert.location}
                      onChange={(e) => setNewAlert({...newAlert, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Salary Range</label>
                    <Input
                      placeholder="e.g., ₹10-20 LPA"
                      value={newAlert.salary}
                      onChange={(e) => setNewAlert({...newAlert, salary: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Experience</label>
                    <Input
                      placeholder="e.g., 3-5 years"
                      value={newAlert.experience}
                      onChange={(e) => setNewAlert({...newAlert, experience: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Frequency</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newAlert.frequency}
                      onChange={(e) => setNewAlert({...newAlert, frequency: e.target.value})}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateAlert} className="cb-gradient-primary">
                    Create Alert
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreatingAlert(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Existing Alerts */}
        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <Card key={alert.id} className="cb-glass-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-lg text-gray-900">{alert.title}</h3>
                      <Badge variant={alert.active ? "default" : "secondary"}>
                        {alert.active ? "Active" : "Paused"}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Keywords:</strong> {alert.keywords}</p>
                      <p><strong>Location:</strong> {alert.location}</p>
                      <p><strong>Salary:</strong> {alert.salary}</p>
                      <p><strong>Experience:</strong> {alert.experience}</p>
                      <p><strong>Frequency:</strong> {alert.frequency}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                      <span>Created: {new Date(alert.createdAt).toLocaleDateString()}</span>
                      <span>Last triggered: {new Date(alert.lastTriggered).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className={alert.active ? "text-orange-600" : "text-green-600"}
                    >
                      {alert.active ? "Pause" : "Activate"}
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {mockAlerts.length === 0 && (
            <Card className="cb-glass-card">
              <CardContent className="p-12 text-center">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No job alerts yet</h3>
                <p className="text-gray-600 mb-6">Create your first job alert to get notified about relevant opportunities</p>
                <Button onClick={() => setIsCreatingAlert(true)} className="cb-gradient-primary">
                  Create Your First Alert
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const MessagesTab = () => {

    const mockConversations = [
      {
        id: 1,
        company: "TechCorp India",
        companyLogo: "",
        jobTitle: "Senior React Developer",
        lastMessage: "Thank you for your application. We'd like to schedule an interview.",
        timestamp: "2024-01-20T10:30:00Z",
        unread: true,
        messages: [
          {
            id: 1,
            sender: "HR Team",
            message: "Thank you for applying to the Senior React Developer position. We're impressed with your profile!",
            timestamp: "2024-01-19T14:00:00Z",
            isEmployer: true
          },
          {
            id: 2,
            sender: "You",
            message: "Thank you for considering my application. I'm very excited about this opportunity.",
            timestamp: "2024-01-19T16:30:00Z",
            isEmployer: false
          },
          {
            id: 3,
            sender: "HR Team",
            message: "Great! We'd like to schedule an interview for next week. Are you available on Tuesday or Wednesday?",
            timestamp: "2024-01-20T10:30:00Z",
            isEmployer: true
          }
        ]
      },
      {
        id: 2,
        company: "StartupXYZ",
        companyLogo: "",
        jobTitle: "Product Manager",
        lastMessage: "We've received your application and will review it shortly.",
        timestamp: "2024-01-18T09:15:00Z",
        unread: false,
        messages: [
          {
            id: 1,
            sender: "Hiring Manager",
            message: "Hello! We've received your application for the Product Manager role. We'll review it and get back to you within a week.",
            timestamp: "2024-01-18T09:15:00Z",
            isEmployer: true
          }
        ]
      }
    ];

    const handleSendMessage = () => {
      if (newMessage.trim() && selectedConversation) {
        setNewMessage("");
      }
    };

    return (
      <div className="space-y-6">
        <Card className="cb-glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex h-96">
              {/* Conversations List */}
              <div className="w-1/3 border-r border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">Conversations</h3>
                </div>
                <div className="overflow-y-auto h-full">
                  {mockConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedConversation === conversation.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-green-600 rounded-full flex items-center justify-center">
                          <Building className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm text-gray-900 truncate">{conversation.company}</h4>
                            {conversation.unread && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{conversation.jobTitle}</p>
                          <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(conversation.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message View */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Message Header */}
                    <div className="p-4 border-b border-gray-200">
                      {(() => {
                        const conversation = mockConversations.find(c => c.id === selectedConversation);
                        return conversation ? (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-green-600 rounded-full flex items-center justify-center">
                              <Building className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{conversation.company}</h3>
                              <p className="text-sm text-gray-600">{conversation.jobTitle}</p>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto">
                      <div className="space-y-4">
                        {(() => {
                          const conversation = mockConversations.find(c => c.id === selectedConversation);
                          return conversation?.messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.isEmployer ? 'justify-start' : 'justify-end'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.isEmployer
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'bg-purple-600 text-white'
                                }`}
                              >
                                <p className="text-sm">{message.message}</p>
                                <p className={`text-xs mt-1 ${
                                  message.isEmployer ? 'text-gray-500' : 'text-purple-200'
                                }`}>
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage} size="sm" className="cb-gradient-primary">
                          Send
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Select a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {mockConversations.length === 0 && (
          <Card className="cb-glass-card">
            <CardContent className="p-12 text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600 mb-6">Messages from employers will appear here when you apply for jobs</p>
              <Button className="cb-gradient-primary" onClick={() => window.location.href = '/jobs'}>
                Browse Jobs & Apply
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const MeetingsTab = () => {

    const mockMeetings = [
      {
        id: 1,
        title: "Technical Interview",
        company: "TechCorp India",
        jobTitle: "Senior React Developer",
        type: "Video Call",
        date: "2024-01-25",
        time: "02:00 PM",
        duration: "60 mins",
        status: "scheduled",
        interviewer: "John Smith, Tech Lead",
        notes: "Technical round focusing on React, Node.js, and system design"
      },
      {
        id: 2,
        title: "HR Round",
        company: "StartupXYZ",
        jobTitle: "Product Manager",
        type: "Phone Call",
        date: "2024-01-22",
        time: "11:00 AM",
        duration: "30 mins",
        status: "completed",
        interviewer: "Sarah Johnson, HR Manager",
        notes: "Initial screening call completed successfully"
      }
    ];

    const filteredMeetings = mockMeetings.filter(meeting => {
      if (selectedMeetingView === "upcoming") return meeting.status === "scheduled";
      if (selectedMeetingView === "past") return meeting.status === "completed";
      return true;
    });

    return (
      <div className="space-y-6">
        <Card className="cb-glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Meetings & Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-6">
              <Button
                variant={selectedMeetingView === "upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMeetingView("upcoming")}
              >
                Upcoming
              </Button>
              <Button
                variant={selectedMeetingView === "past" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMeetingView("past")}
              >
                Past
              </Button>
              <Button
                variant={selectedMeetingView === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMeetingView("all")}
              >
                All
              </Button>
            </div>

            <div className="space-y-4">
              {filteredMeetings.map((meeting) => (
                <div key={meeting.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{meeting.title}</h3>
                      <p className="text-gray-600 mb-2">{meeting.company} • {meeting.jobTitle}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>{new Date(meeting.date).toLocaleDateString()}</span>
                        <span>{meeting.time}</span>
                        <span>{meeting.duration}</span>
                        <Badge variant="secondary">{meeting.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{meeting.interviewer}</p>
                      <p className="text-sm text-gray-500 mt-1">{meeting.notes}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {meeting.status === "scheduled" && (
                        <Button size="sm" className="cb-gradient-primary">
                          Join Meeting
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredMeetings.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No meetings scheduled</p>
                  <p className="text-sm text-gray-500 mt-2">Interview invitations will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const ChangePasswordTab = () => {
    // For manually registered users, assume they have no social login indicators
    // This is a simple heuristic - in production, you'd have an auth method field
    const isSocialLogin = false; // Since the user mentioned they used manual registration

    return (
      <Card className="cb-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isSocialLogin ? (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">Social Login Account</h3>
                <p className="text-sm text-yellow-700">
                  You're logged in via social authentication. Password changes are managed through your social provider (Google/LinkedIn).
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <Button 
                  className="cb-gradient-primary" 
                  onClick={() => {
                    // Add password change logic here
                    console.log("Password change requested");
                  }}
                >
                  Update Password
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const FollowingTab = () => (
    <Card className="cb-glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-600" />
          Following Employers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Not following any employers yet</p>
            <Button className="cb-gradient-primary mt-4" onClick={() => window.location.href = '/companies'}>
              Explore Companies
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const AccountSettingsTab = () => (
    <Card className="cb-glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-600" />
          Account Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Privacy Settings */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Privacy Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Profile Visibility</p>
                  <p className="text-sm text-gray-600">Make your profile visible to employers</p>
                </div>
                <Button variant="outline" size="sm">Public</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Contact Visibility</p>
                  <p className="text-sm text-gray-600">Show contact information to employers</p>
                </div>
                <Button variant="outline" size="sm">Enabled</Button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Notification Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive job alerts and updates via email</p>
                </div>
                <Button variant="outline" size="sm">On</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">SMS Notifications</p>
                  <p className="text-sm text-gray-600">Receive urgent updates via SMS</p>
                </div>
                <Button variant="outline" size="sm">Off</Button>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <h3 className="font-semibold text-red-900 mb-3">Danger Zone</h3>
            <div className="space-y-3">
              <Button variant="destructive" size="sm">
                Deactivate Account
              </Button>
              <p className="text-sm text-red-600">
                This action will temporarily disable your account. You can reactivate it anytime.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const tabItems = [
    { id: "dashboard", label: "User Dashboard", icon: User, component: DashboardOverview },
    { id: "profile", label: "Profile", icon: User, component: ProfileTab },
    { id: "resume", label: "My Resume", icon: FileText, component: ResumeTab },
    { id: "applications", label: "My Applied", icon: Briefcase, component: ApplicationsTab },
    { id: "following", label: "Following Employers", icon: Heart, component: FollowingTab },
    { id: "alerts", label: "Alerts Jobs", icon: Bell, component: JobAlertsTab },
    { id: "messages", label: "Messages", icon: MessageCircle, component: MessagesTab },
    { id: "meetings", label: "Meetings", icon: Calendar, component: MeetingsTab },
    { id: "password", label: "Change Password", icon: Settings, component: ChangePasswordTab },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <Card className="bg-white shadow-sm border border-gray-200 sticky top-8">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800">{user?.firstName} {user?.lastName}</CardTitle>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </CardHeader>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                          activeTab === item.id 
                            ? 'bg-blue-100 text-blue-700 shadow-sm' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                        }`}
                      >
                        <div className={`p-1.5 rounded ${
                          activeTab === item.id 
                            ? 'bg-blue-200' 
                            : 'bg-gray-100'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                  <div className="pt-2 mt-4 border-t border-gray-200">
                    <button
                      onClick={() => window.location.href = '/'}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                    >
                      <div className="p-1.5 rounded bg-gray-100">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
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
                {activeTab === 'dashboard' 
                  ? `Welcome back, ${user?.firstName}! Here's your dashboard overview.`
                  : `Manage your ${tabItems.find(item => item.id === activeTab)?.label.toLowerCase()} and preferences.`
                }
              </p>
            </div>

            {tabItems.find(item => item.id === activeTab)?.component()}
          </div>
        </div>
      </div>
    </div>
  );
}
