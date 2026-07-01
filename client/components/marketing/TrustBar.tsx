"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Globe, Star, Award, Clock } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Students Enrolled" },
  { icon: BookOpen, value: "50+", label: "Certified Teachers" },
  { icon: Globe, value: "30+", label: "Countries" },
  { icon: Star, value: "4.9★", label: "Average Rating" },
  { icon: Award, value: "100%", label: "Ijazah Certified" },
  { icon: Clock, value: "24/7", label: "Support Available" },
];

export default function TrustBar() {
  return (
    <section className="relative overflow-hidden border-y border-gold/15 bg-surface">
      {/* gold glow top */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group flex flex-col items-center gap-2 text-center"
            >
              {/* icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 bg-gold/5 transition-all duration-300 group-hover:border-gold/50 group-hover:bg-gold/10">
                <stat.icon size={18} className="text-gold" strokeWidth={1.5} />
              </div>

              {/* value */}
              <span className="font-display text-xl font-semibold text-text sm:text-2xl">
                {stat.value}
              </span>

              {/* label */}
              <span className="text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}