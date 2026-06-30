"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-surface py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-bg" />
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-gold/10 blur-[100px]" />
      <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />

      {/* Top gold line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10">
              <BookOpen size={28} className="text-gold" strokeWidth={1.5} />
            </div>
          </div>

          <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl lg:text-5xl">
            Start your Quran journey{" "}
            <span className="text-gold">today.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base text-text-secondary sm:text-lg">
            Join 10,000+ students learning with certified teachers — your first
            trial class is completely free.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/courses"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-light px-8 py-3.5 text-sm font-semibold text-primary-dark shadow-[0_4px_20px_-4px_rgba(201,162,39,0.5)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_6px_28px_-4px_rgba(201,162,39,0.7)]"
            >
              Explore Courses <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-text-secondary/30 px-8 py-3.5 text-sm font-semibold text-text transition-all duration-300 hover:border-gold hover:text-gold"
            >
              Book Free Trial
            </Link>
          </div>

          <p className="mt-6 text-xs text-text-secondary">
            No credit card required · Cancel anytime · Classes in English, Urdu & Arabic
          </p>
        </motion.div>
      </div>
    </section>
  );
}