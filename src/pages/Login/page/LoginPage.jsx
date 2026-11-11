import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BrandLayout from "../../../components/BrandLayout/BrandLayout";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { NEXT_STEP_PATH } from "../../../auth/AuthContext";
import { useAuth } from "../../../auth/useAuth";

import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const nextStep = await login();
      navigate(NEXT_STEP_PATH[nextStep], { replace: true });
    } catch {
      setHasError(true);
      setIsLoading(false);
    }
  };

  return (
    <BrandLayout intro footer={<GoogleLoginButton onClick={handleLogin} loading={isLoading} />}>
      <p className="login-page__description font-15-medium line-height-160">
        대본을 읽는 내 목소리를
        <br />
        글자 모양으로 확인해 보세요.
      </p>

      {hasError && (
        <p className="login-page__error font-14-medium" role="alert">
          로그인하지 못했어요. 다시 시도해 주세요.
        </p>
      )}
    </BrandLayout>
  );
}
