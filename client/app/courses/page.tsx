'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import { GET_ALL_COURSES } from '@/graphql';
import { Search, Globe2, ArrowRight, RefreshCw, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LOCAL_REGION, pickDisplayPackage } from '@/constants/regions';
import { useCountrySelection } from '@/providers/CountryProvider';

export default function CoursesPage() {
  const { data, loading, error, refetch } = useQuery<any>(GET_ALL_COURSES, {
    fetchPolicy: 'cache-and-network',
  });

  const [searchQuery, setSearchQuery] = useState('');

  const { country, openCountryModal } = useCountrySelection();

  // Prompt for a country the moment someone lands here without one selected yet
  // (whether via the navbar, a direct link, a bookmark, or a fresh page reload — the
  // selection is in-memory only, so a reload always starts with no country selected).
  useEffect(() => {
    if (!country) {
      openCountryModal();
    }
  }, [country, openCountryModal]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-bg text-text">
        <Navbar />
        <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
          <RefreshCw className="h-10 w-10 text-gold animate-spin" />
          <p className="text-text-secondary font-medium animate-pulse">Loading course directory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg text-text">
        <Navbar />
        <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
          <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
            <BookOpen size={32} />
          </div>
          <h3 className="text-xl font-bold font-display">Failed to load courses</h3>
          <p className="text-text-secondary max-w-md">{error.message}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw size={16} />}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const allCourses = data?.courses || [];
  // Filter active courses only on user side
  const activeCourses = allCourses.filter((c: any) => c.isActive);

  // Apply search filter
  const filteredCourses = activeCourses.filter((course: any) => {
    return (
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-bg text-text pb-20 relative overflow-x-hidden">
      <Navbar />

      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[30vh] left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="relative py-20 border-b border-gold/10 bg-surface/35 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image
            src="/images/about/contact_bg.png"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center relative z-10 space-y-4">
          <span className="text-xs font-bold tracking-widest text-gold uppercase bg-gold/10 px-3 py-1 rounded-full border border-gold/25">
            Course Directory
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-text">
            Learn Quran Online with <span className="bg-gradient-to-r from-gold to-gold-light text-transparent bg-clip-text">Tajweed & Tafsir</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-[15px] leading-relaxed">
            Select one of our structured learning programs designed for kids and adults. Connect with certified teachers for personalized one-on-one sessions.
          </p>
        </div>
      </div>

      {/* Search Row */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-12">
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-surface border border-border p-4 rounded-2xl shadow-sm">
          <div className="relative w-full sm:w-96">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search course title or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg border border-border pl-10 pr-4 py-2.5 rounded-xl text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors placeholder:text-text-secondary/50"
            />
          </div>

          <button
            type="button"
            onClick={() => openCountryModal()}
            className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-gold transition-colors sm:ml-auto shrink-0"
          >
            <Globe2 size={14} className="text-gold" />
            {country ? `Pricing shown for ${country.name} — change` : 'Select your country'}
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-10">
        {filteredCourses.length === 0 ? (
          <div className="bg-surface border border-border text-center py-20 rounded-2xl">
            <BookOpen size={48} className="mx-auto text-text-secondary/40 mb-4 animate-bounce" />
            <h3 className="text-lg font-bold font-display text-text">No courses match your search</h3>
            <p className="text-text-secondary mt-1 text-sm">Try using different keywords or resetting filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course: any) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 flex flex-col group"
              >
                {/* Course Image */}
                <div className="relative h-52 w-full overflow-hidden bg-surface-dark border-b border-border">
                  {course.imageUrl ? (
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-text-secondary bg-primary/5">
                      <BookOpen size={40} className="stroke-1 text-gold/50" />
                    </div>
                  )}
                  {/* Decorative badge overlay */}
                  <div className="absolute top-4 left-4 bg-primary-dark/80 backdrop-blur-md border border-gold/30 text-gold text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                    Online 1-on-1
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-display text-text group-hover:text-gold transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-[13px] text-text-secondary line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Meta info row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-secondary border-t border-border pt-4">
                      <div className="flex items-center gap-1.5">
                        <Globe2 size={14} className="text-gold" />
                        <span>{country ? country.name : 'Local & international pricing'}</span>
                      </div>
                      {(() => {
                        if (!country) return null;

                        const displayPackage = pickDisplayPackage(course.packages ?? [], country.region);
                        if (!displayPackage) return null;

                        const prefix = country.region === LOCAL_REGION ? '' : 'From ';
                        return (
                          <span className="text-sm font-bold text-gold">
                            {prefix}{displayPackage.currency} {displayPackage.price}
                          </span>
                        );
                      })()}
                    </div>

                    {/* CTA (visual only — the whole card is the link) */}
                    <span className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary group-hover:bg-gold text-white py-3 text-xs font-semibold transition-all duration-200 group-hover:text-primary-dark">
                      <span>Explore Syllabus & Enroll</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
