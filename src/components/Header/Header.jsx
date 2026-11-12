import { useState } from "react";

import MenuPanel from "@/components/MenuPanel/MenuPanel";

import "./Header.css";

import logo from "../../assets/images/jjo-logo.svg";
import arrowLeft from "../../assets/icons/arrow-left.svg";

export default function Header({
  variant = "default",
  onBack,
  onMenuClick,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isBack = variant === "back";

  return (
    <header className="header">
      {isBack ? (
        <button
          type="button"
          className="header__button"
          onClick={onBack}
          aria-label="뒤로 가기"
        >
          <img
            src={arrowLeft}
            alt=""
            className="header__icon"
          />
        </button>
      ) : (
        <img
          src={logo}
          alt="jjo"
          className="header__logo"
        />
      )}

      <button
        type="button"
        className="header__button"
        onClick={onMenuClick ?? (() => setIsMenuOpen((open) => !open))}
        aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={isMenuOpen}
        data-open={isMenuOpen || undefined}
      >
        <span className="header__burger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <MenuPanel open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
