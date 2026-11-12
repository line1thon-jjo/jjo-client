import FeedbackList from "@/pages/Report/components/FeedbackList";
import { buildHabitRows } from "@/pages/Report/lib/compareOverview";

import chevronIcon from "@/assets/icons/chevron-right.svg";

import "./SummaryPanel.css";

function Trend({ before, after, unit }) {
  if (before === null) return null;

  const difference = after - before;
  const trend = difference === 0 ? "same" : difference < 0 ? "better" : "worse";
  const label =
    difference === 0 ? "지난 연습과 같아요" : `지난 연습보다 ${Math.abs(difference)}${unit} ${difference < 0 ? "줄었어요" : "늘었어요"}`;

  return (
    <span className="summary-panel__trend font-14-semibold" data-trend={trend} aria-label={label}>
      {difference !== 0 && (
        <svg className="summary-panel__arrow" viewBox="0 0 10 12" aria-hidden="true">
          <path d="M5 11V1M1 5l4-4 4 4" />
        </svg>
      )}
      {difference === 0 ? "–" : Math.abs(difference)}
    </span>
  );
}

function HabitRow({ row, onFocusPace }) {
  const isCleared = row.after === 0;
  const content = (
    <>
      <span className="summary-panel__row-label font-16-medium">{row.label}</span>
      <span className="summary-panel__row-value">
        <span className="font-16-semibold">
          {row.after}
          {row.unit}
        </span>
        <Trend before={row.before} after={row.after} unit={row.unit} />
        {row.pace && !isCleared && <img src={chevronIcon} alt="" className="summary-panel__row-chevron" />}
      </span>
    </>
  );

  return (
    <li className="summary-panel__row" data-cleared={isCleared || undefined}>
      {row.pace && !isCleared ? (
        <button
          type="button"
          className="summary-panel__row-inner"
          onClick={() => onFocusPace(row.pace)}
          aria-label={`${row.label} ${row.after}${row.unit}, 상세 분석에서 위치 보기`}
        >
          {content}
        </button>
      ) : (
        <div className="summary-panel__row-inner">{content}</div>
      )}
    </li>
  );
}

export default function SummaryPanel({ overview, previous, feedback, onFocusPace }) {
  const rows = buildHabitRows(overview, previous?.overview ?? null);

  return (
    <div className="summary-panel">
      <section className="summary-panel__section" aria-labelledby="summary-next-title">
        <h2 id="summary-next-title" className="summary-panel__heading font-17-semibold">
          다음 연습에서는
        </h2>
        <FeedbackList items={feedback.items} />
      </section>

      <section className="summary-panel__section" aria-labelledby="summary-habits-title">
        <div className="summary-panel__heading-row">
          <h2 id="summary-habits-title" className="summary-panel__heading font-17-semibold">
            말하기 습관
          </h2>
          {previous && <span className="summary-panel__caption font-14-regular">지난 연습 대비</span>}
        </div>

        {rows.length === 0 ? (
          <p className="summary-panel__empty font-15-regular">빠르거나 느린 구절, 반복된 습관이 없었어요.</p>
        ) : (
          <ul className="summary-panel__rows">
            {rows.map((row) => (
              <HabitRow key={row.id} row={row} onFocusPace={onFocusPace} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
