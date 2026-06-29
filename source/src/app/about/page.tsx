import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import InquiryCTA from "@/components/InquiryCTA";
import ProcessSteps from "@/components/ProcessSteps";
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
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-50 to-white" />
        <div className="container-page section relative grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-[358px] sm:max-w-none">
            <span className="eyebrow">About {info.brandName}</span>
            <h1 className="mt-3 break-words text-3xl font-extrabold leading-tight tracking-tight text-slate-950 text-balance sm:text-5xl">
              Packaging sourcing support for foodservice brands and trade buyers.
            </h1>
            <p className="lead mt-5 max-w-2xl">
              {dataIsSample
                ? "This page uses cautious placeholder company language until verified company data is provided. The site is structured to present real capabilities, documents, and sourcing details once confirmed."
                : info.description}
            </p>
            <div className="mt-7 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
              <Link href="/contact" className="btn-primary w-full sm:w-auto">
                Get a Quote
              </Link>
              <Link href="/products" className="btn-outline w-full sm:w-auto">
                Browse Products
              </Link>
            </div>
          </div>
          <div className="relative aspect-[16/11] max-w-[358px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xl shadow-slate-200/70 sm:max-w-none">
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
          <div className="max-w-3xl">
            <span className="eyebrow">Buyer promise</span>
            <h2 className="h-section mt-2">The relationship is built on verified details, not vague claims.</h2>
            <p className="lead mt-3">
              For overseas procurement, the important work is reducing uncertainty: matching
              samples, confirming print and material choices, and documenting packing details
              before money and lead time are committed.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BUYER_PROMISE.map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <Image
              src={customImage}
              alt="Custom printed foodservice packaging design and material options"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <span className="eyebrow">Capabilities narrative</span>
            <h2 className="h-section mt-2">A practical packaging studio for custom foodservice programs.</h2>
            <p className="lead mt-3">
              Buyers can use the catalog as a starting point, then refine structure, coating,
              capacity, print, lid matching, and carton packing through the RFQ process.
            </p>
            {info.services && info.services.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {info.services.map((service) => (
                  <li key={service} className="chip border-brand-200 bg-brand-50 text-brand-800">
                    {service}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="eyebrow">Sustainability</span>
            <h2 className="h-section mt-2">Sustainable options, stated carefully and confirmed by specification.</h2>
            <p className="lead mt-3">
              Material choices can include kraft paper, paperboard, bagasse, CPLA, or other
              options depending on product requirements. Exact compostability, recyclability,
              coating, and food-contact documentation should be confirmed for each destination
              market before publishing or ordering.
            </p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
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

      <section className="section bg-slate-950 text-white">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow text-brand-300">Quality & export flow</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              A clear path from sourcing brief to shipment handoff.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-300 sm:text-lg">
              This workflow is presented as a buyer-facing reference. The supporting image is
              generated marketing artwork and should not be described as a real factory photo.
            </p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-slate-800">
            <Image
              src={qualityImage}
              alt="Quality control and export packing workflow reference"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="container-page mt-10">
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUALITY_TIMELINE.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <span className="text-sm font-semibold text-kraft-300">0{index + 1}</span>
                <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="eyebrow">Information to confirm</span>
            <h2 className="h-section mt-2">Trust details that should come from verified source data.</h2>
          </div>
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
              <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProcessSteps info={info} />
      <InquiryCTA />
    </>
  );
}
