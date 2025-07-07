
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface JobCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated?: () => void;
}

const JobCreationModal = ({ isOpen, onClose, onJobCreated }: JobCreationModalProps) => {
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const { toast } = useToast();

  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    description: "",
    salary_range_min: "",
    salary_range_max: "",
    client_name: ""
  });

  const createJob = async () => {
    if (!newJob.title || !newJob.department || !newJob.client_name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Client, Job Title, Department)",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingJob(true);
    try {
      // First, create or find the client
      let clientId = null;
      
      // Check if client already exists
      const { data: existingClient } = await supabase
        .from("clients")
        .select("id")
        .eq("name", newJob.client_name.trim())
        .single();

      if (existingClient) {
        clientId = existingClient.id;
      } else {
        // Create new client
        const { data: newClient, error: clientError } = await supabase
          .from("clients")
          .insert({ name: newJob.client_name.trim() })
          .select("id")
          .single();

        if (clientError) throw clientError;
        clientId = newClient.id;
      }

      const jobData = {
        title: newJob.title,
        department: newJob.department,
        description: newJob.description || `${newJob.title} position in ${newJob.department}`,
        client_id: clientId,
        salary_range_min: newJob.salary_range_min ? parseInt(newJob.salary_range_min) : null,
        salary_range_max: newJob.salary_range_max ? parseInt(newJob.salary_range_max) : null,
        is_active: true
      };

      const { error } = await supabase
        .from("job_descriptions")
        .insert(jobData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job posting created successfully"
      });

      // Reset form
      setNewJob({
        title: "",
        department: "",
        description: "",
        salary_range_min: "",
        salary_range_max: "",
        client_name: ""
      });

      onClose();
      if (onJobCreated) {
        onJobCreated();
      }
    } catch (error) {
      console.error("Error creating job:", error);
      toast({
        title: "Error",
        description: "Failed to create job posting",
        variant: "destructive"
      });
    } finally {
      setIsCreatingJob(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Client *</label>
              <Input
                placeholder="e.g. Acme Corporation"
                value={newJob.client_name}
                onChange={(e) => setNewJob({...newJob, client_name: e.target.value})}
                className="text-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Job Title *</label>
              <Input
                placeholder="e.g. Senior Frontend Developer"
                value={newJob.title}
                onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                className="text-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Department *</label>
              <Input
                placeholder="e.g. Engineering"
                value={newJob.department}
                onChange={(e) => setNewJob({...newJob, department: e.target.value})}
                className="text-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Job Description</label>
              <Input
                placeholder="Brief description of the role"
                value={newJob.description}
                onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                className="text-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Min Salary</label>
              <Input
                type="number"
                placeholder="e.g. 100000"
                value={newJob.salary_range_min}
                onChange={(e) => setNewJob({...newJob, salary_range_min: e.target.value})}
                className="text-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Max Salary</label>
              <Input
                type="number"
                placeholder="e.g. 130000"
                value={newJob.salary_range_max}
                onChange={(e) => setNewJob({...newJob, salary_range_max: e.target.value})}
                className="text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={createJob} 
              disabled={!newJob.client_name || !newJob.title || !newJob.department || isCreatingJob}
            >
              {isCreatingJob ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Create Job
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobCreationModal;
