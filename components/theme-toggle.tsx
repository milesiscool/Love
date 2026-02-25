'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
  };

  return (
    <button
      aria-label="Toggle color theme"
      onClick={toggleTheme}
      className="rounded-full border border-border bg-card px-3 py-1 text-sm text-ink transition hover:bg-accent/20"
      type="button"
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
