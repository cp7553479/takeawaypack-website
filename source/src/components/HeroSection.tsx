import Link from "next/link";

import type { SiteInfo } from "@/lib/types";

export default function HeroSection({ info }: { info: SiteInfo }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-brand-50 via-white to-kraft-50">
      <div className="container-page section grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="eyebrow">B2B Takeaway &amp; Food Packaging</span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 text-balance sm:text-4xl lg:text-5xl">
            {info.slogan ?? info.tagline ?? `${info.brandName} — packaging built for global trade`}
          </h1>
          <p className="mt-4 lead max-w-xl">{info.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/contact" className="btn-accent">
              Request a Quotation
            </Link>
            <Link href="/products" className="btn-outline">
              Browse Products
            </Link>
          </div>

          {info.valueProps.length > 0 ? (
            <ul className="mt-7 grid gap-2 sm:grid-cols-2">
              {info.valueProps.slice(0, 4).map((vp) => (
                <li key={vp} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  {vp}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "Food-grade", v: "material options" },
              { k: "Custom print", v: "& private label" },
              { k: "Export packing", v: "& consolidation" },
              { k: "Direct RFQ", v: "to the factory" },
            ].map((b) => (
              <div key={b.k} className="card flex flex-col gap-1 p-5">
                <span className="text-lg font-bold text-brand-700">{b.k}</span>
                <span className="text-sm text-slate-600">{b.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
