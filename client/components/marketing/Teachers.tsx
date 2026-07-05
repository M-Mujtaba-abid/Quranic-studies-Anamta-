"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import TeacherCard, { TeacherCardProps } from "../teacher/TeacherCard";
import SectionHeading from "../ui/SectionHeading";

const teachers: TeacherCardProps[] = [
  {
    slug: "sheikh-ahmad",
    name: "Sheikh Ahmad Al-Rashid",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&fit=crop&crop=face",
    specialization: "Tajweed & Ijazah",
    rating: 4.9,
    students: 1840,
    languages: ["English", "Arabic"],
    bio: "Hafiz with Ijazah in Hafs. Over 10 years teaching Tajweed to students worldwide.",
  },
  {
    slug: "ustadha-fatima",
    name: "Ustadha Fatima Zahra",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&fit=crop&crop=face",
    specialization: "Hifz & Tajweed for Sisters",
    rating: 5.0,
    students: 2300,
    languages: ["English", "Urdu"],
    bio: "Female Hafiza dedicated to helping sisters and children memorize the Quran with love and patience.",
  },
  {
    slug: "dr-bilal-hassan",
    name: "Dr. Bilal Hassan",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&fit=crop&crop=face",
    specialization: "Quranic Arabic & Tafsir",
    rating: 4.8,
    students: 1560,
    languages: ["English", "Arabic", "Urdu"],
    bio: "PhD in Islamic Studies. Specializes in making Quranic Arabic accessible for non-native speakers.",
  },
  {
    slug: "ustadha-maryam",
    name: "Ustadha Maryam Siddiqui",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&fit=crop&crop=face",
    specialization: "Kids Quran & Noorani Qaida",
    rating: 5.0,
    students: 3100,
    languages: ["English", "Urdu"],
    bio: "Specialist in early childhood Quran education. Known for making learning fun and memorable for kids.",
  },
];

export default function Teachers() {
  // Har card ko ek unique ID assign kar rahe hain taake animation track ho sake
  const [items, setItems] = useState(() =>
    teachers.map((teacher, index) => ({ ...teacher, id: index }))
  );

  useEffect(() => {
    // Har 2.5 seconds baad swipe hoga
    const interval = setInterval(() => {
      setItems((prevItems) => {
        const newItems = [...prevItems];
        const firstItem = newItems.shift(); // Pehla card nikalna

        if (firstItem) {
          // Same card ko array ke end mein nayi ID ke sath add kar rahe hain 
          // taake Framer Motion usko naya element samajh kar smooth entry de
          newItems.push({ ...firstItem, id: Date.now() });
        }
        return newItems;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-surface py-24">
      {/* Ambient Glows */}
      <div className="absolute -right-32 top-0 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-gold/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            badge="Our Teachers"
            title="Learn from the "
            highlight="best in the world"
            subtitle="Every teacher is ijazah-certified, background-verified, and passionate about Quran education."
            center={false}
          />
          <Link
            href="/"
            className="mb-12 hidden rounded-full border border-primary/60 bg-primary/5 px-6 py-2.5 text-sm font-semibold text-text backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-gold hover:text-gold sm:flex"
          >
            Meet All Teachers
          </Link>
        </div>

        {/* Step-by-Step Carousel Container */}
        <div className="mt-12 overflow-hidden py-4">
          <div className="flex gap-6 w-full">
            <AnimatePresence mode="popLayout">
              {items.map((teacher) => (
                <motion.div
                  layout // Ye prop baki cards ko left shift hone ka smooth effect deta he
                  key={teacher.id}
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="w-[280px] sm:w-[320px] shrink-0"
                >
                  <TeacherCard {...teacher} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-12 flex justify-center sm:hidden">
          <Link
            href="/"
            className="w-full text-center rounded-full border border-primary/60 bg-primary/5 px-8 py-3 text-sm font-semibold text-text backdrop-blur-sm transition-all duration-300 active:scale-[0.98] active:border-gold active:text-gold"
          >
            Meet All Teachers
          </Link>
        </div>
      </div>
    </section>
  );
}