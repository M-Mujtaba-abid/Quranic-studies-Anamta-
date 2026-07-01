"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";

const navLinks = [
  { label: "Courses", href: "/courses" },
  { label: "Teachers", href: "/teachers" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-gold/15 bg-surface/95 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          : "border-b border-transparent bg-surface/70 backdrop-blur-md"
      }`}
    >
      {/* thin gold gradient hairline */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative overflow-hidden rounded-xl ring-1 ring-gold/40 transition-all duration-300 group-hover:ring-gold/80 group-hover:shadow-[0_0_18px_-2px_rgba(201,162,39,0.55)]">
            <Image
              src="/logo/logo.jpeg"
              alt="Anamta Institute"
              width={50}
              height={50}
              className="h-12 w-12 object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-[17px] font-semibold tracking-[0.14em] text-text">
              ANAMTA
            </span>
            <span className="font-display mt-1 text-[10px] font-medium tracking-[0.32em] text-gold">
              INSTITUTE
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <ul className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group relative text-[13.5px] font-medium uppercase tracking-wide text-text-secondary transition-colors duration-200 hover:text-text"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-[1.5px] w-0 bg-gradient-to-r from-gold to-gold-light transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="hidden items-center gap-5 md:flex">
             <ThemeToggle />
          <button
            aria-label="Search"
            className="text-text-secondary transition-colors duration-200 hover:text-gold"
          >
            <Search size={18} strokeWidth={2} />
          </button>

          <Link
            href="/login"
            className="rounded-full border border-text-secondary/30 px-5 py-2.5 text-[13px] font-medium text-text transition-all duration-200 hover:border-gold hover:text-gold"
          >
            Sign In
          </Link>

          <Link
            href="/courses"
            className="relative overflow-hidden rounded-full bg-gradient-to-r from-gold to-gold-light px-6 py-2.5 text-[13px] font-semibold text-primary-dark shadow-[0_4px_14px_-2px_rgba(201,162,39,0.5)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_6px_20px_-2px_rgba(201,162,39,0.7)]"
          >
            Start Learning
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="text-text md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-gold/10 bg-surface transition-all duration-300 md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-5">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2.5 text-sm font-medium uppercase tracking-wide text-text-secondary transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-3 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-full border border-text-secondary/30 px-5 py-3 text-center text-sm font-medium text-text"
            >
              Sign In
            </Link>
            <Link
              href="/courses"
              onClick={() => setOpen(false)}
              className="rounded-full bg-gradient-to-r from-gold to-gold-light px-6 py-3 text-center text-sm font-semibold text-primary-dark"
            >
              Start Learning
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}