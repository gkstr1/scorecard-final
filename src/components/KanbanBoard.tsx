
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { User, Mail, Calendar, Zap, Eye, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import CandidateProfileModal from "./CandidateProfileModal";
import InterviewSchedulingModal from "./InterviewSchedulingModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface KanbanBoardProps {
  selectedRole: string;
  onAddCandidate: () => void;
}

const KanbanBoard = ({ selectedRole, onAddCandidate }: KanbanBoardProps) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [candidateToSchedule, setCandidateToSchedule] = useState(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Sample job description for skill matching
  const sampleJobDescription = {
    title: "Senior Full Stack Developer",
    required_skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Python"],
    preferred_skills: ["AWS", "Docker", "GraphQL"],
    experience_level: "Senior",
    salary_range_min: 80000,
    salary_range_max: 120000,
  };

  const columns = [
    {
      id: "applied",
      title: "Applied",
      color: "bg-blue-500/10 border-blue-500/30",
    },
    {
      id: "sourced",
      title: "Sourced",
      color: "bg-gray-500/10 border-gray-500/30",
    },
    {
      id: "technical_interview",
      title: "Technical Interview",
      color: "bg-purple-500/10 border-purple-500/30",
    },
    {
      id: "submitted",
      title: "Submitted",
      color: "bg-yellow-500/10 border-yellow-500/30",
    },
    {
      id: "hired",
      title: "Hired",
      color: "bg-green-500/10 border-green-500/30",
    },
    {
      id: "rejected",
      title: "Rejected",
      color: "bg-red-500/10 border-red-500/30",
    },
  ];

  const fetchCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      
      setCandidates(data || []);
      console.log("Fetched candidates:", data?.length || 0);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch candidates",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const filteredCandidates = selectedRole && selectedRole !== "" 
    ? candidates.filter(candidate => candidate.job_id === selectedRole)
    : candidates;

  const getCandidatesByStatus = (status: string) => {
    return filteredCandidates.filter(candidate => candidate.status === status);
  };

  const handleViewCandidate = (candidate: any) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const candidateId = draggableId;
    const newStatus = destination.droppableId === "technical_interview" ? "technical_interview" : destination.droppableId;
    const candidate = candidates.find(c => c.id === candidateId);

    try {
      // Handle moving away from technical_interview - cancel scheduled interviews
      if (source.droppableId === "technical_interview" && newStatus !== "technical_interview") {
        const { error: cancelError } = await supabase
          .from("interviews")
          .update({ status: "cancelled" })
          .eq("candidate_id", candidateId)
          .eq("status", "scheduled");

        if (cancelError) {
          console.error("Error cancelling interviews:", cancelError);
        }
      }

      const { error } = await supabase
        .from("candidates")
        .update({ status: newStatus })
        .eq("id", candidateId);

      if (error) throw error;

      // Update local state
      setCandidates(prev => 
        prev.map(candidate => 
          candidate.id === candidateId 
            ? { ...candidate, status: newStatus }
            : candidate
        )
      );

      // If moving TO technical_interview, trigger scheduling modal
      if (newStatus === "technical_interview" && source.droppableId !== "technical_interview") {
        setCandidateToSchedule(candidate);
        setIsSchedulingModalOpen(true);
      }

      toast({
        title: "Success",
        description: `Candidate moved to ${destination.droppableId.replace("_", " ")}`,
      });
    } catch (error) {
      console.error("Error updating candidate status:", error);
      toast({
        title: "Error",
        description: "Failed to update candidate status",
        variant: "destructive"
      });
    }
  };

  const handleInterviewScheduled = () => {
    setIsSchedulingModalOpen(false);
    setCandidateToSchedule(null);
    toast({
      title: "Interview Scheduled",
      description: "Interview has been scheduled and will appear in the Interview Center",
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <div className="text-center">Loading candidates...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center justify-between">
        <h2 className="text-lg font-semibold">Candidates Pipeline</h2>
        <Button onClick={onAddCandidate} className="mb-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Candidate
        </Button>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 min-h-[500px] pb-4">
            {columns.map((column) => {
              const columnCandidates = getCandidatesByStatus(column.id);
              
              return (
                <div key={column.id} className="flex-shrink-0 w-72 space-y-3">
                  <Card className={`${column.color} border-2`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between text-sm">
                        <span className="text-foreground truncate">{column.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {columnCandidates.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-[400px] p-2 rounded-lg transition-colors ${
                          snapshot.isDraggingOver ? 'bg-muted/20' : ''
                        }`}
                      >
                        {columnCandidates.map((candidate, index) => (
                          <Draggable key={candidate.id} draggableId={candidate.id} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-card border-border hover:border-primary/30 transition-all duration-200 cursor-pointer ${
                                  snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                                }`}
                              >
                                <CardContent className="p-3">
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <div className="h-6 w-6 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center flex-shrink-0">
                                        <User className="h-3 w-3 text-primary" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-foreground text-xs truncate">{candidate.name}</h4>
                                        <p className="text-xs text-muted-foreground truncate">{candidate.position}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="text-xs text-muted-foreground flex items-center space-x-1">
                                      <Mail className="h-3 w-3 flex-shrink-0" />
                                      <span className="truncate">{candidate.email}</span>
                                    </div>
                                    
                                    <div className="text-xs text-muted-foreground flex items-center space-x-1">
                                      <Calendar className="h-3 w-3 flex-shrink-0" />
                                      <span>Applied {new Date(candidate.applied_date).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                      {candidate.skills?.slice(0, 2).map((skill: string) => (
                                        <Badge key={skill} variant="secondary" className="text-xs bg-secondary/50 text-foreground border-border px-1 py-0">
                                          {skill}
                                        </Badge>
                                      ))}
                                      {candidate.skills?.length > 2 && (
                                        <Badge variant="secondary" className="text-xs bg-secondary/50 text-foreground border-border px-1 py-0">
                                          +{candidate.skills.length - 2}
                                        </Badge>
                                      )}
                                    </div>

                                    <div className="flex space-x-1 pt-1">
                                      {column.id === "technical_interview" && (
                                        <Button size="sm" variant="outline" className="text-xs bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 h-6 px-2">
                                          <Zap className="h-2 w-2 mr-1" />
                                          Questions
                                        </Button>
                                      )}
                                      <Button 
                                        size="sm" 
                                        className="text-xs h-6 px-2"
                                        onClick={() => handleViewCandidate(candidate)}
                                      >
                                        <Eye className="h-2 w-2 mr-1" />
                                        View
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        <Card className="bg-muted/20 border-dashed border-2 border-muted-foreground/30 hover:border-primary/50 transition-colors cursor-pointer" onClick={onAddCandidate}>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <Plus className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                              <p className="text-xs text-muted-foreground">Add candidate</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DragDropContext>

      <CandidateProfileModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobDescription={sampleJobDescription}
      />
      
      <InterviewSchedulingModal
        isOpen={isSchedulingModalOpen}
        onClose={() => setIsSchedulingModalOpen(false)}
        candidate={candidateToSchedule}
        onInterviewScheduled={handleInterviewScheduled}
      />
    </div>
  );
};

export default KanbanBoard;
