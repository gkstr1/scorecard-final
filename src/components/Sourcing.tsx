import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Linkedin, Users, Database, Plus, ExternalLink, Filter, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SourcingProps {
  onCandidateCreated?: () => void;
}

const Sourcing = ({ onCandidateCreated }: SourcingProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");

  const sourcingChannels = [
    {
      id: "linkedin",
      name: "LinkedIn Search",
      icon: Linkedin,
      description: "Search and import candidates from LinkedIn",
      status: "coming_soon",
      color: "bg-blue-500"
    },
    {
      id: "github",
      name: "GitHub Profiles",
      icon: Database,
      description: "Find developers through GitHub profiles",
      status: "coming_soon",
      color: "bg-gray-700"
    },
    {
      id: "referrals",
      name: "Employee Referrals",
      icon: Users,
      description: "Manage and track employee referrals",
      status: "planned",
      color: "bg-green-500"
    },
    {
      id: "job_boards",
      name: "Job Boards",
      icon: Target,
      description: "Aggregate candidates from multiple job boards",
      status: "planned",
      color: "bg-purple-500"
    }
  ];

  const recentSearches = [
    "Senior React Developer",
    "Full Stack Engineer",
    "DevOps Engineer",
    "Technical Lead"
  ];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Candidate Sourcing Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for candidates by skills, title, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="github">GitHub</SelectItem>
                <SelectItem value="referrals">Referrals</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-primary hover:bg-primary/90">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Recent Searches */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Recent Searches</h4>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-accent/80"
                  onClick={() => setSearchQuery(search)}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sourcing Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sourcingChannels.map((channel) => (
          <Card key={channel.id} className="relative group hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`w-10 h-10 ${channel.color} rounded-lg flex items-center justify-center`}>
                  <channel.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span>{channel.name}</span>
                    <Badge 
                      variant={channel.status === "coming_soon" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {channel.status === "coming_soon" ? "Coming Soon" : "Planned"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-normal">
                    {channel.description}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                disabled={channel.status !== "active"}
              >
                {channel.status === "coming_soon" ? (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Set Up Integration
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Configure
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Saved Searches</div>
                <div className="text-sm text-muted-foreground">Manage your saved candidate searches</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Boolean Search Builder</div>
                <div className="text-sm text-muted-foreground">Build complex search queries</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Candidate Pool</div>
                <div className="text-sm text-muted-foreground">Browse your talent pool</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">Total Sourced</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">This Week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">73%</div>
            <p className="text-xs text-muted-foreground">Response Rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active Sources</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sourcing;