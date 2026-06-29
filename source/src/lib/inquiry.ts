import { sql } from "@vercel/postgres";
import { z } from "zod";

import { getSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";
import type { InquiryPayload, InquiryResult } from "@/lib/types";

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

export function isVercelPostgresConfigured(): boolean {
  return Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL);
}

export function getInquiryMode(): InquiryResult["mode"] {
  if (isSupabaseConfigured()) return "supabase";
  if (isVercelPostgresConfigured()) return "vercel-postgres";
  return "demo";
}

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
      mode: getInquiryMode(),
      message: "Please correct the highlighted fields.",
      errors,
    };
  }

  const data = parsed.data;
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServer();
    if (!supabase) {
      return {
        ok: false,
        mode: "supabase",
        message: "The inquiry database is not available right now. Please try again or email us directly.",
      };
    }

    const { data: inserted, error } = await supabase
      .from("takeawaypack_inquiries")
      .insert({
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
      })
      .select("id")
      .single();

    if (error) {
      if (typeof console !== "undefined") {
        // eslint-disable-next-line no-console
        console.error("[inquiry:supabase] insert failed:", error);
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

  if (!isVercelPostgresConfigured()) {
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
        "Demo mode: your inquiry was validated successfully but not saved because the website database is not configured.",
    };
  }

  try {
    const { rows } = await sql<{ id: string }>`
      INSERT INTO inquiries
        (name, company, email, phone, country, product, quantity, message, source_page, status)
      VALUES
        (${data.name}, ${normalize(data.company)}, ${data.email}, ${normalize(data.phone)},
         ${normalize(data.country)}, ${normalize(data.product)}, ${normalize(data.quantity)},
         ${data.message}, ${normalize(data.source)}, 'new')
      RETURNING id::text
    `;

    return {
      ok: true,
      mode: "vercel-postgres",
      message: "Thank you — your inquiry has been received. Our team will reply shortly.",
      id: rows[0]?.id,
    };
  } catch (error) {
    if (typeof console !== "undefined") {
      // eslint-disable-next-line no-console
      console.error("[inquiry:postgres] insert failed:", error);
    }
    return {
      ok: false,
      mode: "vercel-postgres",
      message: "We could not save your inquiry right now. Please try again or email us directly.",
    };
  }
}

function normalize(v: string | undefined): string | null {
  const t = (v ?? "").trim();
  return t.length ? t : null;
}
