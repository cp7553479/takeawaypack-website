import type { Metadata } from "next";

import InquiryForm from "@/components/InquiryForm";
import { getSiteData } from "@/lib/dataAdapter";
import { isVercelPostgresConfigured } from "@/lib/inquiry";

export const metadata: Metadata = {
  title: "Contact & Request Inquiry (RFQ)",
  description:
    "Send an inquiry for takeaway and food-service packaging. Share your specs, quantity, and destination for a quotation.",
};

interface PageProps {
  searchParams: { product?: string };
}

export default async function ContactPage({ searchParams }: PageProps) {
  const { info } = await getSiteData();
  const product = searchParams.product?.trim() ? searchParams.product.trim() : undefined;
  const mode = isVercelPostgresConfigured() ? "vercel-postgres" : "demo";

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="container-page section-tight">
          <span className="eyebrow">Inquiry / RFQ</span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Request a quotation
          </h1>
          <p className="lead mt-3 max-w-2xl">
            Tell us what you need — product, material, size, quantity, and destination — and we&apos;ll
            reply with pricing, MOQ, and lead time.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="card p-6 sm:p-8">
              <InquiryForm defaultProduct={product} mode={mode} sourcePage="contact-form" />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="card p-6">
              <h2 className="text-base font-semibold text-slate-900">Direct contact</h2>
              <ul className="mt-3 space-y-3 text-sm">
                {info.contact.email ? (
                  <li>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Email</span>
                    <a className="text-brand-700 hover:underline" href={`mailto:${info.contact.email}`}>
                      {info.contact.email}
                    </a>
                  </li>
                ) : null}
                {info.contact.phone ? (
                  <li>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</span>
                    <a className="text-slate-800 hover:text-brand-700" href={`tel:${info.contact.phone.replace(/\s+/g, "")}`}>
                      {info.contact.phone}
                    </a>
                  </li>
                ) : null}
                {info.contact.whatsapp ? (
                  <li>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">WhatsApp</span>
                    <span className="text-slate-800">{info.contact.whatsapp}</span>
                  </li>
                ) : null}
                {info.contact.address ? (
                  <li>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Address</span>
                    <span className="text-slate-600">{info.contact.address}</span>
                  </li>
                ) : null}
              </ul>
            </div>

            <div className="card p-6">
              <h2 className="text-base font-semibold text-slate-900">What to include</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Product name or category</li>
                <li>• Material and size / capacity</li>
                <li>• Estimated order quantity</li>
                <li>• Customization (print, color, logo)</li>
                <li>• Destination port / country</li>
              </ul>
            </div>

            <div className="card border-kraft-200 bg-kraft-50 p-6">
              <h2 className="text-sm font-semibold text-kraft-900">Inquiry storage</h2>
              <p className="mt-2 text-sm text-kraft-800">
                {mode === "vercel-postgres"
                  ? "Submissions are saved to the website database and our team will follow up by email."
                  : "Demo mode: inquiries validate here but are not saved until the website database is configured."}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
