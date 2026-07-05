'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import { GET_COURSE_BY_ID, GET_COURSE_PRICES_FOR_REGION, ENROLL_STUDENT_MUTATION } from '@/graphql';
import { Button } from '@/components/ui/Button';
import { LocalEnrollmentForm } from '@/components/enrollment/LocalEnrollmentForm';
import { InternationalEnrollmentForm } from '@/components/enrollment/InternationalEnrollmentForm';
import type { StudentInfoValues } from '@/components/enrollment/enrollment.types';
import { LOCAL_REGION } from '@/constants/regions';
import { useCountrySelection } from '@/providers/CountryProvider';
import {
  RefreshCw,
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  Copy,
  Check,
  Globe2,
  MapPin,
} from 'lucide-react';

export default function CourseDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  // Course details
  const { data, loading, error } = useQuery<any>(GET_COURSE_BY_ID, {
    variables: { id },
  });

  // Country selection (shared across pages) drives which region's pricing we fetch
  const { country: selectedCountry, openCountryModal } = useCountrySelection();

  const { data: pricingData, loading: loadingPricing } = useQuery<any>(GET_COURSE_PRICES_FOR_REGION, {
    variables: { courseId: id, country: selectedCountry?.name },
    skip: !selectedCountry,
  });

  // Prompt for a country the moment someone lands on a course page without one selected yet
  // (including after a page reload — the selection is in-memory only, not persisted).
  useEffect(() => {
    if (!selectedCountry) {
      openCountryModal();
    }
  }, [selectedCountry, openCountryModal]);

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
          courseId: id,
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
          courseId: id,
          packageTier,
          enrollmentType,
        },
      },
    });
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-bg text-text">
        <Navbar />
        <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
          <RefreshCw className="h-10 w-10 text-gold animate-spin" />
          <p className="text-text-secondary font-medium animate-pulse">Loading course info...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.course) {
    return (
      <div className="min-h-screen bg-bg text-text">
        <Navbar />
        <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
          <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold font-display">Course not found</h3>
          <p className="text-text-secondary max-w-md">{error?.message || "The course you are looking for doesn't exist."}</p>
          <Link href="/courses">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />}>
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const course = data.course;
  const packages = pricingData?.coursePricesForRegion ?? [];
  const isLocal = packages[0]?.region === LOCAL_REGION;
  const isFreeTrial = enrolledResult?.enrollmentType === 'FREE_TRIAL';

  return (
    <div className="min-h-screen bg-bg text-text pb-20 relative overflow-x-hidden">
      <Navbar />

      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[50vh] left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-8 space-y-8">

        {/* Back Link */}
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Courses</span>
        </Link>

        {/* Course Banner Card */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-md p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
              Active Syllabus
            </span>
            <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-text leading-tight">
              {course.title}
            </h1>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed">
              {course.description}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-text-secondary pt-2">
              <Globe2 size={16} className="text-gold" />
              <span className="font-semibold text-text">Regional pricing available for Pakistan &amp; international students</span>
            </div>
          </div>
          <div className="relative h-56 w-full lg:w-96 rounded-xl overflow-hidden bg-surface-light border border-border">
            {course.imageUrl ? (
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 384px"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-text-secondary">
                <ShieldCheck size={48} className="text-gold/50" />
              </div>
            )}
          </div>
        </div>

        {/* Content & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Syllabus / Left Column */}
          <div className="lg:col-span-7 bg-surface border border-border p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-xl font-bold font-display text-text border-b border-border pb-3">
              What You Will Learn
            </h3>

            <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
              <p>
                Our 1-on-1 online classes are tailored specifically to your learning speed and initial levels. Our verified, experienced tutors provide structured guidance to help you master the material.
              </p>

              <h4 className="font-bold text-text mt-6">Course Outline & Syllabus</h4>
              <ul className="list-disc list-inside space-y-2.5 pl-2">
                <li>Complete foundational rules and phonetics guidance.</li>
                <li>Proper articulation points (Makharij) and phonology.</li>
                <li>Rules of Tajweed (Nunnation, Elongation, Stop signs).</li>
                <li>Interactive 1-on-1 practice sessions with continuous assessments.</li>
                <li>Memorization (Hifz) tracking or Translation (Tafsir) details (if applicable).</li>
              </ul>

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 mt-6 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="font-semibold text-text text-xs">Certified Teachers</h5>
                  <p className="text-xs text-text-secondary">All our teachers are thoroughly tested, certified, and hold references (Ijazah) to teach Quran studies online.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment / Right Column */}
          <div className="lg:col-span-5 relative">
            {enrollmentSuccess ? (
              <div className="bg-surface border border-border p-8 rounded-2xl shadow-md space-y-6 animate-fade-in relative z-10 text-left">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle size={36} />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold font-display text-text">Enrollment Submitted!</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {isFreeTrial
                      ? 'Alhamdulillah, your free trial request has been received. Our team will reach out to schedule it.'
                      : 'Alhamdulillah, your registration has been successfully received.'}
                  </p>
                </div>

                <div className="bg-bg/50 border border-border/40 p-4 rounded-xl space-y-3 text-xs">
                  <h4 className="font-semibold text-text uppercase tracking-wider text-[10px]">Enrollment Details</h4>
                  <div className="space-y-1.5 text-text-secondary">
                    {enrolledResult?.appliedPrice !== null && enrolledResult?.appliedPrice !== undefined && (
                      <p>
                        <span className="text-text font-medium">Amount:</span>{' '}
                        {isFreeTrial ? 'Free Trial' : `${enrolledResult.appliedCurrency} ${enrolledResult.appliedPrice}`}
                      </p>
                    )}
                    {enrolledResult?.id && (
                      <div className="pt-2 flex flex-col gap-1 border-t border-border/30 mt-2">
                        <span className="text-text font-medium">Enrollment ID:</span>
                        <div className="flex items-center gap-2 bg-surface/60 p-2 rounded border border-border mt-1">
                          <code className="text-gold font-mono text-[11px] select-all break-all">{enrolledResult.id}</code>
                          <button
                            type="button"
                            onClick={handleCopyId}
                            className="p-1 hover:text-gold transition-colors ml-auto cursor-pointer"
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
                    <Link href={`/payment?enrollmentId=${enrolledResult.id}`} className="w-full block">
                      <Button variant="gold" size="md" className="w-full text-sm font-semibold tracking-wide py-2.5">
                        Proceed to Payment
                      </Button>
                    </Link>
                  )}
                  <Link href="/courses" className="w-full block">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Browse More Courses
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-surface border border-border p-6 md:p-8 rounded-2xl shadow-md space-y-6 relative z-10">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-display text-text">Register for this Course</h3>
                  <p className="text-xs text-text-secondary">
                    {selectedCountry
                      ? `Showing pricing for ${selectedCountry.name}.`
                      : 'Select your country to see enrollment options and pricing.'}
                  </p>
                </div>

                {!selectedCountry ? (
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
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
