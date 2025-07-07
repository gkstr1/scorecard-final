import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ResumeUpload from "./ResumeUpload";

interface AddCandidateFormProps {
  onCandidateAdded: () => void;
}

const AddCandidateForm = ({ onCandidateAdded }: AddCandidateFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleResumesParsed = (parsedData: any) => {
    console.log("Parsed resume data:", parsedData);
    
    // Auto-fill form with parsed data
    setFormData(prev => ({
      ...prev,
      name: parsedData.name || prev.name,
      email: parsedData.email || prev.email,
      phone: parsedData.phone || prev.phone,
      location: parsedData.location || prev.location,
      linkedin_url: parsedData.linkedin_url || prev.linkedin_url,
      github_url: parsedData.github_url || prev.github_url,
      portfolio_url: parsedData.portfolio_url || prev.portfolio_url,
      skills: parsedData.skills ? parsedData.skills.join(", ") : prev.skills,
      experience_years: parsedData.experience_years ? parsedData.experience_years.toString() : prev.experience_years,
      education: parsedData.education || prev.education,
      current_company: parsedData.work_experience?.[0]?.company || prev.current_company,
      position: parsedData.work_experience?.[0]?.position || prev.position
    }));

    toast({
      title: "Resume Parsed",
      description: "Form has been auto-filled with resume data. Please review and submit."
    });
  };

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
      
      setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Candidate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="resume">Parse Resume</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resume" className="space-y-4">
            <ResumeUpload 
              onResumesParsed={handleResumesParsed}
              jobPosition={formData.position || "Software Developer"}
            />
          </TabsContent>
          
          <TabsContent value="manual">
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
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Candidate"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddCandidateForm;
