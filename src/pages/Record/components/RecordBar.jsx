import "./RecordBar.css";

import micIcon from "../../../assets/icons/mic-icon.svg";
import retryIcon from "../../../assets/icons/retry-icon.svg";

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="2" width="3.5" height="12" rx="1" fill="#FFFFFF" />
      <rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="#FFFFFF" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 2.5V13.5L13 8L4 2.5Z" fill="#FFFFFF" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="14" height="14" rx="2" fill="#FF2D28" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5L10 17.5L19 7"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CircleButton({ tone, label, onClick, disabled = false, children }) {
  return (
    <button
      type="button"
      className={`record-bar__button record-bar__button--${tone}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {children}
    </button>
  );
}

export default function RecordBar({
  status,
  seconds,
  isBusy = false,
  canConfirm = true,
  onStart,
  onPause,
  onResume,
  onStop,
  onRetry,
  onConfirm,
}) {
  const isRecording = status === "recording";

  return (
    <div className="record-bar">
      <div className="record-bar__time">
        <span
          className={`record-bar__dot${isRecording ? " record-bar__dot--active" : ""}`}
        />
        <span
          className={`record-bar__text${isRecording ? " record-bar__text--active" : ""}`}
        >
          {formatTime(seconds)}
        </span>
      </div>

      <div className="record-bar__actions">
        {status === "idle" && (
          <CircleButton tone="main" label="녹음 시작" onClick={onStart}>
            <img src={micIcon} alt="" className="record-bar__icon" />
          </CircleButton>
        )}

        {status === "recording" && (
          <>
            <CircleButton tone="dark" label="일시정지" onClick={onPause}>
              <PauseIcon />
            </CircleButton>
            <CircleButton tone="red" label="녹음 종료" onClick={onStop}>
              <StopIcon />
            </CircleButton>
          </>
        )}

        {/* TODO: 일시정지 상태 디자인 확인 필요 (임시 UI) */}
        {status === "paused" && (
          <>
            <CircleButton tone="dark" label="이어서 녹음" onClick={onResume}>
              <PlayIcon />
            </CircleButton>
            <CircleButton tone="red" label="녹음 종료" onClick={onStop}>
              <StopIcon />
            </CircleButton>
          </>
        )}

        {status === "done" && (
          <>
            <CircleButton tone="dark" label="다시 녹음" onClick={onRetry} disabled={isBusy}>
              <img src={retryIcon} alt="" className="record-bar__icon" />
            </CircleButton>
            <CircleButton tone="main" label="녹음 완료" onClick={onConfirm} disabled={isBusy || !canConfirm}>
              <CheckIcon />
            </CircleButton>
          </>
        )}
      </div>
    </div>
  );
}
