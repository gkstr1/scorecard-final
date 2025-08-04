import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GraduationCap, MapPin, Zap, Building2, Filter } from "lucide-react";

interface FilterModalProps {
  children: React.ReactNode;
  currentFilters?: {
    experience: string[];
    location: string[];
    skills: string[];
    industry: string[];
    company: string[];
  };
  onFiltersApply?: (filters: any) => void;
}

export const FilterModal = ({ children, currentFilters, onFiltersApply }: FilterModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    experience: currentFilters?.experience || [],
    location: currentFilters?.location || [],
    skills: currentFilters?.skills || [],
    industry: currentFilters?.industry || [],
    companyStage: currentFilters?.company || [],
    education: [] as string[]
  });

  const handleFilterChange = (category: keyof typeof filters, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      experience: [],
      location: [],
      skills: [],
      industry: [],
      companyStage: [],
      education: []
    });
  };

  const applyFilters = () => {
    if (onFiltersApply) {
      onFiltersApply({
        experience: filters.experience,
        location: filters.location,
        skills: filters.skills,
        industry: filters.industry,
        company: filters.companyStage
      });
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Advanced Filters</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {/* Experience Filter */}
          <Card className="p-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                Experience Level
              </h4>
              <div className="space-y-2">
                {["0-2 years", "3-5 years", "5-7 years", "7-10 years", "10+ years"].map((exp) => (
                  <label key={exp} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded text-primary"
                      checked={filters.experience.includes(exp)}
                      onChange={(e) => handleFilterChange('experience', exp, e.target.checked)}
                    />
                    <span className="text-sm">{exp}</span>
                  </label>
                ))}
              </div>
            </div>
          </Card>

          {/* Location Filter */}
          <Card className="p-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                Location
              </h4>
              <div className="space-y-2">
                <Input placeholder="Enter city or state..." className="text-sm" />
                <div className="space-y-2">
                  {["San Francisco, CA", "New York, NY", "Remote", "Austin, TX", "Seattle, WA"].map((loc) => (
                    <label key={loc} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded text-primary"
                        checked={filters.location.includes(loc)}
                        onChange={(e) => handleFilterChange('location', loc, e.target.checked)}
                      />
                      <span className="text-sm">{loc}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Skills Filter */}
          <Card className="p-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center">
                <Zap className="h-4 w-4 mr-2 text-primary" />
                Skills & Technologies
              </h4>
              <div className="space-y-2">
                <Input placeholder="Add skills..." className="text-sm" />
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "GraphQL", "PostgreSQL"].map((skill) => (
                    <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded text-primary"
                        checked={filters.skills.includes(skill)}
                        onChange={(e) => handleFilterChange('skills', skill, e.target.checked)}
                      />
                      <span className="text-sm">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Industry Filter */}
          <Card className="p-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center">
                <Building2 className="h-4 w-4 mr-2 text-primary" />
                Industry
              </h4>
              <div className="space-y-2">
                {["Technology", "Fintech", "Healthcare", "E-commerce", "SaaS", "Enterprise", "Startup"].map((industry) => (
                  <label key={industry} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded text-primary"
                      checked={filters.industry.includes(industry)}
                      onChange={(e) => handleFilterChange('industry', industry, e.target.checked)}
                    />
                    <span className="text-sm">{industry}</span>
                  </label>
                ))}
              </div>
            </div>
          </Card>

          {/* Company Stage Filter */}
          <Card className="p-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center">
                <Building2 className="h-4 w-4 mr-2 text-primary" />
                Company Stage
              </h4>
              <div className="space-y-2">
                {["Early Startup", "Series A", "Series B+", "Fortune 500", "Public Company"].map((stage) => (
                  <label key={stage} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded text-primary"
                      checked={filters.companyStage.includes(stage)}
                      onChange={(e) => handleFilterChange('companyStage', stage, e.target.checked)}
                    />
                    <span className="text-sm">{stage}</span>
                  </label>
                ))}
              </div>
            </div>
          </Card>

          {/* Education Filter */}
          <Card className="p-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                Education
              </h4>
              <div className="space-y-2">
                <Input placeholder="University or degree..." className="text-sm" />
                <div className="space-y-2">
                  {["Bachelor's Degree", "Master's Degree", "PhD", "Bootcamp", "Self-taught"].map((edu) => (
                    <label key={edu} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded text-primary"
                        checked={filters.education.includes(edu)}
                        onChange={(e) => handleFilterChange('education', edu, e.target.checked)}
                      />
                      <span className="text-sm">{edu}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            Clear All Filters
          </Button>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              Save Filter Set
            </Button>
            <Button 
              size="sm"
              onClick={applyFilters}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Apply Filters & Search
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};