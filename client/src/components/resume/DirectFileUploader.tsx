import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface DirectFileUploaderProps {
  userId?: number;
  onUploadComplete?: () => void;
}

export function DirectFileUploader({ userId, onUploadComplete }: DirectFileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileUpload = async (file: File) => {
    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "Please log in to upload your resume.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, DOC, or DOCX file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Get presigned URL for upload
      const uploadResponse = await fetch('/api/resume/upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadURL } = await uploadResponse.json();

      // Upload file directly to object storage
      const uploadResult = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResult.ok) {
        throw new Error('Failed to upload file');
      }

      // Save resume metadata
      const resumeData = {
        fileName: file.name,
        fileUrl: uploadURL.split('?')[0], // Remove query parameters
        fileSize: file.size,
        userId: userId,
      };

      const saveResponse = await fetch('/api/resume/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(resumeData),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save resume metadata');
      }

      toast({
        title: "Resume Uploaded Successfully",
        description: `${file.name} has been uploaded and saved.`,
      });

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onUploadComplete?.();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    console.log('Triggering file input click');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDirectFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Direct file input changed');
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected via direct input:', file.name);
      handleFileUpload(file);
    }
    // Reset input
    event.target.value = '';
  };

  return (
    <Card className="cb-glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-purple-600" />
          Upload Resume - Direct Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">

          {isUploading ? (
            <div className="p-8 text-center">
              <Clock className="h-12 w-12 text-purple-600 mx-auto animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Uploading...</h3>
              <p className="text-gray-600">Please wait while we process your resume</p>
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-400 transition-colors">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Resume</h3>
              <p className="text-gray-600 mb-4">Select your resume file from your computer</p>
              <p className="text-sm text-gray-500 mb-4">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>

              {/* Hidden file input with button trigger */}
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleDirectFileChange}
                  disabled={isUploading}
                  style={{ display: 'none' }}
                />
                
                <Button 
                  onClick={triggerFileInput}
                  className="cb-gradient-primary"
                  disabled={isUploading}
                  type="button"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Resume File
                </Button>

                <div className="text-xs text-gray-400">
                  Click the button above to select your resume file
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}