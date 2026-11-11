import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import AuthProvider from "../auth/AuthProvider";
import MotionProvider from "../lib/motion/MotionProvider";
import { GuestOnly, RequireOnboarded, RequireSignup, RequireUser } from "../auth/guards";

import HomePage from "../pages/Home/page/HomePage";
import ScriptPage from "../pages/Script/page/ScriptPage";
import LoginPage from "../pages/Login/page/LoginPage";
import TermsPage from "../pages/Terms/page/TermsPage";
import OnboardingPage from "../pages/Onboarding/page/OnboardingPage";
import ReportPage from "../pages/Report/page/ReportPage";

function ScriptRoute() {
  const navigate = useNavigate();

  return (
    <ScriptPage
      onBack={() => navigate("/")}
    />
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <MotionProvider>
        <AuthProvider>
          <Routes>
            <Route element={<GuestOnly />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<RequireSignup />}>
              <Route path="/terms" element={<TermsPage />} />
            </Route>

            <Route element={<RequireUser />}>
              <Route path="/onboarding" element={<OnboardingPage />} />

              <Route element={<RequireOnboarded />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/script" element={<ScriptRoute />} />
                <Route path="/reports/:recordingId" element={<ReportPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </MotionProvider>
    </BrowserRouter>
  );
}
