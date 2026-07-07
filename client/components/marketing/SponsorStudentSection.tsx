"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HandHeart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function SponsorStudentSection() {
  return (
    <section className="relative overflow-hidden bg-bg py-10 border-t border-border/40">
      {/* Dynamic ambient background aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Image
          src="/images/about/contact_bg.png"
          alt=""
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/60 to-bg" />
      </div>


      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-surface/50 border border-gold/20 rounded-3xl p-8 md:p-12 shadow-xl backdrop-blur-sm"
        >
          {/* Section Icon Badge */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 shadow-[0_8px_20px_-6px_rgba(212,175,55,0.25)]">
              <HandHeart size={26} className="text-gold" />
            </div>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-text mb-4">
            Sponsor a <span className="text-gold">Student</span>
          </h2>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-text-secondary leading-relaxed mb-8">
            Many talented and passionate students are eager to learn the Quran but lack the financial means to cover tuition. By sponsoring a student's education, you can help fund their studies and keep their journey with the Quran alive. Every contribution makes a lasting difference.
          </p>

          <div className="mt-8">
            <Link
              href="/sponsor-a-student"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-8 py-3.5 font-display text-xs font-semibold text-primary-dark shadow-[0_4px_24px_rgba(212,175,55,0.35)] transition-all duration-300 hover:scale-[1.02]"
            >
              Sponsor a Student
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
