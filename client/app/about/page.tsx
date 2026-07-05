"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Award, 
  BookOpen, 
  Users, 
  Globe, 
  Calendar, 
  CheckCircle, 
  ShieldCheck, 
  Heart,
  ChevronRight
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Navbar from "@/components/layout/Navbar";

const stats = [
  { value: "5,000+", label: "Active Students Worldwide", icon: Users },
  { value: "100K+", label: "Completed Classes", icon: BookOpen },
  { value: "35+", label: "Countries Served", icon: Globe },
  { value: "50+", label: "Ijazah Certified Teachers", icon: Award },
];

const pillars = [
  {
    title: "Verified Authentic Lineage (Sanad)",
    description: "Our instructors hold verified chains of recitation (Ijazah) tracing directly back to the Prophet Muhammad (PBUH), ensuring pure authenticity.",
    icon: ShieldCheck,
  },
  {
    title: "1-on-1 Personalized Guidance",
    description: "Every lesson is tailored to your unique pace, strengths, and schedule, creating a comfortable and highly focused learning atmosphere.",
    icon: Heart,
  },
  {
    title: "Interactive Portal Experience",
    description: "Seamlessly manage scheduling, register enrollments, view payments history, and track weekly progress all within our modern client dashboard.",
    icon: Calendar,
  },
];

const milestones = [
  {
    year: "2020",
    title: "The Humble Spark",
    description: "Anamta Institute was founded with only 3 teachers and a handful of local students, driven by a vision to make Quranic tajweed accessible digitally.",
  },
  {
    year: "2022",
    title: "Global Outreach Expansion",
    description: "Expanding services to cover the USA, UK, Canada, and Australia, we reached our first milestone of teaching 1,000+ active scholars.",
  },
  {
    year: "2024",
    title: "Technological Revolution",
    description: "Launched our bespoke student portal, allowing unified scheduling, automated receipt uploading, and progress analytics.",
  },
  {
    year: "2026",
    title: "Cultivating Leadership",
    description: "Now supporting 5,000+ students and over 50 Ijazah certified scholars, training the next generation of Quran teachers globally.",
  },
];

const team = [
  {
    name: "Sheikh Bilal Ahmad",
    role: "Founder & Chief Instructor",
    credentials: "Graduate of Al-Azhar University, 10 Qira'at Ijazah Holder",
    bio: "Over 15 years of teaching Quranic Sciences and Tajweed to international students.",
  },
  {
    name: "Ustadh Omar Farooq",
    role: "Head of Tajweed Program",
    credentials: "Masters in Islamic Studies, Specialist in Hifz pedagogy",
    bio: "Dedicated to designing effective Quran memorization methodologies for children.",
  },
  {
    name: "Ustadha Fatimah Al-Mansoori",
    role: "Head of Sisters & Kids Section",
    credentials: "Licensed reciter with expertise in early-childhood Islamic education",
    bio: "Supervises standard curriculum pathways and teacher training for female classes.",
  },
];

export default function AboutUs() {
  return (
    <div className="relative min-h-screen bg-bg text-text pb-20 overflow-hidden">
      <Navbar />
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(197,168,128,0.08)_0%,transparent_80%)] pointer-events-none" />
      <div className="absolute -left-40 top-[20%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute -right-40 bottom-[20%] h-[500px] w-[500px] rounded-full bg-gold/5 blur-[150px] pointer-events-none" />

      {/* Hero Banner Section */}
      <section className="relative pt-20 pb-16 px-5 sm:px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image
            src="/images/about/contact_bg.png"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>
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
            Anamta Institute is a premier global sanctuary dedicated to cultivating spiritual excellence, Quranic literacy, and Tajweed mastery through modern interactive technologies.
          </p>
        </motion.div>
      </section>

      {/* Statistics dashboard */}
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
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-surface border border-border p-6 rounded-2xl text-center flex flex-col items-center justify-center space-y-3 group hover:border-gold/30 transition-all duration-300 shadow-sm"
              >
                <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon size={20} />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold font-display text-text block tracking-tight">
                    {s.value}
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
              We believe the Holy Quran is not merely to be read, but to be recited with deep contemplation, rhythm, and precision. Since our inception, we have held our teachers to the highest pedagogical standards, ensuring that every syllable, accent, and rules of Tajweed are preserved and taught as they were revealed.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed font-medium">
              By combining classical methods with certified Arab and native scholars, we bridge geographical divides, allowing students to access centuries of Quranic scholarship right from the comfort of their homes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
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
              Traditional education should not be constrained by obsolete interfaces. Our custom student portal provides you with transparent tools to upload receipts, schedule your sessions, choose flexible timings, and manage your courses from any web interface.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed font-medium">
              We leverage clean UX design paradigms, robust API integrations, and safe database structures so your focus remains strictly on what matters: your relationship with the Holy Book.
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-surface border border-border p-6 rounded-2xl space-y-4 hover:border-gold/30 hover:shadow-md transition-all group"
                >
                  <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-base text-text font-display group-hover:text-gold transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {p.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Historical Milestones Timeline */}
      <section className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 mb-28">
        <div className="text-center mb-12">
          <SectionHeading
            badge="The Journey"
            title="Our Path of "
            highlight="Growth & Expansion"
            subtitle="From a local project to an internationally recognized sanctuary for Quran studies."
            center
          />
        </div>

        <div className="relative border-l border-border/80 ml-4 md:ml-1/2 space-y-12 pb-6">
          {milestones.map((m, index) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 md:pl-0 md:w-1/2 md:even:ml-auto md:even:pl-8 md:odd:pr-8 md:odd:text-right md:odd:translate-x-[-1px] group"
            >
              {/* Dot */}
              <div className="absolute -left-[5px] top-1.5 h-[11px] w-[11px] rounded-full bg-border border-2 border-bg group-hover:bg-gold group-hover:scale-125 transition-all duration-300 md:left-auto md:right-[-6px] md:group-even:left-[-6px] md:group-even:right-auto" />
              
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass p-6 border border-border rounded-2xl space-y-4 hover:border-gold/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <h4 className="font-bold text-lg font-display text-text">{member.name}</h4>
                <span className="text-xs font-bold text-gold block uppercase tracking-wider">{member.role}</span>
                <p className="text-[10px] font-semibold text-text-secondary italic">
                  {member.credentials}
                </p>
              </div>
              <p className="text-xs text-text-secondary/90 leading-relaxed pt-2 border-t border-border/40 mt-4">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
