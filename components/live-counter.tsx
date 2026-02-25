'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatRelativeDuration } from '@/lib/time';
import type { RelationshipState } from '@/lib/types';

type Props = {
  state: RelationshipState;
};

function useNow(tickMs = 1000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), tickMs);
    return () => clearInterval(id);
  }, [tickMs]);

  return now;
}

export function LiveCounter({ state }: Props) {
  const now = useNow();

  const mode = state.status;
  const baseTime = state.status === 'YES' ? state.anniversary_start_utc : state.met_at_utc;

  const duration = useMemo(() => {
    if (!baseTime) {
      return { totalDays: 0, totalHours: 0, totalMinutes: 0 };
    }
    return formatRelativeDuration(baseTime, now);
  }, [baseTime, now]);

  if (mode === 'NO') {
    return (
      <section className="rounded-2xl border border-border bg-card p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Timeline Status</p>
        <h1 className="mt-2 text-3xl font-semibold">Decision recorded</h1>
        <p className="mt-2 text-muted">The forever counter is paused. You can still keep your milestones.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <p className="text-sm uppercase tracking-[0.2em] text-muted">
        {mode === 'YES' ? 'Together For' : 'Since We Met'}
      </p>
      <h1 className="mt-2 text-6xl font-semibold leading-none sm:text-7xl">{duration.totalDays}</h1>
      <p className="mt-2 text-base text-muted">days</p>
      <p className="mt-4 text-sm text-muted">
        {duration.totalHours.toLocaleString()} hours • {duration.totalMinutes.toLocaleString()} minutes
      </p>
      {mode === 'PENDING' ? (
        <p className="mt-4 text-sm text-accent">Waiting for the yes/no moment to start the forever counter.</p>
      ) : null}
    </section>
  );
}
