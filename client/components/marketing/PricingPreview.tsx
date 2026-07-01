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
    gradient: "from-surface to-surface",
    border: "border-border",
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
    gradient: "from-primary/20 to-gold/5",
    border: "border-gold/40",
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
    gradient: "from-surface to-surface",
    border: "border-border",
  },
];

export default function PricingPreview() {
  return (
    <section className="relative overflow-hidden bg-surface py-24">
      <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-gold/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <SectionHeading
          badge="Pricing"
          title="Simple, transparent "
          highlight="pricing"
          subtitle="No hidden fees. No long-term contracts. Cancel anytime."
          center
        />

        <div className="grid gap-6 sm:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex flex-col overflow-hidden rounded-2xl border bg-gradient-to-b p-7 transition-all duration-300 hover:-translate-y-1 ${plan.gradient} ${plan.border} ${plan.popular ? "shadow-[0_0_60px_-12px_rgba(201,162,39,0.3)]" : ""}`}
            >
              {plan.popular && (
                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold text-primary-dark">
                  <Sparkles size={11} />
                  Most Popular
                </div>
              )}

              <h3 className="font-display text-lg font-semibold text-text">{plan.name}</h3>
              <p className="mt-1 text-xs text-text-secondary">{plan.description}</p>

              <div className="my-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold text-text">${plan.price}</span>
                <span className="text-sm text-text-secondary">{plan.period}</span>
              </div>

              <ul className="mb-8 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <Check size={15} className="mt-0.5 shrink-0 text-gold" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/pricing"
                className={`mt-auto block rounded-full py-3 text-center text-sm font-semibold transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-r from-gold to-gold-light text-primary-dark shadow-[0_4px_20px_-4px_rgba(201,162,39,0.5)] hover:scale-[1.03]"
                    : "border border-gold/40 text-gold hover:bg-gold hover:text-primary-dark"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-text-secondary">
          Not sure which plan?{" "}
          <Link href="/contact" className="text-gold underline underline-offset-2">
            Book a free consultation
          </Link>
        </p>
      </div>
    </section>
  );
}