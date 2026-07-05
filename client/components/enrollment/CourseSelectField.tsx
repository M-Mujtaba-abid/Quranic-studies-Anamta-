'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';

interface CourseOption {
  id: string;
  title: string;
}

interface CourseSelectFieldProps {
  courses: CourseOption[];
  value: string;
  onChange: (courseId: string) => void;
  loading?: boolean;
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
        <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
        <select
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          className="w-full appearance-none bg-bg border border-border pl-9 pr-4 py-2.5 rounded-xl text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors disabled:opacity-50"
        >
          <option value="" disabled>
            {loading ? 'Loading courses...' : 'Choose a course...'}
          </option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
