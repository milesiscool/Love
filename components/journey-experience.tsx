'use client';

import { LifeGrid } from '@/components/life-grid';
import { LiveCounter } from '@/components/live-counter';
import { camNote } from '@/lib/cam-note';
import type { RelationshipState } from '@/lib/types';

type Props = {
  state: RelationshipState;
};

export function JourneyExperience({ state }: Props) {
  return (
    <section className="space-y-5">
      <div className="inline-flex rounded-full border border-border bg-card/75 px-4 py-2 text-sm text-muted shadow-[0_10px_24px_rgba(94,38,56,0.16)]">
        Journey View
      </div>

      <LiveCounter state={state} />
      <LifeGrid />

      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card/68 p-6 shadow-[0_24px_48px_rgba(98,44,68,0.18)] backdrop-blur-xl">
        <div className="absolute -left-8 -top-8 h-20 w-20 rounded-full bg-accent/18 blur-2xl" />
        <div className="absolute -bottom-8 right-0 h-20 w-20 rounded-full bg-accent/12 blur-2xl" />
        <p className="text-sm uppercase tracking-[0.2em] text-muted">A Note For Cam</p>
        <h2 className="font-display mt-2 text-3xl">A little paragraph just for her</h2>
        <p className="relative mt-4 whitespace-pre-line rounded-2xl border border-border/70 bg-paper/60 p-4 leading-relaxed text-ink shadow-[inset_0_2px_8px_rgba(255,255,255,0.35)]">
          {camNote}
        </p>
      </section>
    </section>
  );
}
