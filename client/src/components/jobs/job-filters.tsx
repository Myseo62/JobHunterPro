import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SearchFilters } from "@/lib/types";

interface JobFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export default function JobFilters({ filters, onFiltersChange }: JobFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleExperienceChange = (experience: string[]) => {
    handleFilterChange("experience", experience.length > 0 ? experience[0] : undefined);
  };

  const handleCompanyTypeChange = (companyTypes: string[]) => {
    handleFilterChange("companyType", companyTypes.length > 0 ? companyTypes[0] : undefined);
  };

  const clearFilters = () => {
    const clearedFilters = {
      query: filters.query,
      location: filters.location,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <Card className="w-full lg:w-64 sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Filter Jobs</span>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Filter */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Location</Label>
          <Select value={localFilters.location || ""} onValueChange={(value) => handleFilterChange("location", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Locations</SelectItem>
              <SelectItem value="Bangalore">Bangalore</SelectItem>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Chennai">Chennai</SelectItem>
              <SelectItem value="Hyderabad">Hyderabad</SelectItem>
              <SelectItem value="Pune">Pune</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Experience Filter */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Experience</Label>
          <div className="space-y-2">
            {["0-1 years", "2-4 years", "5-7 years", "8+ years"].map((exp) => (
              <div key={exp} className="flex items-center space-x-2">
                <Checkbox
                  id={exp}
                  checked={localFilters.experience === exp}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleExperienceChange([exp]);
                    } else {
                      handleExperienceChange([]);
                    }
                  }}
                />
                <Label htmlFor={exp} className="text-sm text-gray-600">
                  {exp}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Salary Filter */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Salary</Label>
          <Select 
            value={localFilters.salaryMin ? `${localFilters.salaryMin}-${localFilters.salaryMax}` : ""} 
            onValueChange={(value) => {
              if (value === "") {
                handleFilterChange("salaryMin", undefined);
                handleFilterChange("salaryMax", undefined);
              } else {
                const [min, max] = value.split("-").map(Number);
                handleFilterChange("salaryMin", min);
                handleFilterChange("salaryMax", max);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Salary" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Salary</SelectItem>
              <SelectItem value="300000-600000">3-6 Lakhs</SelectItem>
              <SelectItem value="600000-1000000">6-10 Lakhs</SelectItem>
              <SelectItem value="1000000-1500000">10-15 Lakhs</SelectItem>
              <SelectItem value="1500000-9999999">15+ Lakhs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Company Type Filter */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Company Type</Label>
          <div className="space-y-2">
            {["MNC", "Startup", "Product Company", "Service Company"].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={localFilters.companyType === type}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleCompanyTypeChange([type]);
                    } else {
                      handleCompanyTypeChange([]);
                    }
                  }}
                />
                <Label htmlFor={type} className="text-sm text-gray-600">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
