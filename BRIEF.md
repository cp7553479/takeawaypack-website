# Takeawaypack Website Brief

## Request

Build a B2B trade independent website for inquiry generation from two Feishu
Base sources:

- Website basic information:
  `https://hcnoqwd8zi2e.feishu.cn/base/DE3Yb7ylGakxnjsP7GPcn7EOnku?table=tblQOkbNO1iC48fZ&view=vew6VXXi4C`
- Product data, independent-site view:
  `https://hcnoqwd8zi2e.feishu.cn/base/EmcCbKUfaaVVx7svWDQcrWMrnLh?table=tbl8CcWEyrGvasHq&view=vewFvOHsQS`

## Delivery Targets

- GitHub repository name: `takeawaypack-website`
- Deploy target: Vercel
- Backend service and database: Supabase
- Primary conversion path: B2B inquiry/RFQ form

## Working Assumptions

- The site is a trade lead-generation website, not a checkout ecommerce store.
- Product content and company claims must come from the Feishu Base data or be
  clearly treated as generic structure/placeholders.
- Supabase should store inquiry submissions and product/company data if
  credentials are available.
- Vercel and Supabase login may require user action. If login is required,
  provide the user with the login link or QR code.

## Current Unknowns

- Exact brand name, logo, contact details, markets, certificates, images, and
  product taxonomy are pending Base extraction.
- Whether GitHub, Vercel, and Supabase CLIs are already authenticated locally is
  pending execution checks.
