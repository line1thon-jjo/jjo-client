import { memo, useEffect, useMemo, useState } from "react";

import { buildGlyphs, findCharAt, groupWords } from "@/pages/Report/lib/buildGlyphs";

import "./UtteranceText.css";

const INTRO_MS = 3000;

const PITCH_LABEL = { 2: "아주 높게", 1: "높게", "-1": "낮게", "-2": "아주 낮게" };

function visualStretch(ratio) {
  if (ratio <= 1) return 1;
  return Math.min(2, 1 + (ratio - 1) * 0.33);
}

function describe(glyph) {
  const parts = [];
  if (glyph.pitch) parts.push(PITCH_LABEL[glyph.pitch]);
  if (glyph.stretch > 1) parts.push(`${glyph.stretch.toFixed(1)}배 길게`);
  return parts.join(", ");
}

const Glyph = memo(function Glyph({ glyph, wave, isPlaying }) {
  const style = {
    "--pitch": glyph.pitch,
    "--stretch": visualStretch(glyph.stretch),
  };

  return (
    <span
      className="glyph"
      style={{ "--i": glyph.idx }}
      data-segment={glyph.segment}
      data-pace={glyph.pace ?? undefined}
      data-pace-end={glyph.paceEnd || undefined}
      data-playing={isPlaying || undefined}
    >
      <span
        className="glyph__char"
        style={style}
        data-pitch={glyph.pitch || undefined}
        data-stretch={glyph.stretch > 1 || undefined}
        data-diff={glyph.diff ?? undefined}
        data-wave={wave ?? undefined}
        title={describe(glyph) || undefined}
        data-char={glyph.char}
      >
        <span className="glyph__ink">{glyph.char}</span>
      </span>
      {glyph.pauseMs > 0 && (
        <span className="glyph__pause" style={{ "--pause": Math.min(glyph.pauseMs / 1000, 2) }}>
          <span className="glyph__pause-label">{(glyph.pauseMs / 1000).toFixed(1)}초</span>
        </span>
      )}
    </span>
  );
});

const Space = memo(function Space({ glyph, isPlaying }) {
  return (
    <span
      className="glyph glyph--space"
      style={{ "--i": glyph.idx }}
      data-segment={glyph.segment}
      data-pace={glyph.pace ?? undefined}
      data-playing={isPlaying || undefined}
    >
      {" "}
    </span>
  );
});

export default function UtteranceText({ utterance, timeMs = 0, isPlaying = false, focusPace = null, onSelectSegment }) {
  const glyphs = useMemo(() => buildGlyphs(utterance), [utterance]);
  const tokens = useMemo(() => groupWords(glyphs), [glyphs]);
  const [isReady, setIsReady] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setIsReady(true));
    });
    const timer = setTimeout(() => setIsSettled(true), INTRO_MS);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, []);

  const currentChar = isPlaying ? findCharAt(utterance.segments, timeMs) : -1;
  const currentSegment = currentChar >= 0 ? glyphs[currentChar].segment : -1;

  const waveOf = (idx) => {
    const distance = currentChar - idx;
    return currentChar >= 0 && distance >= 0 && distance < 3 ? distance : null;
  };

  const handleClick = (event) => {
    const target = event.target.closest("[data-segment]");
    if (target && onSelectSegment) onSelectSegment(Number(target.dataset.segment));
  };

  return (
    <p
      className="utterance"
      style={{ "--sweep-step": `${Math.min(4, 1400 / glyphs.length)}ms` }}
      data-ready={isReady || undefined}
      data-settled={isSettled || undefined}
      data-focus-pace={focusPace || undefined}
      data-selectable={Boolean(onSelectSegment) || undefined}
      onClick={handleClick}
    >
      {tokens.map((token) => {
        if (token.type === "break") return <br key={token.glyph.idx} />;
        if (token.type === "space") {
          return <Space key={token.glyph.idx} glyph={token.glyph} isPlaying={token.glyph.segment === currentSegment} />;
        }

        return (
          <span key={token.glyphs[0].idx} className="utterance__word">
            {token.glyphs.map((glyph) => (
              <Glyph
                key={glyph.idx}
                glyph={glyph}
                wave={waveOf(glyph.idx)}
                isPlaying={glyph.segment === currentSegment}
              />
            ))}
          </span>
        );
      })}
    </p>
  );
}
