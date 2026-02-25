'use client';

import { FormEvent, useState } from 'react';

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') ?? '');

    const response = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const payload = await response.json().catch(() => null);

    setLoading(false);

    if (!response.ok) {
      if (response.status === 401) {
        setError('Incorrect admin password.');
        return;
      }
      setError(payload?.error ?? 'Unable to sign in right now.');
      return;
    }

    window.location.href = '/admin';
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <section className="w-full rounded-2xl border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold">Admin access</h1>
        <p className="mt-2 text-sm text-muted">Only you can set the yes/no milestone.</p>
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <label className="block text-sm">
            Admin password
            <input
              className="mt-1 w-full rounded-lg border border-border bg-paper px-3 py-2"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-white disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Enter admin'}
          </button>
        </form>
      </section>
    </main>
  );
}
