import googleLogo from "../../../assets/icons/google-logo.svg";

import "./GoogleLoginButton.css";

export default function GoogleLoginButton({ onClick, loading = false }) {
  return (
    <button type="button" className="google-login-button" onClick={onClick} disabled={loading} aria-busy={loading}>
      <img src={googleLogo} alt="" className="google-login-button__logo" />
      <span className="font-15-semibold">{loading ? "로그인 중" : "Google로 시작하기"}</span>
    </button>
  );
}
