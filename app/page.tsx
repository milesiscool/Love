import { ThemeToggle } from '@/components/theme-toggle';
import { JourneyExperience } from '@/components/journey-experience';
import { getNormalizedState } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { state } = await getNormalizedState();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:py-10">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Our Story</p>
          <h1 className="font-display text-3xl sm:text-4xl">Camryn + Miles Forever</h1>
          <p className="mt-1 text-sm text-muted">A cozy little corner of our journey, one second at a time.</p>
        </div>
        <ThemeToggle />
      </header>

      <JourneyExperience state={state} />
    </main>
  );
}
