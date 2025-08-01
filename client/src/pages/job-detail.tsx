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
import SimilarJobs from "@/components/jobs/similar-jobs";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Job Header */}
          <Card className="border-0 shadow-2xl cb-shadow-glow bg-white/95 backdrop-blur-md">
            <CardContent className="p-8">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-green-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {job.company.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <button 
                    onClick={() => setLocation(`/companies/${job.companyId}`)}
                    className="text-xl text-purple-600 font-medium mb-4 hover:text-purple-700 transition-colors"
                  >
                    {job.company.name}
                  </button>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                    <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {job.experience}
                    </span>
                    <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.location}
                    </span>
                    {job.salaryMin && job.salaryMax && (
                      <span className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        <IndianRupee className="h-4 w-4 mr-2" />
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </span>
                    )}
                    <span className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      <Clock className="h-4 w-4 mr-2" />
                      {getTimeAgo(job.postedAt)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(parseFloat(job.company.rating || "0"))
                                ? "fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{job.company.rating || "N/A"}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {job.company.reviewCount?.toLocaleString() || "0"} reviews
                    </span>
                    <Badge className="bg-purple-100 text-purple-800">
                      {job.applicationCount || 0} applicants
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={handleApply}
                      disabled={hasApplied}
                      size="lg"
                      className={`${
                        hasApplied
                          ? "bg-green-500 hover:bg-green-600"
                          : "cb-gradient-primary hover:shadow-lg"
                      } border-0 font-semibold transition-all duration-300`}
                    >
                      {hasApplied ? "✓ Applied" : "Apply Now"}
                    </Button>
                    <Button variant="outline" size="lg" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      Save Job
                    </Button>
                    <Button variant="outline" size="lg" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card className="border-0 shadow-lg cb-shadow-glow bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg cb-shadow-glow bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Skills Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {job.skills?.map((skill: string, index: number) => (
                    <Badge key={index} className="bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg cb-shadow-glow bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Job Type:</span>
                  <Badge className="bg-green-100 text-green-800">{job.jobType || "Full-time"}</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Experience:</span>
                  <span className="font-semibold text-gray-900">{job.experience}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Applications:</span>
                  <span className="font-semibold text-gray-900">{job.applicationCount || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <Card className="border-0 shadow-lg cb-shadow-glow bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-600 mr-3 mt-1 font-bold">•</span>
                      <span className="text-gray-700 leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <Card className="border-0 shadow-lg cb-shadow-glow bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-3 mt-1 font-bold">✓</span>
                      <span className="text-gray-700 leading-relaxed">{benefit}</span>
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

          {/* Similar Jobs */}
          <SimilarJobs 
            jobId={parseInt(id!)} 
            currentJobTitle={job.title}
            limit={4}
          />
        </div>
      </div>
    </div>
  );
}
