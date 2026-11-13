import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import AppSplash from "@/components/AppSplash/AppSplash";
import DesktopGuide from "@/components/DesktopGuide/DesktopGuide";
import AuthProvider from "@/auth/AuthProvider";
import MotionProvider from "@/lib/motion/MotionProvider";
import { GuestOnly, RequireOnboarded, RequireSignup, RequireUser } from "@/auth/guards";
import { collapseTo } from "@/lib/transition/revealFrom";
import "@/lib/transition/revealFrom.css";

import HomePage from "@/pages/Home/page/HomePage";
import ScriptPage from "@/pages/Script/page/ScriptPage";
import LoginPage from "@/pages/Login/page/LoginPage";
import TermsPage from "@/pages/Terms/page/TermsPage";
import OnboardingPage from "@/pages/Onboarding/page/OnboardingPage";
import ReportPage from "@/pages/Report/page/ReportPage";
import RecordPage from "@/pages/Record/page/RecordPage";

function ScriptRoute() {
  const navigate = useNavigate();

  return (
    <ScriptPage
      onBack={() => collapseTo(".add-button", () => navigate("/"))}
      onRecord={(practice) =>
        navigate("/record", {
          state: { title: practice.title, script: practice.script, practiceId: practice.id },
        })
      }
    />
  );
}

function RecordRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const practiceData = location.state;

  if (!practiceData?.script) {
    return <Navigate to="/script" replace />;
  }

  return (
    <RecordPage
      title={practiceData.title}
      script={practiceData.script}
      practiceId={practiceData.practiceId}
      onBack={() => navigate(-1)}
      onUploaded={({ practiceId, recordingId }) =>
        navigate(`/practices/${practiceId}/reports/${recordingId}`, { replace: true })
      }
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
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <AppSplash />
          <DesktopGuide />
        </AuthProvider>
      </MotionProvider>
    </BrowserRouter>
  );
}
