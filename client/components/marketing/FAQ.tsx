"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import SectionHeading from "../ui/SectionHeading";

const faqs = [
  {
    q: "Do I need any prior knowledge to start?",
    a: "No. We have courses for absolute beginners — starting from the Arabic alphabet (Noorani Qaida) all the way to advanced Tajweed and Hifz. Your teacher will assess your level in the free trial and recommend the right starting point.",
  },
  {
    q: "How does the free trial work?",
    a: "Book a 30-minute free trial class with any teacher. You'll experience a real class session with no commitment. If you're happy, you can enroll in a plan — if not, there's no charge whatsoever.",
  },
  {
    q: "Are there female teachers available?",
    a: "Yes. We have dedicated female teachers for sisters and children. You can filter by teacher gender when browsing our teachers page or simply mention your preference when booking your trial.",
  },
  {
    q: "What platform is used for classes?",
    a: "Classes are conducted via Zoom or Google Meet — whichever you prefer. You'll receive a link before each session. No software installation is required if you use the web version.",
  },
  {
    q: "Can I reschedule or cancel a class?",
    a: "Yes. You can reschedule any class with at least 4 hours notice at no charge. We understand life gets busy — flexibility is one of the things our students love most about us.",
  },
  {
    q: "Is there a certificate at the end?",
    a: "Yes. All students who complete a course receive a digital certificate of completion. Students on the Ijazah track receive a traditional Ijazah certificate signed by the teacher.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className={`overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300 ${
        open ? "border-primary/50 bg-surface/80 shadow-[0_12px_30px_-10px_rgba(33,87,115,0.2)]" : "border-border/60 bg-surface/30 hover:border-primary/30"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left group"
      >
        <span className={`font-display text-sm font-semibold transition-colors duration-200 sm:text-base ${open ? "text-gold" : "text-text group-hover:text-gold/80"}`}>
          {q}
        </span>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
          open 
            ? "border-gold bg-gold/10 text-gold" 
            : "border-border/80 text-text-secondary group-hover:border-primary/50 group-hover:text-text"
        }`}>
          {open ? <Minus size={13} strokeWidth={2.5} /> : <Plus size={13} strokeWidth={2.5} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="border-t border-border/30 px-6 pb-5 pt-4 text-sm leading-relaxed text-text-secondary">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section className="relative overflow-hidden bg-bg py-24">
      {/* Syncing global light aura matrix to Regatta Blue profiles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(33,87,115,0.12)_0%,transparent_80%)]" />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-6 lg:px-10">
        <SectionHeading
          badge="FAQ"
          title="Questions we get "
          highlight="asked the most"
          subtitle="Can't find your answer? Reach out and we'll get back to you within a few hours."
          center
        />

        <div className="flex flex-col gap-3.5">
          {faqs.map((faq, index) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} index={index} />
          ))}
        </div>

        {/* Re-designed structural footer actions */}
        <div className="mt-14 text-center">
          <p className="mb-4 font-display text-sm font-medium text-text-secondary">Still have questions?</p>
          <Link
            href="/contact"
            className="inline-block rounded-xl border border-primary/60 bg-primary/5 px-8 py-3 font-display text-xs font-semibold text-text backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-gold hover:bg-gold/10 hover:text-gold"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}