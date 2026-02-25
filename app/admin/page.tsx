'use client';

import { FormEvent, useEffect, useState } from 'react';
import type { RelationshipState } from '@/lib/types';

type ApiStateResponse = {
  state: RelationshipState;
};

export default function AdminPage() {
  const [state, setState] = useState<RelationshipState | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/state')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load state');
        }
        return res.json() as Promise<ApiStateResponse>;
      })
      .then((payload) => setState(payload.state))
      .catch(() => setMessage('Failed to load current status.'));
  }, []);

  const setDecision = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const status = String(data.get('status') ?? '');
    const override = data.get('override') === 'on';

    const response = await fetch('/api/admin/decision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, override })
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(payload.error ?? 'Could not save decision.');
      return;
    }

    setState(payload.state);
    setMessage('Decision saved.');
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-4 py-10">
      <section className="w-full rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Admin panel</h1>
          <form action="/api/auth/admin-logout" method="post">
            <button className="rounded-lg border border-border px-3 py-2 text-sm" type="submit">
              Log out
            </button>
          </form>
        </div>

        <p className="mt-2 text-sm text-muted">Current status: {state?.status ?? 'Loading...'}</p>

        <form className="mt-5 space-y-3" onSubmit={setDecision}>
          <fieldset className="space-y-2">
            <legend className="text-sm">Set response</legend>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="status" value="YES" required /> YES
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="status" value="NO" required /> NO
            </label>
          </fieldset>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="override" /> Allow override if already decided
          </label>

          <button
            className="rounded-lg border border-border bg-accent px-4 py-2 text-white disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save decision'}
          </button>
        </form>

        {message ? <p className="mt-3 text-sm text-muted">{message}</p> : null}
      </section>
    </main>
  );
}
