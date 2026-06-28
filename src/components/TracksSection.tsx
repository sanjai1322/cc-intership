"use client";

import { Globe, Brain, Palette, PenTool, Film, TrendingUp } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import Card from "./GlassCard";

const tracks = [
  {
    icon: Globe,
    title: "Frontend / Web Dev",
    description: "Build modern, responsive web apps using React, Next.js, and Tailwind CSS.",
    color: "text-[var(--color-primary-blue)]",
    bg: "bg-blue-50",
  },
  {
    icon: Brain,
    title: "AI / ML",
    description: "Train models, build AI wrappers, and deploy intelligent applications.",
    color: "text-[var(--color-secondary-lavender)]",
    bg: "bg-purple-50",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Design wireframes, prototypes, and beautiful interfaces in Figma.",
    color: "text-[var(--color-primary-blue)]",
    bg: "bg-blue-50",
  },
  {
    icon: PenTool,
    title: "Content & Social",
    description: "Create engaging content, manage socials, and build organic growth.",
    color: "text-[var(--color-secondary-lavender)]",
    bg: "bg-purple-50",
  },
  {
    icon: Film,
    title: "Video Editing",
    description: "Edit high-retention short-form and long-form video content.",
    color: "text-[var(--color-primary-blue)]",
    bg: "bg-blue-50",
  },
  {
    icon: TrendingUp,
    title: "Lead Generation",
    description: "Master B2B outreach, cold emailing, and pipeline generation.",
    color: "text-[var(--color-secondary-lavender)]",
    bg: "bg-purple-50",
  },
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track, i) => (
            <AnimatedSection
              key={track.title}
              delay={i * 0.08}
              variant="fade-up"
              duration={0.7}
              className="h-full"
            >
              <Card className="h-full flex flex-col group">
                <div className={`w-14 h-14 rounded-2xl ${track.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <track.icon size={28} className={track.color} />
                </div>
                <h3 className="text-xl mb-3 text-[var(--color-text-dark)]">{track.title}</h3>
                <p className="text-[var(--color-text-body)] text-sm leading-relaxed flex-grow">
                  {track.description}
                </p>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
