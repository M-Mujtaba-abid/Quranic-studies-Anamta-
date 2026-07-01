"use client";

import { motion } from "framer-motion";
import { Search, CalendarCheck, BookOpen, Award } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Choose a Course",
    description: "Browse our programs — Tajweed, Hifz, Arabic, Tafsir, and Kids. Filter by level or teacher.",
    color: "text-text",
    border: "border-primary/30 group-hover:border-primary/60",
    bg: "bg-primary/10",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Book a Free Trial",
    description: "Schedule a free 30-minute trial class with your chosen teacher at a time that suits you.",
    color: "text-gold",
    border: "border-gold/30 group-hover:border-gold/60",
    bg: "bg-gold/10",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Start Learning",
    description: "Enroll, pay securely, and begin your personalized Quran journey from lesson one.",
    color: "text-text",
    border: "border-primary/30 group-hover:border-primary/60",
    bg: "bg-primary/10",
  },
  {
    number: "04",
    icon: Award,
    title: "Earn Your Certificate",
    description: "Complete the course, track your progress, and receive a certified completion certificate.",
    color: "text-gold",
    border: "border-gold/30 group-hover:border-gold/60",
    bg: "bg-gold/10",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-bg py-24">
      {/* Ambient background glow optimized for dark navy base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(33,87,115,0.08)_0%,_transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <SectionHeading
          badge="How It Works"
          title="Your journey to the Quran in "
          highlight="4 simple steps"
          subtitle="From choosing a course to earning your certificate — we've made every step simple and supported."
          center
        />

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Enhanced Connector line desktop using theme border color variable */}
          <div className="absolute left-0 right-0 top-8 hidden h-[1px] bg-gradient-to-r from-transparent via-border/60 to-transparent lg:block" />

          {/* Vertical layout alignment fixing the line crossover view */}
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Step box wrapper */}
              <div className="relative mb-6">
                <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border bg-bg/90 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 ${step.border} ${step.bg}`}>
                  <step.icon size={24} className={step.color} strokeWidth={1.5} />
                </div>
                {/* Clean counter badge */}
                <span className={`absolute -right-2 -top-2 font-display text-[11px] font-bold tracking-wider ${step.color === "text-gold" ? "text-gold-light" : "text-text-secondary"}`}>
                  {step.number}
                </span>
              </div>

              {/* Step Title - High contrast styling */}
              <h3 className="mb-2 font-display text-[16px] font-semibold text-text transition-colors duration-300 group-hover:text-gold">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-sm leading-relaxed text-text-secondary max-w-[240px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}