import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Users, Building, Star, Globe, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import JobCard from "@/components/jobs/job-card";

interface CompanyProfileProps {
  user?: any;
}

export default function CompanyProfile({ user }: CompanyProfileProps) {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ["/api/companies", id],
  });

  const { data: companyJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/jobs", { companyId: id }],
    queryFn: async () => {
      const response = await fetch(`/api/jobs?companyId=${id}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      return response.json();
    },
  });

  const handleApply = (jobId: number) => {
    if (!user) {
      setLocation("/login");
      return;
    }
    // Handle job application logic
    console.log("Applying to job:", jobId);
  };

  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(ratingNum)
            ? "fill-current text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (companyLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Skeleton className="h-64 w-full" />
              <div className="lg:col-span-2">
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Company not found</h1>
          <p className="text-gray-600 mb-4">The company you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation("/companies")}>Browse Companies</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Company Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start space-x-6">
            <img
              src={company.logo || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&h=120&fit=crop"}
              alt={`${company.name} logo`}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{company.industry}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {company.location}
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {company.employeeCount} employees
                </span>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    Website
                  </a>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {renderStars(company.rating || "0")}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {company.rating || "N/A"}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {company.reviewCount?.toLocaleString() || "0"} reviews
                </span>
                <Badge variant="outline">{company.companyType}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">About</h4>
                  <p className="text-gray-600 text-sm">
                    {company.description || "No description available"}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Company Size</h4>
                  <p className="text-gray-600 text-sm">{company.employeeCount} employees</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Industry</h4>
                  <p className="text-gray-600 text-sm">{company.industry}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Company Type</h4>
                  <Badge variant="outline">{company.companyType}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Rating & Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Rating & Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {company.rating || "N/A"}
                  </div>
                  <div className="flex justify-center mb-2">
                    {renderStars(company.rating || "0")}
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on {company.reviewCount?.toLocaleString() || "0"} reviews
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  View all reviews
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Open Positions</span>
                  <span className="text-sm font-normal text-gray-600">
                    {companyJobs?.length || 0} jobs
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <Skeleton className="w-12 h-12 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-1/2" />
                            <Skeleton className="h-3 w-2/3" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : companyJobs?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No open positions at the moment</p>
                    <Button variant="outline" onClick={() => setLocation("/jobs")}>
                      Browse other jobs
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {companyJobs?.map((job: any) => (
                      <JobCard key={job.id} job={job} onApply={handleApply} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
