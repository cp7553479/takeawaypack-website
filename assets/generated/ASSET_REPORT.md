# Generated Asset Report

Status: complete.

These images were generated with the image generation tool for the B2B
takeaway-packaging website. The originals remain in the Codex generated-images
folder; copies are committed under `source/public/generated/` for production
use.

## Assets

| File | Use |
|---|---|
| `source/public/generated/hero-takeaway-packaging.png` | Homepage hero packaging scene |
| `source/public/generated/product-kraft-packaging.png` | Kraft paper bags / pouches category and products |
| `source/public/generated/product-food-containers.png` | Food containers category and products |
| `source/public/generated/product-paper-cups.png` | Paper cups category and products |
| `source/public/generated/product-compartment-trays.png` | Compartment trays category and products |
| `source/public/generated/product-sauce-cups.png` | Sauce cups / lids category and products |
| `source/public/generated/product-cutlery.png` | Cutlery category and products |
| `source/public/generated/capabilities-quality-control.png` | About / capabilities section |

## Notes

- The images intentionally contain no logos, text, certificates, or branded
  claims because real Base data and official brand assets are not yet imported.
- Product and category imagery is used only for the fallback/sample content
  path. When real Feishu product image URLs are imported, `dataAdapter.ts` uses
  those real image values first.
- Verification after integration: `npm run lint`, `npm run typecheck`, and
  `npm run build` all passed.
