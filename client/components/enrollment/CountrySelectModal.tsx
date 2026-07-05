'use client';

import React from 'react';
import { Globe2, X } from 'lucide-react';
import { COUNTRIES, OTHER_COUNTRY, type CountryOption } from '@/constants/countries';

interface CountrySelectModalProps {
  isOpen: boolean;
  onSelect: (country: CountryOption) => void;
  onClose?: () => void;
}

export function CountrySelectModal({ isOpen, onSelect, onClose }: CountrySelectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-scale-in">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-gold" />
            <h3 className="font-display font-bold text-lg text-text">Select Your Country</h3>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 rounded border border-border text-text-secondary hover:text-gold">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-text-secondary">
            We use this to show you the correct enrollment options and pricing in your local currency.
          </p>

          <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => onSelect(country)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-bg text-sm text-text hover:border-gold hover:text-gold transition-all cursor-pointer text-left"
              >
                <span className="truncate">{country.name}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onSelect(OTHER_COUNTRY)}
            className="w-full px-3 py-2.5 rounded-xl border border-dashed border-border text-xs font-medium text-text-secondary hover:border-gold hover:text-gold transition-all cursor-pointer"
          >
            My country isn&apos;t listed
          </button>
        </div>
      </div>
    </div>
  );
}
