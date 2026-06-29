import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import InquiryCTA from "@/components/InquiryCTA";
import SectionHeading from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSiteData } from "@/lib/dataAdapter";
import { getMediaAssetUrl } from "@/lib/mediaAssets";

export const metadata: Metadata = {
  title: "About & Capabilities",
  description:
    "Company overview and packaging capabilities for takeaway and food-service export buyers.",
};

const BUYER_PROMISE = [
  "Clear product specifications before quotation",
  "Sample and artwork confirmation support",
  "Custom print, material, and packing discussions by RFQ",
  "Export-ready communication for international buyers",
];

const QUALITY_TIMELINE = [
  {
    title: "RFQ intake",
    body: "Confirm product type, target size, material preference, print needs, quantity, and destination.",
  },
  {
    title: "Sample reference",
    body: "Use samples, drawings, or existing products to align expectations before bulk order.",
  },
  {
    title: "Artwork & specs",
    body: "Review print files, dimensions, packing method, and any market-specific documentation needs.",
  },
  {
    title: "Packing & shipment",
    body: "Confirm carton marks, export packing details, and shipping handoff information.",
  },
];

export default async function AboutPage() {
  const { info } = await getSiteData();
  const [heroImage, customImage, qualityImage, ecoImage] = await Promise.all([
    getMediaAssetUrl("/generated/marketing/hero-global-foodservice-packaging.png"),
    getMediaAssetUrl("/generated/marketing/custom-print-packaging-showcase.png"),
    getMediaAssetUrl("/generated/marketing/factory-quality-control-packaging.png"),
    getMediaAssetUrl("/generated/marketing/ad-eco-packaging-sourcing.png"),
  ]);
  const dataIsSample = info.source === "sample";

  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/60 via-background to-background"
        />
        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
          <div>
            <p className="eyebrow">About {info.brandName}</p>
            <h1 className="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
              Packaging sourcing support for foodservice brands and trade buyers.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {dataIsSample
                ? "This page uses cautious placeholder company language until verified company data is provided. The site is structured to present real capabilities, documents, and sourcing details once confirmed."
                : info.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact">Get a Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border bg-card shadow-xl">
            <Image
              src={heroImage}
              alt="Foodservice packaging range for export sourcing"
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Buyer promise"
            title="The relationship is built on verified details, not vague claims."
            description="For overseas procurement, the important work is reducing uncertainty: matching samples, confirming print and material choices, and documenting packing details before money and lead time are committed."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BUYER_PROMISE.map((item) => (
              <Card key={item} className="h-full p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <p className="mt-4 text-sm font-semibold leading-relaxed text-foreground">
                  {item}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-secondary/40">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-card">
            <Image
              src={customImage}
              alt="Custom printed foodservice packaging design and material options"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Capabilities"
              title="A practical packaging studio for custom foodservice programs."
              description="Buyers can use the catalog as a starting point, then refine structure, coating, capacity, print, lid matching, and carton packing through the RFQ process."
            />
            {info.services && info.services.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {info.services.map((service) => (
                  <li key={service}>
                    <Badge variant="brand">{service}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="Sustainability"
              title="Sustainable options, stated carefully and confirmed by specification."
              description="Material choices can include kraft paper, paperboard, bagasse, CPLA, or other options depending on product requirements. Exact compostability, recyclability, coating, and food-contact documentation should be confirmed for each destination market before publishing or ordering."
            />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border bg-card">
            <Image
              src={ecoImage}
              alt="Sustainable packaging material options for foodservice sourcing"
              fill
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section bg-primary text-primary-foreground">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
              Quality &amp; export flow
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              A clear path from sourcing brief to shipment handoff.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-primary-foreground/85">
              This workflow is presented as a buyer-facing reference. The supporting image is
              generated marketing artwork and should not be described as a real factory photo.
            </p>
          </div>
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-black/20 sm:aspect-[16/6]">
            <Image
              src={qualityImage}
              alt="Quality control and export packing workflow reference"
              fill
              sizes="(min-width: 1024px) 100vw, 100vw"
              className="object-cover"
            />
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUALITY_TIMELINE.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <span className="text-sm font-semibold text-kraft-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-secondary/40">
        <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Information to confirm"
            title="Trust details that should come from verified source data."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Company facts",
                body: "Registered entity, address, team contacts, and export documents should be supplied from verified business records.",
              },
              {
                title: "Compliance files",
                body: "Food-contact reports, material declarations, and destination-specific certificates should be checked by SKU and market.",
              },
              {
                title: "Production proof",
                body: "Factory photos, audit reports, capacity, and lead-time claims should only be published after confirmation.",
              },
              {
                title: "Sample data notice",
                body: dataIsSample
                  ? "Current company content includes sample placeholders and should not be used as final market proof."
                  : "Current company content is loaded from imported source data; still verify sensitive claims before publishing.",
              },
            ].map((item) => (
              <Card key={item.title} className="h-full p-5">
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <InquiryCTA />
    </>
  );
}
