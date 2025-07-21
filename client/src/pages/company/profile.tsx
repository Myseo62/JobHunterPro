import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { 
  Building, 
  MapPin, 
  Globe, 
  Users, 
  Star, 
  Briefcase,
  Calendar,
  ArrowLeft,
  ExternalLink
} from "lucide-react";

interface Company {
  id: number;
  name: string;
  description: string;
  industry: string;
  website: string;
  location: string;
  logo: string;
  employeeCount: string;
  rating: number;
  reviewCount: number;
  companyType: string;
}

interface Job {
  id: number;
  title: string;
  location: string;
  experience: string;
  salaryMin: number;
  salaryMax: number;
  applicationCount: number;
  postedAt: string;
  isActive: boolean;
  companyId?: number;
}

export default function CompanyProfile() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const companyId = params.id || "1";

  // Fetch company data
  const { data: company, isLoading: companyLoading } = useQuery<Company>({
    queryKey: ['/api/companies', companyId],
  });

  // Fetch company jobs
  const { data: allJobs = [] } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
  });

  // Filter jobs for this company
  const companyJobs = allJobs.filter(job => job.companyId?.toString() === companyId);

  if (companyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Building className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading company profile...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center">
        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md p-8">
          <div className="text-center">
            <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Company Not Found</h2>
            <p className="text-gray-600 mb-4">The company profile you're looking for doesn't exist.</p>
            <Button onClick={() => setLocation("/companies")}>
              Browse Companies
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/companies")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
          </Button>
        </div>

        {/* Company Header */}
        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Company Logo */}
              <div className="w-24 h-24 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                {company.logo ? (
                  <img 
                    src={company.logo} 
                    alt={company.name} 
                    className="w-16 h-16 object-contain"
                  />
                ) : (
                  <Building className="h-12 w-12 text-purple-600" />
                )}
              </div>

              {/* Company Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {company.location || "Location not specified"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {company.employeeCount || "Company size not specified"} employees
                      </span>
                      <Badge variant="outline">{company.industry || "Industry"}</Badge>
                      <Badge variant="outline">{company.companyType || "Company Type"}</Badge>
                    </div>

                    {/* Rating */}
                    {company.rating && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{company.rating}</span>
                        </div>
                        <span className="text-gray-500">
                          ({company.reviewCount || 0} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {company.website && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(company.website, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4" />
                        Visit Website
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      onClick={() => setLocation("/jobs")}
                      className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      View All Jobs
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Company */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">About {company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {company.description || "No company description available."}
                </p>
              </CardContent>
            </Card>

            {/* Current Openings */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  Current Openings ({companyJobs.filter(job => job.isActive).length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {companyJobs.filter(job => job.isActive).length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No current openings</p>
                    <Button 
                      variant="outline"
                      onClick={() => setLocation("/jobs")}
                    >
                      Explore Other Jobs
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {companyJobs.filter(job => job.isActive).map((job) => (
                      <div
                        key={job.id}
                        className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setLocation(`/jobs/${job.id}`)}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              {job.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {job.experience}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(job.postedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-green-600 font-medium">
                                ₹{job.salaryMin?.toLocaleString()} - ₹{job.salaryMax?.toLocaleString()}
                              </span>
                              <span className="text-blue-600">
                                {job.applicationCount} applications
                              </span>
                            </div>
                          </div>
                          <div>
                            <Button 
                              size="sm"
                              className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                            >
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Stats */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Company Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Jobs</span>
                  <span className="font-semibold">{companyJobs.length}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Jobs</span>
                  <span className="font-semibold text-green-600">
                    {companyJobs.filter(job => job.isActive).length}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Industry</span>
                  <Badge variant="outline">{company.industry || "N/A"}</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Company Type</span>
                  <Badge variant="outline">{company.companyType || "N/A"}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Apply */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-green-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-3">Interested in Working Here?</h3>
                <p className="text-purple-100 text-sm mb-4">
                  Explore current job openings and apply directly to join {company.name}.
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-white text-purple-600 hover:bg-gray-50"
                  onClick={() => setLocation("/jobs")}
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Browse All Jobs
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {company.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 text-sm break-all"
                    >
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {company.location || "Location not specified"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}