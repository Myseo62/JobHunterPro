import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Save, 
  Bell, 
  Shield, 
  Mail, 
  Building, 
  ArrowLeft,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle
} from "lucide-react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface CompanySettingsProps {
  user: User | null;
}

export default function CompanySettings({ user }: CompanySettingsProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Settings state
  const [profileSettings, setProfileSettings] = useState({
    companyName: "Tata Consultancy Services",
    companyEmail: "hr@tcs.com",
    website: "https://tcs.com",
    phone: "+91-80-12345678",
    description: "Leading IT services and consulting company",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    applicationNotifications: true,
    marketingEmails: false,
    weeklyReports: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Profile Updated",
        description: "Your company profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your notification settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      setSecuritySettings(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: "There was an error changing your password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center">
        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md p-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-4">Please log in to access company settings.</p>
            <Button onClick={() => setLocation("/employer/login")}>
              Sign In
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/company/dashboard")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Company Settings</h1>
              <p className="text-gray-600">Manage your company account and preferences</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:flex">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Company Profile</CardTitle>
                <p className="text-gray-600">Update your company information and contact details</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <Input
                      value={profileSettings.companyName}
                      onChange={(e) => setProfileSettings(prev => ({
                        ...prev,
                        companyName: e.target.value
                      }))}
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Email
                    </label>
                    <Input
                      type="email"
                      value={profileSettings.companyEmail}
                      onChange={(e) => setProfileSettings(prev => ({
                        ...prev,
                        companyEmail: e.target.value
                      }))}
                      placeholder="company@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <Input
                      value={profileSettings.website}
                      onChange={(e) => setProfileSettings(prev => ({
                        ...prev,
                        website: e.target.value
                      }))}
                      placeholder="https://company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={profileSettings.phone}
                      onChange={(e) => setProfileSettings(prev => ({
                        ...prev,
                        phone: e.target.value
                      }))}
                      placeholder="+91-80-12345678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description
                  </label>
                  <Textarea
                    value={profileSettings.description}
                    onChange={(e) => setProfileSettings(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    placeholder="Describe your company, culture, and values..."
                    className="h-32"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Notification Preferences</CardTitle>
                <p className="text-gray-600">Choose how you want to receive updates and alerts</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive general notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({
                          ...prev,
                          emailNotifications: checked
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Application Notifications</h4>
                        <p className="text-sm text-gray-600">Get notified when candidates apply to your jobs</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.applicationNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({
                          ...prev,
                          applicationNotifications: checked
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Marketing Emails</h4>
                        <p className="text-sm text-gray-600">Receive product updates and promotional content</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({
                          ...prev,
                          marketingEmails: checked
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-orange-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Weekly Reports</h4>
                        <p className="text-sm text-gray-600">Get weekly analytics and performance reports</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({
                          ...prev,
                          weeklyReports: checked
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveNotifications}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Security Settings</CardTitle>
                <p className="text-gray-600">Manage your account security and password</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Change Password */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Change Password</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={securitySettings.currentPassword}
                        onChange={(e) => setSecuritySettings(prev => ({
                          ...prev,
                          currentPassword: e.target.value
                        }))}
                        placeholder="Enter current password"
                        className="pr-12"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <Input
                        type="password"
                        value={securitySettings.newPassword}
                        onChange={(e) => setSecuritySettings(prev => ({
                          ...prev,
                          newPassword: e.target.value
                        }))}
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <Input
                        type="password"
                        value={securitySettings.confirmPassword}
                        onChange={(e) => setSecuritySettings(prev => ({
                          ...prev,
                          confirmPassword: e.target.value
                        }))}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <Button
                      onClick={handleChangePassword}
                      disabled={isLoading || !securitySettings.currentPassword || !securitySettings.newPassword}
                      className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) =>
                      setSecuritySettings(prev => ({
                        ...prev,
                        twoFactorEnabled: checked
                      }))
                    }
                  />
                </div>

                <Separator />

                {/* Danger Zone */}
                <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h4 className="font-medium text-red-900">Danger Zone</h4>
                  </div>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your company account, there is no going back. Please be certain.
                  </p>
                  <Button
                    variant="destructive"
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Company Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}