import { useEffect, useId, useRef, useState } from "react";

import { ATTEMPT_STATUS_LABELS } from "@/constants/report";
import { formatAttemptName, formatDuration, formatRecordedAt } from "@/pages/Report/lib/attempts";

import chevronIcon from "@/assets/icons/chevron-right.svg";

import "./AttemptSelector.css";

export default function AttemptSelector({ report, attempts, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();

  const sortedAttempts = [...attempts].sort((a, b) => b.attempt_no - a.attempt_no);
  const canSelect = sortedAttempts.length > 1;

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (recordingId) => {
    setIsOpen(false);
    if (recordingId !== report.recording_id) onSelect(recordingId);
  };

  return (
    <div ref={rootRef} className="attempt-selector" data-open={isOpen || undefined}>
      <button
        type="button"
        className="attempt-selector__current"
        onClick={() => setIsOpen((open) => !open)}
        disabled={!canSelect}
        aria-expanded={isOpen}
        aria-controls={listId}
      >
        <span className="attempt-selector__text">
          <span className="font-16-semibold">{formatAttemptName(report.attempt_no)}</span>
          <span className="attempt-selector__meta font-13-regular">
            {formatRecordedAt(report.recorded_at)}
            <span aria-hidden="true">·</span>
            {formatDuration(report.duration_ms)}
          </span>
        </span>
        {canSelect && <img src={chevronIcon} alt="" className="attempt-selector__chevron" />}
      </button>

      <ul id={listId} className="attempt-selector__list" hidden={!isOpen}>
        {sortedAttempts.map((attempt) => (
          <li key={attempt.recording_id}>
            <button
              type="button"
              className="attempt-selector__option"
              aria-current={attempt.recording_id === report.recording_id || undefined}
              onClick={() => handleSelect(attempt.recording_id)}
            >
              <span className="attempt-selector__text">
                <span className="font-17-semibold">{formatAttemptName(attempt.attempt_no)}</span>
                <span className="attempt-selector__meta font-13-regular">{formatRecordedAt(attempt.recorded_at)}</span>
              </span>
              {attempt.status && (
                <span className="attempt-selector__status" data-status={attempt.status}>
                  {ATTEMPT_STATUS_LABELS[attempt.status]}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
