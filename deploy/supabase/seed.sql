-- ===========================================================================
-- Takeawaypack Website — Supabase seed (SAMPLE data)
-- ===========================================================================
-- OPTIONAL. Only run this if you want to serve the catalog/company info from
-- Supabase instead of the JSON files in content/imports/. It inserts clearly
-- marked SAMPLE rows that mirror the sample content in the Next.js app.
--
-- Run AFTER schema.sql.
-- Replace sample values with real Feishu Base data before going live.
-- ===========================================================================

-- Company info (single row)
insert into public.company_info (id, brand_name, tagline, slogan, description, value_props, contact, markets, certificates, services, stats)
values (
  1,
  'TakeawayPack',
  'Takeaway & Food Packaging for Export',
  'Reliable takeaway packaging, built for global trade buyers.',
  'SAMPLE company description. Replace with real company information from the Feishu Base once the import is unblocked.',
  '["Custom printing & private label available","Food-grade and recyclable material options","Export packing and consolidated shipping","Direct factory communication for RFQs"]'::jsonb,
  '{"email":"sales@example.com","phone":"+1 (000) 000-0000","whatsapp":"+1 (000) 000-0000","address":"Sample address — replace with real address"}'::jsonb,
  '["North America","Europe","Middle East","Asia-Pacific","Latin America"]'::jsonb,
  '[]'::jsonb,
  '["OEM / ODM customization","Custom size & gram weight","Flexo / offset printed branding","Sample sending before bulk order"]'::jsonb,
  '[{"label":"Product range","value":"100+"},{"label":"Export markets","value":"30+"},{"label":"Lead time","value":"15-35d"},{"label":"MOQ","value":"Flexible"}]'::jsonb
)
on conflict (id) do update set
  brand_name   = excluded.brand_name,
  tagline      = excluded.tagline,
  description  = excluded.description,
  value_props  = excluded.value_props,
  contact      = excluded.contact,
  updated_at   = now();

-- Sample products (subset; mirror of src/data/fallback.ts)
insert into public.products (slug, name, category, category_slug, summary, moq, material, customization, lead_time, featured, is_published, sort_order, specs)
values
  ('brown-kraft-stand-up-pouch', 'Brown Kraft Stand-Up Pouch', 'Kraft Paper Bags', 'kraft-paper-bags', 'Matte kraft stand-up pouch with resealable zipper for food retail.', '5000 pcs / size', 'Kraft paper + PE liner', 'Size, gram weight, print, window, valve', '20-30 days', true, true, 1, '[{"label":"Material","value":"Kraft paper + PE liner"},{"label":"Capacity","value":"100g / 250g / 500g / 1kg"}]'::jsonb),
  ('kraft-salad-bowl-with-lid', 'Kraft Salad Bowl with Lid', 'Food Containers', 'food-containers', 'Leak-resistant kraft salad bowl with matching PET lid.', '10000 pcs / size', 'Kraft + PE lining, PET lid', 'Size, print, lid type', '20-30 days', true, true, 2, '[{"label":"Material","value":"Kraft + PE lining, PET lid"},{"label":"Capacity","value":"500 / 750 / 1000 ml"}]'::jsonb),
  ('double-wall-hot-paper-cup', 'Double Wall Hot Paper Cup', 'Paper Cups', 'paper-cups', 'Insulated double wall cup for hot coffee and tea.', '30000 pcs / size', 'Paperboard + PE, double wall', 'Size, sleeve, print, emboss', '25-35 days', true, true, 3, '[{"label":"Material","value":"Paperboard + PE, double wall"},{"label":"Sizes","value":"8 / 12 / 16 oz"}]'::jsonb),
  ('3-compartment-bagasse-tray', '3-Compartment Bagasse Tray', 'Compartment Trays', 'compartment-trays', 'Compostable bagasse tray with three compartments.', '10000 pcs / size', 'Bagasse (sugarcane fiber)', 'Size, compartments, lid, print', '20-30 days', true, true, 4, '[{"label":"Material","value":"Bagasse"},{"label":"Compartments","value":"3"}]'::jsonb),
  ('wooden-cutlery-set', 'Wooden Cutlery Set', 'Cutlery', 'cutlery', 'Smooth birchwood fork, knife, spoon, and napkin set.', '500 cartons', 'Birchwood', 'Wrap, print, set contents', '20-30 days', true, true, 5, '[{"label":"Material","value":"Birchwood"},{"label":"Set","value":"Fork + knife + spoon"}]'::jsonb)
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  summary = excluded.summary,
  updated_at = now();
