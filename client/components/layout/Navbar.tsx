"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, UserCircle } from "lucide-react";
import { useCountrySelection } from "@/providers/CountryProvider";
import { getMyEnrollmentIds } from "@/lib/my-enrollment-ids";

const navLinks = [
  { label: "Courses", href: "/courses" },
  { label: "Enrolment", href: "/enrollement" },
  // { label: "Teachers", href: "/teachers" },
  // { label: "Pricing", href: "/pricing" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const { openModeSelectionModal, openTrialModal } = useCountrySelection();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Empty on the server (and on first client render, to avoid a hydration mismatch) —
  // populated from localStorage right after mount, client-only by nature.
  const [myEnrollmentIds, setMyEnrollmentIds] = useState<string[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMyEnrollmentIds(getMyEnrollmentIds());
  }, []);

  const latestEnrollmentId = myEnrollmentIds[myEnrollmentIds.length - 1];

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: scrolled ? "rgba(10, 15, 20, 0.84)" : "rgba(10, 15, 20, 0)",
        backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        boxShadow: scrolled ? "0 8px 30px rgba(0,0,0,0.3)" : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? "border-b border-primary/20 bg-bg/80 shadow-[0_8px_30px_rgb(0,0,0,0.3)] backdrop-blur-xl"
        : "border-b border-transparent bg-transparent"
        }`}
    >
      {/* Premium subtle Regatta border accent line over the header frame */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Mobile-only centered wordmark — fills the empty space between logo and menu button */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-sm font-bold tracking-[0.1em] sm:hidden"
        >
          <span className="text-white">ANAMTA</span>{" "}
          <span className="text-gold">INSTITUTE</span>
        </Link>

        {/* Logo Section branding */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-surface/40 p-0.5 transition-all duration-300 group-hover:border-gold/60 group-hover:shadow-[0_0_20px_rgba(33,87,115,0.4)]">
            <Image
              src="/logo.jpeg"
              alt="Anamta Institute"
              width={44}
              height={44}
              className="h-10 w-10 rounded-lg object-cover transition-transform duration-300 group-hover:scale-102"
              priority
            />
          </div>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-base font-bold tracking-[0.16em] text-text">
              ANAMTA
            </span>
            <span className="font-display mt-1 text-[9px] font-bold tracking-[0.35em] text-gold">
              INSTITUTE
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              {link.label === "Courses" ? (
                <button
                  type="button"
                  onClick={openModeSelectionModal}
                  className="group relative font-display text-xs font-semibold uppercase tracking-widest text-text-secondary transition-colors duration-200 hover:text-text cursor-pointer text-left"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                </button>
              ) : (
                <Link
                  href={link.href}
                  className="group relative font-display text-xs font-semibold uppercase tracking-widest text-text-secondary transition-colors duration-200 hover:text-text"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Right Structural Profile Controls */}
        <div className="hidden items-center gap-4 md:flex">
          {/* <button
            aria-label="Search"
            className="p-2 text-text-secondary transition-colors duration-200 hover:text-gold"
          >
            <Search size={16} strokeWidth={2.5} />
          </button> */}

          {latestEnrollmentId && (
            <Link
              href={`/my-enrollment?enrollmentId=${latestEnrollmentId}`}
              aria-label="My Enrollment Profile"
              title="My Enrollment Profile"
              className="p-2 text-text-secondary transition-colors duration-200 hover:text-gold"
            >
              <UserCircle size={20} strokeWidth={2} />
            </Link>
          )}

          <Link
            href="/sponsor-a-student"
            className="rounded-xl border border-primary/60 bg-primary/5 px-5 py-2.5 font-display text-xs font-semibold text-text backdrop-blur-sm transition-all duration-300 hover:border-gold hover:text-gold"
          >
            Sponsor a Student
          </Link>

          <button
            onClick={openTrialModal}
            className="block rounded-xl bg-primary border border-primary-light/30 px-5 py-2.5 font-display text-xs font-semibold text-text shadow-[0_4px_24px_rgba(33,87,115,0.4)] transition-all duration-300 hover:scale-[1.02] hover:border-gold hover:text-gold cursor-pointer"
          >
            Book a Free Trial Class
          </button>
        </div>

        {/* Mobile menu toggle action */}
        <button
          className="rounded-xl border border-border/40 p-2 text-text transition-colors duration-200 hover:border-primary/50 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Responsive Navigation overlay tray */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: 420, opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-primary/10 bg-bg/95 backdrop-blur-xl md:hidden"
          >
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="flex flex-col gap-1 border-t border-primary/10 px-6 py-6"
            >
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.06 + index * 0.04 }}
                >
                  {link.label === "Courses" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        openModeSelectionModal();
                      }}
                      className="block w-full text-left py-3 font-display text-xs font-semibold uppercase tracking-widest text-text-secondary transition-colors hover:text-gold cursor-pointer"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 font-display text-xs font-semibold uppercase tracking-widest text-text-secondary transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.18 }}
                className="mt-4 flex flex-col gap-3 border-t border-primary/10 pt-4"
              >
                {latestEnrollmentId && (
                  <Link
                    href={`/my-enrollment?enrollmentId=${latestEnrollmentId}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-3 font-display text-xs font-semibold uppercase tracking-widest text-text-secondary transition-colors hover:text-gold"
                  >
                    <UserCircle size={14} strokeWidth={2.5} />
                    My Profile
                  </Link>
                )}
                <Link
                  href="/sponsor-a-student"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-primary/60 bg-primary/5 py-3 text-center font-display text-xs font-semibold text-text backdrop-blur-sm"
                >
                  Sponsor a Student
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    openTrialModal();
                  }}
                  className="rounded-xl border border-primary-light/20 bg-primary py-3 text-center font-display text-xs font-semibold text-text shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Book a Free Trial Class
                </button>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}