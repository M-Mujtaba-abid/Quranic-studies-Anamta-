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
    <section className="relative overflow-hidden border-y border-border/60 bg-surface/80 backdrop-blur-sm">
      {/* Top and Bottom ambient subtle lines aligning with our navy theme */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-3 lg:grid-cols-6 divide-x-0 divide-y-0 lg:divide-x lg:divide-border/40">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="group flex flex-col items-center gap-2 text-center lg:px-2 first:border-none"
            >
              {/* Icon container with Regatta Blue base and subtle Gold hover shift */}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 transition-all duration-300 group-hover:scale-105 group-hover:border-gold/50 group-hover:bg-primary/20">
                <stat.icon 
                  size={18} 
                  className="text-text-secondary transition-colors duration-300 group-hover:text-gold" 
                  strokeWidth={1.75} 
                />
              </div>

              {/* Value - bold and high contrast */}
              <span className="font-display text-xl font-bold text-text sm:text-2xl tracking-wide group-hover:text-gold transition-colors duration-300">
                {stat.value}
              </span>

              {/* Label - clean readability */}
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary/80 group-hover:text-text-secondary transition-colors duration-300">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}