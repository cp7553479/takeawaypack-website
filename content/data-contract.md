# Data Contract

Status: blocked before source data access.

## Source Access

The import could not resolve either Base URL because `lark-cli --profile wali-ge` is not configured in this environment. The CLI returned:

```text
profile "wali-ge" not found
available profiles: logopress
```

Per the task requirements, the import must use `--profile wali-ge`, must resolve URLs with `lark-cli base +url-resolve`, and must not substitute another profile or fabricate data. Therefore no real fields, records, product categories, images, specifications, or inquiry fields were exported.

## Required Sources

| Source | URL | Required table/view handling | Status |
|---|---|---|---|
| Website basic information | `https://hcnoqwd8zi2e.feishu.cn/base/DE3Yb7ylGakxnjsP7GPcn7EOnku?table=tblQOkbNO1iC48fZ&view=vew6VXXi4C` | Resolve URL first, then read returned table/view fields and records | Blocked |
| Products | `https://hcnoqwd8zi2e.feishu.cn/base/EmcCbKUfaaVVx7svWDQcrWMrnLh?table=tbl8CcWEyrGvasHq&view=vewFvOHsQS` | Resolve URL first, then read only the URL-provided table/view, the independent-site view | Blocked |

## Field Mapping

No source field mapping is available yet because the Base fields were not readable without the required profile.

Expected mapping work after access is restored:

| Target site area | Source fields to identify | Target output recommendation |
|---|---|---|
| Site identity | Brand name, logo, slogan, company intro, value proposition | Global site config, homepage hero, footer/company sections |
| Contact and inquiry | Email, phone, WhatsApp, address, inquiry receiver, CTA copy | Inquiry form defaults, header/footer contact links, product inquiry CTA |
| Navigation and SEO | Menu labels, SEO title, meta description, keywords | Route metadata and navigation config |
| Product catalog | Product name, category, subcategory, summary, details | Product listing, category pages, product detail pages |
| Product media | Main image, gallery images, attachment/image fields | Download or reference image assets for website build |
| Product specs | Material, size, capacity, color, packaging, MOQ, customization | Specification table and filter facets |
| Trade fields | FOB/EXW terms, sample policy, lead time, certification, use cases | B2B trust and inquiry decision content |

## Missing Or Abnormal Fields

Unknown until fields are exported. Current abnormal condition: missing required `wali-ge` lark-cli profile.

## Product Classification, Images, Specs, Inquiry Suggestions

These recommendations must be validated against real fields after import:

- Preserve the Base view order for product display if the view has manual ordering.
- Keep category and subcategory as normalized fields for listing filters.
- Treat image/attachment fields separately from text fields; do not flatten them into plain strings if file tokens are needed later.
- Keep MOQ, material, size, capacity, and customization as structured product specs.
- Add a product-level inquiry payload with product name, SKU/model if present, category, MOQ, and source record ID for traceability.

## Machine-Readable Status

See `content/imports/import-blocked.status.json`.
