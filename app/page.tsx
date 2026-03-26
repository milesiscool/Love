import { ThemeToggle } from '@/components/theme-toggle';
import { JourneyExperience } from '@/components/journey-experience';
import { FloatingHearts } from '@/components/floating-hearts';
import { getNormalizedState } from '@/lib/data';
import { getMetAtUtc } from '@/lib/env';
import type { RelationshipState } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let state: RelationshipState;
  try {
    ({ state } = await getNormalizedState());
  } catch {
    state = {
      id: 1,
      status: 'PENDING',
      met_at_utc: getMetAtUtc(),
      decided_at_utc: null,
      anniversary_start_utc: null,
      updated_at_utc: new Date().toISOString(),
    };
  }

  return (
    <>
      <FloatingHearts />
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:py-10">
        <header className="animate-fade-in-up flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted">Our Story</p>
            <h1 className="font-display text-3xl sm:text-4xl">Camryn + Miles Forever</h1>
            <p className="mt-1 text-sm text-muted">A cozy little corner of our journey, one second at a time.</p>
          </div>
          <ThemeToggle />
        </header>

        <JourneyExperience state={state} />
      </main>
    </>
  );
}
