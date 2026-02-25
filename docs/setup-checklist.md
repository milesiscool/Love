# Setup Checklist

- [ ] Create Supabase project and run `db/schema.sql`.
- [ ] Set all variables from `.env.example` in local `.env`.
- [ ] Update `MET_AT_UTC` and `lib/milestones.ts` with real dates.
- [ ] Set strong `VIEWER_PASSWORD` and `ADMIN_PASSWORD`.
- [ ] Set long random values for `VIEWER_COOKIE_SECRET` and `ADMIN_COOKIE_SECRET`.
- [ ] Deploy to Vercel and verify `/login` and `/admin/login`.
- [ ] Deploy same repo to Cloudflare Pages as backup.
- [ ] Configure GitHub secrets for backup/deploy workflows.
- [ ] Run `Daily Backup Export` workflow once manually.
- [ ] Install iOS home-screen icon from Safari.
