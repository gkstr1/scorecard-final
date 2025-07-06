
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User } from "lucide-react";

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Interview Queue</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingInterviews.map((interview) => (
          <div
            key={interview.id}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-sm">{interview.candidateName}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{interview.position}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {interview.type}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{interview.time}</span>
              </div>
              <span>{interview.duration}</span>
            </div>
            
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="text-xs">
                Prepare Questions
              </Button>
              <Button size="sm" className="text-xs">
                Start Interview
              </Button>
            </div>
          </div>
        ))}
        
        {upcomingInterviews.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No upcoming interviews</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InterviewQueue;
