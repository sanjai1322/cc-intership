import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy-initialized Supabase admin client using the service role key to bypass RLS
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

/*
  SQL Migration — run this in the Supabase SQL Editor if the column doesn't exist:

  alter table applications add column if not exists payment_screenshot text;
*/

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const whatsapp = formData.get("whatsapp")?.toString().trim();
    const file = formData.get("file") as File;

    console.log("[upload-screenshot] Received request — email:", email, "whatsapp:", whatsapp, "file:", file?.name, "size:", file?.size);

    if (!email || !whatsapp || !file) {
      console.log("[upload-screenshot] Missing fields — email:", !!email, "whatsapp:", !!whatsapp, "file:", !!file);
      return NextResponse.json(
        { error: "Email, WhatsApp, and file are required." },
        { status: 400 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[upload-screenshot] SUPABASE_SERVICE_ROLE_KEY is not set in env.");
      return NextResponse.json(
        { error: "Server misconfiguration. Service role key not set." },
        { status: 500 }
      );
    }

    // 1. Verify that the application exists by email
    console.log("[upload-screenshot] Looking up application for email:", JSON.stringify(email));

    const { data: existingApp, error: fetchErr } = await getSupabaseAdmin()
      .from("applications")
      .select("id, status, email")
      .eq("email", email)
      .maybeSingle();

    console.log("[upload-screenshot] Supabase lookup result — data:", JSON.stringify(existingApp), "error:", JSON.stringify(fetchErr));

    if (fetchErr) {
      console.error("[upload-screenshot] Supabase query error:", JSON.stringify(fetchErr, null, 2));
      return NextResponse.json(
        { error: "Failed to verify application. Database error: " + fetchErr.message },
        { status: 500 }
      );
    }

    if (!existingApp) {
      console.log("[upload-screenshot] No application found for email:", email);
      return NextResponse.json(
        { error: "No application found with this email. Please use the same email you applied with." },
        { status: 404 }
      );
    }

    console.log("[upload-screenshot] Found application — id:", existingApp.id, "status:", existingApp.status);

    // 2. Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop() || "png";
    const fileName = `${email.replace(/[^a-z0-9]/gi, "_")}_${Date.now()}.${fileExt}`;
    const filePath = `screenshots/${fileName}`;

    console.log("[upload-screenshot] Uploading to storage — path:", filePath, "contentType:", file.type);

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadErr } = await getSupabaseAdmin().storage
      .from("payment-screenshots")
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadErr) {
      console.error("[upload-screenshot] Storage upload error:", JSON.stringify(uploadErr, null, 2));
      return NextResponse.json(
        { error: "Failed to upload screenshot to storage: " + uploadErr.message },
        { status: 500 }
      );
    }

    console.log("[upload-screenshot] Upload successful — path:", filePath);

    // 3. Get public URL of the uploaded image
    const { data: urlData } = getSupabaseAdmin().storage
      .from("payment-screenshots")
      .getPublicUrl(filePath);

    const publicUrl = urlData?.publicUrl;
    console.log("[upload-screenshot] Public URL:", publicUrl);

    if (!publicUrl) {
      return NextResponse.json(
        { error: "Could not retrieve public URL for upload." },
        { status: 500 }
      );
    }

    // 4. Update application record status & screenshot URL
    console.log("[upload-screenshot] Updating application", existingApp.id, "— status: payment_submitted, screenshot:", publicUrl);

    const { data: updateData, error: updateErr } = await getSupabaseAdmin()
      .from("applications")
      .update({
        status: "payment_submitted",
        payment_screenshot: publicUrl,
      })
      .eq("id", existingApp.id)
      .select();

    console.log("[upload-screenshot] Update result — data:", JSON.stringify(updateData), "error:", JSON.stringify(updateErr));

    if (updateErr) {
      console.error("[upload-screenshot] Update error:", JSON.stringify(updateErr, null, 2));
      return NextResponse.json(
        { error: "Failed to update application status: " + updateErr.message },
        { status: 500 }
      );
    }

    console.log("[upload-screenshot] ✅ Success for", email);
    return NextResponse.json({ success: true, publicUrl });
  } catch (err: unknown) {
    console.error("[upload-screenshot] Unhandled error:", err);
    return NextResponse.json(
      { error: "Internal server error during upload." },
      { status: 500 }
    );
  }
}

