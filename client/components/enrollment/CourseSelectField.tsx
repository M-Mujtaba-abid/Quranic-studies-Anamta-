'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LOCAL_REGION } from '@/constants/regions';
import { getCurrencySymbol } from '@/constants/countries';

interface CoursePackageOption {
  region: string;
  packageTier: string;
  price: number;
  currency: string;
}

interface CourseOption {
  id: string;
  title: string;
  category?: 'ONE_ON_ONE' | 'GROUP';
  packages?: CoursePackageOption[];
}

interface CourseSelectFieldProps {
  courses: CourseOption[];
  value: string;
  onChange: (courseId: string) => void;
  loading?: boolean;
}

// Group classes have one fixed Pakistan-only price per course, so it's useful to show right
// in the dropdown. 1-on-1 has multiple regions/tiers with no single price, so it's left alone.
function getGroupPriceLabel(course: CourseOption): string | null {
  if (course.category !== 'GROUP') return null;
  const localPackage = course.packages?.find((pkg) => pkg.region === LOCAL_REGION);
  if (!localPackage) return null;
  return `${getCurrencySymbol(localPackage.currency)} ${localPackage.price}`;
}

// Only rendered by EnrollmentPanel when it wasn't given a presetCourseId — i.e. the
// "Direct Enrollment" flow reached from a generic entry point instead of a course page.
export function CourseSelectField({ courses, value, onChange, loading }: CourseSelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
        Select a Course *
      </label>
      <div className="relative">
        <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none z-10" />
        <Select value={value} onValueChange={onChange} disabled={loading}>
          <SelectTrigger className="pl-9">
            <SelectValue placeholder={loading ? 'Loading courses...' : 'Choose a course...'} />
          </SelectTrigger>
          <SelectContent side="bottom" align="start">
            {courses.map((course) => {
              const groupPriceLabel = getGroupPriceLabel(course);
              return (
                <SelectItem key={course.id} value={course.id}>
                  {groupPriceLabel ? `${course.title} — ${groupPriceLabel}` : course.title}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
