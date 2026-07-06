"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileCheck,
  CreditCard,
  XCircle,
  Users,
  Copyright,
  ShieldAlert,
  RefreshCcw,
  Mail,
  ArrowUp,
  ChevronRight,
} from "lucide-react";

const sections = [
  {
    id: "acceptance",
    icon: FileCheck,
    title: "Acceptance of Terms",
    content: (
      <p>
        By accessing or using Anamta Institute&apos;s website and services, you
        agree to be bound by these Terms &amp; Conditions. If you do not agree,
        please discontinue use of our services.
      </p>
    ),
  },
  {
    id: "services",
    icon: FileCheck,
    title: "Our Services",
    content: (
      <p>
        Anamta Institute provides online Quran and Islamic studies education,
        connecting students with certified, ijazah-holding teachers through
        scheduled online classes.
      </p>
    ),
  },
  {
    id: "enrollment",
    icon: CreditCard,
    title: "Enrollment & Payments",
    content: (
      <ul className="flex flex-col gap-2.5">
        {[
          "Enrollment is confirmed only after successful payment or approval of a free trial.",
          "Course fees, schedules, and pricing are as displayed on our Pricing page.",
          "We reserve the right to change fees with prior notice.",
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
    id: "cancellations",
    icon: XCircle,
    title: "Cancellations & Refunds",
    content: (
      <p>
        Refund eligibility depends on the timing of cancellation and course
        policy communicated at enrollment. Please contact us directly for
        refund requests.
      </p>
    ),
  },
  {
    id: "conduct",
    icon: Users,
    title: "Student Conduct",
    content: (
      <p>
        Students are expected to attend classes respectfully and punctually.
        Anamta Institute reserves the right to suspend access for abusive or
        disruptive behavior toward teachers or staff.
      </p>
    ),
  },
  {
    id: "ip",
    icon: Copyright,
    title: "Intellectual Property",
    content: (
      <p>
        All course materials, content, and branding on this platform are the
        property of Anamta Institute and may not be reproduced or redistributed
        without permission.
      </p>
    ),
  },
  {
    id: "liability",
    icon: ShieldAlert,
    title: "Limitation of Liability",
    content: (
      <p>
        Anamta Institute is not liable for indirect or incidental damages
        arising from the use of our services, to the extent permitted by law.
      </p>
    ),
  },
  {
    id: "changes",
    icon: RefreshCcw,
    title: "Changes to Terms",
    content: (
      <p>
        We may revise these Terms at any time. Continued use of our services
        after changes constitutes acceptance of the updated Terms.
      </p>
    ),
  },
  {
    id: "contact",
    icon: Mail,
    title: "Contact Us",
    content: (
      <p>
        For any questions regarding these Terms, contact us at{" "}
        <span className="font-medium text-gold">anamtainstitute@gmail.com</span>{" "}
        or via WhatsApp at{" "}
        <span className="font-medium text-gold">+92 333 0493239</span>.
      </p>
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

export default function TermsPage() {
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
      {/* Background glows */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full blur-[140px]"
        style={{ background: "rgba(33,87,115,0.12)" }}
      />
      <div
        className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full blur-[120px]"
        style={{ background: "rgba(201,162,39,0.05)" }}
      />

      <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-10">
        {/* ── Hero ── */}
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
            Terms &amp; Conditions
          </h1>
          <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
            Please read these terms carefully before using Anamta Institute&apos;s
            Quran learning services. Last updated{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            .
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
          {/* ── Sticky TOC (desktop only) ── */}
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

          {/* ── Content ── */}
          <div className="flex flex-col gap-5">
            {sections.map((s, i) => (
              <AnimatedSection key={s.id} id={s.id} icon={s.icon} title={s.title} index={i}>
                {s.content}
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* ── Back to top ── */}
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