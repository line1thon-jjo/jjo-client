import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import HomePage from "../pages/Home/page/HomePage";
import ScriptPage from "../pages/Script/page/ScriptPage";
import TermsPage from "../pages/Terms/page/TermsPage";

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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/script" element={<ScriptRoute />} />
        <Route path="/onboarding" element={<TermsPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
