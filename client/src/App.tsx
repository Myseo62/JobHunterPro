import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import AuthGuard from "@/components/auth/auth-guard";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Jobs from "@/pages/jobs";
import JobDetail from "@/pages/job-detail";
import CompanyProfile from "@/pages/company-profile";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Profile from "@/pages/profile";
import CompaniesDirectory from "@/pages/companies-directory";
import Services from "@/pages/services";
import Resources from "@/pages/resources";

function Router() {
  const [user, setUser] = useState<any>(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("career_bazaar_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("career_bazaar_user");
      }
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem("career_bazaar_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("career_bazaar_user");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="flex-1">
        <Switch>
          {/* Public routes */}
          <Route path="/" component={() => <Home user={user} />} />
          <Route path="/jobs" component={() => <Jobs user={user} />} />
          <Route path="/jobs/:id" component={() => <JobDetail user={user} />} />
          <Route path="/companies/:id" component={() => <CompanyProfile user={user} />} />
          
          {/* Auth routes */}
          <Route path="/login">
            {user ? (
              <Home user={user} />
            ) : (
              <Login onLogin={handleLogin} />
            )}
          </Route>
          <Route path="/register">
            {user ? (
              <Home user={user} />
            ) : (
              <Register onLogin={handleLogin} />
            )}
          </Route>
          
          {/* Protected routes */}
          <Route path="/profile">
            <AuthGuard user={user} requireAuth={true}>
              <Profile user={user} onUpdateUser={handleLogin} />
            </AuthGuard>
          </Route>
          
          {/* Additional routes */}
          <Route path="/companies" component={() => <CompaniesDirectory user={user} />} />
          <Route path="/services" component={() => <Services user={user} />} />
          <Route path="/resources" component={() => <Resources user={user} />} />
          
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
