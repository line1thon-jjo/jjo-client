import { useCallback, useEffect, useRef, useState } from "react";

import { getAudioUrl } from "@/api/reports";

const REFRESH_AFTER_MS = 60_000;
const IDLE = { range: null, position: -1 };

export function useAudioPlayer(recordingId) {
  const audioRef = useRef(null);
  const rangeRef = useRef(null);
  const frameRef = useRef(0);
  const [status, setStatus] = useState("loading");
  const [playback, setPlayback] = useState(IDLE);
  const [request, setRequest] = useState(0);

  const stop = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    audioRef.current?.pause();
    rangeRef.current = null;
    setPlayback(IDLE);
  }, []);

  useEffect(() => {
    if (!recordingId) return;

    const controller = new AbortController();
    const audio = new Audio();
    const fetchedAt = Date.now();
    audio.preload = "auto";

    const handleError = () => {
      stop();
      audioRef.current = null;

      if (Date.now() - fetchedAt > REFRESH_AFTER_MS) {
        setStatus("loading");
        setRequest((count) => count + 1);
      } else {
        setStatus("unavailable");
      }
    };

    audio.addEventListener("error", handleError);

    getAudioUrl(recordingId, { signal: controller.signal })
      .then(({ audio_url }) => {
        if (controller.signal.aborted) return;
        audio.src = audio_url;
        audioRef.current = audio;
        setStatus("ready");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("unavailable");
      });

    return () => {
      controller.abort();
      cancelAnimationFrame(frameRef.current);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
      rangeRef.current = null;
    };
  }, [recordingId, request, stop]);

  const play = useCallback(
    (range, locate) => {
      const audio = audioRef.current;
      if (!audio) return;

      cancelAnimationFrame(frameRef.current);
      rangeRef.current = range;

      const seek = () => {
        if (rangeRef.current === range) audio.currentTime = range.start_ms / 1000;
      };

      if (audio.readyState >= 1) seek();
      else audio.addEventListener("loadedmetadata", seek, { once: true });

      const tick = () => {
        if (rangeRef.current !== range) return;

        const timeMs = audio.currentTime * 1000;
        if (audio.ended || timeMs >= range.end_ms) {
          stop();
          return;
        }

        const position = locate ? locate(Math.max(timeMs, range.start_ms)) : -1;
        setPlayback((current) =>
          current.range === range && current.position === position ? current : { range, position },
        );
        frameRef.current = requestAnimationFrame(tick);
      };

      setPlayback({ range, position: locate ? locate(range.start_ms) : -1 });
      frameRef.current = requestAnimationFrame(tick);

      audio.play().catch(() => {
        if (rangeRef.current === range) stop();
      });
    },
    [stop],
  );

  const toggle = useCallback(
    (range, locate) => {
      if (rangeRef.current === range) stop();
      else play(range, locate);
    },
    [play, stop],
  );

  return {
    isAvailable: status === "ready",
    playing: playback.range,
    position: playback.position,
    toggle,
    stop,
  };
}
