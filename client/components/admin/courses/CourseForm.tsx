'use client';

import React, { useEffect, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { X, Copy, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUploadField } from './ImageUploadField';
import { PackageTierCard } from './PackageTierCard';
import {
  REGIONS,
  REGION_META,
  PACKAGE_TIERS,
  PACKAGE_TIER_META,
  LOCAL_REGION,
  type Region,
} from '@/constants/regions';
import type { CourseFormValues, CourseSubmitInput, PackageFormValues } from './CourseForm.types';

const emptyPackage = (region: Region, packageTier: PackageFormValues['packageTier']): PackageFormValues => ({
  region,
  packageTier,
  currency: REGION_META[region].currency,
  title: '',
  description: '',
  imageUrl: '',
  price: 0,
});

const buildDefaultValues = (initialCourse?: any): CourseFormValues => {
  if (initialCourse) {
    return {
      title: initialCourse.title ?? '',
      description: initialCourse.description ?? '',
      imageUrl: initialCourse.imageUrl ?? '',
      imageId: initialCourse.imageId ?? '',
      isActive: initialCourse.isActive ?? true,
      packages: (initialCourse.packages ?? []).map((pkg: any) => ({
        region: pkg.region,
        packageTier: pkg.packageTier,
        currency: pkg.currency,
        title: pkg.title,
        description: pkg.description,
        imageUrl: pkg.imageUrl,
        price: pkg.price,
      })),
    };
  }

  return {
    title: '',
    description: '',
    imageUrl: '',
    imageId: '',
    isActive: true,
    packages: [emptyPackage(LOCAL_REGION, 'NONE')],
  };
};

interface CourseFormProps {
  isOpen: boolean;
  isEditMode: boolean;
  initialCourse?: any;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (input: CourseSubmitInput) => void | Promise<void>;
}

export function CourseForm({ isOpen, isEditMode, initialCourse, isSubmitting, onClose, onSubmit }: CourseFormProps) {
  const methods = useForm<CourseFormValues>({ defaultValues: buildDefaultValues() });
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = methods;
  const { fields, append, remove, update } = useFieldArray({ control: methods.control, name: 'packages' });

  const [activeRegion, setActiveRegion] = useState<Region>(LOCAL_REGION);

  // Re-seed the form whenever the modal opens (fresh create, or a different course to edit).
  useEffect(() => {
    if (isOpen) {
      reset(buildDefaultValues(initialCourse));
      setActiveRegion(LOCAL_REGION);
    }
  }, [isOpen, initialCourse, reset]);

  if (!isOpen) return null;

  const pakistanIndex = fields.findIndex((f) => f.region === LOCAL_REGION);
  const regionIndices = (region: Region) =>
    fields.map((f, i) => i).filter((i) => fields[i].region === region);

  const enableRegion = (region: Region) => {
    const currency = REGION_META[region].currency;
    PACKAGE_TIERS.forEach((tier) => append(emptyPackage(region, tier)));
    void currency; // currency already baked into emptyPackage()
  };

  const disableRegion = (region: Region) => {
    const indices = regionIndices(region);
    if (indices.length > 0) remove(indices);
  };

  const copyFromOthers = (targetRegion: Region) => {
    const othersIndices = regionIndices('OTHERS');
    if (othersIndices.length === 0) {
      toast.warning('Fill out the OTHERS tab first, then copy it across.');
      return;
    }

    PACKAGE_TIERS.forEach((tier) => {
      const sourceIndex = othersIndices.find((i) => fields[i].packageTier === tier);
      if (sourceIndex === undefined) return;
      const source = fields[sourceIndex];

      const targetIndex = regionIndices(targetRegion).find((i) => fields[i].packageTier === tier);
      const nextValue: PackageFormValues = {
        region: targetRegion,
        packageTier: tier,
        currency: REGION_META[targetRegion].currency,
        title: source.title,
        description: source.description,
        imageUrl: source.imageUrl,
        price: targetIndex !== undefined ? fields[targetIndex].price : 0,
      };

      if (targetIndex !== undefined) {
        update(targetIndex, nextValue);
      } else {
        append(nextValue);
      }
    });

    toast.success(`Copied OTHERS content into ${REGION_META[targetRegion].label}. Update the prices.`);
  };

  const submit = (values: CourseFormValues) => {
    if (!values.imageUrl || !values.imageId) {
      toast.error('Please upload a course thumbnail image before submitting.');
      return;
    }

    // The local package mirrors the course's own title/description/imageUrl —
    // the admin only ever sets its price.
    const packages = values.packages.map((pkg) =>
      pkg.region === LOCAL_REGION
        ? { ...pkg, title: values.title, description: values.description, imageUrl: values.imageUrl }
        : pkg,
    );

    const grouped = new Map<Region, PackageFormValues[]>();
    packages.forEach((pkg) => {
      grouped.set(pkg.region, [...(grouped.get(pkg.region) ?? []), pkg]);
    });

    if (!grouped.get(LOCAL_REGION)?.length) {
      toast.error('Local (Pakistan) pricing is required.');
      return;
    }

    for (const region of REGIONS) {
      if (region === LOCAL_REGION) continue;
      const entries = grouped.get(region) ?? [];
      if (entries.length > 0 && entries.length < PACKAGE_TIERS.length) {
        toast.error(`${REGION_META[region].label} pricing is incomplete — fill all 3 tiers or clear the region.`);
        return;
      }
    }

    onSubmit({
      title: values.title,
      description: values.description,
      imageUrl: values.imageUrl,
      imageId: values.imageId,
      isActive: values.isActive,
      packages,
    });
  };

  const imageUrl = watch('imageUrl');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden animate-scale-in">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-text">
            {isEditMode ? 'Edit Course Program' : 'Create New Course'}
          </h3>
          <button onClick={onClose} className="p-1 rounded border border-border text-text-secondary hover:text-gold">
            <X size={18} />
          </button>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(submit)}>
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Basic Info */}
              <div className="space-y-4">
                <Input
                  label="Course Title *"
                  placeholder="e.g. Online Tajweed Course"
                  {...register('title', { required: 'Title is required.' })}
                  error={errors.title?.message}
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide a detailed overview of the syllabus and target audience..."
                    {...register('description', { required: 'Description is required.' })}
                    className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold placeholder:text-text-secondary/40"
                  />
                  {errors.description?.message && (
                    <span className="text-xs text-red-500">{errors.description.message}</span>
                  )}
                </div>

                <ImageUploadField
                  label="Course Thumbnail Image *"
                  value={imageUrl}
                  onChange={(url, publicId) => {
                    setValue('imageUrl', url, { shouldDirty: true });
                    setValue('imageId', publicId, { shouldDirty: true });
                  }}
                  folder="courses"
                  inputId="course-thumbnail-upload"
                />

                {isEditMode && (
                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      {...register('isActive')}
                      id="course-active-checkbox"
                      className="rounded text-gold focus:ring-gold border-border cursor-pointer h-4 w-4 bg-bg"
                    />
                    <label htmlFor="course-active-checkbox" className="text-sm font-medium text-text select-none cursor-pointer">
                      Publish and make this course active for student enrollment
                    </label>
                  </div>
                )}
              </div>

              <div className="h-[1px] bg-border" />

              {/* Pricing / Packages */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-text">Regional Pricing & Packages</h4>
                  <p className="text-[11px] text-text-secondary">
                    Local (Pakistan) students enroll at a single price. Every other region offers Basic, Intensive and Premium packages.
                  </p>
                </div>

                {/* Region Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 border-b border-border">
                  {REGIONS.map((region) => {
                    const configured = regionIndices(region).length > 0;
                    return (
                      <button
                        key={region}
                        type="button"
                        onClick={() => setActiveRegion(region)}
                        className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                          activeRegion === region
                            ? 'border-gold text-gold'
                            : 'border-transparent text-text-secondary hover:text-text'
                        }`}
                      >
                        {REGION_META[region].label}
                        {configured && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                      </button>
                    );
                  })}
                </div>

                {/* Active Tab Panel */}
                {activeRegion === LOCAL_REGION ? (
                  <div className="space-y-3 max-w-xs">
                    <p className="text-xs text-text-secondary">
                      No packages, no free trial — just a direct PKR price for local enrollment.
                    </p>
                    {pakistanIndex !== -1 && (
                      <Input
                        label="Price (PKR) *"
                        type="number"
                        min="0"
                        step="0.01"
                        {...register(`packages.${pakistanIndex}.price`, {
                          required: 'Price is required.',
                          min: { value: 0, message: 'Price cannot be negative.' },
                          valueAsNumber: true,
                        })}
                        error={errors.packages?.[pakistanIndex]?.price?.message}
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {regionIndices(activeRegion).length === 0 ? (
                      <div className="text-center py-8 border border-dashed border-border rounded-xl">
                        <p className="text-sm text-text-secondary mb-3">
                          No pricing configured for {REGION_META[activeRegion].label} yet.
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => enableRegion(activeRegion)}
                            leftIcon={<Plus size={14} />}
                          >
                            Add {REGION_META[activeRegion].label} Pricing
                          </Button>
                          {activeRegion !== 'OTHERS' && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => copyFromOthers(activeRegion)}
                              leftIcon={<Copy size={14} />}
                            >
                              Copy from OTHERS
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-text-secondary">
                            {REGION_META[activeRegion].label} · priced in {REGION_META[activeRegion].currency}
                          </p>
                          <div className="flex gap-2">
                            {activeRegion !== 'OTHERS' && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => copyFromOthers(activeRegion)}
                                leftIcon={<Copy size={14} />}
                              >
                                Copy from OTHERS
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => disableRegion(activeRegion)}
                              leftIcon={<Trash2 size={14} />}
                            >
                              Clear Region
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {PACKAGE_TIERS.map((tier) => {
                            const index = regionIndices(activeRegion).find((i) => fields[i].packageTier === tier);
                            if (index === undefined) return null;
                            return (
                              <PackageTierCard
                                key={fields[index].id}
                                index={index}
                                tier={tier}
                                tierLabel={PACKAGE_TIER_META[tier].label}
                                tierBlurb={PACKAGE_TIER_META[tier].blurb}
                                currency={REGION_META[activeRegion].currency}
                              />
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-border flex items-center justify-end gap-3 bg-surface-light/25">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" size="sm" isLoading={isSubmitting}>
                {isEditMode ? 'Save Changes' : 'Create Course'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
