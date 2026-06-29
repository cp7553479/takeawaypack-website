export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "foodservice-packaging-rfq-checklist",
    title: "Foodservice packaging RFQ checklist for overseas buyers",
    excerpt:
      "A practical list of details to send before quotation so suppliers can compare material, size, print, quantity, and delivery needs clearly.",
    date: "2026-06-29",
    readTime: "4 min read",
    category: "RFQ guide",
    sections: [
      {
        heading: "Start with product use and format",
        body:
          "Describe the food or drink application, required capacity or dimensions, matching lid needs, and whether the pack is for hot, cold, delivery, retail display, or sampling use.",
      },
      {
        heading: "Separate material preference from required performance",
        body:
          "If the material is not fixed, explain the performance requirement instead: grease resistance, heat handling, visibility, stacking, or branding surface. Final food-contact or sustainability claims should be checked by item and destination market.",
      },
      {
        heading: "Quote by quantity, print, and destination",
        body:
          "Provide target order quantity, artwork or color expectations, and destination country or port. MOQ, unit price, sample path, and lead time should be confirmed against the exact specification.",
      },
    ],
  },
  {
    slug: "custom-print-packaging-sample-review",
    title: "What to check before approving custom printed packaging samples",
    excerpt:
      "Use sample review to reduce repeat-order risk: confirm size, print direction, lid fit, carton packing, and market documentation before bulk purchase.",
    date: "2026-06-29",
    readTime: "3 min read",
    category: "Sample review",
    sections: [
      {
        heading: "Check the physical fit first",
        body:
          "Confirm the real product size, lid matching, stack height, sealing or closure behavior, and how the package performs with the intended foodservice use.",
      },
      {
        heading: "Review artwork in production context",
        body:
          "Inspect print direction, color expectation, readable marks, barcode placement if needed, and carton labels. Keep approved artwork and sample references together for reorder communication.",
      },
      {
        heading: "Document unresolved items",
        body:
          "If certifications, compostability, recyclability, or market-specific labels matter, request item-level documents before publishing claims or committing to a launch.",
      },
    ],
  },
  {
    slug: "sustainable-packaging-claims-buyer-notes",
    title: "How to handle sustainable packaging claims conservatively",
    excerpt:
      "Buyers often ask for eco-friendly options, but public claims should stay tied to material structure, documents, and destination-market rules.",
    date: "2026-06-29",
    readTime: "4 min read",
    category: "Materials",
    sections: [
      {
        heading: "Use precise material language",
        body:
          "Name the material and coating structure where known, such as paperboard, kraft paper, bagasse, PET, PP, CPLA, or aluminum. Avoid broad claims when the actual item-level structure is not confirmed.",
      },
      {
        heading: "Match claims to documents",
        body:
          "Compostable, recyclable, plastic-free, and food-contact claims can depend on testing, local infrastructure, and market rules. Confirm documents by SKU before using those claims in customer-facing copy.",
      },
      {
        heading: "Ask for packaging and logistics context",
        body:
          "Sustainability decisions can include carton packing, shipment consolidation, damage reduction, and right-sized formats, not only the primary package material.",
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
