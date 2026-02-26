'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'auto' | 'light' | 'dark';

const labels: Record<ThemeMode, string> = {
  auto: 'Auto Theme',
  light: 'Light Theme',
  dark: 'Dark Theme'
};

function applyTheme(mode: ThemeMode) {
  const hour = new Date().getHours();
  const autoDark = hour >= 19 || hour < 7;
  const isDark = mode === 'dark' || (mode === 'auto' && autoDark);
  document.documentElement.classList.toggle('dark', isDark);
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto');

  useEffect(() => {
    const stored = localStorage.getItem('theme-mode');
    const next: ThemeMode = stored === 'light' || stored === 'dark' || stored === 'auto' ? stored : 'auto';
    setMode(next);
    applyTheme(next);

    const id = setInterval(() => {
      if ((localStorage.getItem('theme-mode') ?? 'auto') === 'auto') {
        applyTheme('auto');
      }
    }, 60 * 1000);

    return () => clearInterval(id);
  }, []);

  const cycleMode = () => {
    const next: ThemeMode = mode === 'auto' ? 'light' : mode === 'light' ? 'dark' : 'auto';
    setMode(next);
    localStorage.setItem('theme-mode', next);
    applyTheme(next);
  };

  return (
    <button
      aria-label="Cycle theme mode"
      onClick={cycleMode}
      className="rounded-full border border-border bg-card px-4 py-2 text-sm text-ink shadow-[0_8px_16px_rgba(120,50,60,0.1)] transition hover:bg-accent/20"
      type="button"
    >
      {labels[mode]}
    </button>
  );
}
