
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { User, Mail, Calendar, Zap, Eye, Plus } from "lucide-react";
import { useState } from "react";
import CandidateProfileModal from "./CandidateProfileModal";

interface KanbanBoardProps {
  selectedRole: string;
}

const KanbanBoard = ({ selectedRole }: KanbanBoardProps) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample job description for skill matching
  const sampleJobDescription = {
    title: "Senior Full Stack Developer",
    required_skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Python"],
    preferred_skills: ["AWS", "Docker", "GraphQL"],
    experience_level: "Senior",
    salary_range_min: 80000,
    salary_range_max: 120000,
  };

  const columns = [
    {
      id: "applied",
      title: "Applied",
      count: 8,
      color: "bg-blue-500/10 border-blue-500/30",
      candidates: [
        {
          id: "1",
          name: "Sarah Chen",
          position: "Senior React Developer",
          email: "sarah.chen@email.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          linkedin_url: "https://linkedin.com/in/sarahchen",
          github_url: "https://github.com/sarahchen",
          portfolio_url: "https://sarahchen.dev",
          resume_url: "https://example.com/resume-sarah.pdf",
          skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
          experience_years: 5,
          education: "BS Computer Science - Stanford University",
          current_company: "TechCorp Inc.",
          current_salary: 95000,
          expected_salary: 110000,
          availability_date: "2024-02-01",
          status: "applied",
          role_category: "frontend",
          applied_date: "2024-01-15T10:30:00Z"
        },
        {
          id: "2",
          name: "Michael Rodriguez",
          position: "Full Stack Engineer",
          email: "m.rodriguez@email.com",
          phone: "+1 (555) 987-6543",
          location: "Austin, TX",
          linkedin_url: "https://linkedin.com/in/mrodriguez",
          github_url: "https://github.com/mrodriguez",
          skills: ["Python", "Django", "PostgreSQL", "React", "Docker"],
          experience_years: 4,
          education: "MS Software Engineering - UT Austin",
          current_company: "StartupXYZ",
          current_salary: 85000,
          expected_salary: 100000,
          status: "applied",
          role_category: "fullstack",
          applied_date: "2024-01-10T14:20:00Z"
        },
      ]
    },
    {
      id: "sourced",
      title: "Sourced",
      count: 6,
      color: "bg-gray-500/10 border-gray-500/30",
      candidates: [
        {
          id: "3",
          name: "Emily Johnson",
          position: "Frontend Developer",
          email: "emily.j@email.com",
          phone: "+1 (555) 456-7890",
          location: "New York, NY",
          skills: ["Vue.js", "JavaScript", "CSS", "Webpack"],
          experience_years: 3,
          education: "BA Computer Science - NYU",
          current_company: "DesignStudio",
          current_salary: 75000,
          expected_salary: 85000,
          status: "sourced",
          role_category: "frontend",
          applied_date: "2024-01-08T09:15:00Z"
        },
      ]
    },
    {
      id: "technical",
      title: "Technical Interview",
      count: 4,
      color: "bg-purple-500/10 border-purple-500/30",
      candidates: [
        {
          id: "4",
          name: "David Kim",
          position: "Backend Engineer",
          email: "david.kim@email.com",
          phone: "+1 (555) 321-0987",
          location: "Seattle, WA",
          linkedin_url: "https://linkedin.com/in/davidkim",
          github_url: "https://github.com/davidkim",
          skills: ["Java", "Spring", "MySQL", "Redis", "Kubernetes"],
          experience_years: 6,
          education: "MS Computer Science - University of Washington",
          current_company: "CloudTech Solutions",
          current_salary: 105000,
          expected_salary: 120000,
          status: "technical_interview",
          role_category: "backend",
          applied_date: "2024-01-12T16:45:00Z"
        },
      ]
    },
    {
      id: "submitted",
      title: "Submitted",
      count: 3,
      color: "bg-yellow-500/10 border-yellow-500/30",
      candidates: []
    },
    {
      id: "hired",
      title: "Hired",
      count: 2,
      color: "bg-green-500/10 border-green-500/30",
      candidates: [
        {
          id: "5",
          name: "Lisa Wang",
          position: "Product Designer",
          email: "lisa.wang@email.com",
          phone: "+1 (555) 654-3210",
          location: "Los Angeles, CA",
          linkedin_url: "https://linkedin.com/in/lisawang",
          portfolio_url: "https://lisawang.design",
          skills: ["Figma", "UI/UX", "Prototyping", "Design Systems"],
          experience_years: 4,
          education: "BFA Design - Art Center College of Design",
          current_company: "Creative Agency",
          current_salary: 80000,
          expected_salary: 95000,
          status: "hired",
          role_category: "designer",
          applied_date: "2023-12-20T11:30:00Z"
        },
      ]
    },
    {
      id: "rejected",
      title: "Rejected",
      count: 1,
      color: "bg-red-500/10 border-red-500/30",
      candidates: []
    },
  ];

  const filteredColumns = columns.map(column => ({
    ...column,
    candidates: selectedRole === "all" 
      ? column.candidates 
      : column.candidates.filter(candidate => candidate.role_category === selectedRole)
  }));

  const handleViewCandidate = (candidate: any) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-3 min-h-[500px] pb-4">
          {filteredColumns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-72 space-y-3">
              <Card className={`${column.color} border-2`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span className="text-foreground truncate">{column.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {selectedRole === "all" ? column.count : column.candidates.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
              </Card>
              
              <div className="space-y-3">
                {column.candidates.map((candidate) => (
                  <Card key={candidate.id} className="bg-card border-border hover:border-primary/30 transition-all duration-200 cursor-pointer">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center flex-shrink-0">
                            <User className="h-3 w-3 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground text-xs truncate">{candidate.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">{candidate.position}</p>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground flex items-center space-x-1">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{candidate.email}</span>
                        </div>
                        
                        <div className="text-xs text-muted-foreground flex items-center space-x-1">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          <span>Applied {new Date(candidate.applied_date).toLocaleDateString()}</span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs bg-secondary/50 text-foreground border-border px-1 py-0">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 2 && (
                            <Badge variant="secondary" className="text-xs bg-secondary/50 text-foreground border-border px-1 py-0">
                              +{candidate.skills.length - 2}
                            </Badge>
                          )}
                        </div>

                        <div className="flex space-x-1 pt-1">
                          {column.id === "technical" && (
                            <Button size="sm" variant="outline" className="text-xs bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 h-6 px-2">
                              <Zap className="h-2 w-2 mr-1" />
                              Questions
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            className="text-xs h-6 px-2"
                            onClick={() => handleViewCandidate(candidate)}
                          >
                            <Eye className="h-2 w-2 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card className="bg-muted/20 border-dashed border-2 border-muted-foreground/30 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Plus className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Add candidate</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <CandidateProfileModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobDescription={sampleJobDescription}
      />
    </div>
  );
};

export default KanbanBoard;
