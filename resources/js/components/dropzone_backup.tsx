import { cn } from '@/lib/utils';
import { ImageIcon, XCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';

const ImagePreview = ({ url, onRemove }: { url: string; onRemove: () => void }) => (
  <div className="relative aspect-square w-full">
    <button type="button" className="absolute top-0 right-0 z-10 translate-x-1/2 -translate-y-1/2" onClick={onRemove}>
      <XCircleIcon className="fill-primary text-primary-foreground h-5 w-5" />
    </button>
    {/* Mengganti next/image dengan tag <img> standar */}
    <img src={url} alt="Image preview" className="border-border h-full w-full rounded-md border object-cover" />
  </div>
);

type ImageDropzoneProps = {
  value: File | string | null;
  onChange: (file: File | null) => void;
  className?: string;
};

export default function ImageDropzone({ value, onChange, className }: ImageDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(null);

  // Membuat & membersihkan object URL untuk pratinjau file
  useEffect(() => {
    if (typeof value === 'string') {
      setPreview(value);
    } else if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);

      // Cleanup function untuk mencegah memory leak
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className={cn('w-full max-w-40', className)}>
      <div className="mt-1 w-full">
        {preview ? (
          <ImagePreview url={preview} onRemove={handleRemove} />
        ) : (
          <Dropzone
            onDrop={(acceptedFiles) => {
              const file = acceptedFiles[0];
              if (file) {
                onChange(file);
              }
            }}
            accept={{
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/png': ['.png'],
              'image/webp': ['.webp'],
            }}
            maxFiles={1}
          >
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div
                {...getRootProps()}
                className={cn(
                  'border-border focus:ring-ring flex aspect-square w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none',
                  { 'border-primary bg-secondary': isDragActive },
                )}
              >
                <input {...getInputProps()} />
                <ImageIcon className="text-muted-foreground h-12 w-12" strokeWidth={1} />
              </div>
            )}
          </Dropzone>
        )}
      </div>
    </div>
  );
}
