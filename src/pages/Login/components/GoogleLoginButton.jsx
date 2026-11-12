import { useEffect, useRef } from "react";

import { USE_MOCK } from "@/api/client";
import { loadGoogleIdentity, onGoogleCredential } from "@/auth/googleIdentity";
import { GOOGLE_BUTTON_MAX_WIDTH, GOOGLE_BUTTON_OPTIONS } from "@/constants/google";

import googleLogo from "@/assets/icons/google-logo.svg";

import "./GoogleLoginButton.css";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleLoginButton({ onCredential, onError, loading = false }) {
  const label = <span className="font-15-semibold">{loading ? "로그인 중" : "Google로 시작하기"}</span>;
  const logo = <img src={googleLogo} alt="" className="google-login-button__logo" />;

  if (USE_MOCK) {
    return (
      <button
        type="button"
        className="google-login-button"
        onClick={() => onCredential()}
        disabled={loading}
        aria-busy={loading}
      >
        {logo}
        {label}
      </button>
    );
  }

  return (
    <GoogleIdentityButton onCredential={onCredential} onError={onError} loading={loading}>
      {logo}
      {label}
    </GoogleIdentityButton>
  );
}

function GoogleIdentityButton({ onCredential, onError, loading, children }) {
  const overlayRef = useRef(null);
  const slotRef = useRef(null);

  useEffect(() => onGoogleCredential(onCredential), [onCredential]);

  useEffect(() => {
    let isActive = true;
    let observer;

    loadGoogleIdentity(CLIENT_ID)
      .then((identity) => {
        if (!isActive) return;
        const overlay = overlayRef.current;

        const render = () => {
          const width = Math.min(overlay.clientWidth, GOOGLE_BUTTON_MAX_WIDTH);
          identity.renderButton(slotRef.current, { ...GOOGLE_BUTTON_OPTIONS, width });
          overlay.style.setProperty("--google-scale-x", overlay.clientWidth / width);
          overlay.style.setProperty("--google-scale-y", overlay.clientHeight / (slotRef.current.offsetHeight || 40));
        };

        render();
        observer = new ResizeObserver(render);
        observer.observe(overlay);
      })
      .catch((error) => {
        if (isActive) onError?.(error);
      });

    return () => {
      isActive = false;
      observer?.disconnect();
    };
  }, [onError]);

  return (
    <div className="google-login-button" data-loading={loading || undefined} aria-busy={loading}>
      <span className="google-login-button__face" aria-hidden="true">
        {children}
      </span>
      <div ref={overlayRef} className="google-login-button__overlay">
        <div ref={slotRef} className="google-login-button__slot" />
      </div>
    </div>
  );
}
