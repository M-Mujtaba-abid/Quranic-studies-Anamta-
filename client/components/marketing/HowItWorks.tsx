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
    color: "text-emerald-400",
    border: "border-emerald-400/25",
    bg: "bg-emerald-400/10",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Book a Free Trial",
    description: "Schedule a free 30-minute trial class with your chosen teacher at a time that suits you.",
    color: "text-gold",
    border: "border-gold/25",
    bg: "bg-gold/10",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Start Learning",
    description: "Enroll, pay securely, and begin your personalized Quran journey from lesson one.",
    color: "text-sky-400",
    border: "border-sky-400/25",
    bg: "bg-sky-400/10",
  },
  {
    number: "04",
    icon: Award,
    title: "Earn Your Certificate",
    description: "Complete the course, track your progress, and receive a certified completion certificate.",
    color: "text-violet-400",
    border: "border-violet-400/25",
    bg: "bg-violet-400/10",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-bg py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,162,39,0.04)_0%,_transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <SectionHeading
          badge="How It Works"
          title="Your journey to the Quran in "
          highlight="4 simple steps"
          subtitle="From choosing a course to earning your certificate — we've made every step simple and supported."
          center
        />

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line desktop */}
          <div className="absolute left-0 right-0 top-16 hidden h-[1px] bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Step number */}
              <div className="relative mb-6">
                <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border ${step.border} ${step.bg} transition-all duration-300 group-hover:scale-110`}>
                  <step.icon size={26} className={step.color} strokeWidth={1.5} />
                </div>
                <span className={`absolute -right-2 -top-2 font-display text-[11px] font-semibold ${step.color}`}>
                  {step.number}
                </span>
              </div>

              <h3 className="mb-3 font-display text-[16px] font-semibold text-text">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}