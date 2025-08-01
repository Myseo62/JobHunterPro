import { useState } from "react";
import { Link, useLocation, useRouter } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEmployerAuth } from "@/hooks/useEmployerAuth";
import { Menu, X, LogOut, Sparkles, User, LayoutDashboard, MessageCircle, Heart, Building2, ChevronDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RewardPointsWidget from "@/components/rewards/reward-points-widget";


interface HeaderProps {
  user?: any;
  onLogout?: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const { employer, isAuthenticated: isEmployerAuthenticated, logout: employerLogout } = useEmployerAuth();

  // Check if we're on an employer page
  const isEmployerPage = location.startsWith('/employer') || location.startsWith('/auth/employer');

  // Navigation based on user type
  const getCandidateNavigation = () => [
    { label: "Find Jobs", href: "/jobs" },
    { label: "Companies", href: "/companies" },
    { label: "Career Guide", href: "/services" },
    { label: "Success Stories", href: "/resources" },
  ];

  const getEmployerNavigation = () => [
    { label: "Post Jobs", href: "/employer/jobs" },
    { label: "Find Candidates", href: "/employer/candidates" },
    { label: "Company Profile", href: "/employer/company" },
    { label: "Analytics", href: "/employer/analytics" },
  ];

  const getHRNavigation = () => [
    { label: "Manage Jobs", href: "/hr/jobs" },
    { label: "Applications", href: "/hr/applications" },
    { label: "Team", href: "/hr/team" },
    { label: "Reports", href: "/hr/reports" },
  ];

  // Determine which navigation to show
  const getNavigation = () => {
    if (isEmployerAuthenticated) {
      // Check if employer has HR role or is admin
      if (employer?.role === 'hr' || employer?.role === 'employer_hr') {
        return getHRNavigation();
      }
      return getEmployerNavigation();
    }
    return getCandidateNavigation();
  };

  const navigation = getNavigation();

  const handleLogout = () => {
    onLogout?.();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const candidateMenuItems = [
    { label: "Dashboard", href: "/profile#dashboard", icon: LayoutDashboard },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Messages", href: "/profile#messages", icon: MessageCircle },
    { label: "Following Jobs", href: "/saved-jobs", icon: Heart },
    { label: "Following Companies", href: "/following-companies", icon: Building2 },
  ];

  const handleMenuItemClick = (href: string) => {
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      setLocation(path);
      // Set hash after navigation
      setTimeout(() => {
        window.location.hash = hash;
      }, 100);
    } else {
      setLocation(href);
    }
  };





  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="w-10 h-10 cb-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900 leading-none">Career</span>
                  <span className="text-xl font-bold cb-text-gradient leading-none">Bazaar</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer hover:bg-gray-50",
                    location === item.href
                      ? "text-purple-600 bg-purple-50"
                      : "text-gray-700 hover:text-gray-900"
                  )}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-3">
            {user || isEmployerAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Reward Points Widget - only for candidates */}
                {user && <RewardPointsWidget user={user} compact={true} />}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center space-x-2 hover:bg-purple-50 hover:text-purple-600 transition-colors px-3 py-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-green-600 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {isEmployerAuthenticated 
                            ? (employer?.firstName?.[0] || 'E') + (employer?.lastName?.[0] || '')
                            : (user?.firstName?.[0] || 'U') + (user?.lastName?.[0] || '')
                          }
                        </span>
                      </div>
                      <span className="hidden sm:inline font-medium text-sm">
                        {isEmployerAuthenticated ? employer?.firstName || 'Employer' : user?.firstName || 'User'}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" sideOffset={5}>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {isEmployerAuthenticated 
                            ? `${employer?.firstName} ${employer?.lastName}`
                            : `${user?.firstName} ${user?.lastName}`
                          }
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {isEmployerAuthenticated ? employer?.email : user?.email}
                        </p>
                        {isEmployerAuthenticated && (
                          <p className="text-xs leading-none text-blue-600 font-medium">
                            {employer?.companyName}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {isEmployerAuthenticated ? (
                      // Employer/HR menu items based on role
                      <>
                        <DropdownMenuItem 
                          className="cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
                          onClick={() => handleMenuItemClick('/employer/dashboard')}
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                        
                        {employer?.role === 'hr' || employer?.role === 'employer_hr' ? (
                          // HR-specific menu items
                          <>
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
                              onClick={() => handleMenuItemClick('/hr/applications')}
                            >
                              <MessageCircle className="mr-2 h-4 w-4" />
                              <span>Applications</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
                              onClick={() => handleMenuItemClick('/hr/team')}
                            >
                              <User className="mr-2 h-4 w-4" />
                              <span>Team Management</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
                              onClick={() => handleMenuItemClick('/hr/reports')}
                            >
                              <Star className="mr-2 h-4 w-4" />
                              <span>Reports</span>
                            </DropdownMenuItem>
                          </>
                        ) : (
                          // Employer admin menu items
                          <>
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
                              onClick={() => handleMenuItemClick('/employer/jobs')}
                            >
                              <Building2 className="mr-2 h-4 w-4" />
                              <span>Manage Jobs</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
                              onClick={() => handleMenuItemClick('/employer/candidates')}
                            >
                              <User className="mr-2 h-4 w-4" />
                              <span>Find Candidates</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
                              onClick={() => handleMenuItemClick('/employer/company')}
                            >
                              <Building2 className="mr-2 h-4 w-4" />
                              <span>Company Profile</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </>
                    ) : (
                      // Candidate menu items
                      candidateMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <DropdownMenuItem 
                            key={item.label} 
                            className="cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
                            onClick={() => handleMenuItemClick(item.href)}
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            <span>{item.label}</span>
                          </DropdownMenuItem>
                        );
                      })
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={isEmployerAuthenticated ? () => employerLogout() : handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="font-medium hover:bg-gray-50 transition-colors">
                      Sign In <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Candidate Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/employer-login" className="w-full">
                        <Building2 className="h-4 w-4 mr-2" />
                        Employer Login
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" className="font-medium cb-gradient-primary hover:shadow-lg transition-all duration-200 border-0">
                      Sign Up <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/register" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Job Seeker
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/employer-register" className="w-full">
                        <Building2 className="h-4 w-4 mr-2" />
                        Employer
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <div className="hidden lg:flex items-center text-sm text-gray-600 border-l pl-4 ml-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">For employers</span>
                <Link href="/employer/post-job">
                  <span className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer transition-colors">Post a job</span>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 bg-white/95 backdrop-blur-md">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "block px-3 py-3 rounded-lg text-base font-medium transition-colors mx-2",
                      location === item.href
                        ? "text-purple-600 bg-purple-50"
                        : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
              {!user && (
                <div className="pt-4 space-y-2 mx-2">
                  <Link href="/login">
                    <Button variant="ghost" className="w-full justify-start font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full cb-gradient-primary border-0">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
