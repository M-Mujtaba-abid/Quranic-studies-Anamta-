"use client";

import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  Database,
  Settings2,
  Share2,
  Lock,
  UserCheck,
  RefreshCcw,
  Mail,
  Phone,
  ArrowUp,
  ChevronRight,
} from "lucide-react";

const sections = [
  {
    id: "introduction",
    icon: ShieldCheck,
    title: "Introduction",
    content: (
      <p>
        Anamta Institute (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting
        your privacy. This Privacy Policy explains how we collect, use,
        disclose, and safeguard your information when you use our website
        and Quran learning services.
      </p>
    ),
  },
  {
    id: "collect",
    icon: Database,
    title: "Information We Collect",
    content: (
      <ul className="flex flex-col gap-2.5">
        {[
          "Personal details: name, email address, phone number (including WhatsApp).",
          "Enrollment and payment information for course registration.",
          "Communication data when you contact us or subscribe to our newsletter.",
          "Usage data such as pages visited and time spent on our platform.",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <ChevronRight size={14} className="mt-1 shrink-0 text-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "usage",
    icon: Settings2,
    title: "How We Use Your Information",
    content: (
      <ul className="flex flex-col gap-2.5">
        {[
          "To provide, operate, and maintain our Quran learning services.",
          "To schedule classes and connect you with certified teachers.",
          "To process payments and manage enrollments.",
          "To send course updates, reminders, and newsletters (only if subscribed).",
          "To respond to inquiries and provide customer support.",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <ChevronRight size={14} className="mt-1 shrink-0 text-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "sharing",
    icon: Share2,
    title: "Data Sharing",
    content: (
      <p>
        We do not sell your personal information. We may share data with
        trusted teachers and staff strictly for the purpose of delivering
        our educational services, or when required by law.
      </p>
    ),
  },
  {
    id: "security",
    icon: Lock,
    title: "Data Security",
    content: (
      <p>
        We implement reasonable technical and organizational measures to
        protect your data against unauthorized access, alteration, or
        disclosure.
      </p>
    ),
  },
  {
    id: "rights",
    icon: UserCheck,
    title: "Your Rights",
    content: (
      <p>
        You may request access, correction, or deletion of your personal
        data at any time by contacting us at{" "}
        <a
          href="mailto:anamtainstitute@gmail.com"
          className="font-medium text-gold underline decoration-gold/30 underline-offset-2 transition-colors hover:decoration-gold"
        >
          anamtainstitute@gmail.com
        </a>
        .
      </p>
    ),
  },
  {
    id: "changes",
    icon: RefreshCcw,
    title: "Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. Changes will
        be posted on this page with an updated revision date.
      </p>
    ),
  },
  {
    id: "contact",
    icon: Mail,
    title: "Contact Us",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          If you have questions about this Privacy Policy, reach out to us
          anytime:
        </p>
        <div className="flex flex-col gap-2.5">
          <a
            href="mailto:anamtainstitute@gmail.com"
            className="group flex w-fit items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm text-text-secondary transition-all duration-200 hover:border-gold hover:text-text"
            style={{ borderColor: "rgba(33,87,115,0.3)", background: "rgba(33,87,115,0.08)" }}
          >
            <Mail size={15} className="text-gold" />
            anamtainstitute@gmail.com
          </a>
          <a
            href="https://wa.me/923330493239"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-fit items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm text-text-secondary transition-all duration-200 hover:border-gold hover:text-text"
            style={{ borderColor: "rgba(33,87,115,0.3)", background: "rgba(33,87,115,0.08)" }}
          >
            <Phone size={15} className="text-gold" />
            +92 333 0493239 (WhatsApp)
          </a>
        </div>
      </div>
    ),
  },
];

function AnimatedSection({
  id,
  icon: Icon,
  title,
  index,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  index: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`scroll-mt-28 rounded-2xl border p-6 transition-all duration-700 ease-out sm:p-8 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{
        borderColor: "rgba(33,87,115,0.2)",
        background: "rgba(33,87,115,0.04)",
        transitionDelay: visible ? "0ms" : `${index * 60}ms`,
      }}
    >
      <div className="mb-4 flex items-center gap-3.5">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: "rgba(201,162,39,0.12)",
            boxShadow: "0 0 0 1px rgba(201,162,39,0.25)",
          }}
        >
          <Icon size={18} className="text-gold" />
        </div>
        <h2 className="font-display text-lg font-semibold text-text sm:text-xl">
          <span className="mr-2 text-gold/50">{String(index + 1).padStart(2, "0")}</span>
          {title}
        </h2>
      </div>
      <div className="pl-[52px] text-sm leading-relaxed text-text-secondary sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  const [activeId, setActiveId] = useState(sections[0].id);
  const [showTop, setShowTop] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="relative overflow-hidden bg-surface">
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full blur-[140px]"
        style={{ background: "rgba(33,87,115,0.12)" }}
      />
      <div
        className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full blur-[120px]"
        style={{ background: "rgba(201,162,39,0.05)" }}
      />

      <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-10">
        <div
          className={`mb-14 max-w-2xl transition-all duration-700 ease-out ${
            heroVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <span
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold"
            style={{ borderColor: "rgba(201,162,39,0.3)", background: "rgba(201,162,39,0.08)" }}
          >
            Legal
          </span>
          <h1 className="font-display mb-3 text-3xl font-semibold text-text sm:text-4xl lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
            Your trust matters to us. Here&apos;s exactly how Anamta Institute
            collects, uses, and protects your personal information. Last
            updated{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            .
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <h4 className="mb-4 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                On this page
              </h4>
              <ul className="flex flex-col gap-1 border-l" style={{ borderColor: "rgba(33,87,115,0.2)" }}>
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <button
                      onClick={() => scrollTo(s.id)}
                      className={`-ml-px block border-l-2 py-1.5 pl-4 text-left text-xs leading-snug transition-all duration-200 ${
                        activeId === s.id
                          ? "border-gold text-text font-medium"
                          : "border-transparent text-text-secondary hover:text-text"
                      }`}
                    >
                      {i + 1}. {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="flex flex-col gap-5">
            {sections.map((s, i) => (
              <AnimatedSection key={s.id} id={s.id} icon={s.icon} title={s.title} index={i}>
                {s.content}
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border shadow-lg transition-all duration-300 hover:scale-110 ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        style={{
          borderColor: "rgba(201,162,39,0.3)",
          background: "rgba(20,20,20,0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        <ArrowUp size={16} className="text-gold" />
      </button>
    </main>
  );
}