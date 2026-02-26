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
  pad: number;
};

const units: UnitDef[] = [
  { key: 'years', label: 'Years', pad: 2 },
  { key: 'months', label: 'Months', pad: 2 },
  { key: 'days', label: 'Days', pad: 2 },
  { key: 'hours', label: 'Hours', pad: 2 },
  { key: 'minutes', label: 'Minutes', pad: 2 },
  { key: 'seconds', label: 'Seconds', pad: 2 },
  { key: 'milliseconds', label: 'Milliseconds', pad: 3 }
];

function useNow(tickMs = 40) {
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

function DigitalUnit({ unit, value }: { unit: UnitDef; value: number }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-white/30 bg-white/20 p-4 shadow-[0_16px_30px_rgba(58,22,36,0.18)] backdrop-blur-lg">
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-8px_16px_rgba(85,33,48,0.12)]" />
      <div className="relative rounded-xl border border-white/35 bg-black/15 px-3 py-4 text-center shadow-[inset_0_1px_4px_rgba(255,255,255,0.35)]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{unit.label}</p>
        <p className="mt-2 font-mono text-4xl font-semibold leading-none text-ink sm:text-5xl">
          {String(value).padStart(unit.pad, '0')}
        </p>
      </div>
    </article>
  );
}

export function LiveCounter({ state }: Props) {
  const now = useNow(40);

  const mode = state.status;
  const baseTime = mode === 'YES' ? state.anniversary_start_utc ?? state.met_at_utc : state.met_at_utc;

  const elapsed = useMemo(() => {
    if (!baseTime) {
      return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, totalMs: 0 };
    }
    return formatElapsedParts(baseTime, now);
  }, [baseTime, now]);

  if (mode === 'NO') {
    return (
      <section className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card/62 p-6 shadow-[0_24px_48px_rgba(90,38,38,0.16)] backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Timeline status</p>
        <h2 className="font-display mt-2 text-3xl">Journey paused</h2>
        <p className="mt-3 text-muted">The clock is paused right now, but this still holds your story.</p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border/75 bg-card/55 p-6 shadow-[0_30px_60px_rgba(90,38,38,0.2)] backdrop-blur-xl sm:p-7">
      <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-accent/18 blur-3xl" />
      <div className="absolute -bottom-16 right-0 h-44 w-44 rounded-full bg-accent/14 blur-3xl" />

      <header className="relative">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">{mode === 'YES' ? 'Together for' : 'Since we met'}</p>
        <h2 className="font-display mt-2 text-4xl sm:text-5xl">Our Clock</h2>
        <p className="mt-2 text-sm text-muted">Digital live time from {new Date(baseTime).toLocaleString()}.</p>
        {mode === 'PENDING' ? (
          <p className="mt-2 text-sm text-accent">Waiting for your yes/no milestone while the clock keeps counting.</p>
        ) : null}
      </header>

      <div className="relative mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {units.map((unit) => (
          <DigitalUnit key={unit.key} unit={unit} value={getUnitValue(elapsed, unit.key)} />
        ))}
      </div>
    </section>
  );
}
