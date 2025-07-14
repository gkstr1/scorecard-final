
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ArrowRight, CheckCircle, Calendar, Mail, Target, Users, Clock, Zap, BarChart, FileText, Star, TrendingUp, Lightbulb, MessageSquare, Award } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center relative overflow-hidden">
        {/* Artistic Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-accent/20 rounded-full blur-lg"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-secondary/20 rounded-full blur-md"></div>
          <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-primary/5 rounded-full blur-sm"></div>
        </div>

        <div className="mb-6 relative">
          
          <div className="text-6xl md:text-8xl font-bold text-primary mb-2 tracking-tight relative">
            Scorecard
            {/* Floating elements around the text */}
            
            <div className="absolute -top-6 -right-8 text-xl">📊</div>
            
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight max-w-4xl mx-auto">
          Make Non-Technical Recruiters
          <span className="block text-primary relative">
            Technical
            {/* Underline effect */}
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0"></div>
          </span>
        </h1>
        
        <p className="text-lg text-muted-foreground mb-4 max-w-3xl mx-auto">
          Built by a recruiter for recruiters. Conduct professional technical interviews with AI-generated questions, automated scheduling, live assessments, and data-driven scorecards that turn hiring managers into your biggest fans.
        </p>
        
        <p className="text-base text-muted-foreground/80 mb-8 max-w-2xl mx-auto font-medium">
          Full-scale AI-powered ATS. Simple. Strong. Complete.
        </p>
        
        {/* Try free text */}
        <div className="mb-6 relative">
          <p className="text-3xl font-handwriting text-white text-center">
            Try Scorecard free for 7 days
          </p>
        </div>
        
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

      {/* Artistic Scorecard Preview */}
      <div className="container mx-auto px-4 mb-20">
        <div className="max-w-4xl mx-auto relative">
          {/* Floating AI Elements */}
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute -top-4 -right-12 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-accent" />
          </div>

          <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                {[...Array(64)].map((_, i) => (
                  <div key={i} className="border border-primary/20"></div>
                ))}
              </div>
            </div>

            <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl relative z-10">
              <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-border">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="ml-4 text-sm text-muted-foreground font-mono">scorecard.app/interview-analysis</div>
              </div>
              
              {/* AI Scorecard Header */}
              <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">AI Interview Scorecard</div>
                    <div className="text-xs text-muted-foreground">Generated in 2.3 seconds</div>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center space-x-1 text-xs text-accent">
                      <TrendingUp className="w-3 h-3" />
                      <span>94% Match</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">Based on resume analysis and interview responses</div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 text-center border border-primary/20">
                  <div className="text-2xl font-bold mb-1 text-primary">9.4</div>
                  <div className="text-xs text-muted-foreground">Technical Skills</div>
                </div>
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-4 text-center border border-accent/20">
                  <div className="text-2xl font-bold mb-1 text-accent">8.7</div>
                  <div className="text-xs text-muted-foreground">Communication</div>
                </div>
                <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg p-4 text-center border border-secondary/30">
                  <div className="text-2xl font-bold mb-1">9.1</div>
                  <div className="text-xs text-muted-foreground">Problem Solving</div>
                </div>
                <div className="bg-gradient-to-br from-primary/15 to-accent/10 rounded-lg p-4 text-center border border-primary/20">
                  <div className="text-2xl font-bold mb-1 text-primary">92%</div>
                  <div className="text-xs text-muted-foreground">Overall Fit</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {/* AI-Generated Questions */}
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                  <div className="w-10 h-10 bg-primary rounded-lg flex-shrink-0 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">React Hooks Implementation</div>
                    <div className="text-xs text-muted-foreground">AI-generated technical question based on resume</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-xs text-primary font-medium">Excellent</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-accent/5 to-accent/10 rounded-lg border border-accent/20">
                  <div className="w-10 h-10 bg-accent rounded-lg flex-shrink-0 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">System Design Approach</div>
                    <div className="text-xs text-muted-foreground">Adaptive questioning based on experience level</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-accent" />
                    <span className="text-xs text-accent font-medium">Strong</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-lg border border-secondary/30">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex-shrink-0 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">Cultural Fit Assessment</div>
                    <div className="text-xs text-muted-foreground">Values alignment and team collaboration</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span className="text-xs font-medium">Good Fit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your interview scorecard needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Beginner Plan */}
          <Card className="p-8 relative border-2 hover:border-primary/30 transition-colors h-full flex flex-col">
            <div className="text-center flex-1 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Beginner</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">$79</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-6 text-left flex-1">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>500 AI tokens included</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>AI interview questions generation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Unlimited interview scorecards</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Basic AI analysis</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Standard evaluation criteria</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Email support</span>
                </li>
              </ul>
              <div className="mb-6 p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20">
                <p className="text-sm text-muted-foreground mb-2">Add-ons available:</p>
                <p className="text-xs text-accent font-medium">+1000 AI tokens: $15/month</p>
              </div>
              <Button className="w-full" size="lg">
                Get Started
              </Button>
            </div>
          </Card>

          {/* Intermediate Plan */}
          <Card className="p-8 relative border-2 border-primary bg-gradient-to-br from-primary/5 to-accent/5 h-full flex flex-col">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1">
                Most Popular
              </Badge>
            </div>
            <div className="text-center flex-1 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Intermediate</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">$129</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-6 text-left flex-1">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>2000 AI tokens included</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Advanced AI interview questions</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Unlimited interview scorecards</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Advanced AI analysis</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Custom evaluation templates</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Analytics dashboard</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Priority support</span>
                </li>
              </ul>
              <div className="mb-6 p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20">
                <p className="text-sm text-muted-foreground mb-2">Add-ons available:</p>
                <p className="text-xs text-accent font-medium">+5000 AI tokens: $10/month</p>
              </div>
              <Button className="w-full" size="lg">
                Get Started
              </Button>
            </div>
          </Card>

          {/* Custom Plan */}
          <Card className="p-8 relative border-2 hover:border-accent/30 transition-colors h-full flex flex-col">
            <div className="text-center flex-1 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Custom</h3>
              <div className="mb-6">
                <span className="text-2xl font-bold text-accent">Contact Us</span>
                <div className="text-muted-foreground">for a quote</div>
              </div>
              <ul className="space-y-3 mb-8 text-left flex-1">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Unlimited scorecards</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Enterprise AI features</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>SLA guarantees</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" size="lg">
                Contact Sales
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* AI Resume Analysis Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="relative">
            {/* Floating elements around the card */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary/20 rounded-full"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-accent/20 rounded-full"></div>
            
            <div className="bg-gradient-to-br from-primary/15 via-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/30 relative overflow-hidden">
              {/* AI processing visualization */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-xs text-primary font-medium">AI Processing</span>
              </div>

              <div className="bg-background/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="space-y-4">
                  {/* Resume Upload Visualization */}
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Resume Analyzed</div>
                      <div className="text-sm text-muted-foreground">Sarah_Chen_Resume.pdf</div>
                    </div>
                    <div className="text-xs text-primary font-medium">100%</div>
                  </div>

                  {/* AI Question Generation */}
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Questions Generated</div>
                      <div className="text-sm text-muted-foreground">12 tailored interview questions</div>
                    </div>
                    <div className="text-xs text-accent font-medium">Ready</div>
                  </div>

                  {/* Skills Matching */}
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-secondary/15 to-secondary/10 rounded-lg">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Skills Matched</div>
                      <div className="text-sm text-muted-foreground">React, TypeScript, Node.js, AWS</div>
                    </div>
                    <div className="text-xs text-primary font-medium">94%</div>
                  </div>

                  {/* AI Insights */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-primary mt-0.5" />
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium text-primary">AI Insight:</span> Strong React experience with 5+ years. Consider deep-dive questions on hooks and state management.
                      </div>
                    </div>
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
            Everything You Need to Conduct
            <br />
            <span className="text-primary">Professional Technical Interviews</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From AI-generated questions to automated scheduling and comprehensive metrics - we've built everything a recruiter needs to excel at technical hiring.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Generated Questions</h3>
            <p className="text-muted-foreground">
              Smart questions tailored to each candidate's resume and experience level. No more generic interviews - every question is personalized and relevant.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live & Automated Interviews</h3>
            <p className="text-muted-foreground">
              Conduct live technical interviews with real-time guidance, or set up automated assessments for initial screening.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Calendar Integration</h3>
            <p className="text-muted-foreground">
              Automatically send Zoom or Teams invites when candidates reach the technical interview stage. No manual scheduling required.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <BarChart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Hiring Manager KPIs</h3>
            <p className="text-muted-foreground">
              Comprehensive metrics and reports that you can send directly to hiring managers. Show your impact with data-driven insights.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Scorecard Analysis</h3>
            <p className="text-muted-foreground">
              Detailed post-interview scorecards with technical skills assessment, cultural fit evaluation, and hiring recommendations.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Pipeline Automation</h3>
            <p className="text-muted-foreground">
              Candidates automatically move through your pipeline based on scores and criteria. Spend less time on admin, more time on relationships.
            </p>
          </Card>
        </div>
      </div>

      {/* Recruiter-to-Recruiter Section */}
      <div className="container mx-auto px-4 py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="bg-primary/10 text-white border-primary/20 px-4 py-2 text-lg font-handwriting">
              Try Scorecard for 7 days
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            The Complete Solution
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Scorecard gives non-technical recruiters the power to conduct professional technical interviews with confidence. AI generates perfect questions, automates scheduling, and creates data-driven scorecards that hiring managers trust.
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Built by a recruiter who understands exactly what you need to succeed in technical hiring.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">85%</div>
              <div className="text-sm text-muted-foreground">Less time per technical interview</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">3x</div>
              <div className="text-sm text-muted-foreground">More confident in technical discussions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Hiring manager satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
