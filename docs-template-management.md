# Template Management & Outreach Sequences

## Overview
The Scorecard ATS template management system enables recruiters to create, manage, and automate multi-channel outreach campaigns using SMS, email, LinkedIn, and manual tasks. This system provides sophisticated sequence automation for consistent candidate engagement.

---

## 📧 Email Template Management

### Template Creation Interface
```typescript
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: TemplateVariable[];
  category: 'outreach' | 'follow_up' | 'interview' | 'offer' | 'rejection';
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  usageCount: number;
}

interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'boolean';
  required: boolean;
  defaultValue?: string;
  description: string;
}
```

### Email Template Categories
- **Initial Outreach**: First contact templates
- **Follow-up**: Sequence follow-up emails
- **Interview**: Interview scheduling and confirmation
- **Offer**: Job offer and negotiation
- **Rejection**: Professional rejection emails

### Variable Substitution System
```typescript
// Available template variables
const TEMPLATE_VARIABLES = {
  // Candidate variables
  '{{candidate.firstName}}': 'Candidate first name',
  '{{candidate.lastName}}': 'Candidate last name',
  '{{candidate.fullName}}': 'Candidate full name',
  '{{candidate.email}}': 'Candidate email',
  '{{candidate.phone}}': 'Candidate phone',
  '{{candidate.currentRole}}': 'Current job title',
  '{{candidate.currentCompany}}': 'Current company',
  '{{candidate.location}}': 'Candidate location',
  '{{candidate.experience}}': 'Years of experience',
  '{{candidate.skills}}': 'Technical skills list',
  
  // Job variables
  '{{job.title}}': 'Job title',
  '{{job.company}}': 'Company name',
  '{{job.location}}': 'Job location',
  '{{job.salary}}': 'Salary range',
  '{{job.description}}': 'Job description',
  
  // Recruiter variables
  '{{recruiter.firstName}}': 'Recruiter first name',
  '{{recruiter.lastName}}': 'Recruiter last name',
  '{{recruiter.email}}': 'Recruiter email',
  '{{recruiter.phone}}': 'Recruiter phone',
  '{{recruiter.company}}': 'Recruiter company',
  '{{recruiter.signature}}': 'Email signature',
  
  // Dynamic variables
  '{{today}}': 'Current date',
  '{{interviewDate}}': 'Scheduled interview date',
  '{{zoomLink}}': 'Zoom meeting link',
  '{{calendarLink}}': 'Calendar booking link'
};
```

---

## 📱 SMS Template Management

### SMS Template Structure
```typescript
interface SMSTemplate {
  id: string;
  name: string;
  message: string;
  variables: TemplateVariable[];
  category: 'outreach' | 'follow_up' | 'interview' | 'reminder';
  isActive: boolean;
  characterCount: number;
  estimatedCost: number;
  complianceChecked: boolean;
  createdBy: string;
  createdAt: Date;
  usageCount: number;
}
```

### SMS Template Categories
- **Initial Outreach**: First SMS contact
- **Follow-up**: Sequence SMS messages
- **Interview**: Interview reminders and confirmations
- **Reminder**: General reminders and check-ins

### SMS Compliance Features
- **Character count tracking** (160 char limit warnings)
- **TCPA compliance checking**
- **Opt-out language inclusion** ("Reply STOP to opt out")
- **Time zone awareness** for sending restrictions
- **Do Not Call list integration**

---

## 🔄 Outreach Sequence Automation

### Sequence Builder Interface
```typescript
interface OutreachSequence {
  id: string;
  name: string;
  description: string;
  steps: SequenceStep[];
  isActive: boolean;
  triggerConditions: TriggerCondition[];
  targetAudience: AudienceFilter;
  createdBy: string;
  createdAt: Date;
  stats: SequenceStats;
}

interface SequenceStep {
  id: string;
  stepNumber: number;
  type: 'email' | 'sms' | 'linkedin' | 'manual_task' | 'wait';
  templateId?: string;
  delay: number; // Hours to wait before executing
  delayUnit: 'hours' | 'days' | 'weeks';
  conditions: StepCondition[];
  isActive: boolean;
}

interface StepCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string;
  logicOperator?: 'AND' | 'OR';
}
```

### Sequence Step Types

#### 1. Email Steps
```typescript
interface EmailStep extends SequenceStep {
  type: 'email';
  emailTemplateId: string;
  sendFromAddress: string;
  trackOpens: boolean;
  trackClicks: boolean;
  attachments?: Attachment[];
}
```

#### 2. SMS Steps
```typescript
interface SMSStep extends SequenceStep {
  type: 'sms';
  smsTemplateId: string;
  fromNumber: string;
  respectTimeZone: boolean;
  allowedHours: {
    start: string; // "09:00"
    end: string;   // "17:00"
  };
}
```

#### 3. LinkedIn Steps
```typescript
interface LinkedInStep extends SequenceStep {
  type: 'linkedin';
  action: 'connect' | 'message' | 'view_profile' | 'endorse';
  messageTemplate?: string;
  connectionNote?: string;
  requiresManualApproval: boolean;
}
```

#### 4. Manual Task Steps
```typescript
interface ManualTaskStep extends SequenceStep {
  type: 'manual_task';
  taskTitle: string;
  taskDescription: string;
  estimatedDuration: number; // minutes
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: Date;
}
```

#### 5. Wait Steps
```typescript
interface WaitStep extends SequenceStep {
  type: 'wait';
  waitDuration: number;
  waitUnit: 'hours' | 'days' | 'weeks';
  waitCondition?: 'fixed_time' | 'business_days_only' | 'until_response';
}
```

---

## 🎯 Sequence Triggers & Conditions

### Trigger Conditions
```typescript
interface TriggerCondition {
  event: 'candidate_added' | 'stage_changed' | 'no_response' | 'manual_start';
  criteria: {
    candidateStage?: string[];
    jobCategories?: string[];
    candidateSource?: string[];
    experienceLevel?: string[];
    location?: string[];
    skills?: string[];
  };
  timeframe?: {
    after: number; // hours
    before?: number; // hours
  };
}
```

### Example Sequence Triggers
- **New Candidate Added**: Start outreach when candidate enters "Sourced" stage
- **Stage Change**: Trigger follow-up when moved to "Initial Screening"
- **No Response**: Start follow-up sequence after 48 hours of no response
- **Manual Start**: Recruiter manually starts sequence for specific candidates

---

## 📊 Analytics & Reporting

### Sequence Performance Metrics
```typescript
interface SequenceStats {
  totalCandidates: number;
  activeSequences: number;
  completedSequences: number;
  responseRate: number;
  openRate: number; // Email
  clickRate: number; // Email
  smsDeliveryRate: number;
  linkedinAcceptanceRate: number;
  conversionToInterview: number;
  averageTimeToResponse: number; // hours
  costPerSequence: number;
}
```

### Template Performance Tracking
- **Usage frequency** per template
- **Response rates** by template
- **Conversion metrics** (response → interview → hire)
- **A/B testing** capabilities for template optimization

---

## 🔧 Settings Page Implementation

### Template Management UI Components

#### 1. Template Library
```typescript
const TemplateLibrary = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <div className="template-library">
      <div className="template-filters">
        <CategoryFilter 
          categories={TEMPLATE_CATEGORIES}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
        <SearchInput 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search templates..."
        />
      </div>
      
      <div className="template-grid">
        {filteredTemplates.map(template => (
          <TemplateCard 
            key={template.id}
            template={template}
            onEdit={handleEditTemplate}
            onDelete={handleDeleteTemplate}
            onDuplicate={handleDuplicateTemplate}
          />
        ))}
      </div>
    </div>
  );
};
```

#### 2. Template Editor
```typescript
const TemplateEditor = ({ template, onSave, onCancel }) => {
  const [formData, setFormData] = useState(template || {});
  const [previewMode, setPreviewMode] = useState(false);

  return (
    <div className="template-editor">
      <div className="editor-header">
        <input 
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Template name"
          className="template-name-input"
        />
        <div className="editor-actions">
          <Button onClick={() => setPreviewMode(!previewMode)}>
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button onClick={onSave}>Save Template</Button>
        </div>
      </div>
      
      {!previewMode ? (
        <div className="editor-content">
          <div className="template-fields">
            <input 
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              placeholder="Email subject"
            />
            <textarea 
              value={formData.body}
              onChange={(e) => setFormData({...formData, body: e.target.value})}
              placeholder="Email body"
              rows={15}
            />
          </div>
          
          <div className="variable-sidebar">
            <h3>Available Variables</h3>
            <VariableList 
              variables={TEMPLATE_VARIABLES}
              onInsert={handleVariableInsert}
            />
          </div>
        </div>
      ) : (
        <TemplatePreview template={formData} />
      )}
    </div>
  );
};
```

#### 3. Sequence Builder
```typescript
const SequenceBuilder = ({ sequence, onSave }) => {
  const [steps, setSteps] = useState<SequenceStep[]>(sequence?.steps || []);
  const [draggedStep, setDraggedStep] = useState<number | null>(null);

  return (
    <div className="sequence-builder">
      <div className="sequence-header">
        <input 
          type="text"
          value={sequence.name}
          placeholder="Sequence name"
          className="sequence-name-input"
        />
        <Button onClick={onSave}>Save Sequence</Button>
      </div>
      
      <div className="sequence-steps">
        {steps.map((step, index) => (
          <SequenceStepCard 
            key={step.id}
            step={step}
            index={index}
            onEdit={handleEditStep}
            onDelete={handleDeleteStep}
            onDragStart={() => setDraggedStep(index)}
            onDrop={handleStepReorder}
          />
        ))}
        
        <AddStepButton onClick={handleAddStep} />
      </div>
      
      <div className="sequence-settings">
        <TriggerConditionEditor 
          conditions={sequence.triggerConditions}
          onChange={handleTriggerChange}
        />
        <AudienceFilterEditor 
          filters={sequence.targetAudience}
          onChange={handleAudienceChange}
        />
      </div>
    </div>
  );
};
```

---

## 🚀 Implementation Roadmap

### Phase 1: Template Management (Week 1-2)
- [ ] Create email template CRUD operations
- [ ] Implement SMS template management
- [ ] Build template editor with variable substitution
- [ ] Add template categories and search
- [ ] Implement template preview functionality

### Phase 2: Basic Sequences (Week 3-4)
- [ ] Create sequence builder interface
- [ ] Implement email and SMS sequence steps
- [ ] Add wait step functionality
- [ ] Build trigger condition system
- [ ] Create sequence execution engine

### Phase 3: Advanced Features (Week 5-6)
- [ ] Add LinkedIn automation steps
- [ ] Implement manual task steps
- [ ] Build advanced conditional logic
- [ ] Add A/B testing capabilities
- [ ] Create analytics dashboard

### Phase 4: Integration & Optimization (Week 7-8)
- [ ] Integrate with existing candidate pipeline
- [ ] Add compliance and safety features
- [ ] Implement performance monitoring
- [ ] Create sequence templates library
- [ ] Add team collaboration features

---

## 🔒 Compliance & Safety

### Email Compliance
- **CAN-SPAM Act compliance**
- **GDPR consent tracking**
- **Unsubscribe link inclusion**
- **Sender reputation monitoring**

### SMS Compliance
- **TCPA compliance checking**
- **Opt-out processing (STOP, UNSUBSCRIBE)**
- **Time zone restrictions**
- **Do Not Call list integration**

### LinkedIn Compliance
- **Rate limiting** to avoid account restrictions
- **Connection request limits**
- **Message frequency controls**
- **Profile view throttling**

This comprehensive template management and outreach sequence system will transform how recruiters engage with candidates, providing consistent, professional, and automated multi-channel communication workflows.
