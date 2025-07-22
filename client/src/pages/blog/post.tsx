import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, User, Eye, Clock, ArrowLeft, Share2, Bookmark, Heart, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  // Mock blog post data - in real app would fetch from API
  const post = {
    id: parseInt(id || "1"),
    title: "10 Essential Tips for Landing Your Dream Job in 2025",
    content: `
      <p>The job market in 2025 is more competitive than ever, but with the right strategies, you can stand out from the crowd and land the position you've been dreaming of. After interviewing hundreds of successful job seekers and hiring managers, we've compiled the most effective tips that will give you a significant advantage in your job search.</p>

      <h2>1. Optimize Your Digital Presence</h2>
      <p>Your online presence is often the first impression you make on potential employers. Ensure your LinkedIn profile is complete, professional, and actively updated. Use industry-relevant keywords in your profile and share valuable content to establish yourself as a thought leader in your field.</p>

      <h2>2. Master the Art of Networking</h2>
      <p>While online applications are important, networking remains one of the most effective ways to find job opportunities. Attend industry events, join professional associations, and don't hesitate to reach out to people in your desired field. Remember, many positions are never publicly advertised.</p>

      <h2>3. Tailor Your Resume for Each Application</h2>
      <p>Gone are the days of sending the same resume to every employer. Take the time to customize your resume for each position, highlighting the skills and experiences that are most relevant to the specific job requirements. Use keywords from the job description to help your resume pass through applicant tracking systems (ATS).</p>

      <h2>4. Develop In-Demand Skills</h2>
      <p>The skills landscape is constantly evolving. Stay ahead of the curve by identifying and developing the skills that are most in-demand in your industry. This might include technical skills like data analysis or soft skills like emotional intelligence and adaptability.</p>

      <h2>5. Prepare for Modern Interview Formats</h2>
      <p>Interviews have evolved beyond the traditional face-to-face meeting. Be prepared for video interviews, panel interviews, and even virtual reality assessments. Practice common interview questions, but also be ready for behavioral questions and case studies that assess your problem-solving abilities.</p>

      <h2>6. Leverage Job Search Platforms Effectively</h2>
      <p>Don't just browse job boards passively. Set up job alerts, follow companies you're interested in, and engage with their content. Platforms like Career-Bazaar offer advanced filtering options that can help you find positions that truly match your criteria.</p>

      <h2>7. Build a Strong Personal Brand</h2>
      <p>Your personal brand is what sets you apart from other candidates with similar qualifications. Define what makes you unique and consistently communicate this through your resume, cover letters, social media presence, and interviews.</p>

      <h2>8. Don't Underestimate the Power of a Great Cover Letter</h2>
      <p>While some argue that cover letters are outdated, a well-crafted cover letter can still make a significant impact. Use it to tell your story, explain career changes, and demonstrate your understanding of the company and role.</p>

      <h2>9. Follow Up Strategically</h2>
      <p>Following up after submitting an application or completing an interview shows initiative and genuine interest. However, be strategic about it – one follow-up email after a week is usually appropriate, but avoid being pushy or desperate.</p>

      <h2>10. Stay Persistent and Positive</h2>
      <p>Job searching can be emotionally challenging, especially when facing rejections. Remember that rejection often has nothing to do with your qualifications – it might simply be a matter of fit or timing. Stay persistent, learn from each experience, and maintain a positive attitude throughout the process.</p>

      <h2>Conclusion</h2>
      <p>Landing your dream job in 2025 requires a combination of traditional job search strategies and modern digital techniques. By implementing these tips and staying consistent with your efforts, you'll significantly increase your chances of success. Remember, the perfect job is out there – it's just a matter of presenting yourself in the best possible light and persevering until you find the right match.</p>

      <p>What strategies have worked best in your job search? Share your experiences in the comments below, and don't forget to subscribe to our newsletter for more career insights and tips.</p>
    `,
    author: "Priya Sharma",
    authorBio: "Career Consultant and HR Director with 12+ years experience in talent acquisition. Helps professionals navigate career transitions and land their dream jobs.",
    publishedDate: "2025-01-20",
    category: "Career Tips",
    readTime: "8 min read",
    views: 2450,
    tags: ["job search", "career growth", "tips", "2025", "job market"],
    featured: true
  };

  const relatedPosts = [
    {
      id: 2,
      title: "The Rise of Remote Work: How to Excel in a Distributed Team",
      readTime: "12 min read",
      category: "Remote Work"
    },
    {
      id: 5,
      title: "Building a Personal Brand That Opens Doors",
      readTime: "9 min read",
      category: "Career Tips"
    },
    {
      id: 6,
      title: "Common Interview Mistakes and How to Avoid Them",
      readTime: "7 min read",
      category: "Interview Prep"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/blog")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>

        {/* Article Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="default">{post.category}</Badge>
              {post.featured && <Badge variant="outline">Featured</Badge>}
            </div>
            
            <CardTitle className="text-3xl leading-tight mb-4">
              {post.title}
            </CardTitle>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{post.author}</p>
                  <div className="flex items-center text-sm text-gray-500 gap-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.publishedDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {post.views.toLocaleString()} views
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Bookmark className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-1" />
                  Like
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                {/* Tags */}
                <Separator className="my-8" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Author Bio */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-lg">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      About {post.author}
                    </h3>
                    <p className="text-gray-600 mb-4">{post.authorBio}</p>
                    <Button variant="outline" size="sm">
                      View All Articles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Comments
                </CardTitle>
                <CardDescription>
                  Share your thoughts and experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="mb-2">Be the first to comment!</p>
                  <p className="text-sm">Share your thoughts about this article.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Table of Contents */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2 text-sm">
                  <a href="#optimize-digital" className="block text-gray-600 hover:text-purple-600 transition-colors">
                    1. Optimize Your Digital Presence
                  </a>
                  <a href="#networking" className="block text-gray-600 hover:text-purple-600 transition-colors">
                    2. Master the Art of Networking
                  </a>
                  <a href="#tailor-resume" className="block text-gray-600 hover:text-purple-600 transition-colors">
                    3. Tailor Your Resume for Each Application
                  </a>
                  <a href="#develop-skills" className="block text-gray-600 hover:text-purple-600 transition-colors">
                    4. Develop In-Demand Skills
                  </a>
                  <a href="#interview-prep" className="block text-gray-600 hover:text-purple-600 transition-colors">
                    5. Prepare for Modern Interview Formats
                  </a>
                </nav>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Articles</CardTitle>
                <CardDescription>More career insights you might like</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <div 
                      key={relatedPost.id}
                      className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                      onClick={() => setLocation(`/blog/${relatedPost.id}`)}
                    >
                      <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Badge variant="outline" className="text-xs">
                          {relatedPost.category}
                        </Badge>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setLocation("/blog")}
                >
                  View All Articles
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}