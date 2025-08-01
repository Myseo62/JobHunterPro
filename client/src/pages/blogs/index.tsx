import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { 
  PenTool, 
  Search, 
  Eye, 
  Calendar, 
  User, 
  BookOpen, 
  TrendingUp,
  Gift,
  Heart,
  MessageCircle,
  Filter
} from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

interface BlogPost {
  id: number;
  title: string;
  excerpt?: string;
  content: string;
  category?: string;
  tags?: string[];
  viewCount: number;
  likeCount: number;
  createdAt: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export default function BlogsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: blogs = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blogs", searchQuery, selectedCategory],
    retry: false,
  });

  const categories = [
    { value: "all", label: "All Posts" },
    { value: "career", label: "Career Advice" },
    { value: "tech", label: "Technology" },
    { value: "interview", label: "Interview Tips" },
    { value: "experience", label: "Work Experience" },
    { value: "skills", label: "Skill Development" },
    { value: "industry", label: "Industry Insights" },
  ];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
              Career Blog
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover career insights, interview tips, and professional growth advice from our community
          </p>
        </div>

        {/* Reward Info & Write Button */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border-purple-200 bg-gradient-to-r from-purple-50 to-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-purple-600 to-green-600 p-3 rounded-full">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900">Earn Reward Points</h3>
                    <p className="text-sm text-purple-700">
                      Write: +50 points • Read: +5 points per article
                    </p>
                  </div>
                </div>
                {user?.role === 'candidate' ? (
                  <Link href="/blogs/write">
                    <Button className="bg-gradient-to-r from-purple-600 to-green-600">
                      <PenTool className="h-4 w-4 mr-2" />
                      Write Blog
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    onClick={() => window.location.href = '/login'}
                    className="bg-gradient-to-r from-purple-600 to-green-600"
                  >
                    <PenTool className="h-4 w-4 mr-2" />
                    Login to Write
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
            <CardContent className="p-6">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{blogs.length}</div>
                <div className="text-sm text-gray-600">Published Articles</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border border-white/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search blog posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className="whitespace-nowrap"
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-white/80 backdrop-blur-sm border border-white/50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border border-white/50">
            <CardContent>
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || selectedCategory !== "all" ? "No blogs found" : "No blogs yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedCategory !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Be the first to share your knowledge with the community"
                }
              </p>
              {user?.role === 'candidate' ? (
                <Link href="/blogs/write">
                  <Button className="bg-gradient-to-r from-purple-600 to-green-600">
                    <PenTool className="h-4 w-4 mr-2" />
                    Write First Blog
                  </Button>
                </Link>
              ) : (
                <Button 
                  onClick={() => window.location.href = '/login'}
                  className="bg-gradient-to-r from-purple-600 to-green-600"
                >
                  <PenTool className="h-4 w-4 mr-2" />
                  Login to Write
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="bg-white/80 backdrop-blur-sm border border-white/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {blog.category || 'General'}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Eye className="h-3 w-3" />
                      {blog.viewCount}
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    <a href={`/blogs/${blog.id}`} className="hover:text-purple-600 transition-colors">
                      {blog.title}
                    </a>
                  </CardTitle>
                  {blog.excerpt && (
                    <CardDescription className="line-clamp-2">
                      {blog.excerpt}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-gradient-to-r from-purple-600 to-green-600 text-white">
                          {blog.author.firstName[0]}{blog.author.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>{blog.author.firstName} {blog.author.lastName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {blog.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{blog.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <a href={`/blogs/${blog.id}`}>
                      <Button size="sm" variant="outline">
                        Read More
                      </Button>
                    </a>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {blog.likeCount}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}