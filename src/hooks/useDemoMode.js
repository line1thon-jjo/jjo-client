import { useSyncExternalStore } from "react";

import { isDemoMode, onDemoModeChange } from "@/api/demo";

export function useDemoMode() {
  return useSyncExternalStore(onDemoModeChange, isDemoMode);
}
