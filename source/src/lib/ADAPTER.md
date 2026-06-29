# Data adapter — expected import format

`dataAdapter.ts` consumes the JSON files that the Feishu Base import writes into
`content/imports/`. It is deliberately lenient: it accepts several common export
shapes and maps fields by name heuristics (English + 中文), so the exact Base
column names do not have to be known ahead of time.

## Files it looks for

| File | Purpose |
|---|---|
| `site-info.raw.json` | Website / company info records |
| `products.raw.json` | Product records (independent-site view) |
| `fields.site-info.json` | *(optional)* field metadata |
| `fields.products.json` | *(optional)* field metadata |

If neither `site-info.raw.json` nor `products.raw.json` exists, the adapter uses
the sample content in `src/data/fallback.ts`.

## Accepted shapes

Any of these top-level shapes work for the `*.raw.json` files:

```jsonc
// 1) lark-cli base export (preferred)
{ "records": [ { "record_id": "recX", "fields": { "Name": "...", "MOQ": "..." } } ] }

// 2) API-wrapper style
{ "data": { "items": [ { "fields": { ... } } ] } }
//   or  { "data": { "records": [ ... ] } }

// 3) bare array of records
[ { "Name": "...", "MOQ": "..." } ]
```

Each record may either be the fields object itself, or `{ "fields": { ... } }`.

## Field name heuristics (matched case/space/underscore-insensitive)

Field values may be plain strings, numbers, rich-text arrays, or single/multi
select objects — all are flattened automatically.

**Company / site-info** — recognized key candidates:

| Output | Candidate field names |
|---|---|
| brandName | brand, brand name, company name, 品牌, 公司名称, name |
| tagline / slogan | tagline, slogan, 标语, 一句话介绍, subtitle |
| description | about, about us, company intro, 公司简介, 简介, description |
| valueProps | value proposition, advantages, 优势, 核心优势, 卖点, highlights |
| email | email, 邮箱, sales email |
| phone | phone, tel, 电话, 联系电话, mobile, 手机 |
| whatsapp | whatsapp |
| address | address, 地址, 公司地址, location |
| website | website, 官网, 网址, url, domain |
| markets | markets, 出口市场, countries, 国家, 目标市场 |
| certificates | certificates, certification, 证书, 认证, 资质 |
| services | services, 服务, oem, 定制, customization |
| seo | seo title, meta description, keywords, 关键词 |

**Products** — recognized key candidates:

| Output | Candidate field names |
|---|---|
| name | product name, name, 产品名称, title, 型号, sku |
| category | category, 分类, 类别, series, 系列, type |
| summary | summary, short description, 简介, 副标题, highlight |
| description | description, details, 详情, 产品详情, content |
| features | features, 特点, 产品特点, highlights, 卖点, 优势 |
| image | main image, image, 主图, 图片, photo, cover, 封面 |
| gallery | gallery, images, 图册, 附加图片, 细节图 |
| material | material, 材质, 材料 |
| size | size, 尺寸, 规格, dimension, specifications |
| capacity | capacity, 容量, 容积, volume |
| moq | moq, minimum order, 起订量, 起订, 最低订购量 |
| customization | customization, oem, odm, 定制, 印刷, logo |
| leadTime | lead time, delivery time, 交期, 交货期, 生产周期 |
| price | price, fob, exw, 价格, 报价, 单价 |
| certifications | certification, certificates, 证书, 认证, 检测报告 |
| useCases | application, use case, 用途, 适用, 应用场景 |
| featured | featured, 推荐, hot, 新品, popular |

## Images

Feishu attachment fields expose a `file_token`, **not** a usable URL. The
website cannot download these at runtime, so non-URL image values are dropped
and an honest placeholder is shown. To show real images:

1. Download each attachment via the Feishu Drive API (lark-cli) into
   `source/public/products/`.
2. Either (a) add an `image_url` column to the Base holding the public URL, or
   (b) post-process the import to replace tokens with `/products/<file>.jpg`
   paths. `http(s)` URLs and `/...` paths are rendered directly.

## Verifying which source is active

`getDataSourceDebug()` (exported from `dataAdapter.ts`) reports the resolved
import directory, per-section source, and counts. The footer also prints the
active data source ("imported Base data" vs "sample content").
