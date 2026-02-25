'use client';

import { useMemo } from 'react';

type Props = {
  anchorIso: string;
};

type CellState = 'past' | 'current' | 'future';

export function LifeGrid({ anchorIso }: Props) {
  const cells = useMemo(() => {
    const anchor = new Date(anchorIso).getTime();
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;

    return Array.from({ length: 52 * 10 }, (_, index) => {
      const start = anchor + index * weekMs;
      const end = start + weekMs;
      let state: CellState = 'future';

      if (now >= end) {
        state = 'past';
      } else if (now >= start && now < end) {
        state = 'current';
      }

      return state;
    });
  }, [anchorIso]);

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-medium">10-year weekly map</h2>
        <p className="text-xs text-muted">Life Calendar-inspired view</p>
      </div>
      <div
        className="grid grid-cols-[repeat(26,minmax(0,1fr))] gap-1 sm:grid-cols-[repeat(52,minmax(0,1fr))]"
        aria-label="Timeline week grid"
      >
        {cells.map((state, index) => (
          <span
            key={index}
            className={[
              'h-3 w-3 rounded-[2px] border',
              state === 'past' ? 'border-accent bg-accent/70' : '',
              state === 'current' ? 'border-ink bg-ink/80' : '',
              state === 'future' ? 'border-border bg-transparent' : ''
            ].join(' ')}
          />
        ))}
      </div>
      <div className="mt-4 flex gap-4 text-xs text-muted">
        <span>Filled: past</span>
        <span>Solid: current week</span>
        <span>Outline: future</span>
      </div>
    </section>
  );
}
