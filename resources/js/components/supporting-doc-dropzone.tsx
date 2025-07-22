import { Download, File as FileIcon, UploadCloud, X } from 'lucide-react';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';

interface SupportingDocDropzoneProps {
  file: File | null;
  existingFileUrl?: string;
  existingFileName?: string;
  onFileChange: (file: File | null) => void;
  maxSize?: number; // in bytes
}

export function SupportingDocDropzone({
  file,
  existingFileUrl,
  existingFileName,
  onFileChange,
  maxSize = 5 * 1024 * 1024,
}: SupportingDocDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0]);
      }
    },
    [onFileChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
    maxSize,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
  };

  // Show either uploaded file or existing file
  if (file || existingFileUrl) {
    return (
      <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <FileIcon className="text-primary h-8 w-8" />
          <div>
            <p className="text-sm font-medium">{file ? file.name : existingFileName || 'Document'}</p>
            {file && <p className="text-muted-foreground text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>}
          </div>
        </div>
        <div className="flex gap-2">
          {existingFileUrl && !file && (
            <Button variant="outline" size="icon" asChild className="h-8 w-8">
              <a href={existingFileUrl} download target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download file</span>
              </a>
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={removeFile} className="text-destructive hover:text-destructive h-8 w-8">
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-muted-foreground flex flex-col items-center gap-2">
        <UploadCloud className="h-8 w-8" />
        <p className="font-medium">{isDragActive ? 'Drop PDF here' : 'Upload PDF Document'}</p>
        <p className="text-xs">Maximum file size: 5MB</p>
      </div>
    </div>
  );
}
