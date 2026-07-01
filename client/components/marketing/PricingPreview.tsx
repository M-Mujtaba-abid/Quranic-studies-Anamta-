"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import SectionHeading from "../ui/SectionHeading";

const plans = [
  {
    name: "Basic",
    price: 49,
    period: "/ month",
    description: "Perfect for beginners starting their Quran journey.",
    features: [
      "4 live classes per month",
      "1 certified teacher",
      "Course materials included",
      "Progress tracking",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
    gradient: "from-surface/80 to-surface/40",
    border: "border-border/60 hover:border-primary/40",
  },
  {
    name: "Standard",
    price: 99,
    period: "/ month",
    description: "Most popular for serious Quran learners.",
    features: [
      "8 live classes per month",
      "Choose your teacher",
      "All course materials",
      "Progress tracking & reports",
      "Priority support",
      "Recording of missed classes",
      "Free trial included",
    ],
    cta: "Start Learning",
    popular: true,
    gradient: "from-primary/20 via-surface/90 to-gold/5",
    border: "border-gold/50 shadow-[0_20px_50px_-12px_rgba(33,87,115,0.3)]",
  },
  {
    name: "Premium",
    price: 179,
    period: "/ month",
    description: "For dedicated students aiming for Hifz or Ijazah.",
    features: [
      "Unlimited live classes",
      "2 dedicated teachers",
      "Hifz / Ijazah track",
      "Weekly progress reports",
      "24/7 WhatsApp support",
      "Family discount (up to 3 kids)",
      "Completion certificate",
    ],
    cta: "Go Premium",
    popular: false,
    gradient: "from-surface/80 to-surface/40",
    border: "border-border/60 hover:border-primary/40",
  },
];

export default function PricingPreview() {
  return (
    <section className="relative overflow-hidden bg-bg py-24">
      {/* Dynamic ambient backgrounds configured for premium dark UI layout */}
      <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <SectionHeading
          badge="Pricing"
          title="Simple, transparent "
          highlight="pricing"
          subtitle="No hidden fees. No long-term contracts. Cancel anytime."
          center
        />

        <div className="grid gap-6 sm:grid-cols-3 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-b p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${plan.gradient} ${plan.border}`}
            >
              <div>
                {/* Header Layout Info */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-lg font-semibold text-text">{plan.name}</h3>
                  {plan.popular && (
                    <div className="flex items-center gap-1 rounded-md bg-gold/10 border border-gold/30 px-2.5 py-0.5 font-display text-[10px] font-bold tracking-wide text-gold">
                      <Sparkles size={10} className="fill-gold/20" />
                      MOST POPULAR
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-text-secondary min-h-[32px]">{plan.description}</p>

                {/* Price block layout tag */}
                <div className="my-6 flex items-baseline gap-1 border-b border-border/30 pb-5">
                  <span className="font-display text-4xl font-bold tracking-tight text-text">${plan.price}</span>
                  <span className="font-display text-xs font-medium text-text-secondary">{plan.period}</span>
                </div>

                {/* Features Tracking List */}
                <ul className="mb-8 flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-primary/10 border border-primary/30">
                        <Check size={11} className="text-gold" strokeWidth={3} />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dynamic Call-to-Actions matching the naye buttons profile */}
              <Link
                href="/pricing"
                className={`w-full block rounded-xl py-3 text-center font-display text-xs font-semibold backdrop-blur-sm transition-all duration-300 ${
                  plan.popular
                    ? "bg-primary border border-primary-light/40 text-text shadow-[0_4px_24px_rgba(33,87,115,0.4)] hover:border-gold hover:text-gold hover:scale-[1.02]"
                    : "border border-primary/60 bg-primary/5 text-text hover:border-gold hover:bg-gold/10 hover:text-gold"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footnote Link */}
        <p className="mt-12 text-center text-sm text-text-secondary">
          Not sure which plan?{" "}
          <Link href="/contact" className="font-semibold text-gold underline underline-offset-4 transition-colors hover:text-gold-light">
            Book a free consultation
          </Link>
        </p>
      </div>
    </section>
  );
}