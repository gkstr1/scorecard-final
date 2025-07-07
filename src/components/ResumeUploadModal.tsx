
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, FileText, Loader2, Briefcase, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

interface Job {
  id: string;
  title: string;
  department: string | null;
}

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCandidateCreated?: () => void;
}

const ResumeUploadModal = ({ isOpen, onClose, onCandidateCreated }: ResumeUploadModalProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
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
        .select("id, title, department")
        .eq("is_active", true)
        .order("title");

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load job positions",
        variant: "destructive"
      });
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const extractTextFromDOCX = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Use mammoth to extract text from DOCX
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error("Error parsing DOCX:", error);
      toast({
        title: "DOCX parsing failed",
        description: "Please copy and paste the text from your document into the text area below",
        variant: "destructive"
      });
      throw new Error("Failed to extract text from DOCX file. Please copy and paste the text manually.");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      let extractedText = "";

      if (file.type === "text/plain") {
        extractedText = await file.text();
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        extractedText = await extractTextFromDOCX(file);
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a text file (.txt) or Word document (.docx)",
          variant: "destructive"
        });
        return;
      }

      setResumeText(extractedText);
      
      toast({
        title: "File uploaded successfully",
        description: "Resume text has been extracted and is ready for parsing"
      });

    } catch (error) {
      console.error("Error reading file:", error);
      // Don't show error toast here since we already show specific ones above
    } finally {
      setIsUploading(false);
    }
  };

  const parseAndCreateCandidate = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "Error",
        description: "Please provide resume text to parse",
        variant: "destructive"
      });
      return;
    }

    if (!selectedJobId) {
      toast({
        title: "Error",
        description: "Please select a job position for this candidate",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const selectedJob = jobs.find(job => job.id === selectedJobId);
      
      // Parse the resume
      const { data: parseData, error: parseError } = await supabase.functions.invoke('parse-resume', {
        body: {
          resumeText: resumeText,
          jobPosition: selectedJob?.title || "Software Developer"
        }
      });

      if (parseError) throw parseError;

      if (!parseData?.parsedData) {
        throw new Error("No parsed data received");
      }

      const parsedData = parseData.parsedData;

      // Create candidate with parsed data
      const skillsArray = parsedData.skills || [];
      
      const { error: insertError } = await supabase
        .from("candidates")
        .insert({
          name: parsedData.name || "Unknown",
          email: parsedData.email || "",
          position: selectedJob?.title || "Software Developer",
          phone: parsedData.phone || null,
          location: parsedData.location || null,
          linkedin_url: parsedData.linkedin_url || null,
          github_url: parsedData.github_url || null,
          portfolio_url: parsedData.portfolio_url || null,
          skills: skillsArray,
          experience_years: parsedData.experience_years || null,
          education: parsedData.education || null,
          current_company: parsedData.work_experience?.[0]?.company || null,
          current_salary: null,
          expected_salary: null,
          role_category: "frontend", // You might want to determine this from the job
          status: "applied",
          resume_parsed_data: parsedData,
          resume_summary: parsedData.summary || null,
          key_achievements: parsedData.achievements || null,
          work_experience: parsedData.work_experience || null,
          certifications: parsedData.certifications || null
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: `Candidate ${parsedData.name} has been created and assigned to ${selectedJob?.title}!`
      });

      // Reset form and close modal
      setResumeText("");
      setSelectedJobId("");
      onClose();
      
      // Notify parent component
      if (onCandidateCreated) {
        onCandidateCreated();
      }

    } catch (error) {
      console.error("Error processing resume:", error);
      toast({
        title: "Error",
        description: "Failed to process resume and create candidate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-6 w-6 text-primary" />
            Upload Resume & Create Candidate
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Job Selection */}
          <div className="space-y-4">
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Select Job Position</h3>
                  </div>
                  
                  <div>
                    <Label htmlFor="job-selection" className="text-sm font-medium">
                      Available Positions *
                    </Label>
                    <Select value={selectedJobId} onValueChange={setSelectedJobId} disabled={isLoadingJobs}>
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue placeholder={isLoadingJobs ? "Loading positions..." : "Choose a job position"} />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {jobs.length === 0 && !isLoadingJobs ? (
                          <div className="p-4 text-center text-muted-foreground">
                            <AlertCircle className="h-4 w-4 mx-auto mb-2" />
                            <p className="text-sm">No active job positions found</p>
                          </div>
                        ) : (
                          jobs.map((job) => (
                            <SelectItem key={job.id} value={job.id} className="p-3">
                              <div className="flex flex-col items-start">
                                <div className="flex items-center gap-2">
                                  <Briefcase className="h-4 w-4 text-primary" />
                                  <span className="font-medium">{job.title}</span>
                                </div>
                                {job.department && (
                                  <span className="text-xs text-muted-foreground mt-1">
                                    Department: {job.department}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      The candidate will be assigned to this position
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - File Upload */}
          <div className="space-y-4">
            <Card className="border-accent/20">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Upload className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold text-foreground">Upload Resume File</h3>
                  </div>
                  
                  <div>
                    <Label htmlFor="resume-file" className="text-sm font-medium">
                      Choose File
                    </Label>
                    <Input
                      id="resume-file"
                      type="file"
                      accept=".txt,.docx"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="mt-2 h-12"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Supports .txt and .docx files. For PDF files, copy and paste text below.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resume Text Area - Full Width */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or paste resume text</span>
            </div>
          </div>

          <div>
            <Label htmlFor="resume-text" className="text-sm font-medium">
              Resume Content
            </Label>
            <textarea
              id="resume-text"
              className="w-full min-h-[200px] mt-2 p-4 border border-input rounded-lg resize-none text-sm"
              placeholder="Paste resume content here or upload a file above..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              disabled={isUploading}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Button 
            onClick={parseAndCreateCandidate} 
            disabled={isUploading || !resumeText.trim() || !selectedJobId}
            className="min-w-[200px] h-12"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing Resume...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Parse Resume & Create Candidate
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeUploadModal;
