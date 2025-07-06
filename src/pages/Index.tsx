
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Calendar, FileText, Plus, Search, Zap, Brain, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import CandidateCard from "@/components/CandidateCard";
import InterviewQueue from "@/components/InterviewQueue";
import StatsOverview from "@/components/StatsOverview";
import KanbanBoard from "@/components/KanbanBoard";

const Index = () => {
  const [activeTab, setActiveTab] = useState("candidates");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-full px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Scorecard</h1>
                  <p className="text-sm text-muted-foreground">Smart Hiring Platform</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm bg-accent/20 text-accent border-accent/30 px-3 py-1">
                AI Powered
              </Badge>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search candidates by name or role..."
                  className="pl-12 w-96 bg-input border-border h-12 text-base"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6">
                <Plus className="h-5 w-5 mr-2" />
                Add Candidate
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-full px-8">
          <div className="flex space-x-0">
            {[
              { id: "candidates", label: "Candidate Pipeline", icon: Users },
              { id: "interviews", label: "Interview Center", icon: Calendar },
              { id: "parsing", label: "Resume Upload", icon: FileText },
              { id: "analytics", label: "Reports", icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-3 px-8 py-5 text-base border-r border-border transition-colors
                  ${activeTab === tab.id
                    ? "bg-background text-primary border-b-2 border-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }
                `}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="w-2 h-2 rounded-full bg-accent" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-full px-8 py-8">
        {activeTab === "candidates" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Candidate Pipeline
                </h2>
                <p className="text-lg text-muted-foreground">
                  Manage your hiring process from application to offer
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-base px-4 py-2">
                  24 Active Candidates
                </Badge>
                <Button variant="outline" size="lg">
                  <Mail className="h-5 w-5 mr-2" />
                  Import from Email
                </Button>
              </div>
            </div>
            
            <StatsOverview />
            
            <KanbanBoard />
          </div>
        )}

        {activeTab === "interviews" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Interview Center
                </h2>
                <p className="text-lg text-muted-foreground">
                  Schedule interviews and generate smart questions
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary/90" size="lg">
                <Zap className="h-5 w-5 mr-2" />
                Generate Questions
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <InterviewQueue />
              
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center space-x-3 text-xl">
                    <Brain className="h-6 w-6 text-primary" />
                    <span>Smart Interview Questions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-muted/30 border border-border rounded-lg p-6">
                      <div className="text-accent text-base mb-4 font-medium">
                        Generated from candidate resume and job requirements
                      </div>
                      <div className="text-foreground space-y-4">
                        <div className="flex items-start space-x-3">
                          <span className="text-primary font-bold text-lg">1.</span>
                          <span className="text-base">Explain React hooks and their lifecycle management</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-primary font-bold text-lg">2.</span>
                          <span className="text-base">How do you handle state management in large applications?</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-primary font-bold text-lg">3.</span>
                          <span className="text-base">Describe your experience with TypeScript generics</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button variant="outline" size="lg">
                        <FileText className="h-5 w-5 mr-2" />
                        Customize Questions
                      </Button>
                      <Button className="bg-accent hover:bg-accent/90" size="lg">
                        <Zap className="h-5 w-5 mr-2" />
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
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Resume Upload
                </h2>
                <p className="text-lg text-muted-foreground">
                  Upload and parse resumes automatically
                </p>
              </div>
              <Button variant="outline" size="lg">
                <Mail className="h-5 w-5 mr-2" />
                Connect Email
              </Button>
            </div>
            
            <Card className="bg-card border-border">
              <CardContent className="p-12">
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Smart Resume Processing
                  </h3>
                  <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                    Drop your resume files here or connect your email to automatically process new applications
                  </p>
                  <div className="bg-muted/20 border border-border rounded-lg p-8 max-w-lg mx-auto">
                    <div className="text-accent text-base mb-4 font-medium">Supported Sources:</div>
                    <div className="text-foreground text-base space-y-3">
                      <div className="flex items-center justify-between">
                        <span>PDF & Word Documents</span>
                        <span className="text-accent text-xl">✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>LinkedIn Profiles</span>
                        <span className="text-accent text-xl">✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Email Attachments</span>
                        <span className="text-accent text-xl">✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Hiring Reports
              </h2>
              <p className="text-lg text-muted-foreground">
                Track your recruitment performance and insights
              </p>
            </div>
            <Card className="bg-card border-border">
              <CardContent className="p-12">
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Pipeline Analytics
                  </h3>
                  <p className="text-lg text-muted-foreground">
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
