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
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        weekPulse: {
          '0%, 100%': { boxShadow: '0 0 4px var(--accent)' },
          '50%': { boxShadow: '0 0 14px var(--accent), 0 0 4px var(--accent)' }
        },
        penguinBob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' }
        },
        penguinBlink: {
          '0%, 88%, 92%, 100%': { transform: 'scaleY(1)' },
          '90%': { transform: 'scaleY(0.1)' }
        },
        floatUp: {
          '0%': { opacity: '0', transform: 'translateY(0) scale(0.8)' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(-60px) scale(1)' }
        },
        floatHeart: {
          '0%': { opacity: '0', transform: 'translateY(100vh) scale(0.5)' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(-10vh) scale(1.1)' }
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
        'week-pulse': 'weekPulse 2s ease-in-out infinite',
        'penguin-bob': 'penguinBob 3s ease-in-out infinite',
        'penguin-blink': 'penguinBlink 4s ease-in-out infinite',
        'float-up': 'floatUp 3s ease-in-out both',
        'float-heart': 'floatHeart 12s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
