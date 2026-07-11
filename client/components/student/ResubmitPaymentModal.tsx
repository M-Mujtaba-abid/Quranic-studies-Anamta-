'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { X, Upload, Clock, FileText } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showErrorToast } from '@/lib/toast-error';
import { RESUBMIT_PAYMENT_MUTATION, GENERATE_UPLOAD_SIGNATURE } from '@/graphql';

interface ResubmitPaymentModalProps {
  isOpen: boolean;
  enrollmentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

// Reuses the same Cloudinary direct-upload flow as the original /payment page's screenshot
// widget, but submits via resubmitPayment instead of createPayment.
export function ResubmitPaymentModal({ isOpen, enrollmentId, onClose, onSuccess }: ResubmitPaymentModalProps) {
  const [transactionId, setTransactionId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotPublicId, setScreenshotPublicId] = useState('');
  const [uploading, setUploading] = useState(false);

  const [generateUploadSignature] = useMutation<any, any>(GENERATE_UPLOAD_SIGNATURE);
  const [resubmitPayment, { loading: submitting }] = useMutation<any, any>(RESUBMIT_PAYMENT_MUTATION, {
    onCompleted: () => {
      toast.success('Payment resubmitted', {
        description: 'Our administration team will review it shortly.',
      });
      handleClose();
      onSuccess();
    },
    onError: (err) => {
      showErrorToast('Failed to resubmit payment', err);
    },
  });

  const resetState = () => {
    setTransactionId('');
    setScreenshotUrl('');
    setScreenshotPublicId('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', { description: 'Please select an image file (PNG, JPG, JPEG).' });
      return;
    }

    setUploading(true);

    try {
      const signatureResponse = await generateUploadSignature({
        variables: { input: { folder: 'receipts' } },
      });

      const { timestamp, signature, apiKey, cloudName, folder } = signatureResponse.data.generateUploadSignature;

      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('api_key', apiKey);
      uploadData.append('timestamp', timestamp.toString());
      uploadData.append('signature', signature);
      uploadData.append('folder', folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: uploadData,
      });

      if (!res.ok) {
        throw new Error('Cloudinary upload request failed');
      }

      const result = await res.json();
      setScreenshotUrl(result.secure_url);
      setScreenshotPublicId(result.public_id);
      toast.success('Receipt screenshot uploaded successfully');
    } catch (err: any) {
      console.error(err);
      toast.error('Image upload failed', { description: err.message || 'Check your connection.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!screenshotUrl || !screenshotPublicId) {
      toast.warning('Please upload a screenshot of your payment receipt.');
      return;
    }

    await resubmitPayment({
      variables: {
        input: {
          enrollmentId,
          screenshotUrl,
          screenshotPublicId,
          transactionId: transactionId.trim() || undefined,
        },
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-surface z-10">
          <h3 className="font-display font-bold text-base text-text">Resubmit Payment</h3>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded text-text-secondary hover:text-text transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-text-secondary leading-relaxed">
            Upload a new receipt screenshot (and transaction ID, if you have one) to send this
            payment back for review.
          </p>

          <Input
            label="Transaction ID / Reference Number (Optional)"
            placeholder="e.g. TXN9876543210"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            leftIcon={<FileText size={14} />}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Upload Receipt Screenshot *
            </label>

            {!screenshotUrl ? (
              <div className="relative border border-dashed border-border/80 bg-bg/50 rounded-xl p-6 text-center hover:border-gold/40 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <div className="flex flex-col items-center justify-center space-y-2 text-xs">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-gold flex items-center justify-center">
                    {uploading ? <Clock size={18} className="animate-spin" /> : <Upload size={18} />}
                  </div>
                  {uploading ? (
                    <p className="font-semibold text-gold">Uploading screenshot...</p>
                  ) : (
                    <>
                      <p className="font-semibold text-text">Click to upload or drag & drop</p>
                      <p className="text-text-secondary text-[10px]">PNG, JPG, or JPEG (Max 5MB)</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-border bg-bg/50 p-3 flex items-center gap-3">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-border/40 shrink-0 bg-surface">
                  <Image src={screenshotUrl} alt="Receipt Preview" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-semibold text-text truncate">receipt_uploaded.jpg</span>
                  <span className="block text-[10px] text-emerald-500 font-semibold">Ready for resubmission</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setScreenshotUrl('');
                    setScreenshotPublicId('');
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 text-[10px] font-semibold transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="gold"
            className="w-full py-3 rounded-xl text-sm font-semibold"
            isLoading={submitting}
            disabled={uploading}
          >
            Resubmit for Review
          </Button>
        </form>
      </div>
    </div>
  );
}
