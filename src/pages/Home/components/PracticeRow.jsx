import { useState } from "react";

import GreenButton from "@/components/Button/GreenButton";
import PracticeSummary from "@/pages/Home/components/PracticeSummary";
import { useOverflow } from "@/pages/Home/hooks/useOverflow";
import { formatRelativeTime } from "@/pages/Home/lib/formatRelativeTime";

import chevronIcon from "@/assets/icons/chevron-right.svg";

import "./PracticeRow.css";

export default function PracticeRow({ entry, isOpen, onToggle, onRecord, onOpenReport }) {
  const { practice, attemptCount, latest, latestCompleted, previousCompleted, activeAt } = entry;
  const [hasOpened, setHasOpened] = useState(isOpen);
  const [clipRef, isOverflowing] = useOverflow();
  const bodyId = `practice-row-${practice.id}`;

  if (isOpen && !hasOpened) {
    setHasOpened(true);
  }

  const handleTransitionEnd = (event) => {
    if (!isOpen || event.propertyName !== "grid-template-rows") return;
    event.currentTarget.closest(".practice-row")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const handleClick = (event) => {
    if (event.target.closest(".practice-row__body button")) return;
    if (window.getSelection()?.toString()) return;
    onToggle(practice.id);
  };

  return (
    <li className="practice-row" data-open={isOpen || undefined} onClick={handleClick}>
      <h2 className="practice-row__heading">
        <button type="button" className="practice-row__toggle" aria-expanded={isOpen} aria-controls={bodyId}>
          <span className="practice-row__title font-18-semibold">
            <span className="practice-row__mark">{practice.title}</span>
          </span>
          <img src={chevronIcon} alt="" className="practice-row__chevron" />
        </button>
      </h2>

      <p className="practice-row__meta font-14-medium">
        {attemptCount > 0 && <span className="practice-row__count">{attemptCount}회차</span>}
        <span>{formatRelativeTime(activeAt)}</span>
        {!latest && <span className="practice-row__status">녹음 전</span>}
      </p>

      <div id={bodyId} className="practice-row__body" onTransitionEnd={handleTransitionEnd}>
        <div className="practice-row__body-inner">
          <div
            ref={clipRef}
            className="practice-row__clip"
            data-fixed={Boolean(latestCompleted) || undefined}
            data-overflow={isOverflowing || undefined}
          >
            {hasOpened &&
              (latestCompleted ? (
                <PracticeSummary latestCompleted={latestCompleted} previousCompleted={previousCompleted} />
              ) : (
                <div className="practice-row__summary">
                  <p className="practice-row__script font-16-regular line-height-160">{practice.script}</p>
                </div>
              ))}
          </div>

          <div className="practice-row__actions">
            {latest ? (
              <>
                <GreenButton text="코치 받기" onClick={() => onOpenReport(entry)} />
                <button type="button" className="practice-row__report font-15-semibold" onClick={() => onRecord(practice)}>
                  다시 녹음하기
                </button>
              </>
            ) : (
              <GreenButton text="녹음 시작하기" onClick={() => onRecord(practice)} />
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
