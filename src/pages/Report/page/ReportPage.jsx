import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BottomSheet from "@/components/BottomSheet/BottomSheet";
import GreenButton from "@/components/Button/GreenButton";
import Header from "@/components/Header/Header";
import UtteranceGuide from "@/pages/Report/components/UtteranceGuide";
import UtteranceText from "@/pages/Report/components/UtteranceText";
import { useReportStatus } from "@/pages/Report/hooks/useReportStatus";
import { getErrorMessage, getFailureMessage } from "@/api/messages";
import { getFeedback, getOverview, getUtterance } from "@/api/reports";
import { REPORT_TABS } from "@/constants/report";

import infoIcon from "@/assets/icons/info-icon.svg";

import "./ReportPage.css";

const EMPTY_RESULT = { overview: null, utterance: null, feedback: null, error: null };

export default function ReportPage() {
  const { recordingId } = useParams();
  return <Report key={recordingId} recordingId={recordingId} />;
}

function Report({ recordingId }) {
  const navigate = useNavigate();
  const { report, error: statusError, retry: retryStatus } = useReportStatus(recordingId);
  const [result, setResult] = useState(EMPTY_RESULT);
  const [resultRequest, setResultRequest] = useState(0);

  const isCompleted = report?.status === "COMPLETED";

  useEffect(() => {
    if (!isCompleted) return;
    const controller = new AbortController();
    const { signal } = controller;

    Promise.all([
      getOverview(recordingId, { signal }),
      getUtterance(recordingId, { signal }),
      getFeedback(recordingId, { signal }),
    ])
      .then(([overview, utterance, feedback]) => {
        if (!signal.aborted) setResult({ overview, utterance, feedback, error: null });
      })
      .catch((error) => {
        if (!signal.aborted) setResult({ ...EMPTY_RESULT, error });
      });

    return () => controller.abort();
  }, [recordingId, isCompleted, resultRequest]);

  const handleBack = () => navigate("/");

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

  if (report && !isCompleted) {
    return (
      <ReportNotice
        title="녹음을 분석하고 있어요."
        description="1분 녹음 기준 20~30초 정도 걸려요."
        isBusy
        onBack={handleBack}
      />
    );
  }

  return <ReportResult result={result} onBack={handleBack} />;
}

function ReportNotice({ title, description, action, onAction, isBusy = false, onBack }) {
  return (
    <div className="report-page">
      <Header variant="back" onBack={onBack} />
      <div className="report-page__notice" role={isBusy ? "status" : "alert"} aria-busy={isBusy}>
        {isBusy && (
          <span className="report-page__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        )}
        <p className="font-18-semibold">{title}</p>
        <p className="font-14-regular">{description}</p>
      </div>
      {action && (
        <div className="report-page__bottom">
          <GreenButton text={action} onClick={onAction} showArrow={false} />
        </div>
      )}
    </div>
  );
}

function ReportResult({ result, onBack }) {
  const [tab, setTab] = useState("utterance");
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const { overview, utterance, feedback } = result;
  const feedbackCount = feedback?.items.length ?? 0;
  const tabIndex = REPORT_TABS.findIndex(({ id }) => id === tab);

  const handleTabKeyDown = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = REPORT_TABS[(tabIndex + step + REPORT_TABS.length) % REPORT_TABS.length];
    setTab(next.id);
    document.getElementById(`report-tab-${next.id}`)?.focus();
  };

  return (
    <div className="report-page">
      <Header variant="back" onBack={onBack} />

      {overview ? (
        <section className="report-page__summary">
          <h1 className="report-page__headline font-22-regular">
            {overview.summary.headline}
            <strong className="font-22-bold">{overview.summary.footer}</strong>
          </h1>
        </section>
      ) : (
        <section className="report-page__summary" aria-busy="true">
          <div className="report-page__headline font-22-regular">
            <span className="report-page__skeleton" style={{ width: "62%" }} />
            <span className="report-page__skeleton" style={{ width: "88%" }} />
          </div>
        </section>
      )}

      <div
        className="report-page__tabs"
        role="tablist"
        style={{ "--tab-index": tabIndex }}
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
            <div className="report-page__loading" aria-busy="true" />
          )}
        </section>

        <section
          id="report-panel-feedback"
          role="tabpanel"
          aria-labelledby="report-tab-feedback"
          className="report-page__panel"
          hidden={tab !== "feedback"}
        >
          <p className="report-page__placeholder font-15-medium">AI 피드백은 준비 중이에요.</p>
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
