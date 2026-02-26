'use client';

import { useEffect, useMemo, useState } from 'react';
import { LifeGrid } from '@/components/life-grid';
import { LiveCounter } from '@/components/live-counter';
import { camNote } from '@/lib/cam-note';
import type { RelationshipState } from '@/lib/types';

type Props = {
  state: RelationshipState;
};

export function JourneyExperience({ state }: Props) {
  const [liveState, setLiveState] = useState<RelationshipState>(state);

  useEffect(() => {
    setLiveState(state);
  }, [state]);

  useEffect(() => {
    let mounted = true;

    const refresh = async () => {
      try {
        const response = await fetch('/api/state', { cache: 'no-store' });
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as { state: RelationshipState };
        if (mounted) {
          setLiveState(payload.state);
        }
      } catch {
        // Ignore transient polling failures and keep last known state.
      }
    };

    const intervalId = setInterval(() => {
      void refresh();
    }, 10000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const lastSynced = useMemo(() => {
    if (!liveState.updated_at_utc) {
      return { local: 'Unknown', utc: 'Unknown' };
    }
    const updated = new Date(liveState.updated_at_utc);
    return { local: updated.toLocaleString(), utc: updated.toUTCString() };
  }, [liveState.updated_at_utc]);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-full border border-border bg-card/75 px-4 py-2 text-sm text-muted shadow-[0_10px_24px_rgba(94,38,56,0.16)]">
          Journey View
        </div>
        <div className="inline-flex rounded-full border border-border bg-paper/70 px-4 py-2 text-xs text-muted">
          Last synced from DB: {lastSynced.local} ({lastSynced.utc})
        </div>
      </div>

      <LiveCounter state={liveState} />
      <LifeGrid />

      <section className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card/70 p-6 shadow-[0_28px_52px_rgba(98,44,68,0.2)] backdrop-blur-xl">
        <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-accent/16 blur-2xl" />
        <div className="absolute -bottom-10 right-0 h-24 w-24 rounded-full bg-accent/12 blur-2xl" />
        <p className="text-sm uppercase tracking-[0.2em] text-muted">A Note For Cam</p>
        <h2 className="font-display mt-2 text-3xl">The words I wanted you to feel</h2>
        <p className="relative mt-4 whitespace-pre-line rounded-2xl border border-border/75 bg-paper/62 p-5 leading-relaxed text-ink shadow-[inset_0_2px_12px_rgba(255,255,255,0.38)]">
          {camNote}
        </p>
      </section>
    </section>
  );
}
