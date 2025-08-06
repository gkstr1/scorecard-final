import axios from 'axios';

/**
 * LinkedIn OAuth configuration
 */
export interface LinkedInOAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string[];
}

/**
 * LinkedIn OAuth response after token exchange
 */
export interface LinkedInTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

/**
 * Interface representing LinkedIn profile data structure
 */
export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  email?: string;
  phone?: string;
  headline?: string;
  currentPosition?: {
    title: string;
    company: string;
  };
  location?: string;
  education?: {
    school: string;
    degree: string;
  };
  skills?: string[];
  connections?: number;
}

/**
 * LinkedIn API Service
 * Handles all interactions with LinkedIn API
 */
export class LinkedInService {
  private accessToken: string | null;
  private baseUrl = 'https://api.linkedin.com/v2';
  private clientId: string;
  private redirectUri: string;
  private scope: string[];
  
  constructor(config: LinkedInOAuthConfig, accessToken?: string) {
    this.accessToken = accessToken || null;
    this.clientId = config.clientId;
    this.redirectUri = config.redirectUri;
    this.scope = config.scope;
  }
  
  /**
   * Set access token (used after OAuth exchange)
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
  }
  
  /**
   * Get authenticated user's LinkedIn profile
   */
  async getProfile(): Promise<LinkedInProfile> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with LinkedIn');
    }
    
    try {
      // Fetch basic profile data
      const profileResponse = await this.apiGet('/me?projection=(id,firstName,lastName,headline,vanityName)');
      
      // Fetch email address (requires r_emailaddress permission)
      const emailResponse = await this.apiGet('/emailAddress?q=members&projection=(elements*(handle~))');
      
      // Fetch profile picture (requires r_liteprofile permission)
      const pictureResponse = await this.apiGet('/me?projection=(profilePicture(displayImage~:playableStreams))');
      
      // Fetch current position (requires r_liteprofile permission)
      const positionsResponse = await this.apiGet('/positions?q=memberPositions');
      
      // Extract email from response with proper type safety
      let email: string | undefined;
      try {
        const elements = (emailResponse.elements as Array<Record<string, unknown>> | undefined) || [];
        if (elements.length > 0) {
          const firstElement = elements[0] as Record<string, unknown>;
          const handleTilde = firstElement['handle~'] as Record<string, unknown> | undefined;
          email = handleTilde?.emailAddress as string | undefined;
        }
      } catch (e) {
        console.error('Error extracting email from LinkedIn response:', e);
      }
      
      // Extract profile picture URL from response
      const profilePictureUrl = this.extractProfilePictureUrl(pictureResponse);
      
      // Extract current position from response
      const currentPosition = this.extractCurrentPosition(positionsResponse);
      
      // Construct and return profile object
      return {
        id: profileResponse.id as string,
        firstName: profileResponse.localizedFirstName as string,
        lastName: profileResponse.localizedLastName as string,
        profilePicture: profilePictureUrl,
        email,
        headline: profileResponse.headline as string | undefined,
        currentPosition,
        // Other fields would be populated similarly
      };
    } catch (error) {
      console.error('Error fetching LinkedIn profile:', error);
      throw new Error('Failed to fetch LinkedIn profile');
    }
  }
  
  /**
   * Search for profiles by keywords
   */
  async searchProfiles(keywords: string): Promise<LinkedInProfile[]> {
    try {
      // This endpoint requires Marketing Developer Platform access
      // and appropriate permissions
      const response = await this.apiGet(`/search?q=${encodeURIComponent(keywords)}`);
      
      // Transform response into array of LinkedInProfile objects
      // Implementation would depend on actual API response structure
      
      return [];
    } catch (error) {
      console.error('Error searching LinkedIn profiles:', error);
      throw new Error('Failed to search LinkedIn profiles');
    }
  }
  
  /**
   * Helper method for making GET requests to LinkedIn API
   */
  private async apiGet(endpoint: string): Promise<Record<string, unknown>> {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`LinkedIn API error (${endpoint}):`, error);
      throw error;
    }
  }
  
  /**
   * Extract profile picture URL from LinkedIn API response
   */
  private extractProfilePictureUrl(response: Record<string, unknown>): string | undefined {
    try {
      // Navigate through the nested response structure with proper type checking
      const profilePicture = response.profilePicture as Record<string, unknown> | undefined;
      if (!profilePicture) return undefined;
      
      const displayImage = profilePicture['displayImage~'] as Record<string, unknown> | undefined;
      if (!displayImage) return undefined;
      
      const elements = (displayImage.elements as Array<Record<string, unknown>> | undefined) || [];
      
      // Find the highest resolution image
      // Typically the last element has the highest resolution
      const highestResImage = elements[elements.length - 1] as Record<string, unknown> | undefined;
      if (!highestResImage) return undefined;
      
      const identifiers = highestResImage.identifiers as Array<Record<string, unknown>> | undefined;
      if (!identifiers || identifiers.length === 0) return undefined;
      
      return identifiers[0].identifier as string;
    } catch (error) {
      console.error('Error extracting profile picture URL:', error);
      return undefined;
    }
  }
  
  /**
   * Extract current position from LinkedIn API response
   */
  private extractCurrentPosition(response: Record<string, unknown>): { title: string; company: string } | undefined {
    try {
      const positions = (response.elements as Array<Record<string, unknown>> | undefined) || [];
      
      // Find the current position (usually the first one)
      const currentPosition = positions[0] as Record<string, unknown> | undefined;
      
      if (!currentPosition) return undefined;
      
      const company = currentPosition.company as Record<string, unknown> | undefined;
      
      return {
        title: currentPosition.title as string,
        company: company?.name as string,
      };
    } catch (error) {
      console.error('Error extracting current position:', error);
      return undefined;
    }
  }
  
  /**
   * Initiate LinkedIn OAuth 2.0 flow
   * @returns Authorization URL to redirect the user to
   */
  initiateLinkedInAuth(): string {
    const state = this.generateRandomState();
    
    // Store state in sessionStorage for CSRF protection
    sessionStorage.setItem('linkedin_oauth_state', state);
    
    // Construct authorization URL
    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    
    // Add required parameters
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', this.clientId);
    authUrl.searchParams.append('redirect_uri', this.redirectUri);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('scope', this.scope.join(' '));
    
    return authUrl.toString();
  }
  
  /**
   * Generate random state parameter for OAuth CSRF protection
   * @returns Random state string
   */
  private generateRandomState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
  
  /**
   * Handle OAuth callback and exchange authorization code for access token
   * @param code Authorization code from LinkedIn callback
   * @param state State parameter from LinkedIn callback
   * @returns Promise resolving to the token response
   */
  async handleOAuthCallback(code: string, state: string): Promise<LinkedInTokenResponse> {
    // Verify state parameter to prevent CSRF attacks
    const storedState = sessionStorage.getItem('linkedin_oauth_state');
    if (!storedState || storedState !== state) {
      throw new Error('Invalid state parameter. Possible CSRF attack.');
    }
    
    // Clear the stored state
    sessionStorage.removeItem('linkedin_oauth_state');
    
    // Exchange authorization code for access token
    try {
      const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
        params: {
          grant_type: 'authorization_code',
          code,
          client_id: this.clientId,
          // In a production environment, client_secret should be kept secure and only used server-side
          // For this demo implementation, we're including it client-side, but in a real app this exchange
          // should happen on your backend
          client_secret: process.env.REACT_APP_LINKEDIN_CLIENT_SECRET || '',
          redirect_uri: this.redirectUri
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      // Set the access token for future API calls
      this.setAccessToken(response.data.access_token);
      
      // Store token in localStorage (in a real app, consider more secure storage options)
      localStorage.setItem('linkedInAccessToken', response.data.access_token);
      localStorage.setItem('linkedInTokenExpiry', (Date.now() + response.data.expires_in * 1000).toString());
      
      return response.data;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }
  
  /**
   * Check if the user is currently authenticated with LinkedIn
   * @returns Boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    // Check for access token and if it's not expired
    const token = localStorage.getItem('linkedInAccessToken');
    const expiry = localStorage.getItem('linkedInTokenExpiry');
    
    if (!token || !expiry) {
      return false;
    }
    
    // Check if token is expired
    const expiryTime = parseInt(expiry, 10);
    if (Date.now() > expiryTime) {
      // Token expired, clean up
      this.logout();
      return false;
    }
    
    // We have a valid token
    if (!this.accessToken) {
      this.accessToken = token; // Restore token to service
    }
    
    return true;
  }
  
  /**
   * Log out user by removing LinkedIn tokens
   */
  logout(): void {
    localStorage.removeItem('linkedInAccessToken');
    localStorage.removeItem('linkedInTokenExpiry');
    this.accessToken = null;
  }
}

/**
 * Utility function to initialize LinkedIn OAuth flow
 */
export function initiateLinkedInAuth(): void {
  // LinkedIn OAuth 2.0 authorization URL
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = encodeURIComponent(`${window.location.origin}/auth/linkedin/callback`);
  const scope = encodeURIComponent('r_liteprofile r_emailaddress w_member_social');
  const state = generateRandomState();
  
  // Store state in session storage for validation when handling the callback
  sessionStorage.setItem('linkedinOAuthState', state);
  
  // Redirect to LinkedIn authorization page
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
  
  window.location.href = authUrl;
}

/**
 * Generate random state parameter for OAuth security
 */
function generateRandomState(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
