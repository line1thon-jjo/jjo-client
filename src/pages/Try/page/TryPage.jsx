import { useEffect, useRef } from "react";

import { STORAGE_KEYS } from "@/constants/storage";

// QR 입장 경로: /try#token=<토큰>&exp=<만료시각(ms)>
function readTryToken(hash) {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const token = params.get("token");
  const expiresAt = Number(params.get("exp"));

  if (!token || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;
  return { token, expiresAt };
}

function saveAccessToken(saved) {
  try {
    localStorage.setItem(STORAGE_KEYS.accessToken, JSON.stringify(saved));
    return true;
  } catch {
    return false;
  }
}

export default function TryPage() {
  const handledRef = useRef(false);

  useEffect(() => {
    // StrictMode에서 effect가 두 번 실행돼도 한 번만 처리
    if (handledRef.current) return;
    handledRef.current = true;

    const saved = readTryToken(window.location.hash);

    // 주소창에서 토큰 지우기
    window.history.replaceState(null, "", window.location.pathname);

    if (!saved || !saveAccessToken(saved)) {
      window.location.replace("/login");
      return;
    }

    // 로그인 상태는 앱이 처음 켜질 때 한 번만 확인하므로
    // 페이지를 새로 불러와야 저장한 토큰으로 로그인된 상태가 됨
    window.location.replace("/onboarding");
  }, []);

  return null;
}
