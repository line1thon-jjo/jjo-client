import { useCallback, useEffect, useMemo, useState } from "react";

import * as authApi from "@/api/auth";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [signupToken, setSignupToken] = useState(null);

  useEffect(() => {
    authApi
      .getMe()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async () => {
    const result = await authApi.loginWithGoogle();

    if (result.status === "signup_required") {
      setSignupToken(result.signup_token);
    } else {
      setUser(result.user);
    }

    return result.next_step;
  }, []);

  const signup = useCallback(
    async (agreements) => {
      const result = await authApi.signup(signupToken, agreements);
      setSignupToken(null);
      setUser(result.user);
      return result.next_step;
    },
    [signupToken],
  );

  const completeOnboarding = useCallback(async () => {
    const result = await authApi.completeOnboarding();
    setUser(result.user);
    return result.next_step;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setSignupToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ isLoading, user, signupToken, login, signup, completeOnboarding, logout }),
    [isLoading, user, signupToken, login, signup, completeOnboarding, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
