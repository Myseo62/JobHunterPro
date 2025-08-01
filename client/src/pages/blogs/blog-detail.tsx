import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useRewardTracking } from "@/hooks/useRewardTracking";
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  Heart, 
  Share2, 
  BookOpen,
  Star,
  User,
  MessageCircle,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
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

interface BlogDetailProps {
  user?: any;
}

export default function BlogDetail({ user }: BlogDetailProps) {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [hasLiked, setHasLiked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  
  const { trackAndNotify } = useRewardTracking(user?.id);

  const { data: blog, isLoading } = useQuery<BlogPost>({
    queryKey: [`/api/blogs/${id}`],
    enabled: !!id,
  });

  const { data: relatedBlogs = [] } = useQuery<BlogPost[]>({
    queryKey: [`/api/blogs/related/${id}`],
    enabled: !!id,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/blogs/${id}/like`, {});
    },
    onSuccess: () => {
      setHasLiked(true);
      queryClient.invalidateQueries({ queryKey: [`/api/blogs/${id}`] });
      toast({
        title: "Blog liked!",
        description: "Thank you for your feedback",
      });
    },
  });

  // Track reading progress and award points
  useEffect(() => {
    if (!blog || !user) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);

      // Award points when user has read 70% of the article
      if (progress > 70 && !sessionStorage.getItem(`blog_read_${id}`)) {
        trackAndNotify('BLOG_READ');
        sessionStorage.setItem(`blog_read_${id}`, 'true');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blog, user, id, trackAndNotify]);

  // Increment view count when blog loads
  useEffect(() => {
    if (blog && id) {
      apiRequest("POST", `/api/blogs/${id}/view`, {}).catch(console.error);
    }
  }, [blog, id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt || 'Check out this blog post',
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Blog link has been copied to clipboard",
    });
  };

  if (isLoading || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-purple-600 to-green-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/blogs">
          <Button variant="ghost" className="mb-6 hover:bg-purple-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>
        </Link>

        {/* Blog Header */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border border-white/50">
          <CardHeader className="pb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {blog.category || 'General'}
              </Badge>
              {blog.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <CardTitle className="text-3xl font-bold text-gray-900 leading-tight">
              {blog.title}
            </CardTitle>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-green-600 text-white">
                    {blog.author.firstName[0]}{blog.author.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">
                    {blog.author.firstName} {blog.author.lastName}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {blog.viewCount} views
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => likeMutation.mutate()}
                  disabled={hasLiked || likeMutation.isPending}
                  className="flex items-center gap-1"
                >
                  <Heart className={`h-4 w-4 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  {blog.likeCount}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center gap-1"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Blog Content */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border border-white/50">
          <CardContent className="p-8">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-purple-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </CardContent>
        </Card>

        {/* Engagement & Reward Info */}
        {user && (
          <Card className="mb-8 border-purple-200 bg-gradient-to-r from-purple-50 to-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-purple-600 to-green-600 p-3 rounded-full">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900">Congratulations!</h3>
                    <p className="text-sm text-purple-700">
                      You earned +5 points for reading this article
                    </p>
                  </div>
                </div>
                <Link href="/blogs/write">
                  <Button className="bg-gradient-to-r from-purple-600 to-green-600">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Write Your Own
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Related Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedBlogs.slice(0, 4).map((relatedBlog) => (
                  <Link key={relatedBlog.id} href={`/blogs/${relatedBlog.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-sm line-clamp-2 mb-2">
                          {relatedBlog.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{relatedBlog.author.firstName} {relatedBlog.author.lastName}</span>
                          <span>{relatedBlog.viewCount} views</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}