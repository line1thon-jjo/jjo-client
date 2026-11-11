import { Navigate, Outlet } from "react-router-dom";

import { NEXT_STEP_PATH } from "./AuthContext";
import { useAuth } from "./useAuth";

import "./guards.css";

function Splash() {
  return <div className="auth-splash" aria-busy="true" />;
}

export function GuestOnly() {
  const { isLoading, user } = useAuth();

  if (isLoading) return <Splash />;
  if (user) return <Navigate to={user.onboarding_completed ? "/" : NEXT_STEP_PATH.onboarding} replace />;
  return <Outlet />;
}

export function RequireSignup() {
  const { isLoading, user, signupToken } = useAuth();

  if (isLoading) return <Splash />;
  if (user) return <Navigate to="/" replace />;
  if (!signupToken) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function RequireUser() {
  const { isLoading, user } = useAuth();

  if (isLoading) return <Splash />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function RequireOnboarded() {
  const { user } = useAuth();

  if (!user.onboarding_completed) return <Navigate to={NEXT_STEP_PATH.onboarding} replace />;
  return <Outlet />;
}
