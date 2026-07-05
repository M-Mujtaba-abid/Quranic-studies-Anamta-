import { useMutation } from '@apollo/client/react';
import { useState } from 'react';
import { GENERATE_UPLOAD_SIGNATURE } from '@/graphql';

interface UploadResult {
  url: string;
  publicId: string;
}

/**
 * Requests a signed Cloudinary upload from the backend, then posts the file
 * directly to Cloudinary. Used anywhere an admin/student uploads an image
 * (course thumbnails, package images, payment receipts).
 */
export function useCloudinaryUpload(folder: string) {
  const [generateUploadSignature] = useMutation<any, any>(GENERATE_UPLOAD_SIGNATURE);
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    try {
      const signatureResponse = await generateUploadSignature({
        variables: { input: { folder } },
      });

      const { timestamp, signature, apiKey, cloudName, folder: resolvedFolder } =
        signatureResponse.data.generateUploadSignature;

      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('api_key', apiKey);
      uploadData.append('timestamp', timestamp.toString());
      uploadData.append('signature', signature);
      uploadData.append('folder', resolvedFolder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: uploadData,
      });

      if (!res.ok) {
        throw new Error('Cloudinary upload request failed');
      }

      const result = await res.json();
      return { url: result.secure_url, publicId: result.public_id };
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading };
}
