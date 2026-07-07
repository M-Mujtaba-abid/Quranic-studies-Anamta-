// 2.5% gateway 



// 0.3%

"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from "framer-motion";
import Image from "next/image";
import {
  Award,
  BookOpen,
  Users,
  Globe,
  Calendar,
  ShieldCheck,
  Heart,
  Quote,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const stats = [
  { value: 5000, suffix: "+", label: "Active Students Worldwide", icon: Users },
  { value: 100, suffix: "K+", label: "Completed Classes", icon: BookOpen },
  { value: 30, suffix: "+", label: "Countries Served", icon: Globe },
  { value: 50, suffix: "+", label: "Ijazah Certified Teachers", icon: Award },
];

const pillars = [
  {
    title: "Verified Authentic Lineage (Sanad)",
    description:
      "Our instructors hold verified chains of recitation (Ijazah) tracing directly back to the Prophet Muhammad (PBUH), ensuring pure authenticity.",
    icon: ShieldCheck,
  },
  {
    title: "1-on-1 Personalized Guidance",
    description:
      "Every lesson is tailored to your unique pace, strengths, and schedule, creating a comfortable and highly focused learning atmosphere.",
    icon: Heart,
  },
  {


    title: "Community-Driven Group Sessions",
    description:
      "Engaging group classes designed to foster teamwork and shared learning, helping you build confidence through peer interaction and expert guidance.",
    icon: Calendar,
  },
];

const milestones = [
  {
    year: "2020",
    title: "The Humble Spark",
    description:
      "Anamta Institute was founded with only 3 teachers and a handful of local students, driven by a vision to make Quranic tajweed accessible digitally.",
  },
  {
    year: "2022",
    title: "Global Outreach Expansion",
    description:
      "Expanding services to cover the USA, UK, Canada, and Australia, we reached our first milestone of teaching 1,000+ active scholars.",
  },
  {
    year: "2024",
    title: "Technological Revolution",
    description:
      "Launched our bespoke student portal, allowing unified scheduling, automated receipt uploading, and progress analytics.",
  },
  {
    year: "2026",
    title: "Cultivating Leadership",
    description:
      "Now supporting 5,000+ students and over 50 Ijazah certified scholars, training the next generation of Quran teachers globally.",
  },
];

const team = [
  {
    name: "Ustaaz Muhammad Zubair",
    role: "Founder and Chief Instructor",
    credentials: "Masters in Islamic Education and Ijazah Holder in 5 Qiraa'ts",
    bio: "Over 15 years of teaching Quranic Sciences and Tajweed to international students.",
    image: "/mujiFriend.jpeg",
  },
  {
    name: "Ustaaz Talha Bin Tariq",
    role: "Team Leader and Instructor",
    credentials: "Masters in Islamic Education and Ijazah Holder",
    bio: "Specializes in advanced Tajweed, Quranic phonetics, and student coordination.",
    image: "/images/about/IMG_2423.jpg",
  },
  // {
  //   name: "Ustadh Omar Farooq",
  //   role: "Head of Tajweed Program",
  //   credentials: "Masters in Islamic Studies, Specialist in Hifz pedagogy",
  //   bio: "Dedicated to designing effective Quran memorization methodologies for children.",
  //   image: "/images/about/omar.png",
  // },
  {
    name: "Ustaazah Humaira Farooqi",
    role: "Sister's coordinator and Instructor",
    credentials: "Bachelor's degree in Islamic Education and Ijazah Holder",
    bio: "Supervises standard curriculum pathways and teacher training for female classes.",
    image: "/images/about/humaira.png",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter((w) => w.length > 0 && w[0] === w[0].toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

/* ------------------------------------------------------------------ */
/*  Animated counter for the stats grid                                */
/* ------------------------------------------------------------------ */

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Subtle Islamic geometric pattern (decorative, low-opacity)         */
/* ------------------------------------------------------------------ */

function GeometricPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="islamicStar" width="50" height="50" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="0.6">
            <path d="M25 2 L31 19 L48 19 L34 30 L39 47 L25 37 L11 47 L16 30 L2 19 L19 19 Z" />
            <circle cx="25" cy="25" r="4" />
          </g>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#islamicStar)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Founder Story — the visual centerpiece                             */
/* ------------------------------------------------------------------ */

function FounderStory() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mvY, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mvX, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  const founder = team[0];

  return (
    <section className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 mb-28">
      {/* Ambient glow specific to this section */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gold/10 blur-[130px]" />

      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-14 items-center">
        {/* ── Left: floating tilt image card ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[420px]"
          style={{ perspective: 1000 }}
        >
          {/* Blur circles behind the card */}
          <div className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-primary/20 blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-10 -right-6 h-64 w-64 rounded-full bg-gold/20 blur-[100px] pointer-events-none" />

          {/* Decorative geometric pattern */}
          <GeometricPattern className="absolute -top-8 -right-8 h-28 w-28 text-gold/25 pointer-events-none" />

          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            whileHover={{ scale: 1.02 }}
            className="relative rounded-[2rem] border border-gold/30 bg-surface/60 p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            {/* Animated gold ring */}
            <div className="absolute inset-0 rounded-[2rem] border-2 border-gold/20" />
            <div className="relative overflow-hidden rounded-[1.6rem] aspect-[4/5]">
              {founder.image ? (
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 90vw, 420px"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-dark text-5xl font-display font-bold text-gold/40">
                  {getInitials(founder.name)}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
            </div>

            {/* Decorative quotation mark */}
            <Quote className="absolute -top-4 -left-4 h-10 w-10 text-gold/70 fill-gold/10" />

            {/* Name badge floating on the card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold/30 bg-bg/90 px-5 py-2 shadow-lg backdrop-blur-md"
            >
              <p className="font-display text-sm font-semibold text-text">{founder.name}</p>
              <p className="text-[10px] uppercase tracking-wider text-gold text-center">{founder.role}</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── Right: story content ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="space-y-6 pt-8 lg:pt-0"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold">
            <Sparkles size={12} />
            Meet the Founder
          </span>

          <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight text-text">
            Our Journey Begins With the <span className="text-gold">Quran</span>
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-text-secondary font-medium">
            Anamta Institute began with a simple conviction: that every soul, no matter where they live,
            deserves the chance to recite the Quran with precision, understanding, and love. What started
            as a handful of lessons in a small local circle has grown into a global sanctuary of learning —
            without ever losing the personal, patient guidance that defined those very first classes.
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-text-secondary font-medium">
            Every teacher we bring on board is chosen not just for their certification, but for their
            character — their patience with beginners, their warmth with children, and their unwavering
            respect for the sacred text they teach.
          </p>

          {/* Quote card */}
          <div className="relative rounded-2xl border border-gold/20 bg-surface/50 p-5 backdrop-blur-sm">
            <Quote className="absolute top-3 left-4 h-6 w-6 text-gold/30" />
            <p className="pl-8 text-sm italic leading-relaxed text-text-secondary">
              "We are not building a platform. We are building a bridge — between hearts searching for
              meaning, and the words that have guided humanity for over fourteen centuries."
            </p>
          </div>

          <Link href="/courses" className="inline-block">
            <motion.span
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-light px-6 py-3 text-sm font-semibold text-primary-dark shadow-[0_4px_20px_-2px_rgba(201,162,39,0.45)]"
            >
              Begin Your Journey
              <ArrowRight size={16} />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Team Leader Story — highlighted section with layout reversed       */
/* ------------------------------------------------------------------ */

function LeaderStory() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mvY, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mvX, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  const leader = team[1];

  return (
    <section className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 mb-28">
      {/* Ambient glow specific to this section */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gold/10 blur-[130px]" />

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
        {/* ── Left: story content (details left) ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6 pt-8 lg:pt-0"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold">
            <Sparkles size={12} />
            Meet our Team Leader
          </span>

          <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight text-text">
            Guiding Academic Excellence & <span className="text-gold">Mentorship</span>
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-text-secondary font-medium">
            Ustaaz Talha Bin Tariq leads our teaching faculty with a dedicated focus on maintaining
            the highest standards of Quranic pedagogy. His role involves coordinating student progression,
            mentoring new instructors, and designing tailored study plans that fit the modern learner's pace.
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-text-secondary font-medium">
            With his deep expertise in Islamic education, he ensures that the authentic chains of
            recitation (Ijazah) and the values of patient, personalized guidance are consistently delivered
            across all our sessions.
          </p>

          {/* Quote card */}
          <div className="relative rounded-2xl border border-gold/20 bg-surface/50 p-5 backdrop-blur-sm">
            <Quote className="absolute top-3 left-4 h-6 w-6 text-gold/30" />
            <p className="pl-8 text-sm italic leading-relaxed text-text-secondary">
              "Our mission is to make the learning process engaging, rigorous, and deeply transformative.
              We want every student to feel supported in their unique spiritual and academic journey."
            </p>
          </div>
        </motion.div>

        {/* ── Right: floating tilt image card (image right) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative mx-auto w-full max-w-[420px]"
          style={{ perspective: 1000 }}
        >
          {/* Blur circles behind the card */}
          <div className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-primary/20 blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-10 -right-6 h-64 w-64 rounded-full bg-gold/20 blur-[100px] pointer-events-none" />

          {/* Decorative geometric pattern */}
          <GeometricPattern className="absolute -top-8 -right-8 h-28 w-28 text-gold/25 pointer-events-none" />

          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            whileHover={{ scale: 1.02 }}
            className="relative rounded-[2rem] border border-gold/30 bg-surface/60 p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            {/* Animated gold ring */}
            <div className="absolute inset-0 rounded-[2rem] border-2 border-gold/20" />
            <div className="relative overflow-hidden rounded-[1.6rem] aspect-[4/5]">
              {leader.image ? (
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  className="object-cover object-[65%_center]"
                  sizes="(max-width: 1024px) 90vw, 420px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-dark text-5xl font-display font-bold text-gold/40">
                  {getInitials(leader.name)}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
            </div>

            {/* Decorative quotation mark */}
            <Quote className="absolute -top-4 -left-4 h-10 w-10 text-gold/70 fill-gold/10" />

            {/* Name badge floating on the card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold/30 bg-bg/90 px-5 py-2 shadow-lg backdrop-blur-md"
            >
              <p className="font-display text-sm font-semibold text-text">{leader.name}</p>
              <p className="text-[10px] uppercase tracking-wider text-gold text-center">{leader.role}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function AboutUs() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 60%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="relative min-h-screen bg-bg text-text pb-20 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(197,168,128,0.08)_0%,transparent_80%)] pointer-events-none" />
      <div className="absolute -left-40 top-[20%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute -right-40 bottom-[20%] h-[500px] w-[500px] rounded-full bg-gold/5 blur-[150px] pointer-events-none" />

      {/* Hero Banner Section */}
      <section className="relative pt-20 pb-16 px-5 sm:px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image src="/images/about/contact_bg.png" alt="" fill priority className="object-cover" />
        </div>
        <GeometricPattern className="absolute top-10 right-10 h-40 w-40 text-gold/10 pointer-events-none hidden sm:block" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto text-center space-y-6"
        >
          <span className="inline-flex px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-wider">
            Our Noble Mission
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight leading-tight">
            Bridging Hearts to the <span className="text-gold">Holy Quran</span>
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
            Anamta Institute is a premier global sanctuary dedicated to cultivating spiritual excellence,
            Quranic literacy, and Tajweed mastery through modern interactive technologies.
          </p>
        </motion.div>
      </section>

      {/* Founder Story — visual centerpiece */}
      <FounderStory />

      {/* Team Leader Story */}
      <LeaderStory />

      {/* Statistics dashboard — count-up on scroll into view */}
      <section className="relative px-5 sm:px-6 lg:px-10 max-w-7xl mx-auto mb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, index) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-surface border border-border p-6 rounded-2xl text-center flex flex-col items-center justify-center space-y-3 group hover:border-gold/40 hover:shadow-[0_10px_40px_-10px_rgba(201,162,39,0.25)] transition-all duration-300 shadow-sm"
              >
                <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <Icon size={20} />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold font-display text-text block tracking-tight">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </span>
                  <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block mt-1">
                    {s.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Narrative Section 1 - Our Heritage (Quran Image) */}
      <section className="relative px-5 sm:px-6 lg:px-10 max-w-7xl mx-auto mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-xs font-bold text-gold uppercase tracking-widest block">Rooted in Tradition</span>
            <h2 className="text-3xl font-bold font-display text-text leading-tight">
              Honoring the Sacred Art of Recitation
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed font-medium">
              We believe the Holy Quran is not merely to be read, but to be recited with deep contemplation,
              rhythm, and precision. Since our inception, we have held our teachers to the highest
              pedagogical standards, ensuring that every syllable, accent, and rules of Tajweed are
              preserved and taught as they were revealed.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed font-medium">
              By combining classical methods with certified Arab and native scholars, we bridge geographical
              divides, allowing students to access centuries of Quranic scholarship right from the comfort
              of their homes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[380px] w-full rounded-2xl overflow-hidden border border-gold/20 shadow-2xl group"
          >
            <Image
              src="/images/about/about_quran_heritage.png"
              alt="Quran Heritage wood Rehal stand"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-w-1024px) 100vw, 550px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-40" />
          </motion.div>
        </div>
      </section>

      {/* Narrative Section 2 - Digital Classroom */}
      <section className="relative px-5 sm:px-6 lg:px-10 max-w-7xl mx-auto mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[380px] w-full rounded-2xl overflow-hidden border border-gold/20 shadow-2xl group order-last lg:order-first"
          >
            <Image
              src="/images/about/about_digital_classroom.png"
              alt="Modern Digital Online Quran Classroom setting"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-w-1024px) 100vw, 550px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-40" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-xs font-bold text-gold uppercase tracking-widest block">Modern Technology</span>
            <h2 className="text-3xl font-bold font-display text-text leading-tight">
              A Bespoke Digital Platform for Islamic Studies
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed font-medium">
              Traditional education should not be constrained by obsolete interfaces. Our custom student
              portal provides you with transparent tools to upload receipts, schedule your sessions, choose
              flexible timings, and manage your courses from any web interface.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed font-medium">
              We leverage clean UX design paradigms, robust API integrations, and safe database structures
              so your focus remains strictly on what matters: your relationship with the Holy Book.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="relative py-16 bg-surface-dark/20 border-y border-border mb-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <SectionHeading
              badge="Our Core Pillars"
              title="What Defines the "
              highlight="Anamta Standard"
              subtitle="We unite academic rigor, interactive technologies, and premium spiritual mentorship."
              center
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, rotateX: -15, y: 20 }}
                  whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-surface border border-border p-6 rounded-2xl space-y-4 hover:border-gold/30 hover:shadow-md transition-all group"
                >
                  <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center group-hover:scale-105 group-hover:-rotate-6 transition-transform duration-300">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-base text-text font-display group-hover:text-gold transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{p.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Historical Milestones Timeline — with animated scroll-progress line */}
      <section ref={timelineRef} className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 mb-28">
        <div className="text-center mb-12">
          <SectionHeading
            badge="The Journey"
            title="Our Path of "
            highlight="Growth & Expansion"
            subtitle="From a local project to an internationally recognized sanctuary for Quran studies."
            center
          />
        </div>

        <div className="relative ml-4 md:ml-1/2 space-y-12 pb-6">
          {/* Static track */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-border/60" />
          {/* Animated gold progress fill */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-0 top-0 w-[1px] bg-gradient-to-b from-gold to-gold-light"
          />

          {milestones.map((m, index) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 md:pl-0 md:w-1/2 md:even:ml-auto md:even:pl-8 md:odd:pr-8 md:odd:text-right md:odd:translate-x-[-1px] group"
            >
              <div className="absolute -left-[5px] top-1.5 h-[11px] w-[11px] rounded-full bg-border border-2 border-bg group-hover:bg-gold group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(201,162,39,0.6)] transition-all duration-300 md:left-auto md:right-[-6px] md:group-even:left-[-6px] md:group-even:right-auto" />

              <div className="space-y-2">
                <span className="font-display font-extrabold text-lg text-gold">{m.year}</span>
                <h4 className="font-bold text-base text-text font-display">{m.title}</h4>
                <p className="text-xs text-text-secondary leading-relaxed max-w-md md:odd:ml-auto">
                  {m.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team / Leadership */}
      <section className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        <div className="text-center mb-12">
          <SectionHeading
            badge="Advisory & Faculty"
            title="Scholarly Leadership "
            highlight="You Can Trust"
            subtitle="Our programs are governed and taught by individuals dedicated to Quranic pedagogy and Islamic leadership."
            center
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass p-6 border border-border rounded-2xl space-y-4 hover:border-gold/40 hover:shadow-[0_20px_50px_-15px_rgba(201,162,39,0.25)] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-gold/30 bg-surface-dark flex items-center justify-center">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-display text-lg font-bold text-gold/60">
                      {getInitials(member.name)}
                    </span>
                  )}
                </div>
                <div className="text-center space-y-2">
                  <h4 className="font-bold text-lg font-display text-text">{member.name}</h4>
                  <span className="text-xs font-bold text-gold block uppercase tracking-wider">
                    {member.role}
                  </span>
                  <p className="text-[10px] font-semibold text-text-secondary italic">
                    {member.credentials}
                  </p>
                </div>
              </div>
              <p className="text-xs text-text-secondary/90 leading-relaxed  border-t border-border/40  text-center">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}