import { useEffect, useRef, useState } from "react";

import BottomSheet from "@/components/BottomSheet/BottomSheet";
import GreenButton from "@/components/Button/GreenButton";
import TermsContent from "@/pages/Terms/components/TermsContent";
import { TERMS } from "@/pages/Terms/data/terms";
import { getErrorMessage } from "@/api/messages";
import { useAuth } from "@/auth/useAuth";

import chevronRight from "@/assets/icons/chevron-right.svg";
import logo from "@/assets/images/jjo-logo.svg";

import "./MenuPanel.css";

const DOCUMENTS = TERMS.filter((term) => term.required);

export default function MenuPanel({ open, onClose }) {
  const { user, logout, withdraw } = useAuth();
  const [isRendered, setIsRendered] = useState(open);
  const [openTermId, setOpenTermId] = useState(null);
  const [lastTermId, setLastTermId] = useState(null);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState(null);
  const panel = useRef(null);
  const onCloseRef = useRef(onClose);
  const hasSheet = Boolean(openTermId) || isWithdrawOpen;

  if (open && !isRendered) {
    setIsRendered(true);
  }

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open || hasSheet) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onCloseRef.current();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, hasSheet]);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!isRendered || !user) return null;

  const openTerm = DOCUMENTS.find(({ id }) => id === (openTermId ?? lastTermId));

  const handleAnimationEnd = (event) => {
    if (!open && event.target === panel.current) setIsRendered(false);
  };

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
    <>
      <div className="menu-panel" data-state={open ? "open" : "closed"}>
        <div className="menu-panel__overlay" onClick={onClose} aria-hidden="true" />

        <nav
          ref={panel}
          className="menu-panel__panel"
          aria-label="메뉴"
          tabIndex={-1}
          onAnimationEnd={handleAnimationEnd}
        >
          <div className="menu-panel__top">
            <img src={logo} alt="" className="menu-panel__logo" />
          </div>

          <section className="menu-panel__account" aria-label="내 계정">
            {user.profile_image_url ? (
              <img className="menu-panel__avatar" src={user.profile_image_url} alt="" referrerPolicy="no-referrer" />
            ) : (
              <span className="menu-panel__avatar font-20-semibold" aria-hidden="true">
                {user.name.slice(0, 1)}
              </span>
            )}
            <div className="menu-panel__identity">
              <p className="menu-panel__name font-18-semibold">{user.name}</p>
              <p className="menu-panel__email font-14-regular">{user.email}</p>
            </div>
          </section>

          <ul className="menu-panel__list">
            {DOCUMENTS.map(({ id, label }) => (
              <li key={id}>
                <button type="button" className="menu-panel__row font-16-medium" onClick={() => handleOpenTerm(id)}>
                  {label}
                  <img src={chevronRight} alt="" />
                </button>
              </li>
            ))}
            <li>
              <button type="button" className="menu-panel__row font-16-medium" onClick={logout}>
                로그아웃
              </button>
            </li>
          </ul>

          <button
            type="button"
            className="menu-panel__withdraw font-14-regular"
            onClick={() => setIsWithdrawOpen(true)}
          >
            회원 탈퇴
          </button>
        </nav>
      </div>

      <BottomSheet open={Boolean(openTermId)} onClose={() => setOpenTermId(null)} title={openTerm?.label}>
        {openTerm && <TermsContent sections={openTerm.sections} />}
      </BottomSheet>

      <BottomSheet
        open={isWithdrawOpen}
        onClose={handleCloseWithdraw}
        title="정말 탈퇴할까요?"
        footer={
          <div className="menu-panel__sheet-actions">
            <GreenButton text="계속 쓸게요" onClick={handleCloseWithdraw} showArrow={false} disabled={isWithdrawing} />
            <button
              type="button"
              className="menu-panel__confirm font-16-medium"
              onClick={handleWithdraw}
              disabled={isWithdrawing}
            >
              {isWithdrawing ? "탈퇴하는 중" : "탈퇴하기"}
            </button>
          </div>
        }
      >
        <p className="menu-panel__sheet-text font-16-regular line-height-160">
          연습 기록과 녹음, 분석 결과가 모두 삭제돼요. 삭제한 내용은 되돌릴 수 없어요.
        </p>
        {withdrawError && (
          <p className="menu-panel__error font-14-regular" role="alert">
            {withdrawError}
          </p>
        )}
      </BottomSheet>
    </>
  );
}
