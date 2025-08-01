import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building, Clock, ExternalLink, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

interface SimilarJobsProps {
  jobId: number;
  currentJobTitle?: string;
  limit?: number;
}

export default function SimilarJobs({ jobId, currentJobTitle, limit = 4 }: SimilarJobsProps) {
  const [, setLocation] = useLocation();

  const { data: similarJobs = [], isLoading } = useQuery({
    queryKey: ["/api/jobs", jobId, "similar"],
    enabled: !!jobId,
    refetchOnWindowFocus: false,
  });

  const formatSalary = (min: string, max: string) => {
    if (!min || !max) return "Salary not disclosed";
    const minLakh = Math.round(parseInt(min) / 100000);
    const maxLakh = Math.round(parseInt(max) / 100000);
    return `₹${minLakh} - ${maxLakh} LPA`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Similar Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (similarJobs.length === 0) {
    return null;
  }

  const displayJobs = similarJobs.slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Similar Jobs
        </CardTitle>
        {currentJobTitle && (
          <p className="text-sm text-gray-600">
            Other opportunities similar to "{currentJobTitle}"
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {displayJobs.map((job: any) => (
          <div
            key={job.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
            onClick={() => setLocation(`/jobs/${job.id}`)}
          >
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {job.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{job.company?.name || 'Company Name'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{job.jobType || 'Full-time'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-green-600">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation(`/jobs/${job.id}`);
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {job.skills.slice(0, 3).map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {job.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {similarJobs.length > limit && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setLocation(`/jobs?similar=${jobId}`)}
          >
            View All Similar Jobs ({similarJobs.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}