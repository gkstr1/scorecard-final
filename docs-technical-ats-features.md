# Technical ATS Features - Scorecard Platform

## 🎯 Overview

Scorecard is designed as a **technical recruiter-focused ATS** that goes beyond traditional recruiting platforms. Inspired by Juicebox.ai's AI-powered approach, our platform emphasizes technical candidate sourcing, intelligent parsing, and streamlined workflow management.

## 🔍 Juicebox.ai Design Inspiration Analysis

### Key Features We're Adopting:

**1. Natural Language Search**
- AI-powered candidate search using natural language queries
- No complex Boolean strings required
- Technical skill-based filtering and matching

**2. Technical Field Focus**
- Specialized fields for technical roles (frameworks, languages, tools)
- Experience level parsing (junior, senior, staff, principal)
- Technical project and contribution analysis

**3. AI-Powered Profile Analysis**
- Automated candidate scoring and ranking
- Technical skill extraction and verification
- Experience relevance assessment

**4. Real-time Data Integration**
- Multiple data source aggregation
- Live profile updates and enrichment
- Technical community presence analysis (GitHub, Stack Overflow, etc.)

---

## 🛠️ Technical Recruiter-Specific Fields

### Core Technical Fields

```typescript
interface TechnicalCandidate extends BaseCandidate {
  // Programming Languages
  programmingLanguages: {
    language: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    yearsOfExperience: number;
    lastUsed: Date;
  }[];

  // Frameworks & Libraries
  frameworks: {
    name: string;
    category: 'frontend' | 'backend' | 'mobile' | 'data' | 'devops' | 'testing';
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    yearsOfExperience: number;
  }[];

  // Technical Skills
  technicalSkills: {
    skill: string;
    category: 'cloud' | 'database' | 'architecture' | 'security' | 'ml' | 'other';
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    certifications?: string[];
  }[];

  // Architecture & Design Patterns
  architectureExperience: {
    pattern: string; // microservices, event-driven, serverless, etc.
    yearsOfExperience: number;
    projectsWorkedOn: number;
  }[];

  // Development Methodologies
  methodologies: {
    methodology: 'agile' | 'scrum' | 'kanban' | 'devops' | 'tdd' | 'bdd';
    role: 'practitioner' | 'lead' | 'coach' | 'expert';
    yearsOfExperience: number;
  }[];

  // Technical Leadership
  technicalLeadership: {
    teamSize: number;
    leadershipLevel: 'tech_lead' | 'senior_engineer' | 'staff_engineer' | 'principal' | 'architect';
    mentorshipExperience: boolean;
    crossFunctionalLeadership: boolean;
  };

  // Open Source & Community
  openSourceContributions: {
    githubProfile?: string;
    contributionLevel: 'none' | 'occasional' | 'regular' | 'maintainer';
    notableProjects: string[];
    stackOverflowProfile?: string;
    technicalBlogUrl?: string;
  };

  // Education & Certifications
  technicalEducation: {
    degree?: string;
    major?: string;
    relevantCoursework: string[];
    bootcampExperience?: string;
    certifications: {
      name: string;
      issuer: string;
      dateObtained: Date;
      expirationDate?: Date;
      verificationUrl?: string;
    }[];
  };

  // Compensation & Preferences
  compensationExpectations: {
    currentSalary?: number;
    expectedSalary?: number;
    equityExpectations?: string;
    remotePreference: 'remote' | 'hybrid' | 'onsite' | 'flexible';
    relocationWillingness: boolean;
  };
}
```

---

## 📋 Kanban Candidate Management System

### Pipeline Stages

```typescript
interface CandidatePipeline {
  stages: {
    id: string;
    name: string;
    order: number;
    color: string;
    automations: StageAutomation[];
  }[];
}

const DEFAULT_TECHNICAL_PIPELINE: CandidatePipeline = {
  stages: [
    {
      id: 'sourced',
      name: 'Sourced',
      order: 1,
      color: '#E3F2FD',
      automations: []
    },
    {
      id: 'initial_screening',
      name: 'Initial Screening',
      order: 2,
      color: '#FFF3E0',
      automations: [
        { type: 'send_initial_email', delay: 0 },
        { type: 'schedule_followup', delay: 3 * 24 * 60 * 60 * 1000 } // 3 days
      ]
    },
    {
      id: 'technical_assessment',
      name: 'Technical Assessment',
      order: 3,
      color: '#F3E5F5',
      automations: [
        { type: 'send_coding_challenge', delay: 0 },
        { type: 'schedule_reminder', delay: 2 * 24 * 60 * 60 * 1000 } // 2 days
      ]
    },
    {
      id: 'interview_center',
      name: 'Interview Center',
      order: 4,
      color: '#E8F5E8',
      automations: [
        { type: 'generate_ai_questions', delay: 0 },
        { type: 'schedule_interview', delay: 0 },
        { type: 'create_calendar_event', delay: 0 }
      ]
    },
    {
      id: 'final_interview',
      name: 'Final Interview',
      order: 5,
      color: '#FFF8E1',
      automations: [
        { type: 'notify_hiring_manager', delay: 0 },
        { type: 'prepare_offer_template', delay: 0 }
      ]
    },
    {
      id: 'offer_extended',
      name: 'Offer Extended',
      order: 6,
      color: '#E1F5FE',
      automations: [
        { type: 'send_offer_letter', delay: 0 },
        { type: 'schedule_offer_followup', delay: 2 * 24 * 60 * 60 * 1000 }
      ]
    },
    {
      id: 'hired',
      name: 'Hired',
      order: 7,
      color: '#C8E6C9',
      automations: [
        { type: 'send_welcome_package', delay: 0 },
        { type: 'schedule_onboarding', delay: 0 }
      ]
    },
    {
      id: 'rejected',
      name: 'Rejected',
      order: 8,
      color: '#FFCDD2',
      automations: [
        { type: 'send_rejection_email', delay: 0 },
        { type: 'add_to_talent_pool', delay: 0 }
      ]
    }
  ]
};
```

### Drag & Drop Implementation

```typescript
// React DnD implementation for Kanban board
interface KanbanBoardProps {
  candidates: TechnicalCandidate[];
  pipeline: CandidatePipeline;
  onCandidateMove: (candidateId: string, newStageId: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ candidates, pipeline, onCandidateMove }) => {
  const handleDrop = useCallback(async (candidateId: string, targetStageId: string) => {
    // Update candidate stage
    await onCandidateMove(candidateId, targetStageId);
    
    // Trigger stage-specific automations
    const targetStage = pipeline.stages.find(s => s.id === targetStageId);
    if (targetStage?.automations) {
      await triggerStageAutomations(candidateId, targetStage.automations);
    }
    
    // Special handling for Interview Center
    if (targetStageId === 'interview_center') {
      await generateAIInterviewQuestions(candidateId);
      await createCalendarEvent(candidateId);
    }
  }, [onCandidateMove, pipeline]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-board">
        {pipeline.stages.map(stage => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            candidates={candidates.filter(c => c.currentStage === stage.id)}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </DndProvider>
  );
};
```

---

## 🤖 AI Interview Question Generation

### Trigger System

```typescript
interface InterviewQuestionGenerator {
  generateQuestions(candidateId: string, resumeData: ParsedResume): Promise<InterviewQuestion[]>;
}

class AIInterviewQuestionService implements InterviewQuestionGenerator {
  async generateQuestions(candidateId: string, resumeData: ParsedResume): Promise<InterviewQuestion[]> {
    const candidate = await this.getCandidateProfile(candidateId);
    
    // Technical questions based on resume skills
    const technicalQuestions = await this.generateTechnicalQuestions(resumeData.technicalSkills);
    
    // Behavioral questions based on experience level
    const behavioralQuestions = await this.generateBehavioralQuestions(candidate.experienceLevel);
    
    // System design questions for senior roles
    const systemDesignQuestions = candidate.experienceLevel >= 'senior' 
      ? await this.generateSystemDesignQuestions(resumeData.architectureExperience)
      : [];
    
    return [
      ...technicalQuestions,
      ...behavioralQuestions,
      ...systemDesignQuestions
    ];
  }

  private async generateTechnicalQuestions(skills: TechnicalSkill[]): Promise<InterviewQuestion[]> {
    const questions: InterviewQuestion[] = [];
    
    for (const skill of skills.slice(0, 5)) { // Top 5 skills
      const prompt = `Generate 2-3 technical interview questions for a candidate with ${skill.yearsOfExperience} years of experience in ${skill.skill}. Focus on practical application and problem-solving.`;
      
      const generatedQuestions = await this.openAIService.generateQuestions(prompt);
      questions.push(...generatedQuestions);
    }
    
    return questions;
  }
}

// Trigger when candidate moves to Interview Center
const triggerInterviewGeneration = async (candidateId: string) => {
  const candidate = await candidateService.getCandidate(candidateId);
  const resumeData = await resumeParserService.getParseData(candidate.resumeId);
  
  const questions = await aiInterviewService.generateQuestions(candidateId, resumeData);
  
  // Save questions to database
  await interviewService.saveInterviewQuestions(candidateId, questions);
  
  // Notify interviewer
  await notificationService.notifyInterviewer(candidate.assignedRecruiter, {
    type: 'interview_questions_ready',
    candidateId,
    questionsCount: questions.length
  });
};
```

---

## 📄 Resume Parser Recommendations

### Top Recommended Solutions

#### 1. **Affinda (Recommended)**
**Why it's best for technical recruiting:**
- Extracts 100+ fields from each resume
- Excellent technical skill recognition
- Supports 56 languages
- High accuracy for technical roles
- API-first design

**Pricing:** ~$0.50-$1.00 per parse
**Integration complexity:** Low
**Technical skill accuracy:** 95%+

#### 2. **RChilli**
**Why it's good for technical recruiting:**
- Specialized in technical resume parsing
- Excellent framework and tool recognition
- Strong experience level detection
- Good API documentation

**Pricing:** ~$0.30-$0.80 per parse
**Integration complexity:** Medium
**Technical skill accuracy:** 90%+

#### 3. **Textkernel**
**Why it's enterprise-ready:**
- Highly accurate parsing engine
- Excellent for large-scale operations
- Strong technical skill taxonomy
- Enterprise-grade security

**Pricing:** Custom (typically higher)
**Integration complexity:** Medium-High
**Technical skill accuracy:** 95%+

### Recommended Implementation

```typescript
interface ResumeParserService {
  parseResume(file: File): Promise<ParsedResume>;
  extractTechnicalSkills(resumeText: string): Promise<TechnicalSkill[]>;
  detectExperienceLevel(resumeData: ParsedResume): Promise<ExperienceLevel>;
}

class AffindaResumeParser implements ResumeParserService {
  async parseResume(file: File): Promise<ParsedResume> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post('https://api.affinda.com/v3/resumes', formData, {
      headers: {
        'Authorization': `Bearer ${process.env.AFFINDA_API_KEY}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return this.transformAffindaResponse(response.data);
  }

  private transformAffindaResponse(affindaData: any): ParsedResume {
    return {
      personalInfo: {
        name: affindaData.data.name?.raw,
        email: affindaData.data.emails?.[0]?.value,
        phone: affindaData.data.phoneNumbers?.[0]?.value,
        location: affindaData.data.location?.formatted
      },
      technicalSkills: this.extractTechnicalSkills(affindaData.data.skills),
      experience: this.extractExperience(affindaData.data.workExperience),
      education: this.extractEducation(affindaData.data.education),
      certifications: this.extractCertifications(affindaData.data.certifications)
    };
  }
}
```

---

## 🎨 UI/UX Design Principles (Juicebox-Inspired)

### Design System

**Color Palette:**
- Primary: `#2563EB` (Blue - Trust, Technology)
- Secondary: `#059669` (Green - Success, Growth)
- Accent: `#DC2626` (Red - Urgency, Important Actions)
- Neutral: `#64748B` (Gray - Text, Backgrounds)

**Typography:**
- Headers: `Inter` (Clean, Modern)
- Body: `Inter` (Consistent, Readable)
- Code: `JetBrains Mono` (Technical Content)

**Component Patterns:**
- Card-based layouts for candidate profiles
- Clean, minimal interface with focus on data
- Smart use of whitespace
- Technical skill badges and tags
- Progress indicators for pipeline stages

### Key UI Components

```typescript
// Candidate Card Component
interface CandidateCardProps {
  candidate: TechnicalCandidate;
  onMove: (stageId: string) => void;
  onView: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onMove, onView }) => {
  return (
    <Card className="candidate-card" draggable>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{candidate.name}</h3>
          <Badge variant="outline">{candidate.experienceLevel}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{candidate.currentRole}</p>
      </CardHeader>
      
      <CardContent>
        {/* Technical Skills */}
        <div className="flex flex-wrap gap-1 mb-3">
          {candidate.topSkills.slice(0, 4).map(skill => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Experience:</span>
            <span className="ml-1 font-medium">{candidate.totalExperience}y</span>
          </div>
          <div>
            <span className="text-muted-foreground">Match:</span>
            <span className="ml-1 font-medium text-green-600">{candidate.matchScore}%</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" onClick={onView} className="w-full">
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};
```

---

## 🚀 Implementation Roadmap

### Phase 1: Enhanced Candidate Management (4-6 weeks)
1. **Kanban Board Implementation**
   - Drag & drop functionality
   - Stage automation triggers
   - Custom pipeline configuration

2. **Technical Fields Integration**
   - Extended candidate schema
   - Technical skill taxonomy
   - Experience level detection

3. **Resume Parser Integration**
   - Affinda API integration
   - Technical skill extraction
   - Automated profile enrichment

### Phase 2: AI Interview Generation (3-4 weeks)
1. **Interview Center Triggers**
   - Automatic question generation
   - Resume-based question customization
   - Question categorization (technical, behavioral, system design)

2. **Calendar Integration**
   - Google Calendar API
   - Automated interview scheduling
   - Meeting link generation

### Phase 3: Advanced Features (6-8 weeks)
1. **Natural Language Search** (Juicebox-inspired)
   - AI-powered candidate search
   - Technical skill matching
   - Experience-based filtering

2. **Enhanced Analytics**
   - Pipeline performance metrics
   - Technical skill demand analysis
   - Recruiter productivity tracking

---

## 📊 Success Metrics

**Efficiency Metrics:**
- Time to fill technical positions
- Candidate pipeline velocity
- Resume parsing accuracy
- Interview question relevance score

**Quality Metrics:**
- Candidate-role match accuracy
- Interview-to-offer conversion rate
- Technical assessment pass rate
- Hiring manager satisfaction

**User Experience Metrics:**
- Recruiter daily active usage
- Feature adoption rates
- Time spent per candidate evaluation
- User satisfaction scores

---

*This document serves as the comprehensive technical specification for building a best-in-class technical recruiting ATS platform.*
