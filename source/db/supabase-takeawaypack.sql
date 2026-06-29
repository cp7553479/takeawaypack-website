CREATE TABLE IF NOT EXISTS takeawaypack_categories (
  id BIGINT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  source_table_id TEXT,
  source_view_id TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS takeawaypack_site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  source_base_token TEXT NOT NULL,
  source_table_id TEXT NOT NULL,
  source_view_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS takeawaypack_products (
  id BIGINT PRIMARY KEY,
  base_record_id TEXT NOT NULL UNIQUE,
  parent_base_record_id TEXT,
  source_base_token TEXT NOT NULL,
  source_table_id TEXT NOT NULL,
  source_table_name TEXT NOT NULL,
  source_view_id TEXT NOT NULL,
  source_view_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_name TEXT,
  category_id BIGINT REFERENCES takeawaypack_categories(id) ON DELETE SET NULL,
  category_name TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  product_type TEXT,
  material TEXT,
  sku TEXT,
  summary TEXT,
  description TEXT,
  specs_text TEXT,
  moq TEXT,
  pieces_per_carton INTEGER,
  carton_length_cm NUMERIC,
  carton_width_cm NUMERIC,
  carton_height_cm NUMERIC,
  gross_weight_kg NUMERIC,
  customization TEXT,
  currency_original TEXT,
  currency_normalized TEXT,
  currency_was_normalized BOOLEAN NOT NULL DEFAULT FALSE,
  has_quote BOOLEAN NOT NULL DEFAULT FALSE,
  has_image BOOLEAN NOT NULL DEFAULT FALSE,
  no_image_reason TEXT,
  is_variant BOOLEAN NOT NULL DEFAULT FALSE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  raw_fields JSONB NOT NULL,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS takeawaypack_products_parent_base_record_id_idx ON takeawaypack_products(parent_base_record_id);
CREATE INDEX IF NOT EXISTS takeawaypack_products_category_slug_idx ON takeawaypack_products(category_slug);
CREATE INDEX IF NOT EXISTS takeawaypack_products_is_variant_idx ON takeawaypack_products(is_variant);

CREATE TABLE IF NOT EXISTS takeawaypack_product_variants (
  id BIGINT PRIMARY KEY,
  parent_product_id BIGINT REFERENCES takeawaypack_products(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL UNIQUE REFERENCES takeawaypack_products(id) ON DELETE CASCADE,
  base_record_id TEXT NOT NULL UNIQUE,
  parent_base_record_id TEXT,
  variant_name TEXT NOT NULL,
  sku TEXT,
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS takeawaypack_product_specifications (
  id BIGINT PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES takeawaypack_products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  UNIQUE(product_id, label)
);

CREATE TABLE IF NOT EXISTS takeawaypack_product_price_tiers (
  id BIGINT PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES takeawaypack_products(id) ON DELETE CASCADE,
  tier INTEGER NOT NULL,
  quantity INTEGER,
  price NUMERIC,
  discount_code TEXT,
  currency TEXT,
  has_price BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(product_id, tier)
);

CREATE TABLE IF NOT EXISTS takeawaypack_product_media (
  id BIGINT PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES takeawaypack_products(id) ON DELETE CASCADE,
  source_field TEXT NOT NULL,
  base_file_token TEXT,
  original_name TEXT,
  local_source_path TEXT,
  public_path TEXT,
  storage_bucket TEXT,
  storage_path TEXT,
  downloaded BOOLEAN NOT NULL DEFAULT FALSE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS takeawaypack_product_media_unique_source_idx
  ON takeawaypack_product_media(product_id, source_field, position, COALESCE(base_file_token, ''));

CREATE TABLE IF NOT EXISTS takeawaypack_inquiries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  product TEXT,
  quantity TEXT,
  message TEXT NOT NULL,
  source_page TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS takeawaypack_blog (
  id TEXT PRIMARY KEY,
  "feishuId" TEXT,
  "coverImg" TEXT,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP,
  title TEXT,
  excerpt TEXT,
  content TEXT
);

CREATE TABLE IF NOT EXISTS takeawaypack_companyinfo (
  id TEXT PRIMARY KEY,
  "feishuId" TEXT,
  key TEXT,
  "imagesJson" TEXT,
  "updatedAt" TIMESTAMP,
  value TEXT
);

CREATE TABLE IF NOT EXISTS takeawaypack_faq (
  id TEXT PRIMARY KEY,
  feishu_id TEXT,
  question TEXT,
  answer TEXT,
  category TEXT,
  sort_order INTEGER,
  source_link TEXT,
  status TEXT,
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS takeawaypack_certificate (
  id TEXT PRIMARY KEY,
  feishu_id TEXT,
  name TEXT,
  file_type TEXT,
  category TEXT,
  source_link TEXT,
  attachment_json TEXT,
  notes TEXT,
  status TEXT,
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS takeawaypack_legacy_product (
  id TEXT PRIMARY KEY,
  "feishuId" TEXT,
  "specJson" TEXT,
  "imagesJson" TEXT,
  category TEXT,
  application TEXT,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP,
  name TEXT,
  "desc" TEXT
);

CREATE TABLE IF NOT EXISTS takeawaypack_media_assets (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  bucket TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  public_url TEXT NOT NULL,
  source_public_path TEXT,
  local_source_path TEXT,
  original_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
