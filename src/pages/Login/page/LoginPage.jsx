import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import BrandLayout from "@/components/BrandLayout/BrandLayout";
import GoogleLoginButton from "@/pages/Login/components/GoogleLoginButton";
import { getErrorMessage } from "@/api/messages";
import { NEXT_STEP_PATH } from "@/auth/AuthContext";
import { useAuth } from "@/auth/useAuth";

import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async (idToken) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextStep = await login(idToken);
      navigate(NEXT_STEP_PATH[nextStep], { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "로그인하지 못했어요. 다시 시도해 주세요."));
      setIsLoading(false);
    }
  };

  const handleGoogleError = useCallback((error) => setErrorMessage(getErrorMessage(error)), []);

  return (
    <BrandLayout footer={<GoogleLoginButton onCredential={handleLogin} onError={handleGoogleError} loading={isLoading} />}>
      <p className="login-page__description font-15-medium line-height-160">
        대본을 읽는 내 목소리를
        <br />
        글자 모양으로 확인해 보세요.
      </p>

      {errorMessage && (
        <p className="login-page__error font-14-medium" role="alert">
          {errorMessage}
        </p>
      )}
    </BrandLayout>
  );
}
