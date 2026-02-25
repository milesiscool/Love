import { createClient } from '@supabase/supabase-js';
import { assertEnvReady } from '@/lib/env';
import type { Database } from '@/lib/types';

let cached: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseServerClient() {
  if (cached) {
    return cached;
  }

  assertEnvReady();

  cached = createClient<Database>(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, {
    auth: { persistSession: false }
  });

  return cached;
}
