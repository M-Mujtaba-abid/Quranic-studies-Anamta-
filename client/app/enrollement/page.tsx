'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import { EnrollmentPanel } from '@/components/enrollment/EnrollmentPanel';
import { ArrowLeft } from 'lucide-react';

// Direct Enrollment entry point — reached from a generic "Enroll Now" CTA that isn't
// tied to a specific course page. EnrollmentPanel handles picking the course itself.
export default function EnrollementPage() {
  return (
    // <div className="min-h-screen bg-bg text-text pb-20 relative overflow-x-hidden">
    <div className="min-h-screen bg-bg text-text pb-20 relative">

      <Navbar />

      {/* Page-wide background image. Plain opacity (no blend mode) — mix-blend-overlay against
          this page's near-black --color-bg crushes the image to invisible. */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Image
          src="/images/about/contact_bg.png"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-bg/70 to-bg" />
      </div>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[30vh] left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto px-6 lg:px-10 mt-8 space-y-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-text">
            Enroll in a Course
          </h1>
          <p className="text-text-secondary text-sm md:text-base">
            Pick a course, choose your package, and get started today.
          </p>
        </div>

        <EnrollmentPanel />
      </div>
    </div>
  );
}
