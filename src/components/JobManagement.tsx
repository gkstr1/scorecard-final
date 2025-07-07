
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, FileText, Users, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import JobCreationModal from "./JobCreationModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  is_active: boolean;
  created_at: string;
  client_id: string;
  clients?: {
    name: string;
  };
}

interface Client {
  id: string;
  name: string;
  contact_person: string;
  email: string;
}

const JobManagement = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobsAndClients();
  }, []);

  const fetchJobsAndClients = async () => {
    setIsLoading(true);
    try {
      // Fetch jobs with client information
      const { data: jobsData, error: jobsError } = await supabase
        .from("job_descriptions")
        .select(`
          id,
          title,
          department,
          description,
          is_active,
          created_at,
          client_id,
          clients (
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (jobsError) throw jobsError;

      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select("*")
        .order("name");

      if (clientsError) throw clientsError;

      setJobs(jobsData || []);
      setClients(clientsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load jobs and clients",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobCreated = () => {
    fetchJobsAndClients();
    setShowJobModal(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              Job Management
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your job postings and clients
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">
            Job Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your job postings and clients
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-sm px-3 py-1">
            {jobs.length} Jobs
          </Badge>
          <Button 
            onClick={() => setShowJobModal(true)}
            className="bg-primary hover:bg-primary/90" 
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Job
          </Button>
        </div>
      </div>

      {/* Jobs Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Active Job Postings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No jobs created yet</p>
              <Button onClick={() => setShowJobModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Job
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.clients?.name || "No Client"}</TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>
                      <Badge variant={job.is_active ? "default" : "secondary"}>
                        {job.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(job.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Clients Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Clients</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="text-center py-6">
              <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Clients will appear here when you create jobs
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((client) => (
                <div key={client.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{client.name}</h4>
                      {client.contact_person && (
                        <p className="text-sm text-muted-foreground">{client.contact_person}</p>
                      )}
                      {client.email && (
                        <p className="text-xs text-muted-foreground">{client.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <JobCreationModal
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
};

export default JobManagement;
