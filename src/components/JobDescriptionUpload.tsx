import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Loader2, X } from "lucide-react";

interface FileUploadProps {
  onContentExtracted: (content: string) => void;
}

const JobDescriptionUpload = ({ onContentExtracted }: FileUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      let content = "";
      
      if (file.type === "text/plain") {
        // Handle TXT files
        content = await file.text();
      } else if (file.type === "application/pdf") {
        // Handle PDF files
        const arrayBuffer = await file.arrayBuffer();
        const pdfParse = await import('pdf-parse');
        const pdfData = await pdfParse.default(arrayBuffer);
        content = pdfData.text;
      } else if (
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword"
      ) {
        // Handle DOC/DOCX files
        const arrayBuffer = await file.arrayBuffer();
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ arrayBuffer });
        content = result.value;
      } else {
        throw new Error("Unsupported file type");
      }

      if (content.trim()) {
        onContentExtracted(content);
        toast({
          title: "Success",
          description: "Job description extracted successfully",
        });
      } else {
        throw new Error("No content found in file");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error",
        description: "Failed to extract content from file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <Input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {!uploadedFile ? (
        <Card 
          className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
          onClick={triggerFileSelect}
        >
          <CardContent className="flex flex-col items-center justify-center py-6">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-foreground mb-1">
              Upload Job Description
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Supports PDF, DOC, DOCX, and TXT files
            </p>
            <Button size="sm" variant="outline">
              <FileText className="h-3 w-3 mr-1" />
              Choose File
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isProcessing && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={removeFile}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobDescriptionUpload;