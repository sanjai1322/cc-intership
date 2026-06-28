"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Loader2,
  LogOut,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { supabase, type Application } from "@/lib/supabase";

export default function AdminApplicationsPage() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // ── Fetch applications from Supabase ──
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data ?? []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authorized) fetchApplications();
  }, [authorized, fetchApplications]);

  // ── Password verification ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.authorized) {
        setAuthorized(true);
      } else {
        setAuthError("Incorrect password.");
      }
    } catch {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Approve payment logic ──
  const handleApprove = async (app: Application) => {
    if (confirm(`Approve payment for ${app.full_name} (${app.plan} Plan)?`)) {
      setApprovingId(app.id);
      try {
        // 1. Update database status to paid
        const { error } = await supabase
          .from("applications")
          .update({ status: "paid" })
          .eq("id", app.id);

        if (error) throw error;

        // 2. Trigger onboarding welcome email
        await fetch("/api/send-emails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "onboard",
            full_name: app.full_name,
            email: app.email,
            plan: app.plan,
            track: app.track,
          }),
        });

        // 3. Update local state to reflect paid status
        setApplications((prev) =>
          prev.map((a) => (a.id === app.id ? { ...a, status: "paid" } : a))
        );
      } catch (err) {
        console.error("Approve payment error:", err);
        alert("Failed to approve payment. Please try again.");
      } finally {
        setApprovingId(null);
      }
    }
  };

  // ── Status badge color ──
  const statusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "payment_submitted":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  // ── Password gate ──
  if (!authorized) {
    return (
      <section className="relative z-10 min-h-[80vh] flex items-center justify-center px-4 bg-[var(--color-bg-white)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 w-full max-w-sm rounded-2xl border border-[var(--color-border-light)] shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
              <Lock size={24} className="text-[var(--color-primary-blue)]" />
            </div>
            <div>
              <h1 className="font-[var(--font-syne)] text-xl font-bold text-[var(--color-text-dark)]">
                Admin Access
              </h1>
              <p className="text-[var(--color-text-muted)] text-sm">
                Enter password to continue
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setAuthError("");
              }}
              className="input-field"
              placeholder="Admin password"
              autoFocus
            />

            <AnimatePresence>
              {authError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded-md"
                >
                  {authError}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={authLoading || !password}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Lock size={16} />
                  Unlock
                </>
              )}
            </button>
          </form>
        </motion.div>
      </section>
    );
  }

  // ── Applications table ──
  return (
    <section className="relative z-10 min-h-[80vh] py-12 px-4 bg-[var(--color-bg-offwhite)]">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-[var(--color-border-light)] shadow-sm">
          <div>
            <h1 className="font-[var(--font-syne)] text-2xl sm:text-3xl font-bold text-[var(--color-text-dark)]">
              Applications
            </h1>
            <p className="text-[var(--color-text-body)] text-sm mt-1">
              {applications.length} total application{applications.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchApplications}
              disabled={loading}
              className="btn-secondary flex items-center gap-2 !py-2 !px-4 text-sm bg-white"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
            <button
              onClick={() => {
                setAuthorized(false);
                setPassword("");
              }}
              className="btn-secondary flex items-center gap-2 !py-2 !px-4 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 bg-white"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && applications.length === 0 && (
          <div className="flex items-center justify-center py-32 bg-white rounded-2xl border border-[var(--color-border-light)]">
            <Loader2 size={32} className="text-[var(--color-primary-blue)] animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && applications.length === 0 && (
          <div className="bg-white p-16 text-center rounded-2xl border border-[var(--color-border-light)]">
            <p className="text-[var(--color-text-body)] text-lg">No applications yet.</p>
          </div>
        )}

        {/* Table */}
        {applications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[var(--color-bg-offwhite)]">
                  <tr className="border-b border-[var(--color-border-light)]">
                    {[
                      "Name",
                      "College",
                      "City",
                      "WhatsApp",
                      "Email",
                      "Track",
                      "Skill",
                      "Portfolio",
                      "Screenshot",
                      "Plan",
                      "Why",
                      "Status",
                      "Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-[var(--color-text-dark)] font-bold text-xs uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-light)]">
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-blue-50/50 transition-colors bg-white"
                    >
                      <td className="px-5 py-4 whitespace-nowrap text-[var(--color-text-dark)] font-bold">
                        {app.full_name}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-[var(--color-text-body)]">
                        {app.college_year}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-[var(--color-text-body)]">
                        {app.city}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-[var(--color-text-body)] font-medium">
                        {app.whatsapp}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-[var(--color-text-body)] font-medium">
                        {app.email}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-[var(--color-primary-blue)] font-bold">
                          {app.track}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-[var(--color-text-body)]">
                        {app.skill_level}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {app.portfolio_link ? (
                          <a
                            href={app.portfolio_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-secondary-lavender)] hover:text-purple-700 transition-colors flex items-center gap-1 font-semibold no-underline"
                          >
                            <ExternalLink size={14} />
                            Link
                          </a>
                        ) : (
                          <span className="text-[var(--color-text-muted)]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {app.payment_screenshot ? (
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch(
                                  `/api/get-screenshot?path=${encodeURIComponent(app.payment_screenshot!)}`
                                );
                                const data = await res.json();
                                if (!res.ok || !data.signedUrl) {
                                  alert("Failed to load receipt: " + (data.error || "Unknown error"));
                                  return;
                                }
                                window.open(data.signedUrl, "_blank");
                              } catch {
                                alert("Failed to load receipt. Please try again.");
                              }
                            }}
                            className="text-[var(--color-primary-blue)] hover:text-blue-700 transition-colors flex items-center gap-1 font-semibold bg-transparent border-none cursor-pointer p-0"
                          >
                            <ExternalLink size={14} />
                            View Receipt
                          </button>
                        ) : (
                          <span className="text-[var(--color-text-muted)]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-[var(--color-text-dark)] font-bold">
                        {app.plan}
                      </td>
                      <td className="px-5 py-4 max-w-[240px] truncate text-[var(--color-text-body)] text-sm">
                        {app.why}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-[var(--color-text-muted)] text-xs font-medium">
                        {new Date(app.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {app.status !== "paid" ? (
                          <button
                            onClick={() => handleApprove(app)}
                            disabled={approvingId === app.id}
                            className="btn-primary !py-1.5 !px-3 !text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {approvingId === app.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              "Approve Payment"
                            )}
                          </button>
                        ) : (
                          <span className="text-green-600 font-bold text-xs uppercase tracking-wide">
                            Approved & Sent
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
