# Vercel + Supabase Integration Workflow

This project is set up for:

- `main` branch = production
- `codex/sandbox-playground` branch = safe sandbox/preview

## One-time setup

1. Verify Vercel account:

```bash
npm run vercel:whoami
```

2. Link local folder to Vercel project:

```bash
npm run vercel:link
```

3. Pull env vars:

```bash
npm run env:pull:dev
npm run env:pull:preview
npm run env:pull:prod
```

4. Login to Supabase CLI:

```bash
npm run supabase:login
```

5. Link to production Supabase project:

```bash
npm run supabase:link:prod
```

## Day-to-day workflow

1. Work safely in sandbox:

```bash
git checkout codex/sandbox-playground
```

2. Make changes and push:

```bash
git add .
git commit -m "your message"
git push
```

3. Vercel will create/update a Preview deployment for sandbox.

4. Promote to production only when ready:

```bash
git checkout main
git merge codex/sandbox-playground
git push origin main
```

## Recommended safety setup

- In Vercel, set env vars in both `Preview` and `Production`.
- Use a separate Supabase project for preview/sandbox to avoid touching real data.
- Keep the production URL for presenting, and use preview URLs for experiments.
