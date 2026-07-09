'use client';

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { ImageUploadField } from './ImageUploadField';
import TiptapEditor from '@/lib/TiptapEditor';
import type { CourseFormValues } from './CourseForm.types';
import type { PackageTier, Region } from '@/constants/regions';

interface PackageTierCardProps {
  index: number;
  region: Region;
  tier: PackageTier;
  tierLabel: string;
  tierBlurb: string;
  currency: string;
}

export function PackageTierCard({ index, region, tier, tierLabel, tierBlurb, currency }: PackageTierCardProps) {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<CourseFormValues>();

  const imageUrl = watch(`packages.${index}.imageUrl`);
  const packageErrors = errors.packages?.[index];

  return (
    <div className="border border-border bg-bg/40 rounded-xl p-4 space-y-3">
      {/* useFieldArray.append() only seeds these on the field-array's initial shape — RHF drops
          unregistered keys from the submitted values, so they must be registered here too. */}
      <input type="hidden" {...register(`packages.${index}.region`)} defaultValue={region} />
      <input type="hidden" {...register(`packages.${index}.packageTier`)} defaultValue={tier} />
      <input type="hidden" {...register(`packages.${index}.currency`)} defaultValue={currency} />
      <input type="hidden" {...register(`packages.${index}.imageUrl`)} defaultValue="" />

      <div>
        <h4 className="text-sm font-bold text-text">{tierLabel}</h4>
        <p className="text-[11px] text-text-secondary">{tierBlurb}</p>
      </div>

      <Input
        label={tier === 'NONE' || tier === 'CUSTOM' ? "Package Title *" : "Package Title"}
        placeholder={`e.g. ${tierLabel} Plan`}
        {...register(`packages.${index}.title`, {
          required: tier === 'NONE' || tier === 'CUSTOM' ? 'Title is required.' : false
        })}
        error={packageErrors?.title?.message}
      />

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Description *
        </label>
        <Controller
          name={`packages.${index}.description`}
          control={control}
          rules={{
            required: 'Description is required.',
            validate: (value) => {
              const text = (value || '').replace(/<[^>]*>/g, '').trim();
              return text.length > 0 || 'Description is required.';
            },
          }}
          render={({ field }) => (
            <TiptapEditor
              value={field.value || ''}
              onChange={field.onChange}
            />
          )}
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
