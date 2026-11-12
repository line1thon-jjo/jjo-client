import { buildHabitRows } from "@/pages/Report/lib/compareOverview";

import chevronIcon from "@/assets/icons/chevron-right.svg";

import "./HabitRows.css";

function Trend({ before, after, unit }) {
  if (before === null) return null;

  const difference = after - before;
  const trend = difference === 0 ? "same" : difference < 0 ? "better" : "worse";
  const label =
    difference === 0 ? "지난 연습과 같아요" : `지난 연습보다 ${Math.abs(difference)}${unit} ${difference < 0 ? "줄었어요" : "늘었어요"}`;

  return (
    <span className="habit-rows__trend font-14-semibold" data-trend={trend} aria-label={label}>
      {difference !== 0 && (
        <svg className="habit-rows__arrow" viewBox="0 0 10 12" aria-hidden="true">
          <path d="M5 11V1M1 5l4-4 4 4" />
        </svg>
      )}
      {difference === 0 ? "–" : Math.abs(difference)}
    </span>
  );
}

function HabitRow({ row, onFocusPace }) {
  const isCleared = row.after === 0;
  const canFocus = Boolean(onFocusPace && row.pace && !isCleared);
  const content = (
    <>
      <span className="habit-rows__label font-16-medium">{row.label}</span>
      <span className="habit-rows__value" data-chevron={canFocus || undefined}>
        <span className="font-16-semibold">
          {row.after}
          {row.unit}
        </span>
        <Trend before={row.before} after={row.after} unit={row.unit} />
        {canFocus && <img src={chevronIcon} alt="" className="habit-rows__chevron" />}
      </span>
    </>
  );

  return (
    <li className="habit-rows__row" data-cleared={isCleared || undefined}>
      {canFocus ? (
        <button
          type="button"
          className="habit-rows__inner"
          onClick={() => onFocusPace(row.pace)}
          aria-label={`${row.label} ${row.after}${row.unit}, 상세 분석에서 위치 보기`}
        >
          {content}
        </button>
      ) : (
        <div className="habit-rows__inner">{content}</div>
      )}
    </li>
  );
}

export default function HabitRows({ overview, previous, onFocusPace }) {
  const rows = buildHabitRows(overview, previous);

  if (rows.length === 0) {
    return <p className="habit-rows__empty font-15-regular">빠르거나 느린 구절, 반복된 습관이 없었어요.</p>;
  }

  return (
    <ul className="habit-rows">
      {rows.map((row) => (
        <HabitRow key={row.id} row={row} onFocusPace={onFocusPace} />
      ))}
    </ul>
  );
}
