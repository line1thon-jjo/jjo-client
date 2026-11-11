import "./Header.css";

import logo from "../../assets/images/jjo-logo.svg";
import menuIcon from "../../assets/icons/menu-icon.svg";
import arrowLeft from "../../assets/icons/arrow-left.svg";

export default function Header({
  variant = "default",
  onBack,
  onMenuClick,
}) {
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
        onClick={onMenuClick}
        aria-label="메뉴 열기"
      >
        <img
          src={menuIcon}
          alt=""
          className="header__icon"
        />
      </button>
    </header>
  );
}
