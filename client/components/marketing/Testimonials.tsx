"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Sparkles, X } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import SectionHeading from "../ui/SectionHeading";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { GET_APPROVED_TESTIMONIALS, SUBMIT_TESTIMONIAL } from "@/graphql";

// Elegant stylized vector avatar components for Male and Female students
const MaleAvatar = () => (
  <svg viewBox="0 0 100 100" className="h-10 w-10 rounded-full bg-surface border border-gold/30 p-0.5 flex-shrink-0 select-none">
    <defs>
      <linearGradient id="maleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c5a880" />
        <stop offset="100%" stopColor="#9a7f5c" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="#141d27" stroke="#c5a880" strokeWidth="1" />
    {/* Body */}
    <path d="M25,80 C25,65 35,58 50,58 C65,58 75,65 75,80" fill="url(#maleGrad)" />
    {/* Head */}
    <circle cx="50" cy="38" r="14" fill="url(#maleGrad)" />
    {/* Stylized beard & kufi cap */}
    <path d="M42,38 Q50,46 58,38" fill="none" stroke="#0d131a" strokeWidth="2.5" />
    <path d="M38,28 Q50,22 62,28" fill="none" stroke="#0d131a" strokeWidth="2.5" />
  </svg>
);

const FemaleAvatar = () => (
  <svg viewBox="0 0 100 100" className="h-10 w-10 rounded-full bg-surface border border-gold/30 p-0.5 flex-shrink-0 select-none">
    <defs>
      <linearGradient id="femaleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c5a880" />
        <stop offset="100%" stopColor="#9a7f5c" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="#141d27" stroke="#c5a880" strokeWidth="1" />
    {/* Hijab Silhouette */}
    <path d="M28,80 C28,62 36,48 50,48 C64,48 72,62 72,80" fill="url(#femaleGrad)" />
    {/* Face Area */}
    <ellipse cx="50" cy="49" rx="9" ry="11" fill="#141d27" />
    {/* Hijab wrap */}
    <path d="M38,40 Q50,30 62,40 Q50,32 38,40" fill="url(#femaleGrad)" />
    <path d="M38,40 C38,24 62,24 62,40 C62,56 38,56 38,40 Z" fill="none" stroke="url(#femaleGrad)" strokeWidth="2.5" />
  </svg>
);

const defaultTestimonials = [
  {
    name: "Sarah Johnson",
    country: "🇺🇸 USA",
    rating: 5,
    gender: "FEMALE",
    description: "I tried many online platforms before but nothing came close. My teacher is incredibly patient and my Quran recitation has improved beyond what I thought possible in just 3 months.",
  },
  {
    name: "Ahmad Karimi",
    country: "🇨🇦 Canada",
    rating: 5,
    gender: "MALE",
    description: "My son started the kids program and Masha'Allah he's memorized 5 surahs in 2 months. The teacher makes him so comfortable. Best investment we've made for his deen.",
  },
  {
    name: "Fatimah Al-Sayed",
    country: "🇬🇧 UK",
    rating: 5,
    gender: "FEMALE",
    description: "Finally I understand what I'm reading in Salah. The Quranic Arabic course changed my relationship with the Quran completely. I cry in prayer now because I know what I'm saying.",
  },
  {
    name: "Omar Sheikh",
    country: "🇦🇺 Australia",
    rating: 5,
    gender: "MALE",
    description: "Sheikh Ahmad is a rare gem. His knowledge is deep and his teaching is structured. I'm preparing for my Ijazah and couldn't imagine doing this journey with anyone else.",
  },
  {
    name: "Zainab Hussain",
    country: "🇿🇦 South Africa",
    rating: 5,
    gender: "FEMALE",
    description: "As a busy mother of three, the flexible scheduling is a lifesaver. My children look forward to their Quran class every day — something I never thought I'd say!",
  },
  {
    name: "Yusuf Rahman",
    country: "🇲🇾 Malaysia",
    rating: 5,
    gender: "MALE",
    description: "The Tafsir course opened my eyes. I knew the words but now I understand the wisdom. Dr. Bilal's explanations are clear, deep, and always connect back to our daily lives.",
  },
];

export default function Testimonials() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [country, setCountry] = useState("");
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState("");

  // Query approved testimonials
  const { data, refetch } = useQuery<any>(GET_APPROVED_TESTIMONIALS);

  // Mutation to submit testimonial
  const [submitReview, { loading: isSubmitting }] = useMutation<any, any>(SUBMIT_TESTIMONIAL, {
    onCompleted: (res) => {
      toast.success(res?.submitTestimonial?.message || "Thank you for your feedback! It is under review.");
      setIsModalOpen(false);
      // Reset form
      setName("");
      setGender("MALE");
      setCountry("");
      setRating(5);
      setDescription("");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit review.");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !country.trim() || !description.trim()) {
      toast.warning("Please fill out all required fields.");
      return;
    }

    await submitReview({
      variables: {
        createTestimonialInput: {
          name: name.trim(),
          gender,
          country: country.trim(),
          rating,
          description: description.trim()
        }
      }
    });
  };

  // Compile testimonials list
  const dbTestimonials = data?.approvedTestimonials || [];
  const displayTestimonials = [...dbTestimonials];
  
  if (displayTestimonials.length < 6) {
    const existingNames = new Set(displayTestimonials.map(t => t.name.toLowerCase()));
    for (const def of defaultTestimonials) {
      if (!existingNames.has(def.name.toLowerCase()) && displayTestimonials.length < 6) {
        displayTestimonials.push({
          id: `def-${def.name}`,
          name: def.name,
          country: def.country,
          rating: def.rating,
          gender: def.gender as any,
          description: def.description,
          createdAt: new Date().toISOString()
        });
      }
    }
  }

  return (
    <section className="relative overflow-hidden bg-bg py-24">
      {/* Dynamic ambient backgrounds configured for premium dark UI layout */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(197,168,128,0.06)_0%,transparent_80%)] pointer-events-none" />
      <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="flex-1">
            <SectionHeading
              badge="Student Reviews"
              title="Words from our "
              highlight="students worldwide"
              subtitle="Real stories from real students — from beginners who couldn't read Arabic to those now teaching others."
              center={false}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-gold/15 to-gold/5 border border-gold/40 text-gold hover:border-gold hover:text-gold-light text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_20px_rgba(197,168,128,0.08)] cursor-pointer"
          >
            Share Your Journey
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTestimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.5)] glow-gold-hover w-full"
            >
              <div>
                {/* Header layout for Quote and Stars alignment */}
                <div className="flex items-center justify-between mb-4">
                  <Quote size={28} className="text-gold/10 transform -scale-x-100" />
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-gold text-gold" />
                    ))}
                  </div>
                </div>

                {/* Review Paragraph */}
                <p className="mb-6 text-[13px] leading-relaxed text-text-secondary italic">
                  "{t.description}"
                </p>
              </div>

              {/* Bottom Fixed Meta Info Area */}
              <div>
                {/* Author Details */}
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  {t.gender === "MALE" ? <MaleAvatar /> : <FemaleAvatar />}
                  <div>
                    <p className="text-sm font-semibold text-text group-hover:text-gold transition-colors duration-200">{t.name}</p>
                    <p className="font-display text-[10px] font-medium text-text-secondary uppercase tracking-wider">{t.country}</p>
                  </div>
                </div>
              </div>

              {/* Micro bottom layout strip using the core colors */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-gold transition-all duration-500 ease-[0.22,1,0.36,1] group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Review Submission Popup Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass max-w-lg w-full p-6 sm:p-8 rounded-2xl border border-gold/30 glow-gold relative space-y-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-text-secondary hover:text-gold transition-colors p-1"
              >
                <X size={20} />
              </button>

              <div className="text-center">
                <div className="inline-flex h-10 w-10 rounded-full bg-gold/10 text-gold items-center justify-center mb-3">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-xl font-bold font-display text-text">Share Your Experience</h3>
                <p className="text-xs text-text-secondary mt-1">
                  Your feedback helps us grow and inspires other students on their Quranic journey.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Abdullah"
                    required
                  />
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Gender *
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Country *"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. USA, UK"
                    required
                  />
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Rating *
                    </label>
                    <div className="flex gap-1 py-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-gold focus:outline-none cursor-pointer"
                        >
                          <Star
                            size={20}
                            className={star <= rating ? "fill-gold" : "text-text-secondary/40"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Review Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Tell us about your teacher, lessons, scheduling, or general journey..."
                    required
                    className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold resize-none placeholder:text-text-secondary/35"
                  />
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  className="w-full py-3 text-xs uppercase tracking-wider font-bold"
                  isLoading={isSubmitting}
                >
                  Submit Review
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}