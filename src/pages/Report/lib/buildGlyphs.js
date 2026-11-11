const PITCH_LEVEL = { 1: -2, 2: -1, 6: 1, 7: 2 };

function fillRange(target, { start_idx, end_idx }, value) {
  const end = Math.min(end_idx, target.length - 1);
  for (let idx = Math.max(0, start_idx); idx <= end; idx += 1) {
    target[idx] = value;
  }
}

export function buildGlyphs(utterance) {
  const { spoken_text: text, marks = [], paces = [], pauses = [], segments = [] } = utterance;
  const { replaced = [], added = [], skipped = [] } = utterance;
  const length = text.length;

  const pitch = new Array(length).fill(0);
  const stretch = new Array(length).fill(1);
  const pace = new Array(length).fill(null);
  const diff = new Array(length).fill(null);
  const segment = new Array(length).fill(-1);
  const pauseAfter = new Map(pauses.map((pause) => [pause.after_idx, pause.duration_ms]));

  marks.forEach(({ idx, pitch: level, stretch: ratio }) => {
    if (idx < 0 || idx >= length) return;
    if (level) pitch[idx] = PITCH_LEVEL[level] ?? 0;
    if (ratio) stretch[idx] = ratio;
  });

  paces.forEach((range) => fillRange(pace, range, range.label));
  replaced.forEach((range) => fillRange(diff, range, "replaced"));
  added.forEach((range) => fillRange(diff, range, "added"));
  skipped.forEach((range) => fillRange(diff, range, "skipped"));
  segments.forEach((range, index) => fillRange(segment, range, index));

  return Array.from(text, (char, idx) => ({
    idx,
    char,
    pitch: diff[idx] === "skipped" ? 0 : pitch[idx],
    stretch: diff[idx] === "skipped" ? 1 : stretch[idx],
    pace: pace[idx],
    paceEnd: pace[idx] !== null && pace[idx + 1] !== pace[idx],
    pauseMs: pauseAfter.get(idx) ?? 0,
    diff: diff[idx],
    segment: segment[idx],
  }));
}

export function findSegmentAt(segments, timeMs) {
  return segments.findIndex(({ start_ms, end_ms }) => timeMs >= start_ms && timeMs < end_ms);
}

export function findCharAt(segments, timeMs) {
  const index = findSegmentAt(segments, timeMs);
  if (index < 0) return -1;

  const { start_idx, end_idx, start_ms, end_ms } = segments[index];
  const progress = (timeMs - start_ms) / (end_ms - start_ms);
  return Math.min(end_idx, start_idx + Math.floor(progress * (end_idx - start_idx + 1)));
}

export function groupWords(glyphs) {
  const tokens = [];
  let word = null;

  glyphs.forEach((glyph) => {
    if (glyph.char === "\n" || glyph.char === " ") {
      word = null;
      tokens.push({ type: glyph.char === "\n" ? "break" : "space", glyph });
      return;
    }

    if (!word) {
      word = { type: "word", glyphs: [] };
      tokens.push(word);
    }
    word.glyphs.push(glyph);
  });

  return tokens;
}
