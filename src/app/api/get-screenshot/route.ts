import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy-initialized Supabase admin client (service role key to bypass RLS)
let _supabaseAdmin: SupabaseClient | null = null;
function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return _supabaseAdmin;
}

/**
 * GET /api/get-screenshot?path=<payment_screenshot value>
 *
 * The `path` parameter can be either:
 *   - A full public URL stored in the DB (e.g. https://xxx.supabase.co/storage/v1/object/public/payment-screenshots/screenshots/file.png)
 *   - A relative storage path (e.g. screenshots/file.png)
 *
 * Returns: { signedUrl: string }
 */
export async function GET(request: NextRequest) {
  try {
    const rawPath = request.nextUrl.searchParams.get("path");

    if (!rawPath) {
      return NextResponse.json(
        { error: "Missing 'path' query parameter." },
        { status: 400 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Server misconfiguration. Service role key not set." },
        { status: 500 }
      );
    }

    // Extract the storage path from a full public URL if needed.
    // Full URLs look like: https://<project>.supabase.co/storage/v1/object/public/payment-screenshots/<path>
    let storagePath = rawPath;
    const bucketName = "payment-screenshots";
    const marker = `/storage/v1/object/public/${bucketName}/`;
    const markerIndex = rawPath.indexOf(marker);
    if (markerIndex !== -1) {
      storagePath = rawPath.substring(markerIndex + marker.length);
    }

    // Generate a signed URL valid for 60 minutes (3600 seconds)
    const { data, error } = await getSupabaseAdmin()
      .storage.from(bucketName)
      .createSignedUrl(storagePath, 3600);

    if (error || !data?.signedUrl) {
      console.error("[get-screenshot] Signed URL error:", error);
      return NextResponse.json(
        { error: "Failed to generate signed URL: " + (error?.message ?? "Unknown error") },
        { status: 500 }
      );
    }

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (err) {
    console.error("[get-screenshot] Unhandled error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
