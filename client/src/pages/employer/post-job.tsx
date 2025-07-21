import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Briefcase, MapPin, IndianRupee, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface PostJobProps {
  user: any;
}

export default function PostJob({ user }: PostJobProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    companyId: 1, // Default company
    location: "",
    experience: "",
    salaryMin: "",
    salaryMax: "",
    jobType: "Full-time",
    skills: [] as string[],
    requirements: [] as string[],
    benefits: [] as string[],
  });

  const [newSkill, setNewSkill] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  const postJobMutation = useMutation({
    mutationFn: async (jobData: any) => {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
      if (!response.ok) throw new Error("Failed to post job");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Job posted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      setLocation("/jobs");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post job",
        variant: "destructive",
      });
    },
  });

  const addItem = (type: 'skills' | 'requirements' | 'benefits', value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], value.trim()]
      }));
      setter("");
    }
  };

  const removeItem = (type: 'skills' | 'requirements' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to post a job",
        variant: "destructive",
      });
      return;
    }

    postJobMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post a Job</h1>
          <p className="text-xl text-gray-600">
            Find the perfect candidates for your open positions
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Basic Information */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-gray-900">
                  <Briefcase className="h-6 w-6 mr-2" />
                  Job Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Senior Software Engineer"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                    rows={6}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Bangalore, Mumbai"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="experience">Experience Required</Label>
                    <Select 
                      value={formData.experience} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1 years">0-1 years</SelectItem>
                        <SelectItem value="1-3 years">1-3 years</SelectItem>
                        <SelectItem value="3-6 years">3-6 years</SelectItem>
                        <SelectItem value="6-10 years">6-10 years</SelectItem>
                        <SelectItem value="10+ years">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="salaryMin">Minimum Salary (₹)</Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
                      placeholder="e.g. 800000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="salaryMax">Maximum Salary (₹)</Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
                      placeholder="e.g. 1500000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="jobType">Job Type</Label>
                    <Select 
                      value={formData.jobType} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, jobType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill (e.g. React, Node.js)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('skills', newSkill, setNewSkill))}
                    />
                    <Button 
                      type="button" 
                      onClick={() => addItem('skills', newSkill, setNewSkill)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{skill}</span>
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeItem('skills', index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Add a requirement (e.g. Bachelor's degree in Computer Science)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('requirements', newRequirement, setNewRequirement))}
                    />
                    <Button 
                      type="button" 
                      onClick={() => addItem('requirements', newRequirement, setNewRequirement)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex items-start justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-700">{req}</span>
                        <X 
                          className="h-4 w-4 cursor-pointer text-gray-400 hover:text-red-500" 
                          onClick={() => removeItem('requirements', index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      placeholder="Add a benefit (e.g. Health insurance, Flexible hours)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('benefits', newBenefit, setNewBenefit))}
                    />
                    <Button 
                      type="button" 
                      onClick={() => addItem('benefits', newBenefit, setNewBenefit)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start justify-between bg-green-50 p-3 rounded-lg">
                        <span className="text-gray-700">{benefit}</span>
                        <X 
                          className="h-4 w-4 cursor-pointer text-gray-400 hover:text-red-500" 
                          onClick={() => removeItem('benefits', index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/jobs")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={postJobMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
              >
                {postJobMutation.isPending ? "Posting..." : "Post Job"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}