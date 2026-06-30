// Domain types for the takeawaypack website.
//
// These types describe the NORMALIZED shape the UI consumes, regardless of
// whether the data came from the Feishu Base import (content/imports/*.json)
// or from the local fallback sample content in src/data/fallback.ts.
// The adapter in src/lib/dataAdapter.ts is responsible for turning raw Feishu
// records into these types.

export type DataSource = "imported" | "sample";

export interface ContactInfo {
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  website?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface SeoInfo {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface SiteInfo {
  source: DataSource;
  brandName: string;
  tagline?: string;
  slogan?: string;
  description: string;
  valueProps: string[];
  contact: ContactInfo;
  markets?: string[];
  certificates?: string[];
  services?: string[];
  socials?: SocialLink[];
  nav?: NavItem[];
  stats?: Stat[];
  seo?: SeoInfo;
  /** Free-form note explaining provenance for the footer/debug strip. */
  rawNote?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductPriceTier {
  tier: number;
  quantity: number;
  price: string;
  currency: string;
}

export interface Product {
  source: DataSource;
  /** Stable internal id (derived from record id or slug). */
  id: string;
  baseRecordId?: string;
  parentBaseRecordId?: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  summary?: string;
  description?: string;
  features?: string[];
  /** Primary image URL. If absent or not an http(s) URL, a placeholder is shown. */
  image?: string;
  gallery?: string[];
  specs: ProductSpec[];
  moq?: string;
  material?: string;
  customization?: string;
  leadTime?: string;
  certifications?: string[];
  useCases?: string[];
  priceNote?: string;
  priceTiers?: ProductPriceTier[];
  hasQuote?: boolean;
  hasImage?: boolean;
  noImageReason?: string;
  isVariant?: boolean;
  variantCount?: number;
  featured?: boolean;
}

export interface Category {
  slug: string;
  name: string;
  description?: string;
  image?: string;
  count: number;
}

export interface SiteData {
  info: SiteInfo;
  products: Product[];
  categories: Category[];
  /** "imported" if any real Feishu data was loaded, else "sample". */
  dataSource: DataSource;
}

export interface InquiryPayload {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  product?: string;
  quantity?: string;
  message: string;
  /** Optional page the inquiry originated from. */
  source?: string;
}

export interface InquiryResult {
  ok: boolean;
  mode: "vercel-postgres" | "supabase" | "demo";
  message: string;
  id?: string;
  errors?: Record<string, string>;
}
