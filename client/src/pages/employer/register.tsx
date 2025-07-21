import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff, Building, Users, Briefcase, TrendingUp } from "lucide-react";

const employerRegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  phone: z.string().min(1, "Phone number is required"),
  companyName: z.string().min(1, "Company name is required"),
  companySize: z.string().min(1, "Please select company size"),
  industry: z.string().min(1, "Please select industry"),
  designation: z.string().min(1, "Your designation is required"),
  companyWebsite: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EmployerRegisterFormData = z.infer<typeof employerRegisterSchema>;

interface EmployerRegisterProps {
  onLogin?: (user: any) => void;
}

export default function EmployerRegister({ onLogin }: EmployerRegisterProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EmployerRegisterFormData>({
    resolver: zodResolver(employerRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      companyName: "",
      companySize: "",
      industry: "",
      designation: "",
      companyWebsite: "",
    },
  });

  const onSubmit = async (data: EmployerRegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registrationData } = data;
      // Add userType to identify this as an employer account
      const employerData = {
        ...registrationData,
        userType: "employer",
        bio: `${data.designation} at ${data.companyName}`,
        skills: [], // Empty skills array for employer accounts
        experience: "N/A", // Not applicable for employers
        expectedSalary: 0, // Not applicable for employers
      };

      const response = await apiRequest("POST", "/api/auth/register", employerData);
      const user = await response.json();
      
      if (onLogin) {
        onLogin(user);
      }
      
      toast({
        title: "Welcome to Career-Bazaar!",
        description: "Your employer account has been created successfully.",
      });
      setLocation("/employer/dashboard");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error creating your employer account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const companySizeOptions = [
    "1-10 employees",
    "11-50 employees", 
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees"
  ];

  const industryOptions = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Retail",
    "Consulting",
    "Media & Entertainment",
    "Real Estate",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Employer Account</h1>
          <p className="text-xl text-gray-600">
            Join thousands of companies hiring top talent through Career-Bazaar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter first name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Work Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your.name@company.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="+91 98765 43210" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="designation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Designation</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. HR Manager, CEO, Recruiter" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Company Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter company name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="companyWebsite"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Website (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://company.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="companySize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Size</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select company size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {companySizeOptions.map((size) => (
                                    <SelectItem key={size} value={size}>
                                      {size}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="industry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Industry</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select industry" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {industryOptions.map((industry) => (
                                    <SelectItem key={industry} value={industry}>
                                      {industry}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Password Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    className="pr-12"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    className="pr-12"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Create Employer Account"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setLocation("/employer/login")}
                      >
                        Already have an account?
                      </Button>
                    </div>

                    <div className="text-center pt-4">
                      <p className="text-sm text-gray-600">
                        By creating an account, you agree to our{" "}
                        <button
                          type="button"
                          onClick={() => setLocation("/terms")}
                          className="text-purple-600 hover:text-purple-700 cursor-pointer transition-colors underline bg-transparent border-none p-0 font-inherit"
                        >
                          Terms of Service
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          onClick={() => setLocation("/privacy")}
                          className="text-purple-600 hover:text-purple-700 cursor-pointer transition-colors underline bg-transparent border-none p-0 font-inherit"
                        >
                          Privacy Policy
                        </button>
                      </p>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Why Employers Choose Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Access Top Talent</h4>
                    <p className="text-gray-600 text-xs">
                      Connect with skilled professionals ready to join your team.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Easy Job Posting</h4>
                    <p className="text-gray-600 text-xs">
                      Post jobs in minutes and reach thousands of candidates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Smart Analytics</h4>
                    <p className="text-gray-600 text-xs">
                      Track performance and optimize your hiring process.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Building className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Company Branding</h4>
                    <p className="text-gray-600 text-xs">
                      Showcase your company culture to attract the right talent.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-green-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-3">Trusted by 500+ Companies</h3>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-xl font-bold">10K+</div>
                    <div className="text-purple-100 text-xs">Active Candidates</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold">95%</div>
                    <div className="text-purple-100 text-xs">Success Rate</div>
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