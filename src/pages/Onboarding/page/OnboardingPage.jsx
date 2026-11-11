import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomSheet from "../../../components/BottomSheet/BottomSheet";
import GreenButton from "../../../components/Button/GreenButton";
import TermsAgreement from "../components/TermsAgreement";
import TermsContent from "../components/TermsContent";
import { TERMS } from "../data/terms";

import logo from "../../../assets/images/jjo-logo-large.svg";

import "./OnboardingPage.css";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState({});
  const [sheetTermId, setSheetTermId] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const canStart = TERMS.filter((term) => term.required).every((term) => agreements[term.id]);
  const sheetTerm = TERMS.find((term) => term.id === sheetTermId);

  const handleOpenTerm = (id) => {
    setSheetTermId(id);
    setIsSheetOpen(true);
  };

  const handleCloseTerm = () => {
    setIsSheetOpen(false);
  };

  const handleAgreeTerm = () => {
    setAgreements((current) => ({ ...current, [sheetTermId]: true }));
    setIsSheetOpen(false);
  };

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

        <TermsAgreement terms={TERMS} agreements={agreements} onChange={setAgreements} onOpenTerm={handleOpenTerm} />
      </main>

      <div className="onboarding-page__bottom">
        <GreenButton text="시작하기" onClick={handleStart} disabled={!canStart} />
      </div>

      <BottomSheet
        open={isSheetOpen}
        onClose={handleCloseTerm}
        title={sheetTerm && `[${sheetTerm.required ? "필수" : "선택"}] ${sheetTerm.label}`}
        footer={<GreenButton text="동의하기" onClick={handleAgreeTerm} showArrow={false} />}
      >
        {sheetTerm && <TermsContent sections={sheetTerm.sections} />}
      </BottomSheet>
    </div>
  );
}
