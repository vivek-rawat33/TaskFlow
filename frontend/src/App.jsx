import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login-page.jsx";
import SignupPage from "./pages/Signup-page.jsx";
import Page from "./pages/Dashboard.jsx";
import LandingPage from "./pages/LandingPage";
import TermsAndPrivacy from "./pages/TermsAndPrivacy";
import { Toaster } from "sonner";
import AuthCallback from "./pages/AuthCallback.jsx";
import { PublicRoute, ProtectedRoute } from "./components/protectedRoute.jsx";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<LoginPage />} />
        </Route>

        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/terms-and-privacy" element={<TermsAndPrivacy />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Page />} />
          <Route path="/dashboard/:teamId/*" element={<Page />} />
        </Route>
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
