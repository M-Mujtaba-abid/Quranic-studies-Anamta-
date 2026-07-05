"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HandHeart, ArrowRight } from "lucide-react";

export default function SponsorCTA() {
  return (
    <section className="relative overflow-hidden bg-bg py-20">
      {/* Background image, matching the treatment used on /courses, /about, /contact */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Image
          src="/images/about/contact_bg.png"
          alt=""
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/60 to-bg" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-5 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
              <HandHeart size={22} className="text-gold" />
            </div>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-bold text-text">
            Give a Student the Gift of <span className="text-gold">Quran Education</span>
          </h3>

          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-text-secondary">
            Many deserving students cannot afford tuition on their own. Your Lillah, Sadaqah, or Zakat
            keeps their journey with the Quran alive — every contribution, big or small, changes a life.
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
