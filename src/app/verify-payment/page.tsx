"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Upload, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function VerifyPaymentPage() {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Basic validation (limit to images and max 5MB)
      if (!selectedFile.type.startsWith("image/")) {
        setError("Please upload an image file (PNG/JPG).");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be under 5MB.");
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !whatsapp.trim() || !file) {
      setError("Please fill in all fields and upload a screenshot.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("whatsapp", whatsapp);
      formData.append("file", file);

      const res = await fetch("/api/upload-screenshot", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit verification.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      console.error("Verification error:", err);
      const errMsg = err instanceof Error ? err.message : "Failed to submit verification.";
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-[var(--color-bg-white)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md bg-white p-10 rounded-2xl border border-[var(--color-border-light)] shadow-xl"
        >
          <div className="w-20 h-20 rounded-full bg-[var(--color-success-green)] flex items-center justify-center mx-auto mb-6 shadow-md">
            <Check size={36} className="text-white" />
          </div>
          <h2 className="font-[var(--font-syne)] text-2xl sm:text-3xl font-bold text-[var(--color-text-dark)] mb-4">
            Screenshot Received!
          </h2>
          <p className="text-[var(--color-text-body)] leading-relaxed mb-6">
            Payment screenshot received. We&apos;ll verify and send your onboarding details within <strong>2 hours</strong>.
          </p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 bg-[var(--color-bg-offwhite)]">
      {/* Context header */}
      <div className="w-full max-w-md text-center mb-6">
        <h1 className="font-[var(--font-syne)] text-2xl sm:text-3xl font-bold text-[var(--color-text-dark)] mb-2">
          Complete Your Payment
        </h1>
        <p className="text-[var(--color-text-body)] text-sm leading-relaxed">
          Already applied? Pay via UPI and upload your screenshot below to confirm your seat.
        </p>
      </div>

      {/* UPI Details Card */}
      <div className="w-full max-w-md bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
        <div className="text-center flex flex-col items-center">
          <p className="text-xs text-[var(--color-text-muted)] uppercase font-bold tracking-wider mb-4">
            Send payment to UPI ID
          </p>
          
          <div className="w-40 h-40 bg-white rounded-lg border border-gray-200 overflow-hidden mb-4 relative shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/upi-qr.png" alt="UPI QR Code" className="w-full h-full object-contain" />
          </div>
          
          <p className="font-mono text-xl font-bold text-[var(--color-text-dark)] mb-4 select-all">
            sanjai131418@okicici
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm w-full">
            <span className="bg-white border border-blue-200 rounded-lg px-4 py-2 font-bold text-[var(--color-primary-blue)] w-1/2">
              Starter — ₹999
            </span>
            <span className="bg-white border border-blue-200 rounded-lg px-4 py-2 font-bold text-[var(--color-primary-blue)] w-1/2">
              Pro — ₹1,499
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-4 italic">
            Pay via GPay, PhonePe, Paytm, or any UPI app
          </p>
        </div>
      </div>

      {/* Upload form card */}
      <div className="w-full max-w-md bg-white border border-[var(--color-border-light)] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 sm:p-10">
        <div className="text-center mb-8">
          <h2 className="font-[var(--font-syne)] text-xl sm:text-2xl font-bold text-[var(--color-text-dark)] mb-2">
            Upload Payment Screenshot
          </h2>
          <p className="text-[var(--color-text-body)] text-sm">
            Upload your UPI payment screenshot to confirm your seat.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[var(--color-text-dark)] text-sm font-semibold mb-2 block">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="text-[var(--color-text-dark)] text-sm font-semibold mb-2 block">
              WhatsApp Number *
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="input-field"
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <div>
            <label className="text-[var(--color-text-dark)] text-sm font-semibold mb-2 block">
              Payment Screenshot *
            </label>
            
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[var(--color-border-light)] border-dashed rounded-xl hover:border-gray-400 transition-colors relative">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-semibold text-[var(--color-primary-blue)] hover:text-blue-700 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
            
            {file && (
              <p className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1.5">
                <Check size={16} /> Selected: {file.name}
              </p>
            )}
          </div>

          {error && (
            <p className="text-red-500 font-medium text-sm p-3 bg-red-50 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Screenshot
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
