import { HABITS } from "@/constants/report";

function metricsOf(overview) {
  return [
    { id: "fast", label: "빠른 구절", unit: "곳", pace: "FAST", value: overview.speed.fast },
    { id: "slow", label: "느린 구절", unit: "곳", pace: "SLOW", value: overview.speed.slow },
    ...overview.habits.map(({ type, count }) => ({ id: type, label: HABITS[type], unit: "회", pace: null, value: count })),
  ];
}

export function buildHabitRows(current, previous) {
  const rows = new Map(metricsOf(current).map(({ value, ...metric }) => [metric.id, { ...metric, after: value }]));
  const before = previous ? Object.fromEntries(metricsOf(previous).map(({ id, value }) => [id, value])) : {};

  if (previous) {
    metricsOf(previous).forEach((metric) => {
      if (!rows.has(metric.id)) rows.set(metric.id, { ...metric, value: undefined, after: 0 });
    });
  }

  return [...rows.values()]
    .map((row) => ({ ...row, before: previous ? (before[row.id] ?? 0) : null }))
    .filter(({ before: previousValue, after }) => after > 0 || previousValue > 0)
    .sort((a, b) => b.after - a.after || (b.before ?? 0) - (a.before ?? 0));
}
