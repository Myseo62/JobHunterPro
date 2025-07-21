import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff } from "lucide-react";

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterProps {
  onLogin: (user: any) => void;
}

export default function Register({ onLogin }: RegisterProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registrationData } = data;
      const response = await apiRequest("POST", "/api/auth/register", registrationData);
      const user = await response.json();
      
      onLogin(user);
      toast({
        title: "Welcome to Career-Bazaar!",
        description: "Your account has been created successfully.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 cb-gradient-primary rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">CB</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setLocation("/login")}
              className="font-medium text-purple-600 hover:text-purple-700 cursor-pointer transition-colors underline bg-transparent border-none p-0"
            >
              Sign in
            </button>
          </p>
        </div>

        <Card className="border-0 shadow-2xl cb-shadow-glow bg-white/95 backdrop-blur-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl text-gray-900">Join Career-Bazaar today</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter first name"
                            className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                            {...field}
                          />
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
                        <FormLabel className="text-gray-700 font-medium">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter last name"
                            className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Email address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                          {...field}
                        />
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
                      <FormLabel className="text-gray-700 font-medium">Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors pr-12"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
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
                      <FormLabel className="text-gray-700 font-medium">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors pr-12"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 cb-gradient-primary hover:shadow-lg transition-all duration-300 border-0 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center">
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
      </div>
    </div>
  );
}
