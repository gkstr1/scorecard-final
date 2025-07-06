
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, User, Clock } from "lucide-react";

type ViewMode = 'day' | 'week' | 'month';

const InterviewCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  
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
    {
      id: 4,
      candidateName: "David Park",
      position: "UI/UX Designer",
      date: new Date(2025, 6, 6), // July 6, 2025
      time: "11:00 AM",
      type: "Portfolio Review",
      duration: "45 min",
    },
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getInterviewsForDate = (date: Date) => {
    return interviews.filter(interview => 
      interview.date.toDateString() === date.toDateString()
    );
  };

  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getDateRangeText = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } else if (viewMode === 'week') {
      const weekDays = getWeekDays(currentDate);
      const start = weekDays[0];
      const end = weekDays[6];
      if (start.getMonth() === end.getMonth()) {
        return `${monthNames[start.getMonth()]} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
      } else {
        return `${monthNames[start.getMonth()]} ${start.getDate()} - ${monthNames[end.getMonth()]} ${end.getDate()}, ${start.getFullYear()}`;
      }
    } else {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
  };

  const renderDayView = () => {
    const dayInterviews = getInterviewsForDate(currentDate);
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    return (
      <div className="space-y-2">
        <div className="grid grid-cols-1 gap-1">
          {hours.map(hour => (
            <div key={hour} className="flex border-b border-border py-2">
              <div className="w-16 text-xs text-muted-foreground text-right pr-4">
                {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
              </div>
              <div className="flex-1 min-h-[40px] relative">
                {dayInterviews
                  .filter(interview => {
                    const interviewHour = parseInt(interview.time.split(':')[0]);
                    const isPM = interview.time.includes('PM');
                    const hour24 = isPM && interviewHour !== 12 ? interviewHour + 12 : interviewHour;
                    return hour24 === hour;
                  })
                  .map(interview => (
                    <div
                      key={interview.id}
                      className="bg-accent/20 border border-accent/30 rounded p-2 mb-1 hover:bg-accent/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <User className="h-3 w-3 text-accent" />
                          <span className="text-sm font-medium text-accent">{interview.candidateName}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">{interview.type}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{interview.position}</div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{interview.time} • {interview.duration}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    return (
      <div className="space-y-2">
        <div className="grid grid-cols-8 gap-1 mb-2">
          <div className="w-16"></div>
          {weekDays.map((day, index) => (
            <div key={index} className="text-center p-2">
              <div className="text-xs font-medium text-muted-foreground">{dayNamesShort[day.getDay()]}</div>
              <div className={`text-sm font-medium ${day.toDateString() === new Date().toDateString() ? 'text-primary' : 'text-foreground'}`}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>
        
        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-8 gap-1 border-b border-border py-1">
            <div className="w-16 text-xs text-muted-foreground text-right pr-4">
              {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
            </div>
            {weekDays.map((day, dayIndex) => {
              const dayInterviews = getInterviewsForDate(day).filter(interview => {
                const interviewHour = parseInt(interview.time.split(':')[0]);
                const isPM = interview.time.includes('PM');
                const hour24 = isPM && interviewHour !== 12 ? interviewHour + 12 : interviewHour;
                return hour24 === hour;
              });
              
              return (
                <div key={dayIndex} className="min-h-[30px] relative">
                  {dayInterviews.map(interview => (
                    <div
                      key={interview.id}
                      className="bg-accent/20 border border-accent/30 rounded p-1 text-xs hover:bg-accent/30 transition-colors cursor-pointer mb-1"
                    >
                      <div className="font-medium text-accent truncate">{interview.candidateName}</div>
                      <div className="text-muted-foreground">{interview.time}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const currentMonth = currentDate.getMonth();

    return (
      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNamesShort.map(day => (
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
      </div>
    );
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg text-foreground">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Interview Calendar</span>
          </CardTitle>
          
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(mode)}
                  className={`h-7 px-3 text-xs capitalize ${
                    viewMode === mode ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                  }`}
                >
                  {mode}
                </Button>
              ))}
            </div>
            
            {/* Navigation */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('prev')}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium text-foreground min-w-[200px] text-center">
                {getDateRangeText()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('next')}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && renderMonthView()}
        
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
          <span>{interviews.length} interviews this {viewMode === 'day' ? 'day' : viewMode === 'week' ? 'week' : 'month'}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewCalendar;
