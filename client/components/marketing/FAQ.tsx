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
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className={`overflow-hidden rounded-xl border transition-all duration-300 ${
        open ? "border-gold/40 bg-surface" : "border-border bg-surface/50"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className={`text-sm font-semibold transition-colors duration-200 sm:text-base ${open ? "text-gold" : "text-text"}`}>
          {q}
        </span>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${open ? "border-gold bg-gold text-primary-dark" : "border-border text-text-secondary"}`}>
          {open ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="border-t border-border/50 px-6 pb-5 pt-4 text-sm leading-relaxed text-text-secondary">
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(15,81,50,0.08),transparent)]" />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-6 lg:px-10">
        <SectionHeading
          badge="FAQ"
          title="Questions we get "
          highlight="asked the most"
          subtitle="Can't find your answer? Reach out and we'll get back to you within a few hours."
          center
        />

        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-sm text-text-secondary">Still have questions?</p>
          <Link
            href="/contact"
            className="inline-block rounded-full border border-gold/40 px-8 py-3 text-sm font-medium text-gold transition-all duration-200 hover:bg-gold hover:text-primary-dark"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}