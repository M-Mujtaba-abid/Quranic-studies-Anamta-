'use client';

import React from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  // publicId is included so callers that need it (e.g. Course.imageId) can persist it —
  // callers that don't (e.g. CoursePackage, which has no imageId field) can ignore it.
  onChange: (url: string, publicId: string) => void;
  folder: string;
  inputId: string;
}

export function ImageUploadField({ label, value, onChange, folder, inputId }: ImageUploadFieldProps) {
  const { upload, isUploading } = useCloudinaryUpload(folder);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { url, publicId } = await upload(file);
      onChange(url, publicId);
      toast.success('Image uploaded successfully');
    } catch (err: any) {
      toast.error('Image upload failed', { description: err.message || 'Check network connection' });
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-3 border border-border bg-surface-light/40 p-3 rounded-xl">
        <div className="relative h-14 w-20 bg-bg border border-border rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-text-secondary">
          {value ? (
            <Image src={value} alt={label} fill className="object-cover" sizes="80px" />
          ) : (
            <ImageIcon size={18} className="text-text-secondary/40" />
          )}
        </div>
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id={inputId}
            className="hidden"
            disabled={isUploading}
          />
          <label
            htmlFor={inputId}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-bg text-xs font-semibold text-text-secondary hover:text-gold hover:border-gold cursor-pointer transition-all ${
              isUploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {isUploading ? (
              <>
                <RefreshCw size={12} className="animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={12} />
                <span>Choose Image</span>
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}
