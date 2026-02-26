'use client';

import { useEffect, useMemo, useState } from 'react';
import type { AdminAction, AdminStep, RelationshipState } from '@/lib/types';

type ApiStateResponse = {
  state: RelationshipState;
};

const actionCards: { id: AdminAction; title: string; blurb: string }[] = [
  {
    id: 'accept_primary',
    title: 'Say Yes',
    blurb: 'Set acceptance to YES and keep the current clock running from its saved start.'
  },
  {
    id: 'accept_secondary',
    title: 'Say No',
    blurb: 'Displayed as NO, but this playful option still records YES.'
  }
];

function actionSummary(action: AdminAction) {
  if (action === 'override_reset') {
    return 'Override lock, set status to YES, and reset the journey clock start time to now.';
  }
  if (action === 'accept_secondary') {
    return 'Display choice is NO, but prank behavior records YES without resetting the clock.';
  }
  return 'Records YES and keeps current start time unless it was never set.';
}

export default function AdminPage() {
  const [state, setState] = useState<RelationshipState | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<AdminStep>(1);
  const [selectedAction, setSelectedAction] = useState<AdminAction | null>(null);

  useEffect(() => {
    fetch('/api/state')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load state');
        }
        return res.json() as Promise<ApiStateResponse>;
      })
      .then((payload) => setState(payload.state))
      .catch(() => setError('Failed to load current status.'));
  }, []);

  const canContinue = step === 1 ? selectedAction !== null : true;

  const currentSummary = useMemo(() => {
    if (!selectedAction) {
      return 'Choose an action to continue.';
    }
    return actionSummary(selectedAction);
  }, [selectedAction]);

  const runAction = async (action: AdminAction) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch('/api/admin/decision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });

    const payload = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(payload?.error ?? 'Could not save decision.');
      return;
    }

    setState(payload.state);
    setMessage(
      action === 'override_reset'
        ? 'Override applied. Clock start time has been reset to now.'
        : 'Decision saved successfully.'
    );
    setStep(1);
    setSelectedAction(null);
  };

  const goNext = () => {
    if (step === 1 && !selectedAction) {
      return;
    }
    setStep((prev) => (prev === 1 ? 2 : 3));
  };

  const goBack = () => {
    setStep((prev) => (prev === 3 ? 2 : 1));
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10">
      <section className="w-full rounded-[2rem] border border-border/80 bg-card/75 p-6 shadow-[0_24px_48px_rgba(95,42,64,0.18)] backdrop-blur-xl sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted">Admin Wizard</p>
            <h1 className="font-display mt-1 text-3xl">Journey Controls</h1>
          </div>
          <form action="/api/auth/admin-logout" method="post">
            <button className="rounded-lg border border-border bg-paper/70 px-3 py-2 text-sm" type="submit">
              Log out
            </button>
          </form>
        </div>

        <div className="mt-3 rounded-xl border border-border/80 bg-paper/60 p-3 text-sm text-muted">
          Current status: <span className="font-semibold text-ink">{state?.status ?? 'Loading...'}</span>
          {state?.anniversary_start_utc ? (
            <p className="mt-1">Clock start: {new Date(state.anniversary_start_utc).toLocaleString()}</p>
          ) : null}
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-muted">
          <span className={step >= 1 ? 'font-semibold text-ink' : ''}>1. Choose</span>
          <span>→</span>
          <span className={step >= 2 ? 'font-semibold text-ink' : ''}>2. Review</span>
          <span>→</span>
          <span className={step >= 3 ? 'font-semibold text-ink' : ''}>3. Confirm</span>
        </div>

        {step === 1 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {actionCards.map((card) => {
              const selected = selectedAction === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setSelectedAction(card.id)}
                  className={[
                    'rounded-2xl border p-4 text-left transition',
                    selected
                      ? 'border-accent bg-accent/15 shadow-[0_14px_24px_rgba(110,44,65,0.18)]'
                      : 'border-border bg-paper/60 hover:bg-paper/80'
                  ].join(' ')}
                >
                  <p className="font-semibold">{card.title}</p>
                  <p className="mt-1 text-sm text-muted">{card.blurb}</p>
                </button>
              );
            })}
          </div>
        ) : null}

        {step >= 2 ? (
          <section className="mt-4 rounded-2xl border border-border/80 bg-paper/60 p-4">
            <p className="text-sm uppercase tracking-[0.16em] text-muted">Review</p>
            <p className="mt-2 text-sm text-ink">{currentSummary}</p>
            <p className="mt-2 text-xs text-muted">
              Override + reset is available at confirmation to force a fresh YES timestamp.
            </p>
          </section>
        ) : null}

        {step === 3 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={loading || !selectedAction}
              onClick={() => {
                if (selectedAction) {
                  void runAction(selectedAction);
                }
              }}
              className="rounded-xl border border-accent bg-accent px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Confirm selected action'}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => void runAction('override_reset')}
              className="rounded-xl border border-border bg-paper/70 px-4 py-3 text-sm font-semibold text-ink disabled:opacity-60"
            >
              Override + Reset to now
            </button>
          </div>
        ) : null}

        <div className="mt-5 flex gap-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              disabled={loading}
              className="rounded-lg border border-border bg-paper/60 px-4 py-2 text-sm disabled:opacity-60"
            >
              Back
            </button>
          ) : null}

          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canContinue || loading}
              className="rounded-lg border border-border bg-paper/60 px-4 py-2 text-sm disabled:opacity-60"
            >
              Continue
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => {
              setStep(1);
              setSelectedAction(null);
              setError(null);
              setMessage(null);
            }}
            disabled={loading}
            className="rounded-lg border border-border bg-paper/60 px-4 py-2 text-sm disabled:opacity-60"
          >
            Restart wizard
          </button>
        </div>

        {message ? <p className="mt-4 text-sm text-emerald-700 dark:text-emerald-300">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-red-700 dark:text-red-300">{error}</p> : null}
      </section>
    </main>
  );
}
