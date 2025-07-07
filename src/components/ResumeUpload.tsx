
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Plus } from "lucide-react";
import ResumeUploadModal from "./ResumeUploadModal";

interface ResumeUploadProps {
  onCandidateCreated?: () => void;
}

const ResumeUpload = ({ onCandidateCreated }: ResumeUploadProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume Upload Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Upload & Parse Resumes
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Upload candidate resumes and automatically extract information to create candidate profiles. 
              Our AI-powered parser will analyze the resume and populate all relevant fields.
            </p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Upload Resume
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="h-4 w-4 text-accent" />
              </div>
              <h4 className="font-medium text-foreground mb-1">Smart Parsing</h4>
              <p className="text-xs text-muted-foreground">
                AI extracts key information from resumes automatically
              </p>
            </div>
            
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Plus className="h-4 w-4 text-accent" />
              </div>
              <h4 className="font-medium text-foreground mb-1">Auto-Create</h4>
              <p className="text-xs text-muted-foreground">
                Candidate profiles are created and assigned to jobs
              </p>
            </div>
            
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Upload className="h-4 w-4 text-accent" />
              </div>
              <h4 className="font-medium text-foreground mb-1">Multiple Formats</h4>
              <p className="text-xs text-muted-foreground">
                Support for DOCX and text files. Copy/paste for PDFs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ResumeUploadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCandidateCreated={() => {
          setIsModalOpen(false);
          if (onCandidateCreated) {
            onCandidateCreated();
          }
        }}
      />
    </div>
  );
};

export default ResumeUpload;
