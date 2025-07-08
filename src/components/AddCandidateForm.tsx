
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddCandidateFormProps {
  onCandidateAdded: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCandidateForm = ({ onCandidateAdded, isOpen, onOpenChange }: AddCandidateFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    phone: "",
    location: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    skills: "",
    experience_years: "",
    education: "",
    current_company: "",
    current_salary: "",
    expected_salary: "",
    role_category: "frontend"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const skillsArray = formData.skills ? formData.skills.split(",").map(s => s.trim()) : [];
      
      const { error } = await supabase
        .from("candidates")
        .insert({
          name: formData.name,
          email: formData.email,
          position: formData.position,
          phone: formData.phone || null,
          location: formData.location || null,
          linkedin_url: formData.linkedin_url || null,
          github_url: formData.github_url || null,
          portfolio_url: formData.portfolio_url || null,
          skills: skillsArray,
          experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
          education: formData.education || null,
          current_company: formData.current_company || null,
          current_salary: formData.current_salary ? parseInt(formData.current_salary) : null,
          expected_salary: formData.expected_salary ? parseInt(formData.expected_salary) : null,
          role_category: formData.role_category,
          status: "applied"
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Candidate added successfully!"
      });

      setFormData({
        name: "",
        email: "",
        position: "",
        phone: "",
        location: "",
        linkedin_url: "",
        github_url: "",
        portfolio_url: "",
        skills: "",
        experience_years: "",
        education: "",
        current_company: "",
        current_salary: "",
        expected_salary: "",
        role_category: "frontend"
      });
      
      onOpenChange(false);
      onCandidateAdded();
    } catch (error) {
      console.error("Error adding candidate:", error);
      toast({
        title: "Error",
        description: "Failed to add candidate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Candidate (Manual Entry)</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="role_category">Role Category</Label>
              <Select value={formData.role_category} onValueChange={(value) => setFormData({ ...formData, role_category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="fullstack">Full Stack</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="React, TypeScript, Node.js"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="experience_years">Experience (years)</Label>
              <Input
                id="experience_years"
                type="number"
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="current_salary">Current Salary</Label>
              <Input
                id="current_salary"
                type="number"
                value={formData.current_salary}
                onChange={(e) => setFormData({ ...formData, current_salary: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="expected_salary">Expected Salary</Label>
              <Input
                id="expected_salary"
                type="number"
                value={formData.expected_salary}
                onChange={(e) => setFormData({ ...formData, expected_salary: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_company">Current Company</Label>
              <Input
                id="current_company"
                value={formData.current_company}
                onChange={(e) => setFormData({ ...formData, current_company: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="education">Education</Label>
              <Input
                id="education"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="portfolio_url">Portfolio URL</Label>
              <Input
                id="portfolio_url"
                value={formData.portfolio_url}
                onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Candidate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCandidateForm;
