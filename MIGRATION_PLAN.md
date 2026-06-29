# TakeawayPack shadcn rebuild spike

## Current repository

- Working copy: `.temp/takeawaypack-shadcn-spike`
- Source app: `.temp/takeawaypack-shadcn-spike/source`
- Remote: `https://github.com/cp7553479/takeawaypack-website.git`
- Branch: `spike/shadcn-rebuild`
- Base: `origin/main` at `eae948e19d65b4e16dc8d7f463a82000120b7231`
- Main production optimization branch was not modified.

## Candidate comparison

| Candidate | URL | License | Fit | Notes |
| --- | --- | --- | --- | --- |
| shadcn/ui | https://github.com/shadcn-ui/ui | MIT | High | Best component foundation for a durable Next.js + React redesign. Mature, active, copy-in component model. |
| Magic UI | https://github.com/magicuidesign/magicui | MIT | Medium | Good for polished marketing blocks and motion, but should be used selectively to avoid over-animation. |
| shadcn-ui/taxonomy | https://github.com/shadcn-ui/taxonomy | MIT | Medium | Useful reference for App Router + blog/content structure, but older Next.js patterns and not a B2B catalog site. |
| vercel/commerce | https://github.com/vercel/commerce | MIT | Medium | Strong commerce architecture, but too cart/headless-commerce heavy for an RFQ-first B2B packaging site. |
| Blazity/next-enterprise | https://github.com/Blazity/next-enterprise | MIT | Medium | Good engineering conventions, but a boilerplate rather than a finished trade/catalog site. |
| brijr/craft | https://github.com/brijr/craft | No license found | Rejected | No clear open-source license, so not safe for commercial reuse. |

## Recommended base

Use the existing Next.js App Router app as the data/runtime host, but rebuild the front end around `shadcn/ui` primitives and shadcn-compatible design tokens.

This is safer than replacing the whole repository with Vercel Commerce or another storefront because TakeawayPack is RFQ-first, not cart-first. The existing data layer already loads the imported catalog fallback, which currently represents hundreds of generated product/category pages. Replacing that layer would risk losing verified product data and URL coverage.

## Migration plan

1. Keep the existing data layer:
   - `src/lib/dataAdapter.ts`
   - `src/lib/types.ts`
   - `src/lib/blogPosts.ts`
   - `src/lib/mediaAssets.ts`
   - `src/lib/inquiry.ts`
2. Establish shadcn foundation:
   - `components.json`
   - `src/lib/utils.ts`
   - `src/components/ui/*`
   - Tailwind CSS variables and brand/kraft design tokens.
3. Rebuild visible UI in stages:
   - Header/footer/navigation
   - Home page
   - Product cards, product list, category pages
   - Product detail gallery and RFQ CTA
   - Blog/Insights and contact form
4. Validate after each stage:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run build`
   - Browser screenshot review for desktop and mobile before merging into main.
5. Merge strategy:
   - Keep this spike branch separate.
   - Review visuals and behavior.
   - Rebase onto the latest `main` after the continuous optimizer stops.
   - Merge only after screenshot QA and content sanity checks.

## First spike implementation

This branch adds the shadcn-compatible foundation and a broad first UI rewrite:

- Added shadcn-compatible dependencies and config.
- Added `src/components/ui` primitives for buttons, cards, badges, form inputs, accordion, carousel, sheet, separator, and aspect ratio.
- Added `cn` utility.
- Replaced Tailwind/theme tokens with a green/kraft packaging-oriented design system.
- Rebuilt the site shell, homepage, catalog/product/category/blog/contact/thank-you/not-found pages.
- Preserved existing imported catalog data and RFQ API flow.
- Preserved product/gallery behavior using real catalog data.

## Validation

Run from `.temp/takeawaypack-shadcn-spike/source`:

- `npm run typecheck` passed.
- `npm run lint` passed with no warnings or errors.
- `npm run build` passed and generated 359 pages.

## Remaining risks

- This is a spike branch, not yet merged into `main`.
- Visual QA screenshots still need to be taken before merge.
- The spike was built on `origin/main` at `eae948e`; later optimization commits must be reconciled before merge.
- Production inquiry persistence still depends on configured database/mail handoff.
- `NEXT_PUBLIC_SITE_URL` should be set in production for canonical and Open Graph URLs.
