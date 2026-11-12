import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import AppSplash from "@/components/AppSplash/AppSplash";
import AuthProvider from "@/auth/AuthProvider";
import MotionProvider from "@/lib/motion/MotionProvider";
import { GuestOnly, RequireOnboarded, RequireSignup, RequireUser } from "@/auth/guards";

import HomePage from "@/pages/Home/page/HomePage";
import ScriptPage from "@/pages/Script/page/ScriptPage";
import LoginPage from "@/pages/Login/page/LoginPage";
import TermsPage from "@/pages/Terms/page/TermsPage";
import OnboardingPage from "@/pages/Onboarding/page/OnboardingPage";
import ReportPage from "@/pages/Report/page/ReportPage";
import RecordPage from "@/pages/Record/page/RecordPage";
import SettingsPage from "@/pages/Settings/page/SettingsPage";

function ScriptRoute() {
  const navigate = useNavigate();

  return (
    <ScriptPage
      onBack={() => navigate("/")}
      onRecord={(practiceData) => navigate("/record", { state: practiceData })}
    />
  );
}

function RecordRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const practiceData = location.state;

  if (!practiceData?.title || !practiceData?.script) {
    return <Navigate to="/script" replace />;
  }

  return (
    <RecordPage
      title={practiceData.title}
      script={practiceData.script}
      onBack={() => navigate(-1)}
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
                <Route path="/record" element={<RecordRoute />} />
                <Route path="/practices/:practiceId/reports/:recordingId" element={<ReportPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <AppSplash />
        </AuthProvider>
      </MotionProvider>
    </BrowserRouter>
  );
}
