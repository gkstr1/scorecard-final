
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Loader2, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: string;
  title: string;
  department: string | null;
}

interface ResumeUploadProps {
  onCandidateCreated?: () => void;
}

const ResumeUpload = ({ onCandidateCreated }: ResumeUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      if (file.type === "text/plain") {
        const text = await file.text();
        setResumeText(text);
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a text file (.txt). PDF support coming soon!",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error reading file:", error);
      toast({
        title: "Error",
        description: "Failed to read the file",
        variant: "destructive"
      });
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

      // Reset form
      setResumeText("");
      setSelectedJobId("");
      
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resume Parser & Candidate Creator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="job-selection">Select Job Position *</Label>
          <Select value={selectedJobId} onValueChange={setSelectedJobId} disabled={isLoadingJobs}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={isLoadingJobs ? "Loading jobs..." : "Select a job position"} />
            </SelectTrigger>
            <SelectContent>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.title}</span>
                    {job.department && (
                      <span className="text-muted-foreground">({job.department})</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            This candidate will be assigned to the selected job position
          </p>
        </div>

        <div>
          <Label htmlFor="resume-file">Upload Resume File</Label>
          <Input
            id="resume-file"
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Currently supports .txt files. PDF support coming soon.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or paste resume text</span>
          </div>
        </div>

        <div>
          <Label htmlFor="resume-text">Resume Text</Label>
          <textarea
            id="resume-text"
            className="w-full min-h-[200px] p-3 border border-input rounded-md resize-none"
            placeholder="Paste resume content here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            disabled={isUploading}
          />
        </div>

        <Button 
          onClick={parseAndCreateCandidate} 
          disabled={isUploading || !resumeText.trim() || !selectedJobId}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing Resume...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Parse Resume & Create Candidate
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
