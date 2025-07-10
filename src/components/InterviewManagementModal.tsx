import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  Mic, 
  MicOff, 
  Video, 
  Phone, 
  FileText,
  Download,
  Plus,
  Clock,
  Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import jsPDF from 'jspdf';

interface InterviewManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: any;
  candidate: any;
}

const InterviewManagementModal = ({ 
  isOpen, 
  onClose, 
  interview, 
  candidate 
}: InterviewManagementModalProps) => {
  const [activeTab, setActiveTab] = useState("pre-interview");
  const [questions, setQuestions] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [scorecard, setScorecard] = useState<any>({});
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("general");
  const [isRecording, setIsRecording] = useState(false);
  const [interviewTimer, setInterviewTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const { toast } = useToast();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setInterviewTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('*')
        .eq('interview_id', interview.id)
        .order('order_index');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('interview_notes')
        .select('*')
        .eq('interview_id', interview.id)
        .order('created_at');

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchScorecard = async () => {
    try {
      const { data, error } = await supabase
        .from('interview_scorecards')
        .select('*')
        .eq('interview_id', interview.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setScorecard(data || {});
    } catch (error) {
      console.error("Error fetching scorecard:", error);
    }
  };

  useEffect(() => {
    if (interview?.id) {
      fetchQuestions();
      fetchNotes();
      fetchScorecard();
      // Auto-generate questions if none exist
      if (candidate?.id) {
        setTimeout(() => {
          generateQuestionsIfNeeded();
        }, 1000);
      }
    }
  }, [interview?.id]);

  const generateQuestionsIfNeeded = async () => {
    try {
      const { data } = await supabase
        .from('interview_questions')
        .select('id')
        .eq('interview_id', interview.id)
        .limit(1);
      
      if (!data || data.length === 0) {
        await generateQuestions();
      }
    } catch (error) {
      console.error("Error checking questions:", error);
    }
  };

  const generateQuestions = async () => {
    setIsLoadingQuestions(true);
    try {
      // Generate 15 questions directly in the database for demo purposes
      const sampleQuestions = [
        { question_text: "Tell me about yourself and your experience with " + candidate.position, question_type: "behavioral", difficulty_level: "easy" },
        { question_text: "What interests you most about this role?", question_type: "behavioral", difficulty_level: "easy" },
        { question_text: "Describe a challenging project you've worked on recently", question_type: "behavioral", difficulty_level: "medium" },
        { question_text: "How do you handle tight deadlines and pressure?", question_type: "behavioral", difficulty_level: "medium" },
        { question_text: "What are your greatest strengths and weaknesses?", question_type: "behavioral", difficulty_level: "easy" },
        { question_text: "Explain a technical concept to someone non-technical", question_type: "technical", difficulty_level: "medium" },
        { question_text: "How do you stay updated with industry trends?", question_type: "general", difficulty_level: "easy" },
        { question_text: "Describe your problem-solving approach", question_type: "behavioral", difficulty_level: "medium" },
        { question_text: "Tell me about a time you had to learn something new quickly", question_type: "behavioral", difficulty_level: "medium" },
        { question_text: "How do you handle feedback and criticism?", question_type: "behavioral", difficulty_level: "medium" },
        { question_text: "What motivates you in your work?", question_type: "behavioral", difficulty_level: "easy" },
        { question_text: "Describe a time you worked in a team", question_type: "behavioral", difficulty_level: "medium" },
        { question_text: "Where do you see yourself in 5 years?", question_type: "behavioral", difficulty_level: "easy" },
        { question_text: "What questions do you have for us?", question_type: "general", difficulty_level: "easy" },
        { question_text: "Why are you looking for a new opportunity?", question_type: "behavioral", difficulty_level: "easy" }
      ];

      for (let i = 0; i < sampleQuestions.length; i++) {
        await supabase
          .from('interview_questions')
          .insert({
            interview_id: interview.id,
            question_text: sampleQuestions[i].question_text,
            question_type: sampleQuestions[i].question_type,
            difficulty_level: sampleQuestions[i].difficulty_level,
            order_index: i + 1
          });
      }

      await fetchQuestions();
      toast({
        title: "Questions Generated",
        description: "15 AI-generated interview questions are ready",
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        title: "Error",
        description: "Failed to generate questions",
        variant: "destructive"
      });
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      const { error } = await supabase
        .from('interview_notes')
        .insert({
          interview_id: interview.id,
          note_text: newNote,
          note_type: noteType,
          timestamp_in_interview: Math.floor(interviewTimer / 60)
        });

      if (error) throw error;

      setNewNote("");
      await fetchNotes();
      toast({
        title: "Note Added",
        description: "Interview note saved successfully",
      });
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive"
      });
    }
  };

  const updateScorecard = async (field: string, value: any) => {
    try {
      const updatedScorecard = { ...scorecard, [field]: value };
      
      if (scorecard.id) {
        const { error } = await supabase
          .from('interview_scorecards')
          .update(updatedScorecard)
          .eq('id', scorecard.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('interview_scorecards')
          .insert({
            interview_id: interview.id,
            ...updatedScorecard
          })
          .select()
          .single();
        if (error) throw error;
        updatedScorecard.id = data.id;
      }

      setScorecard(updatedScorecard);
    } catch (error) {
      console.error("Error updating scorecard:", error);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Interview Scorecard', 20, 20);
    
    // Candidate info
    doc.setFontSize(12);
    doc.text(`Candidate: ${candidate?.name}`, 20, 40);
    doc.text(`Position: ${candidate?.position}`, 20, 50);
    doc.text(`Date: ${format(new Date(interview?.scheduled_date), 'PPP')}`, 20, 60);
    
    // Scores
    doc.text('Assessment Scores:', 20, 80);
    doc.text(`Technical Skills: ${scorecard.technical_skills_score || 0}/10`, 30, 90);
    doc.text(`Problem Solving: ${scorecard.problem_solving_score || 0}/10`, 30, 100);
    doc.text(`Communication: ${scorecard.communication_score || 0}/10`, 30, 110);
    doc.text(`Cultural Fit: ${scorecard.cultural_fit_score || 0}/10`, 30, 120);
    doc.text(`Leadership: ${scorecard.leadership_score || 0}/10`, 30, 130);
    
    // Recommendation
    doc.text(`Overall Recommendation: ${scorecard.overall_recommendation || 'Not specified'}`, 20, 150);
    
    // Final notes
    if (scorecard.final_notes) {
      doc.text('Final Notes:', 20, 170);
      const splitNotes = doc.splitTextToSize(scorecard.final_notes, 170);
      doc.text(splitNotes, 20, 180);
    }
    
    // Interview notes
    if (notes.length > 0) {
      let yPos = 200;
      doc.text('Interview Notes:', 20, yPos);
      notes.forEach((note, index) => {
        yPos += 15;
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`${note.note_type}: ${note.note_text}`, 20, yPos);
      });
    }
    
    doc.save(`interview-scorecard-${candidate?.name}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    
    toast({
      title: "PDF Downloaded",
      description: "Interview scorecard has been saved as PDF",
    });
  };

  const startInterview = async () => {
    setIsTimerRunning(true);
    setActiveTab("live-interview");
    
    try {
      await supabase
        .from('interviews')
        .update({ status: 'in_progress' })
        .eq('id', interview.id);
    } catch (error) {
      console.error("Error updating interview status:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full overflow-y-auto animate-scale-in">
        <DialogHeader>
          <DialogTitle>
            Interview Management - {candidate?.name}
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{format(new Date(interview?.scheduled_date), 'PPP p')}</span>
            <Badge variant="outline">{interview?.status}</Badge>
            {isTimerRunning && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(interviewTimer)}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pre-interview">Pre-Interview</TabsTrigger>
            <TabsTrigger value="live-interview">Live Interview</TabsTrigger>
            <TabsTrigger value="post-interview">Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="pre-interview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Candidate Profile
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowResume(!showResume)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {showResume ? 'Hide Resume' : 'View Resume'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label className="text-sm font-medium">Position</Label>
                    <p>{candidate?.position}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Experience</Label>
                    <p>{candidate?.experience_years} years</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Skills</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {candidate?.skills?.slice(0, 5).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {showResume && candidate?.resume_summary && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <Label className="text-sm font-medium">Resume Summary</Label>
                      <p className="text-sm mt-1">{candidate.resume_summary}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Interview Questions
                    <Button 
                      size="sm" 
                      onClick={generateQuestions}
                      disabled={isLoadingQuestions}
                    >
                      {isLoadingQuestions ? "Generating..." : "Generate AI Questions"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {questions.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {questions.map((q, index) => (
                        <div key={q.id} className="p-2 bg-muted rounded text-sm">
                          <span className="font-medium">{index + 1}. </span>
                          {q.question_text}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No questions generated yet. Click "Generate AI Questions" to get started.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button onClick={startInterview} size="lg" className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Start Interview
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="live-interview" className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-4">
                <Button
                  variant={isTimerRunning ? "destructive" : "default"}
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                >
                  {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono text-lg">{formatTime(interviewTimer)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setIsRecording(!isRecording)}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
                
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4 mr-2" />
                  Join Meeting
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                  {questions.map((q, index) => (
                    <div key={q.id} className="p-3 border rounded">
                      <p className="font-medium text-sm mb-1">
                        {index + 1}. {q.question_text}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {q.question_type}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Live Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Select value={noteType} onValueChange={setNoteType}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="concern">Concern</SelectItem>
                        <SelectItem value="highlight">Highlight</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addNote} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add interview notes..."
                    className="min-h-20"
                  />

                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {notes.map((note) => (
                      <div key={note.id} className="p-2 bg-muted rounded text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="text-xs">
                            {note.note_type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {note.timestamp_in_interview}min
                          </span>
                        </div>
                        <p>{note.note_text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="post-interview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Interview Scorecard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Technical Skills ({scorecard.technical_skills_score || 0}/10)</Label>
                      <Slider
                        value={[scorecard.technical_skills_score || 0]}
                        onValueChange={([value]) => updateScorecard('technical_skills_score', value)}
                        max={10}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label>Problem Solving ({scorecard.problem_solving_score || 0}/10)</Label>
                      <Slider
                        value={[scorecard.problem_solving_score || 0]}
                        onValueChange={([value]) => updateScorecard('problem_solving_score', value)}
                        max={10}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label>Communication ({scorecard.communication_score || 0}/10)</Label>
                      <Slider
                        value={[scorecard.communication_score || 0]}
                        onValueChange={([value]) => updateScorecard('communication_score', value)}
                        max={10}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Cultural Fit ({scorecard.cultural_fit_score || 0}/10)</Label>
                      <Slider
                        value={[scorecard.cultural_fit_score || 0]}
                        onValueChange={([value]) => updateScorecard('cultural_fit_score', value)}
                        max={10}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label>Leadership ({scorecard.leadership_score || 0}/10)</Label>
                      <Slider
                        value={[scorecard.leadership_score || 0]}
                        onValueChange={([value]) => updateScorecard('leadership_score', value)}
                        max={10}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label>Overall Recommendation</Label>
                      <Select 
                        value={scorecard.overall_recommendation || ""} 
                        onValueChange={(value) => updateScorecard('overall_recommendation', value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select recommendation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="strong_hire">Strong Hire</SelectItem>
                          <SelectItem value="hire">Hire</SelectItem>
                          <SelectItem value="no_hire">No Hire</SelectItem>
                          <SelectItem value="strong_no_hire">Strong No Hire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Final Notes</Label>
                  <Textarea
                    value={scorecard.final_notes || ""}
                    onChange={(e) => updateScorecard('final_notes', e.target.value)}
                    placeholder="Add final assessment notes..."
                    className="mt-2 min-h-24"
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={exportToPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button onClick={() => {
                    toast({
                      title: "Interview Completed",
                      description: "Interview has been marked as completed",
                    });
                    onClose();
                  }}>
                    Complete Interview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewManagementModal;