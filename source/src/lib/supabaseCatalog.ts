import { getSampleSiteData, slugify } from "@/data/fallback";
import { getSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";
import type { Category, Product, ProductPriceTier, ProductSpec, SiteData, SiteInfo } from "@/lib/types";

type SupabaseProductRow = {
  id: number;
  base_record_id: string;
  parent_base_record_id: string | null;
  slug: string;
  name: string;
  short_name: string | null;
  category_name: string;
  category_slug: string;
  product_type: string | null;
  material: string | null;
  sku: string | null;
  summary: string | null;
  description: string | null;
  specs_text: string | null;
  moq: string | null;
  customization: string | null;
  currency_normalized: string | null;
  has_quote: boolean;
  has_image: boolean;
  no_image_reason: string | null;
  is_variant: boolean;
  featured: boolean;
};

type SupabaseCategoryRow = {
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
};

type SupabaseSettingRow = {
  key: string;
  value: string;
};

type SupabaseMediaRow = {
  product_id: number;
  public_path: string | null;
  position: number;
};

type SupabaseSpecRow = {
  product_id: number;
  label: string;
  value: string;
  position: number;
};

type SupabasePriceRow = {
  product_id: number;
  tier: number;
  quantity: number | null;
  price: string | null;
  currency: string | null;
  has_price: boolean;
};

function numberTextOrNull(value: unknown): string | null {
  if (value == null) return null;
  const rendered = String(value).trim();
  if (!rendered) return null;
  return Number.isFinite(Number(rendered)) ? rendered : null;
}

function buildPriceTiers(rows: SupabasePriceRow[], fallbackCurrency?: string | null): ProductPriceTier[] {
  return rows
    .map((row) => {
      const price = numberTextOrNull(row.price);
      if (row.quantity == null || !price) return null;
      return {
        tier: row.tier,
        quantity: row.quantity,
        price,
        currency: row.currency || fallbackCurrency || "US dollar",
      };
    })
    .filter((tier): tier is ProductPriceTier => Boolean(tier));
}

export function hasSupabaseCatalogEnv() {
  return isSupabaseConfigured();
}

export async function querySupabaseSiteData(): Promise<SiteData | null> {
  const supabase = getSupabaseServer();
  if (!supabase) return null;

  const [productsRes, categoriesRes, settingsRes, mediaRes, specsRes, pricesRes] = await Promise.all([
    fetchAll<SupabaseProductRow>(() =>
      supabase.from("takeawaypack_products").select("*").order("is_variant", { ascending: true }).order("name", { ascending: true })
    ),
    fetchAll<SupabaseCategoryRow>(() =>
      supabase.from("takeawaypack_categories").select("slug,name,description,image").order("name", { ascending: true })
    ),
    fetchAll<SupabaseSettingRow>(() =>
      supabase.from("takeawaypack_site_settings").select("key,value").order("key", { ascending: true })
    ),
    fetchAll<SupabaseMediaRow>(() =>
      supabase.from("takeawaypack_product_media").select("product_id,public_path,position").order("position", { ascending: true })
    ),
    fetchAll<SupabaseSpecRow>(() =>
      supabase.from("takeawaypack_product_specifications").select("product_id,label,value,position").order("position", { ascending: true })
    ),
    fetchAll<SupabasePriceRow>(() =>
      supabase.from("takeawaypack_product_price_tiers").select("product_id,tier,quantity,price,currency,has_price").eq("has_price", true).order("tier", { ascending: true })
    ),
  ]);

  const productRows = productsRes;
  if (productRows.length === 0) return null;

  const mediaByProduct = groupBy(mediaRes, (row) => row.product_id);
  const specsByProduct = groupBy(specsRes, (row) => row.product_id);
  const pricesByProduct = groupBy(pricesRes, (row) => row.product_id);
  const productsByBaseRecord = new Map(productRows.map((row) => [row.base_record_id, row]));

  const products: Product[] = productRows.map((row) => {
    const gallery = (mediaByProduct.get(row.id) ?? [])
      .map((media) => media.public_path)
      .filter((value): value is string => Boolean(value));
    const specs: ProductSpec[] = (specsByProduct.get(row.id) ?? [])
      .filter((spec) => spec.label !== "MOQ")
      .map((spec) => ({
        label: spec.label,
        value: spec.value,
      }));
    const priceTiers = buildPriceTiers(pricesByProduct.get(row.id) ?? [], row.currency_normalized);
    const variantCount = productRows.filter((candidate) => candidate.parent_base_record_id === row.base_record_id).length;
    if (variantCount > 0) {
      specs.push({ label: "Available variants", value: String(variantCount) });
    }
    if (row.parent_base_record_id) {
      specs.push({ label: "Parent Base record", value: row.parent_base_record_id });
    }

    return {
      source: "imported",
      id: row.base_record_id,
      baseRecordId: row.base_record_id,
      parentBaseRecordId: productsByBaseRecord.has(row.parent_base_record_id ?? "") ? row.parent_base_record_id ?? undefined : row.parent_base_record_id ?? undefined,
      slug: row.slug,
      name: row.name,
      category: row.category_name,
      categorySlug: row.category_slug,
      summary: row.summary ?? undefined,
      description: row.description ?? undefined,
      image: gallery[0],
      gallery: gallery.length ? gallery : undefined,
      specs,
      moq: row.moq ?? undefined,
      material: row.material ?? undefined,
      customization: row.customization ?? undefined,
      priceNote: formatPriceNote(row, priceTiers),
      priceTiers,
      hasQuote: row.has_quote,
      hasImage: row.has_image,
      noImageReason: row.no_image_reason ?? undefined,
      isVariant: row.is_variant,
      variantCount,
      featured: row.featured,
    };
  });

  const productsByCategory = new Map<string, number>();
  const firstImageByCategory = new Map<string, string>();
  for (const product of products) {
    productsByCategory.set(product.categorySlug, (productsByCategory.get(product.categorySlug) ?? 0) + 1);
    if (product.image && !firstImageByCategory.has(product.categorySlug)) {
      firstImageByCategory.set(product.categorySlug, product.image);
    }
  }

  const categories: Category[] = categoriesRes
    .map((row) => ({
      slug: row.slug,
      name: row.name,
      description: row.description ?? undefined,
      image: row.image ?? firstImageByCategory.get(row.slug),
      count: productsByCategory.get(row.slug) ?? 0,
    }))
    .filter((category) => category.count > 0);

  return {
    info: buildSiteInfo(settingsRes),
    products,
    categories,
    dataSource: "imported",
  };
}

async function fetchAll<T>(
  queryFactory: () => {
    range: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>;
  },
  pageSize = 1000
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await queryFactory().range(from, from + pageSize - 1);
    if (error) throw error;
    const page = data ?? [];
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  return rows;
}

function formatPriceNote(row: SupabaseProductRow, tiers: ProductPriceTier[]): string {
  const first = tiers[0];
  if (!row.has_quote || !first) return "Contact for quote";
  return `From ${first.currency} ${first.price} at ${first.quantity.toLocaleString()} pcs`;
}

function buildSiteInfo(rows: SupabaseSettingRow[]): SiteInfo {
  const sample = getSampleSiteData();
  const settings = new Map(rows.map((row) => [row.key, row.value]));
  const trustPillars = [1, 2, 3, 4]
    .map((n) => settings.get(`Trust Pillar ${n}`))
    .filter((value): value is string => Boolean(value));

  return {
    ...sample.info,
    source: "imported",
    brandName: settings.get("Company Name") ?? "TakeawayPack",
    tagline: settings.get("Positioning"),
    slogan: settings.get("Positioning"),
    description: settings.get("Brand Philosophy") ?? sample.info.description,
    valueProps: trustPillars.length ? trustPillars : sample.info.valueProps,
    contact: {
      email: settings.get("General Enquiries Email"),
      phone: settings.get("Direct Support"),
      address: [settings.get("Headquarters Address"), settings.get("Postal Code")]
        .filter(Boolean)
        .join(", "),
    },
    markets: splitList(settings.get("Target Markets")),
    services: splitList(settings.get("Functional Keywords")),
    seo: {
      title: `${settings.get("Company Name") ?? "TakeawayPack"} — ${settings.get("Positioning") ?? "Foodservice Packaging"}`,
      description: settings.get("Brand Philosophy"),
      keywords: [
        ...splitList(settings.get("Primary Keywords")),
        ...splitList(settings.get("Value Keywords")),
      ],
    },
    rawNote:
      "Company, product, category, and media data loaded from Supabase tables prefixed takeawaypack_* and Supabase Storage path takeawaypack/.",
  };
}

function splitList(value?: string): string[] {
  if (!value) return [];
  return value
    .split(/[;；,，]|\band\b/i)
    .map((item) => item.trim())
    .filter(Boolean);
}

function groupBy<T, K>(rows: T[], keyFn: (row: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const row of rows) {
    const key = keyFn(row);
    const group = map.get(key) ?? [];
    group.push(row);
    map.set(key, group);
  }
  return map;
}

export { slugify };
