import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Mail, Phone, MapPin, Calendar, DollarSign, Building, GraduationCap, Github, Linkedin, Globe, FileText, MessageSquare, TrendingUp, Award, Target } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  resume_url?: string;
  cover_letter_url?: string;
  skills: string[];
  experience_years?: number;
  education?: string;
  current_company?: string;
  current_salary?: number;
  expected_salary?: number;
  availability_date?: string;
  status: string;
  role_category: string;
  applied_date: string;
}

interface TechnicalAssessment {
  coding_test_score?: number;
  system_design_score?: number;
  communication_score?: number;
  culture_fit_score?: number;
  technical_notes?: string;
  strengths?: string[];
  weaknesses?: string[];
  interview_feedback?: string;
  recommended_next_step?: string;
  overall_rating?: number;
  assessed_by?: string;
}

interface JobDescription {
  title: string;
  required_skills: string[];
  preferred_skills: string[];
  experience_level?: string;
  salary_range_min?: number;
  salary_range_max?: number;
}

interface CandidateProfileModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  jobDescription?: JobDescription;
}

const CandidateProfileModal = ({ candidate, isOpen, onClose, jobDescription }: CandidateProfileModalProps) => {
  const [assessment, setAssessment] = useState<TechnicalAssessment>({});
  const [activeTab, setActiveTab] = useState("overview");

  if (!candidate) return null;

  // Calculate skill match percentage
  const calculateSkillMatch = () => {
    if (!jobDescription || !jobDescription.required_skills) return 0;
    const matchedSkills = candidate.skills.filter(skill => 
      jobDescription.required_skills.some(reqSkill => 
        reqSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(reqSkill.toLowerCase())
      )
    );
    return Math.round((matchedSkills.length / jobDescription.required_skills.length) * 100);
  };

  const skillMatchPercentage = calculateSkillMatch();

  const formatSalary = (amount?: number) => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const ScoreCard = ({ title, score, icon }: { title: string; score?: number; icon: React.ReactNode }) => (
    <Card className="flex-1">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="space-y-2">
          <Progress value={score || 0} className="h-2" />
          <span className="text-2xl font-bold">{score || 0}%</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-primary">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{candidate.name}</h2>
              <p className="text-muted-foreground">{candidate.position}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills Match</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.email}</span>
                  </div>
                  {candidate.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{candidate.phone}</span>
                    </div>
                  )}
                  {candidate.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{candidate.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Applied {new Date(candidate.applied_date).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Professional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {candidate.current_company && (
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{candidate.current_company}</span>
                    </div>
                  )}
                  {candidate.experience_years && (
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{candidate.experience_years} years experience</span>
                    </div>
                  )}
                  {candidate.education && (
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{candidate.education}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Current: {formatSalary(candidate.current_salary)} | Expected: {formatSalary(candidate.expected_salary)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Links & Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.linkedin_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {candidate.github_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={candidate.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {candidate.portfolio_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={candidate.portfolio_url} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Portfolio
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Skills Match Analysis
                  <Badge variant={skillMatchPercentage >= 70 ? "default" : skillMatchPercentage >= 50 ? "secondary" : "destructive"}>
                    {skillMatchPercentage}% Match
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Skill Match</span>
                    <span>{skillMatchPercentage}%</span>
                  </div>
                  <Progress value={skillMatchPercentage} className="h-3" />
                </div>

                {jobDescription && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-green-600">Matched Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills
                          .filter(skill => 
                            jobDescription.required_skills?.some(reqSkill => 
                              reqSkill.toLowerCase().includes(skill.toLowerCase()) || 
                              skill.toLowerCase().includes(reqSkill.toLowerCase())
                            )
                          )
                          .map(skill => (
                            <Badge key={skill} variant="default" className="text-xs bg-green-100 text-green-800">
                              {skill}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-orange-600">Missing Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {jobDescription.required_skills
                          ?.filter(reqSkill => 
                            !candidate.skills.some(skill => 
                              skill.toLowerCase().includes(reqSkill.toLowerCase()) || 
                              reqSkill.toLowerCase().includes(skill.toLowerCase())
                            )
                          )
                          .map(skill => (
                            <Badge key={skill} variant="outline" className="text-xs border-orange-300 text-orange-700">
                              {skill}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">All Candidate Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ScoreCard 
                title="Coding Test" 
                score={assessment.coding_test_score} 
                icon={<Target className="h-4 w-4 text-blue-500" />} 
              />
              <ScoreCard 
                title="System Design" 
                score={assessment.system_design_score} 
                icon={<TrendingUp className="h-4 w-4 text-green-500" />} 
              />
              <ScoreCard 
                title="Communication" 
                score={assessment.communication_score} 
                icon={<MessageSquare className="h-4 w-4 text-purple-500" />} 
              />
              <ScoreCard 
                title="Culture Fit" 
                score={assessment.culture_fit_score} 
                icon={<Star className="h-4 w-4 text-yellow-500" />} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Technical Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    placeholder="Add technical assessment notes..."
                    value={assessment.technical_notes || ""}
                    onChange={(e) => setAssessment({...assessment, technical_notes: e.target.value})}
                    className="min-h-24"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interview Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    placeholder="Add interview feedback..."
                    value={assessment.interview_feedback || ""}
                    onChange={(e) => setAssessment({...assessment, interview_feedback: e.target.value})}
                    className="min-h-24"
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overall Rating & Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="overall-rating">Overall Rating (1-5)</Label>
                    <Input 
                      id="overall-rating"
                      type="number" 
                      min="1" 
                      max="5" 
                      value={assessment.overall_rating || ""}
                      onChange={(e) => setAssessment({...assessment, overall_rating: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="assessed-by">Assessed By</Label>
                    <Input 
                      id="assessed-by"
                      value={assessment.assessed_by || ""}
                      onChange={(e) => setAssessment({...assessment, assessed_by: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="next-step">Recommended Next Step</Label>
                  <Textarea 
                    id="next-step"
                    placeholder="What should be the next step for this candidate?"
                    value={assessment.recommended_next_step || ""}
                    onChange={(e) => setAssessment({...assessment, recommended_next_step: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  {candidate.resume_url ? (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        View Resume
                      </a>
                    </Button>
                  ) : (
                    <p className="text-muted-foreground text-sm">No resume uploaded</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  {candidate.cover_letter_url ? (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={candidate.cover_letter_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        View Cover Letter
                      </a>
                    </Button>
                  ) : (
                    <p className="text-muted-foreground text-sm">No cover letter uploaded</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Additional Document
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Upload portfolio, certifications, or other relevant documents
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateProfileModal;