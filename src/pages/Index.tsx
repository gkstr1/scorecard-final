import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { User, Session } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Calendar, FileText, Plus, Search, Zap, ClipboardCheck, BarChart3, Settings, ChevronDown, ArrowLeft, Building2, Upload } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import { CreditBalance } from "@/components/CreditBalance";
import { CreditDisplay } from "@/components/CreditDisplay";
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
import Sourcing from "@/components/Sourcing";
import EmptyStateGuide from "@/components/EmptyStateGuide";
import AddCandidateForm from "@/components/AddCandidateForm";
import CandidateImportModal from "@/components/CandidateImportModal";
import JobManagement from "@/components/JobManagement";
import { AIChatPanel } from "@/components/AIChatPanel";
import { ReportsOverview } from "@/components/ReportsOverview";

const Index = () => {
  const [activeTab, setActiveTab] = useState("sourcing");
  const [selectedRole, setSelectedRole] = useState("");
  const [hasJobs, setHasJobs] = useState(false);
  const [hasCandidates, setHasCandidates] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableRoles, setAvailableRoles] = useState<{value: string, label: string}[]>([]);
  const [isAddCandidateModalOpen, setIsAddCandidateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  
  // Credit system hook
  const { credits, transactions, loading: creditsLoading, useCreditsForReveal } = useCredits(user);

  const fetchAvailableRoles = useCallback(async () => {
    try {
      const { data: jobsData } = await supabase
        .from("job_descriptions")
        .select(`
          id,
          title,
          clients (
            name
          )
        `)
        .eq("is_active", true);

      if (jobsData && jobsData.length > 0) {
        const roles = jobsData.map(job => ({
          value: job.id,
          label: job.clients?.name ? `${job.clients.name} - ${job.title}` : job.title
        }));
        setAvailableRoles(roles);
        
        // Set the first job as default if no role is selected
        if (!selectedRole && roles.length > 0) {
          setSelectedRole(roles[0].value);
        }
      }
    } catch (error) {
      console.error("Error fetching available roles:", error);
    }
  }, [selectedRole]);

  const checkDataExists = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Load data without authentication requirement
    checkDataExists();
    fetchAvailableRoles();

    return () => subscription.unsubscribe();
  }, [checkDataExists, fetchAvailableRoles]);

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
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-full px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105">
                <ArrowLeft className="h-4 w-4" />
                
              </Link>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary via-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                    <ClipboardCheck className="h-7 w-7 text-primary-foreground drop-shadow-sm" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-transparent rounded-xl blur-sm -z-10"></div>
                </div>
                <div className="space-y-0.5">
                  <h1 className="text-2xl font-bold text-foreground tracking-tight">Scorecard</h1>
                  <p className="text-sm text-muted-foreground font-medium tracking-wide">AI-Powered Recruitment Suite</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {credits && (
                <CreditBalance 
                  balance={credits.credits_balance} 
                  size="sm"
                  showButton={true}
                />
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => supabase.auth.signOut()}
              >
                Sign Out
              </Button>
              <AIChatPanel />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {/* Navigation */}
      <nav className="bg-muted/30 border-b border-border border-t border-border/50">
        <div className="max-w-full px-6">
          <div className="flex space-x-0">
            {[{
            id: "sourcing",
            label: "Sourcing",
            icon: Search
          }, {
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
        {!hasJobs && activeTab === "sourcing" && (
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
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-sm"
                  onClick={() => setIsImportModalOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Candidates
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-primary/10 border-2 border-primary/30 rounded-lg p-2 w-fit">
              <span className="text-sm font-medium text-primary">Job:</span>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-80 h-10 text-sm bg-background border-primary/50 hover:border-primary focus:border-primary shadow-sm">
                  <SelectValue placeholder="Select client and job to filter" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border shadow-lg">
                  {availableRoles.map(role => <SelectItem key={role.value} value={role.value} className="hover:bg-primary/10">
                      {role.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <StatsOverview />
            
            <KanbanBoard selectedRole={selectedRole} onAddCandidate={() => setIsAddCandidateModalOpen(true)} />
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
              <JobManagement />
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
                 <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                      Interview Center
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Schedule interviews and generate smart questions
                    </p>
                </div>
                
               <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <InterviewCalendar />
                </div>
                
                <div className="space-y-6">
                  <InterviewQueue />
                </div>
              </div>
              </>
            )}
          </div>
        )}

        {activeTab === "sourcing" && (
          <div className="space-y-6">
            {!hasJobs ? (
              <Card className="w-full">
                <CardContent className="p-8">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      Sourcing Center
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Create jobs first to start sourcing candidates for specific roles
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
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    Sourcing
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Find and source candidates from multiple channels
                  </p>
                </div>
                
                <Sourcing 
                  onCandidateCreated={handleCandidateCreated} 
                  onRevealContact={useCreditsForReveal}
                  userCredits={credits}
                />
              </>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            {!hasJobs || !hasCandidates ? (
              <>
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
                        Add jobs and candidates to see analytics and performance metrics
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <ReportsOverview />
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">
                Settings
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure your system settings and integrations
              </p>
            </div>
            
            {/* Credits Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Credits & Billing
              </h3>
              <CreditDisplay 
                credits={credits}
                transactions={transactions}
                loading={creditsLoading}
                onPurchaseCredits={() => {
                  // Will implement Stripe integration later
                  console.log("Purchase credits clicked");
                }}
              />
            </div>
            
            {/* Email Integration */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>Email Integration</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Connect Email
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Connect your email to automatically process resumes and candidate applications
                </p>
              </CardContent>
            </Card>
            
            {/* Pipeline Settings */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Pipeline Configuration
              </h3>
              <PipelineSettings />
            </div>
          </div>
        )}
      </main>
      
      {/* Add Candidate Modal */}
      <AddCandidateForm 
        isOpen={isAddCandidateModalOpen}
        onOpenChange={setIsAddCandidateModalOpen}
        onCandidateAdded={handleCandidateCreated}
      />
      
      {/* Import Candidates Modal */}
      <CandidateImportModal
        isOpen={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onCandidatesImported={handleCandidateCreated}
      />
    </div>;
};

export default Index;
