import { useState, useEffect, useCallback } from 'react';
import { LinkedInService, LinkedInProfile, LinkedInOAuthConfig } from '@/services/linkedinService';

// Define LinkedIn configuration
const linkedInConfig: LinkedInOAuthConfig = {
  clientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID || '',
  redirectUri: `${window.location.origin}/linkedin-callback`,
  scope: ['r_liteprofile', 'r_emailaddress']
};

// Initialize LinkedIn service
const linkedInService = new LinkedInService(linkedInConfig);

/**
 * Custom hook for LinkedIn integration
 */
export const useLinkedIn = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<Partial<LinkedInProfile> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Fetch LinkedIn profile data
  const fetchProfile = useCallback(async () => {
    if (!isConnected) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const profileData = await linkedInService.getProfile();
      setProfile(profileData);
    } catch (err) {
      console.error('Error fetching LinkedIn profile:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching profile'));
      
      // If unauthorized, clear connection status
      if (err instanceof Error && err.message === 'Not authenticated with LinkedIn') {
        setIsConnected(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);
  
  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = linkedInService.isAuthenticated();
      setIsConnected(authenticated);
      
      // If authenticated, try to fetch profile data
      if (authenticated && !profile) {
        fetchProfile();
      }
    };
    
    checkAuth();
  }, [fetchProfile, profile]);

  // Initiate LinkedIn authentication
  const connect = useCallback(() => {
    try {
      // Get authorization URL
      const authUrl = linkedInService.initiateLinkedInAuth();
      
      // Redirect to LinkedIn authorization page
      window.location.href = authUrl;
    } catch (err) {
      console.error('Error initiating LinkedIn auth:', err);
      setError(err instanceof Error ? err : new Error('Failed to connect to LinkedIn'));
    }
  }, []);

  // Handle LinkedIn OAuth callback
  const handleCallback = useCallback(async (code: string, state: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await linkedInService.handleOAuthCallback(code, state);
      setIsConnected(true);
      await fetchProfile();
    } catch (err) {
      console.error('Error handling LinkedIn callback:', err);
      setError(err instanceof Error ? err : new Error('Failed to complete LinkedIn authentication'));
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  // Disconnect from LinkedIn
  const disconnect = useCallback(() => {
    linkedInService.logout();
    setIsConnected(false);
    setProfile(null);
  }, []);

  return {
    isConnected,
    isLoading,
    profile,
    error,
    connect,
    disconnect,
    handleCallback,
    fetchProfile
  };
};
