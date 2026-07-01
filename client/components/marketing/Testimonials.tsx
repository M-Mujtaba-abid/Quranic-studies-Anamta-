"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const testimonials = [
  {
    name: "Sarah Johnson",
    country: "🇺🇸 USA",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80&fit=crop&crop=face",
    rating: 5,
    course: "Tajweed for Beginners",
    review: "I tried many online platforms before but nothing came close. My teacher is incredibly patient and my Quran recitation has improved beyond what I thought possible in just 3 months.",
  },
  {
    name: "Ahmad Karimi",
    country: "🇨🇦 Canada",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80&fit=crop&crop=face",
    rating: 5,
    course: "Hifz Program",
    review: "My son started the kids program and Masha'Allah he's memorized 5 surahs in 2 months. The female teacher makes him so comfortable. Best investment we've made for his deen.",
  },
  {
    name: "Fatimah Al-Sayed",
    country: "🇬🇧 UK",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&fit=crop&crop=face",
    rating: 5,
    course: "Quranic Arabic",
    review: "Finally I understand what I'm reading in Salah. The Quranic Arabic course changed my relationship with the Quran completely. I cry in prayer now because I know what I'm saying.",
  },
  {
    name: "Omar Sheikh",
    country: "🇦🇺 Australia",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80&fit=crop&crop=face",
    rating: 5,
    course: "Advanced Tajweed",
    review: "Sheikh Ahmad is a rare gem. His knowledge is deep and his teaching is structured. I'm preparing for my Ijazah and couldn't imagine doing this journey with anyone else.",
  },
  {
    name: "Zainab Hussain",
    country: "🇿🇦 South Africa",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80&fit=crop&crop=face",
    rating: 5,
    course: "Kids Quran",
    review: "As a busy mother of three, the flexible scheduling is a lifesaver. My children look forward to their Quran class every day — something I never thought I'd say!",
  },
  {
    name: "Yusuf Rahman",
    country: "🇲🇾 Malaysia",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&q=80&fit=crop&crop=face",
    rating: 5,
    course: "Tafsir Juz Amma",
    review: "The Tafsir course opened my eyes. I knew the words but now I understand the wisdom. Dr. Bilal's explanations are clear, deep, and always connect back to our daily lives.",
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-bg py-24">
      {/* High-end ambient background glow synced with Regatta profile */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(33,87,115,0.12)_0%,transparent_80%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <SectionHeading
          badge="Student Reviews"
          title="Words from our "
          highlight="students worldwide"
          subtitle="Real stories from real students — from beginners who couldn't read Arabic to those now teaching others."
          center
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-surface/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.5)]"
            >
              <div>
                {/* Header layout for Quote and Stars alignment */}
                <div className="flex items-center justify-between mb-4">
                  <Quote size={28} className="text-primary-light/20 transform -scale-x-100" />
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-gold text-gold" />
                    ))}
                  </div>
                </div>

                {/* Review Paragraph */}
                <p className="mb-6 text-sm leading-relaxed text-text-secondary italic">
                  "{t.review}"
                </p>
              </div>

              {/* Bottom Fixed Meta Info Area */}
              <div>
                {/* Course badge with Regatta Blue base backdrop and gold text highlights */}
                <span className="mb-4 inline-block rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1 font-display text-[10px] font-semibold text-text group-hover:border-gold/40 group-hover:text-gold transition-colors duration-300">
                  {t.course}
                </span>

                {/* Author Details */}
                <div className="flex items-center gap-3 border-t border-border/30 pt-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/40 group-hover:ring-gold/50 transition-all duration-300"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-sm font-semibold text-text group-hover:text-gold transition-colors duration-200">{t.name}</p>
                    <p className="font-display text-[11px] font-medium text-text-secondary">{t.country}</p>
                  </div>
                </div>
              </div>

              {/* Micro bottom layout strip using the core colors */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-gold transition-all duration-500 ease-[0.22,1,0.36,1] group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}