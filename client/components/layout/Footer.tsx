"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";
import { SUBSCRIBE_TO_NEWSLETTER } from "@/graphql";

const footerLinks = {
  Learn: [
    { label: "All Courses", href: "/courses" },
    { label: "Tajweed", href: "/courses?category=tajweed" },
    { label: "Hifz Program", href: "/courses?category=hifz" },
    { label: "Quranic Arabic", href: "/courses?category=arabic" },
    { label: "Kids Quran", href: "/courses?category=kids" },
    { label: "Tafsir", href: "/courses?category=tafsir" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Our Teachers", href: "/teachers" },
    { label: "Pricing", href: "/pricing" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Support: [
    { label: "FAQ", href: "/faq" },
    { label: "Book Free Trial", href: "/contact" },
    { label: "Student Dashboard", href: "/dashboard" },
    { label: "My Courses", href: "/my-courses" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

const socials = [
  {
    label: "Facebook",
    href: "#",
    svg: (
      <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    svg: (
      <svg
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    svg: (
      <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "#",
    svg: (
      <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const [subscribe, { loading }] = useMutation(SUBSCRIBE_TO_NEWSLETTER, {
    onCompleted: () => {
      toast.success("Subscribed! You'll get an email whenever we add a new course.");
      setEmail("");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to subscribe. Please try again.");
    },
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.warning("Please enter your email address.");
      return;
    }

    await subscribe({
      variables: { subscribeNewsletterInput: { email: email.trim() } },
    });
  };

  return (
    <footer className="relative overflow-hidden bg-surface">
      {/* Top gold hairline */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Background glows */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full blur-[140px]"
        style={{ background: "rgba(33,87,115,0.12)" }}
      />
      <div
        className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full blur-[120px]"
        style={{ background: "rgba(201,162,39,0.04)" }}
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-6 lg:px-10">
        {/* ── Main grid ── */}
        <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-[1.8fr_1fr_1fr_1fr] lg:gap-12">
          {/* Brand column */}
          <div>
            <Link href="/" className="group mb-6 flex items-center gap-3">
              <div
                className="overflow-hidden rounded-xl transition-all duration-300"
                style={{ boxShadow: "0 0 0 1px rgba(201,162,39,0.3)" }}
              >
                <Image
                  src="/logo.jpeg"
                  alt="Anamta Institute"
                  width={44}
                  height={44}
                  className="h-11 w-11 object-cover"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-base font-semibold tracking-[0.14em] text-text">
                  ANAMTA
                </span>
                <span className="font-display mt-1 text-[9px] font-medium tracking-[0.3em] text-gold">
                  INSTITUTE
                </span>
              </div>
            </Link>

            <p className="mb-6 max-w-xs text-sm leading-relaxed text-text-secondary">
              A modern Quran learning platform connecting students worldwide
              with certified, ijazah-holding teachers — one lesson at a time.
            </p>

            {/* Contact */}
            <ul className="mb-8 flex flex-col gap-3">
              <li className="flex items-start gap-2.5 text-[11px] leading-relaxed text-text-secondary sm:text-xs">
                <Mail size={13} className="mt-0.5 shrink-0 text-gold" />
                <span className="break-all">support@anamtainstitute.com</span>
              </li>
              <li className="flex items-start gap-2.5 text-[11px] leading-relaxed text-text-secondary sm:text-xs">
                <Phone size={13} className="mt-0.5 shrink-0 text-gold" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-start gap-2.5 text-[11px] leading-relaxed text-text-secondary sm:text-xs">
                <MapPin size={13} className="mt-0.5 shrink-0 text-gold" />
                <span>Online · Serving 30+ Countries</span>
              </li>
            </ul>

            {/* Socials */}
            <div className="flex flex-wrap gap-3">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-secondary transition-all duration-200 hover:border-gold hover:text-gold"
                  style={{ background: "rgba(33,87,115,0.1)" }}
                >
                  {s.svg}
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="mb-5 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                {heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1.5 text-sm text-text-secondary transition-colors duration-200 hover:text-text"
                    >
                      <span className="h-[1px] w-0 bg-gold transition-all duration-300 group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Newsletter strip ── */}
        <div
          className="my-12 rounded-2xl border p-6 sm:p-8"
          style={{
            borderColor: "rgba(33,87,115,0.3)",
            background: "rgba(33,87,115,0.08)",
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="font-display text-base font-semibold text-text">
                Get weekly Quran reminders
              </h4>
              <p className="mt-1 text-xs text-text-secondary">
                Course updates, Islamic reminders, and student stories — straight
                to your inbox.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text outline-none transition-colors duration-200 placeholder:text-text-secondary/50 focus:border-gold/50"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-gold to-gold-light px-5 py-2.5 text-xs font-semibold text-primary-dark transition-all duration-300 hover:scale-[1.03] disabled:opacity-60 disabled:pointer-events-none"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="flex flex-col items-center justify-between gap-5 border-t pt-8 sm:flex-row sm:gap-4"
          style={{ borderColor: "rgba(33,87,115,0.2)" }}
        >
          <p className="text-center text-[11px] text-text-secondary sm:text-left">
            © {new Date().getFullYear()} Anamta Institute. All rights reserved.
          </p>

          <div className="flex items-center gap-1 text-[11px] text-text-secondary">
            <span>Made with</span>
            <span className="mx-0.5 text-gold">♥</span>
            <span>for Quran learners worldwide</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <Link
              href="/privacy-policy"
              className="text-[11px] text-text-secondary transition-colors hover:text-gold"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-[11px] text-text-secondary transition-colors hover:text-gold"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-[11px] text-text-secondary transition-colors hover:text-gold"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}