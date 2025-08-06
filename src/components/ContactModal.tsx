import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Search, 
  Send, 
  List, 
  FileText,
  Video,
  Zap,
  Star,
  DollarSign,
  Linkedin,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Import our new LinkedIn components
import LinkedInConnectButton from "./LinkedInConnectButton";
import LinkedInProfilePreview from "./LinkedInProfilePreview";
import LinkedInDetailedProfile from "./LinkedInDetailedProfile";
import { LinkedInProfile } from "@/services/linkedinService";
import { useLinkedIn } from "@/hooks/useLinkedIn";

interface ContactModalProps {
  candidate: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    linkedInId?: string;
    linkedInProfile?: Partial<LinkedInProfile>;
  };
  children: React.ReactNode;
}

const ContactModal = ({ candidate, children }: ContactModalProps) => {
  const [emailSearchQuery, setEmailSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [selectedSequence, setSelectedSequence] = useState("");
  const [selectedEmailFromLinkedIn, setSelectedEmailFromLinkedIn] = useState("");
  
  // Use the LinkedIn hook for real LinkedIn integration
  const { 
    isConnected: isLinkedInConnected, 
    isLoading: isLoadingLinkedInProfile, 
    profile: linkedInProfile, 
    error: linkedInError,
    connect: connectLinkedIn,
    fetchProfile: refreshLinkedInProfile
  } = useLinkedIn();

  const emailTemplates = [
    { id: "intro", name: "Introduction", preview: "Hi {name}, I came across your profile..." },
    { id: "follow-up", name: "Follow-up", preview: "Following up on our previous conversation..." },
    { id: "opportunity", name: "Opportunity", preview: "I have an exciting opportunity that might interest you..." },
    { id: "custom", name: "Custom", preview: "Write your own message..." }
  ];

  const sequences = [
    { id: "tech-outreach", name: "Tech Talent Outreach", steps: 5 },
    { id: "passive-candidate", name: "Passive Candidate", steps: 3 },
    { id: "executive-search", name: "Executive Search", steps: 4 }
  ];

  // Determine email options based on LinkedIn and candidate data
  const [emailOptions, setEmailOptions] = useState<Array<{ email: string; confidence: number; source: string }>>([]);

  // Update email options whenever LinkedIn profile changes
  useEffect(() => {
    const options: Array<{ email: string; confidence: number; source: string }> = [];
    
    // Add LinkedIn email if available (highest confidence)
    if (linkedInProfile?.email) {
      options.push({
        email: linkedInProfile.email,
        confidence: 95,
        source: "LinkedIn"
      });
    }
    
    // Add candidate email if available and different from LinkedIn email
    if (candidate.email && (!linkedInProfile?.email || candidate.email !== linkedInProfile.email)) {
      options.push({
        email: candidate.email,
        confidence: 90,
        source: "Scorecard Database"
      });
    }
    
    // Add work email based on name and company if available
    if (linkedInProfile?.firstName && linkedInProfile?.lastName && linkedInProfile?.currentPosition?.company) {
      const companyName = linkedInProfile.currentPosition.company.toLowerCase().replace(/\s+/g, '');
      const firstName = linkedInProfile.firstName.toLowerCase();
      const lastName = linkedInProfile.lastName.toLowerCase();
      
      // Format: first.last@company.com
      const workEmail = `${firstName}.${lastName}@${companyName}.com`;
      options.push({
        email: workEmail,
        confidence: 75,
        source: "Generated"
      });
    }
    
    // Update state with new options
    setEmailOptions(options.length > 0 ? options : [{ 
      email: candidate.email || `${candidate.name.toLowerCase().replace(/\s+/g, '.')}@example.com`, 
      confidence: 50, 
      source: "Default" 
    }]);
    
  }, [linkedInProfile, candidate.email, candidate.name]);

  // Update email content with LinkedIn data if connected
  useEffect(() => {
    if (isLinkedInConnected && linkedInProfile) {
      // Replace placeholders with LinkedIn data
      const updatedContent = emailContent
        .replace(/{name}/g, `${linkedInProfile.firstName || ''}`)
        .replace(/{full_name}/g, `${linkedInProfile.firstName || ''} ${linkedInProfile.lastName || ''}`)
        .replace(/{company}/g, linkedInProfile.currentPosition?.company || '')
        .replace(/{position}/g, linkedInProfile.currentPosition?.title || '');
      
      setEmailContent(updatedContent);
    }
  }, [isLinkedInConnected, linkedInProfile, emailContent]);

  // Function to handle LinkedIn connection
  const handleLinkedInConnect = useCallback(() => {
    connectLinkedIn();
  }, [connectLinkedIn]);

  const handlePhoneCall = () => {
    if (candidate.phone) {
      window.open(`tel:${candidate.phone}`);
    }
  };

  const handleVideoCall = () => {
    // This would integrate with Zoom/Teams/etc
    window.open("https://zoom.us/start/videomeeting");
  };

  const handleSMS = () => {
    if (candidate.phone) {
      window.open(`sms:${candidate.phone}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Contact {candidate.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* LinkedIn Connect Button */}
        <div className="mb-4">
          <LinkedInConnectButton 
            onConnect={handleLinkedInConnect} 
            isConnected={isLinkedInConnected} 
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LinkedIn Profile Preview - Shown when connected or loading */}
          {(isLinkedInConnected || isLoadingLinkedInProfile) && (
            <div className="md:col-span-2 mb-2">
              <LinkedInProfilePreview 
                profile={linkedInProfile}
                isLoading={isLoadingLinkedInProfile}
                onRefresh={refreshLinkedInProfile}
              />
            </div>
          )}
          
          {/* LinkedIn Detailed Profile - Shown when connected and data loaded */}
          {isLinkedInConnected && !isLoadingLinkedInProfile && (
            <div className="md:col-span-2 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium flex items-center">
                  <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                  LinkedIn Professional Details
                </h3>
                <Badge variant="outline" className="text-xs">
                  Verified Data
                </Badge>
              </div>
              <LinkedInDetailedProfile 
                profile={linkedInProfile} 
                isLoading={isLoadingLinkedInProfile} 
              />
            </div>
          )}
          {/* Email Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email Outreach</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email Search */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Find Email</span>
                  {!isLinkedInConnected && (
                    <Badge variant="secondary" className="text-xs">
                      <DollarSign className="h-3 w-3 mr-1" />
                      1 Credit
                    </Badge>
                  )}
                  {isLinkedInConnected && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                      <Linkedin className="h-3 w-3 mr-1" />
                      LinkedIn Data
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  {emailOptions.map((email, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-2 border rounded-lg ${selectedEmailFromLinkedIn === email.email ? 'bg-blue-50 border-blue-200' : ''}`}
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium">{email.email}</div>
                        <div className="text-xs text-muted-foreground">{email.source}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs">{email.confidence}%</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant={selectedEmailFromLinkedIn === email.email ? "default" : "outline"} 
                          className="h-6 text-xs"
                          onClick={() => setSelectedEmailFromLinkedIn(email.email)}
                        >
                          {selectedEmailFromLinkedIn === email.email ? "Selected" : "Use"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Template Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Template</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {template.preview}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Email Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Compose your message..."
                  value={emailContent || (linkedInProfile && isLinkedInConnected ? 
                    `Hi ${linkedInProfile.firstName},

I came across your profile and was impressed with your experience at ${linkedInProfile.currentPosition?.company}. I'm reaching out about a potential opportunity that might be a good fit for someone with your background in ${linkedInProfile.skills?.slice(0, 3).join(', ')}.

Would you be open to a quick chat about this role?

Best regards,
[Your Name]` : '')}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="min-h-24"
                />
              </div>

              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  <Send className="h-3 w-3 mr-1" />
                  Send Now
                </Button>
                <Button size="sm" variant="outline">
                  <FileText className="h-3 w-3 mr-1" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sequences & Other Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Automation & Calls</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add to Sequence */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <List className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Add to Sequence</span>
                </div>
                <Select value={selectedSequence} onValueChange={setSelectedSequence}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a sequence" />
                  </SelectTrigger>
                  <SelectContent>
                    {sequences.map((sequence) => (
                      <SelectItem key={sequence.id} value={sequence.id}>
                        <div>
                          <div className="font-medium">{sequence.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {sequence.steps} steps
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" className="w-full">
                  <List className="h-3 w-3 mr-1" />
                  Add to Sequence
                </Button>
              </div>

              <Separator />

              {/* Communication Options */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Direct Communication</span>
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handlePhoneCall}
                    className="justify-start"
                    disabled={!candidate.phone}
                  >
                    <Phone className="h-3 w-3 mr-2" />
                    Phone Call
                    {candidate.phone && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {candidate.phone}
                      </span>
                    )}
                  </Button>

                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleVideoCall}
                    className="justify-start"
                  >
                    <Video className="h-3 w-3 mr-2" />
                    Video Call
                    <span className="ml-auto text-xs text-muted-foreground">
                      Zoom/Teams
                    </span>
                  </Button>

                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleSMS}
                    className="justify-start"
                    disabled={!candidate.phone}
                  >
                    <MessageSquare className="h-3 w-3 mr-2" />
                    SMS
                    {candidate.phone && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        Text message
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Quick Actions */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Quick Actions</span>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    View Profile
                  </Button>
                  <Button size="sm" variant="outline">
                    <Star className="h-3 w-3 mr-1" />
                    Add Notes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;