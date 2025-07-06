
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Calendar, FileText, Plus, Search, Code, Terminal, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import CandidateCard from "@/components/CandidateCard";
import InterviewQueue from "@/components/InterviewQueue";
import StatsOverview from "@/components/StatsOverview";

const Index = () => {
  const [activeTab, setActiveTab] = useState("pipeline");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* IDE-style Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-full px-6">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Terminal className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground font-mono">Scorecard.dev</h1>
              </div>
              <Badge variant="secondary" className="text-xs font-mono bg-accent/20 text-accent border-accent/30">
                ATS v2.1.0
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search candidates, skills..."
                  className="pl-10 w-80 bg-input border-border font-mono text-sm"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono">
                <Plus className="h-4 w-4 mr-2" />
                Import Resume
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* IDE-style Tab Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-full px-6">
          <div className="flex space-x-0">
            {[
              { id: "pipeline", label: "candidates.tsx", icon: Users },
              { id: "interviews", label: "interviews.tsx", icon: Calendar },
              { id: "parsing", label: "parser.tsx", icon: Code },
              { id: "analytics", label: "metrics.tsx", icon: Zap },
            ].map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-4 py-3 text-sm font-mono border-r border-border
                  ${activeTab === tab.id
                    ? "bg-background text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }
                  ${index === 0 ? "border-l border-border" : ""}
                `}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="w-2 h-2 rounded-full bg-accent ml-2" />
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
                    <h2 className="text-lg font-bold text-foreground font-mono">
                      ~/candidates/active
                    </h2>
                    <Badge variant="outline" className="font-mono text-xs">
                      24 records
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="font-mono">
                    <Mail className="h-4 w-4 mr-2" />
                    Parse Emails
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
                <h2 className="text-lg font-bold text-foreground font-mono">
                  ~/interviews/technical
                </h2>
                <Badge variant="outline" className="font-mono text-xs">
                  AI Generated
                </Badge>
              </div>
              <Button className="bg-primary hover:bg-primary/90 font-mono">
                <Zap className="h-4 w-4 mr-2" />
                Generate Questions
              </Button>
            </div>
            
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-mono text-foreground flex items-center space-x-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  <span>Interview Generator</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="code-block">
                    <div className="text-accent text-sm font-mono mb-2">// Auto-generated from resume analysis</div>
                    <div className="text-foreground">
                      <p className="mb-2">const interviewQuestions = [</p>
                      <p className="ml-4 text-blue-400">"Explain React hooks and their lifecycle",</p>
                      <p className="ml-4 text-blue-400">"How do you handle state management at scale?",</p>
                      <p className="ml-4 text-blue-400">"Describe your TypeScript experience with generics"</p>
                      <p>];</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="font-mono">
                      <Code className="h-4 w-4 mr-2" />
                      Customize
                    </Button>
                    <Button className="bg-accent hover:bg-accent/90 font-mono">
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
              <h2 className="text-lg font-bold text-foreground font-mono">
                ~/parser/resume-engine
              </h2>
              <Button variant="outline" className="font-mono">
                <Mail className="h-4 w-4 mr-2" />
                Connect Email
              </Button>
            </div>
            
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Code className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2 font-mono">
                    Resume Parser Engine
                  </h3>
                  <p className="text-muted-foreground font-mono text-sm">
                    AI-powered parsing from LinkedIn & Email attachments
                  </p>
                  <div className="mt-6 code-block text-left max-w-md mx-auto">
                    <div className="text-accent text-xs font-mono mb-2">// Supported formats</div>
                    <div className="text-foreground text-sm">
                      <p>PDF, DOC, DOCX ✓</p>
                      <p>LinkedIn profiles ✓</p>
                      <p>Email attachments ✓</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-foreground font-mono">
              ~/metrics/dashboard
            </h2>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2 font-mono">
                    Recruiting Metrics
                  </h3>
                  <p className="text-muted-foreground font-mono text-sm">
                    Pipeline analytics & performance tracking
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
