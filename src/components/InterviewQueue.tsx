
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Zap, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, isToday, isTomorrow } from "date-fns";
import InterviewManagementModal from "./InterviewManagementModal";

const InterviewQueue = () => {
  const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUpcomingInterviews();
  }, []);

  const fetchUpcomingInterviews = async () => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          candidates (
            name,
            position
          )
        `)
        .in('status', ['scheduled', 'in_progress'])
        .gte('scheduled_date', new Date().toISOString())
        .order('scheduled_date', { ascending: true })
        .limit(10);

      if (error) throw error;

      const formattedInterviews = data?.map(interview => ({
        id: interview.id,
        candidateName: interview.candidates?.name || 'Unknown',
        position: interview.candidates?.position || 'Unknown Position',
        time: formatInterviewTime(interview.scheduled_date),
        type: interview.meeting_type === 'video_call' ? 'Technical' : interview.meeting_type || 'Technical',
        duration: `${interview.duration_minutes || 60} min`,
        rawDate: interview.scheduled_date,
        fullInterview: interview,
        candidate: interview.candidates
      })) || [];

      setUpcomingInterviews(formattedInterviews);
    } catch (error) {
      console.error('Error fetching upcoming interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatInterviewTime = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow, ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  const handleStartInterview = (interview: any) => {
    setSelectedInterview(interview.fullInterview);
    setSelectedCandidate(interview.candidate);
    setIsModalOpen(true);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg text-foreground">
          <Calendar className="h-5 w-5 text-primary" />
          <span>Upcoming Interviews</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-3 animate-pulse" />
            <p className="text-sm text-muted-foreground">Loading interviews...</p>
          </div>
        ) : upcomingInterviews.map((interview) => (
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
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-xs h-7"
                onClick={() => handleStartInterview(interview)}
              >
                <Play className="h-3 w-3 mr-1" />
                Start Interview
              </Button>
            </div>
          </div>
        ))}
        
        {!loading && upcomingInterviews.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No interviews scheduled</p>
          </div>
        )}
      </CardContent>
      
      {selectedInterview && selectedCandidate && (
        <InterviewManagementModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedInterview(null);
            setSelectedCandidate(null);
          }}
          interview={selectedInterview}
          candidate={selectedCandidate}
        />
      )}
    </Card>
  );
};

export default InterviewQueue;
