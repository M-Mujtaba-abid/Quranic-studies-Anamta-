'use client';

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HelpCircle, AlertCircle, Calendar, X, Globe } from 'lucide-react';
import { CountrySelectModal } from '@/components/enrollment/CountrySelectModal';
import { COUNTRIES, type CountryOption, LOCAL_COUNTRY } from '@/constants/countries';

interface CountryContextValue {
  country: CountryOption | null;
  setCountry: (country: CountryOption | null) => void;
  openCountryModal: (mode: 'ONE_ON_ONE' | 'GROUP', onSelected?: (country: CountryOption) => void) => void;
  openModeSelectionModal: () => void;
  openTrialModal: () => void;
  openGroupAlertModal: () => void;
}

const CountryContext = createContext<CountryContextValue | null>(null);

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [country, setCountry] = useState<CountryOption | null>(null);

  // Modal visibility states
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const [isGroupAlertOpen, setIsGroupAlertOpen] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState<'ONE_ON_ONE' | 'GROUP'>('ONE_ON_ONE');
  const [trialCountryCode, setTrialCountryCode] = useState('us');

  const onSelectedRef = useRef<((country: CountryOption) => void) | undefined>(undefined);

  const openCountryModal = useCallback((mode: 'ONE_ON_ONE' | 'GROUP', onSelected?: (country: CountryOption) => void) => {
    setModalMode(mode);
    onSelectedRef.current = onSelected;
    setIsCountryModalOpen(true);
  }, []);

  const openModeSelectionModal = useCallback(() => {
    setIsModeModalOpen(true);
  }, []);

  const openGroupAlertModal = useCallback(() => {
    setIsGroupAlertOpen(true);
  }, []);

  const openTrialModal = useCallback(() => {
    setIsTrialModalOpen(true);
  }, []);

  const handleCountrySelect = (selected: CountryOption) => {
    setCountry(selected);
    setIsCountryModalOpen(false);
    onSelectedRef.current?.(selected);
    onSelectedRef.current = undefined;
  };

  const selectOneOnOne = () => {
    setIsModeModalOpen(false);
    openCountryModal('ONE_ON_ONE', (selected) => {
      router.push(`/courses?mode=ONE_ON_ONE`);
    });
  };

  const selectGroup = () => {
    setIsModeModalOpen(false);
    openGroupAlertModal();
  };

  const proceedAsPakistanGroup = () => {
    setCountry(LOCAL_COUNTRY);
    setIsGroupAlertOpen(false);
    router.push(`/courses?mode=GROUP`);
  };

  const proceedTrial = () => {
    const selected = COUNTRIES.find((c) => c.code === trialCountryCode) || LOCAL_COUNTRY;
    setCountry(selected);
    setIsTrialModalOpen(false);
    router.push(`/enrollement?mode=ONE_ON_ONE&trial=true`);
  };

  return (
    <CountryContext.Provider
      value={{
        country,
        setCountry,
        openCountryModal,
        openModeSelectionModal,
        openTrialModal,
        openGroupAlertModal,
      }}
    >
      {children}

      {/* 1. Country Selection Modal */}
      <CountrySelectModal
        isOpen={isCountryModalOpen}
        enrollmentMode={modalMode}
        onSelect={handleCountrySelect}
        onClose={() => setIsCountryModalOpen(false)}
      />

      {/* 2. Mode Selection Modal (Scenario 3) */}
      {isModeModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-scale-in p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-gold" />
                <h3 className="font-display font-bold text-lg text-text">Choose Class Type</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModeModalOpen(false)}
                className="p-1 rounded border border-border text-text-secondary hover:text-gold"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-text-secondary">
              Do you want to enroll in personalized 1-on-1 classes or peer group classes?
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={selectOneOnOne}
                className="w-full py-3.5 px-4 rounded-xl border border-border bg-bg text-sm font-semibold text-text hover:border-gold hover:text-gold transition-all cursor-pointer text-left"
              >
                <span className="block text-gold text-sm font-bold">1-on-1 Classes</span>
                <span className="block text-xs text-text-secondary mt-1">Personalized curriculum, all countries included.</span>
              </button>
              <button
                type="button"
                onClick={selectGroup}
                className="w-full py-3.5 px-4 rounded-xl border border-border bg-bg text-sm font-semibold text-text hover:border-gold hover:text-gold transition-all cursor-pointer text-left"
              >
                <span className="block text-gold text-sm font-bold">Group Classes</span>
                <span className="block text-xs text-text-secondary mt-1">Peer learning batches, Pakistan students only.</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Group Alert Modal (Scenario 1) */}
      {isGroupAlertOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-scale-in p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <AlertCircle className="h-5 w-5 text-gold" />
              <h3 className="font-display font-bold text-lg text-text">Group Classes Notice</h3>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Group classes are only available for Pakistani students.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsGroupAlertOpen(false);
                  if (typeof window !== 'undefined' && window.location.search.includes('mode=GROUP')) {
                    router.push('/courses?mode=ONE_ON_ONE');
                  }
                }}
                className="flex-1 py-2.5 px-4 rounded-xl border border-border text-xs font-semibold text-text-secondary hover:text-text cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={proceedAsPakistanGroup}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gold text-primary-dark text-xs font-semibold hover:bg-gold-light transition-all cursor-pointer"
              >
                Proceed as Pakistani Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Trial Notice Modal (Scenario 4) */}
      {isTrialModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-scale-in p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gold" />
                <h3 className="font-display font-bold text-lg text-text">Book a Free Trial</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTrialModalOpen(false)}
                className="p-1 rounded border border-border text-text-secondary hover:text-gold"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-gold leading-relaxed">
              Trial classes are only available for 1-1 classes, <span className='font-bold'>not for group classes.</span>
            </p>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Select Your Country
              </label>
              <div className="relative">
                <select
                  value={trialCountryCode}
                  onChange={(e) => setTrialCountryCode(e.target.value)}
                  className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsTrialModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-border text-xs font-semibold text-text-secondary hover:text-text cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={proceedTrial}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gold text-primary-dark text-xs font-semibold hover:bg-gold-light transition-all cursor-pointer"
              >
                Proceed to Trial Booking
              </button>
            </div>
          </div>
        </div>
      )}
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
