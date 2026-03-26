'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-4 px-4 py-20">
      <p className="text-sm uppercase tracking-[0.2em] text-muted">Something went wrong</p>
      <h1 className="font-display text-3xl">Unable to load</h1>
      <p className="text-sm text-muted">There was a problem connecting to the database.</p>
      <button
        onClick={reset}
        className="mt-2 rounded-full border border-border bg-card/75 px-5 py-2 text-sm text-muted hover:text-ink"
      >
        Try again
      </button>
    </main>
  );
}
