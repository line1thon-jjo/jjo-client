import { useState } from "react";

import { HABITS_PREVIEW_COUNT, SPEED_BAR_CELLS } from "@/constants/report";
import { formatAttemptName } from "@/pages/Report/lib/attempts";
import { compareHabits, summarizeChanges } from "@/pages/Report/lib/compareOverview";

import "./OverviewPanel.css";

function Delta({ before, after, unit }) {
  if (before === null || before === after) return null;
  const difference = Math.abs(after - before);
  const isBetter = after < before;

  return (
    <span className="overview-panel__delta font-13-semibold" data-better={isBetter}>
      {difference}
      {unit} {isBetter ? "줄었어요" : "늘었어요"}
    </span>
  );
}

function ChangeSummary({ changes, previousAttemptNo }) {
  if (previousAttemptNo === null) {
    return (
      <section className="overview-panel__compare">
        <p className="overview-panel__compare-empty font-14-regular line-height-150">
          첫 연습이에요. 다시 녹음하면 이번 결과와 비교해 드려요.
        </p>
      </section>
    );
  }

  return (
    <section className="overview-panel__compare" aria-labelledby="overview-compare-title">
      <h2 id="overview-compare-title" className="overview-panel__compare-title font-14-medium">
        {formatAttemptName(previousAttemptNo)}과 비교하면
      </h2>
      {changes.length === 0 ? (
        <p className="overview-panel__compare-empty font-15-medium">지난 연습과 거의 같았어요.</p>
      ) : (
        <ul className="overview-panel__changes">
          {changes.slice(0, 3).map(({ id, label, unit, before, after }, index) => (
            <li key={id} className="overview-panel__change" style={{ "--i": index }}>
              <span className="font-15-semibold">{label}</span>
              <span className="overview-panel__change-values font-15-medium">
                <span className="overview-panel__before">
                  {before}
                  {unit}
                </span>
                <span aria-label="에서">→</span>
                <span>
                  {after}
                  {unit}
                </span>
              </span>
              <Delta before={before} after={after} unit={unit} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function HabitItem({ habit }) {
  const { label, description, count, previous } = habit;

  return (
    <li className="overview-panel__habit" data-gone={count === 0 || undefined}>
      <div className="overview-panel__habit-text">
        <p className="font-18-semibold">{label}</p>
        <p className="overview-panel__habit-description font-14-regular line-height-150">
          {count === 0 ? "이번 연습에서는 나타나지 않았어요." : description}
        </p>
      </div>
      <div className="overview-panel__habit-count">
        <span className="overview-panel__count font-14-semibold">{count}회</span>
        <Delta before={previous} after={count} unit="회" />
      </div>
    </li>
  );
}

function HabitList({ habits }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const preview = habits.slice(0, HABITS_PREVIEW_COUNT);
  const rest = habits.slice(HABITS_PREVIEW_COUNT);

  return (
    <section className="overview-panel__section" aria-labelledby="overview-habits-title">
      <h2 id="overview-habits-title" className="overview-panel__heading font-17-semibold">
        발견한 습관
      </h2>

      {habits.length === 0 ? (
        <p className="overview-panel__empty font-15-regular">반복된 말 습관이 없었어요.</p>
      ) : (
        <ul className="overview-panel__habits">
          {preview.map((habit) => (
            <HabitItem key={habit.type} habit={habit} />
          ))}
        </ul>
      )}

      {rest.length > 0 && (
        <>
          <div id="overview-habits-more" className="overview-panel__collapse" data-open={isExpanded || undefined}>
            <ul className="overview-panel__habits" inert={!isExpanded}>
              {rest.map((habit) => (
                <HabitItem key={habit.type} habit={habit} />
              ))}
            </ul>
          </div>

          <button
            type="button"
            className="overview-panel__more font-14-medium"
            aria-expanded={isExpanded}
            aria-controls="overview-habits-more"
            onClick={() => setIsExpanded((expanded) => !expanded)}
          >
            {isExpanded ? "접기" : `${rest.length}개 더 보기`}
          </button>
        </>
      )}
    </section>
  );
}

function speedHeadline({ fast, slow, measured }) {
  if (measured === 0) return "속도를 잴 수 있는 구절이 없었어요.";
  if (fast > 0) return `빠르게 지나간 구절이 ${fast}곳 있어요.`;
  if (slow > 0) return `느리게 지나간 구절이 ${slow}곳 있어요.`;
  return "처음부터 끝까지 고른 속도로 말했어요.";
}

function speedCells({ fast, slow, measured }) {
  if (measured === 0) return Array(SPEED_BAR_CELLS).fill("normal");
  const toCells = (count) => (count === 0 ? 0 : Math.max(1, Math.round((count / measured) * SPEED_BAR_CELLS)));
  const fastCells = toCells(fast);
  const slowCells = Math.min(toCells(slow), SPEED_BAR_CELLS - fastCells);

  return Array.from({ length: SPEED_BAR_CELLS }, (_, index) => {
    if (index < fastCells) return "fast";
    if (index >= SPEED_BAR_CELLS - slowCells) return "slow";
    return "normal";
  });
}

function SpeedSummary({ speed, previousSpeed }) {
  const legend = [
    { id: "fast", label: "빠른 구절" },
    { id: "slow", label: "느린 구절" },
  ];

  return (
    <section className="overview-panel__section" aria-labelledby="overview-speed-title">
      <h2 id="overview-speed-title" className="overview-panel__heading font-17-semibold">
        말하기 속도
      </h2>
      <p className="overview-panel__speed-headline font-15-medium">{speedHeadline(speed)}</p>

      <div className="overview-panel__speed-bar" aria-hidden="true">
        {speedCells(speed).map((kind, index) => (
          <span key={index} className="overview-panel__speed-cell" data-kind={kind} style={{ "--i": index }} />
        ))}
      </div>

      <dl className="overview-panel__legend">
        {legend.map(({ id, label }) => (
          <div key={id} className="overview-panel__legend-row">
            <dt className="overview-panel__legend-label font-13-regular" data-kind={id}>
              {label}
            </dt>
            <dd className="overview-panel__legend-value font-13-medium">
              <Delta before={previousSpeed ? previousSpeed[id] : null} after={speed[id]} unit="곳" />
              {speed[id]}곳
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function OverviewPanel({ overview, previousOverview, previousAttemptNo }) {
  return (
    <div className="overview-panel">
      <ChangeSummary changes={summarizeChanges(overview, previousOverview)} previousAttemptNo={previousAttemptNo} />
      <HabitList habits={compareHabits(overview, previousOverview)} />
      <SpeedSummary speed={overview.speed} previousSpeed={previousOverview?.speed} />
    </div>
  );
}
