
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, User, Zap, Eye } from "lucide-react";

interface CandidateCardProps {
  name: string;
  position: string;
  email: string;
  status: "screening" | "technical-interview" | "final-interview" | "offer" | "hired";
  skills: string[];
  appliedDate: string;
}

const statusConfig = {
  screening: { label: "Phone Screening", color: "status-screening", bg: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
  "technical-interview": { label: "Technical Interview", color: "status-technical", bg: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  "final-interview": { label: "Final Interview", color: "status-final", bg: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  offer: { label: "Offer Extended", color: "status-offer", bg: "bg-green-500/10 text-green-400 border-green-500/30" },
  hired: { label: "Hired", color: "status-hired", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
};

const CandidateCard = ({ name, position, email, status, skills, appliedDate }: CandidateCardProps) => {
  return (
    <Card className="bg-card border-border hover:border-primary/30 transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-10 w-10 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base">{name}</h3>
                <p className="text-sm text-muted-foreground">{position}</p>
              </div>
              <div className={`status-dot ${statusConfig[status].color}`} />
            </div>
            
            <div className="flex items-center space-x-6 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Applied {appliedDate}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs bg-secondary/50 text-foreground border-border">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Badge className={`${statusConfig[status].bg} text-xs border font-medium`}>
                {statusConfig[status].label}
              </Badge>
              <div className="flex space-x-2">
                {status === "technical-interview" && (
                  <Button size="sm" variant="outline" className="text-xs bg-accent/10 border-accent/30 text-accent hover:bg-accent/20">
                    <Zap className="h-3 w-3 mr-1" />
                    Generate Questions
                  </Button>
                )}
                <Button size="sm" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
