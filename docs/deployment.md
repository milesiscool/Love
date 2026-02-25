# Deployment Guide

## Vercel (primary)

1. Import this repo into Vercel.
2. Set all environment variables from `.env.example`.
3. Enable production deployments from `main`.
4. Confirm `GET /login` and `GET /admin/login` load.

## Cloudflare Pages (backup)

1. Create a Pages project for this repo.
2. Add the same environment variables as Vercel.
3. Use the `cloudflare-deploy.yml` workflow or direct Git integration.
4. Keep the backup URL ready to share if Vercel is unavailable.

## GitHub repository secrets

For workflows, add:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PAGES_PROJECT_NAME`

## iOS home screen install

1. Open the deployed site in Safari.
2. Tap Share.
3. Tap "Add to Home Screen".
4. Launch from icon for standalone app mode.
