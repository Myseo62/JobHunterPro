import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, User, Building2, Eye, Settings, MessageCircle, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function TestingGuide() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Credentials copied to clipboard",
    });
  };

  const testAccounts = [
    {
      type: "Candidate",
      email: "candidate@test.com",
      password: "password123",
      description: "Access candidate features like job applications, saved jobs, and profile management",
      icon: <User className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-800",
      features: [
        "Browse and apply for jobs",
        "Save jobs for later",
        "Track your applications", 
        "Manage your profile and skills",
        "Set up job alerts",
        "Update account settings"
      ]
    },
    {
      type: "Employer",
      email: "employer@test.com", 
      password: "password123",
      description: "Access employer features like posting jobs, managing applications, and candidate search",
      icon: <Building2 className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-800",
      features: [
        "Post and manage job listings",
        "View and manage applications",
        "Search and contact candidates",
        "Message candidates directly",
        "Track job performance analytics",
        "Manage company profile"
      ]
    }
  ];

  const candidatePages = [
    { name: "Job Applications", path: "/applications", icon: <Briefcase className="w-4 h-4" /> },
    { name: "Saved Jobs", path: "/saved-jobs", icon: <Eye className="w-4 h-4" /> },
    { name: "Job Alerts", path: "/job-alerts", icon: <MessageCircle className="w-4 h-4" /> },
    { name: "Account Settings", path: "/account-settings", icon: <Settings className="w-4 h-4" /> },
    { name: "Profile", path: "/profile", icon: <User className="w-4 h-4" /> }
  ];

  const employerPages = [
    { name: "Applications", path: "/employer/applications", icon: <Briefcase className="w-4 h-4" /> },
    { name: "Candidate Search", path: "/employer/candidates", icon: <User className="w-4 h-4" /> },
    { name: "Messages", path: "/employer/messages", icon: <MessageCircle className="w-4 h-4" /> },
    { name: "Manage Jobs", path: "/employer/manage-jobs", icon: <Settings className="w-4 h-4" /> },
    { name: "Post Job", path: "/employer/post-job", icon: <Building2 className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Testing Guide</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Use these test accounts to explore candidate and employer features in Career-Bazaar
          </p>
        </div>

        {/* Test Accounts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {testAccounts.map((account, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${account.color}`}>
                    {account.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{account.type} Account</CardTitle>
                    <CardDescription>{account.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Login Credentials</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-white rounded p-2">
                        <span className="text-sm">Email: {account.email}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(account.email)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between bg-white rounded p-2">
                        <span className="text-sm">Password: {account.password}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(account.password)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-3"
                      onClick={() => setLocation("/auth/login")}
                    >
                      Go to Login Page
                    </Button>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Available Features</h4>
                    <div className="space-y-2">
                      {account.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access to Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Candidate Pages
              </CardTitle>
              <CardDescription>
                These pages require candidate login to access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {candidatePages.map((page, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start"
                    onClick={() => setLocation(page.path)}
                  >
                    {page.icon}
                    <span className="ml-2">{page.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Employer Pages
              </CardTitle>
              <CardDescription>
                These pages require employer login to access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {employerPages.map((page, index) => (
                  <Button
                    key={index}
                    variant="outline" 
                    className="justify-start"
                    onClick={() => setLocation(page.path)}
                  >
                    {page.icon}
                    <span className="ml-2">{page.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
            <CardDescription>Follow these steps to test the application features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">1</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900">Choose an Account Type</h4>
                  <p className="text-gray-600">Select either candidate or employer test account based on what you want to test.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">2</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900">Login with Test Credentials</h4>
                  <p className="text-gray-600">Use the provided email and password to log in. You can copy the credentials using the copy buttons above.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">3</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900">Explore Features</h4>
                  <p className="text-gray-600">Once logged in, you'll have access to the authenticated pages. Try creating job applications as a candidate or posting jobs as an employer.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">4</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900">Switch Between Accounts</h4>
                  <p className="text-gray-600">Log out and switch to the other account type to see the full range of features available.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Note */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Development Note</h4>
                <p className="text-blue-800">
                  These are test accounts for demonstration purposes. In a production environment, 
                  passwords would be properly hashed and stored securely, and additional authentication 
                  measures would be implemented.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}