import { useEffect, useRef, useState } from "react";

// status: "idle" | "recording" | "paused" | "done"
export default function useRecorder() {
  const [status, setStatus] = useState("idle");
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
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
        setAudioBlob(new Blob(chunksRef.current, { type: recorder.mimeType }));
        setStatus("done");
        releaseStream();
      };

      recorder.start();
      recorderRef.current = recorder;

      setError(null);
      setAudioBlob(null);
      setSeconds(0);
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

  const stop = () => {
    if (!recorderRef.current || recorderRef.current.state === "inactive") return;

    stopTimer();
    recorderRef.current.stop();
  };

  // 녹음 버리고 처음 상태로 (다시 녹음, 뒤로 가기)
  const reset = () => {
    stopTimer();
    killRecorder();
    releaseStream();

    setAudioBlob(null);
    setSeconds(0);
    setError(null);
    setStatus("idle");
  };

  useEffect(() => {
    return () => {
      stopTimer();
      killRecorder();
      releaseStream();
    };
  }, []);

  return {
    status,
    seconds,
    audioBlob,
    error,
    start,
    pause,
    resume,
    stop,
    reset,
  };
}
