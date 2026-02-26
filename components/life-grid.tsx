'use client';

import { useMemo } from 'react';

export function LifeGrid() {
  const cells = useMemo(() => Array.from({ length: 30 * 16 }, (_, index) => index), []);

  return (
    <section className="relative rounded-3xl border border-border bg-card p-6 shadow-[0_20px_45px_rgba(90,38,38,0.1)]">
      <div className="pointer-events-none absolute -right-2 top-2 text-lg text-accent/35">✕</div>
      <div className="pointer-events-none absolute left-5 top-5 text-sm text-accent/35">x</div>

      <header className="mb-4">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Little Moments</p>
        <h2 className="font-display mt-2 text-3xl">Tiny Box Keepsake</h2>
        <p className="mt-2 text-sm text-muted">A simple wall of tiny boxes for all the little memories still ahead.</p>
      </header>

      <div
        className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1 rounded-2xl border border-border bg-paper/65 p-3 sm:grid-cols-[repeat(24,minmax(0,1fr))]"
        aria-label="Decorative tiny box panel"
      >
        {cells.map((cell) => (
          <span
            key={cell}
            className="aspect-square rounded-[4px] border border-accent/25 bg-card/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]"
          />
        ))}
      </div>
    </section>
  );
}
