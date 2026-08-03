import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { PublicRoute, ProtectedRoute } from "./components/protectedRoute.jsx";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/Login-page.jsx"));
const SignupPage = lazy(() => import("./pages/Signup-page.jsx"));
const Page = lazy(() => import("./pages/Dashboard.jsx"));
const TermsAndPrivacy = lazy(() => import("./pages/TermsAndPrivacy"));
const AuthCallback = lazy(() => import("./pages/AuthCallback.jsx"));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground text-sm font-medium">
      Loading...
    </div>
  );
}

function App() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
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
