import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  Users, 
  Briefcase, 
  Building2,
  Settings,
  HelpCircle,
  ExternalLink
} from "lucide-react";
import { useLocation } from "wouter";

export default function Help() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const helpCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: BookOpen,
      description: "Learn the basics of using Career-Bazaar",
      articles: [
        { title: "Creating Your Account", url: "#", duration: "3 min read" },
        { title: "Setting Up Your Profile", url: "#", duration: "5 min read" },
        { title: "Finding Your First Job", url: "#", duration: "7 min read" },
        { title: "Understanding Job Alerts", url: "#", duration: "4 min read" }
      ]
    },
    {
      id: "job-search",
      title: "Job Search",
      icon: Briefcase,
      description: "Master the art of finding the perfect job",
      articles: [
        { title: "Advanced Search Techniques", url: "#", duration: "6 min read" },
        { title: "Using Filters Effectively", url: "#", duration: "4 min read" },
        { title: "Saving and Organizing Jobs", url: "#", duration: "3 min read" },
        { title: "Setting Up Job Alerts", url: "#", duration: "5 min read" }
      ]
    },
    {
      id: "applications",
      title: "Applications",
      icon: FileText,
      description: "Learn how to apply and track your applications",
      articles: [
        { title: "How to Apply for Jobs", url: "#", duration: "4 min read" },
        { title: "Tracking Application Status", url: "#", duration: "3 min read" },
        { title: "Following Up on Applications", url: "#", duration: "5 min read" },
        { title: "Interview Preparation Tips", url: "#", duration: "8 min read" }
      ]
    },
    {
      id: "employer-guide",
      title: "Employer Guide",
      icon: Building2,
      description: "Complete guide for employers and recruiters",
      articles: [
        { title: "Posting Your First Job", url: "#", duration: "6 min read" },
        { title: "Managing Applications", url: "#", duration: "5 min read" },
        { title: "Searching for Candidates", url: "#", duration: "7 min read" },
        { title: "Company Profile Setup", url: "#", duration: "4 min read" }
      ]
    }
  ];

  const videoTutorials = [
    {
      title: "Career-Bazaar Overview",
      description: "A complete walkthrough of our platform",
      duration: "12:30",
      thumbnail: "/api/placeholder/300/180",
      category: "Getting Started"
    },
    {
      title: "Creating the Perfect Profile",
      description: "Tips to make your profile stand out",
      duration: "8:45",
      thumbnail: "/api/placeholder/300/180",
      category: "Profile"
    },
    {
      title: "Job Search Strategies",
      description: "Find jobs faster with these techniques",
      duration: "15:20",
      thumbnail: "/api/placeholder/300/180",
      category: "Job Search"
    },
    {
      title: "Employer Dashboard Tour",
      description: "Navigate your employer dashboard like a pro",
      duration: "10:15",
      thumbnail: "/api/placeholder/300/180",
      category: "Employers"
    }
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      availability: "Mon-Fri, 9 AM - 6 PM IST",
      action: "Start Chat",
      primary: true
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get detailed help via email",
      availability: "Response within 24 hours",
      action: "Send Email",
      email: "support@career-bazaar.com"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support team",
      availability: "Mon-Fri, 9 AM - 6 PM IST",
      action: "Call Now",
      phone: "+91 1800-123-4567"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers, learn new skills, and get the most out of Career-Bazaar
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-lg"
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="articles" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Contact
            </TabsTrigger>
          </TabsList>

          {/* Help Articles */}
          <TabsContent value="articles" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {helpCategories.map((category) => (
                <Card key={category.id} className="h-fit">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <category.icon className="w-6 h-6 text-purple-600" />
                      <div>
                        <CardTitle>{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.articles.map((article, index) => (
                        <div key={index} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div>
                            <p className="font-medium text-gray-900">{article.title}</p>
                            <p className="text-sm text-gray-500">{article.duration}</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Video Tutorials */}
          <TabsContent value="videos" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videoTutorials.map((video, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-green-100 rounded-t-lg flex items-center justify-center">
                      <Video className="w-12 h-12 text-purple-600" />
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                      {video.duration}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2 text-xs">
                      {video.category}
                    </Badge>
                    <h3 className="font-semibold text-gray-900 mb-1">{video.title}</h3>
                    <p className="text-sm text-gray-600">{video.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Quick answers to the most common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Find detailed answers to all your questions
                  </p>
                  <Button onClick={() => setLocation("/faq")}>
                    View All FAQs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Support */}
          <TabsContent value="contact" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactOptions.map((option, index) => (
                <Card key={index} className={`${option.primary ? 'ring-2 ring-purple-200' : ''}`}>
                  <CardContent className="p-6 text-center">
                    <option.icon className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                    <p className="text-xs text-gray-500 mb-4">{option.availability}</p>
                    <Button 
                      variant={option.primary ? "default" : "outline"} 
                      className="w-full"
                      onClick={() => {
                        if (option.email) {
                          window.location.href = `mailto:${option.email}`;
                        } else if (option.phone) {
                          window.location.href = `tel:${option.phone}`;
                        } else {
                          setLocation("/contact");
                        }
                      }}
                    >
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Popular Resources */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Popular Resources</CardTitle>
            <CardDescription>
              Most viewed help content this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Profile Optimization Guide</p>
                  <p className="text-xs text-gray-500">1.2k views</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <Briefcase className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Job Application Best Practices</p>
                  <p className="text-xs text-gray-500">945 views</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <Settings className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-sm">Account Settings Overview</p>
                  <p className="text-xs text-gray-500">756 views</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}