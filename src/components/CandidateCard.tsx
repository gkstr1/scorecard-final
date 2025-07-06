
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, User, ArrowRight } from "lucide-react";

interface CandidateCardProps {
  name: string;
  position: string;
  email: string;
  status: "screening" | "technical-interview" | "final-interview" | "offer" | "hired";
  skills: string[];
  appliedDate: string;
}

const statusConfig = {
  screening: { label: "Screening", color: "bg-yellow-100 text-yellow-800" },
  "technical-interview": { label: "Technical Interview", color: "bg-blue-100 text-blue-800" },
  "final-interview": { label: "Final Interview", color: "bg-purple-100 text-purple-800" },
  offer: { label: "Offer Extended", color: "bg-green-100 text-green-800" },
  hired: { label: "Hired", color: "bg-emerald-100 text-emerald-800" },
};

const CandidateCard = ({ name, position, email, status, skills, appliedDate }: CandidateCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{name}</h3>
                <p className="text-sm text-gray-600">{position}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{appliedDate}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Badge className={statusConfig[status].color}>
                {statusConfig[status].label}
              </Badge>
              <div className="flex space-x-2">
                {status === "technical-interview" && (
                  <Button size="sm" variant="outline">
                    Generate Questions
                  </Button>
                )}
                <Button size="sm">
                  View Profile
                  <ArrowRight className="h-3 w-3 ml-1" />
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
