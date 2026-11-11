import { wait } from "./mock";

const DB_KEY = "jjo:mock-auth";
const TOKEN_KEY = "jjo:access-token";

const MOCK_USER = {
  id: 1,
  name: "jjo 사용자",
  email: "user@example.com",
  profile_image_url: null,
};

export class AuthError extends Error {
  constructor(status, code) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or blocked storage. The mock still works for this session.
  }
}

function userResponse(account) {
  return { ...MOCK_USER, onboarding_completed: account.onboarding_completed };
}

function authenticated(account) {
  const accessToken = "mock-access-token";
  write(TOKEN_KEY, accessToken);

  return {
    status: "authenticated",
    next_step: account.onboarding_completed ? "practices" : "onboarding",
    user: userResponse(account),
    access_token: accessToken,
    token_type: "Bearer",
  };
}

function currentAccount() {
  const account = read(DB_KEY);
  if (!read(TOKEN_KEY) || !account) throw new AuthError(401, "ACCESS_CREDENTIAL_INVALID");
  return account;
}

export async function loginWithGoogle() {
  await wait();
  const account = read(DB_KEY);

  if (!account) {
    return { status: "signup_required", next_step: "terms", signup_token: "mock-signup-token" };
  }

  return authenticated(account);
}

export async function signup(signupToken, agreements) {
  await wait();

  if (!signupToken) throw new AuthError(401, "SIGNUP_CREDENTIAL_INVALID");
  if (!agreements.service_terms || !agreements.privacy_collection_use) {
    throw new AuthError(400, "REQUIRED_AGREEMENT_MISSING");
  }

  const account = { marketing_agreed: Boolean(agreements.marketing), onboarding_completed: false };
  write(DB_KEY, account);

  return authenticated(account);
}

export async function getMe() {
  await wait();
  const account = currentAccount();

  return {
    user: userResponse(account),
    next_step: account.onboarding_completed ? "practices" : "onboarding",
  };
}

export async function completeOnboarding() {
  await wait();
  const account = { ...currentAccount(), onboarding_completed: true };
  write(DB_KEY, account);

  return { user: userResponse(account), next_step: "practices" };
}

export async function logout() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(DB_KEY);
  } catch {
    // Nothing to clear.
  }
}
