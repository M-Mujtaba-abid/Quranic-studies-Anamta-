'use client';

import React from 'react';
import { Globe2, X, RefreshCw } from 'lucide-react';
import { mapCountryToRegion, type CountryOption } from '@/constants/countries';
import { useQuery } from '@apollo/client/react';
import { GET_COUNTRIES } from '@/graphql';

interface CountrySelectModalProps {
  isOpen: boolean;
  enrollmentMode: 'ONE_ON_ONE' | 'GROUP';
  onSelect: (country: CountryOption) => void;
  onClose?: () => void;
}

export function CountrySelectModal({ isOpen, enrollmentMode, onSelect, onClose }: CountrySelectModalProps) {
  const { data, loading } = useQuery<any>(GET_COUNTRIES, {
    variables: { enrollmentMode },
    skip: !isOpen,
  });

  if (!isOpen) return null;

  const rawCountries = data?.countries ?? [];
  const mappedCountries: CountryOption[] = rawCountries
    .map((c: any) => ({
      name: c.name,
      code: c.code.toLowerCase(),
      region: mapCountryToRegion(c.code, c.name),
    }))
    .sort((a: CountryOption, b: CountryOption) => {
      if (a.name === 'Others') return 1;
      if (b.name === 'Others') return -1;
      return a.name.localeCompare(b.name);
    });

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

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8">
              <RefreshCw className="h-5 w-5 text-gold animate-spin" />
              <span className="text-xs text-text-secondary">Loading countries...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
              {mappedCountries.map((country) => (
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
          )}
        </div>
      </div>
    </div>
  );
}

