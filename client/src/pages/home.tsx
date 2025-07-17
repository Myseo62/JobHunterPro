import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Building2, 
  TrendingUp, 
  Users, 
  Star,
  ArrowRight,
  Briefcase,
  Clock,
  DollarSign,
  Sparkles,
  Award,
  Target,
  ChevronRight,
  PlayCircle,
  BookOpen,
  Zap,
  Heart,
  Globe
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  description: string;
  companyId: number;
  location: string;
  experience: string;
  salaryMin: string;
  salaryMax: string;
  jobType: string;
  skills: string[];
  requirements: string[];
  benefits: string[];
  isActive: boolean;
  postedAt: string;
  applicationCount: number;
  company: {
    id: number;
    name: string;
    description: string;
    industry: string;
    website: string;
    location: string;
    logo: string;
    employeeCount: string;
    rating: string;
    reviewCount: number;
    companyType: string;
  };
}

interface Company {
  id: number;
  name: string;
  description: string;
  industry: string;
  website: string;
  location: string;
  logo: string;
  employeeCount: string;
  rating: string;
  reviewCount: number;
  companyType: string;
}

interface JobCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  jobCount: number;
}

interface HomeProps {
  user?: any;
}

export default function Home({ user }: HomeProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");

  // Fetch featured companies
  const { data: featuredCompanies = [] } = useQuery<Company[]>({
    queryKey: ["/api/companies/featured"],
  });

  // Fetch recent jobs
  const { data: recentJobs = [] } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  // Fetch job categories
  const { data: jobCategories = [] } = useQuery<JobCategory[]>({
    queryKey: ["/api/job-categories"],
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (locationQuery) params.append("location", locationQuery);
    if (experienceLevel) params.append("experience", experienceLevel);
    
    setLocation(`/jobs?${params.toString()}`);
  };

  const formatSalary = (min: string, max: string) => {
    const minLakh = Math.round(parseInt(min) / 100000);
    const maxLakh = Math.round(parseInt(max) / 100000);
    return `₹${minLakh} - ${maxLakh} LPA`;
  };

  const trendingRoles = [
    "Software Engineer",
    "Product Manager", 
    "Data Scientist",
    "UX Designer",
    "DevOps Engineer"
  ];

  const careerTips = [
    {
      title: "How to Ace Your Next Interview",
      category: "Interview Tips",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop"
    },
    {
      title: "Building a Strong LinkedIn Profile",
      category: "Career Growth",
      readTime: "7 min read", 
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop"
    },
    {
      title: "Remote Work Best Practices",
      category: "Workplace",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=300&h=200&fit=crop"
    }
  ];

  const successStories = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at Google",
      story: "Found my dream job through Career-Bazaar after 3 months of searching",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop"
    },
    {
      name: "Rahul Verma", 
      role: "Product Manager at Microsoft",
      story: "The platform helped me transition from engineering to product management",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
    }
  ];

  const stats = [
    { label: "Active Jobs", value: "50,000+", icon: Briefcase },
    { label: "Top Companies", value: "2,500+", icon: Building2 },
    { label: "Success Stories", value: "10,000+", icon: Award },
    { label: "Monthly Visitors", value: "1M+", icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 cb-gradient-hero"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-8 animate-fade-in-up">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-white/90 text-sm font-medium">Join 50,000+ professionals</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up leading-tight">
              Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-300">career</span>,<br />
              not just a job
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-fade-in-up leading-relaxed">
              Discover meaningful opportunities with India's top companies. Your next career milestone starts here.
            </p>
            
            {/* Enhanced Search Section */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto animate-fade-in-up cb-shadow-glow">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Job title or keyword"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-gray-900 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                
                <div className="md:col-span-1 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Location"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="pl-12 h-14 text-gray-900 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                
                <div className="md:col-span-1">
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger className="h-14 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-1">
                  <Button 
                    onClick={handleSearch}
                    className="w-full h-14 cb-gradient-primary hover:shadow-xl transition-all duration-300 text-white font-semibold text-lg border-0"
                  >
                    Search Jobs
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Trending Searches */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <span className="text-sm text-gray-600 mr-2">Trending:</span>
                {trendingRoles.map((role) => (
                  <Button
                    key={role}
                    variant="outline"
                    size="sm"
                    className="text-xs hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-colors"
                    onClick={() => {
                      setSearchQuery(role);
                      handleSearch();
                    }}
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 cb-gradient-primary rounded-2xl mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore by <span className="cb-text-gradient">Category</span>
            </h2>
            <p className="text-xl text-gray-600">
              Find opportunities in your field of expertise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobCategories.slice(0, 6).map((category) => (
              <Link key={category.id} href={`/jobs?category=${category.slug}`}>
                <Card className="cb-hover-lift border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-900">{category.name}</CardTitle>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                    <div className="flex items-center text-purple-600">
                      <Briefcase className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">View Jobs</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top <span className="cb-text-gradient">Companies</span> Hiring
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of professionals at leading organizations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCompanies.slice(0, 6).map((company) => (
              <Link key={company.id} href={`/companies/${company.id}`}>
                <Card className="cb-hover-lift border-0 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={company.logo} 
                        alt={company.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900 leading-tight">{company.name}</CardTitle>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{company.rating}</span>
                          <span className="text-sm text-gray-400 ml-1">({company.reviewCount.toLocaleString()})</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{company.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {company.industry}
                      </Badge>
                      <div className="flex items-center text-purple-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="text-sm">{company.employeeCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Latest <span className="cb-text-gradient">Opportunities</span>
              </h2>
              <p className="text-xl text-gray-600">
                Fresh job postings from top companies
              </p>
            </div>
            <Link href="/jobs">
              <Button variant="outline" className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200">
                View All Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentJobs.slice(0, 4).map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <Card className="cb-hover-lift border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900 leading-tight mb-1">{job.title}</CardTitle>
                        <div className="flex items-center text-gray-600">
                          <Building2 className="h-4 w-4 mr-1" />
                          <span className="text-sm">{job.company.name}</span>
                        </div>
                      </div>
                      <img 
                        src={job.company.logo} 
                        alt={job.company.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.experience}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{job.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Posted {new Date(job.postedAt).toLocaleDateString()}
                      </span>
                      <Button size="sm" className="cb-gradient-primary border-0">
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success <span className="cb-text-gradient">Stories</span>
            </h2>
            <p className="text-xl text-gray-600">
              Real people, real career transformations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="border-0 bg-gradient-to-br from-purple-50 to-green-50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={story.image} 
                      alt={story.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{story.name}</h3>
                      <p className="text-sm text-purple-600 mb-2">{story.role}</p>
                      <p className="text-gray-700 italic">"{story.story}"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Career Tips */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Career <span className="cb-text-gradient">Insights</span>
            </h2>
            <p className="text-xl text-gray-600">
              Expert tips to accelerate your career growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {careerTips.map((tip, index) => (
              <Card key={index} className="cb-hover-lift border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={tip.image} 
                    alt={tip.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3 text-xs">
                    {tip.category}
                  </Badge>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{tip.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{tip.readTime}</span>
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                      Read More
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 cb-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to take the next step?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of professionals who found their dream careers through Career-Bazaar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/jobs">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8">
                Explore Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {!user && (
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 font-semibold px-8">
                  Create Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}