"use client";

import { Globe, Brain, Palette, Layers, Terminal, Coffee, MessageSquare, Code2, Cloud, Network, Lock, Clock } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import Card from "./GlassCard";

const activeTracks = [
  {
    icon: Globe,
    title: "Frontend / Web Dev",
    description: "Build an animated, deployed landing page using GSAP, Three.js, and Lenis smooth scroll",
    color: "text-[var(--color-primary-blue)]",
    bg: "bg-blue-50",
  },
  {
    icon: Brain,
    title: "AI / ML",
    description: "Build a working machine learning model with a clean web interface, fully deployed",
    color: "text-[var(--color-secondary-lavender)]",
    bg: "bg-purple-50",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Design a complete app UI kit or product redesign in Figma with a real case study",
    color: "text-[var(--color-primary-blue)]",
    bg: "bg-blue-50",
  },
  {
    icon: Layers,
    title: "Full Stack",
    description: "Build a complete web application with frontend, backend, database, and authentication",
    color: "text-[var(--color-secondary-lavender)]",
    bg: "bg-purple-50",
  },
  {
    icon: Terminal,
    title: "Python / Backend",
    description: "Build a production-ready REST API or automation tool using Python and FastAPI",
    color: "text-[var(--color-primary-blue)]",
    bg: "bg-blue-50",
  },
  {
    icon: Coffee,
    title: "Java Development",
    description: "Build a Spring Boot REST API or a functional Android app from scratch",
    color: "text-[var(--color-secondary-lavender)]",
    bg: "bg-purple-50",
  },
  {
    icon: MessageSquare,
    title: "Prompt Engineering",
    description: "Build real AI prompt systems, GPT-powered tools, and LLM integrations",
    color: "text-[var(--color-primary-blue)]",
    bg: "bg-blue-50",
  },
];

const comingSoonTracks = [
  { icon: Code2, title: "React / Next.js" },
  { icon: Cloud, title: "DevOps / Cloud" },
  { icon: Network, title: "DSA / Problem Solving" },
];

export default function TracksSection() {
  return (
    <section id="tracks" className="py-24 bg-[var(--color-bg-offwhite)] relative z-10">
      <div className="container-wide">
        <AnimatedSection className="text-center mb-16 max-w-2xl mx-auto" variant="zoom-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
            Pick your track
          </h2>
          <p className="text-[var(--color-text-body)] text-lg">
            Choose a specialization. We'll give you a real-world problem statement
            to solve and build from scratch.
          </p>
        </AnimatedSection>

        {/* Active Tracks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activeTracks.map((track, i) => (
            <AnimatedSection
              key={track.title}
              delay={i * 0.08}
              variant="fade-up"
              duration={0.7}
              className="h-full"
            >
              <Card className="h-full flex flex-col group relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-blue-50 border border-blue-100 text-[var(--color-primary-blue)] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Clock size={12} />
                  15 Days
                </div>
                <div className={`w-14 h-14 rounded-2xl ${track.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <track.icon size={28} className={track.color} />
                </div>
                <h3 className="text-xl mb-3 text-[var(--color-text-dark)] pr-20">{track.title}</h3>
                <p className="text-[var(--color-text-body)] text-sm leading-relaxed flex-grow">
                  {track.description}
                </p>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        {/* Coming Soon Tracks */}
        <div className="pt-10 border-t border-[var(--color-border-light)]">
          <h3 className="text-center text-xl font-[var(--font-syne)] font-bold text-[var(--color-text-muted)] mb-8">
            Coming Soon
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-70">
            {comingSoonTracks.map((track, i) => (
              <AnimatedSection
                key={track.title}
                delay={0.5 + i * 0.1}
                variant="fade-up"
                className="h-full"
              >
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex items-center gap-4 relative grayscale">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <track.icon size={24} className="text-gray-500" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-600 flex-grow">{track.title}</h4>
                  <div className="bg-gray-200 p-2 rounded-full flex-shrink-0">
                    <Lock size={16} className="text-gray-500" />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
