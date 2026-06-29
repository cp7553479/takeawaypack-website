"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InquiryFormProps {
  defaultProduct?: string;
  defaultIntent?: "quote" | "samples";
  sourcePage?: string;
  /** Database mode, rendered by the server. Falls back to a live probe. */
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

function defaultMessage(product?: string, intent?: "quote" | "samples") {
  if (intent === "samples") {
    return product
      ? `I'd like to request samples of ${product}. Please confirm available specs, sample cost/lead time, and the documents you can provide.`
      : "I'd like to request product samples. Please confirm available specs, sample cost/lead time, and the documents you can provide.";
  }
  return product
    ? `I'm interested in ${product}. Please confirm pricing, MOQ, and timing for my required specification. My material/size, customization, destination, and documentation needs are:`
    : "";
}

export default function InquiryForm({
  defaultProduct,
  defaultIntent,
  sourcePage,
  mode,
}: InquiryFormProps) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    product: defaultProduct ?? "",
    quantity: "",
    message: defaultMessage(defaultProduct, defaultIntent),
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [liveMode, setLiveMode] = useState<
    "vercel-postgres" | "supabase" | "demo" | null
  >(mode ?? null);

  useEffect(() => {
    if (mode) return;
    let active = true;
    fetch("/api/inquiry")
      .then((r) => r.json())
      .then((d) => {
        if (active) setLiveMode(d.mode);
      })
      .catch(() => {
        if (active) setLiveMode("demo");
      });
    return () => {
      active = false;
    };
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
  const fieldClass = (key: keyof FieldErrors) =>
    errors[key] ? "border-destructive focus-visible:ring-destructive" : "";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {activeMode === "demo" ? (
        <div className="rounded-lg border border-kraft-200 bg-kraft-50 px-4 py-3 text-sm text-kraft-800">
          <strong>Demo mode:</strong> the database is not configured, so inquiries are
          validated but not saved. Add the env vars to persist submissions.
        </div>
      ) : null}

      {status ? (
        <div
          role="status"
          className={
            status.ok
              ? "flex items-start gap-3 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800"
              : "rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          }
        >
          {status.ok ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> : null}
          <span>{status.message}</span>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">
            Full name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            className={`mt-1.5 ${fieldClass("name")}`}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-destructive">{errors.name}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            autoComplete="organization"
            className="mt-1.5"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={`mt-1.5 ${fieldClass("email")}`}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-destructive">{errors.email}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="phone">Phone / WhatsApp</Label>
          <Input
            id="phone"
            name="phone"
            autoComplete="tel"
            className="mt-1.5"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            autoComplete="country-name"
            className="mt-1.5"
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="quantity">Estimated quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            className="mt-1.5"
            placeholder="e.g. 50,000 pcs"
            value={form.quantity}
            onChange={(e) => update("quantity", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="product">Product of interest</Label>
        <Input
          id="product"
          name="product"
          className="mt-1.5"
          placeholder="Product name, SKU, or category"
          value={form.product}
          onChange={(e) => update("product", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="message">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          className={`mt-1.5 ${fieldClass("message")}`}
          placeholder="Share product size/capacity, material, quantity, customization, destination country/port, sample needs, and any food-contact or sustainability documents required."
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          required
        />
        {errors.message ? (
          <p className="mt-1 text-xs text-destructive">{errors.message}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Inquiry
            </>
          )}
        </Button>
        <span className="text-xs text-muted-foreground">
          Include enough detail for the quotation team to confirm the exact specification.
        </span>
      </div>
    </form>
  );
}
