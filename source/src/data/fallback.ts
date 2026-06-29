// ---------------------------------------------------------------------------
// FALLBACK SAMPLE CONTENT
// ---------------------------------------------------------------------------
// This module provides clearly-marked SAMPLE content. It is used ONLY when the
// real Feishu Base data (content/imports/*.raw.json) is unavailable.
//
// IMPORTANT: Every record below is fictional placeholder content to make the
// site renderable and reviewable. It does NOT represent real company facts,
// real certificates, or real products. When the Base import is unblocked, the
// adapter (dataAdapter.ts) overrides all of this with real data and the
// `source` field flips from "sample" to "imported".
//
// Claims are intentionally modest and generic ("available", "custom", "on
// request") so the sample never asserts a specific capability the company may
// not have. Replace by importing real Base data.
// ---------------------------------------------------------------------------

import type { Category, Product, SiteData, SiteInfo } from "@/lib/types";

export const SAMPLE_SITE_INFO: SiteInfo = {
  source: "sample",
  brandName: "TakeawayPack",
  tagline: "Takeaway & Food Packaging for Export",
  slogan: "Reliable takeaway packaging, built for global trade buyers.",
  description:
    "TakeawayPack is a sample B2B showcase for takeaway and food-service packaging. This text is placeholder content pending real company data from the source Base. The site is engineered for fast product browsing and RFQ-first sourcing support for trade buyers.",
  valueProps: [
    "Custom printing & private label available",
    "Material options to confirm per item",
    "Export packing and consolidated shipping",
    "Supplier communication support for RFQs",
  ],
  contact: {
    email: "sales@example.com",
    phone: "+1 (000) 000-0000",
    whatsapp: "+1 (000) 000-0000",
    address: "Sample address — replace with real company address from the Base.",
    website: "https://example.com",
  },
  markets: ["North America", "Europe", "Middle East", "Asia-Pacific", "Latin America"],
  certificates: ["Samples of common reports shown — confirm real certs from Base"],
  services: [
    "OEM / ODM customization",
    "Custom size & gram weight",
    "Flexo / offset printed branding",
    "Sample sending before bulk order",
  ],
  stats: [
    { label: "Product range", value: "Broad" },
    { label: "Export support", value: "Ready" },
    { label: "RFQ model", value: "First" },
    { label: "MOQ", value: "Flexible" },
  ],
  seo: {
    title: "TakeawayPack — Takeaway & Food Packaging for Export | B2B Inquiry",
    description:
      "Browse takeaway and food-service packaging and request a quotation directly. Sample B2B site — real product and company data loads from the source Base.",
    keywords: [
      "takeaway packaging",
      "food packaging supplier",
      "paper cups wholesale",
      "kraft paper bags",
      "food containers export",
      "B2B packaging inquiry",
    ],
  },
  rawNote:
    "Sample content. Real brand, contact, certificates, and product data will appear once the Feishu Base import (wali-ge profile) is unblocked.",
};

interface SpecSeed {
  label: string;
  value: string;
}

interface ProductSeed {
  name: string;
  category: string;
  summary: string;
  description: string;
  features: string[];
  specs: SpecSeed[];
  moq: string;
  material: string;
  customization: string;
  leadTime: string;
  useCases: string[];
  featured?: boolean;
  priceNote?: string;
}

const PRODUCT_SEEDS: ProductSeed[] = [
  {
    name: "Brown Kraft Stand-Up Pouch",
    category: "Kraft Paper Bags",
    summary: "Matte kraft stand-up pouch with resealable zipper for food retail.",
    description:
      "A versatile stand-up kraft pouch suitable for snacks, dry foods, coffee, and tea. Sturdy bottom gusset for shelf display and a resealable zipper for repeated use. Custom printing available.",
    features: ["Resealable zipper", "Bottom gusset for standing display", "Matte kraft finish", "Custom print up to 8 colors"],
    specs: [
      { label: "Material", value: "Kraft paper + PE liner" },
      { label: "Capacity", value: "100g / 250g / 500g / 1kg" },
      { label: "Closure", value: "Zipper + tear notch" },
      { label: "Thickness", value: "Customizable" },
    ],
    moq: "5,000 pcs / size",
    material: "Kraft paper, food-grade liner",
    customization: "Size, gram weight, print, window, valve",
    leadTime: "20–30 days",
    useCases: ["Coffee", "Snacks", "Tea", "Dry foods"],
    featured: true,
    priceNote: "FOB price on request — depends on size, material, and print.",
  },
  {
    name: "Kraft Window Bread Bag",
    category: "Kraft Paper Bags",
    summary: "Grease-resistant kraft bag with clear window for bakery.",
    description:
      "Bread and bakery bag in natural kraft with a front window for product visibility. Grease-resistant interior keeps baked goods fresh. Ideal for bakeries and cafés.",
    features: ["Clear window", "Grease-resistant inner", "Flat or gusseted", "Twist tie or self-adhesive"],
    specs: [
      { label: "Material", value: "Kraft paper + PP window" },
      { label: "Sizes", value: "Multiple bakery sizes" },
      { label: "Finish", value: "Natural kraft" },
    ],
    moq: "10,000 pcs / size",
    material: "Kraft paper",
    customization: "Size, window shape, print",
    leadTime: "18–28 days",
    useCases: ["Bakery", "Café", "Patisserie"],
    featured: false,
  },
  {
    name: "Kraft Takeaway Carrier Bag",
    category: "Kraft Paper Bags",
    summary: "Twisted-handle kraft carrier bag for takeaway and retail.",
    description:
      "Strong twisted-handle carrier bag for takeaway food and retail. Reinforced bottom and robust handles for reliable carry. Available in flat and gusseted styles.",
    features: ["Twisted paper handles", "Reinforced bottom", "Recyclable material", "Custom logo print"],
    specs: [
      { label: "Material", value: "Kraft paper, 120–170 gsm" },
      { label: "Handle", value: "Twisted paper" },
      { label: "Capacity", value: "2–6 kg" },
    ],
    moq: "5,000 pcs / size",
    material: "Kraft paper",
    customization: "Size, gsm, handle, print",
    leadTime: "15–25 days",
    useCases: ["Takeaway", "Retail", "Delivery"],
    featured: true,
    priceNote: "FOB price on request.",
  },
  {
    name: "Kraft Salad Bowl with Lid",
    category: "Food Containers",
    summary: "Leak-resistant kraft salad bowl with matching PET lid.",
    description:
      "Round kraft salad bowl with a PE lining for leak resistance and a clear PET lid for secure transport of fresh salads and cold food. Sturdy and stackable.",
    features: ["Leak-resistant lining", "Clear PET lid", "Stackable", "Custom print on outer wall"],
    specs: [
      { label: "Material", value: "Kraft + PE lining, PET lid" },
      { label: "Capacity", value: "500 / 750 / 1000 ml" },
      { label: "Lid", value: "Optional PET flat/dome lid" },
    ],
    moq: "10,000 pcs / size",
    material: "Kraft paper, PET",
    customization: "Size, print, lid type",
    leadTime: "20–30 days",
    useCases: ["Salads", "Cold food", "Meal prep"],
    featured: true,
  },
  {
    name: "Bamboo Fiber Lunch Box",
    category: "Food Containers",
    summary: "Reusable-look bamboo fiber clamshell for hot meals.",
    description:
      "Bamboo fiber lunch box with a secure clasp for hot takeaway meals. Heat resistant and sturdy with a natural finish. Custom embossing and color available.",
    features: ["Heat resistant", "Secure clasp closure", "Natural finish", "Custom color & emboss"],
    specs: [
      { label: "Material", value: "Bamboo fiber" },
      { label: "Compartments", value: "1–3 compartments" },
      { label: "Temperature", value: "Up to ~120°C (confirm on request)" },
    ],
    moq: "3,000 pcs / size",
    material: "Bamboo fiber",
    customization: "Color, compartments, embossing",
    leadTime: "25–35 days",
    useCases: ["Hot meals", "Bento", "Catering"],
    featured: false,
  },
  {
    name: "Rectangular Aluminum Foil Container",
    category: "Food Containers",
    summary: "Oven-safe aluminum foil tray with optional board lid.",
    description:
      "Aluminum foil container suitable for baking, roasting, and delivery of hot food. Oven and freezer safe, with optional card lid. Recyclable.",
    features: ["Oven & freezer safe", "Optional card lid", "Recyclable aluminum", "Full-size range"],
    specs: [
      { label: "Material", value: "Aluminum foil" },
      { label: "Capacity", value: "200–1000 ml" },
      { label: "Lid", value: "Optional aluminum / card lid" },
    ],
    moq: "10 cartons / size",
    material: "Aluminum foil",
    customization: "Size, thickness, lid, emboss",
    leadTime: "15–25 days",
    useCases: ["Baking", "Delivery", "Ready meals"],
    featured: false,
  },
  {
    name: "Single Wall Paper Cup",
    category: "Paper Cups",
    summary: "PE-coated single wall cup for cold and warm drinks.",
    description:
      "Standard single wall paper cup for water, soda, and warm drinks. Smooth print surface for full-color branding. Multiple sizes available.",
    features: ["PE-coated", "Full-color print", "Multiple sizes", "Stackable"],
    specs: [
      { label: "Material", value: "Food-grade paperboard + PE" },
      { label: "Sizes", value: "4 / 7 / 8 / 9 / 10 / 12 oz" },
      { label: "Print", value: "Flexo / offset" },
    ],
    moq: "50,000 pcs / size",
    material: "Paperboard + PE",
    customization: "Size, gsm, print, lid match",
    leadTime: "20–30 days",
    useCases: ["Water", "Soda", "Warm drinks"],
    featured: true,
    priceNote: "FOB price on request — sized by oz and print.",
  },
  {
    name: "Double Wall Hot Paper Cup",
    category: "Paper Cups",
    summary: "Insulated double wall cup for hot coffee and tea.",
    description:
      "Double wall paper cup with an air-gap for hand-friendly insulation on hot beverages. Premium feel, ideal for coffee shops and cafés. Custom print and emboss available.",
    features: ["Insulated double wall", "Comfortable to hold", "Premium print surface", "Embossing available"],
    specs: [
      { label: "Material", value: "Paperboard + PE, double wall" },
      { label: "Sizes", value: "8 / 12 / 16 oz" },
      { label: "Lid", value: "Matches standard dome/flat lids" },
    ],
    moq: "30,000 pcs / size",
    material: "Paperboard",
    customization: "Size, sleeve, print, emboss",
    leadTime: "25–35 days",
    useCases: ["Coffee", "Tea", "Hot chocolate"],
    featured: true,
  },
  {
    name: "Ripple Wall Paper Cup",
    category: "Paper Cups",
    summary: "Triple-layer ripple cup for extra-hot drinks without a sleeve.",
    description:
      "Ripple wall cup eliminates the need for a separate sleeve, keeping hands comfortable with very hot drinks. Distinctive textured exterior supports bold branding.",
    features: ["No sleeve needed", "Textured grip", "Bold print area", "Premium presentation"],
    specs: [
      { label: "Material", value: "Paperboard, triple layer" },
      { label: "Sizes", value: "12 / 16 / 20 oz" },
      { label: "Texture", value: "Kraft or white ripple" },
    ],
    moq: "20,000 pcs / size",
    material: "Paperboard",
    customization: "Size, ripple color, print",
    leadTime: "25–35 days",
    useCases: ["Coffee", "Specialty drinks"],
    featured: false,
  },
  {
    name: "3-Compartment Bagasse Tray",
    category: "Compartment Trays",
    summary: "Compostable bagasse tray with three compartments.",
    description:
      "Bagasse (sugarcane fiber) tray with three compartments to keep foods separate. Suitable for hot and greasy food; commercially compostable where facilities exist.",
    features: ["Three compartments", "Heat & grease resistant", "Compostable fiber", "Secure lid option"],
    specs: [
      { label: "Material", value: "Bagasse (sugarcane fiber)" },
      { label: "Compartments", value: "3" },
      { label: "Lid", value: "Optional bagasse / PET lid" },
    ],
    moq: "10,000 pcs / size",
    material: "Bagasse",
    customization: "Size, compartments, lid, print",
    leadTime: "20–30 days",
    useCases: ["Meals", "Bento", "Catering"],
    featured: true,
  },
  {
    name: "Bagasse Burger Clamshell",
    category: "Compartment Trays",
    summary: "Sturdy bagasse clamshell for burgers and sandwiches.",
    description:
      "Bagasse clamshell container for burgers, sandwiches, and grilled food. Keeps food warm and resists grease; hinged lid for secure closing.",
    features: ["Hinged clamshell", "Grease resistant", "Insulating fiber", "Custom emboss"],
    specs: [
      { label: "Material", value: "Bagasse" },
      { label: "Style", value: "Hinged clamshell" },
      { label: "Sizes", value: "Standard & large" },
    ],
    moq: "10,000 pcs / size",
    material: "Bagasse",
    customization: "Size, emboss, print",
    leadTime: "20–30 days",
    useCases: ["Burgers", "Sandwiches", "Grills"],
    featured: false,
  },
  {
    name: "Round Bagasse Plate",
    category: "Compartment Trays",
    summary: "Compostable round plate for events and catering.",
    description:
      "Round bagasse plate for main courses and event catering. Sturdy enough for hot and wet foods; available in multiple diameters.",
    features: ["Sturdy for hot/wet food", "Multiple diameters", "Commercially compostable", "Custom print"],
    specs: [
      { label: "Material", value: "Bagasse" },
      { label: "Diameter", value: "7 / 9 / 10 inch" },
    ],
    moq: "10,000 pcs / size",
    material: "Bagasse",
    customization: "Diameter, print, compartments",
    leadTime: "20–30 days",
    useCases: ["Events", "Catering", "Takeaway"],
    featured: false,
  },
  {
    name: "2 oz PP Sauce Cup with Lid",
    category: "Sauce Cups",
    summary: "Transparent sauce cup with secure snap-on lid.",
    description:
      "Small polypropylene sauce cup for dressings, dips, and condiments. Transparent body shows contents; secure snap-on lid prevents leaks during delivery.",
    features: ["Transparent", "Leak-resistant lid", "Stackable", "Custom label"],
    specs: [
      { label: "Material", value: "PP" },
      { label: "Capacity", value: "1 / 2 / 3.5 oz" },
      { label: "Lid", value: "Snap-on, included" },
    ],
    moq: "100 cartons / size",
    material: "Polypropylene",
    customization: "Size, color, label",
    leadTime: "15–25 days",
    useCases: ["Sauces", "Dips", "Dressings"],
    featured: false,
  },
  {
    name: "PET Dome Lids (Assorted)",
    category: "Sauce Cups",
    summary: "Dome and flat lids for cups and bowls.",
    description:
      "Range of PET lids for cups, bowls, and sauce containers. Dome styles for tall toppings, flat styles for stacking. Match to your container on request.",
    features: ["Dome & flat styles", "Crack-resistant PET", "Stackable", "Container-matched"],
    specs: [
      { label: "Material", value: "PET" },
      { label: "Styles", value: "Dome / flat / vented" },
    ],
    moq: "100 cartons / type",
    material: "PET",
    customization: "Type, fit, venting",
    leadTime: "15–25 days",
    useCases: ["Cups", "Bowls", "Sauces"],
    featured: false,
  },
  {
    name: "Wooden Cutlery Set",
    category: "Cutlery",
    summary: "Smooth birchwood fork, knife, spoon, and napkin set.",
    description:
      "Disposable cutlery set in smooth birchwood — fork, knife, spoon, and optional napkin. Splinter-free finish; suitable for hot food. Custom packaging and branding available.",
    features: ["Splinter-free birchwood", "Heat tolerant", "Individually wrapped option", "Custom print on wrap"],
    specs: [
      { label: "Material", value: "Birchwood" },
      { label: "Set", value: "Fork + knife + spoon (+ napkin)" },
      { label: "Pack", value: "Loose or individually wrapped" },
    ],
    moq: "500 cartons",
    material: "Birchwood",
    customization: "Wrap, print, set contents",
    leadTime: "20–30 days",
    useCases: ["Takeaway", "Delivery", "Events"],
    featured: true,
  },
  {
    name: "CPLA Cutlery (Heat Resistant)",
    category: "Cutlery",
    summary: "Compostable CPLA cutlery for hot food service.",
    description:
      "Crystallized PLA (CPLA) cutlery with higher heat resistance than standard PLA. Suitable for hot meals; commercially compostable where facilities exist.",
    features: ["Heat resistant", "Commercially compostable", "Sturdy feel", "Custom print on wrap"],
    specs: [
      { label: "Material", value: "CPLA" },
      { label: "Set", value: "Fork + knife + spoon" },
      { label: "Color", value: "Natural or custom" },
    ],
    moq: "300 cartons",
    material: "CPLA",
    customization: "Color, wrap, print",
    leadTime: "25–35 days",
    useCases: ["Hot meals", "Eco catering"],
    featured: false,
  },
];

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  "kraft-paper-bags": "/generated/product-kraft-packaging.png",
  "food-containers": "/generated/product-food-containers.png",
  "paper-cups": "/generated/product-paper-cups.png",
  "compartment-trays": "/generated/product-compartment-trays.png",
  "sauce-cups": "/generated/product-sauce-cups.png",
  cutlery: "/generated/product-cutlery.png",
};

export function getSampleProducts(): Product[] {
  return PRODUCT_SEEDS.map((p, i) => {
    const categorySlug = slugify(p.category);
    return {
      source: "sample" as const,
      id: `sample-${i + 1}`,
      slug: slugify(`${p.name}`),
      name: p.name,
      category: p.category,
      categorySlug,
      summary: p.summary,
      description: p.description,
      features: p.features,
      image: CATEGORY_IMAGE_MAP[categorySlug],
      specs: p.specs,
      moq: p.moq,
      material: p.material,
      customization: p.customization,
      leadTime: p.leadTime,
      useCases: p.useCases,
      priceNote: p.priceNote,
      featured: p.featured,
    };
  });
}

export function getSampleCategories(): Category[] {
  const counts = new Map<string, number>();
  for (const p of PRODUCT_SEEDS) {
    const slug = slugify(p.category);
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }
  const names = new Map<string, string>();
  for (const p of PRODUCT_SEEDS) names.set(slugify(p.category), p.category);

  const descriptions: Record<string, string> = {
    "kraft-paper-bags": "Carry bags, bakery bags, and stand-up pouches in natural kraft.",
    "food-containers": "Bowls, clamshells, and foil containers for hot and cold food.",
    "paper-cups": "Single, double, and ripple wall cups for any beverage.",
    "compartment-trays": "Bagasse trays, plates, and clamshells for meals and catering.",
    "sauce-cups": "Sauce cups, lids, and condiment packaging for delivery.",
    cutlery: "Wooden and CPLA cutlery sets for takeaway and events.",
  };

  return Array.from(counts.keys())
    .sort()
    .map((slug) => ({
      slug,
      name: names.get(slug) ?? slug,
      description: descriptions[slug],
      image: CATEGORY_IMAGE_MAP[slug],
      count: counts.get(slug) ?? 0,
    }));
}

export function getSampleSiteData(): SiteData {
  return {
    info: SAMPLE_SITE_INFO,
    products: getSampleProducts(),
    categories: getSampleCategories(),
    dataSource: "sample",
  };
}

export function slugify(input: string): string {
  return input
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}
