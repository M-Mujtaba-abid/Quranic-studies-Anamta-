"use client";

import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1800&q=85&fit=crop",
    badge: "Trusted by 10,000+ students worldwide",
    title: "Learn the Quran with certified teachers, from anywhere.",
    highlight: "certified teachers",
    text: "Tajweed, Hifz, Tafsir and Arabic — structured courses taught one-on-one, on a schedule that works for you.",
    stats: [
      { value: "10K+", label: "Students" },
      { value: "50+", label: "Teachers" },
      { value: "30+", label: "Countries" },
    ],
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=1800&q=85&fit=crop",
    badge: "Live, one-on-one online classes",
    title: "A personal teacher, a curriculum built around you.",
    highlight: "built around you",
    text: "No crowded classrooms. Every lesson is paced to your level, your goals, and your schedule.",
    stats: [
      { value: "4.9★", label: "Avg Rating" },
      { value: "100%", label: "Certified" },
      { value: "24/7", label: "Support" },
    ],
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1800&q=85&fit=crop",
    badge: "Join students from 30+ countries",
    title: "From your first letter to a lifelong connection with the Quran.",
    highlight: "lifelong connection",
    text: "Structured pathways for kids and adults alike — start where you are, grow at your own pace.",
    stats: [
      { value: "5+", label: "Programs" },
      { value: "Kids", label: "& Adults" },
      { value: "Free", label: "Trial" },
    ],
  },
];

const AUTOPLAY_DELAY = 6000;

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );
  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  const active = slides[selectedIndex];

  return (
    <section className="relative w-full overflow-hidden bg-bg
      h-[100svh] min-h-[560px]
      sm:h-[92vh] sm:min-h-[620px]"
    >
      {/* ── Slider track ── */}
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative h-full min-w-0 flex-[0_0_100%] overflow-hidden"
            >
              <motion.img
                src={slide.image}
                alt={slide.badge}
                className="h-full w-full object-cover object-center"
                initial={{ scale: 1 }}
                animate={{ scale: index === selectedIndex ? 1.1 : 1 }}
                transition={{
                  duration: AUTOPLAY_DELAY / 1000 + 1,
                  ease: "linear",
                }}
              />
              {/* Mobile: stronger gradient from bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/40 sm:bg-none" />
              {/* Desktop: side gradient */}
              <div className="absolute inset-0 hidden bg-gradient-to-r from-bg via-bg/80 to-bg/10 sm:block" />
              <div className="absolute inset-0 hidden bg-gradient-to-t from-bg via-bg/30 to-transparent sm:block" />
              {/* gold vignette */}
              <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gold/10 blur-[100px]" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Overlay content ── */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-5 sm:px-6 lg:px-12
        justify-end pb-24
        sm:justify-center sm:pb-0"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4 sm:mb-6"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-surface/50 px-3 py-1 text-[11px] font-medium tracking-wide text-sand backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-xs">
                <Star size={10} className="fill-gold text-gold" />
                {active.badge}
              </span>
            </motion.div>

            {/* Heading */}
            <h1 className="font-display font-semibold leading-[1.18] text-text
              text-[1.75rem]
              sm:text-4xl
              md:text-5xl
              lg:text-[3.4rem]"
            >
              {active.title.split(active.highlight)[0]}
              <span className="relative inline-block text-gold">
                {active.highlight}
                <motion.span
                  key={`underline-${active.id}`}
                  className="absolute -bottom-0.5 left-0 h-[2px] bg-gradient-to-r from-gold to-gold-light"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
              </span>
              {active.title.split(active.highlight)[1]}
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-3 text-sm leading-relaxed text-text-secondary sm:mt-5 sm:text-base lg:text-lg"
            >
              {active.text}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap"
            >
              <Link
                href="/courses"
                className="rounded-full bg-gradient-to-r from-gold to-gold-light px-6 py-3 text-center text-sm font-semibold text-primary-dark shadow-[0_4px_20px_-2px_rgba(201,162,39,0.5)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_6px_28px_-2px_rgba(201,162,39,0.7)] sm:px-8 sm:py-3.5"
              >
                Explore Courses
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-center text-sm font-semibold text-text backdrop-blur-sm transition-all duration-300 hover:border-gold/60 hover:text-gold sm:px-8 sm:py-3.5"
              >
                Book a Free Trial
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-6 flex items-center gap-4 sm:mt-10 sm:gap-6"
            >
              {active.stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-display text-lg font-semibold text-gold sm:text-2xl">
                    {stat.value}
                  </span>
                  <span className="text-[10px] text-text-secondary sm:text-xs">
                    {stat.label}
                  </span>
                </div>
              ))}
              <div className="ml-1 h-7 w-[1px] bg-border sm:ml-2 sm:h-8" />
              <p className="text-[10px] text-text-secondary sm:text-xs">
                Join a growing <br className="hidden sm:block" />
                community of learners
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Prev / Next — desktop only ── */}
      <button
        onClick={scrollPrev}
        aria-label="Previous"
        className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 p-2.5 text-white backdrop-blur-md transition-all duration-300 hover:border-gold/60 hover:text-gold md:flex lg:left-6 lg:p-3"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next"
        className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 p-2.5 text-white backdrop-blur-md transition-all duration-300 hover:border-gold/60 hover:text-gold md:flex lg:right-6 lg:p-3"
      >
        <ChevronRight size={18} />
      </button>

      {/* ── Bottom bar: dots + counter ── */}
      <div className="absolute bottom-5 z-10 flex w-full items-center justify-between px-5 sm:bottom-8 sm:px-8">
        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => scrollTo(index)}
              aria-label={`Slide ${index + 1}`}
              className="relative h-[3px] overflow-hidden rounded-full bg-white/20 transition-all duration-300
                w-8 sm:w-12"
            >
              {index === selectedIndex && (
                <motion.span
                  key={`p-${active.id}`}
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold to-gold-light"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: AUTOPLAY_DELAY / 1000,
                    ease: "linear",
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Slide counter */}
        <div className="flex items-center gap-1">
          <span className="font-display text-base font-medium text-gold sm:text-lg">
            0{selectedIndex + 1}
          </span>
          <span className="text-[10px] text-text-secondary/50">/</span>
          <span className="text-[11px] text-text-secondary">
            0{slides.length}
          </span>
        </div>
      </div>
    </section>
  );
}