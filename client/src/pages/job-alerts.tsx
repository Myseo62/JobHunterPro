import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Bell, Mail, Smartphone } from "lucide-react";

interface JobAlert {
  id: number;
  title: string;
  keywords: string;
  location: string;
  salaryMin: string;
  frequency: string;
  isActive: boolean;
  createdAt: string;
}

export default function JobAlerts({ user }: { user: any }) {
  const [alerts, setAlerts] = useState<JobAlert[]>([
    {
      id: 1,
      title: "Senior Software Engineer",
      keywords: "React, Node.js, TypeScript",
      location: "Bangalore",
      salaryMin: "12",
      frequency: "daily",
      isActive: true,
      createdAt: "2025-01-15"
    },
    {
      id: 2,
      title: "Frontend Developer",
      keywords: "JavaScript, CSS, HTML",
      location: "Mumbai",
      salaryMin: "8",
      frequency: "weekly",
      isActive: false,
      createdAt: "2025-01-10"
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: "",
    keywords: "",
    location: "",
    salaryMin: "",
    frequency: "daily"
  });

  const toggleAlert = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const createAlert = () => {
    if (newAlert.title && newAlert.keywords) {
      const alert: JobAlert = {
        id: Date.now(),
        ...newAlert,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setAlerts([...alerts, alert]);
      setNewAlert({
        title: "",
        keywords: "",
        location: "",
        salaryMin: "",
        frequency: "daily"
      });
      setIsCreating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please log in to manage your job alerts</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Alerts</h1>
          <p className="text-gray-600">Stay updated with personalized job notifications</p>
        </div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bell className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
                  <p className="text-sm text-gray-600">Total Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{alerts.filter(a => a.isActive).length}</p>
                  <p className="text-sm text-gray-600">Active Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Smartphone className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-sm text-gray-600">Jobs Matched</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create New Alert */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Create New Alert</CardTitle>
                <CardDescription>Set up personalized job notifications</CardDescription>
              </div>
              <Button 
                onClick={() => setIsCreating(!isCreating)}
                variant={isCreating ? "outline" : "default"}
              >
                <Plus className="w-4 h-4 mr-2" />
                {isCreating ? "Cancel" : "New Alert"}
              </Button>
            </div>
          </CardHeader>
          
          {isCreating && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Alert Title</Label>
                  <Input
                    id="title"
                    value={newAlert.title}
                    onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                    placeholder="e.g., Senior Developer Jobs"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newAlert.location}
                    onChange={(e) => setNewAlert({...newAlert, location: e.target.value})}
                    placeholder="e.g., Bangalore, Mumbai"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={newAlert.keywords}
                  onChange={(e) => setNewAlert({...newAlert, keywords: e.target.value})}
                  placeholder="e.g., React, Node.js, TypeScript"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary">Minimum Salary (LPA)</Label>
                  <Input
                    id="salary"
                    value={newAlert.salaryMin}
                    onChange={(e) => setNewAlert({...newAlert, salaryMin: e.target.value})}
                    placeholder="e.g., 10"
                    type="number"
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Notification Frequency</Label>
                  <Select value={newAlert.frequency} onValueChange={(value) => setNewAlert({...newAlert, frequency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="instant">Instant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={createAlert} className="w-full">
                Create Alert
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Existing Alerts */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Job Alerts</h2>
          
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No job alerts created yet</p>
                <p className="text-sm text-gray-500">Create your first alert to get notified about relevant jobs</p>
              </CardContent>
            </Card>
          ) : (
            alerts.map((alert) => (
              <Card key={alert.id} className={`transition-all duration-200 ${alert.isActive ? 'ring-2 ring-purple-100' : 'opacity-75'}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">{alert.title}</h3>
                        <Badge variant={alert.isActive ? "default" : "secondary"}>
                          {alert.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Keywords:</strong> {alert.keywords}</p>
                        <p><strong>Location:</strong> {alert.location || "Any location"}</p>
                        <p><strong>Min Salary:</strong> {alert.salaryMin ? `${alert.salaryMin} LPA` : "Any salary"}</p>
                        <p><strong>Frequency:</strong> {alert.frequency}</p>
                        <p><strong>Created:</strong> {new Date(alert.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={alert.isActive}
                          onCheckedChange={() => toggleAlert(alert.id)}
                        />
                        <Label className="text-sm">Active</Label>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}