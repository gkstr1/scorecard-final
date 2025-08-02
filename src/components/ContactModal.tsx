import { useState } from "react";
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
  DollarSign
} from "lucide-react";

interface ContactModalProps {
  candidate: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  children: React.ReactNode;
}

const ContactModal = ({ candidate, children }: ContactModalProps) => {
  const [emailSearchQuery, setEmailSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [selectedSequence, setSelectedSequence] = useState("");

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

  const mockEmails = [
    { email: "sarah.chen@stripe.com", confidence: 95, source: "LinkedIn" },
    { email: "s.chen@work-email.com", confidence: 87, source: "Company Website" },
    { email: "sarah.c.dev@gmail.com", confidence: 72, source: "GitHub" }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Badge variant="secondary" className="text-xs">
                    <DollarSign className="h-3 w-3 mr-1" />
                    1 Credit
                  </Badge>
                </div>
                <div className="space-y-2">
                  {mockEmails.map((email, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{email.email}</div>
                        <div className="text-xs text-muted-foreground">{email.source}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs">{email.confidence}%</span>
                        </div>
                        <Button size="sm" variant="outline" className="h-6 text-xs">
                          Use
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
                  value={emailContent}
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