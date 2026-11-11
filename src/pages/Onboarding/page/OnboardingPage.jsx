import { useState } from "react";
import { useNavigate } from "react-router-dom";

import GreenButton from "../../../components/Button/GreenButton";
import TermsAgreement from "../components/TermsAgreement";

import logo from "../../../assets/images/jjo-logo-large.svg";

import "./OnboardingPage.css";

const TERMS = [
  { id: "service", label: "서비스 이용약관", required: true },
  { id: "privacy", label: "개인정보 수집 및 이용", required: true },
  { id: "marketing", label: "서비스 소식 받기", required: false },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState({});

  const canStart = TERMS.filter((term) => term.required).every((term) => agreements[term.id]);

  const handleStart = () => {
    navigate("/");
  };

  return (
    <div className="onboarding-page">
      <main className="onboarding-page__main">
        <div className="onboarding-page__brand">
          <img src={logo} alt="jjo" className="onboarding-page__logo" />
          <div className="onboarding-page__accent" aria-hidden="true" />
        </div>

        <h1 className="onboarding-page__title font-20-semibold">내가 몰랐던 내 말버릇까지</h1>

        <TermsAgreement terms={TERMS} agreements={agreements} onChange={setAgreements} />
      </main>

      <div className="onboarding-page__bottom">
        <GreenButton text="시작하기" onClick={handleStart} disabled={!canStart} />
      </div>
    </div>
  );
}
