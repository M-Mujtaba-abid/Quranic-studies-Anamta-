"use client";

import { motion } from "framer-motion";
import { Star, Clock, Users, ChevronRight } from "lucide-react";
import Link from "next/link";

export interface CourseCardProps {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  students: number;
  duration: string;
  price: number;
  discountPrice?: number;
  teacher: string;
}

const levelColors: Record<string, string> = {
  Beginner: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  Intermediate: "text-gold border-gold/30 bg-gold/10",
  Advanced: "text-rose-400 border-rose-400/30 bg-rose-400/10",
};

export default function CourseCard({
  slug,
  title,
  description,
  image,
  category,
  level,
  rating,
  students,
  duration,
  price,
  discountPrice,
  teacher,
}: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01, boxShadow: "0 20px 48px -12px rgba(0,0,0,0.42)" }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow duration-300 hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.5)]"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />

        {/* Category badge */}
        <span className="absolute left-3 top-3 rounded-full bg-surface/80 px-3 py-1 text-[11px] font-medium tracking-wide text-gold backdrop-blur-sm">
          {category}
        </span>

        {/* Level badge */}
        <span className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-[11px] font-medium ${levelColors[level]}`}>
          {level}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1 text-xs text-text-secondary">with {teacher}</p>
        <h3 className="mb-2 font-display text-[15px] font-semibold leading-snug text-text line-clamp-2 group-hover:text-gold transition-colors duration-200">
          {title}
        </h3>
        <p className="mb-4 text-xs leading-relaxed text-text-secondary line-clamp-2">
          {description}
        </p>

        {/* Meta */}
        <div className="mb-4 flex items-center gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <Star size={12} className="fill-gold text-gold" />
            <span className="font-medium text-text">{rating}</span>
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} />
            {students.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {duration}
          </span>
        </div>

        {/* Divider */}
        <div className="mb-4 h-[1px] w-full bg-border" />

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {discountPrice ? (
              <>
                <span className="font-display text-lg font-semibold text-gold">
                  ${discountPrice}
                </span>
                <span className="text-xs text-text-secondary line-through">
                  ${price}
                </span>
              </>
            ) : (
              <span className="font-display text-lg font-semibold text-gold">
                ${price}
              </span>
            )}
          </div>
          <Link
            href={`/courses/${slug}`}
            className="flex items-center gap-1 rounded-full border border-gold/30 px-4 py-1.5 text-xs font-medium text-gold transition-all duration-200 hover:bg-gold hover:text-primary-dark"
          >
            Enroll <ChevronRight size={13} />
          </Link>
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-gold to-gold-light transition-all duration-500 group-hover:w-full" />
    </motion.div>
  );
}