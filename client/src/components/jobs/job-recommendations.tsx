import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingUp, MapPin, Building, Clock, Star, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface JobMatch {
  job: any;
  matchScore: number;
  matchReasons: string[];
  skillsMatched: string[];
  skillsMissing: string[];
}

interface JobRecommendationsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showMatchDetails?: boolean;
}

export default function JobRecommendations({ 
  title = "Recommended for You", 
  subtitle = "Jobs that match your profile",
  limit = 6,
  showMatchDetails = true 
}: JobRecommendationsProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: recommendations = [], isLoading } = useQuery<JobMatch[]>({
    queryKey: ["/api/jobs/recommendations", user?.id],
    enabled: !!user?.id,
    refetchOnWindowFocus: false,
  });

  const formatSalary = (min: string, max: string) => {
    if (!min || !max) return "Salary not disclosed";
    const minLakh = Math.round(parseInt(min) / 100000);
    const maxLakh = Math.round(parseInt(max) / 100000);
    return `₹${minLakh} - ${maxLakh} LPA`;
  };

  const getMatchColor = (score: number) => {
    if (score >= 0.8) return "text-green-600 bg-green-50";
    if (score >= 0.6) return "text-blue-600 bg-blue-50";
    if (score >= 0.4) return "text-orange-600 bg-orange-50";
    return "text-gray-600 bg-gray-50";
  };

  const getMatchLabel = (score: number) => {
    if (score >= 0.8) return "Excellent Match";
    if (score >= 0.6) return "Good Match";
    if (score >= 0.4) return "Fair Match";
    return "Basic Match";
  };

  if (!user) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Personalized Recommendations</h3>
          <p className="text-gray-600 mb-4">Sign in to see jobs matched to your skills and preferences</p>
          <Button onClick={() => setLocation("/login")}>Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
          <p className="text-gray-600 mb-4">
            Complete your profile with skills and experience to get personalized job recommendations
          </p>
          <Button onClick={() => setLocation("/candidate-dashboard#profile")}>
            Complete Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  const displayRecommendations = recommendations.slice(0, limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
        {recommendations.length > limit && (
          <Button variant="outline" onClick={() => setLocation("/jobs?recommendations=true")}>
            View All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayRecommendations.map((match) => (
          <Card 
            key={match.job.id} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-l-4 border-l-purple-500"
            onClick={() => setLocation(`/jobs/${match.job.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg group-hover:text-purple-600 transition-colors line-clamp-2">
                    {match.job.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{match.job.company?.name}</span>
                  </div>
                </div>
                {showMatchDetails && (
                  <Badge className={`${getMatchColor(match.matchScore)} border-0 text-xs`}>
                    {Math.round(match.matchScore * 100)}%
                  </Badge>
                )}
              </div>

              {showMatchDetails && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Match Score</span>
                    <span className="font-medium">{getMatchLabel(match.matchScore)}</span>
                  </div>
                  <Progress 
                    value={match.matchScore * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{match.job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{match.job.jobType}</span>
                </div>
              </div>

              <div className="text-sm font-medium text-green-600">
                {formatSalary(match.job.salaryMin, match.job.salaryMax)}
              </div>

              {showMatchDetails && match.skillsMatched.length > 0 && (
                <div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Skills Match ({match.skillsMatched.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {match.skillsMatched.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-green-50 text-green-700">
                        {skill}
                      </Badge>
                    ))}
                    {match.skillsMatched.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{match.skillsMatched.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {showMatchDetails && match.skillsMissing.length > 0 && match.skillsMissing.length <= 2 && (
                <div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                    <AlertCircle className="h-3 w-3 text-orange-500" />
                    <span>Skills to Learn</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {match.skillsMissing.slice(0, 2).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-orange-600 border-orange-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {showMatchDetails && match.matchReasons.length > 0 && (
                <div className="text-xs text-gray-600">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-3 w-3 text-purple-500" />
                    <span className="font-medium">Why this matches:</span>
                  </div>
                  <div className="pl-4">
                    {match.matchReasons.slice(0, 2).map((reason, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                size="sm" 
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setLocation(`/jobs/${match.job.id}`);
                }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}