
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, Zap, Eye, Plus } from "lucide-react";

const KanbanBoard = () => {
  const columns = [
    {
      id: "applied",
      title: "New Applications",
      count: 8,
      color: "bg-blue-500/10 border-blue-500/30",
      candidates: [
        {
          id: 1,
          name: "Sarah Chen",
          position: "Senior React Developer",
          email: "sarah.chen@email.com",
          skills: ["React", "TypeScript", "Node.js"],
          appliedDate: "2 days ago",
        },
        {
          id: 2,
          name: "Michael Rodriguez",
          position: "Full Stack Engineer",
          email: "m.rodriguez@email.com",
          skills: ["Python", "Django", "PostgreSQL"],
          appliedDate: "5 days ago",
        },
      ]
    },
    {
      id: "screening",
      title: "Phone Screening",
      count: 6,
      color: "bg-yellow-500/10 border-yellow-500/30",
      candidates: [
        {
          id: 3,
          name: "Emily Johnson",
          position: "Frontend Developer",
          email: "emily.j@email.com",
          skills: ["Vue.js", "JavaScript", "CSS"],
          appliedDate: "1 week ago",
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
          id: 4,
          name: "David Kim",
          position: "Backend Engineer",
          email: "david.kim@email.com",
          skills: ["Java", "Spring", "MySQL"],
          appliedDate: "3 days ago",
        },
      ]
    },
    {
      id: "final",
      title: "Final Round",
      count: 3,
      color: "bg-orange-500/10 border-orange-500/30",
      candidates: []
    },
    {
      id: "offer",
      title: "Offer Extended",
      count: 3,
      color: "bg-green-500/10 border-green-500/30",
      candidates: [
        {
          id: 5,
          name: "Lisa Wang",
          position: "Product Designer",
          email: "lisa.wang@email.com",
          skills: ["Figma", "UI/UX", "Prototyping"],
          appliedDate: "2 weeks ago",
        },
      ]
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 min-h-[500px]">
        {columns.map((column) => (
          <div key={column.id} className="space-y-3">
            <Card className={`${column.color} border-2`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{column.title}</span>
                  <Badge variant="secondary" className="text-xs">
                    {column.count}
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
                        <div className="h-6 w-6 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center">
                          <User className="h-3 w-3 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground text-xs">{candidate.name}</h4>
                          <p className="text-xs text-muted-foreground">{candidate.position}</p>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{candidate.email}</span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Applied {candidate.appliedDate}</span>
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
                        <Button size="sm" className="text-xs h-6 px-2">
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
    </div>
  );
};

export default KanbanBoard;
