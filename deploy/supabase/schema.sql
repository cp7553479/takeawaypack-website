-- ===========================================================================
-- Takeawaypack Website — Supabase schema
-- ===========================================================================
-- Run in the Supabase SQL editor (Dashboard → SQL → New query) or via the
-- Supabase CLI:  supabase db execute < deploy/supabase/schema.sql
--
-- This script is idempotent. It creates:
--   1. inquiries        — RFQ/inquiry form submissions (PRIMARY use case)
--   2. products         — optional catalog mirror (serve site from DB instead
--                         of JSON files; only if you choose that path)
--   3. company_info     — optional company/site info mirror
-- plus Row Level Security so the public site can submit inquiries but cannot
-- read other people's inquiries, and can read the catalog read-only.
-- ===========================================================================

-- Required extension for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. INQUIRIES (RFQ submissions)
-- ---------------------------------------------------------------------------
create table if not exists public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  name          text        not null,
  company       text,
  email         text        not null,
  phone         text,
  country       text,
  product       text,
  quantity      text,
  message       text        not null,
  source_page   text,
  status        text        not null default 'new',
  ip_address    inet,
  user_agent    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status);
create index if not exists inquiries_email_idx on public.inquiries (email);

alter table public.inquiries enable row level security;

-- Public visitors may INSERT new inquiries (the website form), but can never
-- SELECT (privacy: one buyer must not see another's inquiry).
drop policy if exists "inquiries_anon_insert" on public.inquiries;
create policy "inquiries_anon_insert"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

-- Authenticated staff (your team) may read inquiries for follow-up / dashboards.
drop policy if exists "inquiries_staff_select" on public.inquiries;
create policy "inquiries_staff_select"
  on public.inquiries for select
  to authenticated
  using (true);

drop policy if exists "inquiries_staff_update" on public.inquiries;
create policy "inquiries_staff_update"
  on public.inquiries for update
  to authenticated
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- 2. PRODUCTS (optional catalog mirror)
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  source_id     text,                       -- original Feishu record id, for traceability
  slug          text        not null unique,
  name          text        not null,
  category      text,
  category_slug text,
  summary       text,
  description   text,
  features      jsonb       default '[]'::jsonb,
  specs         jsonb       default '[]'::jsonb,   -- [{label,value}]
  image_url     text,
  gallery       jsonb       default '[]'::jsonb,
  moq           text,
  material      text,
  customization text,
  lead_time     text,
  certifications jsonb      default '[]'::jsonb,
  use_cases     jsonb       default '[]'::jsonb,
  price_note    text,
  featured      boolean     default false,
  sort_order    integer     default 0,
  is_published  boolean     default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists products_category_slug_idx on public.products (category_slug);
create index if not exists products_published_idx on public.products (is_published, sort_order);

alter table public.products enable row level security;

-- Public read-only access to published products.
drop policy if exists "products_public_select" on public.products;
create policy "products_public_select"
  on public.products for select
  to anon, authenticated
  using (is_published = true);

-- Only authenticated staff may write.
drop policy if exists "products_staff_write" on public.products;
create policy "products_staff_write"
  on public.products for all
  to authenticated
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- 3. COMPANY_INFO (optional site info mirror, single-row config)
-- ---------------------------------------------------------------------------
create table if not exists public.company_info (
  id            smallint primary key default 1,
  brand_name    text        not null,
  tagline       text,
  slogan        text,
  description   text,
  value_props   jsonb       default '[]'::jsonb,
  contact       jsonb       default '{}'::jsonb,   -- {email,phone,whatsapp,address,website}
  markets       jsonb       default '[]'::jsonb,
  certificates  jsonb       default '[]'::jsonb,
  services      jsonb       default '[]'::jsonb,
  stats         jsonb       default '[]'::jsonb,
  seo           jsonb       default '{}'::jsonb,
  updated_at    timestamptz not null default now(),
  constraint company_info_singleton check (id = 1)
);

alter table public.company_info enable row level security;

drop policy if exists "company_info_public_select" on public.company_info;
create policy "company_info_public_select"
  on public.company_info for select
  to anon, authenticated
  using (true);

drop policy if exists "company_info_staff_write" on public.company_info;
create policy "company_info_staff_write"
  on public.company_info for all
  to authenticated
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- updated_at maintenance trigger
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists inquiries_touch on public.inquiries;
create trigger inquiries_touch before update on public.inquiries
  for each row execute function public.touch_updated_at();

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

drop trigger if exists company_info_touch on public.company_info;
create trigger company_info_touch before update on public.company_info
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Helpful default status values (used by staff dashboards)
-- ---------------------------------------------------------------------------
do $$
begin
  comment on table public.inquiries is 'RFQ/inquiry submissions from the website contact form';
  comment on column public.inquiries.status is 'new | replied | qualified | closed';
end $$;
