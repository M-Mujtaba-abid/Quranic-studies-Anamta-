"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-bg py-24">
      {/* Premium Dark Core Mesh & Aura Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-surface/40 to-bg" />
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />

      {/* Symmetric horizontal separation border matching Regatta matrix */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-border/40 to-transparent" />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Centralized Icon Wrapper */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 backdrop-blur-sm shadow-[0_8px_20px_-6px_rgba(33,87,115,0.3)]">
              <BookOpen size={24} className="text-gold" strokeWidth={2} />
            </div>
          </div>

          <h2 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl lg:text-5xl">
            Start your Quran journey{" "}
            <span className="text-gold font-extrabold relative inline-block">
              today.
              <span className="absolute bottom-1 left-0 h-[2px] w-full bg-gold/20 rounded" />
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl font-display text-sm font-medium leading-relaxed text-text-secondary sm:text-base">
            Join 10,000+ students learning with certified teachers — your first
            trial class is completely free.
          </p>

          {/* Action Trigger Elements transformed to modern structural buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/enrollement"
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gold px-8 py-3.5 font-display text-xs font-semibold text-primary-dark shadow-[0_4px_24px_rgba(212,175,55,0.35)] transition-all duration-300 hover:scale-[1.02]"
            >
              Enroll Now
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/courses"
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary border border-primary-light/30 px-8 py-3.5 font-display text-xs font-semibold text-text shadow-[0_4px_24px_rgba(33,87,115,0.4)] transition-all duration-300 hover:scale-[1.02] hover:border-gold hover:text-gold"
            >
              Explore Courses
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <p className="mt-8 text-[11px] tracking-wide font-display font-medium text-text-secondary/80">
            No credit card required <span className="text-primary-light/40 mx-1.5">·</span> Cancel anytime <span className="text-primary-light/40 mx-1.5">·</span> Classes in English, Urdu & Arabic
          </p>
        </motion.div>
      </div>
    </section>
  );
}