import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Calendar, FileText, Plus, Search, Zap, Brain, BarChart3, Settings, ChevronDown, ArrowLeft, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CandidateCard from "@/components/CandidateCard";
import InterviewQueue from "@/components/InterviewQueue";
import InterviewCalendar from "@/components/InterviewCalendar";
import StatsOverview from "@/components/StatsOverview";
import KanbanBoard from "@/components/KanbanBoard";
import JobCreator from "@/components/JobCreator";
import PipelineSettings from "@/components/PipelineSettings";
import ResumeUpload from "@/components/ResumeUpload";
import EmptyStateGuide from "@/components/EmptyStateGuide";
import AddCandidateForm from "@/components/AddCandidateForm";

const Index = () => {
  const [activeTab, setActiveTab] = useState("candidates");
  const [selectedRole, setSelectedRole] = useState("all");
  const [hasJobs, setHasJobs] = useState(false);
  const [hasCandidates, setHasCandidates] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableRoles, setAvailableRoles] = useState([{ value: "all", label: "All Roles" }]);

  useEffect(() => {
    checkDataExists();
    fetchAvailableRoles();
  }, []);

  const fetchAvailableRoles = async () => {
    try {
      const { data: jobsData } = await supabase
        .from("job_descriptions")
        .select("title")
        .eq("is_active", true);

      if (jobsData && jobsData.length > 0) {
        const roles = [
          { value: "all", label: "All Roles" },
          ...jobsData.map(job => ({
            value: job.title.toLowerCase().replace(/\s+/g, '_'),
            label: job.title
          }))
        ];
        setAvailableRoles(roles);
      }
    } catch (error) {
      console.error("Error fetching available roles:", error);
    }
  };

  const checkDataExists = async () => {
    setIsLoading(true);
    try {
      // Check for jobs
      const { data: jobsData } = await supabase
        .from("job_descriptions")
        .select("id")
        .limit(1);
      
      // Check for candidates
      const { data: candidatesData } = await supabase
        .from("candidates")
        .select("id")
        .limit(1);

      const jobsExist = (jobsData && jobsData.length > 0) || false;
      const candidatesExist = (candidatesData && candidatesData.length > 0) || false;
      
      setHasJobs(jobsExist);
      setHasCandidates(candidatesExist);
      
      console.log("Data check - Jobs:", jobsExist, "Candidates:", candidatesExist);
    } catch (error) {
      console.error("Error checking data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobCreated = () => {
    console.log("Job created, refreshing data...");
    // Force refresh the data state
    checkDataExists();
    fetchAvailableRoles();
  };

  const handleCandidateCreated = () => {
    console.log("Candidate created, refreshing data...");
    // Force refresh the data state
    checkDataExists();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  console.log("Render state - hasJobs:", hasJobs, "hasCandidates:", hasCandidates, "activeTab:", activeTab);

  return <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-full px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Scorecard</h1>
                  <p className="text-sm text-muted-foreground">Smart Hiring Platform</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs bg-accent/20 text-accent border-accent/30 px-2 py-1">
                AI Powered
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search" className="pl-10 w-64 bg-input border-border h-9 text-sm" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-full px-6">
          <div className="flex space-x-0">
            {[{
            id: "candidates",
            label: "Candidate Pipeline",
            icon: Users
          }, {
            id: "jobs",
            label: "Job Management",
            icon: FileText
          }, {
            id: "interviews",
            label: "Interview Center",
            icon: Calendar
          }, {
            id: "parsing",
            label: "Resume Upload",
            icon: Mail
          }, {
            id: "analytics",
            label: "Reports",
            icon: BarChart3
          }, {
            id: "settings",
            label: "Settings",
            icon: Settings
          }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`
                  flex items-center space-x-2 px-4 py-3 text-sm border-r border-border transition-colors
                  ${activeTab === tab.id ? "bg-background text-primary border-b-2 border-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}
                `}>
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
              </button>)}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-full px-6 py-6">
        {/* Show dashboard overview when no jobs exist */}
        {!hasJobs && activeTab === "candidates" && (
          <EmptyStateGuide 
            type="dashboard" 
            onCreateJob={() => setActiveTab("jobs")}
          />
        )}

        {/* Show candidates management when jobs exist */}
        {hasJobs && activeTab === "candidates" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  Candidate Pipeline
                </h2>
                <p className="text-sm text-muted-foreground">
                  Manage your hiring process from application to offer
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  Active Candidates
                </Badge>
                <Button variant="outline" size="sm" className="text-sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Import from Email
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-primary/10 border-2 border-primary/30 rounded-lg p-2 w-fit">
              <span className="text-sm font-medium text-primary">Role:</span>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-56 h-10 text-sm bg-background border-primary/50 hover:border-primary focus:border-primary shadow-sm">
                  <SelectValue placeholder="Select role to filter" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border shadow-lg">
                  {availableRoles.map(role => <SelectItem key={role.value} value={role.value} className="hover:bg-primary/10">
                      {role.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <StatsOverview />
            
            <KanbanBoard selectedRole={selectedRole} />
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="space-y-6">
            {!hasJobs ? (
              <EmptyStateGuide 
                type="jobs"
                onCreateJob={handleJobCreated}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                      Job Management
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your job postings and client relationships
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      Active Jobs
                    </Badge>
                    <Button className="bg-primary hover:bg-primary/90" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Job
                    </Button>
                  </div>
                </div>

                {/* Job listings and management interface */}
                <div className="grid grid-cols-1 gap-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center justify-between">
                        <span>Active Job Postings</span>
                        <Badge variant="secondary" className="text-xs">
                          {/* This would show actual count */}
                          Active
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">Recent Job Postings</h3>
                              <p className="text-sm text-muted-foreground">
                                View and manage your active job listings
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Manage
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">Client Relationships</h3>
                              <p className="text-sm text-muted-foreground">
                                Manage your client companies and contacts
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Users className="h-4 w-4 mr-2" />
                            View Clients
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-foreground text-lg">
                          Quick Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Create New Job Posting
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <Building2 className="h-4 w-4 mr-2" />
                          Add New Client
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Job Templates
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-foreground text-lg">
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="text-muted-foreground">Job posting created</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                            <span className="text-muted-foreground">Client added</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                            <span className="text-muted-foreground">Pipeline configured</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "interviews" && (
          <div className="space-y-6">
            {!hasJobs || !hasCandidates ? (
              <Card className="w-full">
                <CardContent className="p-8">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      Interview Center
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {!hasJobs ? "Create jobs first to start scheduling interviews" : "Add candidates to your jobs to begin the interview process"}
                    </p>
                    <Button 
                      onClick={() => setActiveTab(!hasJobs ? "jobs" : "candidates")}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {!hasJobs ? "Create Jobs" : "Add Candidates"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                      Interview Center
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Schedule interviews and generate smart questions
                    </p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90" size="sm">
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Questions
                  </Button>
                </div>
                
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <InterviewCalendar />
                </div>
                
                <div className="space-y-6">
                  <InterviewQueue />
                  
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center space-x-2 text-lg">
                        <Brain className="h-5 w-5 text-primary" />
                        <span>Smart Interview Questions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-muted/30 border border-border rounded-lg p-4">
                          <div className="text-accent text-sm mb-3 font-medium">
                            Generated from candidate resume and job requirements
                          </div>
                          <div className="text-foreground space-y-3">
                            <div className="flex items-start space-x-2">
                              <span className="text-primary font-bold text-sm">1.</span>
                              <span className="text-sm">Explain React hooks and their lifecycle management</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <span className="text-primary font-bold text-sm">2.</span>
                              <span className="text-sm">How do you handle state management in large applications?</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <span className="text-primary font-bold text-sm">3.</span>
                              <span className="text-sm">Describe your experience with TypeScript generics</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Customize Questions
                          </Button>
                          <Button className="bg-accent hover:bg-accent/90" size="sm">
                            <Zap className="h-4 w-4 mr-2" />
                            Start Interview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              </>
            )}
          </div>
        )}

        {activeTab === "parsing" && (
          <div className="space-y-6">
            {!hasJobs ? (
              <Card className="w-full">
                <CardContent className="p-8">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      Resume Upload Center
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Create jobs first so candidates can be assigned to specific roles
                    </p>
                    <Button 
                      onClick={() => setActiveTab("jobs")}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Create Jobs First
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                      Resume Upload & Candidate Creation
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Upload resumes and automatically create candidate profiles
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Connect Email
                  </Button>
                </div>
                
                <ResumeUpload onCandidateCreated={handleCandidateCreated} />
              </>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">
                Hiring Reports
              </h2>
              <p className="text-sm text-muted-foreground">
                Track your recruitment performance and insights
              </p>
            </div>
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    Pipeline Analytics
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {!hasJobs || !hasCandidates 
                      ? "Add jobs and candidates to see analytics and performance metrics"
                      : "Coming soon - Track hiring metrics and identify bottlenecks in your process"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">
                Pipeline Settings
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure your hiring pipeline stages and workflow
              </p>
            </div>
            
            <PipelineSettings />
          </div>
        )}
      </main>
    </div>;
};

export default Index;
