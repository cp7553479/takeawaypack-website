# Build Report — takeawaypack-website

**Status:** Implementation complete. Site builds on a standard Next.js stack.
**Local verification (install/build/lint/typecheck): NOT RUN** — `npm` commands
were blocked by the execution environment in this session (every `npm …`
invocation was refused). The commands to run are listed below and require no
code changes.

---

## 1. What was built

A production-quality, inquiry-focused **B2B trade website** for takeaway &
food-service packaging, using **Next.js 14 (App Router) + TypeScript + Tailwind
CSS**, with **Supabase** for inquiry storage and **Vercel** as the deploy target.

Pages / routes:
- **Home** — hero + value props, stats, category grid, featured products,
  trust/markets, 4-step process, inquiry CTA band.
- **Products** — full catalog with client-side category filter + search.
- **Products / [slug]** — detail with image/gallery, specs table, features,
  certifications, use cases, related products, inquiry CTA (prefilled product).
- **Categories / [category]** — per-category listing (statically generated).
- **About** — company overview, capabilities, markets, certifications, process.
- **Contact** — RFQ/inquiry form + direct-contact sidebar; prefills product via
  `?product=`.
- **Thank-you**, custom **404**, `sitemap.xml`, `robots.txt`.

Data approach:
- **`src/lib/dataAdapter.ts`** is the single source of truth. It reads the
  Feishu Base exports (`content/imports/site-info.raw.json`,
  `products.raw.json`, optional `fields.*.json`) when present, and falls back to
  clearly-marked **sample** content (`src/data/fallback.ts`) otherwise.
- The adapter tolerates `{records:[{fields}]}`, `{data:{items}}`, and bare-array
  export shapes, and maps fields via **English + 中文** name heuristics, so the
  exact Base column names don't need to be known in advance.
- Provenance is surfaced in the **footer** ("imported Base data" vs "sample
  content") and on the products page.
- **No real Base data has been imported or fabricated.** Sample claims are kept
  generic ("available", "on request", "custom").

Supabase integration:
- **`POST /api/inquiry`** validates (zod) and inserts into the `inquiries`
  table when `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (or anon
  key) are set. Otherwise it runs in **demo mode** (validates + echoes, logs
  server-side, stores nothing) so the form works end-to-end locally.
- Schema, RLS, optional seed, and setup steps live in `deploy/supabase/`.
- `service_role` is used only server-side; the public site can insert inquiries
  but cannot read them; the catalog/company tables are read-only to `anon`.

## 2. Files changed / created

```
source/                                 # the Next.js app (repo deploy root = source/)
  package.json, tsconfig.json, next.config.mjs,
  postcss.config.mjs, tailwind.config.ts, .eslintrc.json,
  .env.example, .gitignore, next-env.d.ts, README.md
  src/
    app/
      globals.css, layout.tsx, page.tsx, not-found.tsx, robots.ts, sitemap.ts
      api/inquiry/route.ts
      products/page.tsx, products/[slug]/page.tsx
      categories/[category]/page.tsx
      about/page.tsx, contact/page.tsx, thank-you/page.tsx
    components/
      SiteHeader.tsx, SiteFooter.tsx, ProductImage.tsx, ProductCard.tsx,
      ProductBrowser.tsx, HeroSection.tsx, StatsBar.tsx, CategoryGrid.tsx,
      ProcessSteps.tsx, TrustSection.tsx, InquiryCTA.tsx, InquiryForm.tsx
    lib/
      types.ts, dataAdapter.ts, supabase.ts, inquiry.ts, ADAPTER.md
    data/fallback.ts
deploy/
  README.md
  github/create-and-push.sh
  vercel/deploy.md
  supabase/{schema.sql, seed.sql, README.md}
.gitignore                              # root ignore for the standalone repo
handoff/BUILD_REPORT.md                 # this file
```

Existing blocked-status files (`IMPORT_REPORT.md`, `content/data-contract.md`,
`content/imports/import-blocked.status.json`, `BRIEF.md`, `PROJECT.md`,
`STYLE_PREVIEW.md`) were **read and respected, not modified**.

## 3. Commands run

| Command | Result |
|---|---|
| `node -v` | ✓ v24.17.0 |
| `npm install` / `npm --prefix source install` | ✗ Refused by environment (3 attempts) |
| `next build` / `lint` / `tsc --noEmit` | ✗ Not run — blocked by the `npm` refusal (no node_modules) |

**Verification status:** Code-reviewed by hand against TypeScript strict mode,
Next.js 14 App Router conventions, Tailwind v3 utility/color availability, and
ESLint `next/core-web-vitals` (e.g. unescaped entities, `<img>`, hooks deps).
Self-contained button classes (no `@apply` of custom classes), `FormEvent`
typed import, and an `Object.assign` cast were fixed during review. **A live
`npm install && npm run build` must be run to confirm — see §5.**

## 4. Blockers / login needs (for the main agent to relay to the user)

| Item | Required action |
|---|---|
| **Feishu Base data** | lark-cli profile **`wali-ge`** is not configured. The site ships with clearly-marked **sample** content until `content/imports/site-info.raw.json` and `products.raw.json` are produced. No code change is needed to switch — just drop the files in. |
| **GitHub CLI** | `gh auth login` (GitHub.com → HTTPS → web browser). Needed before `deploy/github/create-and-push.sh`. |
| **Vercel** | `vercel login` (browser/device) OR import via dashboard. Needed to deploy. |
| **Supabase** | Sign in at <https://supabase.com>, create project, run `schema.sql`, copy the 3 API keys. Without these the site runs in **demo mode**. |
| **Local build** | `npm` was blocked in this session; run `npm install && npm run build` in `source/` to confirm. |

## 5. Exact next steps

### a) Verify locally
```bash
cd source
cp .env.example .env.local        # optional: add Supabase keys to enable live inquiries
npm install
npm run typecheck                 # tsc --noEmit
npm run lint
npm run build
npm run dev                       # open http://localhost:3000
```
Expected: build succeeds; site renders with sample content; the contact form
submits in demo mode (Supabase unconfigured) and shows the success message.

### b) Wire up Supabase (enables real inquiry persistence)
1. Create a project at <https://supabase.com>.
2. SQL Editor → paste `deploy/supabase/schema.sql` → Run.
3. Project Settings → API → copy **Project URL**, **anon key**, **service_role key**.
4. Put them in `source/.env.local` (and later in Vercel env vars):
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`.
5. Submit the contact form → verify the row in Supabase Table Editor →
   `inquiries`.

### c) Push to GitHub
```bash
bash deploy/github/create-and-push.sh   # from the project root
```
Creates the `takeawaypack-website` repo (public by default; set
`REPO_VISIBILITY=private` to override), commits, and pushes. Requires
`gh auth login` first. (Idempotent and non-destructive; never force-pushes.)

### d) Deploy to Vercel
- Dashboard: import the `takeawaypack-website` repo, set **Root Directory =
  `source`**, add the env vars, Deploy. — or —
- CLI: `cd source && vercel login && vercel link && vercel --prod`.

Details: `deploy/vercel/deploy.md`.

### e) Load real Feishu data (when `wali-ge` profile is restored)
1. Rerun the Base import (per `IMPORT_REPORT.md`) to produce
   `content/imports/site-info.raw.json` and `products.raw.json`.
2. Rebuild/redeploy — the adapter picks them up automatically; the footer label
   flips to "imported Base data".
3. Images: Feishu attachment `file_token`s are not usable URLs, so product
   images show an honest placeholder until attachments are downloaded (via the
   Feishu Drive API) into `source/public/products/` and referenced by URL/path.
   See `source/src/lib/ADAPTER.md`.

## 6. Notes for downstream agents

- Write-scope respected: only `source/`, `deploy/`, `handoff/`, and the root
  `.gitignore` were written. No Feishu data was touched; no other agents' files
  were reverted.
- The adapter is server-only (uses `node:fs`); it is imported only by server
  components, route handlers, `sitemap`, `robots`, and `generateStaticParams`.
- `runtime = "nodejs"` is set on the inquiry route for `fs`/Supabase access.
- If you choose to serve the catalog from Supabase instead of JSON, the
  `products` / `company_info` tables and an `anon` read path already exist in
  `schema.sql`; wire a fetch into `dataAdapter.ts` (optional, not required).
