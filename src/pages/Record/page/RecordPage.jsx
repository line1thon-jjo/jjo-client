import { useRef, useState } from "react";
import { m } from "motion/react";

import Header from "@/components/Header/Header";
import { EASE } from "@/lib/motion/presets";
import { getErrorMessage } from "@/api/messages";
import { createPractice, uploadRecording } from "@/api/practices";

import RecordBar from "../components/RecordBar";
import useRecorder from "../hooks/useRecorder";

import arrowRight from "@/assets/icons/arrow-right.svg";

import "./RecordPage.css";

// 대본 입력의 "녹음하기" 버튼(높이 53) → 녹음 바(높이 76), 하단 30px 고정한 채 위로만 커짐
const BUTTON_HEIGHT = 53;
const BAR_HEIGHT = 76;

const MORPH = { duration: 0.48, ease: EASE.standard };

export default function RecordPage({
  title,
  script,
  practiceId,
  onBack,
  onUploaded,
}) {
  const recorder = useRecorder();
  const { status, seconds, audioBlob, error } = recorder;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // 업로드만 실패했을 때 다시 눌러도 연습이 또 생기지 않도록 기억
  const practiceIdRef = useRef(practiceId ?? null);

  const handleBack = () => {
    if (isUploading) return;

    recorder.reset();
    onBack?.();
  };

  const handleRetry = () => {
    setUploadError(null);
    recorder.reset();
  };

  const handleConfirm = async () => {
    if (!audioBlob || isUploading) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      if (practiceIdRef.current == null) {
        const practice = await createPractice(script);
        practiceIdRef.current = practice.id;
      }

      const recording = await uploadRecording(practiceIdRef.current, audioBlob, seconds * 1000);

      onUploaded?.({
        practiceId: practiceIdRef.current,
        recordingId: recording.recording_id,
      });
    } catch (uploadFailure) {
      setUploadError(getErrorMessage(uploadFailure));
      setIsUploading(false);
    }
  };

  const message = uploadError ?? error;

  return (
    <div className="record-page">
      <Header variant="back" onBack={handleBack} />

      <main className="record-page__main">
        <h1 className="record-page__title">{title}</h1>
        <p className="record-page__script">{script}</p>
      </main>

      <div className="record-page__bottom">
        {message && <p className="record-page__error">{message}</p>}

        <m.div
          className="record-page__bar"
          initial={{
            height: BUTTON_HEIGHT,
            backgroundColor: "#d9f768",
          }}
          animate={{
            height: BAR_HEIGHT,
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
              isBusy={isUploading}
              onStart={recorder.start}
              onPause={recorder.pause}
              onResume={recorder.resume}
              onStop={recorder.stop}
              onRetry={handleRetry}
              onConfirm={handleConfirm}
            />
          </m.div>
        </m.div>
      </div>
    </div>
  );
}
