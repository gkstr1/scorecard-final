
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ResumeUploadProps {
  onResumesParsed: (parsedData: any) => void;
  jobPosition?: string;
}

const ResumeUpload = ({ onResumesParsed, jobPosition = "Software Developer" }: ResumeUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // For now, we'll handle text files. In production, you'd want to add PDF parsing
      if (file.type === "text/plain") {
        const text = await file.text();
        setResumeText(text);
        await parseResume(text);
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a text file (.txt). PDF support coming soon!",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error reading file:", error);
      toast({
        title: "Error",
        description: "Failed to read the file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const parseResume = async (text: string) => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please provide resume text to parse",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: {
          resumeText: text,
          jobPosition: jobPosition
        }
      });

      if (error) throw error;

      if (data?.parsedData) {
        onResumesParsed(data.parsedData);
        toast({
          title: "Success",
          description: "Resume parsed successfully!"
        });
      } else {
        throw new Error("No parsed data received");
      }
    } catch (error) {
      console.error("Error parsing resume:", error);
      toast({
        title: "Error",
        description: "Failed to parse resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextAreaParse = () => {
    parseResume(resumeText);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resume Parser
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="resume-file">Upload Resume File</Label>
          <Input
            id="resume-file"
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Currently supports .txt files. PDF support coming soon.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or paste resume text</span>
          </div>
        </div>

        <div>
          <Label htmlFor="resume-text">Resume Text</Label>
          <textarea
            id="resume-text"
            className="w-full min-h-[200px] p-3 border border-input rounded-md resize-none"
            placeholder="Paste resume content here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            disabled={isUploading}
          />
        </div>

        <Button 
          onClick={handleTextAreaParse} 
          disabled={isUploading || !resumeText.trim()}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Parsing Resume...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Parse Resume
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
