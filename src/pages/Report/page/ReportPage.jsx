import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BottomSheet from "@/components/BottomSheet/BottomSheet";
import GreenButton from "@/components/Button/GreenButton";
import Header from "@/components/Header/Header";
import UtteranceGuide from "@/pages/Report/components/UtteranceGuide";
import UtteranceText from "@/pages/Report/components/UtteranceText";
import { getOverview, getUtterance } from "@/api/reports";

import infoIcon from "@/assets/icons/info-icon.svg";

import "./ReportPage.css";

const TABS = [
  { id: "utterance", label: "발화 분석" },
  { id: "feedback", label: "AI 피드백" },
];

export default function ReportPage() {
  const { recordingId } = useParams();
  return <Report key={recordingId} recordingId={recordingId} />;
}

function Report({ recordingId }) {
  const navigate = useNavigate();
  const [report, setReport] = useState({ status: "loading", overview: null, utterance: null });
  const [attempt, setAttempt] = useState(0);
  const [tab, setTab] = useState("utterance");
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    let isActive = true;

    Promise.all([getOverview(recordingId), getUtterance(recordingId)])
      .then(([overview, utterance]) => {
        if (isActive) setReport({ status: "ready", overview, utterance });
      })
      .catch(() => {
        if (isActive) setReport({ status: "error", overview: null, utterance: null });
      });

    return () => {
      isActive = false;
    };
  }, [recordingId, attempt]);

  const handleRetry = () => {
    setReport({ status: "loading", overview: null, utterance: null });
    setAttempt((count) => count + 1);
  };

  const handleTabKeyDown = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const index = TABS.findIndex(({ id }) => id === tab);
    const next = TABS[(index + (event.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length];
    setTab(next.id);
    document.getElementById(`report-tab-${next.id}`)?.focus();
  };

  const { status, overview, utterance } = report;
  const feedbackCount = overview?.feedback_count ?? 0;

  if (status === "error") {
    return (
      <div className="report-page">
        <Header variant="back" onBack={() => navigate("/")} />
        <div className="report-page__error" role="alert">
          <p className="font-18-semibold">결과를 불러오지 못했어요.</p>
          <p className="font-14-regular">잠시 후 다시 시도해 주세요.</p>
        </div>
        <div className="report-page__bottom">
          <GreenButton text="다시 불러오기" onClick={handleRetry} showArrow={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="report-page">
      <Header variant="back" onBack={() => navigate("/")} />

      {overview ? (
        <section className="report-page__summary">
          <h1 className="report-page__headline font-22-regular">
            {overview.headline.lead}
            <strong className="font-22-bold">{overview.headline.focus}</strong>
          </h1>
          <p className="report-page__description font-14-regular">{overview.summary}</p>
        </section>
      ) : (
        <section className="report-page__summary" aria-busy="true">
          <div className="report-page__headline font-22-regular">
            <span className="report-page__skeleton" style={{ width: "62%" }} />
            <span className="report-page__skeleton" style={{ width: "88%" }} />
          </div>
          <span className="report-page__skeleton font-14-regular" style={{ width: "70%" }} />
        </section>
      )}

      <div
        className="report-page__tabs"
        role="tablist"
        style={{ "--tab-index": TABS.findIndex(({ id }) => id === tab) }}
        onKeyDown={handleTabKeyDown}
      >
        {TABS.map(({ id, label }) => (
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
