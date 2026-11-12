import { matchPath, useLocation } from "react-router-dom";

import logo from "@/assets/images/jjo-logo.svg";
import { GUIDE_PITCH, GUIDE_SCREENS } from "@/constants/desktopGuide";

import "./DesktopGuide.css";

function formatStep(value) {
  return String(value).padStart(2, "0");
}

export default function DesktopGuide() {
  const { pathname } = useLocation();
  const index = GUIDE_SCREENS.findIndex(({ path }) => matchPath(path, pathname));
  const screen = GUIDE_SCREENS[index];

  return (
    <>
      <aside className="desktop-guide desktop-guide--left" aria-label="서비스 소개">
        <div className="desktop-guide__inner">
          <img src={logo} alt="jjo" className="desktop-guide__logo" />

          <h2 className="desktop-guide__heading font-26-bold line-height-130">
            {GUIDE_PITCH.slogan[0]}
            <br />
            <mark className="desktop-guide__highlight">{GUIDE_PITCH.slogan[1]}</mark>
          </h2>

          <p className="desktop-guide__body font-16-regular line-height-160">{GUIDE_PITCH.summary}</p>

          <dl className="desktop-guide__list">
            {GUIDE_PITCH.sections.map(({ label, text }) => (
              <div key={label} className="desktop-guide__item">
                <dt className="desktop-guide__label font-14-semibold">{label}</dt>
                <dd className="desktop-guide__text font-15-regular line-height-150">{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>

      {screen && (
        <aside className="desktop-guide desktop-guide--right" aria-label="현재 화면 설명">
          <div key={screen.path} className="desktop-guide__inner desktop-guide__inner--animated">
            <p className="desktop-guide__step font-14-semibold">
              <span className="desktop-guide__step-index">
                {formatStep(index + 1)} / {formatStep(GUIDE_SCREENS.length)}
              </span>
              {screen.label}
            </p>

            <h2 className="desktop-guide__heading font-20-bold line-height-130">{screen.title}</h2>

            <p className="desktop-guide__body font-16-regular line-height-160">{screen.description}</p>

            <dl className="desktop-guide__list">
              <div className="desktop-guide__item">
                <dt className="desktop-guide__label font-14-semibold">{screen.point.label}</dt>
                <dd className="desktop-guide__text font-15-regular line-height-150">{screen.point.text}</dd>
              </div>
            </dl>
          </div>
        </aside>
      )}
    </>
  );
}
