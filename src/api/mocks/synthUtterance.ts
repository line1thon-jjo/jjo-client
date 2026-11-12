import type { UtteranceAnalysis } from "@/api/types";

const MS_PER_CHAR = 190;

function sentenceRanges(text: string) {
  const ranges: [number, number][] = [];
  let start = 0;

  for (let idx = 0; idx < text.length; idx += 1) {
    const isEnd = /[.!?]/.test(text[idx]) || idx === text.length - 1;
    if (!isEnd) continue;
    if (idx > start) ranges.push([start, idx]);
    start = idx + 1;
    while (start < text.length && /\s/.test(text[start])) start += 1;
  }

  return ranges;
}

export function synthUtterance(text: string): UtteranceAnalysis {
  const ranges = sentenceRanges(text);
  const marks: UtteranceAnalysis["marks"] = [];
  const paces: UtteranceAnalysis["paces"] = [];
  const pauses: UtteranceAnalysis["pauses"] = [];

  ranges.forEach(([start, end], index) => {
    const last = /[.!?]/.test(text[end]) ? end - 1 : end;
    const length = last - start;

    if (index % 2 === 0) marks.push({ idx: last, pitch: 6 });
    else marks.push({ idx: last, stretch: 2.2 });

    if (length > 16 && index % 3 === 1) {
      paces.push({ start_idx: start + 4, end_idx: start + Math.min(length - 4, 22), label: "FAST" });
    }
    if (length > 12 && index % 4 === 2) {
      paces.push({ start_idx: start + 2, end_idx: start + Math.min(length - 2, 12), label: "SLOW" });
    }

    const comma = text.indexOf(",", start);
    if (comma > start && comma < end && index % 2 === 0) {
      pauses.push({ after_idx: comma, duration_ms: 600 + (index % 3) * 300 });
    }
  });

  return {
    spoken_text: text,
    marks,
    paces,
    pauses,
    segments: ranges.map(([start, end]) => ({
      start_idx: start,
      end_idx: end,
      start_ms: start * MS_PER_CHAR,
      end_ms: (end + 1) * MS_PER_CHAR,
    })),
    replaced: [],
    added: [],
    skipped: [],
  };
}
