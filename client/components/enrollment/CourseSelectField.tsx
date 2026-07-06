'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
        <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none z-10" />
        <Select value={value} onValueChange={onChange} disabled={loading}>
          <SelectTrigger className="pl-9">
            <SelectValue placeholder={loading ? 'Loading courses...' : 'Choose a course...'} />
          </SelectTrigger>
          <SelectContent side="bottom" align="start">
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
