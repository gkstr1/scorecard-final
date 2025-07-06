
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Users, Calendar, BarChart3, Zap, ArrowRight, Check, Star } from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Screening",
      description: "Smart resume parsing and candidate evaluation with machine learning algorithms."
    },
    {
      icon: Users,
      title: "Pipeline Management",
      description: "Visual kanban boards to track candidates through your hiring process seamlessly."
    },
    {
      icon: Calendar,
      title: "Interview Scheduling",
      description: "Automated scheduling with smart question generation for better interviews."
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Data-driven hiring decisions with comprehensive recruitment analytics."
    }
  ];

  const benefits = [
    "Reduce time-to-hire by 60%",
    "Improve candidate quality",
    "Streamline your hiring process",
    "Make data-driven decisions"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>

            {/* Badge */}
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm bg-accent/10 text-accent border-accent/20">
              <Zap className="h-4 w-4 mr-2" />
              AI-Powered Recruitment
            </Badge>

            {/* Main Heading */}
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-tight">
              Scorecard
            </h1>

            {/* Tagline */}
            <p className="font-display text-2xl md:text-3xl lg:text-4xl font-medium text-muted-foreground mb-8">
              A new way to recruit
            </p>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Transform your hiring process with AI-powered tools that help you find, evaluate, and hire the best talent faster than ever before.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="mx-2">•</span>
              <span>Trusted by 500+ companies</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why Choose Scorecard?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for modern HR teams who want to make smarter, faster hiring decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Transform Your Hiring
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of companies already using Scorecard to revolutionize their recruitment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-4 p-6 bg-card/50 rounded-lg border border-border">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-lg font-medium text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Final CTA */}
            <div className="text-center">
              <h3 className="font-display text-3xl font-bold text-foreground mb-6">
                Ready to get started?
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Join the future of recruitment today. No credit card required.
              </p>
              <Button size="lg" className="text-lg px-12 py-6 bg-primary hover:bg-primary/90 shadow-lg">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
