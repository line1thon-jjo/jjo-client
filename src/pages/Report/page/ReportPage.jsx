import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BottomSheet from "@/components/BottomSheet/BottomSheet";
import GreenButton from "@/components/Button/GreenButton";
import Header from "@/components/Header/Header";
import AnalyzingScreen from "@/pages/Report/components/AnalyzingScreen";
import AttemptTabs from "@/pages/Report/components/AttemptTabs";
import SummaryPanel from "@/pages/Report/components/SummaryPanel";
import UtteranceGuide from "@/pages/Report/components/UtteranceGuide";
import UtteranceText from "@/pages/Report/components/UtteranceText";
import { useReportStatus } from "@/pages/Report/hooks/useReportStatus";
import { findPreviousAttempt, formatDuration } from "@/pages/Report/lib/attempts";
import { getErrorMessage, getFailureMessage } from "@/api/messages";
import { getPractice } from "@/api/practices";
import { getAttempts, getFeedback, getOverview, getUtterance } from "@/api/reports";
import { REPORT_IN_PROGRESS, REPORT_TABS, REPORT_WARNINGS } from "@/constants/report";

import infoIcon from "@/assets/icons/info-icon.svg";

import "./ReportPage.css";

const EMPTY_RESULT = { overview: null, utterance: null, feedback: null, previous: null, error: null };

export default function ReportPage() {
  const { practiceId, recordingId } = useParams();
  return <PracticeReport key={practiceId} practiceId={practiceId} recordingId={recordingId} />;
}

function PracticeReport({ practiceId, recordingId }) {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState(null);
  const [current, setCurrent] = useState(null);
  const [durations, setDurations] = useState({});
  const [practice, setPractice] = useState(null);
  const [tab, setTab] = useState(REPORT_TABS[0].id);

  useEffect(() => {
    const controller = new AbortController();

    getAttempts(practiceId, { signal: controller.signal })
      .then((response) => setAttempts(response.attempts))
      .catch(() => {
        if (!controller.signal.aborted) setAttempts([]);
      });

    return () => controller.abort();
  }, [practiceId]);

  useEffect(() => {
    const controller = new AbortController();

    getPractice(practiceId, { signal: controller.signal })
      .then(setPractice)
      .catch(() => {});

    return () => controller.abort();
  }, [practiceId]);

  const handleReport = useCallback((report) => {
    setCurrent(report);
    setDurations((saved) =>
      saved[report.recording_id] ? saved : { ...saved, [report.recording_id]: formatDuration(report.duration_ms) },
    );
    setAttempts((list) =>
      list?.map((attempt) =>
        attempt.recording_id === report.recording_id ? { ...attempt, status: report.status } : attempt,
      ),
    );
  }, []);

  const handleBack = () => navigate("/");
  const handleSelect = (id) => navigate(`/practices/${practiceId}/reports/${id}`, { replace: true });
  const handleRecordAgain = () => navigate("/record", { state: { title: practice.title, script: practice.script } });

  return (
    <div className="report-page">
      <Header variant="back" onBack={handleBack} />
      <section className="report-page__intro">
        {current ? (
          <h1 className="report-page__title font-22-bold">{current.practice_title}</h1>
        ) : (
          <span className="report-page__skeleton report-page__title font-22-bold" style={{ width: "64%" }} />
        )}

        <div className="report-page__attempts">
          {attempts && attempts.length > 0 && (
            <AttemptTabs
              attempts={attempts}
              currentId={recordingId}
              details={durations}
              onSelect={handleSelect}
              onAdd={practice ? handleRecordAgain : undefined}
            />
          )}
        </div>
      </section>

      <Report
        key={recordingId}
        recordingId={recordingId}
        attempts={attempts}
        tab={tab}
        onTabChange={setTab}
        onReport={handleReport}
        onBack={handleBack}
      />

      <div className="report-page__cta">
        <GreenButton text="다시 녹음하기" onClick={handleRecordAgain} disabled={!practice} />
      </div>
    </div>
  );
}

async function loadResult(recordingId, previousId, previousNo, signal) {
  const [overview, utterance, feedback, previousOverview] = await Promise.all([
    getOverview(recordingId, { signal }),
    getUtterance(recordingId, { signal }),
    getFeedback(recordingId, { signal }),
    previousId ? getOverview(previousId, { signal }).catch(() => null) : null,
  ]);

  return {
    overview,
    utterance,
    feedback,
    previous: previousOverview && { attemptNo: previousNo, overview: previousOverview },
    error: null,
  };
}

function Report({ recordingId, attempts, tab, onTabChange, onReport, onBack }) {
  const { report, error: statusError, sawProgress, retry: retryStatus } = useReportStatus(recordingId);
  const [result, setResult] = useState(EMPTY_RESULT);
  const [resultRequest, setResultRequest] = useState(0);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const isCompleted = report?.status === "COMPLETED";
  const isInProgress = REPORT_IN_PROGRESS.includes(report?.status);
  const previousAttempt = attempts && report ? findPreviousAttempt(attempts, report.attempt_no) : null;
  const previousId = previousAttempt?.recording_id ?? null;
  const previousNo = previousAttempt?.attempt_no ?? null;
  const canLoad = isCompleted && attempts !== null;

  useEffect(() => {
    if (report) onReport(report);
  }, [report, onReport]);

  useEffect(() => {
    if (!canLoad) return;
    const controller = new AbortController();

    loadResult(recordingId, previousId, previousNo, controller.signal)
      .then((loaded) => setResult(loaded))
      .catch((error) => {
        if (!controller.signal.aborted) setResult({ ...EMPTY_RESULT, error });
      });

    return () => controller.abort();
  }, [recordingId, previousId, previousNo, canLoad, resultRequest]);

  const handleCelebrated = useCallback(() => setHasCelebrated(true), []);

  const handleRetryResult = () => {
    setResult(EMPTY_RESULT);
    setResultRequest((count) => count + 1);
  };

  const error = statusError ?? result.error;
  if (error) {
    return (
      <ReportNotice
        title="결과를 불러오지 못했어요."
        description={getErrorMessage(error)}
        action="다시 불러오기"
        onAction={statusError ? retryStatus : handleRetryResult}
      />
    );
  }

  if (report?.status === "FAILED") {
    return (
      <ReportNotice
        title="분석하지 못했어요."
        description={getFailureMessage(report.failure)}
        action="다시 분석하기"
        onAction={retryStatus}
      />
    );
  }

  const showsAnalyzing = isInProgress || (isCompleted && sawProgress && !hasCelebrated);

  return (
    <>
      {!isInProgress && <ReportResult report={report} result={result} tab={tab} onTabChange={onTabChange} />}
      {showsAnalyzing && <AnalyzingScreen isDone={isCompleted} onDone={handleCelebrated} onBack={onBack} />}
    </>
  );
}

function ReportNotice({ title, description, action, onAction }) {
  return (
    <div className="report-page__notice" role="alert">
      <p className="font-18-semibold">{title}</p>
      <p className="font-14-regular">{description}</p>
      <button type="button" className="report-page__notice-action font-14-semibold" onClick={onAction}>
        {action}
      </button>
    </div>
  );
}

function ReportResult({ report, result, tab, onTabChange }) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [visitedTabs, setVisitedTabs] = useState(() => [tab]);
  const [focusPace, setFocusPace] = useState(null);

  const setTab = (next) => {
    onTabChange(next);
    setVisitedTabs((visited) => (visited.includes(next) ? visited : [...visited, next]));
  };

  const { overview, utterance, feedback, previous } = result;
  const isReady = Boolean(overview);
  const tabIndex = REPORT_TABS.findIndex(({ id }) => id === tab);
  const warnings = (report?.warnings ?? []).filter((code) => REPORT_WARNINGS[code]);

  const handleFocusPace = (pace) => {
    setFocusPace(pace);
    setTab("detail");
  };

  const handleTogglePace = (pace) => setFocusPace((current) => (current === pace ? null : pace));

  useEffect(() => {
    if (!focusPace || tab !== "detail") return;
    const frame = requestAnimationFrame(() => {
      document
        .querySelector(`#report-panel-detail .glyph[data-pace="${focusPace}"]`)
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [focusPace, tab]);

  const handleTabKeyDown = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = REPORT_TABS[(tabIndex + step + REPORT_TABS.length) % REPORT_TABS.length];
    setTab(next.id);
    document.getElementById(`report-tab-${next.id}`)?.focus();
  };

  return (
    <>
      <section className="report-page__summary">
        {isReady ? (
          <p className="report-page__headline font-22-regular">
            {overview.summary.headline}
            <strong className="font-22-bold">{overview.summary.footer}</strong>
          </p>
        ) : (
          <div className="report-page__headline font-22-regular">
            <span className="report-page__skeleton" style={{ width: "62%" }} />
            <span className="report-page__skeleton" style={{ width: "88%" }} />
          </div>
        )}
      </section>

      <div
        className="report-page__tabs"
        role="tablist"
        style={{ "--tab-index": tabIndex, "--tab-count": REPORT_TABS.length }}
        onKeyDown={handleTabKeyDown}
      >
        {REPORT_TABS.map(({ id, label }) => (
          <button
            key={id}
            id={`report-tab-${id}`}
            type="button"
            role="tab"
            className="report-page__tab font-16-semibold"
            aria-selected={tab === id}
            aria-controls={`report-panel-${id}`}
            tabIndex={tab === id ? 0 : -1}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
        <span className="report-page__indicator" aria-hidden="true" />
      </div>

      <main className="report-page__body">
        <section
          id="report-panel-summary"
          role="tabpanel"
          aria-labelledby="report-tab-summary"
          className="report-page__panel"
          hidden={tab !== "summary"}
        >
          {isReady ? (
            <SummaryPanel overview={overview} previous={previous} feedback={feedback} onFocusPace={handleFocusPace} />
          ) : (
            <div className="report-page__loading" />
          )}
        </section>

        <section
          id="report-panel-detail"
          role="tabpanel"
          aria-labelledby="report-tab-detail"
          className="report-page__panel"
          hidden={tab !== "detail"}
        >
          {utterance && visitedTabs.includes("detail") ? (
            <>
              {warnings.map((code) => (
                <p key={code} className="report-page__warning font-14-regular line-height-150">
                  {REPORT_WARNINGS[code]}
                </p>
              ))}
              <div className="report-page__toolbar">
                <div className="report-page__pace" role="group" aria-label="구간 강조">
                  {[
                    { pace: "FAST", label: "빠른 구절", count: overview.speed.fast },
                    { pace: "SLOW", label: "느린 구절", count: overview.speed.slow },
                  ].map(({ pace, label, count }) => (
                    <button
                      key={pace}
                      type="button"
                      className="report-page__pace-button font-14-medium"
                      data-pace={pace}
                      aria-pressed={focusPace === pace}
                      disabled={count === 0}
                      onClick={() => handleTogglePace(pace)}
                    >
                      {label} {count}곳
                    </button>
                  ))}
                </div>
                <button type="button" className="report-page__info font-14-medium" onClick={() => setIsGuideOpen(true)}>
                  <img src={infoIcon} alt="" />
                  보는 법
                </button>
              </div>
              <UtteranceText utterance={utterance} focusPace={focusPace} />
            </>
          ) : (
            <div className="report-page__loading" />
          )}
        </section>
      </main>

      <BottomSheet
        open={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        title="글자 모양 보는 법"
        footer={<GreenButton text="확인" onClick={() => setIsGuideOpen(false)} showArrow={false} />}
      >
        <UtteranceGuide />
      </BottomSheet>
    </>
  );
}
