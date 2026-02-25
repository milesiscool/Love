import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        accent: 'var(--accent)',
        muted: 'var(--muted)',
        card: 'var(--card)',
        border: 'var(--border)'
      }
    }
  },
  plugins: []
};

export default config;
