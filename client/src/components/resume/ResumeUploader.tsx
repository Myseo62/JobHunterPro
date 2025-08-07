import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import {
  Upload,
  FileText,
  Eye,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus
} from "lucide-react";

interface ResumeVersion {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  isActive: boolean;
  fileSize: number;
}

interface ResumeUploaderProps {
  userId?: number;
  currentResumes?: ResumeVersion[];
  onUploadComplete?: () => void;
}

export function ResumeUploader({ userId, currentResumes = [], onUploadComplete }: ResumeUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Show only up to 3 versions
  const resumeVersions = currentResumes.slice(0, 3);
  const canUploadMore = resumeVersions.length < 3;

  const handleFileUpload = async (file: File) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please log in to upload your resume.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
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

      // Save resume metadata to database
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
      queryClient.invalidateQueries({ queryKey: [`/api/resume/versions/${userId}`] });
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input change triggered');
    const file = e.target.files?.[0];
    console.log('Selected file:', file);
    
    if (!file) {
      console.log('No file selected');
      return;
    }
    
    if (!userId) {
      console.log('No user ID available');
      toast({
        title: "Authentication Error",
        description: "Please log in to upload your resume.",
        variant: "destructive",
      });
      return;
    }

    handleFileUpload(file);
    
    // Reset the file input to allow selecting the same file again if needed
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDeleteResume = async (resumeId: string) => {
    try {
      const response = await fetch(`/api/resume/${resumeId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete resume');
      }

      toast({
        title: "Resume Deleted",
        description: "Resume version has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: [`/api/resume/versions/${userId}`] });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetActive = async (resumeId: string) => {
    try {
      const response = await fetch(`/api/resume/${resumeId}/activate`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to activate resume');
      }

      toast({
        title: "Active Resume Updated",
        description: "This resume is now your active version.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: [`/api/resume/versions/${userId}`] });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update active resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleButtonClick = () => {
    console.log('Button clicked, triggering file input');
    console.log('File input ref:', fileInputRef.current);
    
    if (fileInputRef.current) {
      console.log('Clicking file input');
      fileInputRef.current.click();
    } else {
      console.error('File input ref not found');
      toast({
        title: "Upload Error",
        description: "File selection dialog could not be opened. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {canUploadMore && (
        <Card className="cb-glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-purple-600" />
              Upload Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`p-8 border-2 border-dashed rounded-lg text-center transition-colors ${
                dragActive
                  ? 'border-purple-500 bg-purple-50'
                  : isUploading
                  ? 'border-gray-300 bg-gray-50'
                  : 'border-gray-300 hover:border-purple-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                disabled={isUploading}
              />
              
              {isUploading ? (
                <div className="space-y-4">
                  <Clock className="h-12 w-12 text-purple-600 mx-auto animate-spin" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Uploading...</h3>
                    <p className="text-gray-600">Please wait while we process your resume</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {resumeVersions.length === 0 ? 'Upload Your Resume' : 'Upload New Version'}
                    </h3>
                    <p className="text-gray-600">
                      Drag and drop your resume here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Supports PDF, DOC, DOCX • Max size: 10MB • {3 - resumeVersions.length} slots remaining
                    </p>
                  </div>
                  <Button 
                    onClick={handleButtonClick}
                    className="cb-gradient-primary"
                    disabled={isUploading}
                    type="button"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resume Versions */}
      {resumeVersions.length > 0 && (
        <Card className="cb-glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Resume Versions ({resumeVersions.length}/3)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumeVersions.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{resume.fileName}</h3>
                      {resume.isActive && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Uploaded {formatDate(resume.uploadDate)}</span>
                      <span>{formatFileSize(resume.fileSize)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!resume.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetActive(resume.id)}
                    >
                      Set Active
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(resume.fileUrl, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = resume.fileUrl;
                      link.download = resume.fileName;
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this resume version?')) {
                        handleDeleteResume(resume.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No more slots message */}
      {!canUploadMore && (
        <Card className="cb-glass-card border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <h3 className="font-medium text-orange-900">Maximum Resume Versions Reached</h3>
                <p className="text-sm text-orange-700">
                  You have reached the maximum of 3 resume versions. Delete an existing version to upload a new one.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}