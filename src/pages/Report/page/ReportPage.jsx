import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BottomSheet from "@/components/BottomSheet/BottomSheet";
import GreenButton from "@/components/Button/GreenButton";
import Header from "@/components/Header/Header";
import AnalyzingScreen from "@/pages/Report/components/AnalyzingScreen";
import AttemptSelector from "@/pages/Report/components/AttemptSelector";
import FeedbackList from "@/pages/Report/components/FeedbackList";
import OverviewPanel from "@/pages/Report/components/OverviewPanel";
import UtteranceGuide from "@/pages/Report/components/UtteranceGuide";
import UtteranceText from "@/pages/Report/components/UtteranceText";
import { useReportStatus } from "@/pages/Report/hooks/useReportStatus";
import { findPreviousAttempt } from "@/pages/Report/lib/attempts";
import { getErrorMessage, getFailureMessage } from "@/api/messages";
import { getAttempts, getFeedback, getOverview, getUtterance } from "@/api/reports";
import { REPORT_IN_PROGRESS, REPORT_TABS, REPORT_WARNINGS } from "@/constants/report";

import infoIcon from "@/assets/icons/info-icon.svg";

import "./ReportPage.css";

const EMPTY_RESULT = {
  attempts: [],
  overview: null,
  utterance: null,
  feedback: null,
  previous: null,
  error: null,
};

export default function ReportPage() {
  const { practiceId, recordingId } = useParams();
  return <Report key={recordingId} practiceId={practiceId} recordingId={recordingId} />;
}

async function loadResult(practiceId, recordingId, attemptNo, signal) {
  const { attempts } = await getAttempts(practiceId, { signal }).catch((error) => {
    if (error.name === "AbortError") throw error;
    return { attempts: [] };
  });
  const previousAttempt = findPreviousAttempt(attempts, attemptNo);

  const [overview, utterance, feedback, previousOverview] = await Promise.all([
    getOverview(recordingId, { signal }),
    getUtterance(recordingId, { signal }),
    getFeedback(recordingId, { signal }),
    previousAttempt ? getOverview(previousAttempt.recording_id, { signal }).catch(() => null) : null,
  ]);

  return {
    attempts,
    overview,
    utterance,
    feedback,
    previous: previousOverview && { attemptNo: previousAttempt.attempt_no, overview: previousOverview },
    error: null,
  };
}

function Report({ practiceId, recordingId }) {
  const navigate = useNavigate();
  const { report, error: statusError, sawProgress, retry: retryStatus } = useReportStatus(recordingId);
  const [result, setResult] = useState(EMPTY_RESULT);
  const [resultRequest, setResultRequest] = useState(0);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const isCompleted = report?.status === "COMPLETED";
  const isInProgress = REPORT_IN_PROGRESS.includes(report?.status);
  const attemptNo = report?.attempt_no;

  useEffect(() => {
    if (!isCompleted) return;
    const controller = new AbortController();

    loadResult(practiceId, recordingId, attemptNo, controller.signal)
      .then((loaded) => setResult(loaded))
      .catch((error) => {
        if (!controller.signal.aborted) setResult({ ...EMPTY_RESULT, error });
      });

    return () => controller.abort();
  }, [practiceId, recordingId, attemptNo, isCompleted, resultRequest]);

  const handleBack = () => navigate("/");
  const handleCelebrated = useCallback(() => setHasCelebrated(true), []);
  const handleSelectAttempt = (nextRecordingId) => navigate(`/practices/${practiceId}/reports/${nextRecordingId}`);

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
        onBack={handleBack}
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
        onBack={handleBack}
      />
    );
  }

  if (isInProgress || (isCompleted && sawProgress && !hasCelebrated)) {
    return <AnalyzingScreen isDone={isCompleted} onDone={handleCelebrated} onBack={handleBack} />;
  }

  return <ReportResult report={report} result={result} onSelectAttempt={handleSelectAttempt} onBack={handleBack} />;
}

function ReportNotice({ title, description, action, onAction, onBack }) {
  return (
    <div className="report-page">
      <Header variant="back" onBack={onBack} />
      <div className="report-page__notice" role="alert">
        <p className="font-18-semibold">{title}</p>
        <p className="font-14-regular">{description}</p>
      </div>
      <div className="report-page__bottom">
        <GreenButton text={action} onClick={onAction} showArrow={false} />
      </div>
    </div>
  );
}

function ReportResult({ report, result, onSelectAttempt, onBack }) {
  const [tab, setTab] = useState(REPORT_TABS[0].id);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const { attempts, overview, utterance, feedback, previous } = result;
  const isReady = Boolean(overview);
  const feedbackCount = feedback?.items.length ?? 0;
  const tabIndex = REPORT_TABS.findIndex(({ id }) => id === tab);
  const warnings = (report?.warnings ?? []).filter((code) => REPORT_WARNINGS[code]);

  const handleTabKeyDown = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = REPORT_TABS[(tabIndex + step + REPORT_TABS.length) % REPORT_TABS.length];
    setTab(next.id);
    document.getElementById(`report-tab-${next.id}`)?.focus();
  };

  return (
    <div className="report-page" aria-busy={!isReady}>
      <Header variant="back" onBack={onBack} />

      <section className="report-page__intro">
        {report ? (
          <h1 className="report-page__title font-22-bold">{report.practice_title}</h1>
        ) : (
          <span className="report-page__skeleton font-22-bold" style={{ width: "64%" }} />
        )}

        {warnings.map((code) => (
          <p key={code} className="report-page__warning font-13-regular line-height-150">
            {REPORT_WARNINGS[code]}
          </p>
        ))}
      </section>

      {report && <AttemptSelector report={report} attempts={attempts} onSelect={onSelectAttempt} />}

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
            {id === "feedback" && (
              <span
                className="report-page__badge"
                data-visible={feedbackCount > 0 || undefined}
                aria-hidden={feedbackCount === 0}
              >
                {feedbackCount}
              </span>
            )}
          </button>
        ))}
        <span className="report-page__indicator" aria-hidden="true" />
      </div>

      <main className="report-page__body">
        <section
          id="report-panel-overview"
          role="tabpanel"
          aria-labelledby="report-tab-overview"
          className="report-page__panel"
          hidden={tab !== "overview"}
        >
          {isReady ? (
            <OverviewPanel
              overview={overview}
              previousOverview={previous?.overview ?? null}
              previousAttemptNo={previous?.attemptNo ?? null}
            />
          ) : (
            <div className="report-page__loading" />
          )}
        </section>

        <section
          id="report-panel-utterance"
          role="tabpanel"
          aria-labelledby="report-tab-utterance"
          className="report-page__panel"
          hidden={tab !== "utterance"}
        >
          {utterance ? (
            <>
              <div className="report-page__toolbar">
                <button type="button" className="report-page__info font-13-medium" onClick={() => setIsGuideOpen(true)}>
                  <img src={infoIcon} alt="" />
                  보는 법
                </button>
              </div>
              <UtteranceText utterance={utterance} />
            </>
          ) : (
            <div className="report-page__loading" />
          )}
        </section>

        <section
          id="report-panel-feedback"
          role="tabpanel"
          aria-labelledby="report-tab-feedback"
          className="report-page__panel"
          hidden={tab !== "feedback"}
        >
          {feedback ? <FeedbackList items={feedback.items} /> : <div className="report-page__loading" />}
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
    </div>
  );
}
