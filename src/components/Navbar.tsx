"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-[var(--color-border-light)] shadow-[0_2px_20px_rgba(0,0,0,0.04)]"
          : "bg-white border-b border-[var(--color-border-light)]"
      }`}
    >
      <div
        className={`container-wide flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "h-16" : "h-20"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 z-50 overflow-hidden bg-transparent">
          <img
            src="/logo.png"
            alt="Code Constellation Logo"
            className="h-8 w-auto object-contain"
            style={{ background: "transparent" }}
          />
          <span className="font-[var(--font-syne)] font-bold text-xl text-[var(--color-text-dark)] hidden sm:block">
            Code Constellation
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#tracks"
            className="text-sm font-medium text-[var(--color-text-body)] hover:text-[var(--color-primary-blue)] transition-colors"
          >
            Tracks
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-[var(--color-text-body)] hover:text-[var(--color-primary-blue)] transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="/#pricing"
            className="text-sm font-medium text-[var(--color-text-body)] hover:text-[var(--color-primary-blue)] transition-colors"
          >
            Pricing
          </Link>
          <Link href="/apply" className="btn-primary">
            Apply Now
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden z-50 text-[var(--color-text-dark)] p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-white border-b border-[var(--color-border-light)] shadow-lg py-6 px-6 flex flex-col gap-6 md:hidden"
            >
              <Link
                href="/#tracks"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-[var(--color-text-dark)]"
              >
                Tracks
              </Link>
              <Link
                href="/#how-it-works"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-[var(--color-text-dark)]"
              >
                How it Works
              </Link>
              <Link
                href="/#pricing"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-[var(--color-text-dark)]"
              >
                Pricing
              </Link>
              <Link
                href="/apply"
                onClick={() => setIsOpen(false)}
                className="btn-primary text-center mt-2 w-full block"
              >
                Apply Now
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
