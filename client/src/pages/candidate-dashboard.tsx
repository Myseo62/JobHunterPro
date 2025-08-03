import { useState } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Sparkles,
  Target,
  Save,
  X,
  Plus,
  Award,
  Trophy,
  Users,
  Upload,
  FileCheck,
  Star,
  ExternalLink
} from "lucide-react";
import JobRecommendations from "@/components/jobs/job-recommendations";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function CandidateDashboard() {
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isEditing, setIsEditing] = useState(false);
  const [showRewardDetails, setShowRewardDetails] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [userSkills, setUserSkills] = useState(user?.skills || []);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [experienceForm, setExperienceForm] = useState({
    jobTitle: "",
    companyName: "",
    startDate: "",
    endDate: "",
    isCurrentJob: false,
    description: ""
  });
  const [educationForm, setEducationForm] = useState({
    degree: "",
    institution: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    grade: "",
    description: ""
  });
  const [showAddEducation, setShowAddEducation] = useState(false);

  // Helper functions for profile management
  const addSkill = async () => {
    if (newSkill.trim() && !userSkills.includes(newSkill.trim())) {
      const updatedSkills = [...userSkills, newSkill.trim()];
      setUserSkills(updatedSkills);
      setNewSkill("");
      
      // Save to backend
      if (user?.id) {
        try {
          await fetch(`/api/users/${user.id}/skills`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skills: updatedSkills })
          });
        } catch (error) {
          console.error('Failed to save skills:', error);
        }
      }
    }
  };

  const removeSkill = async (skillToRemove: string) => {
    const updatedSkills = userSkills.filter(skill => skill !== skillToRemove);
    setUserSkills(updatedSkills);
    
    // Save to backend
    if (user?.id) {
      try {
        await fetch(`/api/users/${user.id}/skills`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ skills: updatedSkills })
        });
      } catch (error) {
        console.error('Failed to save skills:', error);
      }
    }
  };

  const addWorkExperience = async () => {
    if (user?.id && experienceForm.jobTitle && experienceForm.companyName) {
      try {
        await fetch(`/api/users/${user.id}/experience`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(experienceForm)
        });
        
        setShowAddExperience(false);
        setExperienceForm({
          jobTitle: "",
          companyName: "",
          startDate: "",
          endDate: "",
          isCurrentJob: false,
          description: ""
        });
        
        alert('Work experience added successfully!');
      } catch (error) {
        console.error('Failed to add work experience:', error);
        alert('Failed to add work experience. Please try again.');
      }
    }
  };

  const addEducation = async () => {
    if (user?.id && educationForm.degree && educationForm.institution) {
      try {
        await fetch(`/api/users/${user.id}/education`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(educationForm)
        });
        
        setShowAddEducation(false);
        setEducationForm({
          degree: "",
          institution: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          grade: "",
          description: ""
        });
        
        alert('Education details added successfully!');
      } catch (error) {
        console.error('Failed to add education:', error);
        alert('Failed to add education details. Please try again.');
      }
    }
  };

  const { data: applications } = useQuery({
    queryKey: ['/api/applications'],
    enabled: !!user?.id,
  });

  const { data: savedJobs } = useQuery({
    queryKey: ['/api/saved-jobs'],
    enabled: !!user?.id,
  });

  const { data: jobAlerts } = useQuery({
    queryKey: ['/api/job-alerts'],
    enabled: !!user?.id,
  });

  const { data: dashboardStatsData } = useQuery({
    queryKey: ["/api/dashboard/stats", user?.id],
    queryFn: () => fetch(`/api/dashboard/stats/${user?.id}`).then(res => res.json()),
    enabled: !!user?.id,
  });

  const dashboardStats = {
    totalApplications: dashboardStatsData?.applicationsCount || 0,
    savedJobs: dashboardStatsData?.savedJobsCount || 0,
    profileViews: dashboardStatsData?.profileViews || 0,
    jobAlerts: dashboardStatsData?.jobAlertsCount || 0,
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

      {/* Quick Actions Section - DISABLED */}
      {/* 
      <Card className="cb-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Upload className="h-6 w-6" />
              <span className="text-sm">Update Resume</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Search className="h-6 w-6" />
              <span className="text-sm">Find Jobs</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Bell className="h-6 w-6" />
              <span className="text-sm">Set Alert</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <User className="h-6 w-6" />
              <span className="text-sm">Edit Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      */}

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
              {Array.isArray(savedJobs) && savedJobs.slice(0, 3).map((savedJob: any) => (
                <div key={savedJob.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{savedJob.job?.title}</p>
                    <p className="text-sm text-gray-600">{savedJob.job?.company?.name}</p>
                  </div>
                  {/* Quick Action Button Disabled */}
                  {/* <Button variant="outline" size="sm">View</Button> */}
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

  const ProfileTab = () => {
    const [activeSection, setActiveSection] = useState("personal");
    
    return (
      <div className="space-y-6">
        {/* Profile Navigation */}
        <Card className="cb-glass-card">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "personal", label: "Personal Info", icon: User },
                { id: "experience", label: "Work Experience", icon: Briefcase },
                { id: "education", label: "Education", icon: FileText },
                { id: "skills", label: "Skills & Assessments", icon: Target },
                { id: "projects", label: "Projects", icon: Building },
                { id: "certifications", label: "Certifications", icon: Award },
                { id: "awards", label: "Awards & Recognition", icon: Trophy },
                { id: "references", label: "References", icon: Users },
              ].map((section) => {
                const Icon = section.icon;
                return (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveSection(section.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Section */}
        {activeSection === "personal" && (
          <div className="space-y-6">
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
                    <input 
                      type="text" 
                      defaultValue={user?.firstName || ''} 
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.lastName || ''} 
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email || ''} 
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      defaultValue={user?.phone || ''} 
                      placeholder="+1 (555) 123-4567"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input 
                      type="text" 
                      defaultValue={user?.location || ''} 
                      placeholder="City, State, Country"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Experience</label>
                    <select 
                      defaultValue={user?.experience || ''} 
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select Experience</option>
                      <option value="0">Fresher</option>
                      <option value="1">1 Year</option>
                      <option value="2">2 Years</option>
                      <option value="3">3 Years</option>
                      <option value="4">4 Years</option>
                      <option value="5">5 Years</option>
                      <option value="6">6-10 Years</option>
                      <option value="10">10+ Years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current CTC (Annual)</label>
                    <input 
                      type="number" 
                      defaultValue={user?.currentSalary || ''} 
                      placeholder="Enter current salary"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected CTC (Annual)</label>
                    <input 
                      type="number" 
                      defaultValue={user?.expectedSalary || ''} 
                      placeholder="Enter expected salary"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notice Period</label>
                    <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option value="">Select Notice Period</option>
                      <option value="immediate">Immediate</option>
                      <option value="15-days">15 Days</option>
                      <option value="1-month">1 Month</option>
                      <option value="2-months">2 Months</option>
                      <option value="3-months">3 Months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                    <input 
                      type="url" 
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
                    <input 
                      type="url" 
                      placeholder="https://github.com/yourusername"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Website</label>
                    <input 
                      type="url" 
                      placeholder="https://yourportfolio.com"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
                  <textarea 
                    rows={4}
                    placeholder="Write a brief professional summary highlighting your key strengths and career objectives..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">Willing to relocate</span>
                  </label>
                </div>

                <Button className="cb-gradient-primary">
                  <Save className="h-4 w-4 mr-2" />
                  Save Personal Information
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Skills Section */}
        {activeSection === "skills" && (
          <Card className="cb-glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Skills & Assessments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {userSkills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button 
                        onClick={() => removeSkill(skill)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {userSkills.length === 0 && <p className="text-gray-500">No skills added yet</p>}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Add a skill and press Enter"
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <Button onClick={addSkill}>Add Skill</Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Skill Proficiency Levels</h4>
                <div className="space-y-4">
                  {userSkills.slice(0, 8).map((skill: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{skill}</span>
                      <select className="p-2 border border-gray-200 rounded" defaultValue="intermediate">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  ))}
                  {userSkills.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Add skills above to set proficiency levels</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Suggested Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'MongoDB', 'AWS'].map((skill) => (
                    <Button 
                      key={skill} 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        if (!userSkills.includes(skill)) {
                          setUserSkills([...userSkills, skill]);
                        }
                      }}
                      disabled={userSkills.includes(skill)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {skill}
                    </Button>
                  ))}
                </div>
              </div>

              <Button className="cb-gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Skills
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Work Experience Section */}
        {activeSection === "experience" && (
          <Card className="cb-glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                  Work Experience
                </CardTitle>
                <Button 
                  size="sm" 
                  className="cb-gradient-primary"
                  onClick={() => setShowAddExperience(!showAddExperience)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Experience Form */}
              {showAddExperience && (
                <div className="border border-green-200 rounded-lg p-4 space-y-4 bg-green-50">
                  <h4 className="font-semibold text-green-800">Add New Work Experience</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                      <input 
                        type="text" 
                        value={experienceForm.jobTitle}
                        onChange={(e) => setExperienceForm({...experienceForm, jobTitle: e.target.value})}
                        placeholder="e.g., Senior Software Engineer"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input 
                        type="text" 
                        value={experienceForm.companyName}
                        onChange={(e) => setExperienceForm({...experienceForm, companyName: e.target.value})}
                        placeholder="e.g., Google"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input 
                        type="month" 
                        value={experienceForm.startDate}
                        onChange={(e) => setExperienceForm({...experienceForm, startDate: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input 
                        type="month" 
                        value={experienceForm.endDate}
                        onChange={(e) => setExperienceForm({...experienceForm, endDate: e.target.value})}
                        disabled={experienceForm.isCurrentJob}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={experienceForm.isCurrentJob}
                        onChange={(e) => setExperienceForm({...experienceForm, isCurrentJob: e.target.checked, endDate: e.target.checked ? '' : experienceForm.endDate})}
                        className="w-4 h-4 text-purple-600" 
                      />
                      <span className="text-sm text-gray-700">I currently work here</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                    <textarea 
                      rows={4}
                      value={experienceForm.description}
                      onChange={(e) => setExperienceForm({...experienceForm, description: e.target.value})}
                      placeholder="Describe your role, responsibilities, and key achievements..."
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addWorkExperience} className="cb-gradient-primary">
                      <Save className="h-4 w-4 mr-2" />
                      Save Experience
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddExperience(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Sample Experience Entry */}
              <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">Senior Software Engineer</h4>
                    <p className="text-purple-600 font-medium">Google</p>
                    <p className="text-sm text-gray-600">Jan 2022 - Present · 2 years</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  Led development of scalable web applications using React and Node.js. 
                  Managed a team of 5 developers and improved system performance by 40%.
                  Implemented CI/CD pipelines and automated testing frameworks.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Node.js</Badge>
                  <Badge variant="secondary">Team Leadership</Badge>
                  <Badge variant="secondary">CI/CD</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Education Section */}
        {activeSection === "education" && (
          <Card className="cb-glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Education Background
                </CardTitle>
                <Button 
                  size="sm" 
                  className="cb-gradient-primary"
                  onClick={() => setShowAddEducation(!showAddEducation)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Education Form */}
              {showAddEducation && (
                <div className="border border-blue-200 rounded-lg p-4 space-y-4 bg-blue-50">
                  <h4 className="font-semibold text-blue-800">Add Education Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                      <input 
                        type="text" 
                        value={educationForm.degree}
                        onChange={(e) => setEducationForm({...educationForm, degree: e.target.value})}
                        placeholder="e.g., Bachelor of Technology"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                      <input 
                        type="text" 
                        value={educationForm.fieldOfStudy}
                        onChange={(e) => setEducationForm({...educationForm, fieldOfStudy: e.target.value})}
                        placeholder="e.g., Computer Science"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                      <input 
                        type="text" 
                        value={educationForm.institution}
                        onChange={(e) => setEducationForm({...educationForm, institution: e.target.value})}
                        placeholder="e.g., Indian Institute of Technology"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Grade/CGPA</label>
                      <input 
                        type="text" 
                        value={educationForm.grade}
                        onChange={(e) => setEducationForm({...educationForm, grade: e.target.value})}
                        placeholder="e.g., 8.5 CGPA or First Class"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input 
                        type="month" 
                        value={educationForm.startDate}
                        onChange={(e) => setEducationForm({...educationForm, startDate: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input 
                        type="month" 
                        value={educationForm.endDate}
                        onChange={(e) => setEducationForm({...educationForm, endDate: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                    <textarea 
                      rows={3}
                      value={educationForm.description}
                      onChange={(e) => setEducationForm({...educationForm, description: e.target.value})}
                      placeholder="Describe relevant coursework, projects, or achievements..."
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addEducation} className="cb-gradient-primary">
                      <Save className="h-4 w-4 mr-2" />
                      Save Education
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddEducation(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Sample Education Entry */}
              <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">Bachelor of Technology</h4>
                    <p className="text-purple-600 font-medium">Computer Science Engineering</p>
                    <p className="text-gray-600 font-medium">Indian Institute of Technology, Delhi</p>
                    <p className="text-sm text-gray-600">2018 - 2022 · CGPA: 8.7/10</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  Specialized in Artificial Intelligence and Machine Learning. Completed major projects 
                  in deep learning and computer vision. Dean's List for academic excellence.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Algorithms</Badge>
                  <Badge variant="secondary">Data Structures</Badge>
                  <Badge variant="secondary">Machine Learning</Badge>
                  <Badge variant="secondary">Database Systems</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Awards Section */}
        {activeSection === "awards" && (
          <Card className="cb-glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-purple-600" />
                  Awards & Recognition
                </CardTitle>
                <Button size="sm" className="cb-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Award
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Award Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Employee of the Year"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Microsoft Corporation"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Received</label>
                    <input 
                      type="date" 
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option value="">Select Category</option>
                      <option value="academic">Academic</option>
                      <option value="professional">Professional</option>
                      <option value="technical">Technical</option>
                      <option value="leadership">Leadership</option>
                      <option value="innovation">Innovation</option>
                      <option value="community">Community Service</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Describe the achievement and its significance..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="cb-gradient-primary">Save Award</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* References Section */}
        {activeSection === "references" && (
          <Card className="cb-glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Professional References
                </CardTitle>
                <Button size="sm" className="cb-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reference
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., John Smith"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Senior Manager"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Google"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                    <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option value="">Select Relationship</option>
                      <option value="manager">Direct Manager</option>
                      <option value="colleague">Colleague</option>
                      <option value="client">Client</option>
                      <option value="mentor">Mentor</option>
                      <option value="professor">Professor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      placeholder="e.g., john.smith@company.com"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      placeholder="e.g., +1 (555) 123-4567"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">Permission to contact this reference</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button className="cb-gradient-primary">Save Reference</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const ResumeTab = () => {
    const [parseStatus, setParseStatus] = useState('idle'); // idle, parsing, completed, error
    const [parsedData, setParsedData] = useState(null);
    
    const handleResumeUpload = async (file: File) => {
      setParseStatus('parsing');
      
      try {
        const formData = new FormData();
        formData.append('resume', file);
        
        const response = await fetch('/api/upload-resume-file', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          setParseStatus('completed');
          
          // Update user's resume URL in the database
          if (user?.id) {
            try {
              await fetch(`/api/users/${user.id}/resume`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  resumeUrl: result.fileInfo.filename,
                  originalName: result.fileInfo.originalName 
                })
              });
            } catch (error) {
              console.error('Failed to update resume URL:', error);
            }
          }
        } else {
          setParseStatus('error');
        }
      } catch (error) {
        console.error('Resume upload failed:', error);
        setParseStatus('error');
      }
    };
    
    return (
      <div className="space-y-6">
        <Card className="cb-glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Resume Management with AI Parser
            </CardTitle>
            <p className="text-gray-600">
              Upload your resume and let our AI automatically extract your skills, experience, and education
            </p>
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
              <div className="space-y-4">
                <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Resume</h3>
                  <p className="text-gray-600 mb-4">Upload a PDF or Word document to enhance your profile visibility</p>
                  <div className="flex items-center justify-center">
                    <input 
                      id="resume-upload"
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleResumeUpload(file);
                      }}
                    />
                    <Button 
                      className="cb-gradient-primary" 
                      disabled={parseStatus === 'parsing'}
                      onClick={() => document.getElementById('resume-upload')?.click()}
                    >
                      {parseStatus === 'parsing' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {parseStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">Resume upload failed. Please try again or contact support.</p>
                  </div>
                )}

                {parseStatus === 'completed' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700">Resume uploaded successfully! Please update your profile sections manually with your resume information.</p>
                  </div>
                )}
              </div>
            )}



            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="cb-glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Resume Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Create a professional resume using our guided builder</p>
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Open Resume Builder
                  </Button>
                </CardContent>
              </Card>

              <Card className="cb-glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Resume Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Profile Completeness</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{"width": "75%"}}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">ATS Score</span>
                      <span className="text-sm font-medium text-green-600">Good</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Skills Match</span>
                      <span className="text-sm font-medium text-blue-600">85%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

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
              <Button className="cb-gradient-primary mt-4" onClick={() => navigate('/jobs')}>Browse Jobs</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const FollowingTab = () => (
    <Card className="cb-glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-purple-600" />
          Following Employers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Mock data for following employers */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Company Name</h3>
                  <p className="text-sm text-gray-600">Technology</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">3 new jobs posted this week</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">View Jobs</Button>
                <Button variant="outline" size="sm">Unfollow</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const AlertsTab = () => {
    const [showCreateAlert, setShowCreateAlert] = useState(false);
    const [alertForm, setAlertForm] = useState({
      title: "",
      keywords: "",
      location: "",
      jobType: "",
      experienceLevel: "",
      salaryMin: "",
      frequency: "daily"
    });

    const handleCreateAlert = async () => {
      if (!user || !alertForm.title || !alertForm.keywords) return;

      try {
        const response = await fetch('/api/job-alerts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            ...alertForm,
          }),
        });

        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ['/api/job-alerts'] });
          setShowCreateAlert(false);
          setAlertForm({
            title: "",
            keywords: "",
            location: "",
            jobType: "",
            experienceLevel: "",
            salaryMin: "",
            frequency: "daily"
          });
        }
      } catch (error) {
        console.error('Failed to create alert:', error);
      }
    };

    const handleToggleAlert = async (alertId: number, isActive: boolean) => {
      try {
        await fetch(`/api/job-alerts/${alertId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isActive: !isActive }),
        });
        
        queryClient.invalidateQueries({ queryKey: ['/api/job-alerts'] });
      } catch (error) {
        console.error('Failed to toggle alert:', error);
      }
    };

    const handleDeleteAlert = async (alertId: number) => {
      try {
        await fetch(`/api/job-alerts/${alertId}`, {
          method: 'DELETE',
        });
        
        queryClient.invalidateQueries({ queryKey: ['/api/job-alerts'] });
      } catch (error) {
        console.error('Failed to delete alert:', error);
      }
    };

    return (
      <Card className="cb-glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              Job Alerts ({Array.isArray(jobAlerts) ? jobAlerts.length : 0})
            </CardTitle>
            <Button 
              className="cb-gradient-primary"
              onClick={() => setShowCreateAlert(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateAlert && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-4">Create New Job Alert</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alert Title</label>
                  <input
                    type="text"
                    value={alertForm.title}
                    onChange={(e) => setAlertForm({...alertForm, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Senior Developer Jobs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                  <input
                    type="text"
                    value={alertForm.keywords}
                    onChange={(e) => setAlertForm({...alertForm, keywords: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., React, Node.js, JavaScript"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={alertForm.location}
                    onChange={(e) => setAlertForm({...alertForm, location: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Bangalore, Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    value={alertForm.frequency}
                    onChange={(e) => setAlertForm({...alertForm, frequency: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="instant">Instant</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateAlert} className="cb-gradient-primary">
                  Create Alert
                </Button>
                <Button variant="outline" onClick={() => setShowCreateAlert(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {Array.isArray(jobAlerts) && jobAlerts.map((alert: any) => (
              <div key={alert.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{alert.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Search className="h-4 w-4" />
                        {alert.keywords}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {alert.location || "Any location"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Created {new Date(alert.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.isActive ? "default" : "secondary"}>
                        {alert.isActive ? "Active" : "Paused"}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {alert.frequency} notifications
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleAlert(alert.id, alert.isActive)}
                    >
                      {alert.isActive ? "Pause" : "Activate"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {(!Array.isArray(jobAlerts) || jobAlerts.length === 0) && (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No job alerts set up</p>
                <Button 
                  className="cb-gradient-primary mt-4"
                  onClick={() => setShowCreateAlert(true)}
                >
                  Create Your First Alert
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const MessagesTab = () => (
    <Card className="cb-glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-purple-600" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Mock messages */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">HR Manager - TechCorp</h3>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Thank you for your interest in the Software Engineer position...
                  </p>
                  <Badge variant="secondary" className="text-xs">Unread</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const MeetingsTab = () => (
    <Card className="cb-glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          Meetings & Interviews
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Mock meetings */}
          {[1, 2].map((item) => (
            <div key={item} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Technical Interview - Senior Developer</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Jan 25, 2025 at 2:00 PM
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      TechCorp Inc.
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Technical discussion with the development team
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Join Call</Button>
                  <Button variant="outline" size="sm">Reschedule</Button>
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No upcoming meetings</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const PasswordTab = () => (
    <Card className="cb-glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-purple-600" />
          Change Password
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input 
              type="password" 
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input 
              type="password" 
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input 
              type="password" 
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Password Requirements:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Include uppercase and lowercase letters</li>
            <li>• Include at least one number</li>
            <li>• Include at least one special character</li>
          </ul>
        </div>

        <Button className="cb-gradient-primary">Update Password</Button>
      </CardContent>
    </Card>
  );

  // AI Recommendations Tab Component
  const RecommendationsTab = () => (
    <div className="space-y-6">
      <Card className="cb-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            AI-Powered Job Recommendations
          </CardTitle>
          <p className="text-gray-600">
            Personalized job matches based on your skills, experience, and preferences
          </p>
        </CardHeader>
        <CardContent>
          <JobRecommendations 
            title="Your Best Matches"
            subtitle="Jobs tailored specifically for your profile"
            limit={12}
            showMatchDetails={true}
          />
        </CardContent>
      </Card>

      <Card className="cb-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-green-600" />
            How AI Recommendations Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Matching Factors:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Skills alignment (40% weight)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Experience level match (25% weight)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Salary expectations (20% weight)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Location preference (15% weight)
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Match Quality:</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm">90-100%: Excellent match</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">70-89%: Good match</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">50-69%: Fair match</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  <span className="text-sm">30-49%: Basic match</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Add SavedJobsTab component
  const SavedJobsTab = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredJobs, setFilteredJobs] = useState(savedJobs || []);

    React.useEffect(() => {
      if (savedJobs) {
        const filtered = savedJobs.filter((savedJob: any) => 
          savedJob.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          savedJob.job?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredJobs(filtered);
      }
    }, [savedJobs, searchTerm]);

    const handleUnsaveJob = async (jobId: number) => {
      try {
        const response = await fetch('/api/saved-jobs', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user?.id, jobId }),
        });
        
        if (response.ok) {
          // Refetch saved jobs
          queryClient.invalidateQueries({ queryKey: ['/api/saved-jobs'] });
        }
      } catch (error) {
        console.error('Failed to unsave job:', error);
      }
    };

    return (
      <Card className="cb-glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-green-600" />
              Saved Jobs ({Array.isArray(savedJobs) ? savedJobs.length : 0})
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search saved jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.isArray(filteredJobs) && filteredJobs.length > 0 ? (
              filteredJobs.map((savedJob: any) => (
                <div key={savedJob.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{savedJob.job?.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {savedJob.job?.company?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {savedJob.job?.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Saved {new Date(savedJob.savedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {savedJob.job?.jobType}
                        </span>
                        {savedJob.job?.salaryMin && savedJob.job?.salaryMax && (
                          <span className="text-green-600 font-medium">
                            ₹{savedJob.job.salaryMin}L - ₹{savedJob.job.salaryMax}L
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`/jobs/${savedJob.job?.id}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUnsaveJob(savedJob.job?.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchTerm ? "No saved jobs match your search" : "You haven't saved any jobs yet"}
                </p>
                <Button className="cb-gradient-primary mt-4" onClick={() => window.location.href = '/jobs'}>
                  Browse Jobs
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Blog functionality
  const BlogTab = () => {
    const [showWriteBlog, setShowWriteBlog] = useState(false);
    const [blogForm, setBlogForm] = useState({
      title: "",
      content: "",
      category: "career-advice",
      tags: "",
      isPublished: false
    });

    const { data: userBlogs } = useQuery({
      queryKey: ["/api/blogs/user", user?.id],
      queryFn: () => fetch(`/api/blogs/user/${user?.id}`).then(res => res.json()),
      enabled: !!user,
    });

    const handlePublishBlog = async () => {
      if (!user || !blogForm.title || !blogForm.content) return;

      try {
        const response = await fetch('/api/blogs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            authorId: user.id,
            title: blogForm.title,
            content: blogForm.content,
            category: blogForm.category,
            tags: blogForm.tags.split(',').map(tag => tag.trim()),
            isPublished: true
          }),
        });

        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ["/api/blogs/user", user?.id] });
          setShowWriteBlog(false);
          setBlogForm({
            title: "",
            content: "",
            category: "career-advice",
            tags: "",
            isPublished: false
          });
        }
      } catch (error) {
        console.error('Failed to publish blog:', error);
      }
    };

    return (
      <Card className="cb-glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              My Blogs ({Array.isArray(userBlogs) ? userBlogs.length : 0})
            </CardTitle>
            <Button 
              className="cb-gradient-primary"
              onClick={() => setShowWriteBlog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Write Blog
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showWriteBlog && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-4">Write New Blog</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter blog title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="career-advice">Career Advice</option>
                    <option value="interview-tips">Interview Tips</option>
                    <option value="industry-insights">Industry Insights</option>
                    <option value="skill-development">Skill Development</option>
                    <option value="workplace-culture">Workplace Culture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    value={blogForm.tags}
                    onChange={(e) => setBlogForm({...blogForm, tags: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter tags separated by commas..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 h-32"
                    placeholder="Write your blog content..."
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handlePublishBlog} className="cb-gradient-primary">
                  Publish Blog
                </Button>
                <Button variant="outline" onClick={() => setShowWriteBlog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {Array.isArray(userBlogs) && userBlogs.map((blog: any) => (
              <div key={blog.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{blog.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{blog.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Category: {blog.category}</span>
                      <span>Views: {blog.views || 0}</span>
                      <span>Published: {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {(!Array.isArray(userBlogs) || userBlogs.length === 0) && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">You haven't written any blogs yet</p>
                <Button 
                  className="cb-gradient-primary mt-4"
                  onClick={() => setShowWriteBlog(true)}
                >
                  Write Your First Blog
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const tabItems = [
    { id: "dashboard", label: "User Dashboard", icon: User, component: DashboardOverview },
    { id: "recommendations", label: "AI Recommendations", icon: Sparkles, component: RecommendationsTab },
    { id: "profile", label: "Profile", icon: User, component: ProfileTab },
    { id: "resume", label: "My Resume", icon: FileText, component: ResumeTab },
    { id: "applications", label: "My Applied", icon: Briefcase, component: ApplicationsTab },
    { id: "saved", label: "Saved Jobs", icon: Heart, component: SavedJobsTab },
    { id: "alerts", label: "Alerts Jobs", icon: Bell, component: AlertsTab },
    { id: "blogs", label: "My Blogs", icon: FileText, component: BlogTab },
    { id: "messages", label: "Messages", icon: MessageCircle, component: MessagesTab },
    { id: "meetings", label: "Meetings", icon: Calendar, component: MeetingsTab },
    { id: "password", label: "Change Password", icon: Settings, component: PasswordTab },
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