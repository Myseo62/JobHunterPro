import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginProps {
  onLogin: (user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/login", data);
      const user = await response.json();
      
      onLogin(user);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
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
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setLocation("/register")}
              className="font-medium text-purple-600 hover:text-purple-700 cursor-pointer transition-colors underline bg-transparent border-none p-0"
            >
              Sign up for free
            </button>
          </p>
        </div>

        <Card className="border-0 shadow-2xl cb-shadow-glow bg-white/95 backdrop-blur-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl text-gray-900">Sign in to your account</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
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

                <div className="flex items-center justify-end">
                  <div className="text-sm">
                    <span className="font-medium text-purple-600 hover:text-purple-700 cursor-pointer transition-colors">
                      Forgot your password?
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 cb-gradient-primary hover:shadow-lg transition-all duration-300 border-0 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            By signing in, you agree to our{" "}
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
