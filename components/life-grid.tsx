'use client';

import { useEffect, useMemo, useState } from 'react';
import { computeCompletedWeeks, weekDateRange } from '@/lib/time';
import { milestones } from '@/lib/milestones';
import { PixelPenguins } from '@/components/pixel-penguins';
import type { RelationshipState } from '@/lib/types';

type Props = {
  state: RelationshipState;
};

const TOTAL_BOXES = 260; // 5 years of weeks

function formatShortDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function LifeGrid({ state }: Props) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const baseTime =
    state.status === 'YES'
      ? state.anniversary_start_utc ?? state.met_at_utc
      : state.met_at_utc;

  const completedWeeks = useMemo(
    () => (baseTime ? computeCompletedWeeks(baseTime, now) : 0),
    [baseTime, now]
  );

  const milestoneWeeks = useMemo(() => {
    if (!baseTime) return new Set<number>();
    const baseMs = new Date(baseTime).getTime();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const set = new Set<number>();
    for (const m of milestones) {
      const mMs = new Date(m.date_utc).getTime();
      if (mMs >= baseMs) {
        set.add(Math.floor((mMs - baseMs) / weekMs));
      }
    }
    return set;
  }, [baseTime]);

  const cells = useMemo(() => Array.from({ length: TOTAL_BOXES }, (_, i) => i), []);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card/58 p-6 shadow-[0_24px_48px_rgba(90,38,38,0.16)] backdrop-blur-xl">
      <header className="mb-2">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Our Weeks Together</p>
        <h2 className="font-display mt-2 text-3xl">Memory Grid</h2>
        <p className="mt-2 text-sm text-muted">
          Every box is a week we&apos;ve shared. Watch it fill, one week at a time.
        </p>
      </header>

      <PixelPenguins />

      <div
        className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-[3px] rounded-2xl border border-border/80 bg-paper/60 p-3 shadow-[inset_0_3px_12px_rgba(255,255,255,0.28)] sm:grid-cols-[repeat(26,minmax(0,1fr))]"
        aria-label="Week tracker grid — each box is one week"
      >
        {cells.map((index) => {
          const isCompleted = index < completedWeeks;
          const isCurrent = index === completedWeeks;
          const isMilestone = milestoneWeeks.has(index);

          let tooltip = '';
          if (baseTime) {
            const { start, end } = weekDateRange(baseTime, index);
            tooltip = `Week ${index + 1}: ${formatShortDate(start)} – ${formatShortDate(end)}`;
          }

          const intensity = isCompleted
            ? 0.55 + 0.45 * (index / Math.max(completedWeeks, 1))
            : undefined;

          return (
            <span
              key={index}
              title={tooltip}
              className={`relative aspect-square rounded-[4px] border transition-colors duration-300 ${
                isCompleted
                  ? 'border-accent/40 bg-accent shadow-[inset_0_1px_3px_rgba(255,255,255,0.4)]'
                  : isCurrent
                    ? 'animate-week-pulse border-accent/60 bg-accent/70'
                    : 'border-accent/20 bg-card/78 shadow-[inset_0_1px_2px_rgba(255,255,255,0.32),0_1px_3px_rgba(109,45,61,0.08)]'
              }`}
              style={isCompleted ? { opacity: intensity } : undefined}
            >
              {isMilestone && (isCompleted || isCurrent) && (
                <span className="absolute inset-0 flex items-center justify-center text-[8px] leading-none text-white">
                  &#9829;
                </span>
              )}
            </span>
          );
        })}
      </div>

      <p className="mt-4 text-center font-display text-lg text-accent">
        Week {completedWeeks} and counting&hellip;
      </p>
    </section>
  );
}
