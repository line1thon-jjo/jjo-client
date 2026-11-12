import { STORAGE_KEYS } from "@/constants/storage";

const DEMO_EVENT = "jjo:demo-mode";

export const DEMO_ID_BASE = 9_000_000_000;

export function demoId(id: number) {
  return DEMO_ID_BASE + id;
}

export function isDemoId(id: number | string | null | undefined) {
  return Number(id) > DEMO_ID_BASE;
}

export function isDemoMode() {
  try {
    return localStorage.getItem(STORAGE_KEYS.demoMode) === "true";
  } catch {
    return false;
  }
}

export function setDemoMode(enabled: boolean) {
  try {
    if (enabled) localStorage.setItem(STORAGE_KEYS.demoMode, "true");
    else localStorage.removeItem(STORAGE_KEYS.demoMode);
  } catch {
    return;
  }
  window.dispatchEvent(new Event(DEMO_EVENT));
}

export function onDemoModeChange(listener: () => void) {
  window.addEventListener(DEMO_EVENT, listener);
  return () => window.removeEventListener(DEMO_EVENT, listener);
}
