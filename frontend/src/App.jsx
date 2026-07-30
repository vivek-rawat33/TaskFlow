import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login-page.jsx";
import SignupPage from "./pages/Signup-page.jsx";
import Page from "./pages/Dashboard.jsx";
import LandingPage from "./pages/LandingPage";
import TermsAndPrivacy from "./pages/TermsAndPrivacy";
import { Toaster } from "sonner";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<Page />} />
        <Route path="/terms-and-privacy" element={<TermsAndPrivacy />} />

        <Route path="/dashboard/:teamId/*" element={<Page />} />

        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
      <Toaster
        theme="dark"
        richColors={false}
        position="top-right"
        duration={1800}
        visibleToasts={3}
        closeButton={false}
      />
    </>
  );
}

export default App;
