import { File as FileIcon, UploadCloud, X } from 'lucide-react';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function FileDropzone({ file, onFileChange }: FileDropzoneProps) {
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
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah terbukanya dialog file saat menghapus
    onFileChange(null);
  };

  if (file) {
    return (
      <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <FileIcon className="text-primary h-8 w-8" />
          <div>
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-muted-foreground text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
        <button onClick={removeFile} className="hover:bg-destructive/20 rounded-full p-1">
          <X className="text-destructive h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
    >
      <input {...getInputProps()} />
      <div className="text-muted-foreground flex flex-col items-center gap-2">
        <UploadCloud className="h-10 w-10" />
        <p className="font-semibold">{isDragActive ? 'Lepaskan file di sini' : 'Seret & lepas file PDF, atau klik untuk memilih'}</p>
        <p className="text-xs">Maksimal ukuran 5MB.</p>
      </div>
    </div>
  );
}
