import Image from "next/image";
import Link from "next/link";

import type { SiteInfo } from "@/lib/types";

export default function HeroSection({
  info,
  imageSrc = "/generated/marketing/hero-global-foodservice-packaging.png",
}: {
  info: SiteInfo;
  imageSrc?: string;
}) {
  const valueProps = info.valueProps.length
    ? info.valueProps.slice(0, 4)
    : [
        "Custom packaging and private-label print support",
        "Sustainable material options for foodservice use",
        "Clear specs, MOQ, samples, and quotation steps",
        "Export packing notes for international buyers",
      ];

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-50 to-white" />
      <div className="container-page section relative grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="max-w-[358px] sm:max-w-2xl">
          <span className="eyebrow">Export-ready foodservice packaging</span>
          <h1 className="mt-3 break-words text-3xl font-extrabold leading-tight tracking-tight text-slate-950 text-balance sm:text-5xl lg:text-6xl">
            Custom takeaway packaging for global B2B sourcing.
          </h1>
          <p className="mt-5 lead max-w-xl">
            Source cups, containers, bags, trays, and branded foodservice packaging with
            clear RFQ details, sample support, sustainable material options, and export
            packing guidance.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <Link href="/contact" className="btn-primary w-full sm:w-auto">
              Get a Quote
            </Link>
            <Link href="/contact?intent=samples" className="btn-outline w-full sm:w-auto">
              Request Samples
            </Link>
            <Link href="/products" className="btn-outline w-full sm:w-auto">
              Browse Products
            </Link>
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {valueProps.map((vp) => (
              <li key={vp} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
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

        <div className="relative max-w-[358px] sm:max-w-none">
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xl shadow-slate-200/70 sm:aspect-[16/11]">
            <Image
              src={imageSrc}
              alt="Export-ready foodservice packaging range with paper cups, containers, bags, and custom printed packs"
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative -mt-10 ml-auto grid max-w-xl grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:grid-cols-4">
            {[
              { k: "Custom print", v: "brand-ready packs" },
              { k: "MOQ clarity", v: "quote by spec" },
              { k: "Samples", v: "confirm before bulk" },
              { k: "Export packing", v: "carton details" },
            ].map((b) => (
              <div key={b.k} className="min-w-0">
                <span className="block text-sm font-bold text-slate-950">{b.k}</span>
                <span className="block text-xs leading-relaxed text-slate-500">{b.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
