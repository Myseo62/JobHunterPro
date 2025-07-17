import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Briefcase, IndianRupee, Clock, Users, Building, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";

interface JobDetailProps {
  user?: any;
}

export default function JobDetail({ user }: JobDetailProps) {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: job, isLoading } = useQuery({
    queryKey: ["/api/jobs", id],
  });

  const { data: hasApplied } = useQuery({
    queryKey: ["/api/applications/user", user?.id],
    enabled: !!user,
    select: (applications: any[]) => applications.some(app => app.jobId === parseInt(id!)),
  });

  const handleApply = async () => {
    if (!user) {
      setLocation("/login");
      return;
    }

    try {
      await apiRequest("POST", "/api/applications", {
        userId: user.id,
        jobId: parseInt(id!),
        status: "applied",
      });

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Application failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatSalary = (min: string, max: string) => {
    const minLakhs = Math.round(parseInt(min) / 100000);
    const maxLakhs = Math.round(parseInt(max) / 100000);
    return `₹${minLakhs}-${maxLakhs} LPA`;
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h1>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation("/jobs")}>Browse Jobs</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Job Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={job.company.logo || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop"}
                  alt={`${job.company.name} logo`}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <p className="text-xl text-blue-600 font-medium mb-4">{job.company.name}</p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {job.experience}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </span>
                    {job.salaryMin && job.salaryMax && (
                      <span className="flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </span>
                    )}
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {getTimeAgo(job.postedAt)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(parseFloat(job.company.rating || "0"))
                                ? "fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{job.company.rating || "N/A"}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {job.company.reviewCount?.toLocaleString() || "0"} reviews
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={handleApply}
                      disabled={hasApplied}
                      className={`${
                        hasApplied
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-orange-500 hover:bg-orange-600"
                      } text-white`}
                    >
                      {hasApplied ? "Applied" : "Apply Now"}
                    </Button>
                    <Button variant="outline">
                      Save Job
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Job Type:</span>
                  <span className="font-medium">{job.jobType || "Full-time"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">{job.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Applications:</span>
                  <span className="font-medium">{job.applicationCount || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>About {job.company.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{job.company.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span className="flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  {job.company.industry}
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {job.company.employeeCount} employees
                </span>
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.company.location}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
