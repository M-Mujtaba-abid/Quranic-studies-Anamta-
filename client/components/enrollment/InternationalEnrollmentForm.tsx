'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Sparkles, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StudentInfoFields } from './StudentInfoFields';
import { PackageCard, type CoursePackageOption } from './PackageCard';
import { PackageDetailsModal } from './PackageDetailsModal';
import type { StudentInfoValues } from './enrollment.types';

interface InternationalEnrollmentFormProps {
  packages: CoursePackageOption[];
  phoneCountryCode: string;
  isSubmitting: boolean;
  onSubmit: (values: StudentInfoValues, packageTier: string, enrollmentType: 'REGULAR' | 'FREE_TRIAL') => void;
}

export function InternationalEnrollmentForm({
  packages,
  phoneCountryCode,
  isSubmitting,
  onSubmit,
}: InternationalEnrollmentFormProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(packages[0]?.packageTier ?? null);
  const [detailsPackage, setDetailsPackage] = useState<CoursePackageOption | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentInfoValues>({
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', address: '', city: '' },
  });

  const submitAs = (enrollmentType: 'REGULAR' | 'FREE_TRIAL') =>
    handleSubmit((values) => {
      if (!selectedTier) return;
      onSubmit(values, selectedTier, enrollmentType);
    });

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold text-text mb-3">Choose a Package</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              isSelected={selectedTier === pkg.packageTier}
              onSelect={() => setSelectedTier(pkg.packageTier)}
              onViewDetails={() => setDetailsPackage(pkg)}
            />
          ))}
        </div>
      </div>

      <PackageDetailsModal
        pkg={detailsPackage}
        isOpen={detailsPackage !== null}
        isSelected={detailsPackage !== null && selectedTier === detailsPackage.packageTier}
        onClose={() => setDetailsPackage(null)}
        onSelect={() => {
          if (detailsPackage) setSelectedTier(detailsPackage.packageTier);
          setDetailsPackage(null);
        }}
      />

      <form className="space-y-6">
        <StudentInfoFields
          control={control}
          register={register}
          errors={errors}
          phoneCountryCode={phoneCountryCode}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full py-3 rounded-xl text-sm"
            isLoading={isSubmitting}
            disabled={!selectedTier}
            onClick={submitAs('FREE_TRIAL')}
            leftIcon={<Sparkles size={14} />}
          >
            Book a Free Triall
          </Button>
          <Button
            type="button"
            variant="gold"
            className="w-full py-3 rounded-xl text-sm shadow-md"
            isLoading={isSubmitting}
            disabled={!selectedTier}
            onClick={submitAs('REGULAR')}
            leftIcon={<CreditCard size={14} />}
          >
            Pay Now
          </Button>
        </div>
      </form>
    </div>
  );
}
