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
import CompanyProfilePage from "@/pages/company-profile";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Profile from "@/pages/profile";
import CompaniesDirectory from "@/pages/companies-directory";
import Services from "@/pages/services";
import Resources from "@/pages/resources";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import PostJob from "@/pages/employer/post-job";
import EmployerLogin from "@/pages/employer/login";
import EmployerRegister from "@/pages/employer/register";
import EmployerDashboard from "@/pages/employer/dashboard";
import SearchResume from "@/pages/employer/search-resume";
import EmployerPricing from "@/pages/employer/pricing";
import CompanyDashboard from "@/pages/company/dashboard";
import CompanyProfile from "@/pages/company/profile";
import CompanySettings from "@/pages/company/settings";

// Additional candidate pages
import JobAlerts from "@/pages/job-alerts";
import SavedJobs from "@/pages/saved-jobs";
import Applications from "@/pages/applications";
import AccountSettings from "@/pages/account-settings";

// Additional employer pages
import EmployerApplications from "@/pages/employer/applications";
import CandidateSearch from "@/pages/employer/candidates";
import EmployerMessages from "@/pages/employer/messages";
import ManageJobs from "@/pages/employer/manage-jobs";

// General pages
import Contact from "@/pages/contact";
import About from "@/pages/about";
import FAQ from "@/pages/faq";
import Help from "@/pages/help";
import BlogIndex from "@/pages/blog/index";
import BlogPost from "@/pages/blog/post";
import TestingGuide from "@/pages/testing-guide";

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
          <Route path="/companies/:id" component={() => <CompanyProfilePage user={user} />} />
          
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
          <Route path="/terms" component={() => <Terms />} />
          <Route path="/privacy" component={() => <Privacy />} />
          
          {/* Employer routes */}
          <Route path="/employer/post-job" component={() => <PostJob user={user} />} />
          <Route path="/employer/login" component={() => <EmployerLogin onLogin={handleLogin} />} />
          <Route path="/employer/register" component={() => <EmployerRegister onLogin={handleLogin} />} />
          <Route path="/employer/dashboard" component={() => <EmployerDashboard user={user} />} />
          <Route path="/employer/search-resume" component={() => <SearchResume user={user} />} />
          <Route path="/employer/pricing" component={() => <EmployerPricing />} />

          {/* Company management routes */}
          <Route path="/company/dashboard" component={() => <CompanyDashboard user={user} />} />
          <Route path="/company/profile/:id?" component={() => <CompanyProfile />} />
          <Route path="/company/settings" component={() => <CompanySettings user={user} />} />

          {/* Additional candidate pages */}
          <Route path="/job-alerts" component={() => <JobAlerts user={user} />} />
          <Route path="/saved-jobs" component={() => <SavedJobs user={user} />} />
          <Route path="/applications" component={() => <Applications user={user} />} />
          <Route path="/account-settings" component={() => <AccountSettings user={user} />} />

          {/* Additional employer pages */}
          <Route path="/employer/applications" component={() => <EmployerApplications user={user} />} />
          <Route path="/employer/candidates" component={() => <CandidateSearch user={user} />} />
          <Route path="/employer/messages" component={() => <EmployerMessages user={user} />} />
          <Route path="/employer/manage-jobs" component={() => <ManageJobs user={user} />} />

          {/* General pages */}
          <Route path="/contact" component={() => <Contact />} />
          <Route path="/about" component={() => <About />} />
          <Route path="/faq" component={() => <FAQ />} />
          <Route path="/help" component={() => <Help />} />
          <Route path="/blog" component={() => <BlogIndex />} />
          <Route path="/blog/:id" component={() => <BlogPost />} />
          <Route path="/testing-guide" component={() => <TestingGuide />} />
          
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
