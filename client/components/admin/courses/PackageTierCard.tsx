'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { ImageUploadField } from './ImageUploadField';
import type { CourseFormValues } from './CourseForm.types';
import type { PackageTier } from '@/constants/regions';

interface PackageTierCardProps {
  index: number;
  tier: PackageTier;
  tierLabel: string;
  tierBlurb: string;
  currency: string;
}

export function PackageTierCard({ index, tier, tierLabel, tierBlurb, currency }: PackageTierCardProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CourseFormValues>();

  const imageUrl = watch(`packages.${index}.imageUrl`);
  const packageErrors = errors.packages?.[index];

  return (
    <div className="border border-border bg-bg/40 rounded-xl p-4 space-y-3">
      <div>
        <h4 className="text-sm font-bold text-text">{tierLabel}</h4>
        <p className="text-[11px] text-text-secondary">{tierBlurb}</p>
      </div>

      <Input
        label="Package Title *"
        placeholder={`e.g. ${tierLabel} Plan`}
        {...register(`packages.${index}.title`, { required: 'Title is required.' })}
        error={packageErrors?.title?.message}
      />

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Description *
        </label>
        <textarea
          rows={2}
          placeholder="What's included in this package..."
          {...register(`packages.${index}.description`, { required: 'Description is required.' })}
          className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold placeholder:text-text-secondary/40"
        />
        {packageErrors?.description?.message && (
          <span className="text-xs text-red-500">{packageErrors.description.message}</span>
        )}
      </div>

      <ImageUploadField
        label="Package Image"
        value={imageUrl || ''}
        onChange={(url) => setValue(`packages.${index}.imageUrl`, url, { shouldDirty: true })}
        folder="course-packages"
        inputId={`package-image-${tier}-${index}`}
      />

      <Input
        label={`Price (${currency}) *`}
        type="number"
        min="0"
        step="0.01"
        {...register(`packages.${index}.price`, {
          required: 'Price is required.',
          min: { value: 0, message: 'Price cannot be negative.' },
          valueAsNumber: true,
        })}
        error={packageErrors?.price?.message}
      />
    </div>
  );
}
