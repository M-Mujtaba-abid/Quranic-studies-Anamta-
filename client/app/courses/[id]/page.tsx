'use client';
// Trigger compile
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { GET_COURSE_BY_ID } from '@/graphql';
import { Button } from '@/components/ui/Button';
import { EnrollmentPanel } from '@/components/enrollment/EnrollmentPanel';
import { useCountrySelection } from '@/providers/CountryProvider';
import { LOCAL_COUNTRY } from '@/constants/countries';
import { RefreshCw, ArrowLeft, ShieldCheck, Globe2, Clock, Calendar, Award, Compass, BookOpen, CheckCircle2, Star, Users } from 'lucide-react';

export default function CourseDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  // Course details
  const { data, loading, error } = useQuery<any>(GET_COURSE_BY_ID, {
    variables: { id },
  });

  // Country selection (shared across pages) drives which region's pricing EnrollmentPanel fetches
  const { country: selectedCountry, setCountry, openCountryModal } = useCountrySelection();

  // Prompt for a country the moment someone lands on a course page without one selected yet
  // (including after a page reload — the selection is in-memory only, not persisted).
  useEffect(() => {
    if (!selectedCountry && data?.course) {
      if (data.course.category === 'GROUP') {
        setCountry(LOCAL_COUNTRY);
      } else {
        openCountryModal('ONE_ON_ONE');
      }
    }
  }, [selectedCountry, openCountryModal, data, setCountry]);

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
      {/* Background patterns and decorative glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Image
          src="/images/about/contact_bg.png"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-bg/80 to-bg" />
      </div>

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40vh] left-[-200px] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-8 relative z-10 space-y-12">
        {/* Breadcrumb Back Link */}
        <Link 
          href="/courses" 
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-all duration-300 hover:translate-x-[-4px]"
        >
          <ArrowLeft size={16} />
          <span className="font-semibold tracking-wide font-display text-xs uppercase">Back to Courses</span>
        </Link>

        {/* Hero Area: Big Banner & Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Title & Info */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 backdrop-blur-sm">
                <span className="text-[10px] font-bold tracking-widest text-gold uppercase">
                  {course.category === 'GROUP' ? 'Group Learning Course' : 'Personal 1-on-1 Course'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-text leading-[1.1] pb-1">
                <span className="bg-gradient-to-r from-text via-text-secondary to-gold-light bg-clip-text text-transparent">
                  {course.title}
                </span>
              </h1>
              
              <p className="text-text-secondary text-base md:text-lg leading-relaxed font-light">
                {course.description}
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gold/10">
              <div className="bg-surface/50 border border-border/40 p-4 rounded-xl backdrop-blur-sm flex flex-col gap-1 hover:border-gold/20 transition-colors">
                <Users size={18} className="text-gold" />
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mt-1">Age</span>
                <span className="text-sm font-medium text-text">Adults & Kids</span>
              </div>
              <div className="bg-surface/50 border border-border/40 p-4 rounded-xl backdrop-blur-sm flex flex-col gap-1 hover:border-gold/20 transition-colors">
                <Compass size={18} className="text-gold" />
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mt-1">Gender</span>
                <span className="text-sm font-medium text-text">Brothers & Sisters</span>
              </div>
              {course.category === 'GROUP' ? (
                <div className="bg-surface/50 border border-border/40 p-4 rounded-xl backdrop-blur-sm flex flex-col gap-1 hover:border-gold/20 transition-colors">
                  <Clock size={18} className="text-gold" />
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mt-1">Support</span>
                  <span className="text-sm font-medium text-text">24/7</span>
                </div>
              ) : (
                <div className="bg-surface/50 border border-border/40 p-4 rounded-xl backdrop-blur-sm flex flex-col gap-1 hover:border-gold/20 transition-colors">
                  <Calendar size={18} className="text-gold" />
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mt-1">Schedule</span>
                  <span className="text-sm font-medium text-text">Flexible Days & Timings</span>
                </div>
              )}
              <div className="bg-surface/50 border border-border/40 p-4 rounded-xl backdrop-blur-sm flex flex-col gap-1 hover:border-gold/20 transition-colors">
                <Award size={18} className="text-gold" />
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mt-1">Certificate</span>
                <span className="text-sm font-medium text-text">Ijazah / Cert.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Image */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full h-[320px] md:h-[400px] rounded-2xl overflow-hidden bg-surface border-2 border-gold/20 shadow-[0_20px_50px_rgba(201,162,39,0.15)] group transition-transform hover:scale-[1.01] duration-500">
              {course.imageUrl ? (
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 500px"
                  priority
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-text-secondary gap-3 bg-surface-light">
                  <ShieldCheck size={64} className="text-gold/30 animate-pulse" />
                  <span className="font-display text-sm font-semibold tracking-wider text-gold/60">Anamta Syllabus</span>
                </div>
              )}
              {/* Glass overlay details */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 bg-surface/60 backdrop-blur-md p-4 rounded-xl border border-gold/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe2 size={16} className="text-gold shrink-0" />
                  <span className="text-xs font-medium text-text">Learn Worldwide</span>
                </div>
                <span className="text-[10px] font-bold text-gold uppercase bg-gold/10 px-2 py-0.5 rounded border border-gold/25">Live One-on-One</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Details & Enrollment Section */}
        {course?.features && course.features.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-4">
            {/* Left Column: Syllabus & Outlines */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-surface/40 border border-border p-6 md:p-8 rounded-2xl shadow-sm space-y-6 backdrop-blur-sm hover:border-gold/15 transition-all">
                <h3 className="text-xl md:text-2xl font-bold font-display text-text border-b border-border/60 pb-3 flex items-center gap-3">
                  <BookOpen className="text-gold" size={22} />
                  Course Syllabus & Curriculum
                </h3>

                <div className="space-y-6 text-[15px] leading-relaxed text-text-secondary">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {course.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-surface-light/45 rounded-xl border border-border/30 hover:border-gold/10 transition-colors">
                        <CheckCircle2 className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                        <span className="text-text font-medium text-sm leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Enrollment Form */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="relative">
                {/* Outer decorative back-shadow */}
                <div className="absolute inset-0 bg-gradient-to-r from-gold/15 to-primary/10 rounded-2xl blur-xl opacity-50 pointer-events-none" />
                <div className="relative">
                  <EnrollmentPanel presetCourseId={id} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto pt-4 relative">
            {/* Outer decorative back-shadow */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold/15 to-primary/10 rounded-2xl blur-xl opacity-50 pointer-events-none" />
            <div className="relative">
              <EnrollmentPanel presetCourseId={id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
