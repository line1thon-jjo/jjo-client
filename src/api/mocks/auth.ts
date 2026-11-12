import { ApiError } from "@/api/errors";
import { wait } from "@/api/mocks/wait";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/api/token";
import type { Agreements, AuthenticatedResponse, GoogleLoginResponse, Session } from "@/api/types";
import { STORAGE_KEYS } from "@/constants/storage";

interface MockAccount {
  marketing_agreed: boolean;
  onboarding_completed: boolean;
}

const MOCK_TOKEN = "mock-access-token";
const MOCK_TOKEN_TTL = 3600;

const MOCK_USER = {
  id: 1,
  name: "멋쟁이",
  email: "user@example.com",
  profile_image_url: null,
};

function readAccount(): MockAccount | null {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.mockAuth) ?? "null");
  } catch {
    return null;
  }
}

function writeAccount(account: MockAccount) {
  try {
    localStorage.setItem(STORAGE_KEYS.mockAuth, JSON.stringify(account));
  } catch {
    return;
  }
}

function session(account: MockAccount): Session {
  return {
    user: { ...MOCK_USER, onboarding_completed: account.onboarding_completed },
    next_step: account.onboarding_completed ? "practices" : "onboarding",
  };
}

function authenticated(account: MockAccount): AuthenticatedResponse {
  setAccessToken(MOCK_TOKEN, MOCK_TOKEN_TTL);
  return {
    status: "authenticated",
    ...session(account),
    access_token: MOCK_TOKEN,
    token_type: "Bearer",
    expires_in: MOCK_TOKEN_TTL,
  };
}

function currentAccount() {
  const account = readAccount();
  if (!getAccessToken() || !account) throw new ApiError(401, "ACCESS_CREDENTIAL_INVALID");
  return account;
}

export async function loginWithGoogle(): Promise<GoogleLoginResponse> {
  await wait();
  const account = readAccount();

  if (!account) {
    return { status: "signup_required", next_step: "terms", signup_token: "mock-signup-token", signup_token_expires_in: 600 };
  }

  return authenticated(account);
}

export async function signup(signupToken: string, agreements: Agreements) {
  await wait();

  if (!signupToken) throw new ApiError(401, "SIGNUP_CREDENTIAL_INVALID");
  if (!agreements.service_terms || !agreements.privacy_collection_use) {
    throw new ApiError(400, "REQUIRED_AGREEMENT_MISSING");
  }

  const account = { marketing_agreed: agreements.marketing, onboarding_completed: false };
  writeAccount(account);
  return authenticated(account);
}

export async function getMe() {
  await wait();
  return session(currentAccount());
}

export async function completeOnboarding() {
  await wait();
  const account = { ...currentAccount(), onboarding_completed: true };
  writeAccount(account);
  return session(account);
}

export async function logout() {
  clearAccessToken();
  try {
    localStorage.removeItem(STORAGE_KEYS.mockAuth);
  } catch {
    return;
  }
}

export async function withdraw() {
  await wait();
  currentAccount();
  await logout();
}
