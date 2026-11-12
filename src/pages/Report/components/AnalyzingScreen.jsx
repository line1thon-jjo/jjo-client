import { useEffect } from "react";

import Header from "@/components/Header/Header";
import { ANALYSIS_DONE_MS } from "@/constants/report";

import "./AnalyzingScreen.css";

export default function AnalyzingScreen({ isDone = false, onDone, onBack }) {
  useEffect(() => {
    if (!isDone) return;
    const timer = setTimeout(() => onDone?.(), ANALYSIS_DONE_MS);
    return () => clearTimeout(timer);
  }, [isDone, onDone]);

  return (
    <div className="analyzing-screen" data-done={isDone || undefined}>
      <Header variant="back" onBack={onBack} />

      <div className="analyzing-screen__stage" role="status" aria-live="polite">
        <span className="analyzing-screen__glow" aria-hidden="true" />

        <p className="analyzing-screen__label font-20-bold">
          <span className="analyzing-screen__text" data-phase="analyzing" aria-hidden={isDone}>
            분석 중
          </span>
          <span className="analyzing-screen__text" data-phase="done" aria-hidden={!isDone}>
            분석 완료!
          </span>
        </p>

        <p className="analyzing-screen__hint font-14-regular">1분 녹음 기준 20~30초 정도 걸려요.</p>
      </div>
    </div>
  );
}
