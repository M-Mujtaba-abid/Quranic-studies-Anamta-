"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import CourseCard, { CourseCardProps } from "./CourseCard";
import SectionHeading from "../ui/SectionHeading";

const courses: CourseCardProps[] = [
  {
    slug: "tajweed-beginners",
    title: "Tajweed for Beginners — Learn Correct Quran Recitation",
    description: "Master the rules of Tajweed from scratch with a certified teacher in live one-on-one sessions.",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80&fit=crop",
    category: "Tajweed",
    level: "Beginner",
    rating: 4.9,
    students: 3200,
    duration: "12 weeks",
    price: 120,
    discountPrice: 89,
    teacher: "Sheikh Ahmad",
  },
  {
    slug: "hifz-program",
    title: "Complete Hifz Program — Memorize the Quran",
    description: "A structured, step-by-step Hifz journey with daily revision, tracking, and personal coaching.",
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80&fit=crop",
    category: "Hifz",
    level: "Intermediate",
    rating: 4.8,
    students: 1800,
    duration: "24 months",
    price: 299,
    discountPrice: 199,
    teacher: "Ustadha Fatima",
  },
  {
    slug: "arabic-for-quran",
    title: "Quranic Arabic — Understand What You Recite",
    description: "Learn the Arabic of the Quran so you can understand every word during Salah and recitation.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80&fit=crop",
    category: "Arabic",
    level: "Beginner",
    rating: 4.9,
    students: 2600,
    duration: "16 weeks",
    price: 149,
    discountPrice: 99,
    teacher: "Dr. Bilal Hassan",
  },
  {
    slug: "tafsir-juz-amma",
    title: "Tafsir of Juz Amma — Meanings & Lessons",
    description: "Deep dive into the last Juz of the Quran — understand its themes, vocabulary, and lessons.",
    image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&q=80&fit=crop",
    category: "Tafsir",
    level: "Intermediate",
    rating: 4.7,
    students: 980,
    duration: "8 weeks",
    price: 89,
    teacher: "Sheikh Umar",
  },
  {
    slug: "quran-for-kids",
    title: "Quran for Kids — Interactive & Fun Learning",
    description: "Specially designed for children aged 5–12 with female teachers, games, and visual aids.",
    image: "https://images.unsplash.com/photo-1604928141064-207cea6f571f?w=800&q=80&fit=crop",
    category: "Kids",
    level: "Beginner",
    rating: 5.0,
    students: 4100,
    duration: "Ongoing",
    price: 69,
    teacher: "Ustadha Maryam",
  },
  {
    slug: "advanced-tajweed",
    title: "Advanced Tajweed & Ijazah Preparation",
    description: "For those who want to obtain Ijazah — advanced Tajweed rules, Makharij, and chain of narration.",
    image: "https://images.unsplash.com/photo-1563708913730-f57d57a22c37?w=800&q=80&fit=crop",
    category: "Tajweed",
    level: "Advanced",
    rating: 4.9,
    students: 620,
    duration: "6 months",
    price: 349,
    discountPrice: 249,
    teacher: "Sheikh Khalid",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function PopularCourses() {
  return (
    <section className="relative overflow-hidden bg-surface py-24">
      <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-gold/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            badge="Our Courses"
            title="Popular "
            highlight="Quran Programs"
            subtitle="Hand-picked courses taught by certified teachers — for every age and level."
            center={false}
          />
          <Link
            href="/courses"
            className="mb-12 hidden rounded-full border border-gold/40 px-6 py-2.5 text-sm font-medium text-gold transition-all duration-200 hover:bg-gold hover:text-primary-dark sm:flex"
          >
            View All Courses
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {courses.map((course) => (
            <motion.div key={course.slug} variants={itemVariants}>
              <CourseCard {...course} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile CTA */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/courses"
            className="rounded-full border border-gold/40 px-8 py-3 text-sm font-medium text-gold"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
}