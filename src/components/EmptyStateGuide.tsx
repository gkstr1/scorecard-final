import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, FileText, ArrowRight, Plus, Upload } from "lucide-react";
import JobCreationModal from "./JobCreationModal";

interface EmptyStateGuideProps {
  type: "jobs" | "candidates" | "dashboard";
  onCreateJob?: () => void;
  onAddCandidate?: () => void;
  onUploadResume?: () => void;
}

const EmptyStateGuide = ({ type, onCreateJob, onAddCandidate, onUploadResume }: EmptyStateGuideProps) => {
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  const handleJobCreated = () => {
    if (onCreateJob) {
      onCreateJob();
    }
  };

  if (type === "jobs") {
    return (
      <>
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome to Job Management</CardTitle>
            <p className="text-muted-foreground">
              Let's get started by creating your first job posting and client relationship
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h3 className="font-semibold">Add Your First Client</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-11">
                  Start by adding a client company. This could be your own company if you're hiring internally, 
                  or a client company if you're a recruiting agency.
                </p>
                <div className="ml-11 p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Example:</p>
                  <div className="text-sm">
                    <div><strong>Company:</strong> TechCorp Inc.</div>
                    <div><strong>Contact:</strong> Sarah Johnson</div>
                    <div><strong>Email:</strong> sarah@techcorp.com</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h3 className="font-semibold">Create Your First Job</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-11">
                  Once you have a client, create a job posting with details like title, department, 
                  salary range, and custom pipeline stages.
                </p>
                <div className="ml-11 p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Example:</p>
                  <div className="text-sm">
                    <div><strong>Title:</strong> Senior Frontend Developer</div>
                    <div><strong>Department:</strong> Engineering</div>
                    <div><strong>Salary:</strong> $100k - $130k</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button 
                onClick={() => setIsJobModalOpen(true)} 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Job
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Don't worry, you can always edit or add more jobs later
              </p>
            </div>
          </CardContent>
        </Card>

        <JobCreationModal 
          isOpen={isJobModalOpen}
          onClose={() => setIsJobModalOpen(false)}
          onJobCreated={handleJobCreated}
        />
      </>
    );
  }

  if (type === "candidates") {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Ready to Add Candidates</CardTitle>
          <p className="text-muted-foreground">
            Choose how you'd like to add your first candidates to the system
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Upload Resume (Recommended)</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a resume file and let our AI automatically extract candidate information, 
                  skills, and experience details.
                </p>
                <Button onClick={onUploadResume} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Resume
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Manual Entry</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manually enter candidate details if you don't have a resume file 
                  or prefer to input information yourself.
                </p>
                <Button onClick={onAddCandidate} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Manually
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Resume upload is faster and more accurate. 
              You can always edit the extracted information afterwards.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Dashboard overview empty state
  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to Scorecard</CardTitle>
          <p className="text-muted-foreground">
            Your smart hiring platform is ready. Let's set up your first job and start managing candidates.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Set Up Jobs</h3>
                  <p className="text-sm text-muted-foreground">Create clients and job postings</p>
                </div>
              </div>
              <div className="ml-13">
                <Button onClick={onCreateJob} className="w-full">
                  <Building2 className="h-4 w-4 mr-2" />
                  Go to Job Management
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted text-muted-foreground rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-muted-foreground">Add Candidates</h3>
                  <p className="text-sm text-muted-foreground">Upload resumes or add manually</p>
                </div>
              </div>
              <div className="ml-13">
                <p className="text-xs text-muted-foreground mb-2">
                  Complete step 1 first to enable candidate management
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Quick Start Guide</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  1. Create a client company<br/>
                  2. Add a job posting for that client<br/>
                  3. Upload candidate resumes<br/>
                  4. Manage your hiring pipeline
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyStateGuide;
