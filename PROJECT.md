# Takeawaypack Website Project

## Scope

Create a deployable B2B inquiry website from Feishu Base data, push it to a
GitHub repository named `takeawaypack-website`, configure Supabase as backend
database, and deploy to Vercel when credentials are available.

## Project Folder

`/Users/vincent/.openclaw/workspace-wali-ge/projects/20260629-0859-takeawaypack-website`

## Canonical Inputs

- `BRIEF.md`
- `content/data-contract.md` after data import
- `content/imports/*.json` after data import

## Planned Stack

- Next.js application in `source/`
- Supabase for inquiries and optional seed data
- Vercel for hosting
- GitHub repository: `takeawaypack-website`

## Workflow Nodes

1. Data Contract And Import
   - Owner: data import subagent
   - Write scope: `content/imports/`, `content/data-contract.md`,
     `IMPORT_REPORT.md`
   - Status: blocked
   - Blocker: `lark-cli --profile wali-ge` is not configured. No Base data was
     imported or modified.

2. Project Build
   - Owner: build subagent
   - Write scope: `source/`, `assets/`, `deploy/`, `handoff/BUILD_REPORT.md`
   - Depends on: completed data import
   - Status: complete
   - Verification: `npm install`, `npm run lint`, `npm run typecheck`, and
     `npm run build` passed after local verification.

3. Launch QA And Deploy
   - Owner: QA/deploy subagent
   - Write scope: `QA_REPORT.md`, `handoff/README.md`, deploy metadata
   - Depends on: successful local build
   - Status: partially complete
   - GitHub: pushed to `https://github.com/cp7553479/takeawaypack-website`.
   - Vercel: blocked on user login; the first device code expired.
   - Supabase: blocked on `SUPABASE_ACCESS_TOKEN` or `supabase login --token`.

## External Effects

- GitHub repository creation and push are authorized by the user request.
- Vercel deployment is authorized by the user request, but authentication may
  require user login.
- Supabase project/database setup is authorized by the user request, but
  authentication may require user login.
- Do not delete or mutate existing remote production resources unless the
  target is explicitly confirmed.
