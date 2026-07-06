'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { toast } from 'sonner';
import { RefreshCw, CheckCircle, Copy, Check, Globe2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GET_ALL_COURSES, GET_COURSE_PRICES_FOR_REGION, ENROLL_STUDENT_MUTATION } from '@/graphql';
import { LocalEnrollmentForm } from './LocalEnrollmentForm';
import { InternationalEnrollmentForm } from './InternationalEnrollmentForm';
import { CourseSelectField } from './CourseSelectField';
import type { StudentInfoValues } from './enrollment.types';
import { LOCAL_REGION } from '@/constants/regions';
import { useCountrySelection } from '@/providers/CountryProvider';

interface EnrollmentPanelProps {
  // Course-specific flow passes the id it already knows and the dropdown never renders.
  // Direct enrollment flow omits it, so the student picks a course before anything else loads.
  presetCourseId?: string;
}

export function EnrollmentPanel({ presetCourseId }: EnrollmentPanelProps) {
  const isDirectFlow = !presetCourseId;

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const courseId = presetCourseId || selectedCourseId;

  const { data: coursesData, loading: loadingCourses } = useQuery<any>(GET_ALL_COURSES, {
    skip: !isDirectFlow,
  });
  const availableCourses = (coursesData?.courses ?? []).filter((c: any) => c.isActive);

  const { country: selectedCountry, openCountryModal } = useCountrySelection();

  const { data: pricingData, loading: loadingPricing } = useQuery<any>(GET_COURSE_PRICES_FOR_REGION, {
    variables: { courseId, country: selectedCountry?.name },
    skip: !selectedCountry || !courseId,
  });

  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [enrolledResult, setEnrolledResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const [enrollStudent, { loading: isEnrolling }] = useMutation<any, any>(ENROLL_STUDENT_MUTATION, {
    onCompleted: (res) => {
      setEnrolledResult(res?.enrollStudent ?? null);
      setEnrollmentSuccess(true);
      toast.success('Successfully registered for the course!');
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message || 'Failed to register. Please try again.');
    },
  });

  const handleCopyId = () => {
    if (enrolledResult?.id) {
      navigator.clipboard.writeText(enrolledResult.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLocalSubmit = async (values: StudentInfoValues) => {
    await enrollStudent({
      variables: {
        enrollStudentInput: {
          ...values,
          address: values.address || undefined,
          city: values.city || undefined,
          country: selectedCountry?.name,
          courseId,
        },
      },
    });
  };

  const handleInternationalSubmit = async (
    values: StudentInfoValues,
    packageTier: string,
    enrollmentType: 'REGULAR' | 'FREE_TRIAL',
  ) => {
    await enrollStudent({
      variables: {
        enrollStudentInput: {
          ...values,
          address: values.address || undefined,
          city: values.city || undefined,
          country: selectedCountry?.name,
          courseId,
          packageTier,
          enrollmentType,
        },
      },
    });
  };

  if (enrollmentSuccess) {
    const isFreeTrial = enrolledResult?.enrollmentType === 'FREE_TRIAL';
    return (
      <div className="relative z-10 space-y-6 rounded-2xl border border-border bg-surface p-8 text-left shadow-md animate-fade-in">
        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle size={36} />
        </div>
        <div className="space-y-2 text-center">
          <h3 className="font-display text-xl font-bold text-text">Enrollment Submitted!</h3>
          <p className="text-xs leading-relaxed text-text-secondary">
            {isFreeTrial
              ? 'Alhamdulillah, your free trial request has been received. Our team will reach out to schedule it.'
              : 'Alhamdulillah, your registration has been successfully received.'}
          </p>
        </div>

        <div className="space-y-3 rounded-xl border border-border/40 bg-bg/50 p-4 text-xs">
          <h4 className="font-semibold uppercase tracking-wider text-[10px] text-text">Enrollment Details</h4>
          <div className="space-y-1.5 text-text-secondary">
            {enrolledResult?.appliedPrice !== null && enrolledResult?.appliedPrice !== undefined && (
              <p>
                <span className="font-medium text-text">Amount:</span>{' '}
                {isFreeTrial ? 'Free Trial' : `${enrolledResult.appliedCurrency} ${enrolledResult.appliedPrice}`}
              </p>
            )}
            {enrolledResult?.id && (
              <div className="mt-2 border-t border-border/30 pt-2">
                <span className="font-medium text-text">Enrollment ID:</span>
                <div className="mt-1 flex items-center gap-2 rounded border border-border bg-surface/60 p-2">
                  <code className="select-all break-all font-mono text-[11px] text-gold">{enrolledResult.id}</code>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="ml-auto cursor-pointer p-1 transition-colors hover:text-gold"
                    title="Copy ID"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {enrolledResult?.id && !isFreeTrial && (
            <Link href={`/payment?enrollmentId=${enrolledResult.id}`} className="block w-full">
              <Button variant="gold" size="md" className="w-full py-2.5 text-sm font-semibold tracking-wide">
                Proceed to Payment
              </Button>
            </Link>
          )}
          <Link href="/courses" className="block w-full">
            <Button variant="outline" size="sm" className="w-full text-xs">
              Browse More Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const packages = pricingData?.coursePricesForRegion ?? [];
  const isLocal = packages[0]?.region === LOCAL_REGION;

  return (
    <div className="bg-surface border border-border p-6 md:p-8 rounded-2xl shadow-md space-y-6 relative z-10">
      <div className="space-y-1">
        <h3 className="text-lg font-bold font-display text-text">
          {isDirectFlow ? 'Enroll Now' : isLocal ? 'Register Now' : 'Book a free trial class'}
        </h3>
        <p className="text-xs text-text-secondary">
          {selectedCountry
            ? `Showing pricing for ${selectedCountry.name}.`
            : 'Select your country to see enrollment options and pricing.'}
        </p>
      </div>

      {isDirectFlow && (
        <CourseSelectField
          courses={availableCourses}
          value={selectedCourseId}
          onChange={setSelectedCourseId}
          loading={loadingCourses}
        />
      )}

      {isDirectFlow && !courseId ? (
        <p className="text-sm text-text-secondary py-6 text-center">
          Choose a course above to see enrollment options and pricing.
        </p>
      ) : !selectedCountry ? (
        <Button
          type="button"
          variant="gold"
          className="w-full py-3.5 rounded-xl text-sm shadow-md"
          leftIcon={<MapPin size={16} />}
          onClick={() => openCountryModal()}
        >
          Select Your Country to Enroll
        </Button>
      ) : loadingPricing ? (
        <div className="flex flex-col items-center justify-center gap-3 py-10">
          <RefreshCw className="h-6 w-6 text-gold animate-spin" />
          <p className="text-xs text-text-secondary">Loading pricing for {selectedCountry.name}...</p>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => openCountryModal()}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-gold transition-colors"
          >
            <Globe2 size={12} />
            <span>{selectedCountry.name} — change country</span>
          </button>

          {isLocal ? (
            <LocalEnrollmentForm isSubmitting={isEnrolling} onSubmit={handleLocalSubmit} />
          ) : packages.length === 0 ? (
            <p className="text-sm text-text-secondary py-6 text-center">
              Pricing isn&apos;t configured for this course yet. Please check back soon.
            </p>
          ) : (
            <InternationalEnrollmentForm
              packages={packages}
              phoneCountryCode={selectedCountry.code}
              isSubmitting={isEnrolling}
              onSubmit={handleInternationalSubmit}
            />
          )}
        </>
      )}
    </div>
  );
}
