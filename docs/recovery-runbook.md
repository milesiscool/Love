# Recovery Runbook

## If Vercel is down

1. Verify Cloudflare Pages deployment is healthy.
2. Share backup URL immediately.
3. If using DNS failover (phase 2), route traffic to Cloudflare target.

## If database is down/corrupted

1. Restore latest Supabase PITR snapshot.
2. Download latest backup artifact from `Daily Backup Export` workflow.
3. Validate `relationship_state` row and recent `event_log` entries.
4. Re-run app health checks (`/login`, `/`, `/admin`).

## Manual backup restore (JSON)

1. Open artifact JSON.
2. Upsert `relationship_state` from backup.
3. Reinsert any missing `event_log` records for audit continuity.
4. Confirm counter status in UI.

## Operational checks

- Viewer auth works.
- Admin auth works.
- Decision endpoint returns expected idempotency errors.
- Counter increments in YES mode.
