# Advanced Features - Detailed Specifications

## Overview
This document provides detailed technical specifications for the advanced features that will make Scorecard a comprehensive, enterprise-grade ATS platform.

---

## 🏆 Custom Scorecard System

### Scorecard Structure
```typescript
interface Scorecard {
  id: string;
  templateId: string;
  candidateId: string;
  interviewId: string;
  evaluatorId: string;
  
  // Scoring
  categories: ScoringCategory[];
  totalScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  
  // Metadata
  createdAt: Date;
  completedAt?: Date;
  status: 'draft' | 'completed' | 'reviewed';
  
  // Comments
  overallComments: string;
  recommendation: 'strong_hire' | 'hire' | 'no_hire' | 'strong_no_hire';
}

interface ScoringCategory {
  id: string;
  name: string;
  weight: number; // 1-10 multiplier
  maxPoints: number;
  scoredPoints: number;
  criteria: ScoringCriterion[];
  comments: string;
}

interface ScoringCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  scoredPoints: number;
  comments: string;
}

interface ScorecardTemplate {
  id: string;
  name: string;
  description: string;
  jobRole: string;
  categories: ScoringCategoryTemplate[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}
```

### Scorecard UI Components
```typescript
const ScorecardBuilder = () => {
  return (
    <div className="scorecard-builder">
      <div className="scorecard-header">
        <h2>Technical Interview Scorecard</h2>
        <div className="candidate-info">
          <span>{candidate.name}</span>
          <span>{job.title}</span>
        </div>
      </div>
      
      {categories.map(category => (
        <ScoringCategoryCard 
          key={category.id}
          category={category}
          onScoreChange={handleScoreChange}
        />
      ))}
      
      <div className="overall-assessment">
        <textarea 
          placeholder="Overall comments and recommendation..."
          value={overallComments}
          onChange={handleCommentsChange}
        />
        
        <div className="recommendation-buttons">
          {recommendations.map(rec => (
            <Button 
              key={rec}
              variant={recommendation === rec ? 'default' : 'outline'}
              onClick={() => setRecommendation(rec)}
            >
              {rec.replace('_', ' ').toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="scorecard-summary">
        <div className="total-score">
          {totalScore} / {maxPossibleScore} points ({percentageScore}%)
        </div>
      </div>
    </div>
  );
};
```

---

## 📞 Call Recording & Transcription

### Call Recording Architecture
```typescript
interface CallRecord {
  id: string;
  candidateId: string;
  recruiterId: string;
  callType: 'screening' | 'interview' | 'follow_up' | 'reference';
  
  // Call details
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  phoneNumber: string;
  
  // Recording
  recordingUrl: string;
  recordingStatus: 'recording' | 'processing' | 'completed' | 'failed';
  
  // Transcription
  transcriptId?: string;
  transcriptStatus: 'pending' | 'processing' | 'completed' | 'failed';
  transcript?: CallTranscript;
  
  // Metadata
  consentGiven: boolean;
  retentionDate: Date;
  tags: string[];
  notes: string;
}

interface CallTranscript {
  id: string;
  callRecordId: string;
  fullText: string;
  segments: TranscriptSegment[];
  confidence: number;
  language: string;
  processingTime: number;
  
  // Analysis
  sentiment: 'positive' | 'neutral' | 'negative';
  keyTopics: string[];
  actionItems: string[];
  summary: string;
}

interface TranscriptSegment {
  startTime: number; // seconds from call start
  endTime: number;
  speaker: 'recruiter' | 'candidate';
  text: string;
  confidence: number;
}
```

### Twilio Integration
```typescript
class CallRecordingService {
  async initiateRecordedCall(candidateId: string, phoneNumber: string): Promise<CallRecord> {
    // Start Twilio call with recording enabled
    const call = await this.twilioClient.calls.create({
      to: phoneNumber,
      from: this.twilioNumber,
      url: `${this.baseUrl}/api/twilio/call-handler`,
      record: true,
      recordingStatusCallback: `${this.baseUrl}/api/twilio/recording-callback`
    });
    
    // Create call record
    const callRecord = await this.createCallRecord({
      candidateId,
      twilioCallSid: call.sid,
      phoneNumber,
      recordingStatus: 'recording'
    });
    
    return callRecord;
  }
  
  async processRecording(recordingUrl: string, callRecordId: string): Promise<void> {
    // Download recording
    const audioBuffer = await this.downloadRecording(recordingUrl);
    
    // Send to transcription service
    const transcriptResult = await this.transcriptionService.transcribe(audioBuffer);
    
    // Process and store transcript
    await this.storeTranscript(callRecordId, transcriptResult);
    
    // Generate AI analysis
    const analysis = await this.aiService.analyzeTranscript(transcriptResult.fullText);
    
    // Update call record
    await this.updateCallRecord(callRecordId, {
      transcriptStatus: 'completed',
      transcript: transcriptResult,
      analysis
    });
  }
}
```

---

## 📊 Candidate Dispositioning

### Disposition System
```typescript
interface CandidateDisposition {
  id: string;
  candidateId: string;
  dispositionType: DispositionType;
  reason: string;
  customReason?: string;
  dispositionDate: Date;
  disposedBy: string;
  
  // Stage context
  stageAtDisposition: string;
  jobId: string;
  
  // Follow-up
  followUpDate?: Date;
  followUpNotes?: string;
  
  // Reversibility
  isReversible: boolean;
  reversedAt?: Date;
  reversedBy?: string;
  reverseReason?: string;
}

enum DispositionType {
  QUALIFIED = 'qualified',
  NOT_QUALIFIED = 'not_qualified',
  ON_HOLD = 'on_hold',
  FOLLOW_UP_NEEDED = 'follow_up_needed',
  WITHDRAWN = 'withdrawn',
  NO_RESPONSE = 'no_response',
  OVERQUALIFIED = 'overqualified',
  UNDERQUALIFIED = 'underqualified',
  LOCATION_MISMATCH = 'location_mismatch',
  SALARY_MISMATCH = 'salary_mismatch',
  CULTURE_FIT = 'culture_fit',
  TECHNICAL_SKILLS = 'technical_skills'
}

const DISPOSITION_REASONS = {
  [DispositionType.NOT_QUALIFIED]: [
    'Lacks required technical skills',
    'Insufficient experience level',
    'Poor communication skills',
    'Not interested in role',
    'Salary expectations too high',
    'Location requirements not met',
    'Failed technical assessment',
    'Cultural fit concerns'
  ],
  [DispositionType.ON_HOLD]: [
    'Waiting for hiring manager decision',
    'Budget approval pending',
    'Position temporarily frozen',
    'Candidate requested delay'
  ],
  [DispositionType.FOLLOW_UP_NEEDED]: [
    'Needs additional screening',
    'References pending',
    'Portfolio review required',
    'Technical assessment scheduled'
  ]
};
```

### Disposition UI
```typescript
const DispositionModal = ({ candidate, onDisposition, onClose }) => {
  const [dispositionType, setDispositionType] = useState<DispositionType>();
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [followUpDate, setFollowUpDate] = useState<Date>();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Disposition Candidate: {candidate.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Disposition Type</Label>
            <Select value={dispositionType} onValueChange={setDispositionType}>
              <SelectTrigger>
                <SelectValue placeholder="Select disposition" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DispositionType).map(type => (
                  <SelectItem key={type} value={type}>
                    {type.replace('_', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {dispositionType && (
            <div>
              <Label>Reason</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {DISPOSITION_REASONS[dispositionType]?.map(reasonText => (
                    <SelectItem key={reasonText} value={reasonText}>
                      {reasonText}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom reason...</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {reason === 'custom' && (
            <div>
              <Label>Custom Reason</Label>
              <Textarea 
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter custom disposition reason..."
              />
            </div>
          )}
          
          {dispositionType === DispositionType.FOLLOW_UP_NEEDED && (
            <div>
              <Label>Follow-up Date</Label>
              <Input 
                type="date"
                value={followUpDate ? format(followUpDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => setFollowUpDate(new Date(e.target.value))}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleDisposition}>Apply Disposition</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

---

## 📝 Advanced Note Taking System

### Note Structure
```typescript
interface CandidateNote {
  id: string;
  candidateId: string;
  authorId: string;
  
  // Content
  title: string;
  content: string; // Rich text HTML
  plainText: string; // For searching
  
  // Categorization
  category: NoteCategory;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  
  // Visibility
  isPrivate: boolean;
  sharedWith: string[]; // User IDs
  
  // Context
  relatedCallId?: string;
  relatedInterviewId?: string;
  relatedEmailId?: string;
  stageAtCreation: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  
  // Follow-up
  hasFollowUp: boolean;
  followUpDate?: Date;
  followUpCompleted?: boolean;
}

enum NoteCategory {
  INTERVIEW = 'interview',
  PHONE_CALL = 'phone_call',
  EMAIL = 'email',
  GENERAL = 'general',
  TECHNICAL = 'technical',
  CULTURAL = 'cultural',
  REFERENCE = 'reference',
  FOLLOW_UP = 'follow_up'
}

interface NoteTemplate {
  id: string;
  name: string;
  category: NoteCategory;
  template: string; // HTML template with placeholders
  placeholders: NotePlaceholder[];
  isActive: boolean;
}

interface NotePlaceholder {
  key: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'select';
  options?: string[]; // For select type
  required: boolean;
}
```

### Rich Text Editor Component
```typescript
const CandidateNoteEditor = ({ candidateId, initialNote, onSave, onCancel }) => {
  const [note, setNote] = useState(initialNote || {
    title: '',
    content: '',
    category: NoteCategory.GENERAL,
    isPrivate: false,
    tags: [],
    priority: 'medium'
  });

  return (
    <div className="note-editor">
      <div className="note-header">
        <Input 
          value={note.title}
          onChange={(e) => setNote({...note, title: e.target.value})}
          placeholder="Note title..."
          className="text-lg font-medium"
        />
        
        <div className="note-meta flex gap-4">
          <Select value={note.category} onValueChange={(cat) => setNote({...note, category: cat})}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(NoteCategory).map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat.replace('_', ' ').toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={note.priority} onValueChange={(pri) => setNote({...note, priority: pri})}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="private"
              checked={note.isPrivate}
              onCheckedChange={(checked) => setNote({...note, isPrivate: checked})}
            />
            <Label htmlFor="private">Private note</Label>
          </div>
        </div>
      </div>
      
      <div className="note-content">
        <RichTextEditor 
          value={note.content}
          onChange={(content) => setNote({...note, content})}
          placeholder="Enter your notes..."
          features={['bold', 'italic', 'underline', 'bullet-list', 'numbered-list', 'link']}
        />
      </div>
      
      <div className="note-tags">
        <TagInput 
          tags={note.tags}
          onChange={(tags) => setNote({...note, tags})}
          placeholder="Add tags..."
        />
      </div>
      
      <div className="note-actions">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(note)}>Save Note</Button>
      </div>
    </div>
  );
};
```

---

## 🤖 Advanced AI Chat Feature

### AI Chat Architecture
```typescript
interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  type: 'user' | 'assistant' | 'system';
  timestamp: Date;
  
  // Context
  candidateId?: string;
  jobId?: string;
  context: ChatContext;
  
  // Actions performed
  actionsPerformed: ChatAction[];
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

interface ChatContext {
  currentPage: string;
  selectedCandidates: string[];
  activeFilters: any;
  recentActions: string[];
}

interface ChatAction {
  type: string;
  description: string;
  parameters: any;
  result: any;
  timestamp: Date;
}

class AIAssistant {
  async processCommand(message: string, context: ChatContext): Promise<ChatResponse> {
    // Parse natural language command
    const intent = await this.parseIntent(message);
    
    switch (intent.action) {
      case 'schedule_interview':
        return await this.scheduleInterview(intent.parameters, context);
      
      case 'search_candidates':
        return await this.searchCandidates(intent.parameters, context);
      
      case 'create_task':
        return await this.createTask(intent.parameters, context);
      
      case 'send_email':
        return await this.sendEmail(intent.parameters, context);
      
      case 'generate_report':
        return await this.generateReport(intent.parameters, context);
      
      case 'update_candidate':
        return await this.updateCandidate(intent.parameters, context);
      
      default:
        return await this.handleGenericQuery(message, context);
    }
  }
  
  private async parseIntent(message: string): Promise<Intent> {
    const prompt = `
      Parse this recruiting command and extract the intent and parameters:
      "${message}"
      
      Available actions: schedule_interview, search_candidates, create_task, 
      send_email, generate_report, update_candidate, move_candidate, 
      create_job, disposition_candidate
      
      Return JSON with: { action, parameters, confidence }
    `;
    
    const response = await this.openaiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1
    });
    
    return JSON.parse(response.choices[0].message.content);
  }
  
  private async scheduleInterview(params: any, context: ChatContext): Promise<ChatResponse> {
    const { candidateName, date, time, type } = params;
    
    // Find candidate
    const candidate = await this.findCandidateByName(candidateName, context);
    if (!candidate) {
      return {
        message: `I couldn't find a candidate named "${candidateName}". Could you be more specific?`,
        actions: [],
        suggestions: ['Show me all candidates with similar names']
      };
    }
    
    // Schedule the interview
    const interview = await this.interviewService.schedule({
      candidateId: candidate.id,
      date: new Date(`${date} ${time}`),
      type,
      recruiterId: context.userId
    });
    
    return {
      message: `✅ Interview scheduled with ${candidate.name} for ${date} at ${time}. Zoom link and calendar invite have been sent.`,
      actions: [
        {
          type: 'interview_scheduled',
          description: `Scheduled ${type} interview with ${candidate.name}`,
          result: interview
        }
      ],
      suggestions: [
        'Generate interview questions for this candidate',
        'Send a reminder SMS to the candidate',
        'Add a follow-up task'
      ]
    };
  }
}
```

### Chat Interface Component
```typescript
const AIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: generateId(),
      userId: currentUser.id,
      content: input,
      type: 'user',
      timestamp: new Date(),
      context: getCurrentContext(),
      actionsPerformed: [],
      status: 'completed'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      const response = await aiAssistant.processCommand(input, getCurrentContext());
      
      const assistantMessage: ChatMessage = {
        id: generateId(),
        userId: 'assistant',
        content: response.message,
        type: 'assistant',
        timestamp: new Date(),
        context: getCurrentContext(),
        actionsPerformed: response.actions,
        status: 'completed'
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // Handle error
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="ai-chat">
      <div className="chat-header">
        <h3>AI Assistant</h3>
        <div className="chat-status">
          {isProcessing ? 'Processing...' : 'Ready'}
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.map(message => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
      </div>
      
      <div className="chat-input">
        <Input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask me to schedule interviews, search candidates, create tasks..."
          disabled={isProcessing}
        />
        <Button onClick={handleSendMessage} disabled={isProcessing || !input.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="quick-actions">
        <Button size="sm" variant="outline" onClick={() => setInput('Show me today\'s interviews')}>
          Today's Interviews
        </Button>
        <Button size="sm" variant="outline" onClick={() => setInput('Find JavaScript developers in San Francisco')}>
          Search Candidates
        </Button>
        <Button size="sm" variant="outline" onClick={() => setInput('Create a follow-up task for John Doe')}>
          Create Task
        </Button>
      </div>
    </div>
  );
};
```

This comprehensive advanced features specification provides the technical foundation for implementing all the requested features. Each system is designed to integrate seamlessly with the existing Scorecard platform while providing enterprise-grade functionality.

These features will position Scorecard as a truly comprehensive, AI-powered recruiting platform that can compete with and exceed the capabilities of established players like Loxo.
