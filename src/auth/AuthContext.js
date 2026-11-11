import { createContext } from "react";

export const AuthContext = createContext(null);

export const NEXT_STEP_PATH = {
  terms: "/terms",
  onboarding: "/onboarding",
  practices: "/",
};
