import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Menu, X, User, LogOut } from "lucide-react";
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
    { label: "Jobs", href: "/jobs" },
    { label: "Companies", href: "/companies" },
    { label: "Services", href: "/services" },
    { label: "Resources", href: "/resources" },
  ];

  const handleLogout = () => {
    onLogout?.();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="text-2xl font-bold text-blue-600 cursor-pointer">
                Career-Bazaar
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "font-medium transition-colors hover:text-blue-600 cursor-pointer",
                    location === item.href
                      ? "text-blue-600"
                      : "text-gray-700"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">
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
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Register
                  </Button>
                </Link>
              </>
            )}

            <div className="hidden lg:block text-sm text-gray-600 border-l pl-4">
              <div>For employers</div>
              <Link href="/employer/post-job">
                <a className="text-blue-600 hover:underline">Post a job</a>
              </Link>
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
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={cn(
                      "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                      location === item.href
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
