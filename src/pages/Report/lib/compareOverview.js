import { HABITS } from "@/constants/report";

function metricsOf(overview) {
  return [
    { id: "fast", label: "빠른 구절", unit: "곳", value: overview.speed.fast },
    { id: "slow", label: "느린 구절", unit: "곳", value: overview.speed.slow },
    ...overview.habits.map(({ type, count }) => ({ id: type, label: HABITS[type], unit: "회", value: count })),
  ];
}

export function pickHighlights(current, previous, limit = 3) {
  const now = metricsOf(current);

  if (!previous) {
    const habitTotal = current.habits.reduce((sum, { count }) => sum + count, 0);
    return [
      { id: "fast", label: "빠른 구절", unit: "곳", before: null, after: current.speed.fast },
      { id: "slow", label: "느린 구절", unit: "곳", before: null, after: current.speed.slow },
      { id: "habits", label: "반복된 습관", unit: "회", before: null, after: habitTotal },
    ].slice(0, limit);
  }

  const before = Object.fromEntries(metricsOf(previous).map(({ id, value }) => [id, value]));
  const merged = new Map(now.map((metric) => [metric.id, metric]));
  metricsOf(previous).forEach((metric) => {
    if (!merged.has(metric.id)) merged.set(metric.id, { ...metric, value: 0 });
  });

  return [...merged.values()]
    .map(({ value, ...metric }) => ({ ...metric, before: before[metric.id] ?? 0, after: value }))
    .filter(({ before: previousValue, after }) => previousValue > 0 || after > 0)
    .sort((a, b) => Math.abs(b.after - b.before) - Math.abs(a.after - a.before) || b.after - a.after)
    .slice(0, limit);
}
