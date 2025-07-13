
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ArrowRight, CheckCircle, Calendar, Mail, Target, Users, Clock, Zap, BarChart } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-6">
          <div className="text-6xl md:text-8xl font-bold text-primary mb-2 tracking-tight">
            Scorecard
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight max-w-4xl mx-auto">
          AI-Powered Interview
          <span className="block text-primary"> Scorecards</span>
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Generate detailed scorecards after every interview with AI analysis, structured feedback, and data-driven hiring decisions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="px-6 py-3">
            Get started
          </Button>
          <Button size="lg" variant="outline" className="px-6 py-3">
            Watch demo
          </Button>
        </div>

        {/* Company Logos */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-6">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-xl font-bold">Notion</div>
            <div className="text-xl font-bold">Salesforce</div>
            <div className="text-xl font-bold">Harvard</div>
            <div className="text-xl font-bold">HubSpot</div>
            <div className="text-xl font-bold">McKinsey & Company</div>
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="container mx-auto px-4 mb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
            <div className="bg-background rounded-xl p-6 shadow-2xl">
              <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-border">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="ml-4 text-sm text-muted-foreground">scorecard.app</div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold mb-1">12</div>
                  <div className="text-xs text-muted-foreground">Active Jobs</div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold mb-1">48</div>
                  <div className="text-xs text-muted-foreground">Candidates</div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold mb-1">6</div>
                  <div className="text-xs text-muted-foreground">Interviews</div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold mb-1">92%</div>
                  <div className="text-xs text-muted-foreground">Match Rate</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-muted/60 rounded w-1/2"></div>
                  </div>
                  <div className="text-xs text-primary font-medium">95%</div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-muted rounded w-2/3 mb-2"></div>
                    <div className="h-2 bg-muted/60 rounded w-3/4"></div>
                  </div>
                  <div className="text-xs text-muted-foreground">87%</div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 bg-accent rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-muted rounded w-4/5 mb-2"></div>
                    <div className="h-2 bg-muted/60 rounded w-1/3"></div>
                  </div>
                  <div className="text-xs text-muted-foreground">82%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Hiring Companion Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8">
            <div className="bg-background rounded-xl p-6 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium">Interview scheduled</div>
                    <div className="text-sm text-muted-foreground">Sarah Chen - Frontend Developer</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-secondary" />
                  <div className="flex-1">
                    <div className="font-medium">Resume reviewed</div>
                    <div className="text-sm text-muted-foreground">Match score: 94%</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-accent" />
                  <div className="flex-1">
                    <div className="font-medium">Skills assessed</div>
                    <div className="text-sm text-muted-foreground">React, TypeScript, Node.js</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Post-Interview Scorecards.
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              AI automatically generates comprehensive scorecards after each interview, evaluating technical skills, communication, cultural fit, and overall candidate performance.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">AI-generated interview scorecards</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Technical skills assessment</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Cultural fit evaluation</span>
              </div>
            </div>
            <Button size="lg" className="px-6 py-3">
              Learn more
            </Button>
          </div>
        </div>
      </div>

      {/* Smart Features Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI Interview Scorecards.
            <br />
            Powered by Intelligence.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate comprehensive post-interview scorecards with AI analysis, structured evaluation, and actionable insights for better hiring decisions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Scorecard Generation</h3>
            <p className="text-muted-foreground">
              Automatically generate detailed interview scorecards with AI analysis of candidate responses and performance.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <BarChart className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Interview Analysis</h3>
            <p className="text-muted-foreground">
              Deep analysis of technical skills, communication, problem-solving, and cultural fit scores.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Structured Evaluation</h3>
            <p className="text-muted-foreground">
              Consistent evaluation criteria across all interviews with standardized scoring and feedback.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <BarChart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground">
              Track hiring metrics, candidate pipeline, and team performance in real-time.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Time Management</h3>
            <p className="text-muted-foreground">
              Reduce time-to-hire by 60% with automated workflows and smart prioritization.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quick Actions</h3>
            <p className="text-muted-foreground">
              One-click candidate actions: approve, schedule, reject, or request more information.
            </p>
          </Card>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 md:p-12 border border-primary/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Fair pricing.
                  <br />
                  No hidden fees.
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Start with our free plan and upgrade as your team grows. No setup fees, no hidden costs.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Up to 50 candidates per month</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">AI resume analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Basic analytics</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-background rounded-xl p-8 shadow-lg">
                  <div className="text-5xl font-bold text-primary mb-2">$59</div>
                  <div className="text-muted-foreground mb-6">per month</div>
                  <Button size="lg" className="w-full mb-4">
                    Start free trial
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    7-day free trial. Cancel anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
