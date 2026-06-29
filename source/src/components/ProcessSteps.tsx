import type { SiteInfo } from "@/lib/types";

const STEPS = [
  {
    n: "1",
    title: "Send your inquiry",
    body: "Submit an RFQ from any product page or the contact form with your specs and quantity.",
  },
  {
    n: "2",
    title: "Confirm quote basis",
    body: "Align material, size, MOQ, pricing basis, sample needs, and any open questions before comparing offers.",
  },
  {
    n: "3",
    title: "Approve details",
    body: "Review artwork, sample references, packing notes, and the agreed timeline before moving ahead.",
  },
  {
    n: "4",
    title: "Prepare handoff",
    body: "Confirm inspection reference points, carton marks, packing method, and shipping handoff details.",
  },
];

export default function ProcessSteps({ info }: { info?: SiteInfo }) {
  return (
    <section className="section bg-slate-50">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">How to order</span>
          <h2 className="h-section mt-2">A simple inquiry-to-shipment process</h2>
          <p className="lead mt-3">
            The workflow helps trade buyers turn a broad sourcing request into a quote-ready
            specification with fewer clarification loops.
          </p>
        </div>

        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="card relative p-6">
              <span className="absolute -top-3 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {s.n}
              </span>
              <h3 className="mt-3 text-base font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
            </li>
          ))}
        </ol>

        {info?.services && info.services.length > 0 ? (
          <div className="mt-10 card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Capabilities &amp; services
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {info.services.map((s) => (
                <li key={s} className="chip border-brand-200 bg-brand-50 text-brand-800">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
