import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface Employer {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  role?: 'employer_admin' | 'employer_hr' | 'hr';
}

export function useEmployerAuth() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  // Check localStorage for employer data first (hybrid approach)
  const getEmployerFromStorage = (): Employer | null => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        // Check if it's employer data (has companyName or employer role)
        if (parsed.companyName || (parsed.role && parsed.role.includes('employer'))) {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  const { data: employer, isLoading, error } = useQuery({
    queryKey: ["/api/employer/profile"],
    queryFn: async () => {
      // First try localStorage
      const localEmployer = getEmployerFromStorage();
      if (localEmployer) {
        return localEmployer;
      }

      // Fallback to session-based auth
      const response = await fetch("/api/employer/profile", {
        credentials: "include",
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          return null;
        }
        throw new Error("Failed to fetch employer profile");
      }
      
      return response.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await fetch("/api/auth/employer-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employer/profile"] });
      navigate("/employer/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { 
      email: string; 
      password: string; 
      firstName: string; 
      lastName: string; 
      companyName: string; 
    }) => {
      const response = await fetch("/api/auth/employer-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employer/profile"] });
      navigate("/employer/dashboard");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Clear localStorage first
      localStorage.removeItem("user");
      
      // Then call server logout
      const response = await fetch("/api/auth/employer-logout", {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employer/profile"] });
      navigate("/");
    },
  });

  return {
    employer,
    isLoading,
    isAuthenticated: !!employer,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message,
    error: error?.message,
  };
}