'use client';

import React from 'react';
import Image from 'next/image';
import { Check, Info } from 'lucide-react';
import { PACKAGE_TIER_META } from '@/constants/regions';
import { getCurrencySymbol } from '@/constants/countries';

export interface CoursePackageOption {
  id: string;
  region: string;
  currency: string;
  packageTier: 'BASIC' | 'INTENSIVE' | 'PREMIUM' | 'CUSTOM' | 'NONE';
  title: string;
  description: string;
  imageUrl: string;
  price: number;
}

interface PackageCardProps {
  pkg: CoursePackageOption;
  isSelected: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
}

export function PackageCard({ pkg, isSelected, onSelect, onViewDetails }: PackageCardProps) {
  const tierMeta = PACKAGE_TIER_META[pkg.packageTier as keyof typeof PACKAGE_TIER_META];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`relative flex flex-col text-left rounded-2xl border p-4 gap-3 transition-all cursor-pointer ${isSelected
          ? 'border-gold bg-gold/5 shadow-md shadow-gold/10'
          : 'border-border bg-bg hover:border-gold/40'
        }`}
    >
      {isSelected && (
        <span className="absolute top-3 right-3 h-5 w-5 rounded-full bg-gold text-primary-dark flex items-center justify-center">
          <Check size={12} strokeWidth={3} />
        </span>
      )}

      <div className="relative h-28 w-full rounded-xl overflow-hidden bg-surface border border-border">
        {pkg.imageUrl ? (
          <Image src={pkg.imageUrl} alt={pkg.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-text-secondary/40 text-xs">
            No image
          </div>
        )}
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
          {tierMeta?.label ?? pkg.packageTier}
        </span>
        <h4 className="text-sm font-bold text-text">{pkg.title}</h4>
        <p className="text-xs text-text-secondary line-clamp-2">{pkg.description}</p>
      </div>


      <div className="mt-auto pt-2 border-t border-border/60">
        <span className="text-lg font-bold text-text">{getCurrencySymbol(pkg.currency)} {pkg.price}</span>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails();
        }}
        className="self-start flex items-center gap-1 text-[11px] font-semibold text-text-secondary hover:text-gold transition-colors cursor-pointer"
      >
        <Info size={12} />
        View Details
      </button>


    </div>
  );
}
