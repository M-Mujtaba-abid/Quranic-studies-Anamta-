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
  title?: string | null;
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

  const formatDescription = (description: string) => {
    if (!description) return '';
    const hasHtml = /<[a-z][\s\S]*>/i.test(description);
    if (hasHtml) return description;
    return description.replace(/\n/g, '<br />');
  };

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
      className={`group flex flex-col p-4 rounded-2xl border transition-all duration-300 relative text-left h-[300px] cursor-pointer ${isSelected
        ? 'bg-surface border-gold shadow-[0_0_20px_rgba(197,168,128,0.06)]'
        : 'bg-surface/50 border-border hover:bg-surface hover:border-border/85'
        }`}
    >
      {isSelected && (
        <span className="absolute top-3 right-3 h-5 w-5 rounded-full bg-gold text-primary-dark flex items-center justify-center">
          <Check size={12} strokeWidth={3} />
        </span>
      )}

      <div className="relative h-28 w-full rounded-xl overflow-hidden bg-surface border border-border">
        {pkg.imageUrl ? (
          <Image src={pkg.imageUrl} alt={pkg.title || ''} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-text-secondary/40 text-xs">
            No image
          </div>
        )}
      </div>

      <div className="space-y-1">
        <span className="text-[17px] font-bold  tracking-widest text-gold">
          {tierMeta?.label ?? pkg.packageTier} Plan
        </span>
        <h4 className="text-sm font-bold text-text">{pkg.title}</h4>
        <div
          className="text-xs text-text-secondary line-clamp-2 tiptap"
          dangerouslySetInnerHTML={{ __html: formatDescription(pkg.description) }}
        />
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
        className="w-full mt-2 py-2 px-4 rounded-xl border border-gold/30 hover:border-gold text-gold hover:bg-gold/5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer"
      >
        {/* <Info size={13} /> */}
        View Details
      </button>


    </div>
  );
}
