# Scorecard ATS - Complete Functionality Requirements

*This document serves as the master reference for all functionality requirements and features discussed for the Scorecard ATS platform.*

## 🎯 Core Platform Vision

**Scorecard** is an AI-powered recruitment suite specifically designed for **technical recruiters**. It goes beyond traditional ATS systems by focusing on technical candidate sourcing, intelligent parsing, and streamlined workflow management.

### Key Differentiators
- More technical than standard ATS systems
- AI-powered candidate matching and scoring
- Technical recruiter-specific fields and workflows
- Modern, clean interface inspired by Juicebox.ai

---

## ✅ Completed Features

### LinkedIn Integration (COMPLETED)
- ✅ OAuth 2.0 authentication flow
- ✅ Profile data extraction and auto-population
- ✅ Contact modal integration
- ✅ Personal email focus (NOT corporate emails)
- ✅ Type-safe implementation with proper error handling

---

## 🆕 Advanced Features (New Requirements)

### 1. Custom Scorecard System
- **Point-based evaluation system** for candidate assessment
- **Customizable scoring criteria** (technical skills, communication, culture fit)
- **Weighted scoring** with different point values per category
- **Interview scorecard templates** for consistent evaluation
- **Aggregate scoring** across multiple interviewers
- **Historical scorecard tracking** and comparison

### 2. Call Recording & Transcription
- **Automatic call recording** for phone interviews and candidate calls
- **Real-time transcription** using AI speech-to-text
- **Searchable transcripts** with keyword highlighting
- **Integration with Twilio/Vonage** for call recording
- **Compliance features** (consent, retention policies)
- **Audio playback** with transcript synchronization

### 3. Candidate Dispositioning
- **Disposition categories** (qualified, not qualified, follow-up needed)
- **Disqualification reasons** with predefined and custom options
- **Disposition tracking** throughout pipeline stages
- **Bulk dispositioning** for multiple candidates
- **Disposition analytics** and reporting
- **Re-qualification** ability to change dispositions

### 4. Per-Candidate Note Taking
- **Rich text editor** for detailed candidate notes
- **Timestamped entries** with author tracking
- **Note categories** (interview, call, email, general)
- **Private vs shared notes** for team collaboration
- **Note templates** for consistent documentation
- **Search and filter** notes across all candidates

### 5. Hiring Manager Reports
- **Candidate pipeline reports** with stage progression
- **Interview feedback summaries** from scorecards
- **Time-to-hire analytics** per job and recruiter
- **Source effectiveness** reporting (LinkedIn, job boards, etc.)
- **Custom report builder** with drag-and-drop interface
- **Automated report delivery** via email/dashboard

### 6. Job Posting Integrations
- **Indeed API** - Post jobs and sync applications
- **ZipRecruiter API** - Multi-board job distribution
- **LinkedIn Jobs API** - Professional network posting
- **One-click posting** to multiple job boards
- **Application tracking** from external sources
- **Job performance analytics** per posting platform

### 7. Customizable Pipeline Settings
- **Settings page** for pipeline stage management
- **Mandatory stages** (Applied, Sourced, Technical Interview) - locked
- **Custom stage creation** with drag-and-drop ordering
- **Stage-specific automations** and triggers
- **Permission controls** for stage modifications
- **Stage analytics** and conversion tracking

### 8. Payment & Billing Integration
- **Stripe integration** for subscription management
- **Account linking** for team billing
- **Usage-based billing** (credits, API calls, storage)
- **Invoice generation** and payment history
- **Plan upgrades/downgrades** with prorated billing
- **Payment method management** and backup cards

### 9. Activity Reporting & Metrics
- **Recruiter activity dashboard** with real-time metrics
- **Daily/weekly/monthly** activity summaries
- **Performance benchmarking** against team averages
- **Goal tracking** and achievement monitoring
- **Activity heatmaps** showing peak productivity times
- **Custom KPI tracking** with configurable metrics

### 10. Candidate Activity Monitoring
- **Real-time activity feed** per candidate
- **Email open/click tracking** from outreach campaigns
- **Website visit tracking** (career page, company site)
- **Social media engagement** monitoring
- **Response time analytics** for candidate communications
- **Engagement scoring** based on activity levels

### 11. File Storage System
- **Per-candidate file storage** with unlimited capacity
- **Document categorization** (resume, cover letter, portfolio, references)
- **Version control** for document updates
- **Secure file sharing** with expiring links
- **File preview** for common formats (PDF, DOC, images)
- **Bulk file operations** (upload, download, delete)

### 12. Custom Fields System
- **Dynamic field creation** in candidate modal
- **Field types** (text, number, date, dropdown, checkbox, file)
- **Conditional field display** based on other field values
- **Field validation** and required field enforcement
- **Custom field reporting** and analytics
- **Field templates** for consistent data collection

### 13. Advanced AI Chat Feature
- **Natural language interface** for all platform functions
- **Command-driven workflows** ("Schedule interview with John Doe tomorrow at 2pm")
- **Smart suggestions** based on context and history
- **Multi-step task execution** through conversational interface
- **Integration with all platform features** (search, create, update, report)
- **Learning capabilities** to improve responses over time

---

## 📋 Required API Integrations

### 1. Calendar Management
- **Google Calendar API** - Primary interview scheduling system
- **Microsoft Outlook Calendar** - Secondary/enterprise option
- Features: Schedule interviews, check availability, send invites, automated reminders

### 2. Video Conferencing
- **Zoom API** - Primary video interview platform
- **Microsoft Teams API** - Secondary/enterprise video platform
- Features: Create meetings, generate links, access recordings, participant management

### 3. Personal Contact Discovery
- **Focus**: Personal emails (Gmail, Yahoo, Outlook personal) NOT corporate
- **Recommended APIs**: Pipl.com, People Data Labs, RocketReach, Clearbit Connect
- Features: Personal email discovery, social profile linking, contact verification

### 4. Resume Parsing
- **Recommended**: Affinda API ($0.50-$1.00 per parse, 95%+ accuracy)
- **Alternative**: RChilli ($0.30-$0.80 per parse, 90%+ accuracy)
- Features: 100+ field extraction, technical skill recognition, experience level detection

---

## 🎯 Candidate Management System

### Candidate Entry Points
- **Default Entry**: "Sourced" stage (when recruiter pulls/imports candidate)
- **Alternative Entry**: "Applied" stage (when candidate applies online through job portal)

### Kanban Board Requirements
- **Drag & Drop Functionality** - Move candidates between pipeline stages
- **8-Stage Default Pipeline**:
  1. **Sourced** (default entry point for recruiter-sourced candidates)
  2. **Applied** (entry point for online applicants)
  3. Initial Screening
  4. Technical Assessment
  5. **Interview Center** (triggers comprehensive interview workflow)
  6. Final Interview
  7. Offer Extended
  8. Hired/Rejected

### Critical Interview Center Workflow
**When candidate moves from "Sourced" OR "Applied" to "Interview Center":**

1. **📄 Resume Queue Processing**
   - Resume automatically enters Interview Center queue
   - Resume parsing is triggered if not already completed
   - Technical skills and experience are extracted and analyzed

2. **🤖 AI Question Generation**
   - AI generates interview questions based on parsed resume data
   - Questions are categorized by type (technical, behavioral, system design)
   - Questions are tailored to candidate's experience level and skills

3. **📝 Interview Notes Section**
   - Real-time note-taking interface is created
   - Notes are linked to specific questions and candidate responses
   - Timestamps and section organization for easy review

4. **📊 Scorecard Creation**
   - Interview scorecard is automatically generated
   - Scoring criteria based on role requirements and technical skills
   - Ability to rate candidate performance across multiple dimensions
   - Final recommendation and next steps tracking

---

## 💼 Job Management System (Minimalistic)

### Core Job Management Features
- **Capture Jobs** - Import existing job postings from various sources
- **Create Jobs** - Simple job creation with essential fields only
- **Client Association** - Link jobs to specific client names/companies
- **Minimalistic UI** - Streamlined interface focused on essential information

### Job Data Structure
```typescript
interface Job {
  id: string;
  title: string;
  clientName: string; // Company/client association
  description: string;
  requirements: {
    technicalSkills: string[];
    experienceLevel: 'junior' | 'mid' | 'senior' | 'staff' | 'principal';
    yearsOfExperience: number;
    location: string;
    remoteOptions: 'remote' | 'hybrid' | 'onsite';
  };
  compensation: {
    salaryRange?: {
      min: number;
      max: number;
    };
    currency: string;
    equityOffered?: boolean;
  };
  status: 'active' | 'paused' | 'filled' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  assignedRecruiter: string;
}
```

### Minimalistic Job Creation Form
**Essential Fields Only:**
- Job Title
- Client Name (dropdown with existing clients + "Add New")
- Job Description (rich text editor)
- Key Technical Skills (tag input)
- Experience Level (dropdown)
- Location & Remote Options
- Salary Range (optional)
- Assigned Recruiter

### Job-Candidate Linking
- **Automatic Matching** - AI suggests candidates based on job requirements
- **Manual Association** - Recruiters can link candidates to specific jobs
- **Pipeline Tracking** - Track candidate progress per job
- **Job-Specific Analytics** - Time-to-fill, candidate sources, conversion rates

### Client Management (Minimal)
```typescript
interface Client {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  activeJobs: number;
  totalHires: number;
  createdAt: Date;
}
```

---

## 🔍 Advanced Search & Candidate Profiles

### Extremely Good Search Features
**Priority**: CRITICAL - Core functionality for recruiter productivity
**Requirements**: Search stored candidates by multiple criteria with fast, accurate results

### Search Capabilities

#### Primary Search Fields
- **Job Title** - Current role, previous roles, target roles
- **Location** - City, state, country, remote preferences
- **Technical Skills** - Programming languages, frameworks, tools
- **Experience Level** - Junior, mid-level, senior, staff, principal
- **Company** - Current company, previous companies
- **Education** - Degree, university, major, bootcamps
- **Salary Range** - Current salary, expected salary
- **Availability** - Immediate, 2 weeks, 1 month, not looking

#### Advanced Search Features
```typescript
interface SearchFilters {
  // Text-based search
  query?: string; // Full-text search across all fields
  jobTitle?: string;
  location?: string;
  company?: string;
  
  // Technical filters
  technicalSkills?: {
    required: string[]; // Must have ALL these skills
    preferred: string[]; // Nice to have ANY of these skills
    exclude: string[]; // Must NOT have these skills
  };
  
  // Experience filters
  experienceLevel?: ('junior' | 'mid' | 'senior' | 'staff' | 'principal')[];
  yearsOfExperience?: {
    min: number;
    max: number;
  };
  
  // Compensation filters
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  
  // Availability filters
  remotePreference?: ('remote' | 'hybrid' | 'onsite')[];
  availability?: ('immediate' | '2_weeks' | '1_month' | 'not_looking')[];
  
  // Pipeline filters
  currentStage?: string[];
  assignedRecruiter?: string[];
  lastContactedWithin?: number; // days
  
  // Date filters
  addedAfter?: Date;
  addedBefore?: Date;
  lastUpdatedAfter?: Date;
}
```

#### Search Implementation Strategy

**Option A: PostgreSQL Full-Text Search (Recommended for MVP)**
- Use Supabase's built-in full-text search capabilities
- Create GIN indexes on searchable text fields
- Fast setup, good performance for moderate datasets
- Cost-effective solution

```sql
-- Create full-text search indexes
CREATE INDEX candidates_search_idx ON candidates 
USING GIN (to_tsvector('english', 
  coalesce(name, '') || ' ' || 
  coalesce(current_role, '') || ' ' || 
  coalesce(location, '') || ' ' || 
  coalesce(technical_skills_text, '')
));

-- Create indexes for common filters
CREATE INDEX candidates_location_idx ON candidates (location);
CREATE INDEX candidates_experience_level_idx ON candidates (experience_level);
CREATE INDEX candidates_current_stage_idx ON candidates (current_stage);
```

**Option B: Elasticsearch (For Advanced Search)**
- Superior search capabilities with fuzzy matching
- Better performance for large datasets (10k+ candidates)
- Advanced analytics and aggregations
- Higher complexity and cost

**Option C: Algolia (For Premium Search Experience)**
- Instant search with typo tolerance
- Excellent user experience
- Easy integration but higher cost
- Great for customer-facing search

### Search UI Components

```typescript
// Advanced search interface
const AdvancedSearch: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<CandidateSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="search-container">
      {/* Quick Search Bar */}
      <SearchInput 
        placeholder="Search candidates by name, title, skills, location..."
        onSearch={handleQuickSearch}
      />
      
      {/* Advanced Filters */}
      <CollapsibleFilters>
        <FilterGroup title="Technical Skills">
          <SkillsSelector 
            required={filters.technicalSkills?.required}
            preferred={filters.technicalSkills?.preferred}
            exclude={filters.technicalSkills?.exclude}
            onChange={handleSkillsChange}
          />
        </FilterGroup>
        
        <FilterGroup title="Experience">
          <ExperienceLevelSelect 
            value={filters.experienceLevel}
            onChange={handleExperienceChange}
          />
          <YearsOfExperienceRange 
            min={filters.yearsOfExperience?.min}
            max={filters.yearsOfExperience?.max}
            onChange={handleYearsChange}
          />
        </FilterGroup>
        
        <FilterGroup title="Location & Remote">
          <LocationInput 
            value={filters.location}
            onChange={handleLocationChange}
          />
          <RemotePreferenceSelect 
            value={filters.remotePreference}
            onChange={handleRemoteChange}
          />
        </FilterGroup>
      </CollapsibleFilters>
      
      {/* Search Results */}
      <SearchResults 
        results={results}
        isLoading={isLoading}
        onCandidateClick={handleCandidateClick}
      />
    </div>
  );
};
```

---

## 📄 Detailed Candidate Profile Page

### Profile Page Structure
Each candidate must have a comprehensive profile page containing all relevant information for recruiters.

#### Profile Layout
```typescript
interface CandidateProfile {
  // Header Section
  personalInfo: {
    name: string;
    profilePhoto?: string;
    currentRole: string;
    currentCompany: string;
    location: string;
    personalEmail: string;
    personalPhone: string;
    linkedinUrl?: string;
    githubUrl?: string;
  };
  
  // Professional Summary
  summary: {
    headline: string;
    yearsOfExperience: number;
    experienceLevel: 'junior' | 'mid' | 'senior' | 'staff' | 'principal';
    careerSummary: string;
    keyAchievements: string[];
  };
  
  // Technical Skills (Detailed)
  technicalProfile: TechnicalCandidate; // From previous definition
  
  // Work Experience
  workExperience: {
    company: string;
    role: string;
    startDate: Date;
    endDate?: Date;
    description: string;
    keyProjects: string[];
    technologiesUsed: string[];
    achievements: string[];
  }[];
  
  // Education & Certifications
  education: {
    degree: string;
    major: string;
    university: string;
    graduationYear: number;
    gpa?: number;
    relevantCoursework: string[];
  }[];
  
  // Recruitment Information
  recruitmentData: {
    currentStage: string;
    assignedRecruiter: string;
    sourceChannel: 'linkedin' | 'referral' | 'job_board' | 'direct_application';
    addedDate: Date;
    lastContactedDate?: Date;
    interviewHistory: InterviewRecord[];
    communicationHistory: CommunicationHistory[];
    notes: RecruiterNote[];
    attachments: CandidateAttachment[];
  };
  
  // Preferences & Availability
  preferences: {
    jobTypes: string[];
    preferredRoles: string[];
    salaryExpectations: {
      current?: number;
      expected?: number;
      currency: string;
    };
    remotePreference: 'remote' | 'hybrid' | 'onsite' | 'flexible';
    relocationWillingness: boolean;
    availability: 'immediate' | '2_weeks' | '1_month' | 'not_looking';
    noticePeriod?: string;
  };
}
```

#### Profile Page Features

**1. Profile Header**
- Candidate photo and basic info
- Quick action buttons (Call, SMS, Email, Schedule Interview)
- Current pipeline stage with stage change dropdown
- Match score for current job opening

**2. Technical Skills Visualization**
- Skills organized by category with proficiency indicators
- Years of experience per skill
- Skill verification status (from resume, LinkedIn, assessment)

**3. Experience Timeline**
- Visual timeline of work experience
- Role progression and career growth indicators
- Technology stack evolution over time

**4. Communication Center**
- All SMS, call, and email history in one place
- Quick message templates for common scenarios
- Communication analytics (response rates, preferred channels)

**5. Interview & Assessment History**
- Past interview scorecards and feedback
- Technical assessment results
- Interview recordings and notes
- Performance trends over multiple interviews

**6. Documents & Attachments**
- Resume versions with parsing results
- Cover letters and portfolios
- Reference letters and recommendations
- Signed documents (NDAs, offer letters)

**7. Activity Feed**
- Chronological log of all interactions
- Stage changes and pipeline movements
- Notes and updates from team members
- Automated system activities

#### Profile Management Features

```typescript
// Profile editing capabilities
interface ProfileActions {
  updatePersonalInfo(candidateId: string, updates: Partial<PersonalInfo>): Promise<void>;
  addNote(candidateId: string, note: string, isPrivate: boolean): Promise<void>;
  updateStage(candidateId: string, newStage: string, reason?: string): Promise<void>;
  scheduleFollowUp(candidateId: string, date: Date, type: string): Promise<void>;
  attachDocument(candidateId: string, file: File, type: string): Promise<void>;
  addToTalentPool(candidateId: string, poolName: string): Promise<void>;
  markAsReferral(candidateId: string, referrerInfo: ReferrerInfo): Promise<void>;
}
```

---

## 🤖 AI Interview Question Generation & Management

### Trigger System
- **Automatic activation** when candidate moves to Interview Center stage
- **Resume-based generation** using parsed technical skills and experience
- **Queue processing** ensures systematic handling of multiple candidates

### Question Generation Process
1. **Resume Analysis**: Parse technical skills, experience level, and project history
2. **Question Categorization**:
   - **Technical questions** (based on programming languages, frameworks, tools)
   - **Behavioral questions** (based on experience level and leadership history)
   - **System design questions** (for senior+ roles with architecture experience)
3. **Difficulty Calibration**: Questions matched to candidate's stated experience level

### Question Types by Experience Level
- **Junior (0-2 years)**: Basic technical concepts, learning approach, problem-solving fundamentals
- **Mid-level (3-5 years)**: Architecture decisions, team collaboration, technical trade-offs
- **Senior+ (6+ years)**: System design, technical strategy, mentorship, cross-functional leadership

### Interview Management Features

#### 📝 Real-Time Note Taking
- **Integrated notes section** during interview
- **Question-linked notes** for organized responses
- **Timestamp tracking** for interview flow
- **Rich text formatting** for detailed observations
- **Auto-save functionality** to prevent data loss

#### 📊 Interview Scorecard System
- **Automated scorecard generation** based on role requirements
- **Multi-dimensional scoring**:
  - Technical competency (language-specific, framework knowledge)
  - Problem-solving approach
  - Communication skills
  - Cultural fit assessment
  - Leadership potential (for senior roles)
- **Weighted scoring** based on role criticality
- **Final recommendation** with next steps
- **Comparison metrics** against other candidates

#### 🔄 Post-Interview Actions
- **Scorecard completion** required before moving to next stage
- **Interview summary** auto-generated from notes
- **Next steps recommendations** based on performance
- **Feedback sharing** with hiring team

---

## 👨‍💻 Technical Recruiter-Specific Fields

### Core Technical Data Points
- **Programming Languages**: Proficiency levels, years of experience, last used
- **Frameworks & Libraries**: Categorized by type (frontend, backend, mobile, data, devops)
- **Technical Skills**: Cloud, database, architecture, security, ML, certifications
- **Architecture Experience**: Microservices, event-driven, serverless, design patterns
- **Development Methodologies**: Agile, Scrum, Kanban, DevOps, TDD, BDD

### Leadership & Community
- **Technical Leadership**: Team size, leadership level, mentorship experience
- **Open Source Contributions**: GitHub profile, contribution level, notable projects
- **Community Presence**: Stack Overflow, technical blogs, conference speaking

### Professional Details
- **Education & Certifications**: Degrees, bootcamps, certifications with verification
- **Compensation Expectations**: Current/expected salary, equity, remote preferences
- **Career Preferences**: Remote/hybrid/onsite, relocation willingness

---

## 🎨 Design & UX Requirements

### Juicebox.ai Inspiration
- **Natural Language Search**: AI-powered candidate search without Boolean strings
- **Clean, Technical Interface**: Focus on data, minimal design, smart whitespace
- **Real-time Data Integration**: Multiple data source aggregation
- **Technical Skill Visualization**: Badges, tags, proficiency indicators

### UI Component Requirements
- **Card-based layouts** for candidate profiles
- **Technical skill badges** with proficiency levels
- **Progress indicators** for pipeline stages
- **Drag & drop visual feedback**
- **Match scoring** with confidence percentages

---

## 🗄️ Data Storage & Management

### Database Requirements (Supabase)
- **Extended candidate schema** for technical fields
- **Calendar events tracking** with external IDs
- **Video meeting management** with platform-specific data
- **Contact reveal logging** with credit tracking
- **API integration logs** for monitoring and debugging

### Data Privacy & Compliance
- **GDPR compliance** for candidate data
- **Personal email handling** with proper consent
- **Secure API credential storage**
- **Audit logging** for all data access

---

## 🔍 Search & Matching Capabilities

### Natural Language Search (Juicebox-inspired)
- **AI-powered queries**: "Find senior React developers with GraphQL experience"
- **Technical skill matching** with relevance scoring
- **Experience level filtering** with automatic detection
- **Location and remote preference** filtering

### Candidate Scoring & Ranking
- **Match percentage** based on job requirements
- **Technical skill relevance** scoring
- **Experience level appropriateness**
- **Availability and interest** indicators

---

## 📊 Analytics & Reporting

### Pipeline Analytics
- **Time-to-fill** metrics by role type
- **Stage conversion rates** and bottleneck identification
- **Recruiter productivity** tracking
- **Interview-to-offer** conversion rates

### Technical Recruiting Insights
- **In-demand skills** trending analysis
- **Salary benchmarking** by technology stack
- **Market availability** by technical skills
- **Source effectiveness** (LinkedIn, referrals, etc.)

---

## 🚀 Implementation Phases

### Phase 1: Enhanced Candidate Management (4-6 weeks)
- Kanban board with drag & drop
- Technical candidate fields
- Resume parser integration (Affinda)
- Stage automation system

### Phase 2: Interview Center & AI Generation (4-5 weeks)
- Interview Center queue system
- AI question generation service
- Real-time note-taking interface
- Interview scorecard system
- Calendar integration (Google Calendar)
- Meeting link generation

### Phase 3: Advanced Features (6-8 weeks)
- Natural language search
- Personal contact reveal integration
- Advanced analytics dashboard
- Video conferencing integration (Zoom/Teams)

---

## 📝 User Stories & Use Cases

### Primary User: Technical Recruiter

**Candidate Sourcing**:
- "As a technical recruiter, I want to search for 'senior Python developers with Django and AWS experience' using natural language"
- "I want to see technical skill proficiency levels and years of experience at a glance"

**Pipeline Management**:
- "I want to drag a candidate to Interview Center and have interview questions automatically generated"
- "I want calendar events created automatically when scheduling interviews"

**Contact & Outreach**:
- "I want to find personal email addresses for candidates, not corporate emails"
- "I want to track which contact reveal credits I've used"

**Interview Preparation**:
- "I want AI-generated questions based on the candidate's actual resume and technical skills"
- "I want different question types for junior vs senior candidates"

---

## 🔄 Continuous Requirements

*This document will be updated as new functionality requirements are discussed and defined. All requirements should be captured here for future reference and implementation planning.*

---

**Last Updated**: January 2025  
**Status**: Requirements Documentation - Ready for Implementation  
**Next Review**: After each major feature discussion
