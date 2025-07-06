

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Calendar, FileText, Plus, Search, Zap, Brain, BarChart3, Settings, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CandidateCard from "@/components/CandidateCard";
import InterviewQueue from "@/components/InterviewQueue";
import StatsOverview from "@/components/StatsOverview";
import KanbanBoard from "@/components/KanbanBoard";
import JobCreator from "@/components/JobCreator";
import PipelineSettings from "@/components/PipelineSettings";

const Index = () => {
  const [activeTab, setActiveTab] = useState("candidates");
  const [selectedRole, setSelectedRole] = useState("all");

  const roles = [
    { value: "all", label: "All Roles" },
    { value: "frontend", label: "Frontend Developer" },
    { value: "backend", label: "Backend Developer" },
    { value: "fullstack", label: "Full Stack Engineer" },
    { value: "designer", label: "Product Designer" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-full px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Scorecard</h1>
                  <p className="text-xs text-muted-foreground">Smart Hiring Platform</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs bg-accent/20 text-accent border-accent/30 px-2 py-1">
                AI Powered
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search candidates..."
                  className="pl-10 w-64 bg-input border-border h-9 text-sm"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 text-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-full px-6">
          <div className="flex space-x-0">
            {[
              { id: "candidates", label: "Candidate Pipeline", icon: Users },
              { id: "jobs", label: "Job Management", icon: FileText },
              { id: "interviews", label: "Interview Center", icon: Calendar },
              { id: "parsing", label: "Resume Upload", icon: Mail },
              { id: "settings", label: "Settings", icon: Settings },
              { id: "analytics", label: "Reports", icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-4 py-3 text-sm border-r border-border transition-colors
                  ${activeTab === tab.id
                    ? "bg-background text-primary border-b-2 border-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }
                `}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-full px-6 py-6">
        {activeTab === "candidates" && (
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
                  24 Active Candidates
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
                  <ChevronDown className="h-4 w-4 text-primary ml-2" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border shadow-lg">
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value} className="hover:bg-primary/10">
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <StatsOverview />
            
            <KanbanBoard selectedRole={selectedRole} />
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  Job Management
                </h2>
                <p className="text-sm text-muted-foreground">
                  Create and manage job postings with custom pipelines
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary/90" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create New Job
              </Button>
            </div>
            
            <JobCreator />
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

        {activeTab === "interviews" && (
          <div className="space-y-6">
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        )}

        {activeTab === "parsing" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  Resume Upload
                </h2>
                <p className="text-sm text-muted-foreground">
                  Upload and parse resumes automatically
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Connect Email
              </Button>
            </div>
            
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    Smart Resume Processing
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                    Drop your resume files here or connect your email to automatically process new applications
                  </p>
                  <div className="bg-muted/20 border border-border rounded-lg p-6 max-w-lg mx-auto">
                    <div className="text-accent text-sm mb-3 font-medium">Supported Sources:</div>
                    <div className="text-foreground text-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span>PDF & Word Documents</span>
                        <span className="text-accent text-lg">✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>LinkedIn Profiles</span>
                        <span className="text-accent text-lg">✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Email Attachments</span>
                        <span className="text-accent text-lg">✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                    Coming soon - Track hiring metrics and identify bottlenecks in your process
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

