import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Search, MapPin, Users, Briefcase, Eye, UserMinus, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";

interface FollowingCompany {
  id: number;
  name: string;
  industry: string;
  location: string;
  followedDate: string;
  employeeCount: string;
  openJobs: number;
  logo?: string;
  description: string;
  isHiring: boolean;
}

export default function FollowingCompanies({ user }: { user: any }) {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [industryFilter, setIndustryFilter] = useState("all");
  
  // Mock following companies data
  const [followingCompanies, setFollowingCompanies] = useState<FollowingCompany[]>([
    {
      id: 1,
      name: "Tata Consultancy Services",
      industry: "Technology",
      location: "Mumbai",
      followedDate: "2025-01-20",
      employeeCount: "50,000+",
      openJobs: 12,
      description: "Leading global IT services and consulting company",
      isHiring: true
    },
    {
      id: 2,
      name: "Infosys",
      industry: "Technology",
      location: "Bangalore",
      followedDate: "2025-01-18",
      employeeCount: "30,000+",
      openJobs: 8,
      description: "Digital services and consulting company",
      isHiring: true
    },
    {
      id: 3,
      name: "Reliance Industries",
      industry: "Conglomerate",
      location: "Mumbai",
      followedDate: "2025-01-15",
      employeeCount: "25,000+",
      openJobs: 5,
      description: "India's largest private sector company",
      isHiring: false
    },
    {
      id: 4,
      name: "HDFC Bank",
      industry: "Banking",
      location: "Mumbai",
      followedDate: "2025-01-12",
      employeeCount: "15,000+",
      openJobs: 3,
      description: "Leading private sector bank in India",
      isHiring: true
    }
  ]);

  const filteredCompanies = followingCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === "all" || company.industry.toLowerCase() === industryFilter.toLowerCase();
    return matchesSearch && matchesIndustry;
  });

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.followedDate).getTime() - new Date(a.followedDate).getTime();
      case "name":
        return a.name.localeCompare(b.name);
      case "jobs":
        return b.openJobs - a.openJobs;
      default:
        return 0;
    }
  });

  const unfollowCompany = (companyId: number) => {
    setFollowingCompanies(followingCompanies.filter(company => company.id !== companyId));
  };

  const getHiringBadge = (isHiring: boolean) => {
    return isHiring ? (
      <Badge variant="default" className="bg-green-100 text-green-800">Actively Hiring</Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-600">Not Hiring</Badge>
    );
  };

  const industries = Array.from(new Set(followingCompanies.map(c => c.industry)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Following Companies</h1>
          <p className="text-gray-600">Track updates from companies you're interested in</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Followed</SelectItem>
                  <SelectItem value="name">Company Name</SelectItem>
                  <SelectItem value="jobs">Open Jobs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{followingCompanies.length}</p>
                  <p className="text-sm text-gray-600">Following</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{followingCompanies.reduce((sum, c) => sum + c.openJobs, 0)}</p>
                  <p className="text-sm text-gray-600">Total Open Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{followingCompanies.filter(c => c.isHiring).length}</p>
                  <p className="text-sm text-gray-600">Actively Hiring</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{industries.length}</p>
                  <p className="text-sm text-gray-600">Industries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Companies List */}
        <div className="space-y-4">
          {sortedCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {company.industry}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {company.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {company.employeeCount} employees
                          </span>
                        </div>
                      </div>
                      {getHiringBadge(company.isHiring)}
                    </div>
                    <p className="text-gray-700 mb-3">{company.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-medium text-purple-600">{company.openJobs} open positions</span>
                      <span>Following since {new Date(company.followedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4 lg:mt-0 lg:ml-6">
                    <Button 
                      className="cb-gradient-primary"
                      onClick={() => setLocation(`/companies/${company.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Company
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setLocation(`/companies/${company.id}/jobs`)}
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        View Jobs
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => unfollowCompany(company.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Unfollow
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {sortedCompanies.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || industryFilter !== "all" 
                    ? "Try adjusting your filters to see more results."
                    : "Start following companies to stay updated on their latest job openings and news."
                  }
                </p>
                <Button 
                  className="cb-gradient-primary"
                  onClick={() => setLocation('/companies')}
                >
                  Explore Companies
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}