import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ArrowRight, CheckCircle, Calendar, Mail, Target, Users, Clock, Zap, BarChart, FileText, Star, TrendingUp, Lightbulb, MessageSquare, Award } from "lucide-react";
import CompanyLogos from './CompanyLogos';
import ScorecardLogo from './ScorecardLogo';
import ScorecardProgressLogo from './ScorecardProgressLogo';

const LandingPage = () => {
  const features = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Candidate Management",
      description: "Organize candidates with custom pipelines, tags, and status tracking. Import from LinkedIn, job boards, or CSV files.",
      colorClasses: {
        hoverBorder: "hover:border-primary/30",
        glow: "bg-primary/10",
        iconBg: "bg-gradient-to-br from-primary/20 to-primary/10 border-primary/20"
      }
    }, {
      icon: <Calendar className="w-6 h-6 text-accent" />,
      title: "Interview Scheduling",
      description: "Automated calendar integration, interview reminders, and timezone handling. Send calendar invites with one click.",
      colorClasses: {
        hoverBorder: "hover:border-accent/30",
        glow: "bg-accent/10",
        iconBg: "bg-gradient-to-br from-accent/20 to-accent/10 border-accent/20"
      }
    }, {
      icon: <FileText className="w-6 h-6 text-secondary-foreground" />,
      title: "Resume Parsing",
      description: "AI-powered resume extraction automatically captures skills, experience, education, and contact information.",
      colorClasses: {
        hoverBorder: "hover:border-secondary/30",
        glow: "bg-secondary/10",
        iconBg: "bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/20"
      }
    }, {
      icon: <Target className="w-6 h-6 text-primary" />,
      title: "Job Management",
      description: "Create job descriptions, manage requirements, and track applications. Post to multiple job boards simultaneously.",
      colorClasses: {
        hoverBorder: "hover:border-primary/30",
        glow: "bg-primary/10",
        iconBg: "bg-gradient-to-br from-primary/20 to-primary/10 border-primary/20"
      }
    }, {
      icon: <Mail className="w-6 h-6 text-accent" />,
      title: "Candidate Sourcing",
      description: "AI-powered sourcing tools to find and engage top talent. Automated outreach, LinkedIn integration, and talent pool management.",
      colorClasses: {
        hoverBorder: "hover:border-accent/30",
        glow: "bg-accent/10",
        iconBg: "bg-gradient-to-br from-accent/20 to-accent/10 border-accent/20"
      }
    }, {
      icon: <BarChart className="w-6 h-6 text-secondary-foreground" />,
      title: "Analytics & Reporting",
      description: "Track pipeline metrics, time-to-hire, conversion rates, and performance insights with custom dashboards.",
      colorClasses: {
        hoverBorder: "hover:border-secondary/30",
        glow: "bg-secondary/10",
        iconBg: "bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/20"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left Side - Logo & Navigation */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <a href="/" className="hover:opacity-80 transition-opacity">
                <ScorecardProgressLogo size="md" showText={true} />
              </a>
              
              {/* Navigation Menu */}
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
                <a href="#demo" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                  Demo
                </a>
              </nav>
            </div>

            {/* Right Side - Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <a href="/auth">Log In</a>
              </Button>
              <Button size="sm" asChild>
                <a href="/auth?mode=signup">Sign Up</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-background overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-5"></div>
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-background via-card to-background"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 text-center">
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Scorecard
            </h1>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-foreground mb-6 leading-tight animate-fade-in-up animation-delay-200">
            The AI-Powered ATS That Makes
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-2">
              Any Recruiter Technical
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
            Conduct professional technical interviews with AI-generated questions, automated scheduling, live assessments, and data-driven scorecards that turn hiring managers into your biggest fans.
          </p>

          <div className="mb-8 animate-fade-in-up animation-delay-500">
            <p className="text-2xl md:text-3xl text-foreground font-handwriting">
              Try Scorecard free for 7 days
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up animation-delay-600">
            <Button size="lg" className="group relative px-8 py-4 overflow-hidden" asChild>
              <a href="/auth?mode=signup">
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center">
                  Get Started Free <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </a>
            </Button>
            <Button size="lg" variant="ghost" className="text-muted-foreground hover:text-foreground">
              Watch Demo
            </Button>
          </div>

          <CompanyLogos />
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative py-16 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-6">
            
            {/* Profile Images */}
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                <img 
                  src="https://i.pravatar.cc/100?img=1" 
                  alt="" 
                  className="w-8 h-8 rounded-full border-2 border-background object-cover"
                />
                <img 
                  src="https://i.pravatar.cc/100?img=2" 
                  alt="" 
                  className="w-8 h-8 rounded-full border-2 border-background object-cover"
                />
                <img 
                  src="https://i.pravatar.cc/100?img=3" 
                  alt="" 
                  className="w-8 h-8 rounded-full border-2 border-background object-cover"
                />
                <img 
                  src="https://i.pravatar.cc/100?img=4" 
                  alt="" 
                  className="w-8 h-8 rounded-full border-2 border-background object-cover"
                />
              </div>
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                +500
              </div>
            </div>

            {/* Text */}
            <p className="text-lg text-muted-foreground text-center max-w-md">
              Join 500+ technical recruiters already using Scorecard
            </p>

          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-20"></div>

      {/* Product Demo Section */}
      <section id="demo" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            See AI Interviews in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Watch how Scorecard transforms your interview process with AI-generated questions, real-time scoring, and automated candidate evaluation
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-card via-card/90 to-card/80 rounded-2xl p-8 border border-border/20 shadow-2xl">
            {/* Browser Chrome */}
            <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-border">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="ml-4 text-sm text-muted-foreground font-mono bg-muted/30 px-3 py-1 rounded-md">
                scorecard.app/interview/live
              </div>
            </div>

            {/* Interview Interface */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">AI Interview: Senior React Developer</h3>
                    <p className="text-sm text-muted-foreground">Candidate: Sarah Johnson • Duration: 45 min</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">Live</span>
                </div>
              </div>

              {/* AI Question Section */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                    <div className="flex items-center space-x-2 mb-3">
                      <MessageSquare className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium text-accent">AI-Generated Question</span>
                    </div>
                    <p className="text-sm text-foreground mb-3">
                      "Can you explain the difference between useEffect and useLayoutEffect in React? When would you use each one?"
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Zap className="w-3 h-3" />
                      <span>Difficulty: Intermediate • Topic: React Hooks</span>
                    </div>
                  </div>

                  <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20">
                    <div className="flex items-center space-x-2 mb-3">
                      <Target className="w-4 h-4 text-secondary-foreground" />
                      <span className="text-sm font-medium text-secondary-foreground">Follow-up Questions</span>
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• "Can you provide a code example?"</li>
                      <li>• "What are the performance implications?"</li>
                      <li>• "How would you test this?"</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                    <div className="flex items-center space-x-2 mb-3">
                      <BarChart className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Real-time Scoring</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-foreground">Technical Knowledge</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-4/5 h-full bg-primary rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium text-primary">8.5</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-foreground">Communication</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-4/5 h-full bg-accent rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium text-accent">9.2</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-foreground">Problem Solving</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium text-green-600">7.8</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">AI Insight</span>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-300">
                      Candidate demonstrates strong understanding of React lifecycle. Consider asking about performance optimization next.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-4">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Next Question
                  </Button>
                  <Button size="sm" variant="outline">
                    Add Note
                  </Button>
                  <Button size="sm" variant="ghost">
                    Skip Question
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Question 3 of 12 • 15:30 remaining
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ATS Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Complete ATS Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
            Unlike generic ATS platforms, we're built specifically for technical recruiting
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Beyond AI interviews and scorecards, Scorecard provides a full-featured ATS to streamline your entire hiring process
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <Card key={i} className={`relative overflow-hidden group bg-card hover:bg-card/90 transition-all duration-300 p-6 border border-border/20 ${feature.colorClasses.hoverBorder}`}>
              <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 ${feature.colorClasses.glow}`}></div>
              <CardContent className="p-0 relative z-10">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 border ${feature.colorClasses.iconBg}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
            Value-based pricing that grows with your hiring needs
          </p>
          <p className="text-sm text-muted-foreground">
            Starting at $79/month • No per-user fees • Cancel anytime
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <Card className="p-8 relative border-2 hover:border-primary/30 transition-colors h-full flex flex-col bg-card/80 shadow-lg hover:shadow-xl">
            <div className="text-center flex-1 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">$79</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Perfect for small recruiting teams</p>
              <ul className="space-y-3 mb-6 text-left flex-1">
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>5 active job postings</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>50 AI interview credits/month</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>25 contact reveals/month</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>Basic ATS functionality</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>AI-generated scorecards</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>Email support</span></li>
              </ul>
              <div className="mb-6 p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20">
                <p className="text-sm text-muted-foreground mb-2">Add-ons available:</p>
                <p className="text-xs text-accent font-medium">+50 AI credits: $25/month</p>
                <p className="text-xs text-accent font-medium">+25 contact reveals: $15/month</p>
              </div>
              <Button className="w-full" size="lg" variant="outline">Start Free Trial</Button>
            </div>
          </Card>

          {/* Professional Plan */}
          <Card className="p-8 relative border-2 border-primary bg-gradient-to-br from-primary/10 to-accent/10 h-full flex flex-col shadow-2xl shadow-primary/20">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1 animate-pulse">Most Popular</Badge>
            </div>
            <div className="text-center flex-1 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">$149</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Ideal for growing companies</p>
              <ul className="space-y-3 mb-6 text-left flex-1">
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>15 active job postings</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>150 AI interview credits/month</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>75 contact reveals/month</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>Full ATS platform</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>Custom scorecards</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>Team collaboration</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>Priority support</span></li>
              </ul>
              <div className="mb-6 p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20">
                <p className="text-sm text-muted-foreground mb-2">Add-ons available:</p>
                <p className="text-xs text-accent font-medium">+150 AI credits: $60/month</p>
                <p className="text-xs text-accent font-medium">+75 contact reveals: $40/month</p>
              </div>
              <Button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-shadow" size="lg">Start Free Trial</Button>
            </div>
          </Card>

          {/* Enterprise Plan */}
          <Card className="p-8 relative border-2 hover:border-primary/30 transition-colors h-full flex flex-col bg-card/80 shadow-lg hover:shadow-xl">
            <div className="text-center flex-1 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">$299</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">For large organizations</p>
              <ul className="space-y-3 mb-6 text-left flex-1">
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>Unlimited job postings</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>500 AI interview credits/month</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>200 contact reveals/month</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>White-label options</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>API access</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>Custom integrations</span></li>
                <li className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary" /><span>Dedicated support</span></li>
              </ul>
              <div className="mb-6 p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20">
                <p className="text-sm text-muted-foreground mb-2">Add-ons available:</p>
                <p className="text-xs text-accent font-medium">+500 AI credits: $175/month</p>
                <p className="text-xs text-accent font-medium">+200 contact reveals: $95/month</p>
              </div>
              <Button className="w-full" size="lg" variant="outline">Contact Sales</Button>
            </div>
          </Card>
        </div>

        {/* ROI Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">Why Scorecard Saves You Money</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">75%</div>
                <p className="text-sm text-muted-foreground">Faster hiring process</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-2">$0</div>
                <p className="text-sm text-muted-foreground">Per-user fees</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">60%</div>
                <p className="text-sm text-muted-foreground">Better hire quality</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Traditional ATS platforms charge $100-$649 per user per month. Scorecard's value-based pricing scales with your success, not your team size.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/30 border-t border-border mt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-xl font-bold text-foreground">Scorecard</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                The AI-powered ATS that makes any recruiter technical. Streamline your hiring process with intelligent interview scorecards.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Interview Questions</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Scorecards</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">ATS Platform</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Integrations</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Webinars</a></li>
              </ul>
            </div>

            {/* Company & Legal */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <p className="text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} Scorecard. All rights reserved.
                </p>
                <div className="flex items-center space-x-4">
                  <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Status</a>
                  <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Changelog</a>
                  <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">GDPR</a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                  <Star className="w-3 h-3 mr-1" />
                  SOC 2 Compliant
                </Badge>
                <Badge variant="outline" className="text-xs border-accent/30 text-accent">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  GDPR Ready
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;