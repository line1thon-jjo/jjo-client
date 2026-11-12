import { useState } from "react";

import FeedbackList from "@/pages/Report/components/FeedbackList";
import { HABITS, HABITS_PREVIEW_COUNT } from "@/constants/report";
import { formatAttemptName } from "@/pages/Report/lib/attempts";
import { pickHighlights } from "@/pages/Report/lib/compareOverview";

import "./SummaryPanel.css";

function changeText({ before, after, unit }) {
  if (before === null) return null;
  if (before === after) return "변화 없음";
  return `${Math.abs(after - before)}${unit} ${after < before ? "감소" : "증가"}`;
}

function HighlightCard({ highlight, index }) {
  const [showsDetail, setShowsDetail] = useState(false);
  const { label, unit, before, after } = highlight;
  const trend = before === null || before === after ? "same" : after < before ? "better" : "worse";
  const canToggle = before !== null && before !== after;

  return (
    <li className="summary-panel__card" style={{ "--i": index }}>
      <button
        type="button"
        className="summary-panel__card-button"
        onClick={() => setShowsDetail((shown) => !shown)}
        disabled={!canToggle}
        aria-pressed={canToggle ? showsDetail : undefined}
      >
        <span className="summary-panel__card-value font-24-bold">
          {after}
          <span className="font-15-semibold">{unit}</span>
        </span>
        <span className="summary-panel__card-label font-13-medium">{label}</span>
        {before !== null && (
          <span className="summary-panel__card-change font-13-semibold" data-trend={trend}>
            {showsDetail ? `${before}${unit} → ${after}${unit}` : changeText(highlight)}
          </span>
        )}
      </button>
    </li>
  );
}

function Highlights({ overview, previous }) {
  const highlights = pickHighlights(overview, previous?.overview ?? null);

  return (
    <section className="summary-panel__section" aria-labelledby="summary-highlights-title">
      <h2 id="summary-highlights-title" className="summary-panel__eyebrow font-14-medium">
        {previous ? `${formatAttemptName(previous.attemptNo)}과 비교` : "이번 연습"}
      </h2>

      {highlights.length === 0 ? (
        <p className="summary-panel__empty font-15-medium">빠르거나 느린 구절, 반복된 습관이 없었어요.</p>
      ) : (
        <ul className="summary-panel__cards">
          {highlights.map((highlight, index) => (
            <HighlightCard key={highlight.id} highlight={highlight} index={index} />
          ))}
        </ul>
      )}
    </section>
  );
}

function HabitItem({ habit }) {
  const { label, description } = HABITS[habit.type];

  return (
    <li className="summary-panel__habit">
      <div>
        <p className="summary-panel__habit-label font-16-semibold">{label}</p>
        <p className="summary-panel__habit-description font-14-regular">{description}</p>
      </div>
      <span className="summary-panel__habit-count font-14-semibold">{habit.count}회</span>
    </li>
  );
}

function Habits({ habits }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const preview = habits.slice(0, HABITS_PREVIEW_COUNT);
  const rest = habits.slice(HABITS_PREVIEW_COUNT);

  return (
    <section className="summary-panel__section" aria-labelledby="summary-habits-title">
      <h2 id="summary-habits-title" className="summary-panel__heading font-17-semibold">
        이번에 발견한 습관
      </h2>

      {habits.length === 0 ? (
        <p className="summary-panel__empty font-15-regular">반복된 말 습관이 없었어요.</p>
      ) : (
        <ul className="summary-panel__habits">
          {preview.map((habit) => (
            <HabitItem key={habit.type} habit={habit} />
          ))}
        </ul>
      )}

      {rest.length > 0 && (
        <>
          <div id="summary-habits-more" className="summary-panel__collapse" data-open={isExpanded || undefined}>
            <ul className="summary-panel__habits" inert={!isExpanded}>
              {rest.map((habit) => (
                <HabitItem key={habit.type} habit={habit} />
              ))}
            </ul>
          </div>

          <button
            type="button"
            className="summary-panel__more font-14-medium"
            aria-expanded={isExpanded}
            aria-controls="summary-habits-more"
            onClick={() => setIsExpanded((expanded) => !expanded)}
          >
            {isExpanded ? "접기" : `전체 습관 보기 ${habits.length}`}
          </button>
        </>
      )}
    </section>
  );
}

export default function SummaryPanel({ overview, previous, feedback }) {
  return (
    <div className="summary-panel">
      <Highlights overview={overview} previous={previous} />
      <Habits habits={overview.habits.filter(({ count }) => count > 0)} />

      <section className="summary-panel__section" aria-labelledby="summary-next-title">
        <h2 id="summary-next-title" className="summary-panel__heading font-17-semibold">
          다음 연습에서는
        </h2>
        <FeedbackList items={feedback.items} />
      </section>
    </div>
  );
}
