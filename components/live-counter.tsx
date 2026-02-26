'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatElapsedParts } from '@/lib/time';
import type { ClockUnit, ElapsedParts, RelationshipState } from '@/lib/types';

type Props = {
  state: RelationshipState;
};

type UnitDef = {
  key: ClockUnit;
  label: string;
  max: number;
};

const units: UnitDef[] = [
  { key: 'years', label: 'Years', max: 10 },
  { key: 'months', label: 'Months', max: 12 },
  { key: 'days', label: 'Days', max: 31 },
  { key: 'hours', label: 'Hours', max: 24 },
  { key: 'minutes', label: 'Minutes', max: 60 },
  { key: 'seconds', label: 'Seconds', max: 60 }
];

function useNow(tickMs = 1000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), tickMs);
    return () => clearInterval(id);
  }, [tickMs]);

  return now;
}

function getUnitValue(parts: ElapsedParts, unit: ClockUnit) {
  return parts[unit];
}

function UnitCard({ unit, value }: { unit: UnitDef; value: number }) {
  const progress = Math.min(100, Math.floor((value / unit.max) * 100));

  return (
    <article className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/18 p-4 shadow-[0_20px_34px_rgba(58,22,36,0.2)] backdrop-blur-xl">
      <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.55),inset_0_-6px_12px_rgba(85,33,48,0.14)]" />
      <div
        className="pointer-events-none absolute inset-1 rounded-[1.3rem] opacity-40"
        style={{
          background: `conic-gradient(from 220deg, rgba(255,255,255,0.85) 0 ${progress}%, rgba(214,119,136,0.1) ${progress}% 100%)`
        }}
      />
      <div className="relative rounded-2xl border border-white/30 bg-white/25 p-3 shadow-[inset_0_0_22px_rgba(255,255,255,0.42)]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{unit.label}</p>
        <p className="mt-2 text-3xl font-semibold leading-none sm:text-4xl">{String(value).padStart(2, '0')}</p>
      </div>
    </article>
  );
}

export function LiveCounter({ state }: Props) {
  const now = useNow(1000);

  const mode = state.status;
  const baseTime = mode === 'YES' ? state.anniversary_start_utc ?? state.met_at_utc : state.met_at_utc;

  const elapsed = useMemo(() => {
    if (!baseTime) {
      return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
    }
    return formatElapsedParts(baseTime, now);
  }, [baseTime, now]);

  if (mode === 'NO') {
    return (
      <section className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card/62 p-6 shadow-[0_24px_48px_rgba(90,38,38,0.16)] backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Timeline status</p>
        <h2 className="font-display mt-2 text-3xl">Journey paused</h2>
        <p className="mt-3 text-muted">The forever clock is paused right now, but this still holds your story.</p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border/75 bg-card/55 p-6 shadow-[0_30px_60px_rgba(90,38,38,0.2)] backdrop-blur-xl sm:p-7">
      <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-accent/18 blur-3xl" />
      <div className="absolute -bottom-16 right-0 h-44 w-44 rounded-full bg-accent/14 blur-3xl" />

      <header className="relative">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">{mode === 'YES' ? 'Together for' : 'Since we met'}</p>
        <h2 className="font-display mt-2 text-4xl sm:text-5xl">Our Glass Clock</h2>
        <p className="mt-2 text-sm text-muted">Counting from {new Date(baseTime).toLocaleString()} and still going.</p>
        {mode === 'PENDING' ? (
          <p className="mt-2 text-sm text-accent">Waiting for your yes/no milestone while the journey keeps counting.</p>
        ) : null}
      </header>

      <div className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {units.map((unit) => (
          <UnitCard key={unit.key} unit={unit} value={getUnitValue(elapsed, unit.key)} />
        ))}
      </div>
    </section>
  );
}
