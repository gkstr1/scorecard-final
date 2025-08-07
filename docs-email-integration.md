# Email Integration - Resume Capture

## Overview
When the Scorecard browser extension is installed, it adds a "Send to Scorecard" button to emails in Gmail, Outlook, and other email platforms. This enables one-click resume capture from email attachments directly into the ATS.

## Key Features

### 1. Email Platform Support
- **Gmail**: Inject button into email interface
- **Outlook**: Web and desktop integration
- **Yahoo Mail**: Basic attachment capture
- **Apple Mail**: Web interface support

### 2. Resume Detection
- **Smart File Detection**: Automatically identify resume attachments (.pdf, .doc, .docx)
- **Keyword Recognition**: Detect "resume", "CV", "curriculum vitae" in filenames
- **Content Analysis**: Parse attachment content to confirm it's a resume

### 3. One-Click Workflow
```typescript
// Email capture workflow
async captureFromEmail() {
  // 1. Extract candidate info from email
  const candidateData = extractCandidateFromEmail();
  
  // 2. Download and parse resume attachment
  const resumeData = await parseResumeAttachment();
  
  // 3. Show job selection modal
  const selectedJob = await showJobSelectionModal();
  
  // 4. Create candidate in "Sourced" stage
  await createCandidate({
    ...candidateData,
    ...resumeData,
    jobId: selectedJob.id,
    stage: 'sourced',
    source: 'email'
  });
}
```

### 4. Job Assignment
- **Job Selection Modal**: Choose which job to assign the candidate to
- **Auto-Assignment**: Smart job matching based on email content/subject
- **Default Job**: Fallback to recruiter's default job if no match

### 5. Data Extraction
- **Email Metadata**: From, subject, date, thread ID
- **Candidate Info**: Name, email, phone from signature
- **Resume Parsing**: Skills, experience, education from attachment
- **Communication History**: Store email thread for context

## Implementation

### Gmail Integration
```typescript
class GmailIntegration {
  injectScorecardButton() {
    const toolbar = document.querySelector('[role="toolbar"]');
    const button = this.createScorecardButton();
    toolbar.appendChild(button);
  }
  
  async captureResume() {
    const attachments = this.getResumeAttachments();
    const candidateInfo = this.extractCandidateInfo();
    
    // Show job selection and process
    await this.processEmailCapture(candidateInfo, attachments);
  }
}
```

### Outlook Integration
```typescript
class OutlookIntegration {
  injectScorecardButton() {
    const commandBar = document.querySelector('[data-testid="commandbar"]');
    const button = this.createScorecardButton();
    commandBar.appendChild(button);
  }
}
```

## Benefits
- **Instant Processing**: Convert email applications to ATS candidates in seconds
- **Zero Data Entry**: Automatic extraction eliminates manual typing
- **Complete Context**: Preserve email thread and communication history
- **Job Pipeline**: Candidates automatically enter appropriate job pipeline

This email integration will dramatically speed up the candidate intake process for recruiters!
