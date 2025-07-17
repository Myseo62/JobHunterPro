import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Video, FileText, TrendingUp, Clock, User, Search, Filter, ExternalLink, Download } from "lucide-react";

interface ResourcesProps {
  user?: any;
}

export default function Resources({ user }: ResourcesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const resources = [
    {
      id: 1,
      title: "Complete Guide to Technical Interviews",
      description: "Comprehensive guide covering data structures, algorithms, and system design interviews",
      type: "Guide",
      category: "Interview Prep",
      readTime: "45 min",
      author: "Career-Bazaar Team",
      icon: BookOpen,
      downloadUrl: "#",
      featured: true
    },
    {
      id: 2,
      title: "Resume Templates for Software Engineers",
      description: "ATS-friendly resume templates specifically designed for tech professionals",
      type: "Template",
      category: "Resume",
      readTime: "5 min",
      author: "HR Experts",
      icon: FileText,
      downloadUrl: "#",
      featured: false
    },
    {
      id: 3,
      title: "Salary Negotiation Masterclass",
      description: "Learn proven strategies to negotiate better compensation packages",
      type: "Video",
      category: "Career Growth",
      readTime: "2 hours",
      author: "Industry Leaders",
      icon: Video,
      downloadUrl: "#",
      featured: true
    },
    {
      id: 4,
      title: "2024 Tech Industry Trends Report",
      description: "Latest insights on emerging technologies, job market trends, and skill demands",
      type: "Report",
      category: "Industry Insights",
      readTime: "30 min",
      author: "Market Research Team",
      icon: TrendingUp,
      downloadUrl: "#",
      featured: false
    },
    {
      id: 5,
      title: "Behavioral Interview Questions Database",
      description: "200+ behavioral questions with sample answers and tips",
      type: "Database",
      category: "Interview Prep",
      readTime: "20 min",
      author: "Interview Coaches",
      icon: BookOpen,
      downloadUrl: "#",
      featured: false
    },
    {
      id: 6,
      title: "Remote Work Setup Guide",
      description: "Essential tips for creating an effective remote work environment",
      type: "Guide",
      category: "Work-Life",
      readTime: "15 min",
      author: "Remote Work Experts",
      icon: FileText,
      downloadUrl: "#",
      featured: false
    }
  ];

  const categories = [
    "Interview Prep",
    "Resume",
    "Career Growth", 
    "Industry Insights",
    "Work-Life",
    "Skill Development"
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || resource.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const featuredResources = resources.filter(resource => resource.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Career Resources
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Free guides, templates, and tools to accelerate your career growth
            </p>
            
            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <Filter className="h-5 w-5 text-gray-400" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map((resource) => {
              const IconComponent = resource.icon;
              return (
                <Card 
                  key={resource.id} 
                  className="relative overflow-hidden border-0 cb-shadow-glow bg-white/95 backdrop-blur-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute top-4 right-4">
                    <Badge className="cb-gradient-primary border-0">
                      Featured
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 cb-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900 leading-tight">
                          {resource.title}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-2">
                          {resource.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{resource.readTime}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{resource.author}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1 cb-gradient-primary border-0"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* All Resources */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            All Resources ({filteredResources.length})
          </h2>
          <Select defaultValue="newest">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <Button onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
            }}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const IconComponent = resource.icon;
              return (
                <Card 
                  key={resource.id} 
                  className="overflow-hidden border-0 cb-shadow-glow bg-white/95 backdrop-blur-md hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900 leading-tight">
                          {resource.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {resource.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {resource.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{resource.readTime}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span>{resource.author}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1 cb-gradient-primary border-0"
                      >
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get the latest career resources, industry insights, and job market trends delivered to your inbox
            </p>
            <div className="max-w-md mx-auto flex space-x-2">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button className="cb-gradient-primary border-0">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Join 10,000+ professionals. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}