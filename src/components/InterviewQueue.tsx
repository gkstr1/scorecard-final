
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Terminal, User, Zap } from "lucide-react";

const InterviewQueue = () => {
  const upcomingInterviews = [
    {
      id: 1,
      candidateName: "Sarah Chen",
      position: "Senior React Developer",
      time: "Today, 2:00 PM",
      type: "Technical",
      duration: "60 min",
    },
    {
      id: 2,
      candidateName: "Michael Rodriguez",
      position: "Full Stack Engineer",
      time: "Tomorrow, 10:00 AM",
      type: "Technical",
      duration: "45 min",
    },
  ];

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 font-mono text-foreground">
          <Terminal className="h-4 w-4 text-primary" />
          <span>queue.interviews</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingInterviews.map((interview) => (
          <div
            key={interview.id}
            className="p-3 border border-border rounded bg-muted/20 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium text-xs font-mono text-foreground">{interview.candidateName}</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">{interview.position}</p>
              </div>
              <Badge variant="outline" className="text-xs font-mono bg-primary/10 text-primary border-primary/30">
                {interview.type}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 font-mono">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{interview.time}</span>
              </div>
              <span>{interview.duration}</span>
            </div>
            
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="text-xs font-mono bg-accent/10 border-accent/30 text-accent hover:bg-accent/20">
                <Zap className="h-3 w-3 mr-1" />
                Questions
              </Button>
              <Button size="sm" className="text-xs font-mono bg-primary hover:bg-primary/90">
                <Terminal className="h-3 w-3 mr-1" />
                Start
              </Button>
            </div>
          </div>
        ))}
        
        {upcomingInterviews.length === 0 && (
          <div className="text-center py-8">
            <Terminal className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-mono">No scheduled interviews</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InterviewQueue;
