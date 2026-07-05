'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { GET_COURSE_BY_ID } from '@/graphql';
import { Button } from '@/components/ui/Button';
import { EnrollmentPanel } from '@/components/enrollment/EnrollmentPanel';
import { useCountrySelection } from '@/providers/CountryProvider';
import { RefreshCw, ArrowLeft, ShieldCheck, Globe2 } from 'lucide-react';

export default function CourseDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  // Course details
  const { data, loading, error } = useQuery<any>(GET_COURSE_BY_ID, {
    variables: { id },
  });

  // Country selection (shared across pages) drives which region's pricing EnrollmentPanel fetches
  const { country: selectedCountry, openCountryModal } = useCountrySelection();

  // Prompt for a country the moment someone lands on a course page without one selected yet
  // (including after a page reload — the selection is in-memory only, not persisted).
  useEffect(() => {
    if (!selectedCountry) {
      openCountryModal();
    }
  }, [selectedCountry, openCountryModal]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-bg text-text">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-[70vh] flex flex-col items-center justify-center gap-4"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}>
            <RefreshCw className="h-10 w-10 text-gold" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="text-text-secondary font-medium"
          >
            Loading course info...
          </motion.p>
        </motion.div>
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
            <EnrollmentPanel presetCourseId={id} />
          </div>

        </div>

      </div>
    </div>
  );
}
