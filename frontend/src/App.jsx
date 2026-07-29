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
        <Route path="/dashboard" element={<Page />} />
        <Route path="/terms-and-privacy" element={<TermsAndPrivacy />} />

        <Route path="/dashboard/:teamId/*" element={<Page />} />

        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
      <Toaster position="top-right" theme="dark" closeButton duration={1500} />
    </>
  );
}

export default App;
