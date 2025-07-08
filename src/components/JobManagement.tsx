import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Building2, FileText, Search, Eye, Briefcase, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import JobCreationModal from "./JobCreationModal";
import ClientDetailModal from "./ClientDetailModal";
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
  contact_person: string | null;
  email: string | null;
  industry: string | null;
  company_size: string | null;
  website: string | null;
  description: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

const JobManagement = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
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

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (client.contact_person && client.contact_person.toLowerCase().includes(clientSearch.toLowerCase())) ||
    (client.email && client.email.toLowerCase().includes(clientSearch.toLowerCase()))
  );

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

      {/* Clients Grid */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Clients</span>
              <Badge variant="outline" className="text-xs">
                {filteredClients.length} of {clients.length}
              </Badge>
            </CardTitle>
            {clients.length > 0 && (
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search clients..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="pl-10 h-9 text-sm"
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No clients added yet</p>
              <Button 
                onClick={() => setShowJobModal(true)}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Client
              </Button>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No clients match your search</p>
              <Button 
                onClick={() => setClientSearch("")}
                variant="outline"
                size="sm"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredClients.map((client) => {
                const clientJobCount = jobs.filter(job => job.client_id === client.id).length;
                return (
                  <Card key={client.id} className="bg-muted/30 border-border hover:bg-muted/50 transition-colors cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-foreground text-sm truncate">
                            {client.name}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {clientJobCount} jobs
                          </Badge>
                        </div>
                        {client.contact_person && (
                          <p className="text-xs text-muted-foreground truncate">
                            {client.contact_person}
                          </p>
                        )}
                        {client.email && (
                          <p className="text-xs text-muted-foreground truncate">
                            {client.email}
                          </p>
                        )}
                        <div className="flex items-center space-x-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedClient(client);
                              setShowClientModal(true);
                            }}
                            className="h-7 text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                          >
                            <Briefcase className="h-3 w-3 mr-1" />
                            Jobs
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <JobCreationModal
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        onJobCreated={handleJobCreated}
      />

      <ClientDetailModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        client={selectedClient}
        onClientUpdated={fetchJobsAndClients}
      />
    </div>
  );
};

export default JobManagement;
