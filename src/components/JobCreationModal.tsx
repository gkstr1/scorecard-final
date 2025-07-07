
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Client {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
}

interface JobCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated?: () => void;
}

const JobCreationModal = ({ isOpen, onClose, onJobCreated }: JobCreationModalProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const { toast } = useToast();

  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    description: "",
    salary_range_min: "",
    salary_range_max: "",
    client_id: "",
    stages: ["Sourced", "Applied", "Technical Interview"]
  });

  const [newStage, setNewStage] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name");

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addStage = () => {
    if (newStage.trim() && !newJob.stages.includes(newStage)) {
      setNewJob({
        ...newJob,
        stages: [...newJob.stages, newStage.trim()]
      });
      setNewStage("");
    }
  };

  const removeStage = (stage: string) => {
    if (!["Sourced", "Applied", "Technical Interview"].includes(stage)) {
      setNewJob({
        ...newJob,
        stages: newJob.stages.filter(s => s !== stage)
      });
    }
  };

  const createJob = async () => {
    if (!newJob.title || !newJob.department || !newJob.client_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Client, Job Title, Department)",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingJob(true);
    try {
      const jobData = {
        title: newJob.title,
        department: newJob.department,
        description: newJob.description || `${newJob.title} position in ${newJob.department}`,
        client_id: newJob.client_id,
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
        client_id: "",
        stages: ["Sourced", "Applied", "Technical Interview"]
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
              <Select value={newJob.client_id} onValueChange={(value) => setNewJob({...newJob, client_id: value})}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {clients.length === 0 && !isLoading && (
                <p className="text-xs text-muted-foreground mt-1">
                  No clients available. Please create a client first.
                </p>
              )}
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

          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">Pipeline Stages</label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {newJob.stages.map((stage, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-secondary/50 text-foreground border-border px-3 py-1 flex items-center space-x-2"
                  >
                    <span className="text-sm">{stage}</span>
                    {!["Sourced", "Applied", "Technical Interview"].includes(stage) && (
                      <button
                        onClick={() => removeStage(stage)}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add custom stage"
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  className="text-sm max-w-48"
                  onKeyPress={(e) => e.key === 'Enter' && addStage()}
                />
                <Button size="sm" onClick={addStage} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Note: Sourced, Applied, and Technical Interview stages are required and cannot be removed.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={createJob} 
              disabled={!newJob.client_id || !newJob.title || !newJob.department || isCreatingJob}
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
