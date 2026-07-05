"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ayat = [
  {
    arabic: "وَإِنَّ اللَّهَ لَغَفُورٌ رَّحِيمٌ",
    translation: "And indeed Allah is Forgiving and Merciful.",
    reference: "Surah Al-Baqarah 2:286",
  },
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship comes ease.",
    reference: "Surah Ash-Sharh 94:6",
  },
  {
    arabic: "وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ",
    translation: "And Allah loves the doers of good.",
    reference: "Surah Al-Baqarah 2:195",
  },
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Indeed, with hardship comes ease.",
    reference: "Surah Ash-Sharh 94:5",
  },
  {
    arabic: "وَكُلًّا فَضَّلْنَا عَلَى الْعَالَمِينَ",
    translation: "And each We have preferred over the worlds.",
    reference: "Surah Al-Anbiya 21:73",
  },
  {
    arabic: "وَسَارِعُوا إِلَىٰ مَغْفِرَةٍ مِّن رَّبِّكُمْ",
    translation: "And hasten to forgiveness from your Lord.",
    reference: "Surah Al-Imran 3:133",
  },
];

const ROTATION_DELAY = 14000;
const FADE_DURATION = 2.2;

export function AyatRotator() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

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

  useEffect(() => {
    if (reducedMotion) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % ayat.length);
    }, ROTATION_DELAY);

    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  const activeAyat = useMemo(() => ayat[index], [index]);

  const content = (
    <div className="flex min-w-0 flex-wrap items-center justify-center gap-2 text-center text-[10px] leading-5 text-white/90 sm:gap-3 sm:text-[11px]">
      <span className="font-display uppercase tracking-[0.24em] text-white/90">
        {activeAyat.reference}
      </span>
      <span className="hidden text-white/90 sm:inline">•</span>
      <span dir="rtl" className="font-[Cairo,serif] text-white/90">
        {activeAyat.arabic}
      </span>
      <span className="hidden text-white/90 sm:inline">•</span>
      <span className="text-white/90">{activeAyat.translation}</span>
    </div>
  );

  if (reducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none relative z-[2] flex w-full shrink-0 items-center justify-center border-b border-white/5 bg-black/20 px-4 py-2 backdrop-blur-sm sm:px-6"
      >
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
        <motion.div
          key={activeAyat.reference}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: FADE_DURATION, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
