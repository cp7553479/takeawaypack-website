import Link from "next/link";

import { Button } from "@/components/ui/button";

interface InquiryCTAProps {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
}

export default function InquiryCTA({
  title = "Ready to get a quotation?",
  description = "Send your specifications, target quantity, and destination so pricing, MOQ, and timing can be confirmed against the exact request.",
  primaryHref = "/contact",
  primaryLabel = "Request Inquiry",
}: InquiryCTAProps) {
  return (
    <section className="section">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-primary-foreground shadow-sm sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-kraft-400/20 blur-2xl"
          />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
              <p className="mt-3 text-base leading-relaxed text-primary-foreground/85">
                {description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link href={primaryHref}>{primaryLabel}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              >
                <Link href="/products">View Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
