import { z } from "zod";

import { getSupabaseServer, getSupabaseEnv } from "@/lib/supabase";
import type { InquiryPayload, InquiryResult } from "@/lib/types";

// Public-facing inquiry schema. Email is the only hard requirement so the
// sales team can reply; everything else is optional but encouraged.
export const inquirySchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .email("Please enter a valid email address.")
    .max(200),
  phone: z.string().trim().max(60).optional().or(z.literal("")),
  country: z.string().trim().max(120).optional().or(z.literal("")),
  product: z.string().trim().max(200).optional().or(z.literal("")),
  quantity: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(5, "Please add a short message about your needs.").max(4000),
  source: z.string().trim().max(200).optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

/**
 * Persist an inquiry. When Supabase is configured, inserts into the
 * `inquiries` table. Otherwise runs in "demo mode": validates and returns the
 * payload (and logs it server-side) so the form is fully testable locally.
 */
export async function submitInquiry(payload: InquiryPayload): Promise<InquiryResult> {
  const parsed = inquirySchema.safeParse(payload);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? "form";
      if (!errors[key]) errors[key] = issue.message;
    }
    return {
      ok: false,
      mode: getSupabaseEnv().configured ? "supabase" : "demo",
      message: "Please correct the highlighted fields.",
      errors,
    };
  }

  const data = parsed.data;
  const env = getSupabaseEnv();

  // --- Demo mode (no Supabase credentials) ---------------------------------
  if (!env.configured) {
    if (typeof console !== "undefined") {
      // eslint-disable-next-line no-console
      console.info("[inquiry:demo] inquiry received (not persisted):", {
        name: data.name,
        email: data.email,
        product: data.product,
        message: data.message.slice(0, 120),
      });
    }
    return {
      ok: true,
      mode: "demo",
      message:
        "Demo mode: your inquiry was validated successfully but not saved (Supabase is not configured).",
    };
  }

  // --- Supabase mode -------------------------------------------------------
  const supabase = getSupabaseServer();
  if (!supabase) {
    return {
      ok: false,
      mode: "demo",
      message: "Database client unavailable. Please retry or contact us directly.",
    };
  }

  const row = {
    name: data.name,
    company: normalize(data.company),
    email: data.email,
    phone: normalize(data.phone),
    country: normalize(data.country),
    product: normalize(data.product),
    quantity: normalize(data.quantity),
    message: data.message,
    source_page: normalize(data.source),
    status: "new",
    // created_at is set by the DB default
  };

  const { data: inserted, error } = await supabase
    .from("inquiries")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    if (typeof console !== "undefined") {
      // eslint-disable-next-line no-console
      console.error("[inquiry:supabase] insert failed:", error.message);
    }
    return {
      ok: false,
      mode: "supabase",
      message: "We could not save your inquiry right now. Please try again or email us directly.",
    };
  }

  return {
    ok: true,
    mode: "supabase",
    message: "Thank you — your inquiry has been received. Our team will reply shortly.",
    id: inserted?.id ? String(inserted.id) : undefined,
  };
}

function normalize(v: string | undefined): string | null {
  const t = (v ?? "").trim();
  return t.length ? t : null;
}
