import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import JobCard from "@/components/jobs/job-card";
import JobFilters from "@/components/jobs/job-filters";
import SearchBar from "@/components/jobs/search-bar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchFilters } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface JobsProps {
  user?: any;
}

export default function Jobs({ user }: JobsProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());
  const [savedJobIds, setSavedJobIds] = useState<Set<number>>(new Set());
  
  // Debug: Check if save functionality is loaded
  console.log('Jobs page loaded with save functionality v2.0');

  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query");
    const loc = urlParams.get("location");
    
    if (query || loc) {
      setFilters(prev => ({
        ...prev,
        ...(query && { query }),
        ...(loc && { location: loc }),
      }));
    }
  }, [location]);

  const { data: jobs, isLoading, refetch } = useQuery({
    queryKey: ["/api/jobs", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString());
        }
      });
      
      const response = await fetch(`/api/jobs?${params}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      return response.json();
    },
  });

  const { data: userApplications } = useQuery({
    queryKey: ["/api/applications/user", user?.id],
    queryFn: () => fetch(`/api/applications/user/${user?.id}`).then(res => res.json()),
    enabled: !!user,
  });

  const { data: savedJobs } = useQuery({
    queryKey: ['/api/saved-jobs'],
    enabled: !!user,
  });

  useEffect(() => {
    if (Array.isArray(userApplications)) {
      const jobIds = new Set(userApplications.map((app: any) => app.jobId));
      setAppliedJobs(jobIds);
    }
  }, [userApplications]);

  useEffect(() => {
    if (Array.isArray(savedJobs)) {
      const jobIds = new Set(savedJobs.map((savedJob: any) => savedJob.jobId));
      setSavedJobIds(jobIds);
    }
  }, [savedJobs]);

  const handleSearch = (query: string, location: string) => {
    const newFilters = { ...filters, query, location };
    setFilters(newFilters);
    
    // Update URL
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (location) params.append("location", location);
    
    setLocation(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleApply = async (jobId: number) => {
    if (!user) {
      setLocation("/login");
      return;
    }

    try {
      await apiRequest("POST", "/api/applications", {
        userId: user.id,
        jobId,
        status: "applied",
      });

      setAppliedJobs(prev => new Set(prev).add(jobId));
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

  const handleSaveJob = async (jobId: number) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to save jobs",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest("POST", "/api/saved-jobs", {
        jobId,
      });

      setSavedJobIds(prev => new Set(prev).add(jobId));
      
      toast({
        title: "Job saved",
        description: "Job has been saved to your profile!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUnsaveJob = async (jobId: number) => {
    if (!user) return;

    try {
      await apiRequest("DELETE", "/api/saved-jobs", {
        jobId,
      });

      setSavedJobIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
      
      toast({
        title: "Job unsaved",
        description: "Job has been removed from your saved jobs",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unsave job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar 
            onSearch={handleSearch} 
            initialQuery={filters.query}
            initialLocation={filters.location}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <JobFilters filters={filters} onFiltersChange={handleFiltersChange} />

          {/* Job Listings */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {isLoading 
                  ? "Loading jobs..." 
                  : `Showing ${jobs?.length || 0} jobs`
                }
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Sort by:</span>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date Posted</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Job Cards */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start space-x-4">
                      <Skeleton className="w-16 h-16 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs?.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
                <Button onClick={() => setFilters({})}>Clear all filters</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs?.map((job: any) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onApply={handleApply}
                    onSave={handleSaveJob}
                    onUnsave={handleUnsaveJob}
                    hasApplied={appliedJobs.has(job.id)}
                    isSaved={savedJobIds.has(job.id)}
                    user={user}
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {jobs && jobs.length > 0 && (
              <div className="text-center mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => refetch()}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Load More Jobs"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
