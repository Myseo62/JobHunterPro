import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, User, Eye, ArrowRight, TrendingUp, BookOpen } from "lucide-react";
import { useLocation } from "wouter";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  publishedDate: string;
  category: string;
  readTime: string;
  views: number;
  featured: boolean;
  tags: string[];
}

export default function BlogIndex() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const categories = [
    "all",
    "Career Tips",
    "Industry Insights",
    "Job Search",
    "Interview Prep",
    "Salary Negotiation",
    "Company Culture",
    "Remote Work",
    "Skill Development"
  ];

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "10 Essential Tips for Landing Your Dream Job in 2025",
      excerpt: "The job market has evolved significantly in recent years. Here are the strategies that will set you apart from other candidates and help you secure your ideal position.",
      author: "Priya Sharma",
      publishedDate: "2025-01-20",
      category: "Career Tips",
      readTime: "8 min read",
      views: 2450,
      featured: true,
      tags: ["job search", "career growth", "tips"]
    },
    {
      id: 2,
      title: "The Rise of Remote Work: How to Excel in a Distributed Team",
      excerpt: "Remote work is here to stay. Learn the skills and strategies needed to thrive in a remote work environment and advance your career from anywhere.",
      author: "Rajesh Kumar",
      publishedDate: "2025-01-18",
      category: "Remote Work",
      readTime: "12 min read",
      views: 1890,
      featured: true,
      tags: ["remote work", "productivity", "team collaboration"]
    },
    {
      id: 3,
      title: "Salary Negotiation Strategies That Actually Work",
      excerpt: "Don't leave money on the table. Master the art of salary negotiation with these proven strategies that have helped thousands of professionals increase their earnings.",
      author: "Ananya Gupta",
      publishedDate: "2025-01-15",
      category: "Salary Negotiation",
      readTime: "6 min read",
      views: 3200,
      featured: false,
      tags: ["salary", "negotiation", "career advancement"]
    },
    {
      id: 4,
      title: "The Future of AI in Recruitment: What Job Seekers Need to Know",
      excerpt: "Artificial Intelligence is transforming how companies hire. Understand how AI screening works and how to optimize your applications for automated systems.",
      author: "Vikram Singh",
      publishedDate: "2025-01-12",
      category: "Industry Insights",
      readTime: "10 min read",
      views: 1650,
      featured: false,
      tags: ["AI", "recruitment", "technology", "job applications"]
    },
    {
      id: 5,
      title: "Building a Personal Brand That Opens Doors",
      excerpt: "Your personal brand can be your greatest career asset. Learn how to build and maintain a professional brand that attracts opportunities and accelerates your career.",
      author: "Meera Patel",
      publishedDate: "2025-01-10",
      category: "Career Tips",
      readTime: "9 min read",
      views: 2100,
      featured: false,
      tags: ["personal branding", "networking", "career growth"]
    },
    {
      id: 6,
      title: "Common Interview Mistakes and How to Avoid Them",
      excerpt: "Even qualified candidates can lose opportunities due to avoidable interview mistakes. Here are the most common pitfalls and how to navigate them successfully.",
      author: "Arjun Mehta",
      publishedDate: "2025-01-08",
      category: "Interview Prep",
      readTime: "7 min read",
      views: 2800,
      featured: false,
      tags: ["interviews", "job search", "career tips"]
    },
    {
      id: 7,
      title: "Skills That Will Define Your Career in 2025 and Beyond",
      excerpt: "The workplace is evolving rapidly. Discover the technical and soft skills that will be most valuable in the coming years and how to develop them.",
      author: "Sneha Reddy",
      publishedDate: "2025-01-05",
      category: "Skill Development",
      readTime: "11 min read",
      views: 1950,
      featured: true,
      tags: ["skills", "career development", "future of work"]
    },
    {
      id: 8,
      title: "Decoding Company Culture: Red Flags to Watch Out For",
      excerpt: "A company's culture can make or break your job satisfaction. Learn how to evaluate company culture during the interview process and avoid toxic workplaces.",
      author: "Rohit Sharma",
      publishedDate: "2025-01-03",
      category: "Company Culture",
      readTime: "8 min read",
      views: 2250,
      featured: false,
      tags: ["company culture", "workplace", "job search"]
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      case "popular":
        return b.views - a.views;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Career Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert insights, career tips, and industry trends to help you succeed in your professional journey
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="cursor-pointer hover:shadow-lg transition-shadow group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="default">Featured</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.views.toLocaleString()}
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.publishedDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{post.readTime}</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setLocation(`/blog/${post.id}`)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Posts Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              All Articles
            </h2>
            <p className="text-gray-600">
              {sortedPosts.length} {sortedPosts.length === 1 ? 'article' : 'articles'} found
            </p>
          </div>

          {sortedPosts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No articles found</p>
                <p className="text-sm text-gray-500">
                  Try adjusting your search terms or selecting a different category
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPosts.map((post) => (
                <Card key={post.id} className="cursor-pointer hover:shadow-lg transition-shadow group h-full flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.views.toLocaleString()}
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-purple-600 transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.publishedDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{post.readTime}</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setLocation(`/blog/${post.id}`)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <Card className="mt-12 bg-gradient-to-r from-purple-50 to-green-50">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest career insights, job market trends, 
              and professional development tips delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email address" className="flex-1" />
              <Button>Subscribe</Button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Join 10,000+ professionals who trust our weekly insights
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}