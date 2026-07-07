'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BankDetailsCard } from '@/components/payment/BankDetailsCard';
import { toast } from 'sonner';
import {
  GET_PUBLIC_ENROLLMENT,
  GET_ACTIVE_PAYMENT_SETTING,
  CREATE_PAYMENT_MUTATION,
  GENERATE_UPLOAD_SIGNATURE
} from '@/graphql';
import {
  CreditCard,
  Phone,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  Copy,
  Check,
  Search,
  BookOpen,
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react';
import Image from 'next/image';
import { getCurrencySymbol } from '@/constants/countries';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const enrollmentId = searchParams.get('enrollmentId');

  // Input states
  const [searchId, setSearchId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'EASYPAISA' | 'JAZZCASH'>('BANK_TRANSFER');
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotPublicId, setScreenshotPublicId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Queries
  const { data: enrollmentData, loading: loadingEnrollment, error: enrollmentError, refetch: refetchEnrollment } = useQuery<any>(
    GET_PUBLIC_ENROLLMENT,
    {
      variables: { id: enrollmentId || '' },
      skip: !enrollmentId,
      fetchPolicy: 'network-only'
    }
  );

  const { data: settingsData, loading: loadingSettings } = useQuery<any>(GET_ACTIVE_PAYMENT_SETTING);

  // Mutations
  const [generateUploadSignature] = useMutation<any, any>(GENERATE_UPLOAD_SIGNATURE);
  const [createPayment, { loading: submittingPayment }] = useMutation<any, any>(CREATE_PAYMENT_MUTATION);

  // Auto-prefill amount from the enrollment's applied (region-based) price
  useEffect(() => {
    if (enrollmentData?.publicEnrollment?.appliedPrice) {
      setAmount(enrollmentData.publicEnrollment.appliedPrice.toString());
    }
  }, [enrollmentData]);

  // Handle Lookup Redirect
  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) {
      toast.warning('Please enter a valid Enrollment ID.');
      return;
    }
    router.push(`/payment?enrollmentId=${searchId.trim()}`);
  };

  // Copy Clipboard Helper
  const handleCopyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Handle image upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', { description: 'Please select an image file (PNG, JPG, JPEG).' });
      return;
    }

    setUploading(true);

    try {
      // 1. Get Signature
      const signatureResponse = await generateUploadSignature({
        variables: {
          input: { folder: 'receipts' }
        }
      });

      const { timestamp, signature, apiKey, cloudName, folder } = signatureResponse.data.generateUploadSignature;

      // 2. Prepare FormData
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('api_key', apiKey);
      uploadData.append('timestamp', timestamp.toString());
      uploadData.append('signature', signature);
      uploadData.append('folder', folder);

      // 3. Direct Post to Cloudinary
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: uploadData
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

  // Submit Payment Record
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollmentId) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.warning('Please enter a valid amount.');
      return;
    }

    if (!screenshotUrl || !screenshotPublicId) {
      toast.warning('Please upload a screenshot of your payment receipt.');
      return;
    }

    try {
      await createPayment({
        variables: {
          createPaymentInput: {
            enrollmentId,
            amount: parsedAmount,
            paymentMethod,
            transactionId: transactionId.trim() || undefined,
            screenshotUrl,
            screenshotPublicId
          }
        }
      });

      toast.success('Payment submitted successfully', {
        description: 'Our administration team will verify it shortly.'
      });

      // Clear input fields & refetch enrollment details
      setAmount('');
      setTransactionId('');
      setScreenshotUrl('');
      setScreenshotPublicId('');
      refetchEnrollment();
    } catch (err: any) {
      console.error(err);
      toast.error('Submission failed', { description: err.message || 'Please try again.' });
    }
  };

  const enrollment = enrollmentData?.publicEnrollment;
  const paymentSetting = settingsData?.activePaymentSetting;

  return (
    <div className="min-h-screen bg-bg text-text pb-20">

      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[50vh] left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <main className="max-w-4xl mx-auto px-6 lg:px-10 mt-12 space-y-8 relative z-10">
        
        {/* Header Title */}
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <span className="text-[10px] font-bold tracking-widest text-gold uppercase bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
            Student Flow
          </span>
          <h1 className="text-3xl font-bold font-display tracking-tight text-text">
            Submit Payment Receipt
          </h1>
          <p className="text-xs text-text-secondary">
            Provide your enrollment details and upload your transfer screenshot to confirm your registration.
          </p>
        </div>

        {/* 1. LOOKUP MODE (No Enrollment ID provided) */}
        {!enrollmentId && (
          <div className="bg-surface border border-border p-6 sm:p-8 rounded-2xl shadow-xl max-w-md mx-auto space-y-6">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/20 text-gold flex items-center justify-center border border-primary/30">
                <Search size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-display text-text">Find Your Enrollment</h3>
                <p className="text-xs text-text-secondary">
                  Please enter the Enrollment ID you received on the registration success page.
                </p>
              </div>
            </div>

            <form onSubmit={handleLookup} className="space-y-4">
              <Input
                label="Enrollment ID"
                placeholder="e.g. cld7x2v1e00003b5x5t9x4u7a"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                required
                leftIcon={<FileText size={16} />}
              />
              <Button type="submit" variant="gold" className="w-full text-xs font-semibold py-2.5">
                Load Details <ArrowRight size={14} className="ml-2" />
              </Button>
            </form>
          </div>
        )}

        {/* 2. LOADING STATE */}
        {enrollmentId && loadingEnrollment && (
          <div className="bg-surface border border-border p-12 rounded-2xl shadow-xl text-center space-y-4 max-w-lg mx-auto">
            <Clock className="h-10 w-10 text-gold animate-spin mx-auto" />
            <p className="text-sm text-text-secondary animate-pulse font-medium">Fetching enrollment details...</p>
          </div>
        )}

        {/* 3. ERROR OR NOT FOUND */}
        {enrollmentId && !loadingEnrollment && (enrollmentError || !enrollment) && (
          <div className="bg-surface border border-border p-8 rounded-2xl shadow-xl text-center space-y-6 max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
              <AlertTriangle size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold font-display text-text">Enrollment Not Found</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                We couldn't find an enrollment with ID: <code className="text-red-400 font-mono select-all bg-red-500/5 px-1.5 py-0.5 rounded">{enrollmentId}</code>
              </p>
              <p className="text-xs text-text-secondary">
                Please make sure the ID is typed correctly, or look up another one.
              </p>
            </div>
            
            <form onSubmit={handleLookup} className="space-y-4 pt-4 border-t border-border/50 text-left">
              <Input
                label="Search Another Enrollment"
                placeholder="Enrollment ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                required
                leftIcon={<Search size={14} />}
              />
              <Button type="submit" variant="outline" className="w-full text-xs py-2.5">
                Look Up ID
              </Button>
            </form>
          </div>
        )}

        {/* 4. MAIN ENROLLMENT DETAILS & ACTIONS */}
        {enrollmentId && !loadingEnrollment && enrollment && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: Summary Card */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Enrollment Info */}
              <div className="bg-surface border border-border p-6 rounded-2xl shadow-md space-y-5">
                <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                  <BookOpen className="text-gold h-5 w-5" />
                  <h3 className="text-sm font-bold font-display text-text uppercase tracking-wider">
                    Enrollment Summary
                  </h3>
                </div>
                
                <div className="space-y-3.5 text-xs text-text-secondary">
                  <div>
                    <span className="block text-[10px] font-semibold text-text uppercase tracking-wider">Course</span>
                    <span className="text-text font-medium text-sm">{enrollment.course?.title}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-text uppercase tracking-wider">Student Name</span>
                    <span className="text-text font-medium">{enrollment.student?.firstName} {enrollment.student?.lastName}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-text uppercase tracking-wider">Email & Phone</span>
                    <span className="text-text block">{enrollment.student?.email}</span>
                    <span className="text-text">{enrollment.student?.phone}</span>
                  </div>
                  {enrollment.preferredHour != null && (
                    <div>
                      <span className="block text-[10px] font-semibold text-text uppercase tracking-wider">Preferred Class Timing</span>
                      <div className="flex items-center gap-1.5 mt-0.5 text-text">
                        <Clock size={13} className="text-gold" />
                        <span>
                          {enrollment.preferredHour.toString().padStart(2, '0')}:
                          {enrollment.preferredMinute.toString().padStart(2, '0')} {enrollment.preferredPeriod}
                        </span>
                      </div>
                    </div>
                  )}
                  {enrollment.preferredDays && (
                    <div>
                      <span className="block text-[10px] font-semibold text-text uppercase tracking-wider">Preferred Days</span>
                      <div className="flex items-center gap-1.5 mt-0.5 text-text">
                        <Calendar size={13} className="text-gold" />
                        <span>{enrollment.preferredDays}</span>
                      </div>
                    </div>
                  )}
                  {enrollment.packageTier && enrollment.packageTier !== 'NONE' && (
                    <div>
                      <span className="block text-[10px] font-semibold text-text uppercase tracking-wider">Package</span>
                      <span className="text-text font-medium">
                        {enrollment.packageTier}
                        {enrollment.enrollmentType === 'FREE_TRIAL' ? ' (Free Trial)' : ''}
                      </span>
                    </div>
                  )}
                  {enrollment.appliedPrice !== undefined && enrollment.appliedPrice !== null && (
                    <div>
                      <span className="block text-[10px] font-semibold text-text uppercase tracking-wider">Tuition Fee</span>
                      <span className="text-gold font-bold text-sm">
                        {enrollment.enrollmentType === 'FREE_TRIAL' ? 'Free Trial' : `${getCurrencySymbol(enrollment.appliedCurrency)} ${enrollment.appliedPrice}`}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-border/40">
                    <span className="block text-[10px] font-semibold text-text uppercase tracking-wider">Enrollment ID</span>
                    <div className="flex items-center gap-2 bg-bg/50 p-2 rounded border border-border mt-1">
                      <code className="text-gold font-mono text-[10px] select-all break-all">{enrollment.id}</code>
                      <button
                        onClick={() => handleCopyToClipboard(enrollment.id, 'enrollmentId')}
                        className="p-1 hover:text-gold transition-colors ml-auto cursor-pointer"
                      >
                        {copiedField === 'enrollmentId' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lookup search just in case */}
              <div className="bg-surface/50 border border-border/60 p-4 rounded-xl space-y-3">
                <span className="text-xs font-semibold text-text uppercase tracking-wider block">Not your enrollment?</span>
                <form onSubmit={handleLookup} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter different ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="flex-1 bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-text focus:outline-none focus:border-gold"
                    required
                  />
                  <Button type="submit" variant="outline" size="sm" className="text-xs shrink-0 px-3">
                    Load
                  </Button>
                </form>
              </div>
            </div>

            {/* Right Side: Payment Form or Status */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Payment Status checks */}
              {enrollment.payment && enrollment.payment.status === 'PAID' && (
                <div className="bg-surface border border-emerald-500/20 p-8 rounded-2xl shadow-md text-center space-y-5">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-pulse">
                    <CheckCircle size={36} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-display text-emerald-500">Payment Verified!</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Alhamdulillah, your payment has been verified by the institute administrators.
                    </p>
                    <p className="text-xs text-text-secondary leading-relaxed font-semibold text-text">
                      Status: PAID
                    </p>
                  </div>
                  <div className="bg-bg/40 border border-border/40 p-3 rounded-lg text-left text-xs space-y-1">
                    <p><span className="text-text font-medium">Verified Amount:</span> {getCurrencySymbol(enrollment.appliedCurrency)} {enrollment.payment.amount}</p>
                    <p><span className="text-text font-medium">Method:</span> {enrollment.payment.paymentMethod.replace('_', ' ')}</p>
                    {enrollment.payment.transactionId && (
                      <p><span className="text-text font-medium">Transaction ID:</span> {enrollment.payment.transactionId}</p>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary italic pt-2">
                    Your tutor will reach out to you via WhatsApp shortly to coordinate class details. Welcome to Anamta Institute!
                  </p>
                </div>
              )}

              {enrollment.payment && enrollment.payment.status === 'UNDER_REVIEW' && (
                <div className="bg-surface border border-yellow-500/20 p-8 rounded-2xl shadow-md text-center space-y-5">
                  <div className="h-16 w-16 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center mx-auto border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.15)] animate-pulse">
                    <Clock size={36} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-display text-yellow-500">Payment Under Review</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Your payment details and receipt have been successfully uploaded and are currently under review.
                    </p>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      This process usually takes a few hours. We will notify you via Email/WhatsApp once it is completed.
                    </p>
                  </div>
                  <div className="bg-bg/40 border border-border/40 p-3 rounded-lg text-left text-xs space-y-1">
                    <p><span className="text-text font-medium">Submitted Amount:</span> {getCurrencySymbol(enrollment.appliedCurrency)} {enrollment.payment.amount}</p>
                    <p><span className="text-text font-medium">Method:</span> {enrollment.payment.paymentMethod.replace('_', ' ')}</p>
                    {enrollment.payment.transactionId && (
                      <p><span className="text-text font-medium">Transaction ID:</span> {enrollment.payment.transactionId}</p>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary italic pt-2">
                    Need to correct something? Please contact support at anamtainstitute@gmail.com.
                  </p>
                </div>
              )}

              {/* Submission Form (Render if no payment exists OR if payment is REJECTED) */}
              {(!enrollment.payment || enrollment.payment.status === 'REJECTED') && (
                <div className="space-y-6">
                  
                  {/* Rejection Alert */}
                  {enrollment.payment && enrollment.payment.status === 'REJECTED' && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <div className="space-y-1 text-xs">
                        <h5 className="font-bold text-red-400">Previous Payment Rejected</h5>
                        <p className="text-text-secondary">
                          Your previous payment submission was rejected by the administrator.
                        </p>
                        {enrollment.payment.adminNote && (
                          <div className="bg-bg/40 p-2 rounded border border-red-500/10 mt-1.5 font-medium text-text">
                            Reason: {enrollment.payment.adminNote}
                          </div>
                        )}
                        <p className="text-text-secondary pt-1">
                          Please review the details below and upload the correct transfer receipt.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Transfer Details / Bank Accounts */}
                  <div className="bg-surface border border-border p-6 rounded-2xl shadow-md space-y-4">
                    <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                      <CreditCard className="text-gold h-5 w-5" />
                      <h3 className="text-sm font-bold font-display text-text uppercase tracking-wider">
                        Step 1: Transfer Payment
                      </h3>
                    </div>

                    <p className="text-text-secondary leading-relaxed text-xs">
                      Please transfer your tuition fee using any of the available payment methods below, then take a screenshot of the confirmation receipt:
                    </p>
                    <BankDetailsCard paymentSetting={paymentSetting} loading={loadingSettings} />
                  </div>

                  {/* Submission Form */}
                  <form onSubmit={handleSubmitPayment} className="bg-surface border border-border p-6 rounded-2xl shadow-md space-y-5">
                    <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                      <Upload className="text-gold h-5 w-5" />
                      <h3 className="text-sm font-bold font-display text-text uppercase tracking-wider">
                        Step 2: Submit Details
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Amount */}
                      <Input
                        label={`Transferred Amount (${getCurrencySymbol(enrollment.appliedCurrency)}) *`}
                        name="amount"
                        type="number"
                        step="0.01"
                        placeholder="e.g. 3500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        leftIcon={<DollarSign size={14} />}
                      />

                      {/* Payment Method Selection */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-secondary">
                          Payment Method Used *
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['BANK_TRANSFER', 'EASYPAISA', 'JAZZCASH'] as const).map((method) => {
                            const isSelected = paymentMethod === method;
                            return (
                              <button
                                key={method}
                                type="button"
                                onClick={() => setPaymentMethod(method)}
                                className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                                  isSelected
                                    ? 'bg-gold border-gold text-primary-dark shadow-sm'
                                    : 'bg-bg border-border text-text-secondary hover:border-gold/30'
                                }`}
                              >
                                {method.replace('_', ' ')}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Transaction ID */}
                      <Input
                        label="Transaction ID / Reference Number (Optional)"
                        name="transactionId"
                        placeholder="e.g. TXN9876543210"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                      />

                      {/* Screenshot Upload widget */}
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
                              <Image
                                src={screenshotUrl}
                                alt="Receipt Preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="block text-xs font-semibold text-text truncate">receipt_uploaded.jpg</span>
                              <span className="block text-[10px] text-emerald-500 font-semibold">Ready for submission</span>
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
                    </div>

                    <Button
                      type="submit"
                      variant="gold"
                      className="w-full py-3.5 mt-2 rounded-xl text-sm font-semibold tracking-wide shadow-md"
                      isLoading={submittingPayment}
                      disabled={uploading}
                    >
                      Submit Receipt & Confirm Enrollment
                    </Button>
                  </form>

                </div>
              )}

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg text-text">
        <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
          <Clock className="h-10 w-10 text-gold animate-spin" />
          <p className="text-text-secondary font-medium">Loading page...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
