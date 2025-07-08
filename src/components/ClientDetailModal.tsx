import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Save, 
  Loader2, 
  Building2, 
  Globe, 
  MapPin, 
  Users, 
  Briefcase,
  Plus,
  Calendar,
  FileText,
  TrendingUp,
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

interface Job {
  id: string;
  title: string;
  department: string;
  is_active: boolean;
  created_at: string;
}

interface ClientNote {
  id: string;
  note_text: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface ClientStats {
  totalJobs: number;
  activeJobs: number;
  totalCandidates: number;
  successfulPlacements: number;
}

interface ClientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onClientUpdated?: () => void;
}

const ClientDetailModal = ({ isOpen, onClose, client, onClientUpdated }: ClientDetailModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [stats, setStats] = useState<ClientStats>({ totalJobs: 0, activeJobs: 0, totalCandidates: 0, successfulPlacements: 0 });
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const { toast } = useToast();

  const [editedClient, setEditedClient] = useState<Client | null>(null);

  useEffect(() => {
    if (client && isOpen) {
      setEditedClient({ ...client });
      fetchClientData();
    }
  }, [client, isOpen]);

  const fetchClientData = async () => {
    if (!client) return;
    
    setIsLoading(true);
    try {
      // Fetch client jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from("job_descriptions")
        .select("id, title, department, is_active, created_at")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false });

      if (jobsError) throw jobsError;

      // Fetch client notes
      const { data: notesData, error: notesError } = await supabase
        .from("client_notes")
        .select("*")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false });

      if (notesError) throw notesError;

      // Calculate stats
      const totalJobs = jobsData?.length || 0;
      const activeJobs = jobsData?.filter(job => job.is_active)?.length || 0;

      // Fetch candidates for client jobs
      const jobIds = jobsData?.map(job => job.id) || [];
      let totalCandidates = 0;
      
      if (jobIds.length > 0) {
        const { data: candidatesData, error: candidatesError } = await supabase
          .from("candidates")
          .select("id, position")
          .in("position", jobsData?.map(job => job.title) || []);

        if (!candidatesError) {
          totalCandidates = candidatesData?.length || 0;
        }
      }

      setJobs(jobsData || []);
      setNotes(notesData || []);
      setStats({
        totalJobs,
        activeJobs,
        totalCandidates,
        successfulPlacements: 0 // Placeholder for now
      });

    } catch (error) {
      console.error("Error fetching client data:", error);
      toast({
        title: "Error",
        description: "Failed to load client data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveClient = async () => {
    if (!editedClient) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("clients")
        .update({
          name: editedClient.name,
          contact_person: editedClient.contact_person || null,
          email: editedClient.email || null,
          industry: editedClient.industry || null,
          company_size: editedClient.company_size || null,
          website: editedClient.website || null,
          description: editedClient.description || null,
          location: editedClient.location || null
        })
        .eq("id", editedClient.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Client updated successfully"
      });

      if (onClientUpdated) {
        onClientUpdated();
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!client || !newNote.trim()) return;

    setIsAddingNote(true);
    try {
      const { error } = await supabase
        .from("client_notes")
        .insert({
          client_id: client.id,
          note_text: newNote.trim(),
          created_by: "User" // Placeholder for user attribution
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note added successfully"
      });

      setNewNote("");
      fetchClientData(); // Refresh to show new note
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive"
      });
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from("client_notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note deleted successfully"
      });

      fetchClientData(); // Refresh to remove deleted note
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive"
      });
    }
  };

  if (!client || !editedClient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>{client.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({stats.totalJobs})</TabsTrigger>
            <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Jobs</p>
                      <p className="text-xl font-bold">{stats.totalJobs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Active Jobs</p>
                      <p className="text-xl font-bold text-green-500">{stats.activeJobs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Candidates</p>
                      <p className="text-xl font-bold text-blue-500">{stats.totalCandidates}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Placements</p>
                      <p className="text-xl font-bold text-purple-500">{stats.successfulPlacements}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Client Information Form */}
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Company Name *</label>
                    <Input
                      value={editedClient.name}
                      onChange={(e) => setEditedClient({...editedClient, name: e.target.value})}
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Contact Person</label>
                    <Input
                      value={editedClient.contact_person || ""}
                      onChange={(e) => setEditedClient({...editedClient, contact_person: e.target.value})}
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={editedClient.email || ""}
                      onChange={(e) => setEditedClient({...editedClient, email: e.target.value})}
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Website</label>
                    <Input
                      value={editedClient.website || ""}
                      onChange={(e) => setEditedClient({...editedClient, website: e.target.value})}
                      className="text-sm"
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Industry</label>
                    <Input
                      value={editedClient.industry || ""}
                      onChange={(e) => setEditedClient({...editedClient, industry: e.target.value})}
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Company Size</label>
                    <Input
                      value={editedClient.company_size || ""}
                      onChange={(e) => setEditedClient({...editedClient, company_size: e.target.value})}
                      className="text-sm"
                      placeholder="e.g. 50-200 employees"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
                    <Input
                      value={editedClient.location || ""}
                      onChange={(e) => setEditedClient({...editedClient, location: e.target.value})}
                      className="text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
                  <Textarea
                    value={editedClient.description || ""}
                    onChange={(e) => setEditedClient({...editedClient, description: e.target.value})}
                    className="text-sm min-h-[100px]"
                    placeholder="Brief description of the company..."
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveClient} 
                    disabled={!editedClient.name || isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Client Jobs</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create New Job
              </Button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No jobs created for this client yet</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Job
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">{job.department}</p>
                          <p className="text-xs text-muted-foreground">
                            Created {new Date(job.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={job.is_active ? "default" : "secondary"}>
                            {job.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Add New Note</label>
                    <Textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note about this client..."
                      className="min-h-[80px]"
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleAddNote} 
                        disabled={!newNote.trim() || isAddingNote}
                        size="sm"
                      >
                        {isAddingNote ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4 mr-2" />
                        )}
                        Add Note
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading notes...</p>
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notes added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <Card key={note.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm">{note.note_text}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <p className="text-xs text-muted-foreground">
                                {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString()}
                              </p>
                              {note.created_by && (
                                <Badge variant="outline" className="text-xs">
                                  {note.created_by}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Client created</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(client.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {jobs.map((job) => (
                    <div key={job.id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Job created: {job.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {notes.map((note) => (
                    <div key={note.id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Note added</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(note.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailModal;