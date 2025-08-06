import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Sparkles, FileText, Filter, Zap, Users, Building2, GraduationCap, MapPin, Mail, Phone, ExternalLink, Star, CheckCircle, Eye, Lock } from "lucide-react";
import { FilterModal } from "@/components/FilterModal";
import ContactModal from "@/components/ContactModal";
import JobDescriptionUpload from "@/components/JobDescriptionUpload";
import StructuredFilterInterface from "@/components/StructuredFilterInterface";
import SourcingCandidateModal from "@/components/SourcingCandidateModal";
import JobSelectionModal from "@/components/JobSelectionModal";
interface Candidate {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  skills: string[];
  education: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  matchScore: number;
  openToWork: boolean;
  avatar?: string;
}
interface ContactInfo {
  name: string;
  email?: string;
  phone?: string;
}

interface SourcingProps {
  onCandidateCreated?: () => void;
  onRevealContact?: (contactInfo: ContactInfo) => Promise<boolean>;
  userCredits?: { credits_balance: number } | null;
}
const Sourcing = ({
  onCandidateCreated,
  onRevealContact,
  userCredits
}: SourcingProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [booleanQuery, setBooleanQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Candidate[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [detectedFilters, setDetectedFilters] = useState<{
    experience: string[];
    location: string[];
    skills: string[];
    industry: string[];
    company: string[];
  }>({
    experience: [],
    location: [],
    skills: [],
    industry: [],
    company: []
  });
  const [revealedContacts, setRevealedContacts] = useState<Set<string>>(new Set());
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Mock candidate data
  const mockCandidates: Candidate[] = [{
    id: "1",
    name: "Sarah Chen",
    title: "Senior React Developer",
    company: "Stripe",
    location: "San Francisco, CA",
    experience: "6 years",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
    education: "Stanford University - BS Computer Science",
    email: "sarah.chen@email.com",
    phone: "(415) 555-0123",
    matchScore: 95,
    openToWork: true,
    avatar: "/placeholder.svg"
  }, {
    id: "2",
    name: "Marcus Johnson",
    title: "Full Stack Engineer",
    company: "Airbnb",
    location: "San Francisco, CA",
    experience: "5 years",
    skills: ["React", "Python", "Django", "PostgreSQL", "Docker"],
    education: "UC Berkeley - BS Electrical Engineering",
    email: "marcus.j@email.com",
    phone: "(415) 555-0456",
    matchScore: 92,
    openToWork: false,
    avatar: "/placeholder.svg"
  }, {
    id: "3",
    name: "Emily Rodriguez",
    title: "Frontend Developer",
    company: "Figma",
    location: "San Francisco, CA",
    experience: "4 years",
    skills: ["React", "Vue.js", "CSS", "JavaScript", "Figma"],
    education: "Carnegie Mellon - BS Computer Science",
    email: "emily.r@email.com",
    phone: "(415) 555-0789",
    matchScore: 88,
    openToWork: true,
    avatar: "/placeholder.svg"
  }, {
    id: "4",
    name: "David Kim",
    title: "Senior Software Engineer",
    company: "Google",
    location: "Mountain View, CA",
    experience: "7 years",
    skills: ["React", "Go", "Kubernetes", "GCP", "Microservices"],
    education: "MIT - MS Computer Science",
    phone: "(650) 555-0234",
    matchScore: 94,
    openToWork: false,
    avatar: "/placeholder.svg"
  }, {
    id: "5",
    name: "Alexandra Turner",
    title: "React Developer",
    company: "Notion",
    location: "San Francisco, CA",
    experience: "3 years",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    education: "Harvard University - BS Computer Science",
    email: "alex.turner@email.com",
    phone: "(415) 555-0567",
    matchScore: 89,
    openToWork: true,
    avatar: "/placeholder.svg"
  }, {
    id: "6",
    name: "James Wilson",
    title: "Senior Frontend Engineer",
    company: "Shopify",
    location: "Remote (US)",
    experience: "8 years",
    skills: ["React", "Redux", "JavaScript", "PHP", "MySQL"],
    education: "University of Washington - BS Computer Science",
    phone: "(206) 555-0890",
    matchScore: 91,
    openToWork: false,
    avatar: "/placeholder.svg"
  }];

  // Detect filters from natural language input
  const detectFiltersFromQuery = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const filters = {
      experience: [] as string[],
      location: [] as string[],
      skills: [] as string[],
      industry: [] as string[],
      company: [] as string[]
    };

    // Experience patterns
    const expPatterns = [{
      pattern: /(\d+)\s*\+?\s*years?/g,
      extract: (match: string) => match
    }, {
      pattern: /(one|two|three|four|five|six|seven|eight|nine|ten)\s*years?/g,
      extract: (match: string) => match
    }];
    expPatterns.forEach(({
      pattern,
      extract
    }) => {
      const matches = lowerQuery.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const exp = extract(match);
          if (!filters.experience.includes(exp)) {
            filters.experience.push(exp);
          }
        });
      }
    });

    // Location patterns
    const locationPatterns = ["san francisco", "sf", "new york", "nyc", "los angeles", "la", "seattle", "austin", "boston", "chicago", "remote", "california", "bay area", "silicon valley"];
    locationPatterns.forEach(loc => {
      if (lowerQuery.includes(loc)) {
        const displayLoc = loc === "sf" ? "San Francisco" : loc === "nyc" ? "New York" : loc === "la" ? "Los Angeles" : loc.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        if (!filters.location.includes(displayLoc)) {
          filters.location.push(displayLoc);
        }
      }
    });

    // Skills patterns
    const skillPatterns = ["react", "javascript", "typescript", "python", "java", "node.js", "vue", "angular", "aws", "kubernetes", "docker", "graphql", "mongodb", "postgresql"];
    skillPatterns.forEach(skill => {
      if (lowerQuery.includes(skill)) {
        const displaySkill = skill === "node.js" ? "Node.js" : skill.charAt(0).toUpperCase() + skill.slice(1);
        if (!filters.skills.includes(displaySkill)) {
          filters.skills.push(displaySkill);
        }
      }
    });

    // Industry patterns
    const industryPatterns = ["fintech", "healthcare", "saas", "b2b", "enterprise", "startup", "e-commerce", "gaming", "edtech", "blockchain", "ai", "machine learning", "financial", "finance", "banking", "insurance", "technology", "consulting", "retail", "manufacturing", "media", "advertising", "biotech", "pharma", "pharmaceutical", "telecommunications", "telecom"];
    industryPatterns.forEach(industry => {
      if (lowerQuery.includes(industry)) {
        const displayIndustry = industry === "b2b" ? "B2B" : industry === "saas" ? "SaaS" : industry === "ai" ? "AI" : industry.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        if (!filters.industry.includes(displayIndustry)) {
          filters.industry.push(displayIndustry);
        }
      }
    });

    // Company patterns
    const companyPatterns = ["google", "apple", "microsoft", "amazon", "meta", "netflix", "stripe", "airbnb", "uber", "series a", "fortune 500", "faang", "startup"];
    companyPatterns.forEach(company => {
      if (lowerQuery.includes(company)) {
        const displayCompany = company === "faang" ? "FAANG" : company === "series a" ? "Series A" : company.charAt(0).toUpperCase() + company.slice(1);
        if (!filters.company.includes(displayCompany)) {
          filters.company.push(displayCompany);
        }
      }
    });
    setDetectedFilters(filters);
  };
  const handleQueryChange = (value: string) => {
    setSearchQuery(value);
    detectFiltersFromQuery(value);
  };
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setHasSearched(false);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Set mock results based on search query
    const results = mockCandidates.filter(candidate => searchQuery.toLowerCase().includes('react') ? true : Math.random() > 0.3);
    setSearchResults(results);
    setHasSearched(true);
    setIsSearching(false);
  };
  const handleQuickSearch = (text: string) => {
    setSearchQuery(text);
    detectFiltersFromQuery(text);
  };

  const handleRevealContact = async (candidate: Candidate) => {
    if (!onRevealContact) return false;

    const success = await onRevealContact({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone
    });
    
    if (success) {
      setRevealedContacts(prev => new Set([...prev, candidate.id]));
    }
    
    return success;
  };
  return <div className="max-w-6xl mx-auto space-y-4">
      {/* Hero Section */}
      <div className="text-center space-y-3 mb-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Candidate Search</h1>
            <p className="text-sm text-muted-foreground">Find qualified talent using natural language</p>
          </div>
        </div>
      </div>

      {/* Structured Filter Interface */}
      <StructuredFilterInterface onSearch={(query, filters) => {
      setSearchQuery(query);
      handleSearch();
    }} isSearching={isSearching} />

      {/* Main Search Interface */}
      <Card className="border border-primary/20 shadow-sm">
        <CardContent className="p-6">
          <Tabs defaultValue="prompt" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="prompt" className="flex items-center space-x-1 text-xs">
                <Sparkles className="h-3 w-3" />
                <span>AI Prompt</span>
              </TabsTrigger>
              <TabsTrigger value="job-description" className="flex items-center space-x-1 text-xs">
                <FileText className="h-3 w-3" />
                <span>Job Description</span>
              </TabsTrigger>
              <TabsTrigger value="boolean" className="flex items-center space-x-1 text-xs">
                <Filter className="h-3 w-3" />
                <span>Boolean</span>
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center space-x-1 text-xs">
                <Zap className="h-3 w-3" />
                <span>Filters</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prompt" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Textarea placeholder="e.g., 'Senior React developers in San Francisco with 5+ years experience at high-growth B2B SaaS companies'" value={searchQuery} onChange={e => handleQueryChange(e.target.value)} className="min-h-24 max-h-32 w-full text-sm resize-none border border-border focus:border-primary rounded-lg" />
                  <div className="flex justify-end">
                    <Button onClick={handleSearch} disabled={!searchQuery.trim() || isSearching} size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                      {isSearching ? <>
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />
                          Searching...
                        </> : <>
                          <Search className="h-3 w-3 mr-1" />
                          Search
                        </>}
                    </Button>
                  </div>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap gap-2">
                {(() => {
                  const searchLower = searchQuery.toLowerCase();
                  
                  // Check for experience level patterns (should NOT highlight experience filter if it's job requirements)
                  const isJobRequirement = /\b\d+\s*[+-]?\s*years?\s+(of\s+)?(experience|exp)\b/i.test(searchQuery) || 
                                          /\brequires?\s+\d+\s*years?\b/i.test(searchQuery) ||
                                          /\bminimum\s+\d+\s*years?\b/i.test(searchQuery);
                  
                  return [{
                    key: "location",
                    label: "Location",
                    active: detectedFilters.location.length > 0 || /\b(in|from|located|based)\s+(san francisco|sf|new york|nyc|los angeles|la|seattle|austin|boston|chicago|remote|california|bay area|silicon valley)\b/i.test(searchQuery)
                  }, {
                    key: "jobTitle",
                    label: "Job Title",
                    active: /\b(senior|junior|lead|principal|staff|entry|mid[-\s]level)/i.test(searchQuery) || (isJobRequirement && /\b(developer|engineer|manager|architect|director|analyst|designer|specialist|coordinator|administrator|researcher|scientist|officer)\b/i.test(searchQuery))
                  }, {
                    key: "experience",
                    label: "Years of Experience",
                    active: detectedFilters.experience.length > 0
                  }, {
                    key: "industry",
                    label: "Industry",
                    active: detectedFilters.industry.length > 0 || /\b(fintech|healthcare|saas|b2b|enterprise|startup|e-commerce|gaming|edtech|blockchain|ai|financial|finance|banking|insurance|technology|consulting|retail|manufacturing|media|advertising|biotech|pharma|pharmaceutical|telecommunications|telecom)(\s+(industry|sector|company|companies|background|experience))?\b/i.test(searchQuery)
                  }, {
                    key: "skills",
                    label: "Skills",
                    active: detectedFilters.skills.length > 0 || /\b(react|javascript|typescript|python|java|node\.js|vue|angular|aws|kubernetes|docker|graphql|mongodb|postgresql|css|html|git)(\s+(developer|engineer|experience|skills?))?\b/i.test(searchQuery)
                  }];
                 })().map(filter => <Button key={filter.key} variant="outline" size="sm" onClick={() => console.log(`Opening ${filter.key} filter`)} className={`h-9 rounded-full border-2 transition-all duration-200 ${filter.active ? "bg-primary/10 border-primary text-primary hover:bg-primary/20" : "border-border hover:border-primary/50"}`}>
                      {filter.active && <CheckCircle className="h-3 w-3 mr-1" />}
                      {filter.label}
                    </Button>)}
                </div>

                <div className="bg-muted/40 rounded-lg p-3 border border-border/50">
                  <h4 className="font-medium text-foreground mb-2 text-sm flex items-center">
                    <Sparkles className="h-3 w-3 mr-1 text-primary" />
                    Pro Tips:
                  </h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Be specific about location, skills, experience level, and job title</p>
                    <p>• Include industry experience: "fintech", "healthcare", "enterprise SaaS"</p>
                    <p>• Mention company stages: "Series A startups", "Fortune 500"</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="job-description" className="space-y-3">
              <div className="space-y-3">
                <JobDescriptionUpload onContentExtracted={content => setJobDescription(content)} />
                
                <Textarea placeholder="Paste your job description here or upload a file above..." value={jobDescription} onChange={e => setJobDescription(e.target.value)} className="min-h-24 max-h-32 resize-none border border-border focus:border-primary rounded-lg text-sm" />
                <Button onClick={() => {/* Handle JD search */}} disabled={!jobDescription.trim()} size="sm" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  <FileText className="h-3 w-3 mr-1" />
                  Extract & Search
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="boolean" className="space-y-3">
              <div className="space-y-3">
                <Input placeholder='e.g., "Software Engineer" AND ("React" OR "Vue")' value={booleanQuery} onChange={e => setBooleanQuery(e.target.value)} className="h-10 text-sm border border-border focus:border-primary rounded-lg" />
                <Button onClick={() => {/* Handle boolean search */}} disabled={!booleanQuery.trim()} size="sm" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  <Filter className="h-3 w-3 mr-1" />
                  Run Search
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-base font-medium text-foreground mb-2">Advanced Filters</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use detailed filters to find exactly what you're looking for
                </p>
                
                <FilterModal>
                  <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    <Filter className="h-4 w-4 mr-2" />
                    Open Filter Builder
                  </Button>
                </FilterModal>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>


      {/* Search Results */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-base">
            <span>Search Results</span>
            <div className="flex items-center space-x-2">
              {hasSearched && <>
                  <Badge variant="secondary" className="text-xs">
                    {searchResults.length} candidates found
                  </Badge>
                  <FilterModal currentFilters={detectedFilters} onFiltersApply={newFilters => {
                setDetectedFilters(newFilters);
                // Optionally trigger a new search with updated filters
                handleSearch();
              }}>
                    <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2 h-11 text-sm font-semibold border-0">
                      <Filter className="h-4 w-4 mr-2" />
                      Edit Filters
                    </Button>
                  </FilterModal>
                </>}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {!hasSearched ? <div className="text-center py-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-base font-medium text-foreground mb-1">Ready to find your next hire?</h3>
              <p className="text-sm text-muted-foreground">
                Use AI-powered search above to discover candidates
              </p>
            </div> : <div className="space-y-3">
              {searchResults.map(candidate => <Card key={candidate.id} className="border border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-base font-semibold text-foreground">{candidate.name}</h3>
                            <p className="text-sm text-muted-foreground">{candidate.title} at {candidate.company}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{candidate.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span>{candidate.experience} exp</span>
                          </div>
                          <div className="flex items-center space-x-1 col-span-2">
                            <GraduationCap className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate">{candidate.education}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="text-xs font-medium text-foreground">Skills:</h4>
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 4).map((skill, index) => <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                                {skill}
                              </Badge>)}
                            {candidate.skills.length > 4 && <Badge variant="outline" className="text-xs px-2 py-0">
                                +{candidate.skills.length - 4} more
                              </Badge>}
                          </div>
                        </div>
                        
                        {/* Contact Information Section */}
                        {revealedContacts.has(candidate.id) ? (
                          <div className="space-y-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="text-xs font-medium text-green-800">Contact Information:</h4>
                            <div className="space-y-1 text-xs">
                              {candidate.email && (
                                <div className="flex items-center space-x-1 text-green-700">
                                  <Mail className="h-3 w-3" />
                                  <span>{candidate.email}</span>
                                </div>
                              )}
                              {candidate.phone && (
                                <div className="flex items-center space-x-1 text-green-700">
                                  <Phone className="h-3 w-3" />
                                  <span>{candidate.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-muted/30 border border-border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Lock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Contact info requires 1 credit</span>
                              </div>
                              <Button 
                                size="sm" 
                                onClick={() => handleRevealContact(candidate)}
                                disabled={!userCredits || userCredits.credits_balance < 1}
                                className="h-7 text-xs bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Reveal (1 credit)
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 pt-1">
                          {revealedContacts.has(candidate.id) && (
                            <ContactModal candidate={candidate}>
                              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 h-7 text-xs">
                                <Mail className="h-3 w-3 mr-1" />
                                Contact
                              </Button>
                            </ContactModal>
                          )}
                          <SourcingCandidateModal candidate={candidate}>
                            <Button size="sm" variant="outline" className="h-7 text-xs">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </SourcingCandidateModal>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 text-xs"
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setJobModalOpen(true);
                            }}
                          >
                            <Users className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>}
        </CardContent>
      </Card>

      {/* Job Selection Modal */}
      {selectedCandidate && (
        <JobSelectionModal
          isOpen={jobModalOpen}
          onClose={() => {
            setJobModalOpen(false);
            setSelectedCandidate(null);
          }}
          candidate={selectedCandidate}
          onCandidateAdded={() => {
            onCandidateCreated?.();
          }}
        />
      )}
    </div>;
};
export default Sourcing;