import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const workspaceRoot = path.resolve(appRoot, "..", "..", "..");
const defaultExportDir = path.join(
  workspaceRoot,
  ".temp",
  "takeawaypack-base-products",
  "export"
);

loadEnv(path.join(appRoot, ".env.local"));
loadEnv(path.join(appRoot, ".vercel", ".env.production.local"));

const SOURCE = {
  baseToken: "EmcCbKUfaaVVx7svWDQcrWMrnLh",
  tableName: "商品表",
  tableId: "tblWCNqefJHAxfMY",
  viewName: "独立站",
  viewId: "vew4lHyPwN",
};

const SITE_SOURCE = {
  baseToken: "DE3Yb7ylGakxnjsP7GPcn7EOnku",
  tableId: "tblQOkbNO1iC48fZ",
  viewId: "vew6VXXi4C",
};

const inputFile =
  process.env.PRODUCT_IMPORT_FILE ||
  path.join(defaultExportDir, "products.enriched.json");
const siteInfoFile = path.join(appRoot, "..", "content", "imports", "site-info.raw.json");
const mappedProductsFile = path.join(appRoot, "..", "content", "imports", "products.raw.json");
const schemaFile = path.join(appRoot, "db", "schema.sql");
const publicProductsDir = path.join(appRoot, "public", "products");

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function slugify(input) {
  return String(input || "")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function text(value) {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(text).filter(Boolean).join(", ");
  if (typeof value === "object") {
    return text(value.text ?? value.name ?? value.value ?? value.content ?? value.link ?? "");
  }
  return "";
}

function numberOrNull(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function intOrNull(value) {
  const n = numberOrNull(value);
  return n == null ? null : Math.trunc(n);
}

function normalizeCurrency(value) {
  const original = text(value);
  if (original === "US dolar") {
    return { original, normalized: "US dollar", changed: true };
  }
  return { original: original || null, normalized: original || null, changed: false };
}

function parentIds(value) {
  if (!value) return [];
  const arr = Array.isArray(value) ? value : [value];
  return arr
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") return item.record_id || item.id || item.text;
      return "";
    })
    .map((v) => String(v || "").trim())
    .filter(Boolean);
}

function attachmentItems(fields) {
  const out = [];
  for (const sourceField of ["商品主图", "白底图", "参考图片"]) {
    const items = Array.isArray(fields[sourceField]) ? fields[sourceField] : [];
    items.forEach((item, index) => {
      if (typeof item === "string") {
        out.push({ sourceField, index, publicPath: item, downloaded: true });
        return;
      }
      if (!item || typeof item !== "object") return;
      out.push({
        sourceField,
        index,
        fileToken: item.file_token ? String(item.file_token) : null,
        originalName: item.name ? String(item.name) : null,
        localSourcePath: item.local_path ? String(item.local_path) : null,
        downloaded: Boolean(item.downloaded),
      });
    });
  }
  return out;
}

function readPublicPathMap() {
  if (!fs.existsSync(mappedProductsFile)) return new Map();
  const parsed = JSON.parse(fs.readFileSync(mappedProductsFile, "utf8"));
  const records = parsed.records || [];
  const map = new Map();
  for (const record of records) {
    const fields = record.fields || {};
    for (const sourceField of ["商品主图", "白底图", "参考图片"]) {
      const paths = Array.isArray(fields[sourceField]) ? fields[sourceField] : [];
      const original = Array.isArray(fields[`${sourceField}原始附件`])
        ? fields[`${sourceField}原始附件`]
        : [];
      original.forEach((item, index) => {
        if (item?.file_token && paths[index]) map.set(String(item.file_token), String(paths[index]));
      });
    }
  }
  return map;
}

const publicPathByFileToken = readPublicPathMap();

function copyAttachment(item, sku, index) {
  if (item.publicPath) return item.publicPath;
  if (item.fileToken && publicPathByFileToken.has(item.fileToken)) {
    return publicPathByFileToken.get(item.fileToken);
  }
  if (!item.localSourcePath || !fs.existsSync(item.localSourcePath)) return null;
  fs.mkdirSync(publicProductsDir, { recursive: true });
  const ext = path.extname(item.originalName || item.localSourcePath) || ".jpg";
  const token = (item.fileToken || `image-${index}`).slice(0, 10).toLowerCase();
  const sourceLabel =
    item.sourceField === "商品主图"
      ? "main"
      : item.sourceField === "白底图"
        ? "white"
        : "reference";
  const filename = `${slugify(sku) || "product"}-${sourceLabel}-${index + 1}-${token}${ext}`;
  const dest = path.join(publicProductsDir, filename);
  if (!fs.existsSync(dest)) fs.copyFileSync(item.localSourcePath, dest);
  return `/products/${filename}`;
}

function buildSpecs(fields) {
  const specs = [];
  const add = (label, value) => {
    const v = text(value);
    if (v) specs.push({ label, value: v });
  };
  add("SKU", fields["SKU"] || fields["产品编号"]);
  add("Material", fields["产品材质"]);
  add("Type", fields["产品类型"]);
  add("Specification", fields["产品规格"]);
  add("Printing", fields["印刷方式"]);
  add("Pieces/ctn", fields["件数/箱"]);
  add("Carton L(cm)", fields["箱子尺寸 长(cm)"]);
  add("Carton W(cm)", fields["箱子尺寸 宽(cm)"]);
  add("Carton H(cm)", fields["箱子尺寸 高(cm)"]);
  add("Gross Weight(kg)", fields["重量(箱子+产品)公斤"]);
  return specs;
}

function readSiteSettings() {
  if (!fs.existsSync(siteInfoFile)) return [];
  const parsed = JSON.parse(fs.readFileSync(siteInfoFile, "utf8"));
  const rows = parsed.data?.data || [];
  return rows
    .map((row) => ({ key: text(row[0]), value: text(row[1]) }))
    .filter((row) => row.key && row.value);
}

async function bulkInsert(client, table, columns, rows, chunkSize = 500) {
  if (rows.length === 0) return;
  for (let start = 0; start < rows.length; start += chunkSize) {
    const chunk = rows.slice(start, start + chunkSize);
    const params = [];
    const values = chunk.map((row, rowIndex) => {
      const placeholders = row.map((value, colIndex) => {
        params.push(value);
        return `$${rowIndex * columns.length + colIndex + 1}`;
      });
      return `(${placeholders.join(",")})`;
    });
    await client.query(
      `INSERT INTO ${table} (${columns.join(",")}) VALUES ${values.join(",")}`,
      params
    );
  }
}

async function main() {
  if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
    throw new Error("Missing Vercel Postgres/Neon env: POSTGRES_URL or DATABASE_URL.");
  }
  const { db } = await import("@vercel/postgres");
  const parsed = JSON.parse(fs.readFileSync(inputFile, "utf8"));
  const records = parsed.records || parsed.data?.records || parsed.data?.items || [];
  if (records.length !== 313) {
    throw new Error(`Expected 313 product records, got ${records.length}.`);
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await client.query(fs.readFileSync(schemaFile, "utf8"));

    const siteSettings = readSiteSettings();
    if (siteSettings.length) {
      await client.query("DELETE FROM site_settings");
      for (const setting of siteSettings) {
        await client.query(
          `INSERT INTO site_settings
            (key, value, source_base_token, source_table_id, source_view_id, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW())
           ON CONFLICT (key) DO UPDATE SET
            value = EXCLUDED.value,
            source_base_token = EXCLUDED.source_base_token,
            source_table_id = EXCLUDED.source_table_id,
            source_view_id = EXCLUDED.source_view_id,
            updated_at = NOW()`,
          [setting.key, setting.value, SITE_SOURCE.baseToken, SITE_SOURCE.tableId, SITE_SOURCE.viewId]
        );
      }
    }

    const slugCounts = new Map();
    const productIds = new Map();
    const parentLinks = [];
    const specRows = [];
    const priceRows = [];
    const mediaRows = [];
    const stats = {
      total: records.length,
      parents: 0,
      variants: 0,
      noImage: 0,
      noQuote: 0,
      currencyNormalized: 0,
      media: 0,
    };

    for (const record of records) {
      const fields = record.fields || {};
      const baseRecordId = record.record_id || fields.record_id;
      if (!baseRecordId) throw new Error("Record without record_id.");
      const name = text(fields["产品名称"] || fields["产品简称"] || fields["SKU"] || baseRecordId);
      const shortName = text(fields["产品简称"]);
      const categoryName = text(fields["分类"] || fields["产品类型"]) || "Products";
      const categorySlug = slugify(categoryName) || "products";
      const sku = text(fields["SKU"] || fields["产品编号"]) || baseRecordId;
      const baseSlug = slugify(shortName || name || sku) || slugify(baseRecordId);
      const count = slugCounts.get(baseSlug) || 0;
      slugCounts.set(baseSlug, count + 1);
      const slug = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`;
      const parents = parentIds(fields["父记录"]);
      const parentBaseRecordId = parents[0] || null;
      const currency = normalizeCurrency(fields["Currency"]);
      if (currency.changed) stats.currencyNormalized += 1;

      const hasQuote = Array.from({ length: 10 }, (_, i) => fields[`P${i + 1}`]).some(
        (v) => v !== null && v !== undefined && v !== ""
      );
      if (!hasQuote) stats.noQuote += 1;

      const media = attachmentItems(fields);
      const copiedMedia = media
        .map((item, i) => ({ ...item, publicPath: copyAttachment(item, sku, i) }))
        .filter((item) => item.publicPath);
      const hasImage = copiedMedia.length > 0;
      if (!hasImage) stats.noImage += 1;
      if (parentBaseRecordId) stats.variants += 1;
      else stats.parents += 1;

      const categoryResult = await client.query(
        `INSERT INTO categories (slug, name, source_table_id, source_view_id, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW()
         RETURNING id`,
        [categorySlug, categoryName, SOURCE.tableId, SOURCE.viewId]
      );
      const categoryId = categoryResult.rows[0].id;

      const productResult = await client.query(
        `INSERT INTO products (
          base_record_id, parent_base_record_id, source_base_token, source_table_id,
          source_table_name, source_view_id, source_view_name, slug, name, short_name,
          category_id, category_name, category_slug, product_type, material, sku, summary,
          description, specs_text, moq, pieces_per_carton, carton_length_cm, carton_width_cm,
          carton_height_cm, gross_weight_kg, customization, currency_original,
          currency_normalized, currency_was_normalized, has_quote, has_image,
          no_image_reason, is_variant, featured, raw_fields, updated_at
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
          $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,NOW()
        )
        ON CONFLICT (base_record_id) DO UPDATE SET
          parent_base_record_id = EXCLUDED.parent_base_record_id,
          slug = EXCLUDED.slug,
          name = EXCLUDED.name,
          short_name = EXCLUDED.short_name,
          category_id = EXCLUDED.category_id,
          category_name = EXCLUDED.category_name,
          category_slug = EXCLUDED.category_slug,
          product_type = EXCLUDED.product_type,
          material = EXCLUDED.material,
          sku = EXCLUDED.sku,
          summary = EXCLUDED.summary,
          description = EXCLUDED.description,
          specs_text = EXCLUDED.specs_text,
          moq = EXCLUDED.moq,
          pieces_per_carton = EXCLUDED.pieces_per_carton,
          carton_length_cm = EXCLUDED.carton_length_cm,
          carton_width_cm = EXCLUDED.carton_width_cm,
          carton_height_cm = EXCLUDED.carton_height_cm,
          gross_weight_kg = EXCLUDED.gross_weight_kg,
          customization = EXCLUDED.customization,
          currency_original = EXCLUDED.currency_original,
          currency_normalized = EXCLUDED.currency_normalized,
          currency_was_normalized = EXCLUDED.currency_was_normalized,
          has_quote = EXCLUDED.has_quote,
          has_image = EXCLUDED.has_image,
          no_image_reason = EXCLUDED.no_image_reason,
          is_variant = EXCLUDED.is_variant,
          featured = EXCLUDED.featured,
          raw_fields = EXCLUDED.raw_fields,
          updated_at = NOW()
        RETURNING id`,
        [
          baseRecordId,
          parentBaseRecordId,
          SOURCE.baseToken,
          SOURCE.tableId,
          SOURCE.tableName,
          SOURCE.viewId,
          SOURCE.viewName,
          slug,
          name,
          shortName || null,
          categoryId,
          categoryName,
          categorySlug,
          text(fields["产品类型"]) || null,
          text(fields["产品材质"]) || null,
          sku || null,
          text(fields["简要说明"]) || null,
          text(fields["产品描述"]) || null,
          text(fields["产品规格"]) || null,
          text(fields["大货起订量"] || fields["Q1"]) || null,
          intOrNull(fields["件数/箱"]),
          numberOrNull(fields["箱子尺寸 长(cm)"]),
          numberOrNull(fields["箱子尺寸 宽(cm)"]),
          numberOrNull(fields["箱子尺寸 高(cm)"]),
          numberOrNull(fields["重量(箱子+产品)公斤"]),
          text(fields["印刷方式"]) || null,
          currency.original,
          currency.normalized,
          currency.changed,
          hasQuote,
          hasImage,
          hasImage ? null : "No product image in the source Base export.",
          Boolean(parentBaseRecordId),
          Boolean(fields["选品"]),
          JSON.stringify(fields),
        ]
      );
      const productId = productResult.rows[0].id;
      productIds.set(baseRecordId, productId);
      if (parentBaseRecordId) parentLinks.push({ productId, baseRecordId, parentBaseRecordId, name, sku });

      for (const [position, spec] of buildSpecs(fields).entries()) {
        specRows.push([productId, spec.label, spec.value, position]);
      }

      for (let tier = 1; tier <= 10; tier += 1) {
        const quantity = intOrNull(fields[`Q${tier}`]);
        const price = numberOrNull(fields[`P${tier}`]);
        const discount = text(fields[`D${tier}`]) || null;
        if (quantity == null && price == null && !discount) continue;
        priceRows.push([productId, tier, quantity, price, discount, currency.normalized, price != null]);
      }

      for (const [position, item] of copiedMedia.entries()) {
        mediaRows.push([
          productId,
          item.sourceField,
          item.fileToken || null,
          item.originalName || null,
          item.localSourcePath || null,
          item.publicPath,
          Boolean(item.downloaded || item.publicPath),
          position,
        ]);
        stats.media += 1;
      }
    }

    await client.query("DELETE FROM product_specifications");
    await client.query("DELETE FROM product_price_tiers");
    await client.query("DELETE FROM product_media");
    await bulkInsert(client, "product_specifications", ["product_id", "label", "value", "position"], specRows);
    await bulkInsert(
      client,
      "product_price_tiers",
      ["product_id", "tier", "quantity", "price", "discount_code", "currency", "has_price"],
      priceRows
    );
    await bulkInsert(
      client,
      "product_media",
      [
        "product_id",
        "source_field",
        "base_file_token",
        "original_name",
        "local_source_path",
        "public_path",
        "downloaded",
        "position",
      ],
      mediaRows
    );

    await client.query("DELETE FROM product_variants");
    for (const link of parentLinks) {
      const parentProductId = productIds.get(link.parentBaseRecordId) || null;
      await client.query(
        `INSERT INTO product_variants
          (parent_product_id, product_id, base_record_id, parent_base_record_id, variant_name, sku, specs, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, '[]'::jsonb, NOW())
         ON CONFLICT (base_record_id) DO UPDATE SET
          parent_product_id = EXCLUDED.parent_product_id,
          product_id = EXCLUDED.product_id,
          parent_base_record_id = EXCLUDED.parent_base_record_id,
          variant_name = EXCLUDED.variant_name,
          sku = EXCLUDED.sku,
          updated_at = NOW()`,
        [parentProductId, link.productId, link.baseRecordId, link.parentBaseRecordId, link.name, link.sku || null]
      );
    }

    await client.query("COMMIT");
    console.log(JSON.stringify(stats, null, 2));
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
