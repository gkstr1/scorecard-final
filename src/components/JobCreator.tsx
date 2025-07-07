import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Save, Briefcase, MapPin, DollarSign, Building2, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Client {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  jobsCount?: number;
}

interface Job {
  id: string;
  title: string;
  department: string | null;
  description: string;
  salary_range_min: number | null;
  salary_range_max: number | null;
  is_active: boolean | null;
  client_id: string | null;
  clientName?: string;
  stages: string[];
  candidates?: number;
}

interface JobCreatorProps {
  onJobCreated?: () => void;
}

const JobCreator = ({ onJobCreated }: JobCreatorProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const { toast } = useToast();

  const [newClient, setNewClient] = useState({
    name: "",
    contact_person: "",
    email: ""
  });

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
  const [showClientForm, setShowClientForm] = useState(false);

  useEffect(() => {
    fetchClientsAndJobs();
  }, []);

  const fetchClientsAndJobs = async () => {
    setIsLoading(true);
    try {
      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select("*")
        .order("name");

      if (clientsError) throw clientsError;

      // Fetch jobs with client information
      const { data: jobsData, error: jobsError } = await supabase
        .from("job_descriptions")
        .select(`
          *,
          clients(name)
        `)
        .order("title");

      if (jobsError) throw jobsError;

      // Count jobs per client
      const clientsWithJobCount = (clientsData || []).map(client => ({
        ...client,
        jobsCount: (jobsData || []).filter(job => job.client_id === client.id).length
      }));

      // Transform jobs data
      const transformedJobs = (jobsData || []).map(job => ({
        ...job,
        clientName: job.clients?.name || "No Client",
        stages: ["Sourced", "Applied", "Technical Interview"], // Default stages
        candidates: 0 // TODO: Count actual candidates when candidate-job relationship is established
      }));

      setClients(clientsWithJobCount);
      setJobs(transformedJobs);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load clients and jobs",
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

  const createClient = async () => {
    if (!newClient.name || !newClient.contact_person) {
      toast({
        title: "Error",
        description: "Please fill in the company name and contact person",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingClient(true);
    try {
      const { data, error } = await supabase
        .from("clients")
        .insert({
          name: newClient.name,
          contact_person: newClient.contact_person,
          email: newClient.email || null
        })
        .select()
        .single();

      if (error) throw error;

      const newClientWithJobCount = { ...data, jobsCount: 0 };
      setClients([...clients, newClientWithJobCount]);
      setNewClient({ name: "", contact_person: "", email: "" });
      setShowClientForm(false);
      
      // Auto-select the newly created client
      setNewJob({ ...newJob, client_id: data.id });

      toast({
        title: "Success",
        description: "Client created successfully"
      });
    } catch (error) {
      console.error("Error creating client:", error);
      toast({
        title: "Error",
        description: "Failed to create client",
        variant: "destructive"
      });
    } finally {
      setIsCreatingClient(false);
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

      const { data, error } = await supabase
        .from("job_descriptions")
        .insert(jobData)
        .select(`
          *,
          clients(name)
        `)
        .single();

      if (error) throw error;

      const client = clients.find(c => c.id === newJob.client_id);
      const newJobWithClient = {
        ...data,
        clientName: client?.name || "No Client",
        stages: newJob.stages,
        candidates: 0
      };

      setJobs([...jobs, newJobWithClient]);
      
      // Update client job count
      setClients(clients.map(c => 
        c.id === newJob.client_id 
          ? { ...c, jobsCount: (c.jobsCount || 0) + 1 }
          : c
      ));
      
      setNewJob({
        title: "",
        department: "",
        description: "",
        salary_range_min: "",
        salary_range_max: "",
        client_id: "",
        stages: ["Sourced", "Applied", "Technical Interview"]
      });

      toast({
        title: "Success",
        description: "Job posting created successfully"
      });

      // Call the callback to notify parent component
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

  const formatSalaryRange = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading clients and jobs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Clients Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Building2 className="h-5 w-5 text-primary" />
              <span>Clients</span>
            </CardTitle>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowClientForm(!showClientForm)}
              disabled={isCreatingClient}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showClientForm && (
            <div className="border border-border rounded-lg p-4 bg-muted/10">
              <h4 className="font-medium text-foreground mb-3">New Client</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Company name *"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  className="text-sm"
                />
                <Input
                  placeholder="Contact person *"
                  value={newClient.contact_person}
                  onChange={(e) => setNewClient({...newClient, contact_person: e.target.value})}
                  className="text-sm"
                />
                <Input
                  placeholder="Email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  className="text-sm"
                />
              </div>
              <div className="flex space-x-2 mt-3">
                <Button 
                  size="sm" 
                  onClick={createClient}
                  disabled={isCreatingClient}
                >
                  {isCreatingClient ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Client
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowClientForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client) => (
              <div key={client.id} className="border border-border rounded-lg p-4 bg-muted/5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-foreground">{client.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {client.jobsCount || 0} jobs
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{client.contact_person}</span>
                  </div>
                  {client.email && (
                    <div className="text-xs">{client.email}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create New Job */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Briefcase className="h-5 w-5 text-primary" />
            <span>Create New Job</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              {clients.length === 0 && (
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

          <Button 
            onClick={createJob} 
            className="bg-primary hover:bg-primary/90"
            disabled={!newJob.client_id || !newJob.title || !newJob.department || isCreatingJob}
          >
            {isCreatingJob ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Create Job Posting
          </Button>
        </CardContent>
      </Card>

      {/* Existing Jobs */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Active Job Postings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.filter(job => job.is_active).map((job) => (
              <div key={job.id} className="border border-border rounded-lg p-4 bg-muted/10">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{job.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center space-x-1">
                        <Building2 className="h-3 w-3" />
                        <span>{job.clientName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Briefcase className="h-3 w-3" />
                        <span>{job.department}</span>
                      </div>
                      {formatSalaryRange(job.salary_range_min, job.salary_range_max) && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{formatSalaryRange(job.salary_range_min, job.salary_range_max)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="text-xs">
                      {job.is_active ? "Active" : "Draft"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {job.candidates || 0} candidates
                    </Badge>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-foreground mb-2">Pipeline Stages:</div>
                  <div className="flex flex-wrap gap-1">
                    {job.stages.map((stage, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                        {stage}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {jobs.filter(job => job.is_active).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active job postings yet.</p>
                <p className="text-sm">Create your first job posting above to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobCreator;
