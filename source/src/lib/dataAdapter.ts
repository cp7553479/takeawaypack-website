// ---------------------------------------------------------------------------
// DATA ADAPTER
// ---------------------------------------------------------------------------
// Single source of truth for site data. It prefers real Feishu Base data and
// transparently falls back to clearly-marked sample content.
//
// Where it looks for real data (first match wins):
//   1. process.env.DATA_IMPORT_DIR   (explicit override)
//   2. <cwd>/content/imports         (run from the repo root)
//   3. <cwd>/../content/imports      (run from source/)
//   4. <cwd>/../../content/imports   (run from a deeper subfolder)
//
// Expected files (produced by the import agent, currently BLOCKED):
//   site-info.raw.json   — records for the website/company Base
//   products.raw.json    — records for the products Base (independent-site view)
//   fields.site-info.json / fields.products.json — optional field metadata
//
// The adapter is tolerant of common Feishu export shapes:
//   { records: [ { fields: {...} } ] }     (lark-cli base export)
//   { data: { items | records: [...] } }   (some API wrappers)
//   [ { ...record } ]                       (bare array)
// Field names are matched case-insensitively with English + 中文 candidates,
// so the exact Base column names do not need to be known in advance.
//
// NOTE on images: Feishu attachment fields expose a file_token, not a usable
// URL. The website cannot download these at runtime without the Drive API, so
// non-URL image values are intentionally dropped (a placeholder is shown).
// If a field already contains an http(s) image URL, it is used directly. See
// handoff/BUILD_REPORT.md for the asset import step.
// ---------------------------------------------------------------------------

import fs from "node:fs";
import path from "node:path";

import { getSampleSiteData, slugify } from "@/data/fallback";
import type {
  Category,
  Product,
  ProductSpec,
  SiteData,
  SiteInfo,
} from "@/lib/types";

let cache: SiteData | null = null;

const IMPORT_FILES = {
  siteInfo: "site-info.raw.json",
  products: "products.raw.json",
  fieldsSiteInfo: "fields.site-info.json",
  fieldsProducts: "fields.products.json",
} as const;

function candidateImportDirs(): string[] {
  const cwd = process.cwd();
  const list = [
    process.env.DATA_IMPORT_DIR,
    path.join(cwd, "content", "imports"),
    path.join(cwd, "..", "content", "imports"),
    path.join(cwd, "..", "..", "content", "imports"),
    path.join(cwd, ".data"),
  ];
  return list.filter((p): p is string => Boolean(p && p.length));
}

function resolveImportDir(): string | null {
  for (const dir of candidateImportDirs()) {
    try {
      if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
        // Only treat it as the real import dir if it actually has a raw file.
        if (
          fs.existsSync(path.join(dir, IMPORT_FILES.siteInfo)) ||
          fs.existsSync(path.join(dir, IMPORT_FILES.products))
        ) {
          return dir;
        }
      }
    } catch {
      // ignore unreadable paths and keep trying
    }
  }
  return null;
}

function readJson<T = unknown>(dir: string, file: string): T | null {
  const full = path.join(dir, file);
  try {
    if (!fs.existsSync(full)) return null;
    const text = fs.readFileSync(full, "utf8");
    if (!text.trim()) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

// Pull an array of records out of any reasonable export envelope.
function extractRecords(parsed: unknown): Record<string, unknown>[] {
  if (Array.isArray(parsed)) {
    return parsed as Record<string, unknown>[];
  }
  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    const direct = obj.records ?? obj.items ?? obj.data;
    if (Array.isArray(direct)) return direct as Record<string, unknown>[];
    if (direct && typeof direct === "object") {
      const inner = (direct as Record<string, unknown>).items ??
        (direct as Record<string, unknown>).records;
      if (Array.isArray(inner)) return inner as Record<string, unknown>[];
    }
  }
  return [];
}

// Coerce a Feishu field value into a plain string (handles rich text arrays,
// single/multi-select objects, numbers, {text,value} shapes).
export function toText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    return value
      .map((v) => {
        if (typeof v === "string") return v;
        if (v && typeof v === "object") {
          const o = v as Record<string, unknown>;
          return (
            pickStr(o.text) ||
            pickStr(o.name) ||
            pickStr(o.value) ||
            pickStr(o.content) ||
            pickStr(o.title) ||
            pickStr(o.link) ||
            pickStr(o.label)
          );
        }
        return "";
      })
      .filter(Boolean)
      .join(", ")
      .trim();
  }
  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    return (
      pickStr(o.text) ||
      pickStr(o.name) ||
      pickStr(o.value) ||
      pickStr(o.content) ||
      pickStr(o.title) ||
      pickStr(o.link) ||
      ""
    );
  }
  return "";
}

function pickStr(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (typeof v === "number") return String(v);
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    // { content: "..." } (rich text) or { text: "..." } (url) shapes
    return pickStr(o.content) || pickStr(o.text) || pickStr(o.name) || pickStr(o.value) || "";
  }
  return "";
}

// Split a text/array value into trimmed non-empty lines/tokens.
function toLines(value: unknown): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value
      .flatMap((v) => toText(v).split(/[\n;；]+/))
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const text = toText(value);
  if (!text) return [];
  return text
    .split(/[\n;；]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Collect every http(s) image URL anywhere inside an attachment/text field.
function toImageUrls(value: unknown): string[] {
  const urls: string[] = [];
  const collect = (v: unknown) => {
    if (v == null) return;
    if (typeof v === "string") {
      const m = v.match(/https?:\/\/\S+\.(?:png|jpe?g|webp|gif|svg)(?:\?\S*)?/i);
      if (m) urls.push(m[0]);
      return;
    }
    if (Array.isArray(v)) {
      v.forEach(collect);
      return;
    }
    if (typeof v === "object") {
      const o = v as Record<string, unknown>;
      collect(o.url);
      collect(o.link);
      collect(o.src);
      collect(o.tmp_url);
    }
  };
  collect(value);
  return urls;
}

// Extract the first http(s) image URL from an attachment/text field, if present.
function toImageUrl(value: unknown): string | undefined {
  return toImageUrls(value)[0];
}

function isTruthy(value: unknown): boolean {
  const t = toText(value).toLowerCase();
  if (!t) return false;
  return ["true", "1", "yes", "y", "featured", "hot", "recommend", "推荐", "是", "新品", "popular"].includes(t);
}

// Find a field value by candidate names (case-insensitive, ignores spaces).
function pickField(
  fields: Record<string, unknown>,
  candidates: readonly string[]
): unknown {
  const normalized = (s: string) => s.toLowerCase().replace(/[\s_\-]+/g, "");
  const map = new Map<string, string>();
  for (const key of Object.keys(fields)) {
    map.set(normalized(key), key);
  }
  for (const cand of candidates) {
    const key = map.get(normalized(cand));
    if (key) {
      const val = fields[key];
      if (val !== undefined && val !== null && toText(val) !== "") return val;
    }
  }
  return undefined;
}

// --- Field candidate dictionaries (EN + 中文) ------------------------------

const SITE_FIELDS = {
  brandName: ["brand name", "brand", "brandname", "company name", "company", "公司名称", "品牌", "品牌名称", "网站名称", "site name", "网站标题", "企业名称", "name"],
  tagline: ["tagline", "slogan", "标语", "一句话介绍", "副标题", "subtitle", "sub title", "短描述", "short description"],
  description: ["company introduction", "company intro", "about us", "about", "公司简介", "简介", "关于我们", "company profile", "profile", "description", "introduction", "介绍"],
  valueProps: ["value proposition", "value props", "core advantages", "advantages", "优势", "核心优势", "卖点", "highlights", "亮点", "why choose us", "why us", "competitiveness", "竞争力"],
  email: ["email", "e-mail", "contact email", "sales email", "邮箱", "电子邮件", "联系邮箱"],
  phone: ["phone", "tel", "telephone", "联系电话", "电话", "mobile", "手机", "手机号", "contact number"],
  whatsapp: ["whatsapp", "whats app", "wa number", "wa"],
  address: ["address", "公司地址", "地址", "location", "厂址", "办公地址"],
  website: ["website", "官网", "网址", "site url", "url", "domain", "域名"],
  markets: ["markets", "market", "出口市场", "export markets", "countries", "国家", "地区", "目标市场", "service area"],
  certificates: ["certificates", "certification", "认证证书", "证书", "认证", "qualifications", "资质", "检测报告"],
  services: ["services", "服务", "oem odm", "oem", "定制服务", "customization", "定制", "加工能力", "capabilities"],
  seoTitle: ["seo title", "seo_title", "meta title", "页面标题", "网站标题seo", "title"],
  seoDescription: ["seo description", "meta description", "页面描述", "网站描述", "description meta"],
  keywords: ["keywords", "seo keywords", "关键词", "标签", "tags"],
  nav: ["menu", "navigation", "导航", "nav"],
} as const;

const PRODUCT_FIELDS = {
  id: ["record id", "record_id", "id", "recordid"],
  name: ["product name", "name", "产品名称", "title", "名称", "model", "型号", "sku", "商品名称", "item name", "product"],
  category: ["category", "categories", "分类", "类别", "产品分类", "series", "系列", "product type", "type", "类型"],
  summary: ["summary", "short description", "简短描述", "简介", "副标题", "subheading", "一句话介绍", "卖点简介", "highlight"],
  description: ["description", "details", "详情", "产品详情", "描述", "content", "正文", "产品介绍", "introduction", "产品描述"],
  features: ["features", "特点", "产品特点", "highlights", "亮点", "selling points", "卖点", "advantages", "优势", "特性"],
  image: ["main image", "image", "主图", "图片", "photo", "picture", "封面", "cover", "thumbnail", "thumb", "image url", "图片链接", "product image"],
  gallery: ["gallery", "images", "图册", "附加图片", "more images", "details images", "细节图", "相册", "gallery images"],
  material: ["material", "材质", "材料", "raw material", "材料材质"],
  size: ["size", "尺寸", "规格", "dimension", "dimensions", "specifications", "规格尺寸"],
  capacity: ["capacity", "容量", "容积", "volume", "规格容量"],
  color: ["color", "颜色", "colour", "颜色款式"],
  moq: ["moq", "minimum order quantity", "minimum order", "起订量", "起订", "最低订购量", "min order", "起批量"],
  packaging: ["packaging", "包装", "packing", "包装规格", "包装方式"],
  customization: ["customization", "custom", "定制", "oem", "odm", "logo", "印刷", "印刷定制", "custom print", "定制服务"],
  leadTime: ["lead time", "leadtime", "delivery time", "交期", "交货期", "生产周期", "delivery", "出货期", "production time", "货期"],
  price: ["price", "fob", "exw", "价格", "报价", "单价", "fob price", "unit price", "reference price", "参考价", "price term", "trade term"],
  certifications: ["certification", "certificates", "证书", "认证", "cert", "资质", "检测报告"],
  useCases: ["application", "use case", "use cases", "用途", "适用", "应用场景", "applications", "适用场景", "适合"],
  featured: ["featured", "推荐", "hot", "新品", "popular", "bestseller", "首页推荐", "is featured"],
} as const;

function mapSiteInfo(records: Record<string, unknown>[]): SiteInfo | null {
  // Website/company Base is usually a single-row config table, but we merge all
  // rows defensively in case each row holds one config key/value.
  const merged: Record<string, unknown> = {};
  if (records.length === 1) {
    Object.assign(merged, (records[0].fields ?? records[0]) as Record<string, unknown>);
  } else {
    for (const rec of records) {
      const fields = (rec.fields ?? rec) as Record<string, unknown>;
      for (const [k, v] of Object.entries(fields)) {
        if (v == null) continue;
        if (merged[k] == null || toText(merged[k]) === "") merged[k] = v;
      }
    }
  }

  const brandName = toText(pickField(merged, SITE_FIELDS.brandName)).trim();
  const description = toText(pickField(merged, SITE_FIELDS.description)).trim();
  if (!brandName && !description) return null;

  const valueProps = toLines(pickField(merged, SITE_FIELDS.valueProps));
  const markets = toLines(pickField(merged, SITE_FIELDS.markets));
  const certificates = toLines(pickField(merged, SITE_FIELDS.certificates));
  const services = toLines(pickField(merged, SITE_FIELDS.services));
  const keywords = toLines(pickField(merged, SITE_FIELDS.keywords));
  const seoTitle = toText(pickField(merged, SITE_FIELDS.seoTitle));
  const seoDescription = toText(pickField(merged, SITE_FIELDS.seoDescription));

  return {
    source: "imported",
    brandName: brandName || "TakeawayPack",
    tagline: toText(pickField(merged, SITE_FIELDS.tagline)) || undefined,
    description: description || "Imported company information.",
    valueProps,
    contact: {
      email: toText(pickField(merged, SITE_FIELDS.email)) || undefined,
      phone: toText(pickField(merged, SITE_FIELDS.phone)) || undefined,
      whatsapp: toText(pickField(merged, SITE_FIELDS.whatsapp)) || undefined,
      address: toText(pickField(merged, SITE_FIELDS.address)) || undefined,
      website: toText(pickField(merged, SITE_FIELDS.website)) || undefined,
    },
    markets: markets.length ? markets : undefined,
    certificates: certificates.length ? certificates : undefined,
    services: services.length ? services : undefined,
    seo: {
      title: seoTitle || undefined,
      description: seoDescription || undefined,
      keywords: keywords.length ? keywords : undefined,
    },
    rawNote: "Company info loaded from imported Base data.",
  };
}

function isProduct(value: Product | null): value is Product {
  return value !== null;
}

function mapProducts(records: Record<string, unknown>[]): Product[] {
  const seen = new Map<string, number>();
  return records
    .map((rec): Product | null => {
      const fields = (rec.fields ?? rec) as Record<string, unknown>;
      const name = toText(pickField(fields, PRODUCT_FIELDS.name));
      if (!name) return null;

      const category = toText(pickField(fields, PRODUCT_FIELDS.category)) || "Products";
      const categorySlug = slugify(category) || "products";

      const size = toText(pickField(fields, PRODUCT_FIELDS.size));
      const capacity = toText(pickField(fields, PRODUCT_FIELDS.capacity));
      const material = toText(pickField(fields, PRODUCT_FIELDS.material));
      const color = toText(pickField(fields, PRODUCT_FIELDS.color));
      const packaging = toText(pickField(fields, PRODUCT_FIELDS.packaging));
      const moq = toText(pickField(fields, PRODUCT_FIELDS.moq));
      const customization = toText(pickField(fields, PRODUCT_FIELDS.customization));
      const leadTime = toText(pickField(fields, PRODUCT_FIELDS.leadTime));
      const priceNote = toText(pickField(fields, PRODUCT_FIELDS.price));
      const certifications = toLines(pickField(fields, PRODUCT_FIELDS.certifications));
      const useCases = toLines(pickField(fields, PRODUCT_FIELDS.useCases));
      const features = toLines(pickField(fields, PRODUCT_FIELDS.features));
      const gallery = toImageUrls(pickField(fields, PRODUCT_FIELDS.gallery));

      const specs: ProductSpec[] = [];
      if (material) specs.push({ label: "Material", value: material });
      if (size) specs.push({ label: "Size", value: size });
      if (capacity) specs.push({ label: "Capacity", value: capacity });
      if (color) specs.push({ label: "Color", value: color });
      if (packaging) specs.push({ label: "Packaging", value: packaging });
      if (moq) specs.push({ label: "MOQ", value: moq });
      if (leadTime) specs.push({ label: "Lead Time", value: leadTime });

      let slug = slugify(name) || slugify(`product-${name}`);
      const n = seen.get(slug) ?? 0;
      seen.set(slug, n + 1);
      if (n > 0) slug = `${slug}-${n + 1}`;

      const recordId = toText(pickField(fields, PRODUCT_FIELDS.id));

      return {
        source: "imported" as const,
        id: recordId || slug,
        slug,
        name,
        category,
        categorySlug,
        summary: toText(pickField(fields, PRODUCT_FIELDS.summary)) || undefined,
        description: toText(pickField(fields, PRODUCT_FIELDS.description)) || undefined,
        features: features.length ? features : undefined,
        image: toImageUrl(pickField(fields, PRODUCT_FIELDS.image)),
        gallery: gallery.length ? gallery : undefined,
        specs,
        moq: moq || undefined,
        material: material || undefined,
        customization: customization || undefined,
        leadTime: leadTime || undefined,
        certifications: certifications.length ? certifications : undefined,
        useCases: useCases.length ? useCases : undefined,
        priceNote: priceNote || undefined,
        featured: isTruthy(pickField(fields, PRODUCT_FIELDS.featured)),
      } satisfies Product;
    })
    .filter(isProduct);
}

function buildCategories(products: Product[]): Category[] {
  const counts = new Map<string, { name: string; count: number }>();
  for (const p of products) {
    const existing = counts.get(p.categorySlug);
    if (existing) existing.count += 1;
    else counts.set(p.categorySlug, { name: p.category, count: 1 });
  }
  return Array.from(counts.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getSiteData(): SiteData {
  if (cache) return cache;

  const dir = resolveImportDir();
  if (!dir) {
    cache = getSampleSiteData();
    return cache;
  }

  const siteRecords = extractRecords(readJson(dir, IMPORT_FILES.siteInfo));
  const productRecords = extractRecords(readJson(dir, IMPORT_FILES.products));

  const importedInfo = siteRecords.length ? mapSiteInfo(siteRecords) : null;
  const importedProducts = productRecords.length ? mapProducts(productRecords) : [];

  const sample = getSampleSiteData();
  const info: SiteInfo = importedInfo ?? { ...sample.info, rawNote: undefined };
  // If only one section imported, keep the other from samples but mark the
  // overall data source honestly.
  const products = importedProducts.length ? importedProducts : sample.products;

  // Re-mark info source if it came from sample because products did import.
  if (importedProducts.length && !importedInfo) {
    info.source = "sample";
    info.rawNote =
      "Products loaded from imported Base data; company info still using sample content — pending site-info Base import.";
  }

  const categories = importedProducts.length ? buildCategories(products) : sample.categories;

  cache = {
    info,
    products,
    categories,
    dataSource: importedProducts.length || importedInfo ? "imported" : "sample",
  };
  return cache;
}

// Convenience accessors used by pages.
export function getProducts(): Product[] {
  return getSiteData().products;
}

export function getCategories(): Category[] {
  return getSiteData().categories;
}

export function getProductBySlug(slug: string): Product | undefined {
  return getSiteData().products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(limit = 6): Product[] {
  const featured = getSiteData().products.filter((p) => p.featured);
  return (featured.length ? featured : getSiteData().products).slice(0, limit);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return getSiteData().products.filter((p) => p.categorySlug === categorySlug);
}

export function getDataSourceDebug() {
  const dir = resolveImportDir();
  const data = getSiteData();
  return {
    importDir: dir,
    infoSource: data.info.source,
    productSources: Array.from(new Set(data.products.map((p) => p.source))),
    productCount: data.products.length,
    categoryCount: data.categories.length,
    candidates: candidateImportDirs(),
  };
}
