# Scorecard Browser Extension - Candidate Data Capture

## Overview
The Scorecard Browser Extension enables recruiters to capture candidate data directly from web pages (LinkedIn, job boards, GitHub, etc.) and seamlessly send it to the Scorecard ATS. This extension provides intelligent data extraction, field mapping, and one-click candidate import functionality.

---

## 🎯 Core Features

### 1. **Multi-Platform Data Capture**
- **LinkedIn**: Profiles, job history, education, skills, connections
- **Job Boards**: Indeed, Glassdoor, Stack Overflow Jobs, AngelList
- **Developer Platforms**: GitHub, GitLab, Stack Overflow profiles
- **Company Websites**: Career pages and team directories
- **Social Platforms**: Twitter/X professional profiles
- **Email Platforms**: Gmail, Outlook, Yahoo Mail (resume extraction from attachments)

### 2. **Intelligent Data Extraction**
- **AI-Powered Field Recognition**: Automatically identify and extract relevant data
- **Smart Field Mapping**: Map extracted data to Scorecard candidate fields
- **Duplicate Detection**: Check for existing candidates before import
- **Data Validation**: Ensure data quality and completeness

### 3. **Seamless Integration**
- **One-Click Capture**: Single button to extract and review candidate data
- **Real-Time Sync**: Immediate sync with Scorecard ATS database
- **Bulk Import**: Capture multiple candidates from search results
- **Offline Queue**: Store captures when offline, sync when connected
- **Email Resume Import**: One-click resume capture from email attachments with job assignment

---

## 🏗️ Extension Architecture

### Manifest V3 Structure
```json
{
  "manifest_version": 3,
  "name": "Scorecard - Candidate Capture",
  "version": "1.0.0",
  "description": "Capture candidate data from any website directly into Scorecard ATS",
  "permissions": [
    "activeTab",
    "storage",
    "identity",
    "scripting"
  ],
  "host_permissions": [
    "https://www.linkedin.com/*",
    "https://github.com/*",
    "https://stackoverflow.com/*",
    "https://indeed.com/*",
    "https://glassdoor.com/*",
    "https://angel.co/*",
    "https://wellfound.com/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "css": ["content.css"]
    }
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "Scorecard Candidate Capture"
  },
  "web_accessible_resources": [
    {
      "resources": ["images/*", "fonts/*"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

### Core Components

#### 1. Content Script (content.js)
```typescript
// Main content script for data extraction
class CandidateExtractor {
  private platform: Platform;
  private extractors: Map<Platform, DataExtractor>;

  constructor() {
    this.platform = this.detectPlatform();
    this.extractors = new Map([
      ['linkedin', new LinkedInExtractor()],
      ['github', new GitHubExtractor()],
      ['indeed', new IndeedExtractor()],
      ['stackoverflow', new StackOverflowExtractor()],
      ['glassdoor', new GlassdoorExtractor()]
    ]);
  }

  async extractCandidateData(): Promise<CandidateData> {
    const extractor = this.extractors.get(this.platform);
    if (!extractor) {
      throw new Error(`No extractor available for platform: ${this.platform}`);
    }

    const rawData = await extractor.extract();
    const mappedData = await this.mapToScorecardFields(rawData);
    const validatedData = await this.validateData(mappedData);
    
    return validatedData;
  }

  private detectPlatform(): Platform {
    const hostname = window.location.hostname;
    
    if (hostname.includes('linkedin.com')) return 'linkedin';
    if (hostname.includes('github.com')) return 'github';
    if (hostname.includes('indeed.com')) return 'indeed';
    if (hostname.includes('stackoverflow.com')) return 'stackoverflow';
    if (hostname.includes('glassdoor.com')) return 'glassdoor';
    
    return 'generic';
  }

  private async mapToScorecardFields(rawData: any): Promise<CandidateData> {
    return {
      personalInfo: {
        firstName: rawData.name?.split(' ')[0] || '',
        lastName: rawData.name?.split(' ').slice(1).join(' ') || '',
        email: rawData.email || '',
        phone: rawData.phone || '',
        location: rawData.location || '',
        profileUrl: window.location.href
      },
      professionalInfo: {
        currentRole: rawData.currentPosition?.title || '',
        currentCompany: rawData.currentPosition?.company || '',
        experience: rawData.experience || [],
        education: rawData.education || [],
        skills: rawData.skills || [],
        summary: rawData.summary || ''
      },
      technicalInfo: {
        programmingLanguages: this.extractTechnicalSkills(rawData.skills, 'languages'),
        frameworks: this.extractTechnicalSkills(rawData.skills, 'frameworks'),
        tools: this.extractTechnicalSkills(rawData.skills, 'tools'),
        githubProfile: rawData.githubUrl || '',
        portfolioUrl: rawData.portfolioUrl || ''
      },
      metadata: {
        source: this.platform,
        capturedAt: new Date().toISOString(),
        capturedBy: await this.getCurrentUser(),
        dataQuality: this.calculateDataQuality(rawData)
      }
    };
  }
}
```

#### 2. Platform-Specific Extractors

##### LinkedIn Extractor
```typescript
class LinkedInExtractor implements DataExtractor {
  async extract(): Promise<RawCandidateData> {
    return {
      name: this.extractName(),
      currentPosition: this.extractCurrentPosition(),
      experience: this.extractExperience(),
      education: this.extractEducation(),
      skills: this.extractSkills(),
      summary: this.extractSummary(),
      location: this.extractLocation(),
      profileImage: this.extractProfileImage(),
      contactInfo: this.extractContactInfo()
    };
  }

  private extractName(): string {
    const nameSelectors = [
      'h1.text-heading-xlarge',
      '.pv-text-details__left-panel h1',
      '.profile-photo-edit__preview .visually-hidden'
    ];
    
    for (const selector of nameSelectors) {
      const element = document.querySelector(selector);
      if (element?.textContent?.trim()) {
        return element.textContent.trim();
      }
    }
    
    return '';
  }

  private extractCurrentPosition(): Position {
    const titleElement = document.querySelector('.text-body-medium.break-words');
    const companyElement = document.querySelector('.pv-text-details__left-panel .text-body-small');
    
    return {
      title: titleElement?.textContent?.trim() || '',
      company: companyElement?.textContent?.trim() || '',
      duration: this.extractCurrentPositionDuration(),
      location: this.extractPositionLocation()
    };
  }

  private extractExperience(): Experience[] {
    const experienceSection = document.querySelector('#experience');
    if (!experienceSection) return [];

    const experienceItems = experienceSection.querySelectorAll('.pvs-list__paged-list-item');
    
    return Array.from(experienceItems).map(item => ({
      title: item.querySelector('.mr1.t-bold span')?.textContent?.trim() || '',
      company: item.querySelector('.t-14.t-normal span')?.textContent?.trim() || '',
      duration: item.querySelector('.pvs-entity__caption-wrapper')?.textContent?.trim() || '',
      description: item.querySelector('.pvs-list__outer-container')?.textContent?.trim() || '',
      location: this.extractItemLocation(item)
    }));
  }

  private extractSkills(): string[] {
    const skillsSection = document.querySelector('#skills');
    if (!skillsSection) return [];

    const skillElements = skillsSection.querySelectorAll('.mr1.hoverable-link-text.t-bold span');
    
    return Array.from(skillElements)
      .map(el => el.textContent?.trim())
      .filter(skill => skill && skill.length > 0) as string[];
  }
}
```

##### GitHub Extractor
```typescript
class GitHubExtractor implements DataExtractor {
  async extract(): Promise<RawCandidateData> {
    return {
      name: this.extractName(),
      githubUsername: this.extractUsername(),
      bio: this.extractBio(),
      location: this.extractLocation(),
      company: this.extractCompany(),
      email: this.extractEmail(),
      website: this.extractWebsite(),
      repositories: await this.extractRepositories(),
      languages: await this.extractLanguages(),
      contributions: this.extractContributions(),
      followers: this.extractFollowers(),
      following: this.extractFollowing()
    };
  }

  private extractName(): string {
    return document.querySelector('.p-name.vcard-fullname')?.textContent?.trim() || '';
  }

  private extractUsername(): string {
    return document.querySelector('.p-nickname.vcard-username')?.textContent?.trim() || '';
  }

  private async extractRepositories(): Promise<Repository[]> {
    const repoElements = document.querySelectorAll('[data-testid="repository-list"] .Box-row');
    
    return Array.from(repoElements).map(repo => ({
      name: repo.querySelector('h3 a')?.textContent?.trim() || '',
      description: repo.querySelector('p')?.textContent?.trim() || '',
      language: repo.querySelector('[itemprop="programmingLanguage"]')?.textContent?.trim() || '',
      stars: this.parseNumber(repo.querySelector('[href*="/stargazers"]')?.textContent || '0'),
      forks: this.parseNumber(repo.querySelector('[href*="/forks"]')?.textContent || '0'),
      lastUpdated: repo.querySelector('relative-time')?.getAttribute('datetime') || ''
    }));
  }

  private async extractLanguages(): Promise<LanguageStats[]> {
    // Extract from repository language stats
    const languageElements = document.querySelectorAll('.BorderGrid-cell .color-fg-default');
    
    return Array.from(languageElements).map(lang => ({
      name: lang.textContent?.trim() || '',
      percentage: this.extractLanguagePercentage(lang),
      bytes: this.extractLanguageBytes(lang)
    }));
  }
}
```

#### 3. Extension Popup (popup.html)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 400px;
      min-height: 500px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      text-align: center;
    }
    
    .logo {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .subtitle {
      font-size: 12px;
      opacity: 0.9;
    }
    
    .content {
      padding: 20px;
    }
    
    .capture-button {
      width: 100%;
      padding: 12px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 15px;
      transition: background 0.2s;
    }
    
    .capture-button:hover {
      background: #5a6fd8;
    }
    
    .capture-button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .platform-info {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 15px;
      font-size: 12px;
    }
    
    .candidate-preview {
      border: 1px solid #e1e5e9;
      border-radius: 8px;
      padding: 15px;
      margin-top: 15px;
    }
    
    .candidate-name {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 5px;
    }
    
    .candidate-role {
      color: #666;
      font-size: 14px;
      margin-bottom: 10px;
    }
    
    .candidate-details {
      font-size: 12px;
      color: #888;
    }
    
    .actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }
    
    .btn-secondary {
      flex: 1;
      padding: 8px;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
    }
    
    .btn-primary {
      flex: 1;
      padding: 8px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
    }
    
    .loading {
      text-align: center;
      padding: 20px;
      color: #666;
    }
    
    .error {
      background: #f8d7da;
      color: #721c24;
      padding: 12px;
      border-radius: 8px;
      font-size: 12px;
      margin-bottom: 15px;
    }
    
    .success {
      background: #d4edda;
      color: #155724;
      padding: 12px;
      border-radius: 8px;
      font-size: 12px;
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Scorecard</div>
    <div class="subtitle">Candidate Capture Extension</div>
  </div>
  
  <div class="content">
    <div id="platform-info" class="platform-info" style="display: none;">
      <strong>Platform Detected:</strong> <span id="platform-name"></span><br>
      <strong>Page Type:</strong> <span id="page-type"></span>
    </div>
    
    <button id="capture-btn" class="capture-button">
      🎯 Capture Candidate Data
    </button>
    
    <div id="loading" class="loading" style="display: none;">
      <div>⏳ Extracting candidate data...</div>
    </div>
    
    <div id="error" class="error" style="display: none;"></div>
    <div id="success" class="success" style="display: none;"></div>
    
    <div id="candidate-preview" class="candidate-preview" style="display: none;">
      <div class="candidate-name" id="candidate-name"></div>
      <div class="candidate-role" id="candidate-role"></div>
      <div class="candidate-details">
        <div><strong>Location:</strong> <span id="candidate-location"></span></div>
        <div><strong>Experience:</strong> <span id="candidate-experience"></span></div>
        <div><strong>Skills:</strong> <span id="candidate-skills"></span></div>
      </div>
      
      <div class="actions">
        <button id="edit-btn" class="btn-secondary">✏️ Edit</button>
        <button id="save-btn" class="btn-primary">💾 Save to Scorecard</button>
      </div>
    </div>
    
    <div id="recent-captures" style="margin-top: 20px;">
      <h4 style="margin-bottom: 10px; font-size: 14px; color: #666;">Recent Captures</h4>
      <div id="recent-list" style="font-size: 12px; color: #888;">
        No recent captures
      </div>
    </div>
  </div>
  
  <script src="popup.js"></script>
</body>
</html>
```

#### 4. Popup Logic (popup.js)
```typescript
class ExtensionPopup {
  private currentTab: chrome.tabs.Tab | null = null;
  private extractedData: CandidateData | null = null;

  async init() {
    await this.getCurrentTab();
    await this.detectPlatform();
    this.setupEventListeners();
    await this.loadRecentCaptures();
  }

  private async getCurrentTab(): Promise<void> {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    this.currentTab = tab;
  }

  private async detectPlatform(): Promise<void> {
    if (!this.currentTab?.url) return;

    const platform = this.getPlatformFromUrl(this.currentTab.url);
    const pageType = await this.getPageType();

    if (platform !== 'unknown') {
      document.getElementById('platform-info')!.style.display = 'block';
      document.getElementById('platform-name')!.textContent = platform;
      document.getElementById('page-type')!.textContent = pageType;
    }
  }

  private setupEventListeners(): void {
    document.getElementById('capture-btn')?.addEventListener('click', () => {
      this.captureCandidate();
    });

    document.getElementById('edit-btn')?.addEventListener('click', () => {
      this.editCandidate();
    });

    document.getElementById('save-btn')?.addEventListener('click', () => {
      this.saveCandidate();
    });
  }

  private async captureCandidate(): Promise<void> {
    if (!this.currentTab?.id) return;

    this.showLoading(true);
    this.hideError();

    try {
      // Inject content script and extract data
      const results = await chrome.scripting.executeScript({
        target: { tabId: this.currentTab.id },
        func: this.extractCandidateData
      });

      if (results[0]?.result) {
        this.extractedData = results[0].result;
        this.showCandidatePreview(this.extractedData);
        this.showSuccess('Candidate data extracted successfully!');
      } else {
        throw new Error('No data could be extracted from this page');
      }
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.showLoading(false);
    }
  }

  private async saveCandidate(): Promise<void> {
    if (!this.extractedData) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/candidates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify(this.extractedData)
      });

      if (response.ok) {
        const savedCandidate = await response.json();
        this.showSuccess(`Candidate saved successfully! ID: ${savedCandidate.id}`);
        await this.addToRecentCaptures(savedCandidate);
        
        // Clear the preview after successful save
        setTimeout(() => {
          document.getElementById('candidate-preview')!.style.display = 'none';
        }, 2000);
      } else {
        throw new Error('Failed to save candidate to Scorecard');
      }
    } catch (error) {
      this.showError(error.message);
    }
  }

  private showCandidatePreview(data: CandidateData): void {
    document.getElementById('candidate-name')!.textContent = 
      `${data.personalInfo.firstName} ${data.personalInfo.lastName}`;
    
    document.getElementById('candidate-role')!.textContent = 
      `${data.professionalInfo.currentRole} at ${data.professionalInfo.currentCompany}`;
    
    document.getElementById('candidate-location')!.textContent = 
      data.personalInfo.location || 'Not specified';
    
    document.getElementById('candidate-experience')!.textContent = 
      `${data.professionalInfo.experience.length} positions`;
    
    document.getElementById('candidate-skills')!.textContent = 
      data.professionalInfo.skills.slice(0, 3).join(', ') + 
      (data.professionalInfo.skills.length > 3 ? '...' : '');

    document.getElementById('candidate-preview')!.style.display = 'block';
  }

  private showLoading(show: boolean): void {
    document.getElementById('loading')!.style.display = show ? 'block' : 'none';
    document.getElementById('capture-btn')!.disabled = show;
  }

  private showError(message: string): void {
    const errorEl = document.getElementById('error')!;
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }

  private showSuccess(message: string): void {
    const successEl = document.getElementById('success')!;
    successEl.textContent = message;
    successEl.style.display = 'block';
    
    setTimeout(() => {
      successEl.style.display = 'none';
    }, 3000);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ExtensionPopup().init();
});
```

---

## 🔧 Data Models

### Candidate Data Structure
```typescript
interface CandidateData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    profileUrl: string;
    profileImage?: string;
  };
  
  professionalInfo: {
    currentRole: string;
    currentCompany: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
    summary: string;
    linkedinUrl?: string;
  };
  
  technicalInfo: {
    programmingLanguages: TechnicalSkill[];
    frameworks: TechnicalSkill[];
    tools: TechnicalSkill[];
    githubProfile?: string;
    portfolioUrl?: string;
    repositories?: Repository[];
  };
  
  metadata: {
    source: Platform;
    capturedAt: string;
    capturedBy: string;
    dataQuality: number; // 0-100
    lastUpdated?: string;
  };
}

interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
  location: string;
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
}

interface TechnicalSkill {
  name: string;
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience?: number;
  lastUsed?: string;
}

interface Repository {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  lastUpdated: string;
  url: string;
}
```

---

## 🚀 Implementation Roadmap

### Phase 1: Core Extension (Week 1-2)
- [ ] Set up extension manifest and basic structure
- [ ] Implement LinkedIn data extraction
- [ ] Create popup UI and basic functionality
- [ ] Add authentication with Scorecard backend
- [ ] Test data capture and API integration

### Phase 2: Multi-Platform Support (Week 3-4)
- [ ] Add GitHub profile extraction
- [ ] Implement Indeed/job board extractors
- [ ] Add Stack Overflow profile support
- [ ] Create generic extractor for unknown sites
- [ ] Implement data validation and quality scoring

### Phase 3: Advanced Features (Week 5-6)
- [ ] Add bulk capture from search results
- [ ] Implement offline queue and sync
- [ ] Add duplicate detection and merging
- [ ] Create data editing interface
- [ ] Add export/import functionality

### Phase 4: Polish & Distribution (Week 7-8)
- [ ] Comprehensive testing across platforms
- [ ] Add analytics and usage tracking
- [ ] Create user documentation and tutorials
- [ ] Submit to Chrome Web Store
- [ ] Add Firefox and Edge support

---

## 🔒 Security & Privacy

### Data Protection
- **Secure Authentication**: OAuth 2.0 with Scorecard backend
- **Encrypted Storage**: All captured data encrypted locally
- **HTTPS Only**: All API communications over HTTPS
- **Minimal Permissions**: Request only necessary browser permissions

### Privacy Compliance
- **GDPR Compliance**: Clear data usage disclosure
- **User Consent**: Explicit consent before data capture
- **Data Retention**: Configurable data retention policies
- **Right to Delete**: Easy data deletion functionality

### Content Security
- **CSP Headers**: Strict content security policies
- **Input Validation**: Sanitize all extracted data
- **XSS Prevention**: Prevent cross-site scripting attacks
- **Safe Injection**: Secure content script injection

This browser extension will revolutionize how recruiters capture and import candidate data, making the process seamless, accurate, and efficient across all major platforms!
