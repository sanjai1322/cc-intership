"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const steps = [
  {
    num: "1",
    title: "Apply & Choose",
    desc: "Pick your track and select the plan that fits your career goals.",
  },
  {
    num: "2",
    title: "Get Selected",
    desc: "We review your application. If selected, you'll receive a confirmation.",
  },
  {
    num: "3",
    title: "Build It",
    desc: "You get 15 days to build a real-world project from scratch.",
  },
  {
    num: "4",
    title: "Get Certified",
    desc: "Submit your project, get evaluated, and receive your premium certificate.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[var(--color-bg-offwhite)] relative z-10">
      <div className="container-wide">
        <AnimatedSection className="text-center mb-20 max-w-2xl mx-auto" variant="zoom-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
            How it works
          </h2>
          <p className="text-[var(--color-text-body)] text-lg">
            A simple, no-nonsense process to build your portfolio and gain real
            experience.
          </p>
        </AnimatedSection>

        <div className="relative max-w-5xl mx-auto">
          {/* Horizontal connecting line (hidden on mobile) */}
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-[var(--color-border-light)] z-0 overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
              className="h-full bg-[var(--color-primary-blue)] opacity-60"
            />
          </div>

          {/* Vertical connecting line (visible on mobile, hidden on desktop) */}
          <div className="block md:hidden absolute top-[28px] bottom-[80px] left-1/2 -translate-x-1/2 w-0.5 bg-[var(--color-border-light)] z-0 overflow-hidden">
            <motion.div
              initial={{ height: "0%" }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
              className="w-full bg-[var(--color-primary-blue)] opacity-60"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
            {steps.map((step, i) => (
              <AnimatedSection
                key={step.num}
                delay={i * 0.12}
                variant="fade-up"
                duration={0.7}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-white border-2 border-[var(--color-border-light)] flex items-center justify-center font-[var(--font-syne)] font-bold text-xl text-[var(--color-text-dark)] mb-6 shadow-sm transition-colors duration-300 group-hover:border-[var(--color-primary-blue)] group-hover:text-[var(--color-primary-blue)]">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text-dark)] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--color-text-body)] leading-relaxed px-2">
                  {step.desc}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
