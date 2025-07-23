import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Menu, X, User, LogOut, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  user?: any;
  onLogout?: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const navigation = [
    { label: "Find Jobs", href: "/jobs" },
    { label: "Companies", href: "/companies" },
    { label: "Career Guide", href: "/services" },
    { label: "Success Stories", href: "/resources" },
  ];

  const handleLogout = () => {
    onLogout?.();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
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
            {user ? (
              <div className="flex items-center space-x-3">
                <Link href="/candidate-dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-medium hover:bg-gray-50 transition-colors">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="font-medium cb-gradient-primary hover:shadow-lg transition-all duration-200 border-0">
                    Sign Up
                  </Button>
                </Link>
              </>
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
