import { useEffect, useState } from "react";

import BrandDescription from "@/components/BrandLayout/BrandDescription";
import BrandLayout from "@/components/BrandLayout/BrandLayout";
import { USE_MOCK } from "@/api/client";
import { preloadGoogleIdentity } from "@/auth/googleIdentity";
import { useAuth } from "@/auth/useAuth";
import { SPLASH_HOLD_MS, SPLASH_INTRO_MS } from "@/constants/splash";

import "./AppSplash.css";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function AppSplash() {
  const { isLoading, user } = useAuth();
  const [elapsed, setElapsed] = useState(() => (prefersReducedMotion() ? SPLASH_HOLD_MS : 0));
  const [hasLeft, setHasLeft] = useState(false);

  useEffect(() => {
    const timers = [SPLASH_INTRO_MS, SPLASH_HOLD_MS].map((ms) => setTimeout(() => setElapsed(ms), ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!USE_MOCK && !isLoading && !user) preloadGoogleIdentity();
  }, [isLoading, user]);

  if (hasLeft) return null;

  const isLeaving = !isLoading && elapsed >= (user ? SPLASH_HOLD_MS : SPLASH_INTRO_MS);

  return (
    <div
      className="app-splash"
      data-leaving={isLeaving || undefined}
      aria-hidden="true"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && isLeaving) setHasLeft(true);
      }}
    >
      <BrandLayout intro>
        <BrandDescription />
      </BrandLayout>
    </div>
  );
}
