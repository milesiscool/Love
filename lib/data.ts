import { milestones } from '@/lib/milestones';
import { getMetAtUtc } from '@/lib/env';
import type { Milestone, RelationshipState, RelationshipStatus } from '@/lib/types';
import { getSupabaseServerClient } from '@/lib/supabase';
import { toIsoUtc } from '@/lib/time';

export async function ensureRelationshipState() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('relationship_state')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return data as RelationshipState;
  }

  const metAt = getMetAtUtc();
  const seeded = {
    id: 1,
    status: 'PENDING' as RelationshipStatus,
    met_at_utc: metAt,
    decided_at_utc: null,
    anniversary_start_utc: null,
    updated_at_utc: toIsoUtc()
  };

  const { data: inserted, error: insertError } = await supabase
    .from('relationship_state')
    .upsert(seeded)
    .select('*')
    .single();

  if (insertError) {
    throw insertError;
  }

  await supabase.from('event_log').insert({
    event_type: 'seeded',
    payload: { met_at_utc: metAt }
  });

  return inserted as RelationshipState;
}

export async function getNormalizedState() {
  const state = await ensureRelationshipState();
  const now = Date.now();

  const normalizedMilestones: Milestone[] = milestones
    .map((milestone) => {
      const kind: Milestone['kind'] = new Date(milestone.date_utc).getTime() <= now ? 'past' : 'future';
      return {
        ...milestone,
        kind
      };
    })
    .sort((a, b) => +new Date(a.date_utc) - +new Date(b.date_utc));

  return {
    state,
    milestones: normalizedMilestones
  };
}

export async function setDecision(status: 'YES' | 'NO', override = false, resetClock = false) {
  const supabase = getSupabaseServerClient();
  const current = await ensureRelationshipState();

  if (current.status !== 'PENDING' && !override) {
    return { ok: false as const, reason: 'Decision already set. Use override to change it.' };
  }

  const nowIso = toIsoUtc();
  const nextAnniversaryStartUtc =
    status === 'YES'
      ? override || resetClock || current.status !== 'YES' || !current.anniversary_start_utc
        ? nowIso
        : current.anniversary_start_utc
      : null;

  const next = {
    id: 1,
    status,
    met_at_utc: current.met_at_utc,
    decided_at_utc: nowIso,
    anniversary_start_utc: nextAnniversaryStartUtc,
    updated_at_utc: nowIso
  };

  const { data, error } = await supabase.from('relationship_state').upsert(next).select('*').single();

  if (error) {
    throw error;
  }

  await supabase.from('event_log').insert({
    event_type: 'decision_set',
    payload: { status, override, reset_clock: resetClock }
  });

  return { ok: true as const, state: data as RelationshipState };
}
