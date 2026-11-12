import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomSheet from "@/components/BottomSheet/BottomSheet";
import GreenButton from "@/components/Button/GreenButton";
import Header from "@/components/Header/Header";
import TermsContent from "@/pages/Terms/components/TermsContent";
import { TERMS } from "@/pages/Terms/data/terms";
import { getErrorMessage } from "@/api/messages";
import { useAuth } from "@/auth/useAuth";

import chevronRight from "@/assets/icons/chevron-right.svg";

import "./SettingsPage.css";

const DOCUMENTS = TERMS.filter((term) => term.required);

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout, withdraw } = useAuth();
  const [openTermId, setOpenTermId] = useState(null);
  const [lastTermId, setLastTermId] = useState(null);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState(null);

  const openTerm = DOCUMENTS.find(({ id }) => id === (openTermId ?? lastTermId));

  const handleOpenTerm = (id) => {
    setOpenTermId(id);
    setLastTermId(id);
  };

  const handleCloseWithdraw = () => {
    if (isWithdrawing) return;
    setIsWithdrawOpen(false);
    setWithdrawError(null);
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    setWithdrawError(null);
    try {
      await withdraw();
    } catch (error) {
      setWithdrawError(getErrorMessage(error));
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="settings-page">
      <Header variant="back" onBack={() => navigate(-1)} showMenu={false} />

      <main className="settings-page__main">
        <section className="settings-page__account" aria-label="내 계정">
          {user.profile_image_url ? (
            <img className="settings-page__avatar" src={user.profile_image_url} alt="" referrerPolicy="no-referrer" />
          ) : (
            <span className="settings-page__avatar font-20-semibold" aria-hidden="true">
              {user.name.slice(0, 1)}
            </span>
          )}
          <div className="settings-page__identity">
            <p className="settings-page__name font-18-semibold">{user.name}</p>
            <p className="settings-page__email font-14-regular">{user.email}</p>
          </div>
        </section>

        <ul className="settings-page__list">
          {DOCUMENTS.map(({ id, label }) => (
            <li key={id}>
              <button type="button" className="settings-page__row font-16-medium" onClick={() => handleOpenTerm(id)}>
                {label}
                <img src={chevronRight} alt="" />
              </button>
            </li>
          ))}
          <li>
            <button type="button" className="settings-page__row font-16-medium" onClick={logout}>
              로그아웃
            </button>
          </li>
        </ul>

        <button
          type="button"
          className="settings-page__withdraw font-14-regular"
          onClick={() => setIsWithdrawOpen(true)}
        >
          회원 탈퇴
        </button>
      </main>

      <BottomSheet open={Boolean(openTermId)} onClose={() => setOpenTermId(null)} title={openTerm?.label}>
        {openTerm && <TermsContent sections={openTerm.sections} />}
      </BottomSheet>

      <BottomSheet
        open={isWithdrawOpen}
        onClose={handleCloseWithdraw}
        title="정말 탈퇴할까요?"
        footer={
          <div className="settings-page__sheet-actions">
            <GreenButton text="계속 쓸게요" onClick={handleCloseWithdraw} showArrow={false} disabled={isWithdrawing} />
            <button
              type="button"
              className="settings-page__confirm font-16-medium"
              onClick={handleWithdraw}
              disabled={isWithdrawing}
            >
              {isWithdrawing ? "탈퇴하는 중" : "탈퇴하기"}
            </button>
          </div>
        }
      >
        <p className="settings-page__sheet-text font-16-regular line-height-160">
          연습 기록과 녹음, 분석 결과가 모두 삭제돼요. 삭제한 내용은 되돌릴 수 없어요.
        </p>
        {withdrawError && (
          <p className="settings-page__error font-14-regular" role="alert">
            {withdrawError}
          </p>
        )}
      </BottomSheet>
    </div>
  );
}
