
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Calendar, FileText, Plus, Search, Zap, Brain, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import CandidateCard from "@/components/CandidateCard";
import InterviewQueue from "@/components/InterviewQueue";
import StatsOverview from "@/components/StatsOverview";

const Index = () => {
  const [activeTab, setActiveTab] = useState("pipeline");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-full px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-foreground">Scorecard</h1>
              </div>
              <Badge variant="secondary" className="text-xs bg-accent/20 text-accent border-accent/30">
                AI-Powered ATS
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search candidates..."
                  className="pl-10 w-80 bg-input border-border"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Resume
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
              { id: "pipeline", label: "Candidates", icon: Users },
              { id: "interviews", label: "Interviews", icon: Calendar },
              { id: "parsing", label: "Resume Parser", icon: FileText },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-6 py-4 text-sm border-r border-border transition-colors
                  ${activeTab === tab.id
                    ? "bg-background text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }
                `}
              >
                <tab.icon className="h-4 w-4" />
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
      <main className="max-w-full px-6 py-6">
        {activeTab === "pipeline" && (
          <div className="space-y-6">
            <StatsOverview />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-semibold text-foreground">
                      Active Candidates
                    </h2>
                    <Badge variant="outline" className="text-sm">
                      24 candidates
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Import from Email
                  </Button>
                </div>
                <div className="space-y-4">
                  <CandidateCard
                    name="Sarah Chen"
                    position="Senior React Developer"
                    email="sarah.chen@email.com"
                    status="technical-interview"
                    skills={["React", "TypeScript", "Node.js"]}
                    appliedDate="2 days ago"
                  />
                  <CandidateCard
                    name="Michael Rodriguez"
                    position="Full Stack Engineer"
                    email="m.rodriguez@email.com"
                    status="screening"
                    skills={["Python", "Django", "PostgreSQL"]}
                    appliedDate="5 days ago"
                  />
                  <CandidateCard
                    name="Emily Johnson"
                    position="Frontend Developer"
                    email="emily.j@email.com"
                    status="offer"
                    skills={["Vue.js", "JavaScript", "CSS"]}
                    appliedDate="1 week ago"
                  />
                </div>
              </div>
              <div>
                <InterviewQueue />
              </div>
            </div>
          </div>
        )}

        {activeTab === "interviews" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-foreground">
                  Technical Interviews
                </h2>
                <Badge variant="outline" className="text-sm">
                  AI Generated Questions
                </Badge>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Zap className="h-4 w-4 mr-2" />
                Generate Questions
              </Button>
            </div>
            
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>AI Interview Assistant</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/30 border border-border rounded-lg p-4">
                    <div className="text-accent text-sm mb-3">Generated from candidate's resume and job requirements</div>
                    <div className="text-foreground space-y-2">
                      <div className="flex items-start space-x-2">
                        <span className="text-primary font-semibold">1.</span>
                        <span>Explain React hooks and their lifecycle management</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-primary font-semibold">2.</span>
                        <span>How do you handle state management in large applications?</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-primary font-semibold">3.</span>
                        <span>Describe your experience with TypeScript generics</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Customize Questions
                    </Button>
                    <Button className="bg-accent hover:bg-accent/90">
                      <Zap className="h-4 w-4 mr-2" />
                      Start Interview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "parsing" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground">
                Resume Parser
              </h2>
              <Button variant="outline">
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
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Smart Resume Processing
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Automatically extract candidate information from resumes and LinkedIn profiles
                  </p>
                  <div className="bg-muted/20 border border-border rounded-lg p-6 max-w-md mx-auto">
                    <div className="text-accent text-sm mb-3">Supported Sources:</div>
                    <div className="text-foreground text-sm space-y-1">
                      <div className="flex items-center justify-between">
                        <span>PDF & Word Documents</span>
                        <span className="text-accent">✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>LinkedIn Profiles</span>
                        <span className="text-accent">✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Email Attachments</span>
                        <span className="text-accent">✓</span>
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
            <h2 className="text-xl font-semibold text-foreground">
              Recruitment Analytics
            </h2>
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Pipeline Insights
                  </h3>
                  <p className="text-muted-foreground">
                    Track your recruitment performance and identify bottlenecks
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
