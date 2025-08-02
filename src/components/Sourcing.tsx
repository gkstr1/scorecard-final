import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Linkedin, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SourcingProps {
  onCandidateCreated?: () => void;
}

const Sourcing = ({ onCandidateCreated }: SourcingProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const recentSearches = [
    "Senior React Developer",
    "Full Stack Engineer", 
    "DevOps Engineer",
    "Technical Lead"
  ];

  return (
    <div className="space-y-8">
      {/* Minimalistic Search */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Linkedin className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">LinkedIn Sourcing</h2>
          <p className="text-muted-foreground">Search and source candidates from LinkedIn</p>
        </div>

        <div className="space-y-6">
          {/* Main Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for candidates by skills, title, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-32 h-14 text-lg border-2 border-border focus:border-primary rounded-xl shadow-sm"
            />
            <Button 
              className="absolute right-2 top-2 h-10 px-6 bg-blue-600 hover:bg-blue-700"
              disabled={!searchQuery.trim()}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Recent Searches</h4>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent/80 px-3 py-1"
                    onClick={() => setSearchQuery(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LinkedIn Integration Status */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Linkedin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">LinkedIn Integration</h3>
                <p className="text-sm text-muted-foreground">Connect your LinkedIn account to start sourcing</p>
              </div>
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4" />
              <span>Connect LinkedIn</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results Placeholder */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No searches yet</h3>
            <p className="text-muted-foreground">
              Enter a search query above to find candidates on LinkedIn
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sourcing;