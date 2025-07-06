
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, User, Clock } from "lucide-react";

const InterviewCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Sample interview data - in a real app, this would come from props or API
  const interviews = [
    {
      id: 1,
      candidateName: "Sarah Chen",
      position: "Senior React Developer",
      date: new Date(2025, 6, 6), // July 6, 2025
      time: "2:00 PM",
      type: "Technical",
      duration: "60 min",
    },
    {
      id: 2,
      candidateName: "Michael Rodriguez",
      position: "Full Stack Engineer",
      date: new Date(2025, 6, 7), // July 7, 2025
      time: "10:00 AM",
      type: "Technical",
      duration: "45 min",
    },
    {
      id: 3,
      candidateName: "Emily Johnson",
      position: "Frontend Developer",
      date: new Date(2025, 6, 8), // July 8, 2025
      time: "3:00 PM",
      type: "Final",
      duration: "30 min",
    },
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getInterviewsForDate = (date: Date) => {
    return interviews.filter(interview => 
      interview.date.toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);
  const currentMonth = currentDate.getMonth();

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg text-foreground">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Interview Calendar</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium text-foreground min-w-[120px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayInterviews = getInterviewsForDate(day);
            const isCurrentMonth = day.getMonth() === currentMonth;
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`
                  min-h-[80px] p-1 border border-border rounded-md transition-colors hover:bg-muted/30
                  ${!isCurrentMonth ? 'opacity-40' : ''}
                  ${isToday ? 'bg-primary/10 border-primary/30' : 'bg-background'}
                `}
              >
                <div className={`text-xs font-medium mb-1 ${isToday ? 'text-primary' : 'text-foreground'}`}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayInterviews.slice(0, 2).map(interview => (
                    <div
                      key={interview.id}
                      className="bg-accent/20 border border-accent/30 rounded p-1 text-xs hover:bg-accent/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-1 mb-1">
                        <User className="h-2 w-2 text-accent" />
                        <span className="text-accent font-medium truncate text-[10px]">
                          {interview.candidateName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-2 w-2 text-muted-foreground" />
                        <span className="text-muted-foreground text-[10px]">
                          {interview.time}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-[9px] px-1 py-0 mt-1">
                        {interview.type}
                      </Badge>
                    </div>
                  ))}
                  
                  {dayInterviews.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayInterviews.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-accent/20 border border-accent/30 rounded"></div>
              <span>Scheduled Interview</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-primary/10 border border-primary/30 rounded"></div>
              <span>Today</span>
            </div>
          </div>
          <span>{interviews.length} interviews this month</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewCalendar;
