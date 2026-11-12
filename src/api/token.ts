import { STORAGE_KEYS } from "@/constants/storage";

interface SavedToken {
  token: string;
  expiresAt: number;
}

export function getAccessToken(): string | null {
  try {
    const saved: SavedToken | null = JSON.parse(localStorage.getItem(STORAGE_KEYS.accessToken) ?? "null");
    if (!saved?.token || saved.expiresAt <= Date.now()) return null;
    return saved.token;
  } catch {
    return null;
  }
}

export function setAccessToken(token: string, expiresIn: number) {
  const saved: SavedToken = { token, expiresAt: Date.now() + expiresIn * 1000 };

  try {
    localStorage.setItem(STORAGE_KEYS.accessToken, JSON.stringify(saved));
  } catch {
    return;
  }
}

export function clearAccessToken() {
  try {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
  } catch {
    return;
  }
}
