# Scorecard ATS - API Integrations Documentation

## Overview

This document outlines all third-party API integrations required for the Scorecard ATS platform. Each integration serves specific recruitment workflow needs and enhances the overall hiring experience.

## 🔗 API Integration Roadmap

### 1. LinkedIn API (✅ Implemented)
**Purpose**: Candidate sourcing and profile data retrieval
**Status**: Complete with OAuth 2.0 flow

**Implementation Details**:
- OAuth 2.0 authentication flow
- Profile data extraction (name, headline, experience, education)
- Contact information retrieval
- Auto-population of candidate fields

**Endpoints Used**:
- `/v2/people/~` - Basic profile information
- `/v2/emailAddress` - Email address
- `/v2/positions` - Work experience
- `/v2/educations` - Education history

**Documentation**: See `docs-linkedin-integration.md`

---

### 2. Google Calendar API
**Purpose**: Interview scheduling and automated calendar invitations
**Status**: 📋 Planned
**Priority**: HIGH - Critical for automated interview workflow

**Key Features**:
- **Automated Interview Invitations** - When candidate moves to Interview Center
- Schedule interviews directly from candidate profiles
- Check interviewer availability
- Send calendar invites to candidates and interviewers
- Sync interview schedules with recruitment pipeline
- Automated reminders and notifications

**Required Scopes**:
- `https://www.googleapis.com/auth/calendar` - Full calendar access
- `https://www.googleapis.com/auth/calendar.events` - Event management
- `https://www.googleapis.com/auth/calendar.readonly` - Read calendar availability

**Automated Interview Center Workflow**:
```typescript
// Triggered when candidate moves to Interview Center
class AutomatedInterviewService {
  async triggerInterviewCenterAutomation(candidateId: string): Promise<InterviewAutomationResult> {
    const candidate = await this.getCandidateProfile(candidateId);
    const recruiter = await this.getAssignedRecruiter(candidate.assignedRecruiter);
    
    // 1. Create Zoom meeting
    const zoomMeeting = await this.zoomService.createInterviewMeeting({
      topic: `Interview: ${candidate.name} - ${candidate.targetRole}`,
      type: 2, // Scheduled meeting
      start_time: this.getDefaultInterviewTime(), // Next business day
      duration: 60, // 1 hour
      settings: {
        host_video: true,
        participant_video: true,
        waiting_room: true,
        auto_recording: 'cloud'
      }
    });
    
    // 2. Create Google Calendar event
    const calendarEvent = await this.googleCalendarService.createInterviewEvent({
      summary: `Technical Interview - ${candidate.name}`,
      description: `
        Interview with ${candidate.name} for ${candidate.targetRole}
        
        Zoom Meeting: ${zoomMeeting.join_url}
        Meeting ID: ${zoomMeeting.id}
        Passcode: ${zoomMeeting.password}
        
        Candidate Profile: ${process.env.BASE_URL}/candidates/${candidateId}
        AI Interview Questions: Auto-generated based on resume
      `,
      start: {
        dateTime: this.getDefaultInterviewTime().toISOString(),
        timeZone: recruiter.timezone
      },
      end: {
        dateTime: this.getDefaultInterviewEndTime().toISOString(),
        timeZone: recruiter.timezone
      },
      attendees: [
        { email: candidate.personalEmail, displayName: candidate.name },
        { email: recruiter.email, displayName: recruiter.name }
      ],
      conferenceData: {
        createRequest: {
          requestId: `zoom-${candidateId}-${Date.now()}`,
          conferenceSolution: {
            key: {
              type: 'addOn'
            }
          }
        }
      }
    });
    
    // 3. Send SMS notification to candidate
    await this.smsService.sendSMS(
      candidate.personalPhone,
      `Hi ${candidate.name}! You've been invited to interview with ${recruiter.companyName}. Check your email for the calendar invitation with Zoom details. Reply STOP to opt out.`,
      candidateId
    );
    
    // 4. Log the automation
    await this.logInterviewAutomation({
      candidateId,
      zoomMeetingId: zoomMeeting.id,
      calendarEventId: calendarEvent.id,
      automationTriggeredAt: new Date(),
      status: 'completed'
    });
    
    return {
      zoomMeeting,
      calendarEvent,
      smsNotificationSent: true,
      automationStatus: 'success'
    };
  }
}
```

**Implementation Plan**:
```typescript
// Enhanced service structure
class GoogleCalendarService {
  async createInterviewEvent(candidateId: string, interviewDetails: InterviewEvent): Promise<CalendarEvent>
  async createAutomatedInterviewInvite(candidate: Candidate, zoomMeeting: ZoomMeeting): Promise<CalendarEvent>
  async checkAvailability(emails: string[], timeRange: TimeRange): Promise<AvailabilitySlot[]>
  async updateInterviewEvent(eventId: string, updates: Partial<InterviewEvent>): Promise<CalendarEvent>
  async cancelInterview(eventId: string): Promise<void>
  async rescheduleInterview(eventId: string, newDateTime: Date): Promise<CalendarEvent>
}
```

**Environment Variables**:
```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GOOGLE_CLIENT_SECRET=your_google_client_secret
REACT_APP_GOOGLE_REDIRECT_URI=http://localhost:5173/google/callback
```

---

### 3. Zoom API
**Purpose**: Automated video interview creation and management
**Status**: 📋 Planned
**Priority**: HIGH - Critical for automated interview workflow

**Key Features**:
- **Automated Meeting Creation** - When candidate moves to Interview Center
- Generate meeting links and passcodes automatically
- Waiting room and security settings
- Automatic cloud recording for interviews
- Meeting analytics and participant management

**Required Scopes**:
- `meeting:write` - Create and manage meetings
- `meeting:read` - Read meeting details
- `recording:read` - Access meeting recordings
- `user:read` - User information
- `webinar:write` - For larger interview panels

**Automated Meeting Creation Workflow**:
```typescript
// Enhanced service structure for automation
class ZoomService {
  async createAutomatedInterviewMeeting(candidate: Candidate, recruiter: Recruiter): Promise<ZoomMeeting> {
    const meetingRequest = {
      topic: `Technical Interview - ${candidate.name}`,
      type: 2, // Scheduled meeting
      start_time: this.calculateInterviewTime(recruiter.timezone),
      duration: 60, // Default 1 hour
      timezone: recruiter.timezone,
      password: this.generateSecurePassword(),
      agenda: `Interview for ${candidate.targetRole || 'Technical Position'}`,
      settings: {
        host_video: true,
        participant_video: true,
        cn_meeting: false,
        in_meeting: false,
        join_before_host: false,
        mute_upon_entry: true,
        watermark: false,
        use_pmi: false,
        approval_type: 0, // Automatically approve
        audio: 'both',
        auto_recording: 'cloud', // Automatic cloud recording
        enforce_login: false,
        enforce_login_domains: '',
        alternative_hosts: '',
        close_registration: false,
        show_share_button: true,
        allow_multiple_devices: true,
        registrants_confirmation_email: true,
        waiting_room: true, // Enable waiting room for security
        registrants_email_notification: true
      }
    };
    
    const meeting = await this.zoomClient.meetings.create(meetingRequest);
    
    // Store meeting details in database
    await this.storeMeetingDetails({
      candidateId: candidate.id,
      zoomMeetingId: meeting.id,
      joinUrl: meeting.join_url,
      password: meeting.password,
      startTime: meeting.start_time,
      createdAt: new Date()
    });
    
    return meeting;
  }
  
  async createInterviewMeeting(interviewDetails: ZoomMeetingRequest): Promise<ZoomMeeting>
  async updateMeeting(meetingId: string, updates: Partial<ZoomMeetingRequest>): Promise<ZoomMeeting>
  async deleteMeeting(meetingId: string): Promise<void>
  async getMeetingRecordings(meetingId: string): Promise<ZoomRecording[]>
  async getUpcomingMeetings(): Promise<ZoomMeeting[]>
  async getMeetingParticipants(meetingId: string): Promise<ZoomParticipant[]>
  async generateMeetingReport(meetingId: string): Promise<ZoomMeetingReport>
}

// Meeting data types for automation
interface AutomatedMeetingResult {
  meetingId: string;
  joinUrl: string;
  password: string;
  startTime: Date;
  duration: number;
  hostId: string;
  topic: string;
}
```

**Interview Center Automation Trigger**:
```typescript
// This function is called when candidate moves to Interview Center
export const triggerInterviewCenterAutomation = async (candidateId: string) => {
  try {
    // Get candidate and recruiter info
    const candidate = await candidateService.getCandidate(candidateId);
    const recruiter = await userService.getRecruiter(candidate.assignedRecruiter);
    
    // Create Zoom meeting
    const zoomMeeting = await zoomService.createAutomatedInterviewMeeting(candidate, recruiter);
    
    // Create Google Calendar event with Zoom details
    const calendarEvent = await googleCalendarService.createAutomatedInterviewInvite(
      candidate, 
      zoomMeeting
    );
    
    // Generate AI interview questions
    const interviewQuestions = await aiInterviewService.generateQuestions(
      candidateId, 
      candidate.resumeData
    );
    
    // Send SMS notification
    await smsService.sendInterviewInvitationSMS(candidate, zoomMeeting);
    
    // Update candidate record
    await candidateService.updateCandidate(candidateId, {
      currentStage: 'interview_center',
      interviewScheduled: true,
      zoomMeetingId: zoomMeeting.id,
      calendarEventId: calendarEvent.id,
      interviewQuestionsGenerated: true,
      lastAutomationRun: new Date()
    });
    
    // Log successful automation
    await logService.logAutomation({
      type: 'interview_center_automation',
      candidateId,
      success: true,
      details: {
        zoomMeetingCreated: true,
        calendarInviteSent: true,
        smsNotificationSent: true,
        questionsGenerated: interviewQuestions.length
      }
    });
    
  } catch (error) {
    // Log automation failure
    await logService.logAutomation({
      type: 'interview_center_automation',
      candidateId,
      success: false,
      error: error.message
    });
    
    // Notify recruiter of automation failure
    await notificationService.notifyRecruiter(candidate.assignedRecruiter, {
      type: 'automation_failed',
      candidateId,
      message: 'Interview automation failed. Please schedule manually.'
    });
  }
};
```

**Environment Variables**:
```env
REACT_APP_ZOOM_CLIENT_ID=your_zoom_client_id
REACT_APP_ZOOM_CLIENT_SECRET=your_zoom_client_secret
REACT_APP_ZOOM_REDIRECT_URI=http://localhost:5173/zoom/callback
```

---

### 4. Microsoft Teams API
**Purpose**: Alternative video conferencing and collaboration
**Status**: 📋 Planned

**Key Features**:
- Create Teams meetings for interviews
- Integration with Microsoft 365 ecosystem
- Meeting recordings and transcriptions
- Calendar integration with Outlook
- Team collaboration features

**Required Scopes**:
- `OnlineMeetings.ReadWrite` - Create and manage online meetings
- `Calendars.ReadWrite` - Calendar integration
- `User.Read` - Basic user information

**Implementation Plan**:
```typescript
// Service structure
class MicrosoftTeamsService {
  async createTeamsMeeting(meetingDetails: TeamsMeetingRequest): Promise<TeamsMeeting>
  async updateMeeting(meetingId: string, updates: Partial<TeamsMeetingRequest>): Promise<TeamsMeeting>
  async deleteMeeting(meetingId: string): Promise<void>
  async getMeetingRecordings(meetingId: string): Promise<TeamsRecording[]>
}
```

**Environment Variables**:
```env
REACT_APP_TEAMS_CLIENT_ID=your_teams_client_id
REACT_APP_TEAMS_CLIENT_SECRET=your_teams_client_secret
REACT_APP_TEAMS_REDIRECT_URI=http://localhost:5173/teams/callback
```

---

### 5. Contact Reveal API
**Purpose**: Personal email discovery for candidate outreach
**Status**: 📋 Planned - Service Selection Required
**Focus**: Personal emails (Gmail, Yahoo, Outlook personal) NOT corporate emails

**Potential Services**:

#### Option A: Pipl.com API (Recommended for Personal Data)
- Specializes in personal contact information
- Personal email discovery across social networks
- Phone number and social media profiles
- Identity verification and data accuracy
- GDPR compliant personal data handling

#### Option B: People Data Labs API
- Personal contact information database
- Social media profile linking
- Personal email validation
- Comprehensive person profiles
- Privacy-compliant data sourcing

#### Option C: RocketReach API
- Personal and professional contact discovery
- Social media profile integration
- Personal email finder with high accuracy
- Phone number discovery
- Real-time data verification

#### Option D: Clearbit Connect (Personal Focus)
- Personal email discovery
- Social profile enrichment
- Personal contact verification
- Privacy-focused data collection

**Recommended Implementation**:
```typescript
// Personal contact reveal service
class PersonalContactRevealService {
  async findPersonalEmail(candidateName: string, linkedinProfile?: string): Promise<PersonalContactInfo>
  async verifyPersonalEmail(email: string): Promise<EmailVerification>
  async findSocialProfiles(candidateName: string): Promise<SocialProfiles>
  async enrichPersonalProfile(candidateId: string): Promise<EnrichedPersonalProfile>
  async bulkPersonalContactSearch(candidates: PersonalSearchRequest[]): Promise<PersonalContactInfo[]>
}

// Types for personal contact data
interface PersonalContactInfo {
  personalEmail?: string;
  personalPhone?: string;
  socialProfiles: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    facebook?: string;
  };
  emailType: 'personal' | 'corporate' | 'unknown';
  confidence: number; // 0-100 accuracy score
}

interface PersonalSearchRequest {
  fullName: string;
  linkedinUrl?: string;
  currentCompany?: string;
  location?: string;
  excludeCorporateEmails: boolean; // Always true for our use case
}
```

**Environment Variables**:
```env
REACT_APP_CONTACT_REVEAL_API_KEY=your_contact_api_key
REACT_APP_CONTACT_REVEAL_BASE_URL=https://api.contactservice.com
```

---

### 6. SMS & Phone Call APIs (Critical for Recruiting)
**Purpose**: Primary communication channels for recruiter-candidate interaction
**Status**: 📋 Planned - Service Selection Required
**Priority**: HIGH - SMS is the primary way recruiters contact candidates

**Recommended Services**:

#### Option A: Twilio (Recommended for Features)
- **Strengths**: Most comprehensive feature set, excellent documentation, reliable delivery
- **SMS Pricing**: ~$0.0075 per SMS (US)
- **Voice Pricing**: ~$0.0085 per minute (US)
- **Features**: 
  - Programmable SMS with delivery receipts
  - Voice calls with recording capabilities
  - Two-way SMS conversations
  - Phone number provisioning
  - Advanced analytics and reporting
  - Excellent developer experience

#### Option B: Vonage (Recommended for Cost)
- **Strengths**: More cost-effective, good reliability, solid API
- **SMS Pricing**: ~$0.0040 per SMS (US) - 47% cheaper than Twilio
- **Voice Pricing**: ~$0.0060 per minute (US) - 30% cheaper than Twilio
- **Features**:
  - SMS API with delivery status
  - Voice API with call recording
  - Number insight API
  - Global coverage
  - Good documentation

#### Option C: Plivo (Alternative)
- **Strengths**: Competitive pricing, good for high-volume usage
- **SMS Pricing**: ~$0.0050 per SMS (US)
- **Voice Pricing**: ~$0.0070 per minute (US)
- **Features**: SMS, Voice, Phone number management

**Recommended Implementation**:
```typescript
// Communication service interface
interface CommunicationService {
  sendSMS(to: string, message: string, candidateId: string): Promise<SMSResponse>;
  makeCall(to: string, from: string, candidateId: string): Promise<CallResponse>;
  getConversationHistory(candidateId: string): Promise<CommunicationHistory[]>;
  getSMSDeliveryStatus(messageId: string): Promise<DeliveryStatus>;
}

// Twilio implementation
class TwilioCommunicationService implements CommunicationService {
  async sendSMS(to: string, message: string, candidateId: string): Promise<SMSResponse> {
    const response = await this.twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
      statusCallback: `${process.env.BASE_URL}/api/sms/status/${candidateId}`
    });
    
    // Log communication in database
    await this.logCommunication({
      candidateId,
      type: 'sms',
      direction: 'outbound',
      content: message,
      phoneNumber: to,
      externalId: response.sid,
      status: 'sent'
    });
    
    return {
      messageId: response.sid,
      status: response.status,
      cost: response.price
    };
  }

  async makeCall(to: string, from: string, candidateId: string): Promise<CallResponse> {
    const response = await this.twilioClient.calls.create({
      url: `${process.env.BASE_URL}/api/voice/twiml/${candidateId}`,
      to: to,
      from: from,
      record: true,
      statusCallback: `${process.env.BASE_URL}/api/voice/status/${candidateId}`
    });
    
    await this.logCommunication({
      candidateId,
      type: 'call',
      direction: 'outbound',
      phoneNumber: to,
      externalId: response.sid,
      status: 'initiated'
    });
    
    return {
      callId: response.sid,
      status: response.status
    };
  }
}

// Communication data types
interface CommunicationHistory {
  id: string;
  candidateId: string;
  type: 'sms' | 'call' | 'email';
  direction: 'inbound' | 'outbound';
  content?: string; // SMS content or call summary
  phoneNumber: string;
  duration?: number; // for calls
  status: 'sent' | 'delivered' | 'failed' | 'completed' | 'no-answer';
  cost?: number;
  recordingUrl?: string; // for calls
  timestamp: Date;
  recruiterId: string;
}
```

**Integration Features for Recruiting**:

#### SMS Features
- **Template Messages** - Pre-built SMS templates for common recruiting scenarios
- **Two-way Conversations** - Handle candidate replies and maintain conversation threads
- **Delivery Tracking** - Track message delivery and read receipts
- **Bulk Messaging** - Send messages to multiple candidates (with rate limiting)
- **Compliance** - TCPA compliance for recruiting SMS

#### Voice Call Features
- **Click-to-Call** - Initiate calls directly from candidate profiles
- **Call Recording** - Automatic recording of recruiting calls
- **Call Notes** - Integrated note-taking during calls
- **Voicemail Detection** - Handle voicemail scenarios
- **Call Analytics** - Track call duration, success rates, callback requests

**Environment Variables**:
```env
# Twilio Configuration
REACT_APP_TWILIO_ACCOUNT_SID=your_twilio_account_sid
REACT_APP_TWILIO_AUTH_TOKEN=your_twilio_auth_token
REACT_APP_TWILIO_PHONE_NUMBER=+1234567890

# Vonage Configuration (Alternative)
REACT_APP_VONAGE_API_KEY=your_vonage_api_key
REACT_APP_VONAGE_API_SECRET=your_vonage_api_secret
REACT_APP_VONAGE_PHONE_NUMBER=+1234567890
```

---

### 7. Data Storage & Management
**Purpose**: Centralized data storage for all integrations
**Status**: 🔄 Partially Implemented (Supabase)

**Current Setup**: Supabase (PostgreSQL + Real-time)
**Additional Requirements**:

#### Database Schema Extensions:
```sql
-- Calendar integrations
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id),
  event_type VARCHAR(50), -- 'google_calendar', 'outlook'
  external_event_id VARCHAR(255),
  meeting_link TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video meeting integrations
CREATE TABLE video_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id),
  platform VARCHAR(50), -- 'zoom', 'teams'
  meeting_id VARCHAR(255),
  join_url TEXT,
  password VARCHAR(100),
  recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact reveal tracking
CREATE TABLE contact_reveals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id),
  service_used VARCHAR(50), -- 'hunter', 'apollo', 'zoominfo'
  credits_used INTEGER DEFAULT 1,
  revealed_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API integration logs
CREATE TABLE integration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name VARCHAR(100),
  endpoint VARCHAR(255),
  request_data JSONB,
  response_data JSONB,
  status_code INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔧 Implementation Priority

### Phase 1: Core Calendar Integration
1. **Google Calendar API** - Primary scheduling system
2. **Database schema updates** - Calendar events table
3. **UI components** - Interview scheduling interface

### Phase 2: Video Conferencing
1. **Zoom API** - Primary video platform
2. **Microsoft Teams API** - Secondary/enterprise option
3. **Meeting management UI** - Create, update, cancel meetings

### Phase 3: Enhanced Contact Discovery
1. **Contact Reveal API selection** - Choose between Hunter.io, Apollo.io, or ZoomInfo
2. **Credit system implementation** - Track usage and billing
3. **Enhanced candidate profiles** - Display enriched contact data

### Phase 4: Advanced Features
1. **Meeting recordings integration** - Store and manage interview recordings
2. **Calendar sync optimization** - Real-time availability checking
3. **Automated workflows** - Interview scheduling automation

---

## 🔐 Security Considerations

### OAuth 2.0 Implementation
- Secure token storage and refresh mechanisms
- Environment-specific client credentials
- Proper scope management for each API

### Data Privacy
- GDPR compliance for candidate data
- Secure storage of API credentials
- Audit logging for all API interactions

### Rate Limiting & Error Handling
- Implement proper rate limiting for all APIs
- Graceful error handling and user feedback
- Retry mechanisms for failed API calls

---

## 📊 Monitoring & Analytics

### API Usage Tracking
- Request/response logging
- Performance monitoring
- Error rate tracking
- Cost analysis for paid APIs

### Integration Health Dashboard
- Real-time API status monitoring
- Integration success rates
- User adoption metrics

---

## 🚀 Next Steps

1. **Service Selection**: Choose specific contact reveal API provider
2. **Development Environment Setup**: Configure all API credentials
3. **Database Migration**: Implement new schema for integrations
4. **Component Development**: Build UI components for each integration
5. **Testing Strategy**: Comprehensive testing for all API integrations

---

## 📚 Additional Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [Zoom API Documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api)
- [Microsoft Graph API Documentation](https://docs.microsoft.com/en-us/graph/)
- [Hunter.io API Documentation](https://hunter.io/api-documentation)
- [Apollo.io API Documentation](https://apolloio.github.io/apollo-api-docs/)
- [ZoomInfo API Documentation](https://developers.zoominfo.com/)

---

*Last Updated: January 2025*
*Status: Planning Phase - Ready for Implementation*
