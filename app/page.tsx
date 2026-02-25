import { ThemeToggle } from '@/components/theme-toggle';
import { LiveCounter } from '@/components/live-counter';
import { LifeGrid } from '@/components/life-grid';
import { getNormalizedState } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { state, milestones } = await getNormalizedState();
  const anchor = state.status === 'YES' ? state.anniversary_start_utc ?? state.met_at_utc : state.met_at_utc;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:py-10">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Private Timeline</p>
          <p className="text-xl font-medium">From the day we met to forever</p>
        </div>
        <ThemeToggle />
      </header>

      <LiveCounter state={state} />
      <LifeGrid anchorIso={anchor} />

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-lg font-medium">Milestones</h2>
        <ul className="mt-3 space-y-3">
          {milestones.map((milestone) => (
            <li key={milestone.id} className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{milestone.title}</p>
                <span className="text-xs uppercase tracking-[0.12em] text-muted">{milestone.kind}</span>
              </div>
              <p className="mt-1 text-sm text-muted">{new Date(milestone.date_utc).toLocaleString()}</p>
              {milestone.notes ? <p className="mt-2 text-sm text-muted">{milestone.notes}</p> : null}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
