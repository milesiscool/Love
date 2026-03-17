# Love Timeline

Private, minimalist relationship tracker with a forever counter. Built as a Next.js PWA for iOS home-screen use, with Vercel primary hosting and Cloudflare Pages backup.

## Stack

- Next.js (App Router, TypeScript, Tailwind)
- Supabase Postgres
- Cookie-based encrypted viewer/admin sessions
- PWA manifest + service worker

## Local setup

1. Copy `.env.example` to `.env`.
2. Fill in all required env values.
3. Create a Supabase project.
4. Run SQL in `db/schema.sql`.
5. Update `lib/milestones.ts` with your milestones.
6. Install and run:

```bash
npm install
npm run dev
```

## Required env vars

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VIEWER_PASSWORD`
- `VIEWER_COOKIE_SECRET`
- `ADMIN_PASSWORD`
- `ADMIN_COOKIE_SECRET`
- `MET_AT_UTC` (UTC ISO timestamp)
- `NEXT_PUBLIC_SITE_URL` (recommended for production)

## Routes

- `GET /` viewer timeline (password protected)
- `GET /admin` admin dashboard (separate admin login)
- `POST /api/admin/decision` set `YES` or `NO` with optional override
- `GET /api/state` normalized state + milestones

## Deployment

See `docs/deployment.md`.

## Integrations workflow

See `docs/integrations.md`.

## Setup checklist

See `docs/setup-checklist.md`.

## Backup and recovery

See `docs/recovery-runbook.md`.
