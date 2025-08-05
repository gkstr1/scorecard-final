import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, MapPin, DollarSign, Users, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  description: string;
  department: string;
  experience_level: string;
  salary_range_min?: number;
  salary_range_max?: number;
  required_skills: string[];
  remote_friendly: boolean;
  client_id?: string;
  clients?: {
    name: string;
    location?: string;
  };
}

interface SourcingCandidate {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  skills: string[];
  education: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  matchScore: number;
  openToWork: boolean;
  avatar?: string;
}

interface JobSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: SourcingCandidate;
  onCandidateAdded?: () => void;
}

const JobSelectionModal = ({ isOpen, onClose, candidate, onCandidateAdded }: JobSelectionModalProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchJobs();
    }
  }, [isOpen]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("job_descriptions")
        .select(`
          id,
          title,
          description,
          department,
          experience_level,
          salary_range_min,
          salary_range_max,
          required_skills,
          remote_friendly,
          client_id,
          clients (
            name,
            location
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCandidate = async () => {
    if (!selectedJobId) {
      toast({
        title: "Job Required",
        description: "Please select a job to add the candidate to",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    try {
      const candidateData = {
        name: candidate.name,
        email: candidate.email || "",
        position: candidate.title,
        phone: candidate.phone,
        location: candidate.location,
        linkedin_url: candidate.linkedinUrl,
        skills: candidate.skills,
        education: candidate.education,
        current_company: candidate.company,
        job_id: selectedJobId,
        status: "sourced",
        role_category: "sourced",
        experience_years: parseInt(candidate.experience.replace(/[^\d]/g, "")) || 0,
      };

      const { error } = await supabase
        .from("candidates")
        .insert(candidateData);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${candidate.name} has been added to the candidate pipeline`,
      });

      onCandidateAdded?.();
      onClose();
    } catch (error) {
      console.error("Error adding candidate:", error);
      toast({
        title: "Error",
        description: "Failed to add candidate",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const calculateMatchScore = (job: Job) => {
    const candidateSkills = candidate.skills.map(s => s.toLowerCase());
    const jobSkills = job.required_skills?.map(s => s.toLowerCase()) || [];
    const matchingSkills = candidateSkills.filter(skill => 
      jobSkills.some(jobSkill => jobSkill.includes(skill) || skill.includes(jobSkill))
    );
    return Math.round((matchingSkills.length / Math.max(jobSkills.length, 1)) * 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-bold">Add {candidate.name} to Job</h2>
              <p className="text-sm text-muted-foreground">{candidate.title} at {candidate.company}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Select a job position to add this candidate to your pipeline:
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
              {jobs.map((job) => {
                const matchScore = calculateMatchScore(job);
                const isSelected = selectedJobId === job.id;
                
                return (
                  <Card 
                    key={job.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? "ring-2 ring-primary border-primary" : ""
                    }`}
                    onClick={() => setSelectedJobId(job.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{job.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            {job.clients && (
                              <div className="flex items-center space-x-1">
                                <Building2 className="h-3 w-3" />
                                <span>{job.clients.name}</span>
                              </div>
                            )}
                            {job.clients?.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{job.clients.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={matchScore >= 70 ? "default" : matchScore >= 50 ? "secondary" : "outline"}>
                            {matchScore}% match
                          </Badge>
                          {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">{job.department}</Badge>
                          <Badge variant="outline">{job.experience_level}</Badge>
                          {job.remote_friendly && (
                            <Badge variant="outline">Remote</Badge>
                          )}
                        </div>
                        {job.salary_range_min && job.salary_range_max && (
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <DollarSign className="h-3 w-3" />
                            <span>${job.salary_range_min.toLocaleString()} - ${job.salary_range_max.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      
                      {job.required_skills && job.required_skills.length > 0 && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {job.required_skills.slice(0, 6).map((skill, index) => {
                              const hasSkill = candidate.skills.some(cs => 
                                cs.toLowerCase().includes(skill.toLowerCase()) || 
                                skill.toLowerCase().includes(cs.toLowerCase())
                              );
                              return (
                                <Badge 
                                  key={index} 
                                  variant={hasSkill ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              );
                            })}
                            {job.required_skills.length > 6 && (
                              <Badge variant="outline" className="text-xs">
                                +{job.required_skills.length - 6} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {jobs.length === 0 && !isLoading && (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Jobs</h3>
                <p className="text-muted-foreground">
                  Create a job posting first before adding candidates.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddCandidate}
              disabled={!selectedJobId || isAdding}
            >
              {isAdding ? "Adding..." : "Add to Pipeline"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobSelectionModal;