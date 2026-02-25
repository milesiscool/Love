import fs from 'node:fs/promises';
import path from 'node:path';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

const headers = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`
};

async function readTable(table) {
  const url = `${supabaseUrl}/rest/v1/${table}?select=*`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${table}: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

const [relationshipState, eventLog] = await Promise.all([readTable('relationship_state'), readTable('event_log')]);

const backup = {
  exported_at_utc: new Date().toISOString(),
  relationship_state: relationshipState,
  event_log: eventLog
};

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.join(process.cwd(), 'backup');
const outFile = path.join(outDir, `backup-${stamp}.json`);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(outFile, JSON.stringify(backup, null, 2), 'utf8');

console.log(`Backup written: ${outFile}`);
