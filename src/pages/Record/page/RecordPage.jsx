import { m } from "motion/react";

import Header from "../../../components/Header/Header";
import { EASE } from "../../../lib/motion/presets";

import RecordBar from "../components/RecordBar";
import useRecorder from "../hooks/useRecorder";

import arrowRight from "../../../assets/icons/arrow-right.svg";

import "./RecordPage.css";

// 대본 입력의 "녹음하기" 버튼(높이 53, 하단 54) → 녹음 바(높이 76, 하단 30)
const BUTTON_HEIGHT = 53;
const BAR_HEIGHT = 76;
const BUTTON_BOTTOM_GAP = 54;
const BAR_BOTTOM_GAP = 30;

const MORPH = { duration: 0.48, ease: EASE.standard };

export default function RecordPage({
  title,
  script,
  onBack,
  onComplete,
}) {
  const recorder = useRecorder();
  const { status, seconds, audioBlob, error } = recorder;

  const handleBack = () => {
    recorder.reset();
    onBack?.();
  };

  const handleConfirm = () => {
    if (!audioBlob) return;

    const recordingData = { title, script, audioBlob, durationSec: seconds };

    if (onComplete) {
      onComplete(recordingData);
    } else {
      console.log("분석 화면으로 전달할 데이터:", recordingData);
    }
  };

  return (
    <div className="record-page">
      <Header variant="back" onBack={handleBack} />

      <main className="record-page__main">
        <h1 className="record-page__title">{title}</h1>
        <p className="record-page__script">{script}</p>
      </main>

      <div className="record-page__bottom">
        {error && <p className="record-page__error">{error}</p>}

        <m.div
          className="record-page__bar"
          initial={{
            height: BUTTON_HEIGHT,
            marginBottom: BUTTON_BOTTOM_GAP - BAR_BOTTOM_GAP,
            backgroundColor: "#d9f768",
          }}
          animate={{
            height: BAR_HEIGHT,
            marginBottom: 0,
            backgroundColor: "#000000",
          }}
          transition={MORPH}
        >
          <m.div
            className="record-page__bar-ghost"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: EASE.standard }}
            aria-hidden="true"
          >
            <span>녹음하기</span>
            <img src={arrowRight} alt="" className="record-page__bar-ghost-icon" />
          </m.div>

          <m.div
            className="record-page__bar-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.24, ease: EASE.standard, delay: 0.28 }}
          >
            <RecordBar
              status={status}
              seconds={seconds}
              onStart={recorder.start}
              onPause={recorder.pause}
              onResume={recorder.resume}
              onStop={recorder.stop}
              onRetry={recorder.reset}
              onConfirm={handleConfirm}
            />
          </m.div>
        </m.div>
      </div>
    </div>
  );
}
