"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Sparkles, X } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import SectionHeading from "../ui/SectionHeading";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { GET_APPROVED_TESTIMONIALS, SUBMIT_TESTIMONIAL } from "@/graphql";
// Flat-illustration style avatars — Sister (hijab/abaya) and Brother (molvi-style: cap, beard, kurta)
const MaleAvatar = () => (
  <svg viewBox="0 0 100 100" className="h-10 w-10 rounded-full bg-surface border border-gold/30 p-0.5 flex-shrink-0 select-none">
    <defs>
      <linearGradient id="maleSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e8c9a0" />
        <stop offset="100%" stopColor="#d4ac7a" />
      </linearGradient>
    </defs>
    {/* Background circle */}
    <circle cx="50" cy="50" r="48" fill="#141d27" stroke="#c5a880" strokeWidth="1" />

    {/* Kurta/Thobe body — brand primary blue tone */}
    <path d="M 18 88 Q 18 62 34 54 L 66 54 Q 82 62 82 88 Z" fill="#21576f" />
    {/* Kurta collar/placket line */}
    <line x1="50" y1="54" x2="50" y2="80" stroke="#153a4a" strokeWidth="2" />
    {/* Kurta buttons */}
    <circle cx="50" cy="62" r="1.3" fill="#c9a227" />
    <circle cx="50" cy="70" r="1.3" fill="#c9a227" />
    <circle cx="50" cy="78" r="1.3" fill="#c9a227" />

    {/* Neck */}
    <rect x="44" y="47" width="12" height="10" fill="url(#maleSkin)" />

    {/* Full round face — big and clearly visible like a friendly illustration */}
    <circle cx="50" cy="38" r="17" fill="url(#maleSkin)" />

    {/* Beard — solid, wraps jaw and chin, distinctly dark */}
    <path
      d="M 33 36 C 33 50 40 60 50 60 C 60 60 67 50 67 36
         C 67 42 63 47 58 49 C 58 44 56 41 50 41
         C 44 41 42 44 42 49 C 37 47 33 42 33 36 Z"
      fill="#1c1c1c"
    />

    {/* Mustache */}
    <path d="M 43 40 Q 50 44 57 40" fill="none" stroke="#1c1c1c" strokeWidth="2.4" strokeLinecap="round" />

    {/* Kufi cap — gold, sits clearly on top, rounded dome */}
    <path
      d="M 33 26 Q 50 6 67 26 Q 68 30 63 30 Q 50 24 37 30 Q 32 30 33 26 Z"
      fill="#c9a227"
      stroke="#8a6d15"
      strokeWidth="1"
    />

    {/* Eyes */}
    <circle cx="44" cy="35" r="1.6" fill="#26221c" />
    <circle cx="56" cy="35" r="1.6" fill="#26221c" />
  </svg>
);

const FemaleAvatar = () => (
  <svg viewBox="0 0 100 100" className="h-10 w-10 rounded-full bg-surface border border-gold/30 p-0.5 flex-shrink-0 select-none">
    <defs>
      <linearGradient id="femaleSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0d4ac" />
        <stop offset="100%" stopColor="#dcb98a" />
      </linearGradient>
      <linearGradient id="hijabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d4a72c" />
        <stop offset="100%" stopColor="#a8801a" />
      </linearGradient>
    </defs>
    {/* Background circle */}
    <circle cx="50" cy="50" r="48" fill="#141d27" stroke="#c5a880" strokeWidth="1" />

    {/* Abaya/robe body — gold tone, matches hijab for a cohesive full outfit look */}
    <path d="M 16 90 Q 16 60 30 50 L 70 50 Q 84 60 84 90 Z" fill="url(#hijabGrad)" />

    {/* Hijab drape — large, rounded, covers head fully down to shoulders */}
    <path
      d="M 50 8
         Q 70 8 74 30
         Q 76 42 70 54
         L 30 54
         Q 24 42 26 30
         Q 30 8 50 8 Z"
      fill="url(#hijabGrad)"
    />

    {/* Hijab fold/drape lines for dimension */}
    <path d="M 33 30 Q 34 42 37 53" fill="none" stroke="#7a5c14" strokeWidth="1.3" opacity="0.6" />
    <path d="M 67 30 Q 66 42 63 53" fill="none" stroke="#7a5c14" strokeWidth="1.3" opacity="0.6" />

    {/* Full round face — big and clearly visible, matches male proportions */}
    <ellipse cx="50" cy="35" rx="14" ry="16" fill="url(#femaleSkin)" />

    {/* Eyes */}
    <circle cx="45" cy="34" r="1.6" fill="#3a2a1c" />
    <circle cx="55" cy="34" r="1.6" fill="#3a2a1c" />

    {/* Soft smile */}
    <path d="M 45 41 Q 50 44 55 41" fill="none" stroke="#8a5a3c" strokeWidth="1.2" strokeLinecap="round" />
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
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-gold/15 to-gold/5 border border-gold/40 text-gold hover:border-gold hover:text-gold-light text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_20px_rgba(197,168,128,0.08)] cursor-pointer"
          >
            Share Your Journey
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTestimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, scale: 1.01 }}
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
                    <Select value={gender} onValueChange={(value) => setGender(value as 'MALE' | 'FEMALE')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Brother</SelectItem>
                        <SelectItem value="FEMALE">Sister</SelectItem>
                      </SelectContent>
                    </Select>
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