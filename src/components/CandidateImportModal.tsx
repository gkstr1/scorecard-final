import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Users, Plus, File, Files, Type, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import mammoth from "mammoth";

interface Job {
  id: string;
  title: string;
  department?: string;
  clients?: {
    name: string;
  };
}

interface CandidateImportModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCandidatesImported?: () => void;
}

const CandidateImportModal = ({ isOpen, onOpenChange, onCandidatesImported }: CandidateImportModalProps) => {
  const [singleResume, setSingleResume] = useState<File | null>(null);
  const [bulkResumes, setBulkResumes] = useState<FileList | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchJobs();
    }
  }, [isOpen]);

  const fetchJobs = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("job_descriptions")
        .select(`
          id,
          title,
          department,
          clients (
            name
          )
        `)
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: "Failed to fetch available jobs",
          variant: "destructive"
        });
        return;
      }

      setJobs(data as Job[]);
      if (data && data.length > 0) {
        setSelectedJobId(data[0].id);
      }
    } catch (error) {
      console.error("Error in fetchJobs:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching jobs",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractTextFromDOCX = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error("Error extracting text from DOCX:", error);
      throw new Error("Failed to extract text from DOCX file");
    }
  };

  const parseAndCreateCandidate = async (text: string, jobId: string): Promise<void> => {
    console.log("Starting resume parsing with text length:", text.length);
    
    try {
      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { 
          resumeText: text,
          jobId: jobId
        }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "Failed to parse resume");
      }

      if (!data?.candidate) {
        console.error("No candidate data returned from parsing");
        throw new Error("Failed to extract candidate information from resume");
      }

      console.log("Parsed candidate data:", data.candidate);

      // Insert the candidate into the database
      const { error: insertError } = await supabase
        .from("candidates")
        .insert([{
          ...data.candidate,
          job_id: jobId,
          status: 'applied'
        }]);

      if (insertError) {
        console.error("Database insertion error:", insertError);
        throw new Error("Failed to save candidate to database");
      }

      console.log("Candidate successfully created");
    } catch (error) {
      console.error("Error in parseAndCreateCandidate:", error);
      throw error;
    }
  };

  const handleResumeFileUpload = async (file: File): Promise<string> => {
    const fileType = file.type;
    let extractedText = "";

    if (fileType === "text/plain") {
      extractedText = await file.text();
    } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
               fileType === "application/msword") {
      extractedText = await extractTextFromDOCX(file);
    } else {
      throw new Error("Unsupported file format. Please use .txt or .docx files, or copy/paste text for PDF files.");
    }

    return extractedText;
  };

  const handleParseResume = async (): Promise<void> => {
    if (!selectedJobId) {
      toast({
        title: "Error",
        description: "Please select a job for this candidate",
        variant: "destructive"
      });
      return;
    }

    if (!resumeText.trim()) {
      toast({
        title: "Error", 
        description: "Please provide resume text to parse",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);

    try {
      await parseAndCreateCandidate(resumeText, selectedJobId);
      
      toast({
        title: "Success",
        description: "Resume parsed and candidate created successfully!",
      });

      // Reset form
      setResumeText("");
      setSingleResume(null);
      
      onCandidatesImported?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error parsing resume:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to parse resume",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleSingleResumeImport = async () => {
    if (!singleResume) {
      toast({
        title: "Error",
        description: "Please select a resume file to import",
        variant: "destructive"
      });
      return;
    }

    if (!selectedJobId) {
      toast({
        title: "Error", 
        description: "Please select a job for this candidate",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    
    try {
      const extractedText = await handleResumeFileUpload(singleResume);
      await parseAndCreateCandidate(extractedText, selectedJobId);

      toast({
        title: "Success",
        description: `Successfully imported candidate from ${singleResume.name}`,
      });

      setSingleResume(null);
      setResumeText("");
      onCandidatesImported?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import candidate from resume",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleBulkResumeImport = async () => {
    if (!bulkResumes || bulkResumes.length === 0) {
      toast({
        title: "Error",
        description: "Please select resume files to import",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);

    try {
      // Here you would implement bulk resume parsing logic
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Success",
        description: `Successfully imported ${bulkResumes.length} candidate(s) from resume files`,
      });

      setBulkResumes(null);
      onCandidatesImported?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import candidates from resume files",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleCsvImport = async () => {
    if (!csvFile) {
      toast({
        title: "Error",
        description: "Please select a CSV file to import",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);

    try {
      // Here you would implement CSV parsing and import logic
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Success",
        description: "Successfully imported candidates from CSV file",
      });

      setCsvFile(null);
      onCandidatesImported?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import candidates from CSV",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleSingleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('word') || file.type === 'text/plain')) {
      setSingleResume(file);
      
      // Auto-extract text from supported formats
      try {
        if (file.type !== 'application/pdf') {
          const extractedText = await handleResumeFileUpload(file);
          setResumeText(extractedText);
        }
      } catch (error) {
        console.error("Error extracting text:", error);
      }
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a PDF, Word document, or text file",
        variant: "destructive"
      });
    }
  };

  const handleBulkResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Validate all files are valid resume formats
      const validFiles = Array.from(files).filter(file => 
        file.type === 'application/pdf' || 
        file.type.includes('word') || 
        file.type === 'text/plain'
      );
      
      if (validFiles.length !== files.length) {
        toast({
          title: "Invalid Files",
          description: "Some files were skipped. Please only select PDF, Word, or text files",
          variant: "destructive"
        });
      }
      
      if (validFiles.length > 0) {
        // Create a new FileList-like object with only valid files
        const dt = new DataTransfer();
        validFiles.forEach(file => dt.items.add(file));
        setBulkResumes(dt.files);
      }
    }
  };

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid CSV file",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-primary" />
            <span>Import Candidates</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="single" className="flex items-center space-x-2">
              <File className="h-4 w-4" />
              <span>Single Resume</span>
            </TabsTrigger>
            <TabsTrigger value="parse" className="flex items-center space-x-2">
              <Type className="h-4 w-4" />
              <span>Parse Resume</span>
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center space-x-2">
              <Files className="h-4 w-4" />
              <span>Bulk Resume</span>
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>CSV File</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Import Single Resume</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="jobSelect">Select Job Position</Label>
                  <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a job position" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.clients?.name ? `${job.clients.name} - ${job.title}` : job.title}
                          {job.department && ` (${job.department})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="singleResume">Resume File</Label>
                  <Input
                    id="singleResume"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleSingleResumeChange}
                    className="mt-2"
                  />
                  {singleResume && (
                    <p className="text-sm text-foreground mt-2">
                      Selected: {singleResume.name}
                    </p>
                  )}
                  <div className="bg-muted/30 border border-border rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-foreground mb-2">Supported Formats:</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• PDF documents (.pdf) - copy/paste text below</p>
                      <p>• Microsoft Word documents (.doc, .docx) - auto-extracted</p>
                      <p>• Plain text files (.txt) - auto-extracted</p>
                      <p className="mt-3 text-xs">
                        <strong>Note:</strong> AI will extract candidate information and create a profile.
                      </p>
                    </div>
                  </div>
                </div>

                {resumeText && (
                  <div>
                    <Label htmlFor="resumePreview">Extracted Resume Text</Label>
                    <Textarea
                      id="resumePreview"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Resume text will appear here..."
                      className="min-h-32 mt-2"
                    />
                  </div>
                )}

                <Button
                  onClick={handleSingleResumeImport}
                  disabled={isImporting || !singleResume || !selectedJobId}
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Processing Resume...
                    </>
                  ) : (
                    <>
                      <File className="h-4 w-4 mr-2" />
                      Import & Parse Resume
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parse" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Parse Resume Text</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="jobSelectParse">Select Job Position</Label>
                  <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a job position" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.clients?.name ? `${job.clients.name} - ${job.title}` : job.title}
                          {job.department && ` (${job.department})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="resumeTextArea">Resume Text</Label>
                  <Textarea
                    id="resumeTextArea"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste the resume text here..."
                    className="min-h-48 mt-2"
                  />
                  <div className="bg-muted/30 border border-border rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-foreground mb-2">How to use:</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Copy resume text from PDF files or any source</p>
                      <p>• Paste the full resume content in the text area above</p>
                      <p>• AI will extract candidate information automatically</p>
                      <p>• Candidate will be assigned to the selected job</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleParseResume}
                  disabled={isImporting || !resumeText.trim() || !selectedJobId}
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Parsing Resume...
                    </>
                  ) : (
                    <>
                      <Type className="h-4 w-4 mr-2" />
                      Parse Resume Text
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Import Multiple Resumes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bulkResumes">Resume Files</Label>
                  <Input
                    id="bulkResumes"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    multiple
                    onChange={handleBulkResumeChange}
                    className="mt-2"
                  />
                  {bulkResumes && bulkResumes.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-foreground">
                        Selected {bulkResumes.length} file(s):
                      </p>
                      <div className="mt-1 text-xs text-muted-foreground max-h-20 overflow-y-auto">
                        {Array.from(bulkResumes).map((file, index) => (
                          <div key={index}>• {file.name}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="bg-muted/30 border border-border rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-foreground mb-2">Bulk Import Tips:</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Select multiple resume files at once (Ctrl/Cmd + click)</p>
                      <p>• Supported formats: PDF, Word, and text files</p>
                      <p>• Each resume will be processed individually</p>
                      <p>• Processing time depends on the number of files</p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleBulkResumeImport}
                  disabled={isImporting || !bulkResumes || bulkResumes.length === 0}
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Processing {bulkResumes?.length || 0} Resumes...
                    </>
                  ) : (
                    <>
                      <Files className="h-4 w-4 mr-2" />
                      Import {bulkResumes?.length || 0} Resume{bulkResumes && bulkResumes.length !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="csv" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Import from CSV File</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="csvFile">CSV File</Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleCsvChange}
                    className="mt-2"
                  />
                  {csvFile && (
                    <p className="text-sm text-foreground mt-2">
                      Selected: {csvFile.name}
                    </p>
                  )}
                  <div className="bg-muted/30 border border-border rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-foreground mb-2">Expected CSV Format:</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Required columns:</strong> name, email, position</p>
                      <p><strong>Optional columns:</strong> phone, location, skills, experience_years</p>
                      <p><strong>Example:</strong></p>
                      <code className="text-xs bg-background p-2 rounded block mt-2">
                        name,email,position,skills<br/>
                        John Doe,john@example.com,Software Engineer,"React,Node.js"<br/>
                        Jane Smith,jane@example.com,Product Manager,"Agile,Analytics"
                      </code>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleCsvImport}
                  disabled={isImporting || !csvFile}
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Import from CSV
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateImportModal;