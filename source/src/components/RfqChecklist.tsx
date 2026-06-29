import SectionHeading from "@/components/section-heading";

type RfqChecklistProps = {
  title?: string;
  intro?: string;
};

const checklistItems = [
  {
    title: "Product and size",
    detail:
      "Share the product name, SKU if known, capacity, dimensions, lid needs, and food use case.",
  },
  {
    title: "Material and finish",
    detail:
      "Confirm preferred material, color, coating, printing method, and any logo or artwork files.",
  },
  {
    title: "Quantity target",
    detail:
      "Include target order quantity, sample quantity if needed, and any preferred price break points.",
  },
  {
    title: "Packing and destination",
    detail:
      "Note carton, pallet, shipping mark, destination country, and delivery timing requirements.",
  },
  {
    title: "Compliance needs",
    detail:
      "List any food-contact, sustainability, testing, or documentation requirements for your market.",
  },
  {
    title: "Decision process",
    detail:
      "Tell us whether you need samples, artwork review, or alternative product suggestions before quoting.",
  },
];

export default function RfqChecklist({
  title = "Prepare a clearer RFQ",
  intro = "These details help the team check the right product, quantity, customization, and documentation before confirming a quotation.",
}: RfqChecklistProps) {
  return (
    <section className="section border-y bg-card">
      <div className="container-page">
        <SectionHeading eyebrow="RFQ checklist" title={title} description={intro} />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {checklistItems.map((item, index) => (
            <div
              key={item.title}
              className="rounded-xl border border-l-4 border-l-primary/70 bg-background p-5"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-2 text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
