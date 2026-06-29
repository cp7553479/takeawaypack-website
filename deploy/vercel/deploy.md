# Vercel deployment

The site is a standard Next.js 14 (App Router) app and deploys to Vercel with
zero custom build config. The only important setting is the **Root Directory**.

## Option A — Dashboard (recommended first time)

1. Sign in at <https://vercel.com> (use GitHub, email, or GitLab).
2. **Add New… → Project → Import** the `takeawaypack-website` GitHub repo.
3. **Configure Project**:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `source`  ← important (the repo root contains docs)
   - **Build Command:** `next build` (default)
   - **Install Command:** `npm install` (default)
4. **Environment Variables** — add (see `source/.env.example`):

   | Name | Value | Required |
   |---|---|---|
   | `NEXT_PUBLIC_SITE_URL` | your Vercel domain, e.g. `https://takeawaypack-website.vercel.app` | recommended |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | for live inquiries |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | for live inquiries |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key (server only) | for live inquiries |

   Without the Supabase vars the site still deploys and runs in **demo mode**
   (inquiries validate but are not saved).

5. **Deploy**. Vercel installs, builds, and gives you a preview + production URL.
   Pushing to `main` redeploys automatically.

## Option B — Vercel CLI

```bash
cd source
npm i -g vercel          # if not installed
vercel login             # browser/device login
vercel link              # link this folder to a Vercel project (Root Directory = source)
vercel env add NEXT_PUBLIC_SUPABASE_URL            # paste value (repeat per var)
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel --prod            # deploy to production
```

> If `vercel login` requires a device/QR confirmation, complete it in the
> browser, then rerun the command.

## After deploy

- Set the production `NEXT_PUBLIC_SITE_URL` to the final domain so the sitemap
  and canonical URLs are correct.
- Submit the contact form on the live URL; confirm the row appears in
  Supabase → Table Editor → `inquiries`.
- (Optional) Add a custom domain in Vercel → Project → Domains.
