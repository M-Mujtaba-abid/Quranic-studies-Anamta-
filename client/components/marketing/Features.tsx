"use client";

import { motion } from "framer-motion";
import {
  Video,
  Award,
  Clock,
  BarChart3,
  Globe,
  Heart,
} from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const features = [
  {
    icon: Video,
    title: "Live 1-on-1 Classes",
    description:
      "Every session is personal — your teacher, your pace, your schedule. No recordings, no crowds.",
    gradient: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Award,
    title: "Ijazah-Certified Teachers",
    description:
      "All our teachers hold an unbroken chain of Quran certification going back to the Prophet ﷺ.",
    gradient: "from-gold/10 to-gold/5",
    border: "border-gold/20",
    iconColor: "text-gold",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description:
      "Morning, evening, or weekend — book classes that fit your life, not the other way around.",
    gradient: "from-sky-500/10 to-sky-500/5",
    border: "border-sky-500/20",
    iconColor: "text-sky-400",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Track every lesson, milestone, and achievement through your personal student dashboard.",
    gradient: "from-violet-500/10 to-violet-500/5",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    icon: Globe,
    title: "Learn from Anywhere",
    description:
      "Students from 30+ countries learn with us daily. All you need is a device and an internet connection.",
    gradient: "from-rose-500/10 to-rose-500/5",
    border: "border-rose-500/20",
    iconColor: "text-rose-400",
  },
  {
    icon: Heart,
    title: "Female Teachers Available",
    description:
      "Dedicated female Quran teachers available for sisters and children who prefer a comfortable environment.",
    gradient: "from-pink-500/10 to-pink-500/5",
    border: "border-pink-500/20",
    iconColor: "text-pink-400",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Features() {
  return (
    <section className="relative overflow-hidden bg-bg py-24">
      {/* background decoration */}
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gold/5 blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          badge="Why Choose Us"
          title="Everything you need to "
          highlight="learn the Quran"
          subtitle="We combine qualified teachers, structured curriculum, and modern technology to give you the best Quran learning experience — from anywhere in the world."
          center
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] ${feature.gradient} ${feature.border}`}
            >
              {/* top-right glow on hover */}
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

              {/* icon */}
              <div
                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border bg-surface/60 ${feature.border}`}
              >
                <feature.icon
                  size={22}
                  className={feature.iconColor}
                  strokeWidth={1.5}
                />
              </div>

              {/* title */}
              <h3 className="mb-2 font-display text-[17px] font-semibold text-text">
                {feature.title}
              </h3>

              {/* description */}
              <p className="text-sm leading-relaxed text-text-secondary">
                {feature.description}
              </p>

              {/* bottom gold line on hover */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-gold to-gold-light transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}