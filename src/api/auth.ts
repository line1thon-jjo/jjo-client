import * as mock from "@/api/mocks/auth";
import { request, USE_MOCK } from "@/api/client";
import { clearAccessToken, setAccessToken } from "@/api/token";
import type {
  Agreements,
  AuthenticatedResponse,
  GoogleLoginResponse,
  RequestOptions,
  Session,
} from "@/api/types";

function saveSession<T extends GoogleLoginResponse>(result: T) {
  if (result.status === "authenticated") setAccessToken(result.access_token, result.expires_in);
  return result;
}

const server = {
  async loginWithGoogle(idToken: string, { signal }: RequestOptions = {}) {
    const result = await request<GoogleLoginResponse>("/auth/google", {
      method: "POST",
      body: { id_token: idToken },
      auth: false,
      signal,
    });
    return saveSession(result);
  },

  async signup(signupToken: string, agreements: Agreements, { signal }: RequestOptions = {}) {
    const result = await request<AuthenticatedResponse>("/auth/signup", {
      method: "POST",
      body: { signup_token: signupToken, agreements },
      auth: false,
      signal,
    });
    return saveSession(result);
  },

  getMe({ signal }: RequestOptions = {}) {
    return request<Session>("/auth/me", { signal });
  },

  completeOnboarding({ signal }: RequestOptions = {}) {
    return request<Session>("/auth/onboarding/complete", { method: "POST", signal });
  },

  async logout() {
    clearAccessToken();
  },
};

export const { loginWithGoogle, signup, getMe, completeOnboarding, logout }: typeof server = USE_MOCK ? mock : server;
