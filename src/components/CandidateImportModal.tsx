import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Upload, FileText, Users, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CandidateImportModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCandidatesImported?: () => void;
}

const CandidateImportModal = ({ isOpen, onOpenChange, onCandidatesImported }: CandidateImportModalProps) => {
  const [emailList, setEmailList] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleEmailImport = async () => {
    if (!emailList.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least one email address",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    
    try {
      // Parse email addresses from the text
      const emails = emailList
        .split(/[,\n\r]+/)
        .map(email => email.trim())
        .filter(email => email && email.includes('@'));

      if (emails.length === 0) {
        throw new Error("No valid email addresses found");
      }

      // Here you would implement the actual import logic
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Success",
        description: `Successfully imported ${emails.length} candidate(s) from email list`,
      });

      setEmailList("");
      onCandidatesImported?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import candidates",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            <Users className="h-5 w-5 text-primary" />
            <span>Import Candidates</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>From Email</span>
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>From CSV</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Manual Entry</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Import from Email List</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="emailList">Email Addresses</Label>
                  <Textarea
                    id="emailList"
                    placeholder="Enter email addresses separated by commas or new lines&#10;&#10;Example:&#10;john@example.com, jane@example.com&#10;bob@company.com&#10;alice@startup.io"
                    value={emailList}
                    onChange={(e) => setEmailList(e.target.value)}
                    rows={8}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Separate multiple email addresses with commas or new lines
                  </p>
                </div>
                <Button
                  onClick={handleEmailImport}
                  disabled={isImporting || !emailList.trim()}
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Import from Email List
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
                    onChange={handleFileChange}
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
                      <Upload className="h-4 w-4 mr-2" />
                      Import from CSV
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Manual Entry</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    For manual candidate entry, use the "Add Candidate" button in the pipeline
                  </p>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Go to Add Candidate
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

export default CandidateImportModal;