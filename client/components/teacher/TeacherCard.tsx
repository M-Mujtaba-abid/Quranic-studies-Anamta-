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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface transition-shadow duration-300 hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.5)]"
    >
      {/* Photo */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={photo}
          alt={name}
          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />

        {/* Rating badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-gold/30 bg-surface/80 px-3 py-1 backdrop-blur-sm">
          <Star size={11} className="fill-gold text-gold" />
          <span className="text-xs font-medium text-text">{rating}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-display text-[16px] font-semibold text-text group-hover:text-gold transition-colors duration-200">
          {name}
        </h3>
        <p className="mt-0.5 text-xs font-medium text-gold">{specialization}</p>
        <p className="mt-3 text-xs leading-relaxed text-text-secondary line-clamp-2">{bio}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <Users size={12} />
            <span>{students.toLocaleString()} students</span>
          </div>
          <div className="flex gap-1">
            {languages.map((lang) => (
              <span key={lang} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-text-secondary">
                {lang}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={`/teachers/${slug}`}
          className="mt-4 block rounded-full border border-gold/30 py-2 text-center text-xs font-medium text-gold transition-all duration-200 hover:bg-gold hover:text-primary-dark"
        >
          View Profile
        </Link>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-gold to-gold-light transition-all duration-500 group-hover:w-full" />
    </motion.div>
  );
}