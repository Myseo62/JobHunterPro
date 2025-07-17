import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/jobs/search-bar";
import FeaturedCompanies from "@/components/companies/featured-companies";
import JobCard from "@/components/jobs/job-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Building, GraduationCap, Heart, Zap, Rocket, Users } from "lucide-react";

interface HomeProps {
  user?: any;
}

export default function Home({ user }: HomeProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const { data: recentJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/jobs"],
  });

  const { data: jobCategories } = useQuery({
    queryKey: ["/api/job-categories"],
  });

  const trendingCategories = [
    { name: "Remote", count: "15K+ jobs", icon: "🏠" },
    { name: "MNC", count: "25K+ jobs", icon: "🏢" },
    { name: "Software & IT", count: "45K+ jobs", icon: "💻" },
    { name: "Data Science", count: "8K+ jobs", icon: "📊" },
    { name: "Banking & Finance", count: "12K+ jobs", icon: "💰" },
    { name: "Marketing", count: "18K+ jobs", icon: "📱" },
  ];

  const companyCategories = [
    { name: "MNCs", count: "2.1K+ actively hiring", icon: Building },
    { name: "Edtech", count: "160 actively hiring", icon: GraduationCap },
    { name: "Healthcare", count: "616 actively hiring", icon: Heart },
    { name: "Unicorns", count: "89 actively hiring", icon: Zap },
    { name: "Startups", count: "673 actively hiring", icon: Rocket },
  ];

  const handleSearch = (query: string, location: string) => {
    setSearchQuery(query);
    setSearchLocation(location);
    setLocation(`/jobs?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
  };

  const handleApply = (jobId: number) => {
    if (!user) {
      setLocation("/login");
      return;
    }
    // Handle job application logic
    console.log("Applying to job:", jobId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find your dream job now
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              5 lakh+ jobs for you to explore
            </p>
            
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {trendingCategories.map((category) => (
              <Badge
                key={category.name}
                variant="secondary"
                className="bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 px-6 py-3 rounded-full cursor-pointer transition-colors"
                onClick={() => handleSearch(category.name, "")}
              >
                <span className="flex items-center space-x-2">
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Recent Jobs */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recent Jobs</h2>
            <Button variant="outline" onClick={() => setLocation("/jobs")}>
              View all jobs
            </Button>
          </div>

          {jobsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentJobs?.slice(0, 3).map((job: any) => (
                <JobCard key={job.id} job={job} onApply={handleApply} />
              ))}
            </div>
          )}
        </section>

        {/* Featured Companies */}
        <FeaturedCompanies />

        {/* Company Categories */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Companies by Industry</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {companyCategories.map((category) => (
              <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="text-blue-600 mb-2">
                    <category.icon className="h-8 w-8 mx-auto" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
