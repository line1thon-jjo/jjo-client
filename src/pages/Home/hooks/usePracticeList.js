import { useEffect, useState } from "react";

import { listPractices } from "@/api/practices";
import { getAttempts } from "@/api/reports";
import { findPreviousAttempt } from "@/pages/Report/lib/attempts";

function newest(attempts) {
  return attempts.reduce(
    (current, attempt) => (!current || attempt.attempt_no > current.attempt_no ? attempt : current),
    null,
  );
}

function toEntry(practice, attempts) {
  const latest = newest(attempts);
  const latestCompleted = newest(attempts.filter((attempt) => attempt.status === "COMPLETED"));

  return {
    practice,
    attemptCount: attempts.length,
    latest,
    latestCompleted,
    previousCompleted: latestCompleted ? findPreviousAttempt(attempts, latestCompleted.attempt_no) : null,
    activeAt: latest?.recorded_at ?? practice.updated_at,
  };
}

async function loadPractices(signal) {
  const practices = await listPractices({ signal });
  const entries = await Promise.all(
    practices.map(async (practice) => {
      const response = await getAttempts(practice.id, { signal }).catch(() => null);
      return toEntry(practice, response?.attempts ?? []);
    }),
  );

  return entries.sort((a, b) => new Date(b.activeAt) - new Date(a.activeAt));
}

export function usePracticeList() {
  const [state, setState] = useState({ entries: null, error: null });
  const [request, setRequest] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    loadPractices(controller.signal)
      .then((entries) => {
        if (!controller.signal.aborted) setState({ entries, error: null });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setState({ entries: null, error });
      });

    return () => controller.abort();
  }, [request]);

  const retry = () => {
    setState({ entries: null, error: null });
    setRequest((count) => count + 1);
  };

  return { ...state, retry };
}
