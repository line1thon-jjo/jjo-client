import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomSheet from "@/components/BottomSheet/BottomSheet";
import BrandLayout from "@/components/BrandLayout/BrandLayout";
import GreenButton from "@/components/Button/GreenButton";
import TermsAgreement from "@/pages/Terms/components/TermsAgreement";
import TermsContent from "@/pages/Terms/components/TermsContent";
import { TERMS } from "@/pages/Terms/data/terms";
import { NEXT_STEP_PATH } from "@/auth/AuthContext";
import { useAuth } from "@/auth/useAuth";

import "./TermsPage.css";

export default function TermsPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [agreements, setAgreements] = useState({});
  const [sheetTermId, setSheetTermId] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const canStart = TERMS.filter((term) => term.required).every((term) => agreements[term.id]);
  const sheetTerm = TERMS.find((term) => term.id === sheetTermId);

  const handleOpenTerm = (id) => {
    setSheetTermId(id);
    setIsSheetOpen(true);
  };

  const handleAgreeTerm = () => {
    setAgreements((current) => ({ ...current, [sheetTermId]: true }));
    setIsSheetOpen(false);
  };

  const handleStart = async () => {
    setIsSubmitting(true);
    setHasError(false);

    try {
      const nextStep = await signup({
        service_terms: Boolean(agreements.service),
        privacy_collection_use: Boolean(agreements.privacy),
        marketing: Boolean(agreements.marketing),
      });
      navigate(NEXT_STEP_PATH[nextStep], { replace: true });
    } catch {
      setHasError(true);
      setIsSubmitting(false);
    }
  };

  return (
    <BrandLayout
      footer={
        <GreenButton
          text={isSubmitting ? "가입 중" : "시작하기"}
          onClick={handleStart}
          disabled={!canStart || isSubmitting}
        />
      }
    >
      <div className="terms-page__agreement">
        <TermsAgreement terms={TERMS} agreements={agreements} onChange={setAgreements} onOpenTerm={handleOpenTerm} />
      </div>

      {hasError && (
        <p className="terms-page__error font-14-medium" role="alert">
          가입하지 못했어요. 다시 시도해 주세요.
        </p>
      )}

      <BottomSheet
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title={sheetTerm && `[${sheetTerm.required ? "필수" : "선택"}] ${sheetTerm.label}`}
        footer={<GreenButton text="동의하기" onClick={handleAgreeTerm} showArrow={false} />}
      >
        {sheetTerm && <TermsContent sections={sheetTerm.sections} />}
      </BottomSheet>
    </BrandLayout>
  );
}
