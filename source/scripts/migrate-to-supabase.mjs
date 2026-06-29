import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { neon } from "@neondatabase/serverless";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const SUPABASE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "website-assets";
const SUPABASE_PREFIX = process.env.SUPABASE_STORAGE_PREFIX || "takeawaypack";
const supabaseUrl = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabaseKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
const sourceUrl = process.env.SOURCE_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!sourceUrl) {
  throw new Error("Missing SOURCE_DATABASE_URL, DATABASE_URL, or POSTGRES_URL for the source Vercel Postgres/Neon database.");
}

const source = neon(sourceUrl);
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const tableMap = [
  ["categories", "takeawaypack_categories"],
  ["site_settings", "takeawaypack_site_settings"],
  ["products", "takeawaypack_products"],
  ["product_variants", "takeawaypack_product_variants"],
  ["product_specifications", "takeawaypack_product_specifications"],
  ["product_price_tiers", "takeawaypack_product_price_tiers"],
  ["blog", "takeawaypack_blog"],
  ["companyinfo", "takeawaypack_companyinfo"],
  ["faq", "takeawaypack_faq"],
  ["certificate", "takeawaypack_certificate"],
  ["product", "takeawaypack_legacy_product"],
];

const publicPathToStorage = new Map();

await ensureBucket();
const assets = await uploadAssets();
await resetTables();
await copyTables();
await copyProductMedia();
await insertMediaAssets(assets);
await verify();

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function ensureBucket() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;
  if (buckets.some((bucket) => bucket.name === SUPABASE_BUCKET)) return;
  const { error } = await supabase.storage.createBucket(SUPABASE_BUCKET, {
    public: true,
    fileSizeLimit: "20MB",
  });
  if (error) throw error;
}

async function uploadAssets() {
  const files = collectAssetFiles();
  const results = [];
  let uploaded = 0;

  for (const file of files) {
    const body = fs.readFileSync(file.absolutePath);
    const { error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(file.storagePath, body, {
        contentType: file.mimeType,
        upsert: true,
      });
    if (error) throw new Error(`Storage upload failed for ${file.relativePath}: ${error.message}`);

    const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(file.storagePath);
    publicPathToStorage.set(file.publicPath, {
      publicUrl: data.publicUrl,
      storagePath: file.storagePath,
    });
    results.push({
      category: file.category,
      bucket: SUPABASE_BUCKET,
      storage_path: file.storagePath,
      public_url: data.publicUrl,
      source_public_path: file.publicPath,
      local_source_path: file.relativePath,
      original_name: path.basename(file.absolutePath),
      mime_type: file.mimeType,
      size_bytes: body.byteLength,
    });
    uploaded += 1;
    if (uploaded % 200 === 0) {
      console.log(`Uploaded ${uploaded}/${files.length} assets`);
    }
  }

  console.log(`Uploaded ${uploaded}/${files.length} assets`);
  return results;
}

function collectAssetFiles() {
  const roots = [
    ["public/products", "products", "products"],
    ["public/base-products", "base-products", "base-products"],
    ["public/generated/marketing", "marketing", "generated/marketing"],
    ["public/generated", "generated", "generated"],
  ];
  const seen = new Set();
  const files = [];

  for (const [rootPath, category, publicPrefix] of roots) {
    const absoluteRoot = path.join(root, rootPath);
    if (!fs.existsSync(absoluteRoot)) continue;
    for (const absolutePath of walk(absoluteRoot)) {
      if (!isImage(absolutePath)) continue;
      const relativeToPublicRoot = path.relative(path.join(root, "public"), absolutePath);
      if (seen.has(relativeToPublicRoot)) continue;
      seen.add(relativeToPublicRoot);

      const fileName = path.basename(absolutePath);
      const storageFileName = safeStorageFileName(fileName, relativeToPublicRoot);
      const publicPath = `/${relativeToPublicRoot.split(path.sep).join("/")}`;
      const storagePath = `${SUPABASE_PREFIX}/${category}/${storageFileName}`;
      files.push({
        absolutePath,
        relativePath: path.relative(root, absolutePath),
        publicPath,
        storagePath,
        category: publicPrefix,
        mimeType: mimeTypeFor(absolutePath),
      });
    }
  }

  files.sort((a, b) => a.storagePath.localeCompare(b.storagePath));
  return files;
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(fullPath));
    if (entry.isFile()) out.push(fullPath);
  }
  return out;
}

function isImage(file) {
  return /\.(png|jpe?g|webp|svg)$/i.test(file);
}

function mimeTypeFor(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}

function safeStorageFileName(fileName, uniqueSource) {
  const ext = path.extname(fileName).toLowerCase();
  const base = path.basename(fileName, ext)
    .normalize("NFKD")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "asset";
  const hash = crypto.createHash("sha1").update(uniqueSource).digest("hex").slice(0, 10);
  return `${base}-${hash}${ext}`;
}

async function resetTables() {
  const tables = [
    "takeawaypack_media_assets",
    "takeawaypack_product_media",
    "takeawaypack_product_price_tiers",
    "takeawaypack_product_specifications",
    "takeawaypack_product_variants",
    "takeawaypack_products",
    "takeawaypack_categories",
    "takeawaypack_site_settings",
    "takeawaypack_blog",
    "takeawaypack_companyinfo",
    "takeawaypack_faq",
    "takeawaypack_certificate",
    "takeawaypack_legacy_product",
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().neq(primaryKeyFor(table), impossibleIdFor(table));
    if (error) throw new Error(`Failed to clear ${table}: ${error.message}`);
  }
}

function primaryKeyFor(table) {
  if (["takeawaypack_categories", "takeawaypack_products", "takeawaypack_product_variants", "takeawaypack_product_specifications", "takeawaypack_product_price_tiers", "takeawaypack_product_media", "takeawaypack_media_assets"].includes(table)) {
    return "id";
  }
  if (table === "takeawaypack_site_settings") return "key";
  return "id";
}

function impossibleIdFor(table) {
  return primaryKeyFor(table) === "id" && !["takeawaypack_blog", "takeawaypack_companyinfo", "takeawaypack_faq", "takeawaypack_certificate", "takeawaypack_legacy_product"].includes(table)
    ? -1
    : "__never__";
}

async function copyTables() {
  for (const [sourceTable, targetTable] of tableMap) {
    const rows = await source(`SELECT * FROM ${quoteIdentifier(sourceTable)} ORDER BY 1`);
    await insertBatches(targetTable, rows.map(normalizeRow));
    console.log(`Copied ${rows.length} rows into ${targetTable}`);
  }
}

async function copyProductMedia() {
  const rows = await source("SELECT * FROM product_media ORDER BY id");
  const migrated = rows.map((row) => {
    const mapped = publicPathToStorage.get(row.public_path);
    return normalizeRow({
      ...row,
      public_path: mapped?.publicUrl ?? row.public_path,
      storage_bucket: mapped ? SUPABASE_BUCKET : null,
      storage_path: mapped?.storagePath ?? null,
    });
  });
  await insertBatches("takeawaypack_product_media", migrated);
  console.log(`Copied ${migrated.length} rows into takeawaypack_product_media`);
}

async function insertMediaAssets(rows) {
  await insertBatches("takeawaypack_media_assets", rows);
  console.log(`Cataloged ${rows.length} rows into takeawaypack_media_assets`);
}

async function insertBatches(table, rows, batchSize = 500) {
  if (rows.length === 0) return;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from(table).insert(batch);
    if (error) throw new Error(`Insert failed for ${table} batch ${i / batchSize + 1}: ${error.message}`);
  }
}

function normalizeRow(row) {
  const normalized = {};
  for (const [key, value] of Object.entries(row)) {
    normalized[key] = value instanceof Date ? value.toISOString() : value;
  }
  return normalized;
}

function quoteIdentifier(identifier) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

async function verify() {
  const checks = [
    "takeawaypack_products",
    "takeawaypack_categories",
    "takeawaypack_product_media",
    "takeawaypack_media_assets",
    "takeawaypack_blog",
  ];
  for (const table of checks) {
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
    if (error) throw error;
    console.log(`${table}: ${count}`);
  }
}
