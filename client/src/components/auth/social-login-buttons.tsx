import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";

interface SocialLoginButtonsProps {
  isLoading?: boolean;
}

export function SocialLoginButtons({ isLoading }: SocialLoginButtonsProps) {
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleLinkedInLogin = () => {
    window.location.href = '/api/auth/linkedin';
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full"
        >
          <FcGoogle className="w-4 h-4 mr-2" />
          Google
        </Button>
        
        <Button
          variant="outline"
          onClick={handleLinkedInLogin}
          disabled={isLoading}
          className="w-full"
        >
          <FaLinkedin className="w-4 h-4 mr-2 text-blue-600" />
          LinkedIn
        </Button>
      </div>
    </div>
  );
}