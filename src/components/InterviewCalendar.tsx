import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, User, Clock, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import InterviewManagementModal from "./InterviewManagementModal";
import { format, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from "date-fns";

type ViewMode = 'day' | 'week' | 'month';

const InterviewCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [interviews, setInterviews] = useState<any[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchInterviews = async () => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          candidates (
            id,
            name,
            position,
            email,
            skills
          )
        `)
        .in('status', ['scheduled', 'in_progress'])
        .order('scheduled_date');

      if (error) throw error;
      setInterviews(data || []);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      toast({
        title: "Error",
        description: "Failed to fetch interviews",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const getDaysInMonth = (date: Date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days = [];
    let currentDate = calendarStart;
    
    while (currentDate <= calendarEnd) {
      days.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    return days;
  };

  const getWeekDays = (date: Date) => {
    const weekStart = startOfWeek(date);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i));
    }
    return days;
  };

  const getInterviewsForDate = (date: Date) => {
    return interviews.filter(interview => {
      const interviewDate = new Date(interview.scheduled_date);
      return isSameDay(interviewDate, date);
    });
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
    switch (viewMode) {
      case 'day':
        return format(currentDate, 'PPPP');
      case 'week':
        const weekDays = getWeekDays(currentDate);
        return `${format(weekDays[0], 'MMM d')} - ${format(weekDays[6], 'MMM d, yyyy')}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      default:
        return '';
    }
  };

  const handleInterviewClick = (interview: any) => {
    setSelectedInterview(interview);
    setIsManagementModalOpen(true);
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const currentMonth = currentDate.getMonth();

    return (
      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayInterviews = getInterviewsForDate(day);
            const isCurrentMonth = day.getMonth() === currentMonth;
            const isToday = isSameDay(day, new Date());
            
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
                      onClick={() => handleInterviewClick(interview)}
                    >
                      <div className="flex items-center space-x-1 mb-1">
                        <User className="h-2 w-2 text-accent" />
                        <span className="text-accent font-medium truncate text-[10px]">
                          {interview.candidates?.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-2 w-2 text-muted-foreground" />
                        <span className="text-muted-foreground text-[10px]">
                          {format(new Date(interview.scheduled_date), 'h:mm a')}
                        </span>
                      </div>
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
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigate('prev')} className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium text-foreground min-w-[200px] text-center">
                {getDateRangeText()}
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('next')} className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading interviews...</p>
            </div>
          </div>
        ) : (
          renderMonthView()
        )}
        
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-accent/20 border border-accent/30 rounded"></div>
              <span>Scheduled Interview</span>
            </div>
          </div>
          <span>{interviews.length} interviews scheduled</span>
        </div>
      </CardContent>

      {selectedInterview && (
        <InterviewManagementModal
          isOpen={isManagementModalOpen}
          onClose={() => {
            setIsManagementModalOpen(false);
            setSelectedInterview(null);
            fetchInterviews();
          }}
          interview={selectedInterview}
          candidate={selectedInterview.candidates}
        />
      )}
    </Card>
  );
};

export default InterviewCalendar;