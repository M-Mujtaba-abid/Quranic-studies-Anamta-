"use client";

import { motion } from "framer-motion";
import { Star, Users } from "lucide-react";
import Link from "next/link";

export interface TeacherCardProps {
  slug: string;
  name: string;
  photo: string;
  specialization: string;
  rating: number;
  students: number;
  languages: string[];
  bio: string;
}

export default function TeacherCard({
  slug, name, photo, specialization, rating, students, languages, bio,
}: TeacherCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface/40 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.6)]"
    >
      {/* Photo Wrapper */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={photo}
          alt={name}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-[0.22,1,0.36,1] group-hover:scale-105"
          loading="lazy"
        />
        {/* Deep translucent blending shadow lines for premium contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

        {/* Rating badge refined with sleek border alignment */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-gold/20 bg-surface/90 px-2.5 py-0.5 backdrop-blur-sm">
          <Star size={11} className="fill-gold text-gold" />
          <span className="font-display text-xs font-bold text-text">{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Info & Content Area */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <h3 className="font-display text-[16px] font-semibold tracking-tight text-text transition-colors duration-200 group-hover:text-gold">
            {name}
          </h3>
          <p className="mt-1 font-display text-xs font-medium text-gold/90">{specialization}</p>
          <p className="mt-3 text-xs leading-relaxed text-text-secondary line-clamp-2">{bio}</p>
        </div>

        {/* Middle Meta Info */}
        <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Users size={13} className="text-primary-light/70" />
            <span className="font-medium">{students.toLocaleString()} students</span>
          </div>
          <div className="flex gap-1.5">
            {languages.map((lang) => (
              <span
                key={lang}
                className="rounded-md border border-border/60 bg-border/20 px-2 py-0.5 font-display text-[10px] font-medium text-text-secondary transition-colors group-hover:border-primary/30"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* View Profile Action - Changed from solid gold break back to modern system action */}
        <Link
          href="/"
          className="mt-4 block w-full rounded-xl border border-primary/60 bg-primary/5 py-2.5 text-center font-display text-xs font-semibold text-text transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold"
        >
          View Profile
        </Link>
      </div>

      {/* Elite subtle line micro-indicator */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-gold transition-all duration-500 ease-[0.22,1,0.36,1] group-hover:w-full" />
    </motion.div>
  );
}