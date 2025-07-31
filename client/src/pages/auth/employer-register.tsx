import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employerRegistrationSchema, type EmployerRegistrationData } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Building2, Eye, EyeOff, ArrowLeft, Check } from "lucide-react";

export default function EmployerRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<EmployerRegistrationData>({
    resolver: zodResolver(employerRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      companyName: "",
      companyWebsite: "",
      companySize: "",
      industry: "",
      role: "employer_admin",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: EmployerRegistrationData) => {
      const response = await apiRequest("POST", "/api/auth/employer-register", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Successful",
        description: "Your employer account has been created successfully!",
      });
      // Store user data and redirect to employer dashboard
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/employer/dashboard";
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EmployerRegistrationData) => {
    registerMutation.mutate(data);
  };

  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "Manufacturing",
    "Retail", "Consulting", "Marketing", "Real Estate", "Government",
    "Non-profit", "Entertainment", "Transportation", "Energy", "Other"
  ];

  const companySizes = [
    "1-10 employees", "11-50 employees", "51-200 employees", 
    "201-500 employees", "501-1000 employees", "1000+ employees"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Employer Account</h1>
          <p className="text-gray-600 mt-2">Join Career-Bazaar to find the best talent</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold">Register Your Company</CardTitle>
            <CardDescription>Fill in your details to get started with hiring</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      {...form.register("firstName")}
                      className="h-11"
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-sm text-red-600">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      {...form.register("lastName")}
                      className="h-11"
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-sm text-red-600">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your work email"
                    {...form.register("email")}
                    className="h-11"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      {...form.register("password")}
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
                  )}
                </div>
              </div>

              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    {...form.register("companyName")}
                    className="h-11"
                  />
                  {form.formState.errors.companyName && (
                    <p className="text-sm text-red-600">{form.formState.errors.companyName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Company Website (Optional)</Label>
                  <Input
                    id="companyWebsite"
                    type="url"
                    placeholder="https://www.yourcompany.com"
                    {...form.register("companyWebsite")}
                    className="h-11"
                  />
                  {form.formState.errors.companyWebsite && (
                    <p className="text-sm text-red-600">{form.formState.errors.companyWebsite.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Size</Label>
                    <Select onValueChange={(value) => form.setValue("companySize", value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.companySize && (
                      <p className="text-sm text-red-600">{form.formState.errors.companySize.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select onValueChange={(value) => form.setValue("industry", value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.industry && (
                      <p className="text-sm text-red-600">{form.formState.errors.industry.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">What you get with Career-Bazaar:</h4>
                <ul className="space-y-1 text-sm text-green-700">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Free plan: 10 candidate searches & 5 downloads per month
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Post unlimited job listings
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Manage HR team with role-based access
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Advanced candidate search filters
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white font-medium"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Creating Account..." : "Create Employer Account"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11"
                  onClick={() => window.location.href = "/auth/employer-login"}
                >
                  Sign In to Existing Account
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-11 text-gray-600"
                  onClick={() => window.location.href = "/"}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Looking for candidate registration?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-purple-600 hover:text-purple-700"
              onClick={() => window.location.href = "/register"}
            >
              Sign up as candidate
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}