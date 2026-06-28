"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  const targetRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  // Video translates down, scales up, and fades out as user scrolls down
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.8], [0.4, 0]);

  // Main text content shifts up and fades out
  const contentY = useTransform(scrollYProgress, [0, 1], ["0px", "100px"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={targetRef}
      className="relative z-10 py-32 md:py-40 flex items-center justify-center bg-white overflow-hidden"
    >
      {/* Background Video with Parallax */}
      <motion.div
        style={{
          y: videoY,
          scale: videoScale,
          opacity: videoOpacity,
        }}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4"
            type="video/mp4"
          />
        </video>
      </motion.div>

      {/* Light Overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white/80 z-[1] pointer-events-none" />

      {/* Content wrapper with scroll parallax */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-wide text-center relative z-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-[var(--color-bg-offwhite)] border border-[var(--color-border-light)] px-4 py-2 rounded-full mb-8 text-sm text-[var(--color-text-body)] shadow-sm"
        >
          <Sparkles size={14} className="text-[var(--color-secondary-lavender)]" />
          <span className="font-medium">Project-based internship program</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-[var(--font-syne)] text-[36px] sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-[var(--color-text-dark)] mb-6 tracking-tight"
        >
          Build something real
          <br />
          <span className="text-[var(--color-primary-blue)]">in 15 days</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-[var(--color-text-body)] text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          Join a hands-on, project-based internship. Pick your track, build a
          real project, get certified — all in just 15 days. No lectures. No
          filler. Just build.
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-[var(--color-text-muted)] text-sm italic mb-10"
        >
          &ldquo;We Build It. You Just Present It.&rdquo;
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/apply"
            className="btn-primary text-base flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            Apply Now
            <ArrowRight size={18} />
          </Link>
          <Link
            href="#tracks"
            className="btn-secondary text-base flex items-center justify-center w-full sm:w-auto"
          >
            Explore Tracks
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 pt-10 border-t border-[var(--color-border-light)] flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-6 max-w-2xl mx-auto"
        >
          {[
            { value: "15", label: "Days" },
            { value: "6", label: "Tracks" },
            { value: "100%", label: "Project-Based" },
          ].map((stat) => (
            <div key={stat.label} className="text-center sm:flex-1">
              <div className="text-3xl sm:text-4xl font-bold text-[var(--color-text-dark)] font-[var(--font-syne)] mb-1">
                {stat.value}
              </div>
              <div className="text-[var(--color-text-body)] text-sm font-medium uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
