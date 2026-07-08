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

const emptyPackage = (
  region: Region,
  packageTier: PackageFormValues['packageTier'],
  category: 'ONE_ON_ONE' | 'GROUP' = 'ONE_ON_ONE'
): PackageFormValues => ({
  region,
  packageTier,
  currency: (region === LOCAL_REGION && category === 'ONE_ON_ONE') ? 'USD' : REGION_META[region].currency,
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
      category: initialCourse.category ?? 'ONE_ON_ONE',
      features: initialCourse.features && initialCourse.features.length > 0
        ? [...initialCourse.features, '', '', '', ''].slice(0, 5)
        : ['', '', '', '', ''],
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
    category: 'ONE_ON_ONE',
    features: ['', '', '', '', ''],
    imageUrl: '',
    imageId: '',
    isActive: true,
    packages: [
      ...PACKAGE_TIERS.map(tier => emptyPackage(LOCAL_REGION, tier, 'ONE_ON_ONE')),
      ...PACKAGE_TIERS.map(tier => emptyPackage('OTHERS', tier, 'ONE_ON_ONE'))
    ],
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

  const currentCategory = watch('category');
  const pakistanIndex = fields.findIndex((f) => f.region === LOCAL_REGION && f.packageTier === 'NONE');
  const regionIndices = (region: Region) =>
    fields.map((f, i) => i).filter((i) => fields[i].region === region);

  const handleCategoryChange = (newCategory: 'ONE_ON_ONE' | 'GROUP') => {
    setValue('category', newCategory);
    if (newCategory === 'GROUP') {
      // Locked to Pakistan with only 1 pricing tier (NONE) in PKR
      setValue('packages', [emptyPackage(LOCAL_REGION, 'NONE', 'GROUP')]);
      setActiveRegion(LOCAL_REGION);
    } else {
      // 1-on-1 Classes: Default packages for Pakistan (3 tiers in USD) and OTHERS (3 tiers in USD)
      const pkPackages = PACKAGE_TIERS.map((tier) => emptyPackage(LOCAL_REGION, tier, 'ONE_ON_ONE'));
      const othersPackages = PACKAGE_TIERS.map((tier) => emptyPackage('OTHERS', tier, 'ONE_ON_ONE'));
      setValue('packages', [...pkPackages, ...othersPackages]);
      setActiveRegion(LOCAL_REGION);
    }
  };

  const enableRegion = (region: Region) => {
    PACKAGE_TIERS.forEach((tier) => append(emptyPackage(region, tier, currentCategory)));
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

    const activeCurrency = (targetRegion === LOCAL_REGION && currentCategory === 'ONE_ON_ONE')
      ? 'USD'
      : REGION_META[targetRegion].currency;

    PACKAGE_TIERS.forEach((tier) => {
      const sourceIndex = othersIndices.find((i) => fields[i].packageTier === tier);
      if (sourceIndex === undefined) return;
      const source = fields[sourceIndex];

      const targetIndex = regionIndices(targetRegion).find((i) => fields[i].packageTier === tier);
      const nextValue: PackageFormValues = {
        region: targetRegion,
        packageTier: tier,
        currency: activeCurrency,
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

    // Default predefined plan titles if empty and map local values
    const packages = values.packages.map((pkg) => {
      const title = pkg.title?.trim() || null;
      // Fallback package image to main course image if it was left empty
      const imageUrl = pkg.imageUrl?.trim() || values.imageUrl;
      // Trim description
      const description = pkg.description?.trim() || '';

      return pkg.region === LOCAL_REGION && values.category === 'GROUP'
        ? { ...pkg, title: values.title, description: values.description, imageUrl: values.imageUrl }
        : { ...pkg, title, description, imageUrl };
    });

    const grouped = new Map<Region, PackageFormValues[]>();
    packages.forEach((pkg) => {
      grouped.set(pkg.region, [...(grouped.get(pkg.region) ?? []), pkg]);
    });

    if (values.category === 'GROUP') {
      const localPkgs = grouped.get(LOCAL_REGION) ?? [];
      if (localPkgs.length !== 1 || localPkgs[0].packageTier !== 'NONE') {
        toast.error('Local (Pakistan) single price is required for Group classes.');
        return;
      }
      // Ensure no other regions are configured
      for (const region of REGIONS) {
        if (region === LOCAL_REGION) continue;
        if ((grouped.get(region) ?? []).length > 0) {
          toast.error('Group classes can only have Pakistan pricing configured.');
          return;
        }
      }
    } else {
      // 1-on-1 Classes
      const othersPkgs = grouped.get('OTHERS') ?? [];
      if (othersPkgs.length < PACKAGE_TIERS.length) {
        toast.error('Others region pricing is required for 1-on-1 classes.');
        return;
      }

      for (const region of REGIONS) {
        const entries = grouped.get(region) ?? [];
        if (entries.length > 0 && entries.length < PACKAGE_TIERS.length) {
          toast.error(`${REGION_META[region].label} pricing is incomplete — fill all 3 tiers or clear the region.`);
          return;
        }
      }

      // Validate descriptions for active regions' packages
      for (const pkg of packages) {
        const regionEntries = grouped.get(pkg.region) ?? [];
        if (regionEntries.length > 0) {
          if (!pkg.description || !pkg.description.trim()) {
            const regionLabel = REGION_META[pkg.region]?.label || pkg.region;
            const tierLabel = PACKAGE_TIER_META[pkg.packageTier as keyof typeof PACKAGE_TIER_META]?.label || pkg.packageTier;
            toast.error(`Description is required for ${regionLabel} - ${tierLabel} package.`);
            setActiveRegion(pkg.region);
            return;
          }
        }
      }
    }

    // Clean features list
    const features = (values.features ?? []).map((f) => f.trim()).filter(Boolean);

    onSubmit({
      title: values.title,
      description: values.description,
      category: values.category,
      features,
      imageUrl: values.imageUrl,
      imageId: values.imageId,
      isActive: values.isActive,
      packages,
    });
  };

  const imageUrl = watch('imageUrl');
  const activeCurrency = (activeRegion === LOCAL_REGION && currentCategory === 'ONE_ON_ONE')
    ? 'USD'
    : REGION_META[activeRegion].currency;

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
                {/* Course Category Selector Toggle */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Course Type *
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm text-text font-medium cursor-pointer select-none">
                      <input
                        type="radio"
                        value="ONE_ON_ONE"
                        checked={currentCategory === 'ONE_ON_ONE'}
                        onChange={() => handleCategoryChange('ONE_ON_ONE')}
                        className="text-gold focus:ring-gold border-border cursor-pointer h-4 w-4 bg-bg"
                      />
                      1-on-1 Classes
                    </label>
                    <label className="flex items-center gap-2 text-sm text-text font-medium cursor-pointer select-none">
                      <input
                        type="radio"
                        value="GROUP"
                        checked={currentCategory === 'GROUP'}
                        onChange={() => handleCategoryChange('GROUP')}
                        className="text-gold focus:ring-gold border-border cursor-pointer h-4 w-4 bg-bg"
                      />
                      Group Classes
                    </label>
                  </div>
                </div>

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
                    rows={3}
                    placeholder="Provide a detailed overview of the syllabus and target audience..."
                    {...register('description', { required: 'Description is required.' })}
                    className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold placeholder:text-text-secondary/40"
                  />
                  {errors.description?.message && (
                    <span className="text-xs text-red-500">{errors.description.message}</span>
                  )}
                </div>

                {/* Features / What you will learn */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    What You Will Learn (Syllabus List)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <Input
                        key={index}
                        placeholder={`Feature / Syllabus Point #${index + 1}`}
                        {...register(`features.${index}` as any)}
                      />
                    ))}
                  </div>
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
                    {currentCategory === 'GROUP'
                      ? 'Group classes are only available in Pakistan at a single local price.'
                      : '1-on-1 classes support all regions (priced in USD for Pakistan & others).'}
                  </p>
                </div>

                {/* Region Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 border-b border-border">
                  {REGIONS.map((region) => {
                    if (currentCategory === 'GROUP' && region !== LOCAL_REGION) {
                      return null;
                    }
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
                {activeRegion === LOCAL_REGION && currentCategory === 'GROUP' ? (
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
                          <Button type="button" variant="outline" size="sm" onClick={() => enableRegion(activeRegion)} leftIcon={<Plus size={14} />}>
                            Add {REGION_META[activeRegion].label} Pricing
                          </Button>
                          {activeRegion !== 'OTHERS' && (
                            <Button type="button" variant="ghost" size="sm" onClick={() => copyFromOthers(activeRegion)} leftIcon={<Copy size={14} />}>
                              Copy from OTHERS
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-text-secondary">
                            {REGION_META[activeRegion].label} · priced in {activeCurrency}
                          </p>
                          <div className="flex gap-2">
                            {activeRegion !== 'OTHERS' && (
                              <Button type="button" variant="ghost" size="sm" onClick={() => copyFromOthers(activeRegion)} leftIcon={<Copy size={14} />}>
                                Copy from OTHERS
                              </Button>
                            )}
                            <Button type="button" variant="ghost" size="sm" onClick={() => disableRegion(activeRegion)} leftIcon={<Trash2 size={14} />}>
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
                                region={activeRegion}
                                tier={tier}
                                tierLabel={PACKAGE_TIER_META[tier].label}
                                tierBlurb={PACKAGE_TIER_META[tier].blurb}
                                currency={activeCurrency}
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
