"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCountrySelection } from "@/providers/CountryProvider";
import { LOCAL_COUNTRY } from "@/constants/countries";
import Image from "next/image";
import {
  Users,
  PiggyBank,
  CalendarDays,
  BookOpenCheck,
  MessagesSquare,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const features = [
  { icon: MessagesSquare, title: "Interactive Group Sessions" },
  { icon: Users, title: "Learn Alongside Peers" },
  { icon: PiggyBank, title: "Affordable Group Pricing" },
  { icon: CalendarDays, title: "Weekly Structured Curriculum" },
  { icon: BookOpenCheck, title: "Qualified Group Mentors" },

];

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function GroupClassFeatures() {
  const router = useRouter();
  const { setCountry } = useCountrySelection();

  const handleViewGroupCourses = () => {
    setCountry(LOCAL_COUNTRY);
    router.push("/courses?mode=GROUP");
  };

  return (
    <section className="relative overflow-hidden bg-bg py-24">
      {/* background decoration */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-gold/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="space-y-8 lg:order-1 order-2"
          >
            <div className="space-y-4">
              <span className="inline-block rounded-full border border-gold bg-surface px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-gold">
                Group Learning
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-text leading-tight">
                Group Quran Classes for{" "}
                <span className="text-gold">Collective Growth</span>
              </h2>
              <p className="text-base text-text-secondary leading-relaxed max-w-xl">
                Join small, structured batches where students learn Tajweed and recitation together — motivating each other while still getting focused guidance from certified teachers.
              </p>
            </div>

            <motion.div
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="flex items-center gap-2.5 rounded-xl border border-border bg-surface/60 px-4 py-3"
                >
                  <CheckCircle2 size={18} className="text-gold shrink-0" />
                  <span className="text-sm font-medium text-text">{feature.title}</span>
                </motion.div>
              ))}
            </motion.div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-gold/90 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-gold animate-pulse" />
                Group classes are only available for Pakistani students.
              </p>
              <Button
                variant="gold"
                size="lg"
                rightIcon={<ArrowRight size={16} />}
                onClick={handleViewGroupCourses}
              >
                View Courses
              </Button>
            </div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative lg:order-2 order-1"
          >
            <div className="relative h-[320px] sm:h-[420px] w-full rounded-2xl overflow-hidden border border-gold/20 shadow-2xl">
              <Image
                src="/w2.jpeg"
                alt="Students attending a live group Quran class online"
                fill
                // className="object-cover"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/50 via-transparent to-transparent" />
            </div>

            {/* Floating stat badge */}
            <div className="absolute -bottom-6 right-6 left-6 sm:right-8 sm:left-auto sm:w-64 bg-surface border border-gold/20 rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <span className="block text-sm font-bold font-display text-text">Small Batches</span>
                <span className="block text-[11px] text-text-secondary">Focused group learning</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
