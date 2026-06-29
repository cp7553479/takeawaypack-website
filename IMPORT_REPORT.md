# Import Report

Status: blocked.

## Command Summary

Attempted commands:

```bash
lark-cli --profile wali-ge base +url-resolve --url '<site-info-base-url>' --as user
lark-cli --profile wali-ge base +url-resolve --url '<products-base-url>' --as user
```

Both commands failed before URL resolution with:

```text
profile "wali-ge" not found
available profiles: logopress
```

No read/write Base operations were performed after this failure. No Feishu data was modified.

## Counts

| Dataset | Records | Fields | Pagination complete |
|---|---:|---:|---|
| Website basic information | 0 | 0 | No |
| Products | 0 | 0 | No |

## Exported Files

| File | Purpose |
|---|---|
| `content/imports/import-blocked.status.json` | Machine-readable blocker status for downstream agents |
| `content/data-contract.md` | Blocked data contract stub and mapping plan |
| `IMPORT_REPORT.md` | This report |

Raw source exports such as `site-info.raw.json`, `products.raw.json`, and `fields.*.json` were not created because the required `wali-ge` profile is unavailable. Creating empty files with those names would risk downstream agents treating them as real source exports.

## Permission And Missing Risks

- Required `lark-cli` profile `wali-ge` is not configured in this runtime.
- The task explicitly requires every `lark-cli` command to use `--profile wali-ge`; using the available `logopress` profile would violate the import constraints.
- Since URL resolution did not run, the real `base_token`, `table_id`, `view_id`, fields, records, and pagination state are unknown.

## User-Facing Recovery Instruction

Please configure or restore the `wali-ge` lark-cli profile in this workspace, then rerun the import. The import must start with:

```bash
lark-cli --profile wali-ge base +url-resolve --url '<base-url>' --as user
```

If the profile exists elsewhere, ensure this agent runtime can see the same lark-cli config. If user authorization is also required after the profile is restored, run a scoped `lark-cli auth login` flow for the missing Base/Drive scopes under the `wali-ge` profile.

## Next Input For Website Builder

Do not start data-driven website implementation yet. The builder should wait for real exported files:

- `content/imports/site-info.raw.json`
- `content/imports/products.raw.json`
- `content/imports/fields.site-info.json`
- `content/imports/fields.products.json`
- An updated `content/data-contract.md` with verified source-to-target field mapping
