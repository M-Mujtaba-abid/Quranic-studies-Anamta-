"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, X, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import SectionHeading from "../ui/SectionHeading";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { GET_APPROVED_TESTIMONIALS, SUBMIT_TESTIMONIAL } from "@/graphql";
// Minimal silhouette-style avatars — no facial features, just clean shapes
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

    {/* Plain round face — no features */}
    <circle cx="50" cy="38" r="17" fill="url(#maleSkin)" />

    {/* Kufi cap — gold, bold and prominent on top */}
    <path
      d="M 32 27 Q 50 4 68 27 Q 69 32 63 32 Q 50 25 37 32 Q 31 32 32 27 Z"
      fill="#c9a227"
      stroke="#8a6d15"
      strokeWidth="1"
    />
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

    {/* Abaya/robe body — gold tone */}
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

    {/* Plain round face — no features */}
    <ellipse cx="50" cy="35" rx="14" ry="16" fill="url(#femaleSkin)" />
  </svg>
);

export default function Testimonials() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [country, setCountry] = useState("");
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState("");

  // Query approved testimonials — sourced entirely from the backend
  const { data, refetch } = useQuery<any>(GET_APPROVED_TESTIMONIALS);
  const displayTestimonials = data?.approvedTestimonials || [];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })]
  );
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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

  return (
    <section
      className="relative overflow-hidden py-24"
      style={{
        background: `
          radial-gradient(ellipse 55% 45% at 12% 0%, rgba(197,168,128,0.14) 0%, transparent 60%),
          radial-gradient(ellipse 60% 55% at 100% 100%, rgba(11,58,85,0.45) 0%, transparent 65%),
          linear-gradient(155deg, #070b0e 0%, #0d131a 35%, #0b1f2c 65%, #072537 100%)
        `,
      }}
    >
      {/* Dynamic ambient backgrounds configured for premium dark UI layout */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(197,168,128,0.06)_0%,transparent_80%)] pointer-events-none" />
      <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="mb-12">
          <SectionHeading
            badge="Testimonials"
            title="What Our Students "
            highlight="Say"
            subtitle="Real stories from real students — from beginners who couldn't read Arabic to those now teaching others."
            center
          />
          <div className="flex justify-center md:justify-end">
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
        </div>

        {displayTestimonials.length > 0 ? (
          <div className="relative">
            <div className="overflow-hidden -mx-3" ref={emblaRef}>
              <div className="flex">
                {displayTestimonials.map((t: any) => (
                  <div
                    key={t.id}
                    className="min-w-0 flex-[0_0_88%] px-3 sm:flex-[0_0_50%] lg:flex-[0_0_34%]"
                  >
                    <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.5)] glow-gold-hover">
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
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual navigation */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={scrollPrev}
                aria-label="Previous testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-all duration-300 hover:border-gold/50 hover:text-gold cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-all duration-300 hover:border-gold/50 hover:text-gold cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-text-secondary">
            Be the first to share your journey.
          </p>
        )}
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
                <div className="inline-flex h-10 w-10 overflow-hidden rounded-full bg-gold/10 items-center justify-center mb-3">
                  <Image src="/logo.jpeg" alt="Anamta Institute" width={40} height={40} className="h-full w-full object-cover" />
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