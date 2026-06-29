"use client";

import { useEffect, useState, type FormEvent } from "react";

interface InquiryFormProps {
  defaultProduct?: string;
  sourcePage?: string;
  /** "vercel-postgres" if configured, else "demo". Rendered by the server. */
  mode?: "vercel-postgres" | "supabase" | "demo";
}

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
  [key: string]: string | undefined;
}

interface SubmitResult {
  ok: boolean;
  mode: "vercel-postgres" | "supabase" | "demo";
  message: string;
  errors?: Record<string, string>;
}

export default function InquiryForm({ defaultProduct, sourcePage, mode }: InquiryFormProps) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    product: defaultProduct ?? "",
    quantity: "",
    message: defaultProduct ? `I'm interested in ${defaultProduct}. Please confirm pricing, MOQ, and lead time for my required specification.` : "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Surface the live mode if the server didn't pass it.
  const [liveMode, setLiveMode] = useState<"vercel-postgres" | "supabase" | "demo" | null>(mode ?? null);
  useEffect(() => {
    if (mode) return;
    fetch("/api/inquiry")
      .then((r) => r.json())
      .then((d) => setLiveMode(d.mode))
      .catch(() => setLiveMode("demo"));
  }, [mode]);

  const update = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    setErrors({});

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: sourcePage ?? "contact-form" }),
      });
      const data = (await res.json()) as SubmitResult;
      setStatus(data);
      if (data.ok) {
        setForm((f) => ({ ...f, message: "" }));
      } else if (data.errors) {
        setErrors(data.errors as FieldErrors);
      }
    } catch {
      setStatus({
        ok: false,
        mode: "demo",
        message: "Network error. Please try again or email us directly.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const activeMode = liveMode ?? mode ?? "demo";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {activeMode === "demo" ? (
        <div className="rounded-lg border border-kraft-200 bg-kraft-50 px-4 py-3 text-sm text-kraft-800">
          <strong>Demo mode:</strong> Supabase is not configured, so inquiries are validated but not
          saved. Add the Supabase env vars to persist submissions.
        </div>
      ) : null}

      {status ? (
        <div
          role="status"
          className={`rounded-lg border px-4 py-3 text-sm ${
            status.ok
              ? "border-brand-200 bg-brand-50 text-brand-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {status.message}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            className={`input ${errors.name ? "input-error" : ""}`}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
          {errors.name ? <p className="field-error">{errors.name}</p> : null}
        </div>

        <div>
          <label className="label" htmlFor="company">
            Company
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            className="input"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={`input ${errors.email ? "input-error" : ""}`}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
          {errors.email ? <p className="field-error">{errors.email}</p> : null}
        </div>

        <div>
          <label className="label" htmlFor="phone">
            Phone / WhatsApp
          </label>
          <input
            id="phone"
            name="phone"
            autoComplete="tel"
            className="input"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="country">
            Country
          </label>
          <input
            id="country"
            name="country"
            autoComplete="country-name"
            className="input"
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="quantity">
            Estimated quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            className="input"
            placeholder="e.g. 50,000 pcs"
            value={form.quantity}
            onChange={(e) => update("quantity", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="product">
          Product of interest
        </label>
        <input
          id="product"
          name="product"
          className="input"
          value={form.product}
          onChange={(e) => update("product", e.target.value)}
        />
      </div>

      <div>
        <label className="label" htmlFor="message">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={`input ${errors.message ? "input-error" : ""}`}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          required
        />
        {errors.message ? <p className="field-error">{errors.message}</p> : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Sending..." : "Send Inquiry"}
        </button>
        <span className="text-xs text-slate-500">
          Include enough detail for the quotation team to confirm the exact specification.
        </span>
      </div>
    </form>
  );
}
