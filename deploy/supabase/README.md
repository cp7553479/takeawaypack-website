# Supabase setup

This folder holds the SQL and instructions for the website backend.

The website works **without** Supabase (it runs in "demo mode": the inquiry form
validates but does not persist). Configure Supabase to start saving real
inquiries.

## 1. Create a project

1. Sign in at <https://supabase.com>.
2. **New project** → pick a name (e.g. `takeawaypack`), region, and a strong DB
   password. Wait for provisioning to finish.

## 2. Apply the schema

Open **SQL Editor → New query**, paste `schema.sql`, and **Run**. This creates
the `inquiries`, `products`, and `company_info` tables with Row Level Security.

(Optional) Run `seed.sql` afterwards to insert SAMPLE rows into `products` and
`company_info`. Only do this if you plan to serve the catalog from Supabase
instead of the JSON files; otherwise skip it.

## 3. Get your API keys

**Project Settings → API**:

| Variable | Where | Used by |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | Browser + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key | Public (safe to expose) |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key | Server only (inserts inquiries). **Keep secret.** |

## 4. Add the variables

**Local dev** — copy `source/.env.example` to `source/.env.local` and fill in the
three values. Restart `npm run dev`.

**Vercel** — Project Settings → Environment Variables, add the same three.
Redeploy.

> The app prefers `SUPABASE_SERVICE_ROLE_KEY` on the server so the inquiry
> insert bypasses RLS cleanly. If you only provide the anon key, inserts still
> work because `schema.sql` grants `anon` insert on `inquiries`.

## 5. Verify

Submit the contact form. In Supabase **Table Editor → inquiries** you should see
the new row. The form success message switches from "Demo mode…" to the real
confirmation copy.

## Security notes

- `service_role` bypasses RLS. Only use it on the server (the `/api/inquiry`
  route). It is **never** sent to the browser.
- `anon` can only **insert** inquiries and **read** published products /
  company info. It cannot read other people's inquiries.
- Rotate keys if a secret leaks: Dashboard → Project Settings → API → Rotate.

## Optional: serve the catalog from Supabase

The default site reads `content/imports/*.json` (or sample content). To serve
from the `products` / `company_info` tables instead, add a fetch layer in
`src/lib/dataAdapter.ts` using the Supabase client and a read-only `anon` key.
This is optional — the JSON-file path is the documented default.
