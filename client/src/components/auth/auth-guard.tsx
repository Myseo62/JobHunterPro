import { useEffect } from "react";
import { useLocation } from "wouter";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  user?: any;
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = "/login",
  user 
}: AuthGuardProps) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (requireAuth && !user) {
      setLocation(redirectTo);
    }
  }, [user, requireAuth, redirectTo, setLocation]);

  if (requireAuth && !user) {
    return null;
  }

  return <>{children}</>;
}
