
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Zap, Play } from "lucide-react";

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
        <CardTitle className="flex items-center space-x-2 text-lg text-foreground">
          <Calendar className="h-5 w-5 text-primary" />
          <span>Upcoming Interviews</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingInterviews.map((interview) => (
          <div
            key={interview.id}
            className="p-4 border border-border rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-sm text-foreground">{interview.candidateName}</span>
                </div>
                <p className="text-xs text-muted-foreground">{interview.position}</p>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-2 py-1 text-xs">
                {interview.type}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-3 w-3" />
                <span>{interview.time}</span>
              </div>
              <span>{interview.duration}</span>
            </div>
            
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 text-xs h-7">
                <Zap className="h-3 w-3 mr-1" />
                Generate Questions
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs h-7">
                <Play className="h-3 w-3 mr-1" />
                Start Interview
              </Button>
            </div>
          </div>
        ))}
        
        {upcomingInterviews.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No interviews scheduled</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InterviewQueue;
