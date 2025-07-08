import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Users, Plus, File, Files } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CandidateImportModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCandidatesImported?: () => void;
}

const CandidateImportModal = ({ isOpen, onOpenChange, onCandidatesImported }: CandidateImportModalProps) => {
  const [singleResume, setSingleResume] = useState<File | null>(null);
  const [bulkResumes, setBulkResumes] = useState<FileList | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleSingleResumeImport = async () => {
    if (!singleResume) {
      toast({
        title: "Error",
        description: "Please select a resume file to import",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    
    try {
      // Here you would implement the actual resume parsing logic
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Success",
        description: `Successfully imported candidate from ${singleResume.name}`,
      });

      setSingleResume(null);
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

  const handleSingleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('word') || file.type === 'text/plain')) {
      setSingleResume(file);
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="single" className="flex items-center space-x-2">
              <File className="h-4 w-4" />
              <span>Single Resume</span>
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
                      <p>• PDF documents (.pdf)</p>
                      <p>• Microsoft Word documents (.doc, .docx)</p>
                      <p>• Plain text files (.txt)</p>
                      <p className="mt-3 text-xs">
                        <strong>Note:</strong> The system will automatically extract candidate information from the resume and create a new candidate profile.
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleSingleResumeImport}
                  disabled={isImporting || !singleResume}
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
                      Import Single Resume
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