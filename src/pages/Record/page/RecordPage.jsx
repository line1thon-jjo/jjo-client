import { useState } from "react";
import { m } from "motion/react";

import Header from "@/components/Header/Header";
import { EASE } from "@/lib/motion/presets";
import { getErrorMessage } from "@/api/messages";
import { uploadRecording } from "@/api/practices";
import { RECORD_MESSAGES, RECORD_MIN_MS } from "@/constants/record";

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
  const { status, seconds, durationMs, reachedLimit, audioBlob, error } = recorder;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const isTooShort = status === "done" && durationMs < RECORD_MIN_MS;

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
    if (!audioBlob || isUploading || isTooShort) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const recording = await uploadRecording(practiceId, audioBlob, durationMs);

      onUploaded?.({
        practiceId,
        recordingId: recording.recording_id,
      });
    } catch (uploadFailure) {
      setUploadError(getErrorMessage(uploadFailure));
      setIsUploading(false);
    }
  };

  const failure = uploadError ?? error ?? (isTooShort ? RECORD_MESSAGES.tooShort : null);
  const notice = status === "done" && reachedLimit ? RECORD_MESSAGES.reachedLimit : null;

  return (
    <div className="record-page">
      <Header variant="back" onBack={handleBack} />

      <main className="record-page__main">
        <h1 className="record-page__title">{title}</h1>
        <p className="record-page__script">{script}</p>
      </main>

      <div className="record-page__bottom">
        {failure ? (
          <p className="record-page__error" role="alert">
            {failure}
          </p>
        ) : (
          notice && <p className="record-page__error record-page__error--notice">{notice}</p>
        )}

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
              canConfirm={!isTooShort}
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
