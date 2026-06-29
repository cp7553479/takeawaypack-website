# Generated Asset Report

Status: complete.

These images were rebuilt from real product attachment references downloaded
from the Feishu Base `商品表`. The files under `source/public/generated/` are
production copies for the website.

## Assets

| File | Use |
|---|---|
| `source/public/generated/hero-takeaway-packaging.png` | Homepage hero packaging scene |
| `source/public/generated/product-kraft-packaging.png` | Kraft paper trays, boxes, and bowls category |
| `source/public/generated/product-food-containers.png` | Food containers category and products |
| `source/public/generated/product-paper-cups.png` | Paper cups category and products |
| `source/public/generated/product-compartment-trays.png` | Compartment trays category and products |
| `source/public/generated/product-sauce-cups.png` | Sauce cups / lids category and products |
| `source/public/generated/product-cutlery.png` | Cutlery category and products |
| `source/public/generated/capabilities-quality-control.png` | About / capabilities section |

## Notes

- Reference products used include `CC01HCUP4`, `CC01BOWLK8`, `CC01TRAY1`,
  `CC01KB500`, `CC01PAIL8K`, `CC01SBLID96`, `CCWFORK140`, and
  `Food Cup with Lid 300ml`.
- The images intentionally avoid external logos, certificates, or branded
  claims. The paper bag reference contained third-party placeholder print, so
  it was not used in the final site assets.
- Product and category imagery is used only for the fallback/sample content
  path. When real Feishu product image URLs are imported, `dataAdapter.ts` uses
  those real image values first.
- Verification after integration: `npm run lint`, `npm run typecheck`, and
  `npm run build` all passed.
