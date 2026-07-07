"use client";

import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { AyatRotator } from "../common/AyatRotator";
import { useCountrySelection } from "@/providers/CountryProvider";

const slides = [
  {
    id: 1,
    image: "/Web banner 1.jpg.jpeg",
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
    image: "/Web banner 2.jpg.jpeg",
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
    image: "/Web banner 3.jpg.jpeg",
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
  const { openModeSelectionModal, openTrialModal } = useCountrySelection();
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
    <section
      // className="relative w-full overflow-hidden bg-bg
      //   h-[100svh] min-h-[560px]
      //   sm:h-[92vh] sm:min-h-[620px]"
      className="relative w-full overflow-hidden bg-bg
   h-[calc(100svh-72px)] min-h-[490px]
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
                style={{ filter: "brightness(0.55) saturate(0.85)" }}
                initial={{ scale: 1.04, opacity: 0.92 }}
                animate={{ scale: index === selectedIndex ? 1.08 : 1.02, opacity: index === selectedIndex ? 1 : 0.95 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Mobile gradient — bottom to top */}
              <div
                className="absolute inset-0 sm:hidden"
                style={{
                  background:
                    "linear-gradient(to top, #0a0f14 0%, #0a0f14cc 45%, #0a0f1466 75%, transparent 100%)",
                }}
              />

              {/* Desktop gradient — left to right */}
              <div
                className="absolute inset-0 hidden sm:block"
                style={{
                  background:
                    "linear-gradient(to right, #0a0f14 0%, #0a0f14cc 45%, #0a0f1444 75%, transparent 100%)",
                }}
              />
              {/* Desktop bottom fade */}
              <div
                className="absolute inset-0 hidden sm:block"
                style={{
                  background:
                    "linear-gradient(to top, #0a0f14 0%, transparent 40%)",
                }}
              />

              {/* Regatta blue vignette top-left */}
              <div
                className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full blur-[120px]"
                style={{ background: "rgba(33,87,115,0.25)" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Foreground: ticker + content stacked so they never overlap ── */}
      <div className="relative z-10 flex h-full flex-col">
        <AyatRotator />

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pt-6 sm:justify-center sm:px-6 lg:px-12">
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
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-medium tracking-wide text-sand backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-xs"
                  style={{
                    borderColor: "rgba(201,162,39,0.35)",
                    background: "rgba(33,87,115,0.35)",
                  }}
                >
                  <Star size={10} className="fill-gold text-gold" />
                  {active.badge}
                </span>
              </motion.div>

              {/* Heading */}
              <h1
                className="max-w-[15ch] font-display text-[1.55rem] font-semibold leading-[1.08] text-text sm:max-w-none sm:text-4xl sm:leading-[1.18] md:text-5xl lg:text-[3.4rem]"
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
                className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary sm:mt-5 sm:text-base lg:text-lg"
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
                <button
                  onClick={openModeSelectionModal}
                  className="w-full rounded-full bg-gradient-to-r from-gold to-gold-light px-6 py-3 text-center text-sm font-semibold text-primary-dark shadow-[0_4px_20px_-2px_rgba(201,162,39,0.45)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_6px_28px_-2px_rgba(201,162,39,0.65)] sm:w-auto sm:px-8 sm:py-3.5 cursor-pointer"
                >
                  Explore Courses
                </button>
                <button
                  onClick={openTrialModal}
                  className="w-full rounded-full bg-gradient-to-r from-gold to-gold-light px-6 py-3 text-center text-sm font-semibold text-primary-dark shadow-[0_4px_20px_-2px_rgba(201,162,39,0.45)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_6px_28px_-2px_rgba(201,162,39,0.65)] sm:w-auto sm:px-8 sm:py-3.5 cursor-pointer"
                >
                  Book a free trial class
                </button>
                {/* <Link
                href="/contact"
                className="w-full rounded-full border px-6 py-3 text-center text-sm font-semibold text-text backdrop-blur-sm transition-all duration-300 hover:text-gold sm:w-auto sm:px-8 sm:py-3.5"
                style={{
                  borderColor: "rgba(33,87,115,0.6)",
                  background: "rgba(33,87,115,0.2)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(201,162,39,0.5)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(33,87,115,0.6)")
                }
              >
                Book a Free Trial
              </Link> */}
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mt-6 flex flex-wrap items-start gap-3 sm:mt-10 sm:gap-6"
              >
                {active.stats.map((stat, i) => (
                  <div key={i} className="flex min-w-[72px] flex-col">
                    <span className="font-display text-lg font-semibold text-gold sm:text-2xl">
                      {stat.value}
                    </span>
                    <span className="text-[10px] text-text-secondary sm:text-xs">
                      {stat.label}
                    </span>
                  </div>
                ))}
                <div
                  className="hidden h-7 w-[1px] self-center sm:ml-2 sm:block sm:h-8"
                  style={{ background: "rgba(33,87,115,0.6)" }}
                />
                <p className="max-w-[9rem] text-[10px] text-text-secondary sm:max-w-none sm:text-xs">
                  Join a growing{" "}
                  <br className="hidden sm:block" />
                  community of learners
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom control row: prev / dots / next + counter — in normal flow so it can never overlap the text above ── */}
        <div className="flex w-full items-center justify-between gap-4 px-5 pb-4 pt-4 sm:px-8 sm:pb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={scrollPrev}
              aria-label="Previous"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white backdrop-blur-md transition-all duration-300 hover:text-gold sm:h-9 sm:w-9"
              style={{ border: "1px solid rgba(33,87,115,0.5)", background: "rgba(33,87,115,0.25)" }}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Progress dots */}
            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => scrollTo(index)}
                  aria-label={`Slide ${index + 1}`}
                  className="relative h-[3px] w-6 overflow-hidden rounded-full transition-all duration-300 sm:w-12"
                  style={{ background: "rgba(33,87,115,0.4)" }}
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

            <button
              onClick={scrollNext}
              aria-label="Next"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white backdrop-blur-md transition-all duration-300 hover:text-gold sm:h-9 sm:w-9"
              style={{ border: "1px solid rgba(33,87,115,0.5)", background: "rgba(33,87,115,0.25)" }}
            >
              <ChevronRight size={16} />
            </button>
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
      </div>
    </section>
  );
}