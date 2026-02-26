'use client';

import { useState } from 'react';
import { LifeGrid } from '@/components/life-grid';
import { LiveCounter } from '@/components/live-counter';
import type { JourneyTab, Milestone, RelationshipState } from '@/lib/types';

type Props = {
  state: RelationshipState;
  milestones: Milestone[];
};

const tabs: { id: JourneyTab; label: string }[] = [
  { id: 'clock', label: 'Clock' },
  { id: 'boxes', label: 'Boxes' },
  { id: 'milestones', label: 'Milestones' }
];

export function JourneyExperience({ state, milestones }: Props) {
  const [activeTab, setActiveTab] = useState<JourneyTab>('clock');

  return (
    <section className="space-y-4">
      <div
        className="inline-flex flex-wrap gap-2 rounded-full border border-border bg-card/80 p-2 shadow-[0_8px_20px_rgba(100,44,44,0.08)]"
        role="tablist"
        aria-label="Journey views"
      >
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={[
                'rounded-full px-4 py-2 text-sm transition',
                selected
                  ? 'bg-accent text-white shadow-[0_8px_16px_rgba(154,84,95,0.3)]'
                  : 'bg-paper/70 text-ink hover:bg-paper'
              ].join(' ')}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'clock' ? (
        <div role="tabpanel" id="panel-clock" aria-labelledby="tab-clock">
          <LiveCounter state={state} />
        </div>
      ) : null}

      {activeTab === 'boxes' ? (
        <div role="tabpanel" id="panel-boxes" aria-labelledby="tab-boxes">
          <LifeGrid />
        </div>
      ) : null}

      {activeTab === 'milestones' ? (
        <section
          role="tabpanel"
          id="panel-milestones"
          aria-labelledby="tab-milestones"
          className="relative rounded-3xl border border-border bg-card p-6 shadow-[0_20px_45px_rgba(90,38,38,0.1)]"
        >
          <div className="pointer-events-none absolute right-6 top-4 text-lg text-accent/35">♡</div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Shared Moments</p>
          <h2 className="font-display mt-2 text-3xl">Milestones</h2>
          <ul className="mt-4 space-y-3">
            {milestones.map((milestone) => (
              <li
                key={milestone.id}
                className="rounded-2xl border border-border bg-paper/65 p-4 shadow-[0_10px_24px_rgba(96,43,43,0.08)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold">{milestone.title}</p>
                  <span className="rounded-full bg-card px-2 py-1 text-xs uppercase tracking-[0.12em] text-muted">
                    {milestone.kind}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">{new Date(milestone.date_utc).toLocaleString()}</p>
                {milestone.notes ? <p className="mt-2 text-sm text-muted">{milestone.notes}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
  );
}
