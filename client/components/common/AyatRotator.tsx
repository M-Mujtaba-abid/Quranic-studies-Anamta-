"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AyatData {
  arabic: string;
  translation: string;
  reference: string;
}

const DATE_DISPLAY_DURATION = 3000;
const AYAT_DISPLAY_DURATION = 8000;
const FADE_DURATION = 2;

const fallbackAyat: AyatData = {
  arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
  translation: "For indeed, with hardship comes ease.",
  reference: "Surah Ash-Sharh 94:6",
};

const getHijriDate = () => {
  try {
    const formatter = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    let result = formatter.format(new Date()); 

    // Hybrid fallback correction:
    // If the browser lacks full ICU support, it might fallback to Gregorian month names 
    // (January-December) and era names (like BC or AD) instead of Islamic ones.
    const gregorianMonths = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const hijriMonths = [
      'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
      'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'
    ];

    let replaced = false;
    for (let i = 0; i < 12; i++) {
      const regex = new RegExp(gregorianMonths[i], 'i');
      if (regex.test(result)) {
        result = result.replace(regex, hijriMonths[i]);
        replaced = true;
        break;
      }
    }

    // Clean up BC/AD era markers and force AH if a fallback occurred
    if (replaced || /\b(BC|AD|CE|BCE)\b/i.test(result)) {
      result = result.replace(/\b(BC|AD|CE|BCE)\b/gi, 'AH');
      if (!result.includes('AH') && !result.includes('ah')) {
        result += ' AH';
      }
    }

    return result;
  } catch (error) {
    // If formatting fails entirely, perform a simple manual calculation
    try {
      const date = new Date();
      let gY = date.getFullYear();
      let gM = date.getMonth();
      let gD = date.getDate();
      if (gM < 2) {
        gY -= 1;
        gM += 12;
      }
      const a = Math.floor(gY / 100);
      const b = 2 - a + Math.floor(a / 4);
      const jd = Math.floor(365.25 * (gY + 4716)) + Math.floor(30.6001 * (gM + 2)) + gD + b - 1524;
      const relativeDays = jd - 1948440 + 1;
      const cycle = 10631;
      const cycleYears = 30;
      const cyclesCount = Math.floor(relativeDays / cycle);
      let remainingDays = relativeDays % cycle;
      const leapYears = [false, false, true, false, false, true, false, true, false, false, true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false, true, false, false, true];
      let hY = cyclesCount * cycleYears;
      for (let year = 0; year < 30; year++) {
        const yearDays = leapYears[year] ? 355 : 354;
        if (remainingDays < yearDays) break;
        remainingDays -= yearDays;
        hY++;
      }
      hY += 1;
      const monthDays = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
      let hM = 0;
      for (let m = 0; m < 12; m++) {
        let daysInMonth = monthDays[m];
        if (m === 11 && leapYears[(hY - 1) % 30]) daysInMonth = 30;
        if (remainingDays < daysInMonth) break;
        remainingDays -= daysInMonth;
        hM++;
      }
      const hD = Math.floor(remainingDays) + 1;
      const hijriMonths = [
        'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
        'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
        'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'
      ];
      return `${hijriMonths[hM]} ${hD}, ${hY} AH`;
    } catch (e) {
      return 'Muharram 23, 1448 AH'; // absolute fallback
    }
  }
};

export function AyatRotator() {
  const [activeAyat, setActiveAyat] = useState<AyatData>(fallbackAyat);
  const [cachedAyat, setCachedAyat] = useState<AyatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [contentType, setContentType] = useState<'date' | 'ayat'>('ayat');

  const cachedAyatRef = useRef<AyatData | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  // Sync ref with cachedAyat state
  useEffect(() => {
    cachedAyatRef.current = cachedAyat;
  }, [cachedAyat]);

  const fetchSingleAyah = async (): Promise<AyatData | null> => {
    if (isFetchingRef.current) return null;
    isFetchingRef.current = true;
    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        const response = await fetch(
          `https://api.alquran.cloud/v1/ayah/random/editions/quran-uthmani,en.sahih?t=${Date.now()}-${attempts}`
        );
        const result = await response.json();

        if (result.code === 200 && result.data.length === 2) {
          const arabicData = result.data[0];
          const translationData = result.data[1];

          if (arabicData.text.length <= 30 && translationData.text.length <= 80) {
            isFetchingRef.current = false;
            return {
              arabic: arabicData.text,
              translation: translationData.text,
              reference: `${translationData.surah.englishName} ${translationData.surah.number}:${translationData.numberInSurah}`,
            };
          }
        }
      } catch (error) {
        console.error("Error fetching Ayah:", error);
      }
      attempts++;
    }
    isFetchingRef.current = false;
    return null;
  };

  // 1. Accessibility preferences
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updatePreference);
      return () => mediaQuery.removeEventListener("change", updatePreference);
    }
    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  // Set default view to ayat if reduced motion is enabled
  useEffect(() => {
    if (reducedMotion) {
      setContentType('ayat');
    }
  }, [reducedMotion]);

  // 2. Fetch first Ayah and pre-load second Ayah on Mount
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const ayah1 = await fetchSingleAyah();
      if (!isMounted) return;

      if (ayah1) {
        setActiveAyat(ayah1);
      } else {
        setActiveAyat(fallbackAyat);
      }
      setLoading(false);

      const ayah2 = await fetchSingleAyah();
      if (!isMounted) return;

      if (ayah2) {
        setCachedAyat(ayah2);
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Fill the cache in the background while an Ayah is being displayed
  useEffect(() => {
    if (loading || reducedMotion) return;

    let isMounted = true;
    if (contentType === 'ayat' && !cachedAyat) {
      const fillCache = async () => {
        const nextAyah = await fetchSingleAyah();
        if (!isMounted) return;
        if (nextAyah) {
          setCachedAyat(nextAyah);
        } else {
          setCachedAyat(activeAyat || fallbackAyat);
        }
      };
      fillCache();
    }

    return () => {
      isMounted = false;
    };
  }, [contentType, cachedAyat, loading, reducedMotion, activeAyat]);

  // 4. Sequential alternation loop between Ayat and Date
  useEffect(() => {
    if (reducedMotion || loading) return;

    let isCancelled = false;
    let timerId: NodeJS.Timeout;

    const runTransition = async () => {
      const displayDuration = contentType === 'ayat' ? AYAT_DISPLAY_DURATION : DATE_DISPLAY_DURATION;

      await new Promise((resolve) => {
        timerId = setTimeout(resolve, displayDuration);
      });
      if (isCancelled) return;

      setIsVisible(false);

      const nextType = contentType === 'ayat' ? 'date' : 'ayat';

      const delayPromise = new Promise((resolve) => setTimeout(resolve, FADE_DURATION * 1000));
      await delayPromise;
      if (isCancelled) return;

      if (nextType === 'ayat') {
        const nextAyah = cachedAyatRef.current;
        if (nextAyah) {
          setActiveAyat(nextAyah);
          setCachedAyat(null);
        }
      }

      setContentType(nextType);
      setRenderKey((prev) => prev + 1);
      setIsVisible(true);
    };

    runTransition();

    return () => {
      isCancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [contentType, reducedMotion, loading]);

  const content = (
    <div className="flex min-w-0 flex-wrap items-center justify-center gap-1.5 text-center text-[7.5px] leading-5 text-white/90 sm:flex-nowrap sm:gap-3 sm:text-[11px]">
      {contentType === 'date' ? (
        <span className="font-semibold text-gold uppercase tracking-[0.15em] whitespace-normal">
          {getHijriDate()}
        </span>
      ) : (
        <>
          <span className="font-display uppercase tracking-[0.24em] text-white/90 whitespace-normal">
            {loading ? "Loading..." : activeAyat.reference}
          </span>
          {!loading && (
            <>
              <span className="text-white/90 shrink-0">•</span>
              <span dir="rtl" className="font-[Cairo,serif] text-white/90 whitespace-normal break-words max-w-full">
                {activeAyat.arabic}
              </span>
              <span className="text-white/90 shrink-0">•</span>
              <span className="text-white/90 whitespace-normal break-words max-w-full">
                {activeAyat.translation}
              </span>
            </>
          )}
        </>
      )}
    </div>
  );

  if (reducedMotion) {
    return (
      <div className="pointer-events-none relative z-[2] flex w-full shrink-0 items-center justify-center border-b border-white/5 bg-black/20 px-4 py-2 backdrop-blur-sm sm:px-6">
        {content}
      </div>
    );
  }

  return (
    <div
      aria-live="off"
      aria-hidden="true"
      className="pointer-events-none relative z-[2] flex w-full shrink-0 items-center justify-center border-b border-white/5 bg-black/20 px-4 py-2 backdrop-blur-sm sm:px-6"
    >
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={renderKey}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: FADE_DURATION, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex items-center justify-center"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}