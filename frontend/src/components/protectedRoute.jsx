import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const token = localStorage.getItem("token");

  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
