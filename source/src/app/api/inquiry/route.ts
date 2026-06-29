import { NextResponse } from "next/server";

import { submitInquiry } from "@/lib/inquiry";
import type { InquiryPayload } from "@/lib/types";

export const runtime = "nodejs";

// POST /api/inquiry — accepts an RFQ/inquiry submission.
// Persists to Supabase when configured, otherwise validates and returns a
// demo-mode response so the form works end-to-end in local development.
export async function POST(request: Request) {
  let body: Partial<InquiryPayload>;
  try {
    body = (await request.json()) as Partial<InquiryPayload>;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const result = await submitInquiry({
    name: String(body.name ?? ""),
    company: body.company ? String(body.company) : undefined,
    email: String(body.email ?? ""),
    phone: body.phone ? String(body.phone) : undefined,
    country: body.country ? String(body.country) : undefined,
    product: body.product ? String(body.product) : undefined,
    quantity: body.quantity ? String(body.quantity) : undefined,
    message: String(body.message ?? ""),
    source: body.source ? String(body.source) : undefined,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

// Lightweight capability probe for the form to show the right UX.
export async function GET() {
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const hasPostgres = Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL);
  const mode = hasSupabase ? "supabase" : hasPostgres ? "vercel-postgres" : "demo";
  return NextResponse.json({ ok: true, mode });
}
