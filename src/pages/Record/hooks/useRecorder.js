import { useEffect, useRef, useState } from "react";

import { RECORD_MAX_MS, RECORD_TICK_MS } from "@/constants/record";

// status: "idle" | "recording" | "paused" | "done"
export default function useRecorder() {
  const [status, setStatus] = useState("idle");
  const [seconds, setSeconds] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [reachedLimit, setReachedLimit] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const limitRef = useRef(null);
  const elapsedRef = useRef(0);
  const runStartRef = useRef(null);

  const elapsedMs = () =>
    elapsedRef.current + (runStartRef.current === null ? 0 : performance.now() - runStartRef.current);

  const stopTimer = () => {
    clearInterval(timerRef.current);
    clearTimeout(limitRef.current);
    elapsedRef.current = elapsedMs();
    runStartRef.current = null;
  };

  const finish = (hitLimit = false) => {
    if (!recorderRef.current || recorderRef.current.state === "inactive") return;

    stopTimer();
    setReachedLimit(hitLimit);
    recorderRef.current.stop();
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    clearTimeout(limitRef.current);
    runStartRef.current = performance.now();
    limitRef.current = setTimeout(() => finish(true), Math.max(0, RECORD_MAX_MS - elapsedRef.current));
    timerRef.current = setInterval(() => {
      const elapsed = elapsedMs();
      if (elapsed >= RECORD_MAX_MS) {
        finish(true);
        return;
      }
      setSeconds(Math.floor(elapsed / 1000));
    }, RECORD_TICK_MS);
  };

  const releaseStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const killRecorder = () => {
    const recorder = recorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = null;
      recorder.stop();
    }

    recorderRef.current = null;
    chunksRef.current = [];
  };

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        stopTimer();
        setSeconds(Math.floor(elapsedRef.current / 1000));
        setDurationMs(Math.round(elapsedRef.current));
        setAudioBlob(new Blob(chunksRef.current, { type: recorder.mimeType }));
        setStatus("done");
        releaseStream();
      };

      recorder.start();
      recorderRef.current = recorder;

      elapsedRef.current = 0;
      setError(null);
      setAudioBlob(null);
      setSeconds(0);
      setDurationMs(0);
      setReachedLimit(false);
      setStatus("recording");
      startTimer();
    } catch {
      setError("마이크 권한을 허용해주세요.");
      releaseStream();
    }
  };

  const pause = () => {
    if (recorderRef.current?.state !== "recording") return;

    recorderRef.current.pause();
    stopTimer();
    setStatus("paused");
  };

  const resume = () => {
    if (recorderRef.current?.state !== "paused") return;

    recorderRef.current.resume();
    startTimer();
    setStatus("recording");
  };

  const stop = () => finish();

  // 녹음 버리고 처음 상태로 (다시 녹음, 뒤로 가기)
  const reset = () => {
    stopTimer();
    killRecorder();
    releaseStream();

    elapsedRef.current = 0;
    setAudioBlob(null);
    setSeconds(0);
    setDurationMs(0);
    setReachedLimit(false);
    setError(null);
    setStatus("idle");
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(limitRef.current);
      killRecorder();
      releaseStream();
    };
  }, []);

  return {
    status,
    seconds,
    durationMs,
    reachedLimit,
    audioBlob,
    error,
    start,
    pause,
    resume,
    stop,
    reset,
  };
}
