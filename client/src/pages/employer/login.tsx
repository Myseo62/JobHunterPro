import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Building, Users, Briefcase, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface EmployerLoginProps {
  onLogin?: (userData: any) => void;
}

export default function EmployerLogin({ onLogin }: EmployerLoginProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userType: "employer"
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in as an employer.",
        });
        if (onLogin) {
          onLogin(userData);
        }
        setLocation("/employer/dashboard");
      } else {
        const error = await response.json();
        toast({
          title: "Login failed",
          description: error.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Employer Login</h1>
          <p className="text-xl text-gray-600">
            Access your recruiter dashboard and manage your job postings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Login Form */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Sign In to Your Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@company.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <Separator />

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Don't have an employer account?
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/employer/register")}
                  >
                    Create Employer Account
                  </Button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-purple-600 hover:text-purple-700"
                    onClick={() => setLocation("/login")}
                  >
                    Looking for job seeker login?
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Why Choose Career-Bazaar?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Access Top Talent</h3>
                    <p className="text-gray-600 text-sm">
                      Connect with qualified professionals across various industries and skill levels.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Easy Job Posting</h3>
                    <p className="text-gray-600 text-sm">
                      Post jobs quickly with our intuitive interface and reach thousands of candidates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Analytics & Insights</h3>
                    <p className="text-gray-600 text-sm">
                      Track your job postings performance and optimize your hiring strategy.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Building className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Company Branding</h3>
                    <p className="text-gray-600 text-sm">
                      Showcase your company culture and attract candidates who fit your values.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-green-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Join 500+ Companies</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">10K+</div>
                    <div className="text-purple-100 text-sm">Active Candidates</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-purple-100 text-sm">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}