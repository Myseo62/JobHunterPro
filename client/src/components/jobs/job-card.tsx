import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, IndianRupee, Star, Clock } from "lucide-react";
import { JobCardProps } from "@/lib/types";

export default function JobCard({ job, onApply, hasApplied = false }: JobCardProps) {
  const formatSalary = (min: string, max: string) => {
    const minLakhs = Math.round(parseInt(min) / 100000);
    const maxLakhs = Math.round(parseInt(max) / 100000);
    return `${minLakhs}-${maxLakhs} LPA`;
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

  return (
    <Card className="hover:shadow-md transition-shadow bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start space-x-4">
            <img
              src={job.company.logo || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop"}
              alt={`${job.company.name} logo`}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                {job.title}
              </h3>
              <p className="text-blue-600 font-medium">{job.company.name}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
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
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-1 mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(parseFloat(job.company.rating || "0"))
                        ? "fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">{job.company.rating || "N/A"}</span>
            </div>
            <span className="text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {getTimeAgo(job.postedAt)}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {job.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {job.skills?.slice(0, 3).map((skill: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills?.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 3} more
              </Badge>
            )}
          </div>
          <Button
            onClick={() => onApply(job.id)}
            disabled={hasApplied}
            className={`font-medium text-sm ${
              hasApplied
                ? "bg-green-500 hover:bg-green-600"
                : "bg-orange-500 hover:bg-orange-600"
            } text-white`}
          >
            {hasApplied ? "Applied" : "Apply Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
