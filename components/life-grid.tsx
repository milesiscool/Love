'use client';

import { useMemo } from 'react';

export function LifeGrid() {
  const cells = useMemo(() => Array.from({ length: 30 * 16 }, (_, index) => index), []);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card/58 p-6 shadow-[0_24px_48px_rgba(90,38,38,0.16)] backdrop-blur-xl">
      <header className="mb-4">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Little Moments</p>
        <h2 className="font-display mt-2 text-3xl">Tiny Box Keepsake</h2>
        <p className="mt-2 text-sm text-muted">A blank wall of tiny boxes for all the memories still ahead.</p>
      </header>

      <div
        className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1 rounded-2xl border border-border/80 bg-paper/60 p-3 shadow-[inset_0_3px_12px_rgba(255,255,255,0.28)] sm:grid-cols-[repeat(24,minmax(0,1fr))]"
        aria-label="Decorative tiny box panel"
      >
        {cells.map((cell) => (
          <span
            key={cell}
            className="aspect-square rounded-[4px] border border-accent/20 bg-card/78 shadow-[inset_0_1px_2px_rgba(255,255,255,0.32),0_1px_3px_rgba(109,45,61,0.08)]"
          />
        ))}
      </div>
    </section>
  );
}
