
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ArrowRight, CheckCircle } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-8 text-sm px-4 py-2">
          <CheckCircle className="w-4 h-4 mr-2" />
          20,000+ calendar conflicts automatically resolved
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
          The world's first
          <br />
          <span className="inline-flex items-center bg-foreground text-background px-3 py-1 rounded-md mx-2">
            <Brain className="w-8 h-8 mr-2" />
          </span>
          AI chief of staff
        </h1>
        
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Scorecard finds your highest-impact priorities from your inbox and calendar, then helps you complete them with a single click.
        </p>
        
        <div className="mb-12">
          <div className="inline-flex items-center text-primary mb-4">
            <span className="text-lg font-medium mr-2">Try Scorecard free for 7 days</span>
            <ArrowRight className="w-5 h-5" />
          </div>
          <div>
            <Button size="lg" className="px-8 py-4 text-lg font-medium rounded-full">
              Start free trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Company Logos */}
        <div className="mb-20">
          <p className="text-sm text-muted-foreground mb-6">Used by professionals at</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-xl font-bold">Notion</div>
            <div className="text-xl font-bold">salesforce</div>
            <div className="text-xl font-bold">HARVARD</div>
            <div className="text-xl font-bold">HubSpot</div>
            <div className="text-xl font-bold">McKinsey & Company</div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-border rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-primary font-medium mb-4 text-lg">Imagine</div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Starting your day knowing exactly what matters: <span className="text-muted-foreground">emails prioritized, action items flagged, and your day mapped out before the caffeine hits.</span>
                </h2>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-6 border border-primary/20">
                  <div className="bg-background rounded-xl p-4 shadow-lg">
                    <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-border">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-2 bg-muted/60 rounded w-1/2"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-muted rounded w-2/3 mb-2"></div>
                          <div className="h-2 bg-muted/60 rounded w-3/4"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-muted rounded w-4/5 mb-2"></div>
                          <div className="h-2 bg-muted/60 rounded w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
