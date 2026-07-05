'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { StudentInfoFields } from './StudentInfoFields';
import type { StudentInfoValues } from './enrollment.types';

interface LocalEnrollmentFormProps {
  isSubmitting: boolean;
  onSubmit: (values: StudentInfoValues) => void;
}

// Local (Pakistan) enrollment: no packages, no schedule fields, no free trial —
// just student details and a single "Pay Now" action at the fixed PKR price.
export function LocalEnrollmentForm({ isSubmitting, onSubmit }: LocalEnrollmentFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentInfoValues>({
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', address: '', city: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <StudentInfoFields
        control={control}
        register={register}
        errors={errors}
        phoneCountryCode="pk"
        lockPhoneCountry
      />

      <Button type="submit" variant="gold" className="w-full py-3.5 rounded-xl text-sm shadow-md" isLoading={isSubmitting}>
        Pay Now
      </Button>
    </form>
  );
}
