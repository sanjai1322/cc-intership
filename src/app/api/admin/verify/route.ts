import { NextRequest, NextResponse } from "next/server";

// POST /api/admin/verify — checks the admin password server-side.
// The ADMIN_PASSWORD env var is never exposed to the client.
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { authorized: false, error: "Admin password not configured." },
        { status: 500 }
      );
    }

    const authorized = password === adminPassword;

    return NextResponse.json({ authorized });
  } catch {
    return NextResponse.json(
      { authorized: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}
