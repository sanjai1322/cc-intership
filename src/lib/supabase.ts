// Supabase client — used by both the application form (insert) and admin page (select).
// Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
// Uses lazy initialization so the build doesn't crash when env vars are missing.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export const supabase = (() => {
  // Lazy getter — creates the client on first property access
  return new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      if (!_supabase) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
        if (!url || !key) {
          console.warn("Supabase env vars not set — database calls will fail.");
          // Create with placeholder to avoid crash; runtime calls will error gracefully
          _supabase = createClient("https://placeholder.supabase.co", "placeholder");
        } else {
          _supabase = createClient(url, key);
        }
      }
      const value = (_supabase as unknown as Record<string | symbol, unknown>)[prop];
      if (typeof value === "function") {
        return value.bind(_supabase);
      }
      return value;
    },
  });
})();

// ── Type for the `applications` table ──
export interface Application {
  id: string;
  created_at: string;
  full_name: string;
  college_year: string;
  city: string;
  whatsapp: string;
  email: string;
  track: string;
  skill_level: string;
  portfolio_link: string | null;
  plan: string;
  why: string;
  status: string;
  payment_screenshot: string | null;
}
