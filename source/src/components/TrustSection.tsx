import type { SiteInfo } from "@/lib/types";

export default function TrustSection({ info }: { info: SiteInfo }) {
  const markets = info.markets ?? [];
  const certificates = info.certificates ?? [];
  const hasPanel = markets.length > 0 || certificates.length > 0;

  return (
    <section className="section">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="eyebrow">Why buyers choose us</span>
          <h2 className="h-section mt-2">Built for reliable export supply</h2>
          <p className="lead mt-3">
            Communication, customization, and consistency matter when sourcing packaging overseas.
            The site is structured to surface available specifications and guide buyers toward
            quote-ready questions before committing to an order.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Available specs shown where sourced",
              "Material, size, and print questions prepared for RFQ",
              "Packing and shipping details captured before order",
              "Direct inquiry path for quotation follow-up",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {hasPanel ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {markets.length > 0 ? (
              <div className="card p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Markets served
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {markets.map((m) => (
                    <li key={m} className="chip">{m}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {certificates.length > 0 ? (
              <div className="card p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Certifications / reports
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {certificates.map((c) => (
                    <li key={c} className="chip border-kraft-200 bg-kraft-50 text-kraft-800">{c}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-slate-400">
                  Confirm exact certificates with the source data before publishing.
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
