'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { GET_COURSE_BY_ID } from '@/graphql';
import { Button } from '@/components/ui/Button';
import { EnrollmentPanel } from '@/components/enrollment/EnrollmentPanel';
// import { ExpandableDescription } from ''; // Path adjust kar lein
import { ExpandableDescription } from '../../courses/ExpandableDescription'
import { useCountrySelection } from '@/providers/CountryProvider';
import { LOCAL_COUNTRY, getCurrencySymbol } from '@/constants/countries';
import { LOCAL_REGION, pickDisplayPackage } from '@/constants/regions';
import { RefreshCw, ArrowLeft, ShieldCheck, Globe2, Clock, Calendar, Award, Compass, BookOpen, CheckCircle2, Users } from 'lucide-react';

export default function CourseDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, loading, error } = useQuery<any>(GET_COURSE_BY_ID, {
    variables: { id },
  });

  const { country: selectedCountry, setCountry, openCountryModal } = useCountrySelection();

  useEffect(() => {
    if (!selectedCountry && data?.course) {
      if (data.course.category === 'GROUP') {
        setCountry(LOCAL_COUNTRY);
      } else {
        openCountryModal('ONE_ON_ONE');
      }
    }
  }, [selectedCountry, openCountryModal, data, setCountry]);

  const formatDescription = (description: string) => {
    if (!description) return '';
    const hasHtml = /<[a-z][\s\S]*>/i.test(description);
    if (hasHtml) return description;
    return description.replace(/\n/g, '<br />');
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-bg text-text">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-[70vh] flex flex-col items-center justify-center gap-4"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}>
            <RefreshCw className="h-10 w-10 text-gold" />
          </motion.div>
          <motion.p className="text-text-secondary font-medium">Loading course info...</motion.p>
        </motion.div>
      </div>
    );
  }

  if (error || !data?.course) {
    return (
      <div className="min-h-screen bg-bg text-text">
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
    <div className="relative min-h-screen bg-bg text-text pb-24 overflow-hidden">
      {/* Decorative BG Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute top-[60vh] left-[-200px] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-6 relative z-10 space-y-8">

        {/* Back Link */}
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-all duration-300 hover:translate-x-[-4px]"
        >
          <ArrowLeft size={16} />
          <span className="font-semibold tracking-wide font-display text-xs uppercase">Back to Courses</span>
        </Link>

        {/* 1. TOP BANNER IMAGE */}
        <div className="relative w-full h-[280px] md:h-[420px] rounded-2xl overflow-hidden bg-surface border border-gold/15 shadow-xl">
          {course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center text-text-secondary bg-surface-light">
              <ShieldCheck size={64} className="text-gold/30" />
              <span className="font-display text-sm font-semibold tracking-wider text-gold/60">Anamta Syllabus</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />

          {/* Badge inside banner */}
          <div className="absolute bottom-6 left-6 bg-surface/70 backdrop-blur-md px-4 py-2 rounded-xl border border-gold/20 flex items-center gap-3">
            <Globe2 size={16} className="text-gold" />
            <span className="text-xs font-semibold text-text uppercase tracking-wider">
              {course.category === 'GROUP' ? 'Group Learning' : 'Live 1-on-1'}
            </span>
          </div>
        </div>

        {/* 2. COURSE TITLE SECTION */}
        <div className="pt-4 border-b border-border/40 pb-6 space-y-3">
          <div className="inline-flex items-center rounded-full border border-gold/20 bg-gold/5 px-3 py-1">
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase">
              {course.category === 'GROUP' ? 'Group Learning Course' : 'Personal 1-on-1 Course'}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-text leading-tight">
            <span className="bg-gradient-to-r from-text via-text-secondary to-gold-light bg-clip-text text-transparent">
              {course.title}
            </span>
          </h1>
          {(() => {
            if (course.category !== 'GROUP') return null;
            if (!selectedCountry) return null;

            const displayPackage = pickDisplayPackage(course.packages ?? [], selectedCountry.region);
            if (!displayPackage) return null;

            const prefix = selectedCountry.region === LOCAL_REGION ? '' : 'From ';
            return (
              <div className="text-xl md:text-2xl font-bold text-gold">
                {prefix}{getCurrencySymbol(displayPackage.currency)} {displayPackage.price}
              </div>
            );
          })()}
        </div>

        {/* 3. SPLIT SECTION: Left (Description) & Right (Syllabus) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT SIDE: Description & Specs */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-text uppercase tracking-wider text-gold/90">
                About this Course
              </h3>
              {/* Expandable description helper with auto scroll-back */}
              <ExpandableDescription
                description={course.description}
                formatFn={formatDescription}
              />
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/30">
              <div className="bg-surface/40 border border-border/40 p-4 rounded-xl backdrop-blur-sm flex flex-col gap-1">
                <Users size={18} className="text-gold" />
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mt-1">Age</span>
                <span className="text-sm font-medium text-text">Adults & Kids</span>
              </div>
              <div className="bg-surface/40 border border-border/40 p-4 rounded-xl backdrop-blur-sm flex flex-col gap-1">
                <Compass size={18} className="text-gold" />
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mt-1">Gender</span>
                <span className="text-sm font-medium text-text">Brothers & Sisters</span>
              </div>
              {course.category === 'GROUP' ? (
                <div className="bg-surface/40 border border-border/40 p-4 rounded-xl backdrop-blur-sm flex flex-col gap-1">
                  <Clock size={18} className="text-gold" />
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mt-1">Support</span>
                  <span className="text-sm font-medium text-text">24/7 Support</span>
                </div>
              ) : (
                <div className="bg-surface/40 border border-border/40 p-4 rounded-xl backdrop-blur-sm flex flex-col gap-1">
                  <Calendar size={18} className="text-gold" />
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mt-1">Schedule</span>
                  <span className="text-sm font-medium text-text">Flexible Days</span>
                </div>
              )}
              <div className="bg-surface/40 border border-border/40 p-4 rounded-xl backdrop-blur-sm flex flex-col gap-1">
                <Award size={18} className="text-gold" />
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mt-1">Certificate</span>
                <span className="text-sm font-medium text-text">Ijazah / Cert.</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Course Syllabus & Curriculum */}
          <div className="lg:col-span-5">
            {course?.features && course.features.length > 0 && (
              <div className="bg-surface/30 border border-border p-6 rounded-2xl shadow-sm space-y-4 backdrop-blur-sm hover:border-gold/15 transition-all">
                <h3 className="text-lg font-bold font-display text-text border-b border-border/40 pb-3 flex items-center gap-2">
                  <BookOpen className="text-gold" size={18} />
                  Syllabus & Curriculum
                </h3>

                <div className="space-y-3 max-h-auto overflow-y-auto pr-1 custom-scrollbar">
                  {course.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-surface-light/30 rounded-xl border border-border/20">
                      <CheckCircle2 className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                      <span className="text-text font-medium text-xs md:text-sm leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. BOTTOM: ENROLLMENT FORM */}
        <div className="pt-12 border-t border-border/40 relative max-w-3xl mx-auto w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-primary/5 rounded-2xl blur-2xl opacity-40 pointer-events-none" />
          <div className="relative z-10 text-center space-y-2 mb-6">
            <h2 className="text-2xl font-bold font-display text-text">Ready to Start Learning?</h2>
            <p className="text-sm text-text-secondary">Fill out the quick enrollment details below to secure your spot.</p>
          </div>
          <div className="relative z-10 bg-surface/20 rounded-2xl shadow-xl border border-border/50">
            <EnrollmentPanel presetCourseId={id} />
          </div>
        </div>

      </div>
    </div>
  );
}