import { Button } from "@/components/ui/button";
import { Linkedin, Loader2 } from "lucide-react";
import { useLinkedIn } from "@/hooks/useLinkedIn";

interface LinkedInConnectButtonProps {
  onConnect?: () => void;
  isConnected?: boolean;
  className?: string;
  variant?: "default" | "outline" | "secondary";
}

/**
 * LinkedIn Connect Button Component
 * 
 * Renders a button to initiate LinkedIn OAuth flow
 * Shows different states: connect, connecting, connected
 */
export const LinkedInConnectButton = ({ 
  onConnect, 
  isConnected: externalIsConnected, 
  className = "",
  variant = "default"
}: LinkedInConnectButtonProps) => {
  // Use our LinkedIn hook
  const { isConnected: hookIsConnected, isLoading: hookIsLoading, connect, disconnect } = useLinkedIn();
  
  // Allow for both externally managed or hook-managed connection state
  const isConnected = externalIsConnected !== undefined ? externalIsConnected : hookIsConnected;
  const isLoading = hookIsLoading;
  
  const handleConnect = async () => {
    if (isConnected || isLoading) return;
    
    try {
      // Notify parent component if callback provided
      if (onConnect) {
        onConnect();
      }
      
      // Start LinkedIn OAuth flow using the hook
      connect();
      
      // The connect method will handle redirection to LinkedIn
    } catch (error) {
      console.error("LinkedIn connection error:", error);
    }
  };
  
  const handleDisconnect = () => {
    disconnect();
  };
  
  return (
    <div className={className}>
      {!isConnected ? (
        <Button 
          variant={variant}
          onClick={handleConnect}
          disabled={isLoading}
          className="flex items-center space-x-2 w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Linkedin className="h-4 w-4" />
              <span>Connect with LinkedIn</span>
            </>
          )}
        </Button>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Linkedin className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Connected to LinkedIn</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDisconnect}
            className="text-xs h-8"
          >
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
};

export default LinkedInConnectButton;
