"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Globe,
  Brain,
  Palette,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Star,
  Sparkles,
  Upload,
  ArrowRight,
  Clock,
  Layers,
  Terminal,
  Coffee,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// ── Track data ──
const tracks = [
  { icon: Globe, name: "Frontend / Web Dev", color: "text-[var(--color-primary-blue)]" },
  { icon: Brain, name: "AI / ML", color: "text-[var(--color-secondary-lavender)]" },
  { icon: Palette, name: "UI/UX Design", color: "text-[var(--color-primary-blue)]" },
  { icon: Layers, name: "Full Stack", color: "text-[var(--color-secondary-lavender)]" },
  { icon: Terminal, name: "Python / Backend", color: "text-[var(--color-primary-blue)]" },
  { icon: Coffee, name: "Java Development", color: "text-[var(--color-secondary-lavender)]" },
  { icon: MessageSquare, name: "Prompt Engineering", color: "text-[var(--color-primary-blue)]" },
];

const skillLevels = ["Beginner", "Intermediate", "Advanced"];

const plans = [
  {
    name: "Starter",
    price: "₹999",
    tagline: "Project + milestone reviews + premium cert",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹1,499",
    tagline: "Everything + report + LinkedIn rec",
    popular: true,
  },
];

const stepTitles = ["About You", "Choose Track", "Skills", "Plan & Motivation"];

// ── Form data interface ──
interface FormData {
  full_name: string;
  college_year: string;
  city: string;
  whatsapp: string;
  email: string;
  track: string;
  skill_level: string;
  portfolio_link: string;
  plan: string;
  why: string;
}

export default function ApplicationForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    full_name: "",
    college_year: "",
    city: "",
    whatsapp: "",
    email: "",
    track: "",
    skill_level: "",
    portfolio_link: "",
    plan: "",
    why: "",
  });

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  // ── Validation per step ──
  const validateStep = (): boolean => {
    switch (step) {
      case 0:
        if (!form.full_name.trim()) return fail("Please enter your full name.");
        if (!form.college_year.trim()) return fail("Please enter your college & year.");
        if (!form.city.trim()) return fail("Please enter your city.");
        if (!form.whatsapp.trim()) return fail("Please enter your WhatsApp number.");
        if (!form.email.trim() || !form.email.includes("@")) return fail("Please enter a valid email.");
        return true;
      case 1:
        if (!form.track) return fail("Please select a track.");
        return true;
      case 2:
        if (!form.skill_level) return fail("Please select your skill level.");
        return true;
      case 3:
        if (!form.plan) return fail("Please select a plan.");
        if (!form.why.trim()) return fail("Please tell us why you want this internship.");
        return true;
      default:
        return true;
    }
  };

  const fail = (msg: string) => {
    setError(msg);
    return false;
  };

  const next = () => {
    if (!validateStep()) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const prev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
    setError("");
  };

  // ── Submit to Supabase + trigger emails ──
  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setError("");

    try {
      // Generate ID client-side to pass to the email API as a reference
      const generatedId = crypto.randomUUID();
      
      const submissionData = {
        full_name: form.full_name.trim(),
        college_year: form.college_year.trim(),
        city: form.city.trim(),
        whatsapp: form.whatsapp.trim(),
        email: form.email.trim(),
        track: form.track,
        skill_level: form.skill_level,
        portfolio_link: form.portfolio_link.trim() || null,
        plan: form.plan,
        why: form.why.trim(),
        status: "pending",
      };

      const { error: dbError } = await supabase
        .from("applications")
        .insert(submissionData);

      if (dbError) {
        console.error("Supabase insert failed:", JSON.stringify(dbError, null, 2));
        console.error("Error message:", dbError.message);
        console.error("Error code:", dbError.code);
        console.error("Error details:", dbError.details);
        console.error("Error hint:", dbError.hint);
        throw new Error(dbError.message || "Database insert failed");
      }

      fetch("/api/send-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...submissionData,
          application_id: generatedId,
        }),
      }).catch((emailErr) => {
        console.warn("Email send failed (non-blocking):", emailErr);
      });

      setSubmitted(true);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : JSON.stringify(err);
      console.error("Submit error (detailed):", errMsg, err);
      setError(errMsg || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Confirmation screen with next steps ──
  if (submitted) {
    const price = form.plan === "Starter" ? "₹999" : "₹1,499";

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[60vh] flex items-center justify-center px-4 py-12"
      >
        <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-2xl border border-[var(--color-border-light)] shadow-xl">
          {/* Success header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-[var(--color-success-green)] flex items-center justify-center mx-auto mb-6"
            >
              <Check size={36} className="text-white" />
            </motion.div>
            <h2 className="font-[var(--font-syne)] text-2xl sm:text-3xl font-bold text-[var(--color-text-dark)] mb-2">
              Application Received!
            </h2>
            <p className="text-[var(--color-text-body)] text-sm">
              Follow these steps to confirm your seat.
            </p>
          </div>

          {/* Next steps */}
          <div className="space-y-4">
            {/* Step 1 — Done */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50 border border-green-200">
              <div className="w-8 h-8 rounded-full bg-[var(--color-success-green)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[var(--color-text-dark)] font-bold text-sm">
                  Step 1 — Application submitted
                </p>
                <p className="text-green-700 text-xs mt-0.5">Completed ✅</p>
              </div>
            </div>

            {/* Step 2 — Pay */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary-blue)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <ArrowRight size={16} className="text-white" />
              </div>
              <div className="w-full">
                <p className="text-[var(--color-text-dark)] font-bold text-sm">
                  Step 2 — Pay via UPI
                </p>
                <p className="text-[var(--color-text-body)] text-xs mt-1 leading-relaxed mb-4">
                  Send <strong className="text-[var(--color-primary-blue)]">{price}</strong> using GPay / PhonePe / any UPI app:
                </p>
                
                {/* QR Code Section */}
                <div className="flex flex-col items-center bg-white border border-blue-200 rounded-xl p-4 w-full">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden mb-3 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/upi-qr.png" alt="UPI QR Code" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-wider mb-2">
                    Scan to pay instantly
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-center w-full max-w-[240px]">
                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-wide block mb-0.5">UPI ID</span>
                    <span className="font-mono text-sm sm:text-base font-bold text-[var(--color-text-dark)] select-all">sanjai131418@okicici</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 — Upload */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--color-bg-offwhite)] border border-[var(--color-border-light)]">
              <div className="w-8 h-8 rounded-full bg-[var(--color-secondary-lavender)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Upload size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[var(--color-text-dark)] font-bold text-sm">
                  Step 3 — Upload your payment screenshot
                </p>
                <p className="text-[var(--color-text-body)] text-xs mt-1 mb-3">
                  After paying, upload a screenshot so we can verify it.
                </p>
                <Link
                  href="/verify-payment"
                  className="btn-primary inline-flex items-center gap-2 !text-sm !py-2.5 !px-5"
                >
                  <Upload size={16} />
                  Upload Screenshot
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Step 4 — Onboarding */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--color-bg-offwhite)] border border-[var(--color-border-light)]">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[var(--color-text-dark)] font-bold text-sm">
                  Step 4 — Onboarding kit
                </p>
                <p className="text-[var(--color-text-body)] text-xs mt-1">
                  We&apos;ll send your onboarding details within <strong>2 hours</strong> after payment verification.
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-[var(--color-text-muted)] text-xs mt-6">
            Check your email — we&apos;ve also sent these steps to your inbox.
          </p>
        </div>
      </motion.div>
    );
  }

  // ── Slide animation variants ──
  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 w-full max-w-2xl mx-auto">
      {/* ── Progress bar ── */}
      <div className="w-full mb-10">
        <div className="flex items-center justify-between mb-4">
          {stepTitles.map((title, i) => (
            <div
              key={title}
              className={`flex flex-col items-center gap-2 transition-colors ${
                i <= step ? "text-[var(--color-primary-blue)]" : "text-[var(--color-text-muted)]"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2 ${
                  i < step
                    ? "bg-[var(--color-primary-blue)] border-[var(--color-primary-blue)] text-white"
                    : i === step
                    ? "bg-white border-[var(--color-primary-blue)] text-[var(--color-primary-blue)] shadow-sm"
                    : "bg-white border-[var(--color-border-light)] text-[var(--color-text-muted)]"
                }`}
              >
                {i < step ? <Check size={16} /> : i + 1}
              </div>
              <span className="hidden sm:inline text-xs font-medium">{title}</span>
            </div>
          ))}
        </div>
        {/* Progress track */}
        <div className="h-2 w-full rounded-full bg-[var(--color-bg-offwhite)] border border-[var(--color-border-light)] overflow-hidden">
          <motion.div
            className="h-full bg-[var(--color-primary-blue)]"
            initial={false}
            animate={{ width: `${((step + 1) / 4) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* ── Step content ── */}
      <div className="w-full bg-white border border-[var(--color-border-light)] rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] p-6 sm:p-10 relative overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {/* Step 0: About You */}
            {step === 0 && (
              <div>
                <div className="flex items-center gap-2 mb-8 border-b border-[var(--color-border-light)] pb-4">
                  <User size={24} className="text-[var(--color-primary-blue)]" />
                  <h3 className="font-[var(--font-syne)] text-2xl font-bold text-[var(--color-text-dark)]">
                    About You
                  </h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="text-[var(--color-text-dark)] text-sm font-semibold mb-2 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.full_name}
                      onChange={(e) => update("full_name", e.target.value)}
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-[var(--color-text-dark)] text-sm font-semibold mb-2 block">
                      College & Year *
                    </label>
                    <input
                      type="text"
                      value={form.college_year}
                      onChange={(e) => update("college_year", e.target.value)}
                      className="input-field"
                      placeholder="MIT, 2nd Year B.Tech"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[var(--color-text-dark)] text-sm font-semibold mb-2 block">
                        City *
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                        className="input-field"
                        placeholder="Chennai"
                      />
                    </div>
                    <div>
                      <label className="text-[var(--color-text-dark)] text-sm font-semibold mb-2 block">
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        value={form.whatsapp}
                        onChange={(e) => update("whatsapp", e.target.value)}
                        className="input-field"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[var(--color-text-dark)] text-sm font-semibold mb-2 block">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="input-field"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Choose Track */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-2 mb-8 border-b border-[var(--color-border-light)] pb-4">
                  <Sparkles size={24} className="text-[var(--color-primary-blue)]" />
                  <h3 className="font-[var(--font-syne)] text-2xl font-bold text-[var(--color-text-dark)]">
                    Choose Your Track
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tracks.map((track) => (
                    <button
                      key={track.name}
                      onClick={() => update("track", track.name)}
                      className={`p-4 rounded-xl text-left transition-all duration-200 border-2 ${
                        form.track === track.name
                          ? "border-[var(--color-primary-blue)] bg-blue-50"
                          : "border-[var(--color-border-light)] bg-white hover:border-[var(--color-primary-blue)] hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                          <track.icon size={20} className={track.color} />
                        </div>
                        <span className="text-[var(--color-text-dark)] font-semibold text-sm">
                          {track.name}
                        </span>
                        {form.track === track.name && (
                          <Check size={18} className="text-[var(--color-primary-blue)] ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Skill Level */}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-2 mb-8 border-b border-[var(--color-border-light)] pb-4">
                  <Star size={24} className="text-[var(--color-primary-blue)]" />
                  <h3 className="font-[var(--font-syne)] text-2xl font-bold text-[var(--color-text-dark)]">
                    Skill Level & Portfolio
                  </h3>
                </div>
                <div className="space-y-8">
                  <div>
                    <label className="text-[var(--color-text-dark)] text-sm font-semibold mb-3 block">
                      Your current skill level *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {skillLevels.map((level) => (
                        <button
                          key={level}
                          onClick={() => update("skill_level", level)}
                          className={`py-3 px-2 rounded-xl text-center transition-all duration-200 border-2 font-medium text-sm ${
                            form.skill_level === level
                              ? "border-[var(--color-primary-blue)] bg-blue-50 text-[var(--color-primary-blue)]"
                              : "border-[var(--color-border-light)] bg-white text-[var(--color-text-body)] hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[var(--color-text-dark)] text-sm font-semibold mb-2 block">
                      Portfolio / GitHub link{" "}
                      <span className="text-[var(--color-text-muted)] font-normal">(optional)</span>
                    </label>
                    <input
                      type="url"
                      value={form.portfolio_link}
                      onChange={(e) => update("portfolio_link", e.target.value)}
                      className="input-field"
                      placeholder="https://github.com/your-username"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Plan & Motivation */}
            {step === 3 && (
              <div>
                <div className="flex items-center gap-2 mb-8 border-b border-[var(--color-border-light)] pb-4">
                  <Sparkles size={24} className="text-[var(--color-primary-blue)]" />
                  <h3 className="font-[var(--font-syne)] text-2xl font-bold text-[var(--color-text-dark)]">
                    Choose Plan & Motivation
                  </h3>
                </div>
                <div className="space-y-8">
                  <div>
                    <label className="text-[var(--color-text-dark)] text-sm font-semibold mb-3 block">
                      Select a plan *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {plans.map((plan) => (
                        <button
                          key={plan.name}
                          onClick={() => update("plan", plan.name)}
                          className={`p-4 rounded-xl text-left transition-all duration-200 border-2 relative ${
                            form.plan === plan.name
                              ? "border-[var(--color-primary-blue)] bg-blue-50"
                              : "border-[var(--color-border-light)] bg-white hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {plan.popular && (
                            <span className="absolute -top-3 right-2 bg-[var(--color-secondary-lavender)] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                              POPULAR
                            </span>
                          )}
                          <div className={`text-xl font-bold font-[var(--font-syne)] mb-1 ${form.plan === plan.name ? 'text-[var(--color-primary-blue)]' : 'text-[var(--color-text-dark)]'}`}>
                            {plan.price}
                          </div>
                          <div className="text-[var(--color-text-dark)] text-sm font-bold mb-1">
                            {plan.name}
                          </div>
                          <div className="text-[var(--color-text-muted)] text-xs">
                            {plan.tagline}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[var(--color-text-dark)] text-sm font-semibold mb-2 block">
                      Why do you want this internship? *
                    </label>
                    <textarea
                      value={form.why}
                      onChange={(e) => update("why", e.target.value)}
                      rows={4}
                      className="input-field resize-none"
                      placeholder="Tell us what excites you about this opportunity..."
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Error message ── */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-500 font-medium text-sm mt-6 p-3 bg-red-50 rounded-lg"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation buttons ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-8 gap-4">
        <button
          onClick={prev}
          disabled={step === 0}
          className={`btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto ${
            step === 0 ? "opacity-0 pointer-events-none hidden sm:flex" : ""
          }`}
        >
          <ChevronLeft size={18} />
          Back
        </button>

        {step < 3 ? (
          <button onClick={next} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto sm:ml-auto">
            Next Step
            <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto sm:ml-auto"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <Check size={18} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
