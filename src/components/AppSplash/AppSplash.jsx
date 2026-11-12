import { useEffect, useState } from "react";

import BrandDescription from "@/components/BrandLayout/BrandDescription";
import BrandLayout from "@/components/BrandLayout/BrandLayout";
import { useAuth } from "@/auth/useAuth";
import { SPLASH_HOLD_MS } from "@/constants/splash";

import "./AppSplash.css";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function AppSplash() {
  const { isLoading } = useAuth();
  const [isHolding, setIsHolding] = useState(() => !prefersReducedMotion());
  const [hasLeft, setHasLeft] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsHolding(false), SPLASH_HOLD_MS);
    return () => clearTimeout(timer);
  }, []);

  if (hasLeft) return null;

  const isLeaving = !isLoading && !isHolding;

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
