'use client';

import React from 'react';
import Image from 'next/image';
import { X, Check } from 'lucide-react';
import { PACKAGE_TIER_META } from '@/constants/regions';
import type { CoursePackageOption } from './PackageCard';
import { getCurrencySymbol } from '@/constants/countries';

import { createPortal } from 'react-dom';

interface PackageDetailsModalProps {
  pkg: CoursePackageOption | null;
  isOpen: boolean;
  isSelected: boolean;
  onClose: () => void;
  onSelect: () => void;
}

// Shows the full details for whichever package the student clicked "View Details" on —
// content is entirely driven by the `pkg` prop, so the same modal serves Basic/Intensive/Premium.
export function PackageDetailsModal({ pkg, isOpen, isSelected, onClose, onSelect }: PackageDetailsModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !pkg) return null;
  if (!mounted) return null;

  const tierMeta = PACKAGE_TIER_META[pkg.packageTier as keyof typeof PACKAGE_TIER_META];

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-surface border border-border w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-scale-in max-h-[85vh] flex flex-col">
        <div className="relative h-40 sm:h-56 w-full shrink-0 bg-bg border-b border-border">
          {pkg.imageUrl ? (
            <Image
              src={pkg.imageUrl}
              alt={pkg.title || ''}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 512px"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-text-secondary/40 text-xs">
              No image
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 border border-white/10 text-white hover:text-gold transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
              {tierMeta?.label ?? pkg.packageTier}
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-display text-text mt-1">{pkg.title}</h3>
          </div>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-line">
            {pkg.description}
          </p>

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
            <span className="text-xl sm:text-2xl font-bold text-text">
              {getCurrencySymbol(pkg.currency)} {pkg.price}
            </span>
            <button
              type="button"
              onClick={onSelect}
              className={`flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-gold/10 border border-gold text-gold'
                  : 'bg-gold text-primary-dark hover:bg-gold-light'
              }`}
            >
              {isSelected && <Check size={16} />}
              {isSelected ? 'Selected' : 'Select This Package'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
