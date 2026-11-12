import * as m from "motion/react-m";

import { activeState, drawX, fadeUp, growWidth, stretchX } from "@/lib/motion/presets";

import "./OnboardingDemos.css";

const stretch = stretchX(1.9);
const pause = growWidth(54);

export function IntonationDemo({ active }) {
  return (
    <m.p
      className="onboarding-demo onboarding-demo--intonation"
      aria-label="나의 말투"
      initial="off"
      animate={activeState(active)}
    >
      <span aria-hidden="true">나의</span>
      <span aria-hidden="true" className="onboarding-demo__word">
        말
        <m.span className="onboarding-demo__stretch" variants={stretch} custom={0.24}>
          투
        </m.span>
      </span>
    </m.p>
  );
}

export function BreathDemo({ active }) {
  return (
    <m.div
      className="onboarding-demo onboarding-demo--breath"
      aria-label="천천히 또렷하게. 또렷과 하게 사이에서 0.8초 쉼"
      initial="off"
      animate={activeState(active)}
    >
      <p aria-hidden="true">천천히</p>
      <p aria-hidden="true" className="onboarding-demo__fast-line">
        또렷
        <m.span className="onboarding-demo__pause" variants={pause} custom={0.24}>
          <span className="onboarding-demo__pause-label">0.8초</span>
        </m.span>
        하게
        <m.span className="onboarding-demo__underline" variants={drawX} custom={0.72} />
      </p>
    </m.div>
  );
}

export function RetryDemo({ active }) {
  return (
    <m.dl className="onboarding-demo onboarding-demo--retry" initial="off" animate={activeState(active)}>
      <div className="onboarding-demo__row">
        <dt>이전</dt>
        <dd>빠르게 지나갔어요</dd>
      </div>
      <m.div className="onboarding-demo__row onboarding-demo__row--now" variants={fadeUp} custom={0.48}>
        <dt>지금</dt>
        <dd>천천히 강조했어요</dd>
      </m.div>
    </m.dl>
  );
}
