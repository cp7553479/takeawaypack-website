import type { Metadata } from "next";

import InquiryForm from "@/components/InquiryForm";
import { Card } from "@/components/ui/card";
import { getSiteData } from "@/lib/dataAdapter";
import { getInquiryMode } from "@/lib/inquiry";

export const metadata: Metadata = {
  title: "Contact & Request Inquiry (RFQ)",
  description:
    "Send an inquiry for takeaway and food-service packaging. Share your specs, quantity, and destination for a quotation.",
};

interface PageProps {
  searchParams: { product?: string; intent?: string };
}

export default async function ContactPage({ searchParams }: PageProps) {
  const { info } = await getSiteData();
  const product = searchParams.product?.trim() ? searchParams.product.trim() : undefined;
  const intent = searchParams.intent?.toLowerCase() === "samples" ? "samples" : "quote";
  const mode = getInquiryMode();

  return (
    <>
      <section className="border-b bg-secondary/40">
        <div className="container-page section-tight">
          <p className="eyebrow">Inquiry / RFQ</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Request a quotation
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tell us what you need: product, material, size, quantity, customization, and
            destination. Pricing, MOQ, and timing are confirmed against the exact request.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8">
              <InquiryForm
                defaultProduct={product}
                defaultIntent={intent}
                mode={mode}
                sourcePage="contact-form"
              />
            </Card>
          </div>

          <aside className="space-y-4">
            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground">Direct contact</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {info.contact.email ? (
                  <li>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Email
                    </span>
                    <a className="text-primary hover:underline" href={`mailto:${info.contact.email}`}>
                      {info.contact.email}
                    </a>
                  </li>
                ) : null}
                {info.contact.phone ? (
                  <li>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Phone
                    </span>
                    <a
                      className="text-foreground hover:text-primary"
                      href={`tel:${info.contact.phone.replace(/\s+/g, "")}`}
                    >
                      {info.contact.phone}
                    </a>
                  </li>
                ) : null}
                {info.contact.whatsapp ? (
                  <li>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      WhatsApp
                    </span>
                    <span className="text-foreground">{info.contact.whatsapp}</span>
                  </li>
                ) : null}
                {info.contact.address ? (
                  <li>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Address
                    </span>
                    <span className="text-muted-foreground">{info.contact.address}</span>
                  </li>
                ) : null}
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground">What to include</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Product name or category</li>
                <li>Material and size / capacity</li>
                <li>Estimated order quantity</li>
                <li>Customization (print, color, logo)</li>
                <li>Destination port / country</li>
              </ul>
            </Card>

            <Card className="border-kraft-200 bg-kraft-50 p-6">
              <h2 className="text-sm font-semibold text-kraft-900">Inquiry storage</h2>
              <p className="mt-2 text-sm text-kraft-800">
                {mode === "vercel-postgres" || mode === "supabase"
                  ? "Submissions are saved to the website database for quotation follow-up."
                  : "Demo mode: inquiries validate here but are not saved until the website database is configured."}
              </p>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
