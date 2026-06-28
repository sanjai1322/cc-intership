import type { Metadata } from "next";
import ApplicationForm from "@/components/ApplicationForm";

export const metadata: Metadata = {
  title: "Apply — Code Constellation Internships",
  description:
    "Submit your application for the Code Constellation 15-day project-based internship program.",
};

export default function ApplyPage() {
  return (
    <section className="relative z-10 min-h-screen pt-28 pb-16">
      <div className="mx-auto max-w-3xl px-4 text-center mb-8">
        <h1 className="font-[var(--font-syne)] text-3xl sm:text-4xl font-bold text-text-primary mb-3">
          Apply to <span className="gradient-text">Code Constellation</span>
        </h1>
        <p className="text-text-secondary text-base">
          Fill out the form below — it only takes 2 minutes.
        </p>
      </div>
      <ApplicationForm />
    </section>
  );
}
