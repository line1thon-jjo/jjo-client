import { useEffect, useRef } from "react";

import { ATTEMPT_STATUS_LABELS } from "@/constants/report";

import "./AttemptTabs.css";

export default function AttemptTabs({ attempts, currentId, onSelect }) {
  const listRef = useRef(null);
  const sorted = [...attempts].sort((a, b) => a.attempt_no - b.attempt_no);

  useEffect(() => {
    listRef.current
      ?.querySelector("[aria-current]")
      ?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [currentId]);

  return (
    <nav className="attempt-tabs" aria-label="연습 회차">
      <ul ref={listRef} className="attempt-tabs__list">
        {sorted.map(({ recording_id: id, attempt_no: attemptNo, status }) => {
          const isCurrent = String(id) === String(currentId);
          const statusLabel = status && status !== "COMPLETED" ? ATTEMPT_STATUS_LABELS[status] : null;

          return (
            <li key={id}>
              <button
                type="button"
                className="attempt-tabs__tab font-14-semibold"
                aria-current={isCurrent ? "page" : undefined}
                onClick={() => !isCurrent && onSelect(id)}
              >
                {attemptNo}회차
                {statusLabel && (
                  <span className="attempt-tabs__status" data-status={status} aria-label={statusLabel} />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
