import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Users, Star, Building2, TrendingUp } from "lucide-react";

interface CompaniesDirectoryProps {
  user?: any;
}

export default function CompaniesDirectory({ user }: CompaniesDirectoryProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [companyTypeFilter, setCompanyTypeFilter] = useState("all");

  const { data: companies, isLoading } = useQuery({
    queryKey: ["/api/companies", searchQuery, industryFilter, companyTypeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (industryFilter !== "all") params.append("industry", industryFilter);
      if (companyTypeFilter !== "all") params.append("type", companyTypeFilter);
      
      const response = await fetch(`/api/companies?${params}`);
      if (!response.ok) throw new Error("Failed to fetch companies");
      return response.json();
    },
  });

  const { data: industries } = useQuery({
    queryKey: ["/api/companies/industries"],
    queryFn: async () => {
      const response = await fetch("/api/companies/industries");
      if (!response.ok) throw new Error("Failed to fetch industries");
      return response.json();
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCompanyClick = (companyId: number) => {
    setLocation(`/companies/${companyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Top Companies
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore career opportunities at India's leading companies across various industries
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mt-8 max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search companies by name, industry, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries?.map((industry: string) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={companyTypeFilter} onValueChange={setCompanyTypeFilter}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="All Company Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Company Types</SelectItem>
                    <SelectItem value="MNC">Multinational Corporation</SelectItem>
                    <SelectItem value="Startup">Startup</SelectItem>
                    <SelectItem value="Product">Product Company</SelectItem>
                    <SelectItem value="Service">Service Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isLoading 
              ? "Loading companies..." 
              : `${companies?.length || 0} companies found`
            }
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select defaultValue="rating">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Company Name</SelectItem>
                <SelectItem value="jobs">Most Jobs</SelectItem>
                <SelectItem value="size">Company Size</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : companies?.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
            <Button onClick={() => {
              setSearchQuery("");
              setIndustryFilter("all");
              setCompanyTypeFilter("all");
            }}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies?.map((company: any) => (
              <Card 
                key={company.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-0 cb-shadow-glow bg-white/95 backdrop-blur-md"
                onClick={() => handleCompanyClick(company.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {company.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {company.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{company.industry}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {company.rating && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span>{company.rating}</span>
                          </div>
                        )}
                        {company.employeeCount && (
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{company.employeeCount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {company.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{company.location}</span>
                    </div>
                    {company.companyType && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {company.companyType}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {company.jobCount || 0} open positions
                    </span>
                    <Button 
                      size="sm" 
                      className="cb-gradient-primary border-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompanyClick(company.id);
                      }}
                    >
                      View Company
                    </Button>
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