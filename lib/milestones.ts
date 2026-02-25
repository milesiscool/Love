import type { Milestone } from '@/lib/types';

export const milestones: Milestone[] = [
  {
    id: 'met-day',
    title: 'We met',
    date_utc: '2026-01-01T00:00:00.000Z',
    notes: 'The beginning.'
  },
  {
    id: 'first-trip',
    title: 'First trip together',
    date_utc: '2026-07-15T00:00:00.000Z',
    notes: 'Example milestone: update this in lib/milestones.ts.'
  }
];
