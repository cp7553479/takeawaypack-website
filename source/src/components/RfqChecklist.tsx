type RfqChecklistProps = {
  title?: string;
  intro?: string;
};

const checklistItems = [
  {
    title: "Product and size",
    detail: "Share the product name, SKU if known, capacity, dimensions, lid needs, and food use case.",
  },
  {
    title: "Material and finish",
    detail: "Confirm preferred material, color, coating, printing method, and any logo or artwork files.",
  },
  {
    title: "Quantity target",
    detail: "Include target order quantity, sample quantity if needed, and any preferred price break points.",
  },
  {
    title: "Packing and destination",
    detail: "Note carton, pallet, shipping mark, destination country, and delivery timing requirements.",
  },
  {
    title: "Compliance needs",
    detail: "List any food-contact, sustainability, testing, or documentation requirements for your market.",
  },
  {
    title: "Decision process",
    detail: "Tell us whether you need samples, artwork review, or alternative product suggestions before quoting.",
  },
];

export default function RfqChecklist({
  title = "Prepare a clearer RFQ",
  intro = "These details help the team check the right product, quantity, customization, and documentation before confirming a quotation.",
}: RfqChecklistProps) {
  return (
    <section className="section border-y border-slate-200 bg-white">
      <div className="container-page">
        <div className="max-w-3xl">
          <span className="eyebrow">RFQ checklist</span>
          <h2 className="mt-2 h-section">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{intro}</p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {checklistItems.map((item, index) => (
            <div key={item.title} className="border-l-2 border-brand-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-2 text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
