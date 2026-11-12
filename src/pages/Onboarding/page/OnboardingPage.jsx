import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as m from "motion/react-m";

import GreenButton from "@/components/Button/GreenButton";
import PageIndicator from "@/pages/Onboarding/components/PageIndicator";
import { BreathDemo, IntonationDemo, RetryDemo } from "@/pages/Onboarding/components/OnboardingDemos";
import { NEXT_STEP_PATH } from "@/auth/AuthContext";
import { useAuth } from "@/auth/useAuth";
import { activeState, pop } from "@/lib/motion/presets";

import "./OnboardingPage.css";

const SLIDES = [
  {
    title: "말투가 글자 모양으로 보여요",
    description: "높게 말한 글자는 위로,\n길게 늘인 음절은 가로로 길어져요.",
    Demo: IntonationDemo,
  },
  {
    title: "쉼과 속도도 놓치지 않아요",
    description: "숨을 쉰 위치는 간격으로,\n평소보다 빠르거나 느린 구절은 밑줄로 보여요.",
    Demo: BreathDemo,
  },
  {
    title: "한 곳씩 바꾸며 다시 말해요",
    description: "가장 먼저 연습할 구간을 듣고,\n같은 대본으로 다시 녹음해 비교하세요.",
    Demo: RetryDemo,
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();
  const track = useRef(null);
  const [current, setCurrent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLast = current === SLIDES.length - 1;

  const handleScroll = () => {
    const { scrollLeft, clientWidth } = track.current;
    setCurrent(Math.round(scrollLeft / clientWidth));
  };

  const goTo = (index) => {
    const { clientWidth } = track.current;
    track.current.scrollTo({ left: index * clientWidth, behavior: "smooth" });
  };

  const handleFinish = async () => {
    setIsSubmitting(true);

    try {
      const nextStep = await completeOnboarding();
      navigate(NEXT_STEP_PATH[nextStep], { replace: true });
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="onboarding-page">
      <header className="onboarding-page__header">
        <button
          type="button"
          className="onboarding-page__skip font-14-medium"
          onClick={handleFinish}
          disabled={isSubmitting}
          data-hidden={isLast}
        >
          건너뛰기
        </button>
      </header>

      <main ref={track} className="onboarding-page__track" onScroll={handleScroll}>
        {SLIDES.map(({ title, description, Demo }, index) => (
          <section
            key={title}
            className="onboarding-page__slide"
            data-active={index === current}
            aria-hidden={index !== current}
            aria-label={`${index + 1} / ${SLIDES.length}`}
          >
            <div className="onboarding-page__visual">
              <m.div
                className="onboarding-page__glow"
                aria-hidden="true"
                initial="off"
                animate={activeState(index === current)}
                variants={pop}
              />
              <Demo active={index === current} />
            </div>

            <div className="onboarding-page__text">
              <h1 className="onboarding-page__title font-26-bold">{title}</h1>
              <p className="onboarding-page__description font-14-regular line-height-150">{description}</p>
            </div>
          </section>
        ))}
      </main>

      <div className="onboarding-page__bottom">
        <PageIndicator count={SLIDES.length} current={current} onSelect={goTo} />

        <GreenButton
          text={isLast ? "시작하기" : "다음"}
          onClick={isLast ? handleFinish : () => goTo(current + 1)}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
