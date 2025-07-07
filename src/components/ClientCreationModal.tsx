
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ClientCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated?: () => void;
}

const ClientCreationModal = ({ isOpen, onClose, onClientCreated }: ClientCreationModalProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const [newClient, setNewClient] = useState({
    name: "",
    contact_person: "",
    email: ""
  });

  const createClient = async () => {
    if (!newClient.name) {
      toast({
        title: "Error",
        description: "Please enter a client name",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const { error } = await supabase
        .from("clients")
        .insert({
          name: newClient.name,
          contact_person: newClient.contact_person || null,
          email: newClient.email || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Client created successfully"
      });

      // Reset form
      setNewClient({
        name: "",
        contact_person: "",
        email: ""
      });

      onClose();
      if (onClientCreated) {
        onClientCreated();
      }
    } catch (error) {
      console.error("Error creating client:", error);
      toast({
        title: "Error",
        description: "Failed to create client",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Client Name *</label>
            <Input
              placeholder="e.g. Acme Corporation"
              value={newClient.name}
              onChange={(e) => setNewClient({...newClient, name: e.target.value})}
              className="text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Contact Person</label>
            <Input
              placeholder="e.g. John Smith"
              value={newClient.contact_person}
              onChange={(e) => setNewClient({...newClient, contact_person: e.target.value})}
              className="text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
            <Input
              type="email"
              placeholder="e.g. contact@acme.com"
              value={newClient.email}
              onChange={(e) => setNewClient({...newClient, email: e.target.value})}
              className="text-sm"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={createClient} 
              disabled={!newClient.name || isCreating}
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Add Client
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientCreationModal;
