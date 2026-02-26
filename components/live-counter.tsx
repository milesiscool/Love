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

function UnitCard({
  unit,
  value,
  focused
}: {
  unit: UnitDef;
  value: number;
  focused: boolean;
}) {
  const progress = Math.min(100, Math.floor((value / unit.max) * 100));

  return (
    <article
      className={[
        'relative overflow-hidden rounded-2xl border border-border bg-paper/70 p-4 shadow-[0_8px_20px_rgba(100,44,44,0.08)] transition-all',
        focused ? 'scale-[1.01] ring-2 ring-accent/35' : 'opacity-90'
      ].join(' ')}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{ background: `conic-gradient(var(--accent) ${progress}%, transparent ${progress}% 100%)` }}
      />
      <div className="relative rounded-xl bg-card/85 p-3">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">{unit.label}</p>
        <p className="mt-2 text-3xl font-semibold leading-none sm:text-4xl">{String(value).padStart(2, '0')}</p>
      </div>
    </article>
  );
}

export function LiveCounter({ state }: Props) {
  const now = useNow(1000);
  const [focus, setFocus] = useState<'all' | ClockUnit>('all');

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
      <section className="relative rounded-3xl border border-border bg-card p-6 shadow-[0_20px_45px_rgba(90,38,38,0.1)]">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Timeline status</p>
        <h2 className="font-display mt-2 text-3xl">Journey paused</h2>
        <p className="mt-3 text-muted">
          The forever clock is paused right now, but this space still holds your milestones and memories.
        </p>
      </section>
    );
  }

  return (
    <section className="relative rounded-3xl border border-border bg-card p-6 shadow-[0_20px_45px_rgba(90,38,38,0.1)] sm:p-7">
      <div className="pointer-events-none absolute -right-2 -top-2 text-2xl text-accent/40">x</div>
      <div className="pointer-events-none absolute left-4 top-4 text-xl text-accent/40">✕</div>
      <div className="pointer-events-none absolute bottom-4 right-6 text-lg text-accent/35">♡</div>

      <header className="relative">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">{mode === 'YES' ? 'Together for' : 'Since we met'}</p>
        <h2 className="font-display mt-2 text-4xl sm:text-5xl">Live Journey Clock</h2>
        <p className="mt-2 text-sm text-muted">Counting from {new Date(baseTime).toLocaleString()} and still going.</p>
        {mode === 'PENDING' ? (
          <p className="mt-2 text-sm text-accent">Waiting for your yes/no milestone while the journey clock keeps time.</p>
        ) : null}
      </header>

      <div className="mt-5 flex flex-wrap gap-2" role="toolbar" aria-label="Clock focus">
        <button
          type="button"
          onClick={() => setFocus('all')}
          className={[
            'rounded-full border px-3 py-1 text-sm transition',
            focus === 'all' ? 'border-accent bg-accent text-white' : 'border-border bg-paper/70 text-ink hover:bg-paper'
          ].join(' ')}
        >
          All
        </button>
        {units.map((unit) => (
          <button
            key={unit.key}
            type="button"
            onClick={() => setFocus(unit.key)}
            className={[
              'rounded-full border px-3 py-1 text-sm transition',
              focus === unit.key
                ? 'border-accent bg-accent text-white'
                : 'border-border bg-paper/70 text-ink hover:bg-paper'
            ].join(' ')}
          >
            {unit.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {units.map((unit) => {
          const focused = focus === 'all' || focus === unit.key;
          return <UnitCard key={unit.key} unit={unit} value={getUnitValue(elapsed, unit.key)} focused={focused} />;
        })}
      </div>
    </section>
  );
}
