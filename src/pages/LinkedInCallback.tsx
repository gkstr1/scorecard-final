import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLinkedIn } from "@/hooks/useLinkedIn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Linkedin } from "lucide-react";

/**
 * LinkedIn OAuth callback handler page
 * Processes the callback from LinkedIn authentication
 */
const LinkedInCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback, isLoading, error } = useLinkedIn();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const processCallback = async () => {
      // Get code and state from URL params
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      
      // Error handling for missing params
      if (!code || !state) {
        console.error("Missing code or state params from LinkedIn callback");
        setStatus("error");
        return;
      }
      
      try {
        // Process the callback
        await handleCallback(code, state);
        setStatus("success");
        
        // Auto-redirect after a short delay
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      } catch (err) {
        console.error("Error processing LinkedIn callback:", err);
        setStatus("error");
      }
    };
    
    processCallback();
  }, [searchParams, handleCallback, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Linkedin className="h-5 w-5 text-blue-600" />
            LinkedIn Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            {status === "loading" && (
              <>
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
                <p className="text-lg font-medium">Verifying LinkedIn authentication...</p>
                <p className="text-sm text-muted-foreground">Please wait while we process your credentials</p>
              </>
            )}
            
            {status === "success" && (
              <>
                <CheckCircle className="h-16 w-16 text-green-600" />
                <p className="text-lg font-medium">Authentication successful!</p>
                <p className="text-sm text-muted-foreground">You will be redirected automatically</p>
              </>
            )}
            
            {status === "error" && (
              <>
                <XCircle className="h-16 w-16 text-red-600" />
                <p className="text-lg font-medium">Authentication failed</p>
                <p className="text-sm text-muted-foreground">
                  {error ? error.message : "There was an error connecting your LinkedIn account"}
                </p>
                <Button onClick={() => navigate("/", { replace: true })}>
                  Return to Dashboard
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedInCallback;
