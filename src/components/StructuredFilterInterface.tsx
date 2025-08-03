import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search, CheckCircle } from "lucide-react";

interface StructuredFilterInterfaceProps {
  onSearch: (query: string, filters: FilterState) => void;
  isSearching?: boolean;
}

interface FilterState {
  location: string[];
  jobTitle: string[];
  experience: string[];
  industry: string[];
  skills: string[];
}

const StructuredFilterInterface = ({ onSearch, isSearching = false }: StructuredFilterInterfaceProps) => {
  const [searchQuery, setSearchQuery] = useState("Software Engineers with 5+ yrs of experience at fintech companies in the Bay Area");
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    location: ["Bay Area"],
    jobTitle: ["Software Engineers"],
    experience: ["5+ years"],
    industry: ["Fintech"],
    skills: []
  });

  const filterOptions = [
    { key: "location", label: "Location", active: true },
    { key: "jobTitle", label: "Job Title", active: true },
    { key: "experience", label: "Years of Experience", active: true },
    { key: "industry", label: "Industry", active: true },
    { key: "skills", label: "Skills", active: false }
  ];

  const handleSearch = () => {
    onSearch(searchQuery, activeFilters);
  };

  const handleFilterToggle = (filterKey: string) => {
    // This would open a detailed filter modal for that specific category
    console.log(`Opening ${filterKey} filter`);
  };

  return (
    <Card className="border border-primary/20 bg-gradient-to-br from-background to-muted/30">
      <CardContent className="p-6 space-y-4">
        {/* Header with sparkle icon */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Who are you looking for?</h3>
            <p className="text-sm text-muted-foreground">Describe your ideal candidate</p>
          </div>
          <div className="ml-auto">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
              <span className="text-orange-600 mr-1">📄</span>
              Job Description
            </Badge>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g., Software Engineers with 5+ yrs of experience at fintech companies in the Bay Area"
            className="h-14 text-base pr-28 bg-background border-2 border-border focus:border-primary rounded-xl shadow-sm"
          />
          <Button 
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
            className="absolute right-2 top-2 h-10 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg"
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>


      </CardContent>
    </Card>
  );
};

export default StructuredFilterInterface;