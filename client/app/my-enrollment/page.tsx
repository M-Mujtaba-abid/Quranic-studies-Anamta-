'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useLazyQuery } from '@apollo/client/react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ResubmitPaymentModal } from '@/components/student/ResubmitPaymentModal';
import { GET_ENROLLMENT_PROFILE, GET_ENROLLMENT_PROFILE_BY_EMAIL } from '@/graphql';
import { getCurrencySymbol } from '@/constants/countries';
import { addMyEnrollmentId } from '@/lib/my-enrollment-ids';
import {
  Search,
  FileText,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  BookOpen,
  User,
  X,
  Copy,
  Check,
} from 'lucide-react';

// Payment status drives the primary badge shown per enrollment — it's the thing a
// returning student actually cares about tracking.
function PaymentStatusBadge({ status }: { status?: string }) {
  if (!status) {
    return (
      <span className="flex items-center gap-1 bg-surface-light text-text-secondary border border-border px-2.5 py-1 rounded-full text-xs font-semibold">
        <AlertTriangle size={12} />
        Payment Not Submitted
      </span>
    );
  }

  if (status === 'PAID') {
    return (
      <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
        <CheckCircle size={12} />
        Paid
      </span>
    );
  }

  if (status === 'REJECTED') {
    return (
      <span className="flex items-center gap-1 bg-red-500/10 text-red-500 border border-red-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
        <XCircle size={12} />
        Rejected
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
      <Clock size={12} />
      Under Review
    </span>
  );
}

function MyEnrollmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const enrollmentId = searchParams.get('enrollmentId');

  const [searchId, setSearchId] = useState('');
  const [resubmitEnrollmentId, setResubmitEnrollmentId] = useState<string | null>(null);
  // Collapsed by default once a profile has loaded — the common case is the correct
  // profile showing up automatically, so the lookup box shouldn't compete for attention.
  const [showLookupBox, setShowLookupBox] = useState(false);
  const [lookupMode, setLookupMode] = useState<'id' | 'email'>('id');
  const [searchEmail, setSearchEmail] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success('Enrollment ID copied successfully!');
    setTimeout(() => {
      setCopiedId(null);
    }, 1000);
  };

  const { data, loading, error, refetch } = useQuery<any>(GET_ENROLLMENT_PROFILE, {
    variables: { enrollmentId: enrollmentId || '' },
    skip: !enrollmentId,
    fetchPolicy: 'network-only',
    // So `loading` also reflects the manual refetch() triggered from handleLookup below.
    notifyOnNetworkStatusChange: true,
  });

  const [lookupByEmail, { loading: emailLoading }] = useLazyQuery<any>(GET_ENROLLMENT_PROFILE_BY_EMAIL, {
    fetchPolicy: 'network-only',
  });

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = searchId.trim();
    if (!trimmedId) {
      toast.warning('Please enter a valid Enrollment ID.');
      return;
    }

    router.push(`/my-enrollment?enrollmentId=${trimmedId}`);

    // The first-ever lookup is driven by the `skip: !enrollmentId` flag flipping false once
    // the URL updates above. Once a profile is already loaded, though, the query is already
    // mounted and unskipped, so switching IDs needs an explicit refetch — Apollo otherwise
    // keeps showing the previous profile across a passive variables change.
    if (enrollmentId) {
      try {
        const result = await refetch({ enrollmentId: trimmedId });
        if (!result.data?.enrollmentProfile) {
          toast.error('Enrollment not found', {
            description: 'Please check the ID and try again.',
          });
        }
      } catch (err: any) {
        toast.error('Enrollment not found', {
          description: err.message || 'Please check the ID and try again.',
        });
      }
    }
  };

  const handleEmailLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = searchEmail.trim();
    if (!trimmedEmail) {
      toast.warning('Please enter the email you enrolled with.');
      return;
    }

    try {
      const result = await lookupByEmail({ variables: { email: trimmedEmail } });
      const foundEnrollments = result.data?.enrollmentProfileByEmail?.enrollments ?? [];
      if (foundEnrollments.length === 0) {
        toast.error('Enrollment not found', {
          description: 'No enrollment is linked to that email. Please check it and try again.',
        });
        return;
      }

      // Add every enrollment (not just the one seeding the URL) so the navbar reflects all of them.
      foundEnrollments.forEach((enrollment: any) => addMyEnrollmentId(enrollment.id));
      router.push(`/my-enrollment?enrollmentId=${foundEnrollments[0].id}`);
    } catch (err: any) {
      toast.error('Enrollment not found', {
        description: err.message || 'No enrollment is linked to that email. Please check it and try again.',
      });
    }
  };

  // Guard against stale data belonging to a different enrollmentId being rendered as if it
  // were current (Apollo can hold onto the previous result across a variables change).
  const rawProfile = data?.enrollmentProfile;
  const profile = rawProfile && enrollmentId ? rawProfile : null;
  const student = profile?.student;
  const enrollments = profile?.enrollments ?? [];

  return (
    <div className="min-h-screen bg-bg text-text pb-20">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[50vh] left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <main className="max-w-4xl mx-auto px-6 lg:px-10 mt-12 space-y-8 relative z-10">
        {/* Header Title */}
        <div className="text-center max-w-lg mx-auto">
          <span className="inline-block mb-5 text-[20px] font-bold tracking-widest text-gold uppercase bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
            My Enrollment
          </span>
          <h1 className="text-3xl font-bold font-display tracking-tight text-text">
            Track Your Enrollment &amp; Payment Status
          </h1>
          <p className="text-xs text-text-secondary mt-2">
            Paste the Enrollment ID from your confirmation email to view your profile — no login required.
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
                <h3 className="text-lg font-bold font-display text-text">
                  {lookupMode === 'id' ? 'Enter your Enrollment ID' : 'Look up by email'}
                </h3>
                <p className="text-xs text-text-secondary">
                  {lookupMode === 'id'
                    ? "You'll find this ID on your registration success page or in your confirmation email."
                    : "Enter the email you enrolled with — we'll find every enrollment linked to it."}
                </p>
              </div>
            </div>

            <div className="flex gap-1 bg-surface-light border border-border rounded-lg p-1">
              <button
                type="button"
                onClick={() => setLookupMode('id')}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-colors cursor-pointer ${lookupMode === 'id' ? 'bg-gold text-primary-dark' : 'text-text-secondary hover:text-text'
                  }`}
              >
                By Enrollment ID
              </button>
              <button
                type="button"
                onClick={() => setLookupMode('email')}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-colors cursor-pointer ${lookupMode === 'email' ? 'bg-gold text-primary-dark' : 'text-text-secondary hover:text-text'
                  }`}
              >
                By Email
              </button>
            </div>

            {lookupMode === 'id' ? (
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
                  View Details <ArrowRight size={14} className="ml-2" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleEmailLookup} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="e.g. student@example.com"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  required
                  leftIcon={<Mail size={16} />}
                />
                <Button type="submit" variant="gold" className="w-full text-xs font-semibold py-2.5" disabled={emailLoading}>
                  {emailLoading ? 'Searching...' : <>Find My Enrollment <ArrowRight size={14} className="ml-2" /></>}
                </Button>
              </form>
            )}
          </div>
        )}

        {/* 2. LOADING STATE */}
        {enrollmentId && loading && (
          <div className="bg-surface border border-border p-12 rounded-2xl shadow-xl text-center space-y-4 max-w-lg mx-auto">
            <Clock className="h-10 w-10 text-gold animate-spin mx-auto" />
            <p className="text-sm text-text-secondary animate-pulse font-medium">Fetching your profile...</p>
          </div>
        )}

        {/* 3. ERROR OR NOT FOUND */}
        {enrollmentId && !loading && (error || !profile) && (
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

        {/* 4. PROFILE */}
        {enrollmentId && !loading && profile && (
          <div className="space-y-6">
            {/* Profile summary */}
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-gold to-gold-light text-primary-dark font-bold font-display flex items-center justify-center shadow-md shrink-0">
                  {student?.firstName ? student.firstName[0].toUpperCase() : <User size={20} />}
                </div>
                <div>
                  <h2 className="text-lg font-bold font-display text-text">
                    {student?.firstName} {student?.lastName}
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-xs text-text-secondary">
                    <span className="flex items-center gap-1.5">
                      <Mail size={12} className="text-gold" />
                      {student?.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone size={12} className="text-gold" />
                      {student?.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lookup search just in case — collapsed to a subtle link by default, since
                the common case is the correct profile already showing up automatically. */}
            {showLookupBox ? (
              <div className="bg-surface/50 border border-border/60 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text uppercase tracking-wider block">Not your enrollment?</span>
                  <button
                    type="button"
                    onClick={() => setShowLookupBox(false)}
                    aria-label="Close"
                    className="text-text-secondary hover:text-text transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
                <form onSubmit={handleLookup} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter different ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="flex-1 bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-text focus:outline-none focus:border-gold"
                    required
                    autoFocus
                  />
                  <Button type="submit" variant="outline" size="sm" className="text-xs shrink-0 px-3">
                    Load
                  </Button>
                </form>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowLookupBox(true)}
                className="text-xs text-text-secondary hover:text-gold transition-colors cursor-pointer underline underline-offset-2 decoration-dotted"
              >
                Checking a different enrollment? Click here
              </button>
            )}

            {/* Enrollments */}
            <div className="space-y-4">
              <div className='flex'>
                <h3 className="text-sm font-bold font-display text-text uppercase tracking-wider">
                  My Enrollments
                </h3>

              </div>
              {enrollments.length === 0 ? (
                <div className="bg-surface border border-border rounded-2xl p-12 text-center">
                  <BookOpen size={40} className="mx-auto text-text-secondary/35 mb-3" />
                  <p className="text-sm font-semibold text-text-secondary">No enrollments found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enrollment: any) => (
                    <div
                      key={enrollment.id}
                      className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <h4 className="font-bold text-text text-sm">{enrollment.course?.title}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-text-secondary">
                            <Link href={`/payment?enrollmentId=${enrollment.id}`} className='py-2 px-4 rounded-lg bg-gold text-white text-xs'>Monthly Fee</Link>
                            <span>{enrollment.course?.category === 'GROUP' ? 'Group Class' : '1-on-1 Class'}</span>
                            {enrollment.packageTier && enrollment.packageTier !== 'NONE' && (
                              <>
                                <span>&middot;</span>
                                <span>{enrollment.packageTier}</span>
                              </>
                            )}

                            {enrollment.appliedPrice !== null && enrollment.appliedPrice !== undefined && (
                              <>
                                <span>&middot;</span>
                                <span className="font-semibold text-gold">
                                  {enrollment.enrollmentType === 'FREE_TRIAL'
                                    ? 'Free Trial'
                                    : `${getCurrencySymbol(enrollment.appliedCurrency)} ${enrollment.appliedPrice}`}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <PaymentStatusBadge status={enrollment.payment?.status} />
                        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                          <span>ID: {enrollment.id}</span>
                          <button
                            onClick={() => handleCopy(enrollment.id)}
                            className="p-1 hover:text-gold transition-colors cursor-pointer"
                            title="Copy Enrollment ID"
                          >
                            {copiedId === enrollment.id ? (
                              <Check size={12} className="text-emerald-500" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </div>

                      {enrollment.payment?.status === 'REJECTED' && (
                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl space-y-2">
                          {enrollment.payment.adminNote && (
                            <p className="text-xs text-text-secondary">
                              <span className="font-semibold text-red-400">Reason: </span>
                              {enrollment.payment.adminNote}
                            </p>
                          )}
                          <Button
                            variant="gold"
                            size="sm"
                            className="text-xs"
                            onClick={() => setResubmitEnrollmentId(enrollment.id)}
                          >
                            Resubmit Payment
                          </Button>
                        </div>
                      )}

                      {!enrollment.payment && enrollment.enrollmentType !== 'FREE_TRIAL' && (
                        <Link href={`/payment?enrollmentId=${enrollment.id}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            Submit Payment
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {resubmitEnrollmentId && (
        <ResubmitPaymentModal
          isOpen
          enrollmentId={resubmitEnrollmentId}
          onClose={() => setResubmitEnrollmentId(null)}
          onSuccess={() => {
            setResubmitEnrollmentId(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

export default function MyEnrollmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg text-text">
        <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
          <Clock className="h-10 w-10 text-gold animate-spin" />
          <p className="text-text-secondary font-medium">Loading page...</p>
        </div>
      </div>
    }>
      <MyEnrollmentContent />
    </Suspense>
  );
}
