import { HABITS } from "@/constants/report";

function habitCounts(overview) {
  return Object.fromEntries(overview.habits.map(({ type, count }) => [type, count]));
}

export function compareHabits(current, previous) {
  const now = habitCounts(current);
  const before = previous ? habitCounts(previous) : {};
  const types = [...new Set([...Object.keys(now), ...Object.keys(before)])];

  return types
    .map((type) => ({
      type,
      ...HABITS[type],
      count: now[type] ?? 0,
      previous: previous ? (before[type] ?? 0) : null,
    }))
    .sort((a, b) => b.count - a.count || (b.previous ?? 0) - (a.previous ?? 0));
}

export function summarizeChanges(current, previous) {
  if (!previous) return [];

  const speedChanges = [
    { id: "fast", label: "빠른 구절", unit: "곳", before: previous.speed.fast, after: current.speed.fast },
    { id: "slow", label: "느린 구절", unit: "곳", before: previous.speed.slow, after: current.speed.slow },
  ];

  const habitChanges = compareHabits(current, previous).map(({ type, label, count, previous: before }) => ({
    id: type,
    label,
    unit: "회",
    before,
    after: count,
  }));

  return [...speedChanges, ...habitChanges]
    .filter(({ before, after }) => before !== after)
    .sort((a, b) => Math.abs(b.after - b.before) - Math.abs(a.after - a.before));
}
