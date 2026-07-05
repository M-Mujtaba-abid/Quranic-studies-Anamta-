"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Courses", href: "/courses" },
  // { label: "Teachers", href: "/teachers" },
  // { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Enrollement", href: "/enrollement" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? "border-b border-primary/20 bg-bg/80 shadow-[0_8px_30px_rgb(0,0,0,0.3)] backdrop-blur-xl"
        : "border-b border-transparent bg-transparent"
        }`}
    >
      {/* Premium subtle Regatta border accent line over the header frame */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
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

        {/* Navigation Core Center Links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group relative font-display text-xs font-semibold uppercase tracking-widest text-text-secondary transition-colors duration-200 hover:text-text"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
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

          <Link
            href="/Sponser-a-Student"
            className="rounded-xl border border-primary/60 bg-primary/5 px-5 py-2.5 font-display text-xs font-semibold text-text backdrop-blur-sm transition-all duration-300 hover:border-gold hover:text-gold"
          >
            Sponser a Student
          </Link>

          <Link
            href="/courses"
            className="block rounded-xl bg-primary border border-primary-light/30 px-5 py-2.5 font-display text-xs font-semibold text-text shadow-[0_4px_24px_rgba(33,87,115,0.4)] transition-all duration-300 hover:scale-[1.02] hover:border-gold hover:text-gold"
          >
            Start Learning
          </Link>
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
      <div
        className={`overflow-hidden bg-bg/95 backdrop-blur-xl border-b border-primary/10 transition-all duration-300 md:hidden ${open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-6 border-t border-primary/10">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-display text-xs font-semibold uppercase tracking-widest text-text-secondary transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-4 flex flex-col gap-3 pt-4 border-t border-primary/10">
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-primary/50 bg-primary/5 py-3 text-center font-display text-xs font-semibold text-text"
            >

            </Link>
            <Link
              href="/courses"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-primary border border-primary-light/20 py-3 text-center font-display text-xs font-semibold text-text shadow-lg shadow-primary/20"
            >
              Start Learning
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}