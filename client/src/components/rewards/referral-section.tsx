import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Share2, 
  Copy, 
  Mail, 
  MessageCircle, 
  ExternalLink,
  Gift,
  Users,
  TrendingUp,
  Link as LinkIcon
} from "lucide-react";

interface ReferralSectionProps {
  points: number;
  userId?: number;
}

export default function ReferralSection({ points, userId }: ReferralSectionProps) {
  const { toast } = useToast();
  const [referralCode] = useState(`CAREER${userId || '000'}`);
  const [email, setEmail] = useState("");
  
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link copied!",
      description: "Referral link has been copied to clipboard",
    });
  };

  const shareViaEmail = () => {
    const subject = "Join Career-Bazaar and Get Amazing Job Opportunities!";
    const body = `Hi there!

I've been using Career-Bazaar to find amazing job opportunities and wanted to share it with you. It's a fantastic platform that helps you:

🎯 Find your dream job with AI-powered matching
💼 Connect with top companies
📈 Track your career growth
🎁 Earn reward points for various activities

Use my referral link to get started and we both earn 20 reward points:
${referralLink}

Hope this helps you in your career journey!

Best regards`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const shareOnWhatsApp = () => {
    const message = `🚀 Hey! I found this amazing job platform - Career-Bazaar! 

It helps you find great jobs with AI matching and you can earn reward points too! 

Join using my link and we both get 20 points: ${referralLink}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareOnSocial = (platform: string) => {
    const text = "🚀 Join me on Career-Bazaar - the best platform to find your dream job! Use my referral link and we both earn reward points!";
    let url = "";
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="space-y-6">
      {/* Referral Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Gift className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">20</div>
                <div className="text-sm opacity-90">Points per Referral</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-600">Friends Referred</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-600">Total Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-green-600" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              value={referralLink} 
              readOnly 
              className="flex-1 bg-gray-50"
            />
            <Button onClick={copyReferralLink} size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Your Code: {referralCode}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600">
            Share this link with friends. When they sign up and complete their profile, you both earn 20 reward points!
          </p>
        </CardContent>
      </Card>

      {/* Share Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-blue-600" />
            Share with Friends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email Sharing */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Send via Email</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter friend's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
              <Button 
                onClick={shareViaEmail} 
                disabled={!email}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Share</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                onClick={shareOnWhatsApp}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                WhatsApp
              </Button>
              
              <Button
                variant="outline"
                onClick={() => shareOnSocial('twitter')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4 text-blue-400" />
                Twitter
              </Button>
              
              <Button
                variant="outline"
                onClick={() => shareOnSocial('facebook')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              
              <Button
                variant="outline"
                onClick={() => shareOnSocial('linkedin')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4 text-blue-700" />
                LinkedIn
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Benefits */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-green-800">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 rounded-full p-1">
                <span className="block w-6 h-6 bg-green-600 rounded-full text-white text-xs flex items-center justify-center">1</span>
              </div>
              <div>
                <h4 className="font-medium text-green-800">Share your link</h4>
                <p className="text-sm text-green-700">Send your unique referral link to friends via email or social media</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-green-100 rounded-full p-1">
                <span className="block w-6 h-6 bg-green-600 rounded-full text-white text-xs flex items-center justify-center">2</span>
              </div>
              <div>
                <h4 className="font-medium text-green-800">Friend signs up</h4>
                <p className="text-sm text-green-700">Your friend creates an account using your referral link</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-green-100 rounded-full p-1">
                <span className="block w-6 h-6 bg-green-600 rounded-full text-white text-xs flex items-center justify-center">3</span>
              </div>
              <div>
                <h4 className="font-medium text-green-800">Both earn points</h4>
                <p className="text-sm text-green-700">When they complete their profile, you both get 20 reward points!</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}