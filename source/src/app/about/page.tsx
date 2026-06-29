import type { Metadata } from "next";
import Image from "next/image";

import InquiryCTA from "@/components/InquiryCTA";
import ProcessSteps from "@/components/ProcessSteps";
import { getSiteData } from "@/lib/dataAdapter";
import { getMediaAssetUrl } from "@/lib/mediaAssets";

export const metadata: Metadata = {
  title: "About & Capabilities",
  description:
    "Company overview and packaging capabilities for takeaway and food-service export buyers.",
};

export default async function AboutPage() {
  const { info } = await getSiteData();
  const capabilityImage = await getMediaAssetUrl("/generated/capabilities-quality-control.png");

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="container-page section-tight">
          <span className="eyebrow">About</span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {info.brandName}
          </h1>
          {info.tagline ? <p className="lead mt-3 max-w-2xl">{info.tagline}</p> : null}
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-sm">
              <Image
                src={capabilityImage}
                alt="Packaging samples, measuring tools, and export cartons prepared for quality control"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Company overview</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{info.description}</p>

            {info.valueProps.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  What we offer
                </h3>
                <ul className="mt-3 space-y-3">
                  {info.valueProps.map((vp) => (
                    <li key={vp} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-100 text-brand-700">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      {vp}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="space-y-4">
            {info.services && info.services.length > 0 ? (
              <div className="card p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Capabilities
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {info.services.map((s) => (
                    <li key={s} className="chip border-brand-200 bg-brand-50 text-brand-800">{s}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {info.markets && info.markets.length > 0 ? (
              <div className="card p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Markets served
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {info.markets.map((m) => (
                    <li key={m} className="chip">{m}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {info.certificates && info.certificates.length > 0 ? (
              <div className="card p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Certifications
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {info.certificates.map((c) => (
                    <li key={c} className="chip border-kraft-200 bg-kraft-50 text-kraft-800">{c}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-slate-400">
                  Verify exact certificates from the source Base before publishing.
                </p>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <ProcessSteps info={info} />
      <InquiryCTA />
    </>
  );
}
