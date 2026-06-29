CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  source_table_id TEXT,
  source_view_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  source_base_token TEXT NOT NULL,
  source_table_id TEXT NOT NULL,
  source_view_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
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
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_parent_base_record_id_idx ON products(parent_base_record_id);
CREATE INDEX IF NOT EXISTS products_category_slug_idx ON products(category_slug);
CREATE INDEX IF NOT EXISTS products_is_variant_idx ON products(is_variant);

CREATE TABLE IF NOT EXISTS product_variants (
  id BIGSERIAL PRIMARY KEY,
  parent_product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  base_record_id TEXT NOT NULL UNIQUE,
  parent_base_record_id TEXT,
  variant_name TEXT NOT NULL,
  sku TEXT,
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_specifications (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  UNIQUE(product_id, label)
);

CREATE TABLE IF NOT EXISTS product_price_tiers (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tier INTEGER NOT NULL,
  quantity INTEGER,
  price NUMERIC,
  discount_code TEXT,
  currency TEXT,
  has_price BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(product_id, tier)
);

CREATE TABLE IF NOT EXISTS product_media (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  source_field TEXT NOT NULL,
  base_file_token TEXT,
  original_name TEXT,
  local_source_path TEXT,
  public_path TEXT,
  downloaded BOOLEAN NOT NULL DEFAULT FALSE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS product_media_unique_source_idx
  ON product_media(product_id, source_field, position, COALESCE(base_file_token, ''));

CREATE TABLE IF NOT EXISTS inquiries (
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
