import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Building2, 
  Calendar, 
  Mail, 
  Phone, 
  ExternalLink, 
  Github, 
  Globe, 
  DollarSign,
  Clock,
  FileText,
  Users,
  Star,
  MessageSquare,
  Briefcase,
  GraduationCap,
  Target,
  TrendingUp,
  Award
} from "lucide-react";

interface SourcingCandidate {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  skills: string[];
  education: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  matchScore: number;
  openToWork: boolean;
  avatar?: string;
}

interface SourcingCandidateModalProps {
  candidate: SourcingCandidate;
  children: React.ReactNode;
}

const SourcingCandidateModal = ({ candidate, children }: SourcingCandidateModalProps) => {
  const [recruiterNotes, setRecruiterNotes] = useState("");
  const [assessmentScores, setAssessmentScores] = useState({
    technical: 0,
    communication: 0,
    experience: 0,
    cultural_fit: 0
  });

  // Extended candidate data (would come from LinkedIn API/database)
  const extendedProfile = {
    ...candidate,
    // Technical Assessment
    skillsMatrix: [
      { skill: "React", years: 4, level: "Advanced" },
      { skill: "TypeScript", years: 3, level: "Intermediate" },
      { skill: "Node.js", years: 5, level: "Advanced" },
      { skill: "AWS", years: 2, level: "Intermediate" },
      { skill: "GraphQL", years: 2, level: "Beginner" }
    ],
    githubUrl: "https://github.com/candidate",
    portfolioUrl: "https://portfolio.dev",
    
    // Professional Details
    workHistory: [
      {
        company: candidate.company,
        title: candidate.title,
        duration: "2022 - Present",
        technologies: candidate.skills.slice(0, 4),
        achievements: ["Led development team", "Improved performance by 40%"]
      },
      {
        company: "Previous Company",
        title: "Frontend Developer",
        duration: "2020 - 2022",
        technologies: ["React", "JavaScript", "CSS"],
        achievements: ["Built component library", "Mentored junior developers"]
      }
    ],
    
    // Recruitment Specifics
    currentSalary: "$120,000 - $140,000",
    salaryExpectation: "$150,000 - $170,000",
    noticePeriod: "2 weeks",
    visaStatus: "Authorized to work",
    workPreference: "Remote/Hybrid",
    availability: "Available for interviews Mon-Fri 10AM-4PM",
    referralSource: "LinkedIn Recruiter",
    
    // Communication
    responseRate: "95%",
    lastActive: "2 hours ago",
    interviewHistory: [
      { company: "Tech Corp", stage: "Technical", status: "Passed", date: "2024-01-15" },
      { company: "Startup Inc", stage: "Final", status: "Offer declined", date: "2024-01-10" }
    ]
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{candidate.name}</h2>
              <p className="text-sm text-muted-foreground">{candidate.title} at {candidate.company}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={candidate.openToWork ? "default" : "secondary"} className="text-xs">
                  {candidate.openToWork ? "Open to work" : "Passive candidate"}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium">{candidate.matchScore}% match</span>
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.email || "Not provided"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-blue-600" />
                    <a href={candidate.linkedinUrl} className="text-sm text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      LinkedIn Profile
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <a href={extendedProfile.githubUrl} className="text-sm text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      GitHub Profile
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a href={extendedProfile.portfolioUrl} className="text-sm text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      Portfolio
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Professional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.experience} experience</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.company}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.education}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Last active: {extendedProfile.lastActive}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Skills & Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Work History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Work History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {extendedProfile.workHistory.map((job, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{job.title}</h4>
                      <span className="text-sm text-muted-foreground">{job.duration}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {job.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <ul className="text-xs text-muted-foreground">
                      {job.achievements.map((achievement, achIndex) => (
                        <li key={achIndex}>• {achievement}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Skills Matrix */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Skills Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {extendedProfile.skillsMatrix.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill.skill}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">{skill.years}y</span>
                        <Badge 
                          variant={skill.level === "Advanced" ? "default" : skill.level === "Intermediate" ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {skill.level}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* LinkedIn Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">LinkedIn Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profile Completeness</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Connections</span>
                    <span className="font-medium">500+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Posts Activity</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Endorsements</span>
                    <span className="font-medium">25+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Recommendations</span>
                    <span className="font-medium">8</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interview History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Interview History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {extendedProfile.interviewHistory.map((interview, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium text-sm">{interview.company}</span>
                      <p className="text-xs text-muted-foreground">{interview.stage} - {interview.date}</p>
                    </div>
                    <Badge 
                      variant={interview.status.includes("Passed") ? "default" : interview.status.includes("declined") ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {interview.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recruitment" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Compensation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Compensation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Range</span>
                    <span className="font-medium">{extendedProfile.currentSalary}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Expectation</span>
                    <span className="font-medium">{extendedProfile.salaryExpectation}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Availability */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Availability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notice Period</span>
                    <span className="font-medium">{extendedProfile.noticePeriod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Work Authorization</span>
                    <span className="font-medium">{extendedProfile.visaStatus}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Work Preference</span>
                    <span className="font-medium">{extendedProfile.workPreference}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Communication */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Communication & Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Response Rate</span>
                  <span className="font-medium text-green-600">{extendedProfile.responseRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Referral Source</span>
                  <span className="font-medium">{extendedProfile.referralSource}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Interview Availability:</span>
                  <p className="text-sm mt-1">{extendedProfile.availability}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Request Resume
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Add to Pipeline
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-4">
            {/* Assessment Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Technical Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "technical", label: "Technical Skills", icon: <Target className="h-4 w-4" /> },
                    { key: "communication", label: "Communication", icon: <MessageSquare className="h-4 w-4" /> },
                    { key: "experience", label: "Experience Level", icon: <Award className="h-4 w-4" /> },
                    { key: "cultural_fit", label: "Cultural Fit", icon: <Star className="h-4 w-4" /> }
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {item.icon}
                        <Label>{item.label}</Label>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Score (0-100)"
                        value={assessmentScores[item.key as keyof typeof assessmentScores] || ""}
                        onChange={(e) => setAssessmentScores({
                          ...assessmentScores,
                          [item.key]: parseInt(e.target.value) || 0
                        })}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recruiter Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Add your assessment notes, interview feedback, and next steps..."
                  value={recruiterNotes}
                  onChange={(e) => setRecruiterNotes(e.target.value)}
                  className="min-h-32"
                />
                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Save Assessment
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SourcingCandidateModal;