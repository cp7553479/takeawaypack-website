import { sql } from "@vercel/postgres";

import { getSampleSiteData, slugify } from "@/data/fallback";
import { hasSupabaseCatalogEnv, querySupabaseSiteData } from "@/lib/supabaseCatalog";
import type { Category, Product, ProductSpec, SiteData, SiteInfo } from "@/lib/types";

let cache: SiteData | null = null;

type ProductRow = {
  id: string;
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
  image: string | null;
  gallery: string[] | null;
  specs: ProductSpec[] | null;
  price_tiers: Array<{ tier: number; quantity: number | null; price: string | null; currency: string | null }> | null;
};

type CategoryRow = {
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  count: string;
};

type SiteSettingRow = {
  key: string;
  value: string;
};

function hasPostgresEnv() {
  return Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL);
}

async function queryProducts(): Promise<Product[]> {
  const { rows } = await sql<ProductRow>`
    SELECT
      p.id::text,
      p.base_record_id,
      p.parent_base_record_id,
      p.slug,
      p.name,
      p.short_name,
      p.category_name,
      p.category_slug,
      p.product_type,
      p.material,
      p.sku,
      p.summary,
      p.description,
      p.specs_text,
      p.moq,
      p.customization,
      p.currency_normalized,
      p.has_quote,
      p.has_image,
      p.no_image_reason,
      p.is_variant,
      p.featured,
      (
        SELECT pm.public_path
        FROM product_media pm
        WHERE pm.product_id = p.id
        ORDER BY pm.position ASC
        LIMIT 1
      ) AS image,
      COALESCE(
        (
          SELECT jsonb_agg(pm.public_path ORDER BY pm.position ASC)
          FROM product_media pm
          WHERE pm.product_id = p.id
        ),
        '[]'::jsonb
      ) AS gallery,
      COALESCE(
        (
          SELECT jsonb_agg(jsonb_build_object('label', ps.label, 'value', ps.value) ORDER BY ps.position ASC)
          FROM product_specifications ps
          WHERE ps.product_id = p.id
        ),
        '[]'::jsonb
      ) AS specs,
      COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'tier', ppt.tier,
              'quantity', ppt.quantity,
              'price', ppt.price::text,
              'currency', ppt.currency
            )
            ORDER BY ppt.tier ASC
          )
          FROM product_price_tiers ppt
          WHERE ppt.product_id = p.id AND ppt.has_price = true
        ),
        '[]'::jsonb
      ) AS price_tiers
    FROM products p
    ORDER BY p.is_variant ASC, p.name ASC
  `;

  const products = rows.map((row) => {
    const gallery = Array.isArray(row.gallery) ? row.gallery.filter(Boolean) : [];
    const priceNote = formatPriceNote(row);
    const variantCount = rows.filter((candidate) => candidate.parent_base_record_id === row.base_record_id).length;
    const specs = Array.isArray(row.specs) ? [...row.specs] : [];
    if (variantCount > 0) {
      specs.push({ label: "Available variants", value: String(variantCount) });
    }
    if (row.parent_base_record_id) {
      specs.push({ label: "Parent Base record", value: row.parent_base_record_id });
    }

    return {
      source: "imported" as const,
      id: row.base_record_id,
      baseRecordId: row.base_record_id,
      parentBaseRecordId: row.parent_base_record_id ?? undefined,
      slug: row.slug,
      name: row.name,
      category: row.category_name,
      categorySlug: row.category_slug,
      summary: row.summary ?? undefined,
      description: row.description ?? undefined,
      image: row.image ?? undefined,
      gallery: gallery.length ? gallery : undefined,
      specs,
      moq: row.moq ?? undefined,
      material: row.material ?? undefined,
      customization: row.customization ?? undefined,
      priceNote,
      hasQuote: row.has_quote,
      hasImage: row.has_image,
      noImageReason: row.no_image_reason ?? undefined,
      isVariant: row.is_variant,
      variantCount,
      featured: row.featured,
    } satisfies Product;
  });

  return products;
}

function formatPriceNote(row: ProductRow): string {
  const tiers = Array.isArray(row.price_tiers) ? row.price_tiers : [];
  const first = tiers.find((tier) => tier.price);
  if (!row.has_quote || !first?.price) return "Contact for quote";
  const quantity = first.quantity ? `${first.quantity.toLocaleString()} pcs` : "quoted quantity";
  const currency = row.currency_normalized || "US dollar";
  return `From ${currency} ${first.price} at ${quantity}`;
}

async function queryCategories(): Promise<Category[]> {
  const { rows } = await sql<CategoryRow>`
    SELECT
      c.slug,
      c.name,
      c.description,
      c.image,
      COUNT(p.id)::text AS count
    FROM categories c
    LEFT JOIN products p ON p.category_slug = c.slug
    GROUP BY c.slug, c.name, c.description, c.image
    HAVING COUNT(p.id) > 0
    ORDER BY c.name ASC
  `;

  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    description: row.description ?? undefined,
    image: row.image ?? undefined,
    count: Number(row.count),
  }));
}

async function querySiteInfo(): Promise<SiteInfo | null> {
  const { rows } = await sql<SiteSettingRow>`
    SELECT key, value
    FROM site_settings
    ORDER BY key ASC
  `;
  if (rows.length === 0) return null;
  const settings = new Map(rows.map((row) => [row.key, row.value]));
  const trustPillars = [1, 2, 3, 4]
    .map((n) => settings.get(`Trust Pillar ${n}`))
    .filter((value): value is string => Boolean(value));

  return {
    source: "imported",
    brandName: settings.get("Company Name") ?? "TakeawayPack",
    tagline: settings.get("Positioning"),
    slogan: settings.get("Positioning"),
    description: settings.get("Brand Philosophy") ?? "",
    valueProps: trustPillars,
    contact: {
      email: settings.get("General Enquiries Email"),
      phone: settings.get("Direct Support"),
      address: [
        settings.get("Headquarters Address"),
        settings.get("Postal Code"),
      ]
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
      "Company info loaded from verified Feishu Base site_info source DE3Yb7ylGakxnjsP7GPcn7EOnku / tblQOkbNO1iC48fZ / vew6VXXi4C.",
  };
}

function splitList(value?: string): string[] {
  if (!value) return [];
  return value
    .split(/[;；,，]|\band\b/i)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function querySiteData(): Promise<SiteData | null> {
  if (hasSupabaseCatalogEnv()) {
    const supabaseData = await querySupabaseSiteData();
    if (supabaseData) return supabaseData;
  }

  if (!hasPostgresEnv()) return null;

  const sample = getSampleSiteData();
  const [products, categories, importedInfo] = await Promise.all([
    queryProducts(),
    queryCategories(),
    querySiteInfo(),
  ]);
  if (products.length === 0) return null;

  const info: SiteInfo = importedInfo ?? {
    ...sample.info,
    source: "sample",
    rawNote:
      "Products are loaded from Vercel Postgres seeded from the verified Feishu Base export; company info is still sample content pending a verified company source.",
  };

  return {
    info,
    products,
    categories,
    dataSource: "imported",
  };
}

export async function getSiteData(): Promise<SiteData> {
  if (cache) return cache;
  try {
    cache = (await querySiteData()) ?? getSampleSiteData();
  } catch (error) {
    if (process.env.NODE_ENV !== "production" || process.env.DATA_ADAPTER_DEBUG === "1") {
      // eslint-disable-next-line no-console
      console.warn("[dataAdapter] database unavailable, using local sample data:", error);
    }
    cache = getSampleSiteData();
  }
  return cache;
}

export async function getProducts(): Promise<Product[]> {
  return (await getSiteData()).products;
}

export async function getCategories(): Promise<Category[]> {
  return (await getSiteData()).categories;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured && !p.isVariant);
  return (featured.length ? featured : products.filter((p) => !p.isVariant)).slice(0, limit);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.categorySlug === categorySlug);
}

export async function getVariantsForProduct(product: Product): Promise<Product[]> {
  if (!product.baseRecordId) return [];
  return (await getProducts()).filter((p) => p.parentBaseRecordId === product.baseRecordId);
}

export async function getDataSourceDebug() {
  const data = await getSiteData();
  return {
    databaseConfigured: hasSupabaseCatalogEnv() || hasPostgresEnv(),
    databaseProvider: hasSupabaseCatalogEnv() ? "supabase" : hasPostgresEnv() ? "vercel-postgres" : "sample",
    infoSource: data.info.source,
    productSources: Array.from(new Set(data.products.map((p) => p.source))),
    productCount: data.products.length,
    categoryCount: data.categories.length,
  };
}

export { slugify };
