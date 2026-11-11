import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

import { TRANSITION } from "./presets";

export default function MotionProvider({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={TRANSITION.base}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
