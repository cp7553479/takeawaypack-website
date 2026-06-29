# takeawaypack-website

Inquiry-focused B2B trade website for takeaway & food-service packaging. Built
with **Next.js 14 (App Router)** + **TypeScript** + **Tailwind CSS**, with
**Supabase** for inquiry storage and **Vercel** for hosting.

## Quick start

```bash
cd source
cp .env.example .env.local      # optional: fill Supabase vars to enable live inquiries
npm install
npm run dev                     # http://localhost:3000
```

Without Supabase env vars the site runs in **demo mode** — everything renders
and the inquiry form validates, but submissions are not persisted.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (no emit) |

## Where the data comes from

`src/lib/dataAdapter.ts` is the single source of truth. It looks for real Feishu
Base data and falls back to clearly-marked sample content:

1. `process.env.DATA_IMPORT_DIR`
2. `<cwd>/content/imports`
3. `<cwd>/../content/imports`
4. `<cwd>/../../content/imports`
5. `<cwd>/.data`

It reads `site-info.raw.json` and `products.raw.json` (plus optional
`fields.*.json`) produced by the Feishu Base import. The adapter is tolerant of
common export shapes and maps fields by English + Chinese name heuristics, so the
exact Base column names do not need to be known in advance.

- When real data is present, `info.source` / `product.source` = `"imported"`.
- Otherwise the site uses `src/data/fallback.ts` (`source = "sample"`) and the
  footer labels the data source accordingly.

See [`src/lib/ADAPTER.md`](./src/lib/ADAPTER.md) for the expected JSON shape and
how to author the import files.

> The Feishu import is currently **blocked** (the `wali-ge` lark-cli profile is
> not configured in this environment). The site therefore shows sample content
> until those files appear. Dropping real `*.raw.json` into `content/imports/`
> is the only change needed to go live — no code edits.

## Supabase

- API route: `src/app/api/inquiry/route.ts` validates (zod) and inserts into the
  `inquiries` table when configured.
- Client: `src/lib/supabase.ts` (server only). Schema & setup:
  `../deploy/supabase/`.

## Project layout

```
src/
├── app/                      # App Router pages + API route + sitemap/robots
│   ├── api/inquiry/route.ts  # POST inquiry -> Supabase (or demo mode)
│   ├── products/             # catalog + [slug] detail
│   ├── categories/[category] # per-category listing
│   ├── about/  contact/  thank-you/
├── components/               # header, footer, hero, product card, inquiry form…
├── data/fallback.ts          # clearly-marked SAMPLE content
└── lib/
    ├── dataAdapter.ts        # Feishu JSON -> typed site data (+ sample fallback)
    ├── inquiry.ts            # zod schema + Supabase insert / demo fallback
    ├── supabase.ts           # server client + config detection
    └── types.ts              # domain types
```
