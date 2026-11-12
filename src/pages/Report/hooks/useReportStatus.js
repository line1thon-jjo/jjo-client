import { useEffect, useState } from "react";

import { getStatus, startAnalysis } from "@/api/reports";
import { REPORT_IN_PROGRESS, REPORT_POLL_MS } from "@/constants/report";

export function useReportStatus(recordingId) {
  const [state, setState] = useState({ report: null, error: null });
  const [request, setRequest] = useState({ count: 0, restart: false });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let timer;

    const load = async (fetchReport) => {
      try {
        const report = await fetchReport();
        if (signal.aborted) return;

        setState({ report, error: null });
        if (REPORT_IN_PROGRESS.includes(report.status)) {
          timer = setTimeout(() => load(() => getStatus(recordingId, { signal })), REPORT_POLL_MS);
        }
      } catch (error) {
        if (signal.aborted) return;
        if (error.code === "REPORT_NOT_FOUND") return load(() => startAnalysis(recordingId, { signal }));
        setState({ report: null, error });
      }
    };

    load(() => (request.restart ? startAnalysis : getStatus)(recordingId, { signal }));

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [recordingId, request]);

  const retry = () => {
    const restart = state.report?.status === "FAILED";
    setState({ report: null, error: null });
    setRequest(({ count }) => ({ count: count + 1, restart }));
  };

  return { ...state, retry };
}
