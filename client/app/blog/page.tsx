"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Clock, ArrowRight, X, BookOpen, Sparkles } from "lucide-react";
import Image from "next/image";


interface Article {
  id: number;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  author: string;
  authorRole: string;
  content: string[];
}

const articles: Article[] = [
  {
    id: 1,
    title: "The Art of Tajweed: A Beginner’s Guide to Quranic Phonetics",
    category: "Tajweed",
    readTime: "5 min read",
    date: "July 5, 2026",
    excerpt: "Discover the fundamental rules of Tajweed and how proper pronunciation deepens your spiritual connection to the Holy Quran.",
    author: "Ustaaz Talha Bin Tariq",
    authorRole: "Team Leader & Instructor",
    content: [
      "Tajweed, the science of reciting the Quran with correct pronunciation and intonation, is not just a technical linguistic study. It is a spiritual discipline that connects the reciter with the divine speech exactly as it was revealed to the Prophet Muhammad (peace be upon him).",
      "For beginners, the rules of Tajweed can feel overwhelming. However, by breaking them down into fundamental pillars—such as articulation points (Makharij), characteristics of letters (Sifat), and elongation rules (Madd)—anyone can start their journey toward recitation mastery.",
      "The primary goal of Tajweed is to prevent mistakes in reciting the Quran, ensuring that the meanings of the sacred text are preserved. Even a minor mispronunciation of a vowel or elongation can completely alter the meaning of a word.",
      "At Anamta Institute, we emphasize a patient, one-on-one approach to Tajweed. Under the guidance of our certified teachers, you will learn to hear, practice, and refine your recitation, transforming your daily prayers into a deeply moving and precise spiritual experience."
    ]
  },
  {
    id: 2,
    title: "Effective Hifz Pedagogy: Tips for Memorizing the Quran Safely",
    category: "Hifz",
    readTime: "7 min read",
    date: "June 28, 2026",
    excerpt: "Practical steps and memory-retention techniques used by our leading certified teachers to make your Hifz journey smooth and steady.",
    author: "Ustaaz Muhammad Zubair",
    authorRole: "Founder & Chief Instructor",
    content: [
      "Memorizing the Holy Quran (Hifz) is one of the most rewarding spiritual endeavors a Muslim can undertake. However, it requires consistency, structure, and a pedagogical method that prevents cognitive fatigue.",
      "A common mistake made by many students is attempting to memorize too much text too quickly. This often leads to weak retention and burnout. The key to successful memorization is a balanced daily cycle of three parts: memorizing new verses (Sabaq), reviewing recent memorization (Sabqi), and revising the older memorization (Manzil).",
      "By maintaining this structured cycle, the newly memorized verses are gradually transferred into long-term memory. Additionally, practicing your recitation in daily prayers helps solidify the verses.",
      "We recommend setting a consistent daily schedule, choosing a quiet environment, and reciting to an experienced scholar who can instantly correct any hidden pronunciation mistakes before they become ingrained in your memory."
    ]
  },
  {
    id: 3,
    title: "Understanding Quranic Arabic: Why Grammatical Precision Matters",
    category: "Arabic",
    readTime: "6 min read",
    date: "June 15, 2026",
    excerpt: "An introduction to the beauty of Quranic vocabulary and how understanding basic grammar elevates your daily prayers.",
    author: "Ustaazah Humaira Farooqi",
    authorRole: "Sister's Coordinator",
    content: [
      "The Quran was revealed in the Arabic language, characterized by its profound eloquence, depth, and precision. Understanding the basic grammar and vocabulary of the Quran opens up a new dimension of spiritual understanding.",
      "Unlike modern spoken dialects, Classical Quranic Arabic (Fusha) utilizes a root-and-pattern system. Almost every word can be traced back to a three-letter root, which conveys a core concept. By learning these root words, students can rapidly expand their comprehension.",
      "Grammatical precision, or Nahw, is crucial because the grammatical endings of words dictate their roles in a sentence. A single change in a short vowel (Harakah) can change the subject of an action into its object.",
      "By studying Quranic Arabic, you transition from simply reading translations to directly experiencing the rhythm, vocabulary, and eloquence of the Quranic text, allowing you to connect deeper with your faith."
    ]
  },
  {
    id: 4,
    title: "Nurturing Quranic Love in Kids: A Guide for Parents",
    category: "Kids Quran",
    readTime: "4 min read",
    date: "May 30, 2026",
    excerpt: "How to create a warm, encouraging environment at home that inspires children to connect with the Quran.",
    author: "Ustaazah Humaira Farooqi",
    authorRole: "Sister's Coordinator",
    content: [
      "Teaching children the Quran is a sacred responsibility, but the approach must be filled with love, encouragement, and patience rather than pressure.",
      "Children learn best when they see their parents reciting and loving the Quran. Creating a regular family recitation circle at home, where parents and kids read together, normalizes the Quran as an active, beautiful presence in the household.",
      "Using positive reinforcement, celebrating milestones (like completing a Surah), and keeping the lessons short and engaging (15 to 20 minutes) helps maintain a child's enthusiasm.",
      "At Anamta Institute, we specialize in teaching kids. Our tutors use interactive whiteboards, reward systems, and storytelling to keep lessons enjoyable and memorable, ensuring that the Quran remains a source of comfort and joy throughout their lives."
    ]
  },
  {
    id: 5,
    title: "The Pillars of Spiritual Excellence (Ihsan) in Daily Life",
    category: "Islamic Studies",
    readTime: "5 min read",
    date: "May 12, 2026",
    excerpt: "Reflections on how integrating Quranic principles into daily actions cultivates true spiritual excellence.",
    author: "Ustaaz Muhammad Zubair",
    authorRole: "Founder & Chief Instructor",
    content: [
      "The concept of Ihsan, often translated as spiritual excellence, is defined as 'to worship Allah as if you see Him; and if you cannot see Him, know that He sees you.' It is the highest level of faith.",
      "Living with Ihsan means bringing mindfulness, sincerity, and beauty into every action—whether in your personal worship, your professional work, or your interactions with family and strangers.",
      "The Quran is a guide to cultivating Ihsan. By reflecting on the verses of mercy, justice, and charity, we are encouraged to rise above mediocrity and strive for excellence in our morals and ethics.",
      "At Anamta, we aim to teach not just the recitation of the Quran, but the implementation of its timeless values. Striving for Ihsan is a lifelong journey, and the Quran is our ultimate compass."
    ]
  }
];

const categories = ["All", "Tajweed", "Hifz", "Arabic", "Kids Quran", "Islamic Studies"];

const cardGradients: Record<string, string> = {
  "Tajweed": "from-emerald-950/70 to-teal-900/50",
  "Hifz": "from-amber-950/70 to-orange-950/50",
  "Arabic": "from-indigo-950/70 to-blue-900/50",
  "Kids Quran": "from-rose-950/70 to-pink-900/50",
  "Islamic Studies": "from-purple-950/70 to-violet-900/50"
};

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="relative min-h-screen bg-bg text-text pb-20 overflow-hidden">

      {/* Premium subtle background image with gold patterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Image
          src="/images/about/contact_bg.png"
          alt="Blog Background"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-bg/70 to-bg" />
      </div>

      {/* Decorative Background Ambient Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(197,168,128,0.08)_0%,transparent_80%)] pointer-events-none" />
      <div className="absolute -left-40 top-[20%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute -right-40 bottom-[20%] h-[500px] w-[500px] rounded-full bg-gold/5 blur-[150px] pointer-events-none" />

      {/* Hero Header Section */}
      <section className="relative pt-12 pb-12 px-5 sm:px-6 lg:px-10 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-flex px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[20px] font-bold uppercase tracking-wider">
            {/* <Sparkles size={12} className="inline mr-1" /> */}
            Insights & Wisdom
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight leading-tight">
            The Anamta <span className="text-gold">Blog</span>
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
            Expand your knowledge of Tajweed, Hifz, Arabic, and Islamic pedagogy with articles crafted by our scholarly faculty.
          </p>
        </div>
      </section>

      {/* Filters & Search Toolbar */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 mb-12 relative z-20">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface/50 border border-border p-4 rounded-2xl backdrop-blur-md">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${selectedCategory === category
                  ? "bg-gradient-to-r from-gold to-gold-light text-primary-dark shadow-md"
                  : "bg-surface hover:bg-surface-dark border border-border text-text-secondary hover:text-text"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary h-4 w-4" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text placeholder-text-secondary/60 focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 mb-20 relative z-10">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 space-y-4 border border-dashed border-border rounded-2xl bg-surface/20">
            <BookOpen className="h-12 w-12 text-gold/30 mx-auto" />
            <p className="text-text-secondary font-medium">No articles found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
                className="group flex flex-col h-full bg-surface border border-border rounded-2xl overflow-hidden hover:border-gold/30 hover:shadow-[0_15px_40px_-15px_rgba(201,162,39,0.15)] transition-all duration-300 cursor-pointer"
                onClick={() => setActiveArticle(article)}
              >
                {/* Visual Cover Gradient */}
                <div className={`relative h-44 w-full bg-gradient-to-br ${cardGradients[article.category] || "from-neutral-900 to-neutral-800"} p-6 flex flex-col justify-between overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

                  {/* Category Tag */}
                  <span className="self-start px-2.5 py-1 rounded-md bg-black/40 border border-white/10 text-[9px] font-bold uppercase tracking-wider text-gold">
                    {article.category}
                  </span>

                  {/* Icon or Decorative element */}
                  <BookOpen className="absolute -right-6 -bottom-6 h-28 w-28 text-white/5 group-hover:rotate-12 transition-transform duration-500" />

                  {/* Read Time & Date */}
                  <div className="flex items-center gap-3 text-[10px] font-medium text-white/80">
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="text-gold" />
                      {article.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} className="text-gold" />
                      {article.date}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-base text-text leading-snug group-hover:text-gold transition-colors duration-200">
                      {article.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3 font-medium">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Author Box */}
                  <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-text leading-none">{article.author}</p>
                      <p className="text-[9px] font-semibold text-text-secondary/70 uppercase tracking-wide mt-1">
                        {article.authorRole}
                      </p>
                    </div>
                    <span className="h-8 w-8 rounded-full bg-gold/10 text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-primary-dark transition-all duration-300">
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Article Detail Overlay Modal */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-surface border border-gold/20 rounded-3xl p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] scrollbar-none"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute right-4 top-4 sm:right-6 sm:top-6 p-2 rounded-full hover:bg-surface-dark text-text-secondary hover:text-text cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div className="space-y-4 mb-6">
                <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider">
                  <span className="text-gold border border-gold/30 px-2 py-0.5 rounded bg-gold/5">
                    {activeArticle.category}
                  </span>
                  <span>•</span>
                  <span>{activeArticle.readTime}</span>
                  <span>•</span>
                  <span>{activeArticle.date}</span>
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-text leading-tight pr-8">
                  {activeArticle.title}
                </h2>

                {/* Author Info */}
                <div className="flex items-center gap-2 pt-2">
                  <div className="h-9 w-9 rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center font-display font-bold text-xs uppercase">
                    {activeArticle.author.split(" ").slice(-1)[0][0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text leading-tight">{activeArticle.author}</p>
                    <p className="text-[9px] font-semibold text-text-secondary/70 uppercase tracking-wide">
                      {activeArticle.authorRole}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body / Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-text-secondary font-medium border-t border-border/40 pt-6">
                {activeArticle.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Action Close */}
              <div className="mt-8 pt-6 border-t border-border/40 flex justify-end">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-primary-dark font-semibold text-xs tracking-wide shadow-md transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  Done Reading
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
