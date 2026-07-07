'use client';

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CountrySelectModal } from '@/components/enrollment/CountrySelectModal';
import type { CountryOption } from '@/constants/countries';

// Deliberately in-memory only — nothing is persisted to localStorage/cookies. A full page
// reload (or a fresh tab) always starts with no country selected, so the "Select your Country"
// modal is shown again. The selection only survives client-side navigation within the same
// session (e.g. /courses -> a course's details page).
interface CountryContextValue {
  country: CountryOption | null;
  setCountry: (country: CountryOption | null) => void;
  openCountryModal: (mode: 'ONE_ON_ONE' | 'GROUP', onSelected?: (country: CountryOption) => void) => void;
}

const CountryContext = createContext<CountryContextValue | null>(null);

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountry] = useState<CountryOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'ONE_ON_ONE' | 'GROUP'>('ONE_ON_ONE');
  const onSelectedRef = useRef<((country: CountryOption) => void) | undefined>(undefined);

  const openCountryModal = useCallback((mode: 'ONE_ON_ONE' | 'GROUP', onSelected?: (country: CountryOption) => void) => {
    setModalMode(mode);
    onSelectedRef.current = onSelected;
    setIsModalOpen(true);
  }, []);

  const handleSelect = (selected: CountryOption) => {
    setCountry(selected);
    setIsModalOpen(false);
    onSelectedRef.current?.(selected);
    onSelectedRef.current = undefined;
  };

  return (
    <CountryContext.Provider value={{ country, setCountry, openCountryModal }}>
      {children}
      <CountrySelectModal
        isOpen={isModalOpen}
        enrollmentMode={modalMode}
        onSelect={handleSelect}
        onClose={() => setIsModalOpen(false)}
      />
    </CountryContext.Provider>
  );
}

export function useCountrySelection() {
  const ctx = useContext(CountryContext);
  if (!ctx) {
    throw new Error('useCountrySelection must be used within a CountryProvider');
  }
  return ctx;
}
