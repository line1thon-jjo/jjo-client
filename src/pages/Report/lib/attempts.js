import { ATTEMPT_ORDINALS } from "@/constants/report";

const DAY_MS = 24 * 60 * 60 * 1000;

export function formatAttemptName(attemptNo) {
  const ordinal = ATTEMPT_ORDINALS[attemptNo - 1];
  return ordinal ? `${ordinal} 번째 연습` : `${attemptNo}번째 연습`;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function formatRecordedAt(isoString, now = new Date()) {
  const date = new Date(isoString);
  const time = date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
  const days = Math.round((startOfDay(now) - startOfDay(date)) / DAY_MS);

  if (days === 0) return `오늘 ${time}`;
  if (days === 1) return `어제 ${time}`;
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${time}`;
}

export function formatDuration(durationMs) {
  const totalSeconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds}초`;
  if (seconds === 0) return `${minutes}분`;
  return `${minutes}분 ${seconds}초`;
}

export function findPreviousAttempt(attempts, attemptNo) {
  return attempts
    .filter((attempt) => attempt.attempt_no < attemptNo && attempt.status === "COMPLETED")
    .reduce((latest, attempt) => (!latest || attempt.attempt_no > latest.attempt_no ? attempt : latest), null);
}
