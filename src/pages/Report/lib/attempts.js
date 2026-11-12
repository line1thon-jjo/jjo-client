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
