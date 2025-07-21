import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, MapPin, Briefcase, Mail, Phone, Download, Star, Filter } from "lucide-react";
import { useLocation } from "wouter";

interface SearchResumeProps {
  user: any;
}

export default function SearchResume({ user }: SearchResumeProps) {
  const [, setLocation] = useLocation();
  const [searchFilters, setSearchFilters] = useState({
    keywords: "",
    location: "",
    experience: "",
    skills: "",
    salary: ""
  });

  // Mock candidate data - in a real app, this would come from API
  const candidates = [
    {
      id: 1,
      name: "Rahul Sharma",
      title: "Senior Software Engineer",
      location: "Bangalore",
      experience: "5 years",
      skills: ["React", "Node.js", "MongoDB", "AWS"],
      currentSalary: "₹12 LPA",
      expectedSalary: "₹18 LPA",
      email: "rahul.sharma@email.com",
      phone: "+91 98765 43210",
      summary: "Experienced full-stack developer with expertise in modern web technologies. Built scalable applications serving millions of users.",
      rating: "4.8"
    },
    {
      id: 2,
      name: "Priya Patel",
      title: "Product Manager",
      location: "Mumbai",
      experience: "7 years",
      skills: ["Product Strategy", "Analytics", "Agile", "SQL"],
      currentSalary: "₹25 LPA",
      expectedSalary: "₹35 LPA",
      email: "priya.patel@email.com",
      phone: "+91 87654 32109",
      summary: "Results-driven product manager with track record of launching successful products. Expert in data-driven decision making.",
      rating: "4.9"
    },
    {
      id: 3,
      name: "Amit Kumar",
      title: "UI/UX Designer",
      location: "Delhi",
      experience: "4 years",
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
      currentSalary: "₹8 LPA",
      expectedSalary: "₹12 LPA",
      email: "amit.kumar@email.com",
      phone: "+91 76543 21098",
      summary: "Creative designer focused on user-centered design. Improved user engagement by 40% through intuitive interface designs.",
      rating: "4.7"
    },
    {
      id: 4,
      name: "Sneha Reddy",
      title: "Data Scientist",
      location: "Hyderabad",
      experience: "3 years",
      skills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
      currentSalary: "₹15 LPA",
      expectedSalary: "₹22 LPA",
      email: "sneha.reddy@email.com",
      phone: "+91 65432 10987",
      summary: "ML engineer with expertise in building predictive models. Developed solutions that increased business efficiency by 30%.",
      rating: "4.6"
    }
  ];

  const [filteredCandidates, setFilteredCandidates] = useState(candidates);

  const handleSearch = () => {
    let filtered = candidates;

    if (searchFilters.keywords) {
      filtered = filtered.filter(candidate => 
        candidate.name.toLowerCase().includes(searchFilters.keywords.toLowerCase()) ||
        candidate.title.toLowerCase().includes(searchFilters.keywords.toLowerCase()) ||
        candidate.summary.toLowerCase().includes(searchFilters.keywords.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchFilters.keywords.toLowerCase()))
      );
    }

    if (searchFilters.location) {
      filtered = filtered.filter(candidate => 
        candidate.location.toLowerCase().includes(searchFilters.location.toLowerCase())
      );
    }

    if (searchFilters.experience) {
      // Simple experience filtering logic
      filtered = filtered.filter(candidate => {
        const expYears = parseInt(candidate.experience);
        const filterExp = searchFilters.experience;
        
        if (filterExp === "0-2 years") return expYears <= 2;
        if (filterExp === "3-5 years") return expYears >= 3 && expYears <= 5;
        if (filterExp === "6-10 years") return expYears >= 6 && expYears <= 10;
        if (filterExp === "10+ years") return expYears > 10;
        
        return true;
      });
    }

    setFilteredCandidates(filtered);
  };

  const resetFilters = () => {
    setSearchFilters({
      keywords: "",
      location: "",
      experience: "",
      skills: "",
      salary: ""
    });
    setFilteredCandidates(candidates);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Resumes</h1>
          <p className="text-gray-600">Find qualified candidates from our extensive database</p>
        </div>

        {/* Search Filters */}
        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Search Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  placeholder="Skills, job title, company"
                  value={searchFilters.keywords}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, keywords: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, state"
                  value={searchFilters.location}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="experience">Experience</Label>
                <Select 
                  value={searchFilters.experience} 
                  onValueChange={(value) => setSearchFilters(prev => ({ ...prev, experience: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2 years">0-2 years</SelectItem>
                    <SelectItem value="3-5 years">3-5 years</SelectItem>
                    <SelectItem value="6-10 years">6-10 years</SelectItem>
                    <SelectItem value="10+ years">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="skills">Skills</Label>
                <Input
                  id="skills"
                  placeholder="React, Python, etc."
                  value={searchFilters.skills}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, skills: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="salary">Salary Range</Label>
                <Select 
                  value={searchFilters.salary} 
                  onValueChange={(value) => setSearchFilters(prev => ({ ...prev, salary: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-5">0-5 LPA</SelectItem>
                    <SelectItem value="5-10">5-10 LPA</SelectItem>
                    <SelectItem value="10-20">10-20 LPA</SelectItem>
                    <SelectItem value="20-50">20-50 LPA</SelectItem>
                    <SelectItem value="50+">50+ LPA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleSearch} className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700">
                <Search className="h-4 w-4 mr-2" />
                Search Candidates
              </Button>
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredCandidates.length} candidates found
          </h2>
          <Select defaultValue="relevance">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Sort by Relevance</SelectItem>
              <SelectItem value="experience">Sort by Experience</SelectItem>
              <SelectItem value="salary">Sort by Salary</SelectItem>
              <SelectItem value="rating">Sort by Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Candidate Cards */}
        <div className="space-y-6">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="border-0 shadow-lg bg-white/95 backdrop-blur-md hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-green-600 text-white text-lg font-semibold">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{candidate.name}</h3>
                          <p className="text-purple-600 font-medium">{candidate.title}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          <span className="text-sm text-gray-600">{candidate.rating}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {candidate.location}
                        </span>
                        <span className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {candidate.experience} experience
                        </span>
                        <span>Current: {candidate.currentSalary}</span>
                        <span>Expected: {candidate.expectedSalary}</span>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">{candidate.summary}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {candidate.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <a 
                          href={`mailto:${candidate.email}`}
                          className="flex items-center hover:text-purple-600 transition-colors"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          {candidate.email}
                        </a>
                        <a 
                          href={`tel:${candidate.phone}`}
                          className="flex items-center hover:text-purple-600 transition-colors"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          {candidate.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 mt-4 lg:mt-0 lg:ml-6">
                    <Button className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700">
                      Contact Candidate
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </Button>
                    <Button variant="outline">
                      View Full Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredCandidates.length === 0 && (
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
            <CardContent className="p-12 text-center">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search filters or broaden your criteria to find more candidates.
              </p>
              <Button onClick={resetFilters} variant="outline">
                Reset All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}