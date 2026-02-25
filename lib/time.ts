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

export function toIsoUtc(date = new Date()) {
  return date.toISOString();
}
