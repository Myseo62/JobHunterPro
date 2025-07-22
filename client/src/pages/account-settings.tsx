import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User, Bell, Shield, Trash2, Eye, EyeOff, Check, X } from "lucide-react";

export default function AccountSettings({ user }: { user: any }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Account Settings State
  const [accountSettings, setAccountSettings] = useState({
    email: user?.email || "john.doe@example.com",
    phone: user?.phone || "+91 9876543210",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    applicationUpdates: true,
    marketingEmails: false,
    smsNotifications: true,
    weeklyDigest: true,
    profileViews: false,
  });

  // Privacy Settings State
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showExperience: true,
    showSalary: false,
  });

  const handleAccountUpdate = () => {
    // API call would go here
    console.log("Updating account settings:", accountSettings);
  };

  const handlePasswordChange = () => {
    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // API call would go here
    console.log("Changing password");
    setAccountSettings({
      ...accountSettings,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleNotificationUpdate = () => {
    // API call would go here
    console.log("Updating notifications:", notifications);
  };

  const handlePrivacyUpdate = () => {
    // API call would go here
    console.log("Updating privacy settings:", privacy);
  };

  const handleDeleteAccount = () => {
    // API call would go here
    console.log("Deleting account");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please log in to access account settings</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security settings</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your basic account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={accountSettings.email}
                      onChange={(e) => setAccountSettings({...accountSettings, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={accountSettings.phone}
                      onChange={(e) => setAccountSettings({...accountSettings, phone: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={handleAccountUpdate} className="w-full md:w-auto">
                  Update Account
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={accountSettings.currentPassword}
                      onChange={(e) => setAccountSettings({...accountSettings, currentPassword: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={accountSettings.newPassword}
                        onChange={(e) => setAccountSettings({...accountSettings, newPassword: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={accountSettings.confirmPassword}
                        onChange={(e) => setAccountSettings({...accountSettings, confirmPassword: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handlePasswordChange} className="w-full md:w-auto">
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what email notifications you'd like to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="job-alerts">Job Alerts</Label>
                    <p className="text-sm text-gray-600">Receive notifications about new jobs matching your criteria</p>
                  </div>
                  <Switch
                    id="job-alerts"
                    checked={notifications.jobAlerts}
                    onCheckedChange={(checked) => setNotifications({...notifications, jobAlerts: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="application-updates">Application Updates</Label>
                    <p className="text-sm text-gray-600">Get notified when employers respond to your applications</p>
                  </div>
                  <Switch
                    id="application-updates"
                    checked={notifications.applicationUpdates}
                    onCheckedChange={(checked) => setNotifications({...notifications, applicationUpdates: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-digest">Weekly Digest</Label>
                    <p className="text-sm text-gray-600">Weekly summary of new job opportunities</p>
                  </div>
                  <Switch
                    id="weekly-digest"
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) => setNotifications({...notifications, weeklyDigest: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-gray-600">Receive updates about new features and promotions</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => setNotifications({...notifications, marketingEmails: checked})}
                  />
                </div>

                <Button onClick={handleNotificationUpdate} className="w-full md:w-auto">
                  Save Notification Preferences
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mobile Notifications</CardTitle>
                <CardDescription>Manage your mobile app notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive important updates via SMS</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) => setNotifications({...notifications, smsNotifications: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile-views">Profile Views</Label>
                    <p className="text-sm text-gray-600">Get notified when employers view your profile</p>
                  </div>
                  <Switch
                    id="profile-views"
                    checked={notifications.profileViews}
                    onCheckedChange={(checked) => setNotifications({...notifications, profileViews: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Visibility</CardTitle>
                <CardDescription>Control who can see your profile and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile-public">Public Profile</Label>
                    <p className="text-sm text-gray-600">Allow your profile to be found by employers</p>
                  </div>
                  <Switch
                    id="profile-public"
                    checked={privacy.profilePublic}
                    onCheckedChange={(checked) => setPrivacy({...privacy, profilePublic: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-email">Show Email Address</Label>
                    <p className="text-sm text-gray-600">Display your email on your public profile</p>
                  </div>
                  <Switch
                    id="show-email"
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) => setPrivacy({...privacy, showEmail: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-phone">Show Phone Number</Label>
                    <p className="text-sm text-gray-600">Display your phone number on your public profile</p>
                  </div>
                  <Switch
                    id="show-phone"
                    checked={privacy.showPhone}
                    onCheckedChange={(checked) => setPrivacy({...privacy, showPhone: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-experience">Show Experience Details</Label>
                    <p className="text-sm text-gray-600">Display your work experience on your public profile</p>
                  </div>
                  <Switch
                    id="show-experience"
                    checked={privacy.showExperience}
                    onCheckedChange={(checked) => setPrivacy({...privacy, showExperience: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-salary">Show Salary Expectations</Label>
                    <p className="text-sm text-gray-600">Display your salary expectations on your profile</p>
                  </div>
                  <Switch
                    id="show-salary"
                    checked={privacy.showSalary}
                    onCheckedChange={(checked) => setPrivacy({...privacy, showSalary: checked})}
                  />
                </div>

                <Button onClick={handlePrivacyUpdate} className="w-full md:w-auto">
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Manage your account security and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <div>
                      <p className="font-medium text-green-800">Two-Factor Authentication</p>
                      <p className="text-sm text-green-600">Your account is secured with 2FA</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Login Activity</p>
                    <p className="text-sm text-gray-600">View your recent login history</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Activity
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Download Data</p>
                    <p className="text-sm text-gray-600">Export all your account data</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>These actions cannot be undone. Please be careful.</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full md:w-auto">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}