import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Mail, 
  Phone, 
  Download, 
  MessageCircle, 
  Star,
  Users,
  Briefcase,
  GraduationCap,
  Eye
} from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  title: string;
  location: string;
  experience: string;
  currentSalary: string;
  expectedSalary: string;
  skills: string[];
  education: string;
  company: string;
  availability: string;
  profileViews: number;
  rating: number;
  lastActive: string;
  profileComplete: boolean;
}

export default function CandidateSearch({ user }: { user: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [skillsFilter, setSkillsFilter] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  // Mock candidates data
  const candidates: Candidate[] = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91 98765 43210",
      title: "Senior Software Engineer",
      location: "Bangalore",
      experience: "5 years",
      currentSalary: "12 LPA",
      expectedSalary: "15-18 LPA",
      skills: ["React", "Node.js", "Python", "AWS", "Docker"],
      education: "B.Tech Computer Science",
      company: "TechCorp India",
      availability: "2 weeks notice",
      profileViews: 145,
      rating: 4.8,
      lastActive: "2025-01-20",
      profileComplete: true
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya.patel@email.com",
      phone: "+91 87654 32109",
      title: "Frontend Developer",
      location: "Mumbai",
      experience: "3 years",
      currentSalary: "8 LPA",
      expectedSalary: "12-15 LPA",
      skills: ["React", "JavaScript", "CSS", "TypeScript", "Redux"],
      education: "MCA",
      company: "Digital Solutions",
      availability: "Immediate",
      profileViews: 89,
      rating: 4.6,
      lastActive: "2025-01-19",
      profileComplete: true
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit.kumar@email.com",
      phone: "+91 76543 21098",
      title: "Full Stack Developer",
      location: "Hyderabad",
      experience: "7 years",
      currentSalary: "15 LPA",
      expectedSalary: "18-22 LPA",
      skills: ["Java", "Spring Boot", "Angular", "Docker", "Kubernetes"],
      education: "B.E. Information Technology",
      company: "Enterprise Systems",
      availability: "1 month notice",
      profileViews: 203,
      rating: 4.9,
      lastActive: "2025-01-18",
      profileComplete: true
    },
    {
      id: 4,
      name: "Sneha Reddy",
      email: "sneha.reddy@email.com",
      phone: "+91 65432 10987",
      title: "Product Manager",
      location: "Pune",
      experience: "4 years",
      currentSalary: "16 LPA",
      expectedSalary: "20-25 LPA",
      skills: ["Product Strategy", "Analytics", "Agile", "User Research", "Figma"],
      education: "MBA + B.Tech",
      company: "ProductCo",
      availability: "3 weeks notice",
      profileViews: 167,
      rating: 4.7,
      lastActive: "2025-01-17",
      profileComplete: true
    },
    {
      id: 5,
      name: "Vikram Singh",
      email: "vikram.singh@email.com",
      phone: "+91 54321 09876",
      title: "DevOps Engineer",
      location: "Chennai",
      experience: "6 years",
      currentSalary: "14 LPA",
      expectedSalary: "16-20 LPA",
      skills: ["AWS", "Docker", "CI/CD", "Terraform", "Kubernetes"],
      education: "B.Tech Electronics",
      company: "CloudTech",
      availability: "2 weeks notice",
      profileViews: 134,
      rating: 4.5,
      lastActive: "2025-01-16",
      profileComplete: false
    }
  ];

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = !locationFilter || 
                           candidate.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesExperience = experienceFilter === "all" ||
                             (experienceFilter === "0-2" && parseInt(candidate.experience) <= 2) ||
                             (experienceFilter === "3-5" && parseInt(candidate.experience) >= 3 && parseInt(candidate.experience) <= 5) ||
                             (experienceFilter === "6-10" && parseInt(candidate.experience) >= 6 && parseInt(candidate.experience) <= 10) ||
                             (experienceFilter === "10+" && parseInt(candidate.experience) > 10);
    
    const matchesSkills = !skillsFilter || 
                         candidate.skills.some(skill => skill.toLowerCase().includes(skillsFilter.toLowerCase()));
    
    return matchesSearch && matchesLocation && matchesExperience && matchesSkills;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    switch (sortBy) {
      case "relevance":
        return b.rating - a.rating;
      case "experience":
        return parseInt(b.experience) - parseInt(a.experience);
      case "salary":
        return parseInt(b.expectedSalary.split('-')[0]) - parseInt(a.expectedSalary.split('-')[0]);
      case "lastActive":
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      default:
        return 0;
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>Please upgrade to access candidate search</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidate Search</h1>
          <p className="text-gray-600">Find and connect with qualified professionals</p>
        </div>

        {/* Search Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">2,547</p>
                  <p className="text-sm text-gray-600">Total Profiles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">1,234</p>
                  <p className="text-sm text-gray-600">Premium Profiles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-sm text-gray-600">Active This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                  <p className="text-sm text-gray-600">Open to Offers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, title, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Experience</SelectItem>
                    <SelectItem value="0-2">0-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder="Skills (e.g., React, Java)"
                  value={skillsFilter}
                  onChange={(e) => setSkillsFilter(e.target.value)}
                />
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="salary">Expected Salary</SelectItem>
                    <SelectItem value="lastActive">Last Active</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {sortedCandidates.length} Candidates Found
          </h2>
          <Button variant="outline">
            Save Search
          </Button>
        </div>

        {/* Candidates List */}
        <div className="space-y-6">
          {sortedCandidates.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No candidates found</p>
                <p className="text-sm text-gray-500">
                  Try adjusting your search criteria or filters
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedCandidates.map((candidate) => (
              <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="text-lg">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {candidate.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">{candidate.rating}</span>
                          </div>
                          {candidate.profileComplete && (
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              Verified Profile
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-lg text-gray-700 mb-2">{candidate.title}</p>
                        <p className="text-gray-600 mb-3">{candidate.company}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            {candidate.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {candidate.experience}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {candidate.expectedSalary}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            {candidate.availability}
                          </div>
                        </div>
                        
                        <div className="flex items-center mb-4">
                          <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-600">{candidate.education}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {candidate.skills.slice(0, 6).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 6 && (
                            <Badge variant="outline" className="text-xs">
                              +{candidate.skills.length - 6} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {candidate.profileViews} profile views
                            </div>
                            <span>Last active: {new Date(candidate.lastActive).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-6">
                      <Button size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download Resume
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-500">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {candidate.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {candidate.phone}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        Save Profile
                      </Button>
                      <Button variant="ghost" size="sm">
                        Add to Shortlist
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {sortedCandidates.length > 0 && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {sortedCandidates.length} of 2,547 candidates
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}