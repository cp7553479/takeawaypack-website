# Deployment

This folder contains everything needed to ship the takeawaypack website.

```
deploy/
├── github/
│   └── create-and-push.sh   # create the `takeawaypack-website` repo and push
├── supabase/
│   ├── schema.sql           # tables + RLS (inquiries, products, company_info)
│   ├── seed.sql             # OPTIONAL sample catalog/company rows
│   └── README.md            # Supabase project + keys + verification
├── vercel/
│   └── deploy.md            # Vercel import, Root Directory, env vars
└── README.md                # this file
```

## Order of operations

1. **GitHub** — `bash deploy/github/create-and-push.sh` (needs `gh auth login`).
2. **Supabase** — create project, run `schema.sql`, copy the 3 API keys
   (`deploy/supabase/README.md`).
3. **Vercel** — import the repo, set **Root Directory = `source`**, add the env
   vars, deploy (`deploy/vercel/deploy.md`).
4. **Verify** — submit the contact form on the live URL; confirm the inquiry row
   in Supabase.

## Login requirements (may need user action)

| Service | Command / link | What the user does |
|---|---|---|
| GitHub CLI | `gh auth login` | Browser/device auth for the GitHub account that will own the repo |
| Vercel CLI | `vercel login` | Browser/device auth (or QR) for the Vercel account |
| Supabase | <https://supabase.com> dashboard | Sign in to create the project and copy API keys |

If any of these need interactive login, report the exact command/link to the
user before proceeding.
