import { ApiError } from "@/api/errors";
import { clearAccessToken, getAccessToken } from "@/api/token";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const UNAUTHORIZED_EVENT = "jjo:unauthorized";

export const USE_MOCK = import.meta.env.VITE_API_MOCK === "true";

interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  auth?: boolean;
}

export function resolveUrl(path: string) {
  return `${BASE_URL}${path}`;
}

export function onUnauthorized(listener: () => void) {
  window.addEventListener(UNAUTHORIZED_EVENT, listener);
  return () => window.removeEventListener(UNAUTHORIZED_EVENT, listener);
}

function expireSession() {
  clearAccessToken();
  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
}

function authorizationHeader() {
  const token = getAccessToken();

  if (!token) {
    expireSession();
    throw new ApiError(401, "ACCESS_CREDENTIAL_INVALID");
  }

  return `Bearer ${token}`;
}

function encodeBody(body: unknown, headers: Record<string, string>): BodyInit | undefined {
  if (body === undefined) return undefined;
  if (body instanceof FormData) return body;

  headers["Content-Type"] = "application/json";
  return JSON.stringify(body);
}

export async function request<T>(path: string, { method = "GET", body, signal, auth = true }: RequestConfig = {}) {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (auth) headers.Authorization = authorizationHeader();

  let response: Response;
  try {
    response = await fetch(resolveUrl(path), { method, headers, body: encodeBody(body, headers), signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, "NETWORK_ERROR");
  }

  if (response.status === 204) return null as T;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const { code = "UNKNOWN_ERROR", fields = [] } = data?.error ?? {};
    if (response.status === 401 && code === "ACCESS_CREDENTIAL_INVALID") expireSession();
    throw new ApiError(response.status, code, fields);
  }

  return data as T;
}
