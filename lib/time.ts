import type { ElapsedParts } from '@/lib/types';

export function formatRelativeDuration(fromIso: string, now = new Date()) {
  const from = new Date(fromIso);
  const totalMs = Math.max(now.getTime() - from.getTime(), 0);
  const totalMinutes = Math.floor(totalMs / (1000 * 60));
  const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
  const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));

  return {
    totalMs,
    totalMinutes,
    totalHours,
    totalDays
  };
}

function daysInMonthUtc(year: number, month: number) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function addMonthsUtc(date: Date, months: number) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  const monthTotal = month + months;
  const targetYear = year + Math.floor(monthTotal / 12);
  const targetMonth = ((monthTotal % 12) + 12) % 12;
  const targetDay = Math.min(day, daysInMonthUtc(targetYear, targetMonth));

  return new Date(
    Date.UTC(
      targetYear,
      targetMonth,
      targetDay,
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    )
  );
}

export function formatElapsedParts(fromIso: string, now = new Date()): ElapsedParts {
  const anchor = new Date(fromIso);
  if (Number.isNaN(anchor.getTime())) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }

  if (now.getTime() <= anchor.getTime()) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }

  let cursor = new Date(anchor.getTime());
  let years = 0;
  let months = 0;

  while (true) {
    const nextYear = addMonthsUtc(cursor, 12);
    if (nextYear.getTime() > now.getTime()) {
      break;
    }
    years += 1;
    cursor = nextYear;
  }

  while (true) {
    const nextMonth = addMonthsUtc(cursor, 1);
    if (nextMonth.getTime() > now.getTime()) {
      break;
    }
    months += 1;
    cursor = nextMonth;
  }

  let remainderMs = now.getTime() - cursor.getTime();
  const dayMs = 1000 * 60 * 60 * 24;
  const hourMs = 1000 * 60 * 60;
  const minuteMs = 1000 * 60;
  const secondMs = 1000;

  const days = Math.floor(remainderMs / dayMs);
  remainderMs -= days * dayMs;
  const hours = Math.floor(remainderMs / hourMs);
  remainderMs -= hours * hourMs;
  const minutes = Math.floor(remainderMs / minuteMs);
  remainderMs -= minutes * minuteMs;
  const seconds = Math.floor(remainderMs / secondMs);

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalMs: now.getTime() - anchor.getTime()
  };
}

export function toIsoUtc(date = new Date()) {
  return date.toISOString();
}
