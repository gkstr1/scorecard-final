import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Sparkles, FileText, Filter, Zap, Users, Building2, GraduationCap, MapPin } from "lucide-react";

interface SourcingProps {
  onCandidateCreated?: () => void;
}

const Sourcing = ({ onCandidateCreated }: SourcingProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [booleanQuery, setBooleanQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const quickSearches = [
    { text: "Senior React Developer in SF", count: "342 profiles" },
    { text: "ML Engineers at Series A startups", count: "189 profiles" },
    { text: "Full Stack Engineers with 5+ years", count: "1,247 profiles" },
    { text: "DevOps Engineers at FAANG companies", count: "89 profiles" },
    { text: "Technical Leads in fintech", count: "567 profiles" }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate search
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSearching(false);
  };

  const handleQuickSearch = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Candidate Search</h1>
            <p className="text-muted-foreground">Find qualified talent using natural language</p>
          </div>
        </div>
      </div>

      {/* Main Search Interface */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-8">
          <Tabs defaultValue="prompt" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="prompt" className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>AI Prompt</span>
              </TabsTrigger>
              <TabsTrigger value="job-description" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Job Description</span>
              </TabsTrigger>
              <TabsTrigger value="boolean" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Boolean Search</span>
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Manual Filters</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prompt" className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="Describe who you're looking for... e.g., 'Senior React developers in San Francisco with 5+ years experience at high-growth B2B SaaS companies'"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="min-h-32 text-lg resize-none border-2 border-border focus:border-primary rounded-xl"
                  />
                  <div className="absolute bottom-4 right-4">
                    <Button 
                      onClick={handleSearch}
                      disabled={!searchQuery.trim() || isSearching}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      {isSearching ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Search Candidates
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Pro Tips:</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Be specific about location, skills, experience level, and company types</p>
                    <p>• Include industry experience: "fintech", "healthcare", "enterprise SaaS"</p>
                    <p>• Mention company stages: "Series A startups", "Fortune 500", "early-stage"</p>
                    <p>• Add education requirements: "Stanford CS graduates", "top engineering schools"</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="job-description" className="space-y-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste your job description here and we'll automatically extract search criteria..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-48 resize-none border-2 border-border focus:border-primary rounded-xl"
                />
                <Button 
                  onClick={() => {/* Handle JD search */}}
                  disabled={!jobDescription.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Extract Criteria & Search
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="boolean" className="space-y-6">
              <div className="space-y-4">
                <Input
                  placeholder='e.g., "Software Engineer" AND ("React" OR "Vue") AND ("San Francisco" OR "Remote")'
                  value={booleanQuery}
                  onChange={(e) => setBooleanQuery(e.target.value)}
                  className="h-14 text-lg border-2 border-border focus:border-primary rounded-xl"
                />
                <Button 
                  onClick={() => {/* Handle boolean search */}}
                  disabled={!booleanQuery.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Run Boolean Search
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Job Titles & Skills</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Input placeholder="Job titles..." className="text-sm" />
                      <Input placeholder="Required skills..." className="text-sm" />
                      <Input placeholder="Years of experience..." className="text-sm" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <Building2 className="h-4 w-4" />
                      <span>Company & Industry</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Input placeholder="Current/past companies..." className="text-sm" />
                      <Input placeholder="Industry experience..." className="text-sm" />
                      <Input placeholder="Company size/stage..." className="text-sm" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>Education</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Input placeholder="Universities..." className="text-sm" />
                      <Input placeholder="Degree level..." className="text-sm" />
                      <Input placeholder="Field of study..." className="text-sm" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Location</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Input placeholder="Current location..." className="text-sm" />
                      <Input placeholder="Open to relocate..." className="text-sm" />
                      <Input placeholder="Remote work..." className="text-sm" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                <Search className="h-4 w-4 mr-2" />
                Search with Filters
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Searches */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Searches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickSearches.map((search, index) => (
              <div
                key={index}
                onClick={() => handleQuickSearch(search.text)}
                className="group p-4 border border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-accent/20 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary">
                      {search.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{search.count}</p>
                  </div>
                  <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Results Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Ready to find your next hire?</h3>
            <p className="text-muted-foreground">
              Use AI-powered search above to discover candidates from 30+ sources
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sourcing;