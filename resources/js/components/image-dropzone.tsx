import { UploadCloud, X } from 'lucide-react';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageDropzoneProps {
  value: string | File | null; // Can be URL string or File object
  onChange: (file: File | null) => void;
  maxSize?: number; // in bytes
}

export function ImageDropzone({ value, onChange, maxSize = 2 * 1024 * 1024 }: ImageDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onChange(acceptedFiles[0]);
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    multiple: false,
    maxSize: maxSize,
  });

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  // Preview can be either a File or URL string
  const previewUrl = value instanceof File ? URL.createObjectURL(value) : value;

  if (previewUrl) {
    return (
      <div className="relative h-40 w-40 overflow-hidden rounded-lg border">
        <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
        <button onClick={removeImage} className="bg-background/80 hover:bg-background absolute top-2 right-2 rounded-full p-1 transition-colors">
          <X className="text-destructive h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-muted-foreground flex flex-col items-center gap-2">
        <UploadCloud className="h-8 w-8" />
        <p className="text-center text-sm font-medium">{isDragActive ? 'Drop image here' : 'Drag image or click'}</p>
        <p className="text-xs">Max 2MB</p>
      </div>
    </div>
  );
}
