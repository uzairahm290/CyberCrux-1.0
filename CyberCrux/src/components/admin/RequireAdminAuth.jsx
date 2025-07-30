import { Navigate, Outlet } from "react-router-dom";

const ADMIN_AUTH_KEY = "cybercrux_admin_logged_in";

export default function RequireAdminAuth() {
  const isLoggedIn = localStorage.getItem(ADMIN_AUTH_KEY) === "true";
  return isLoggedIn ? <Outlet /> : <Navigate to="/admin/login" replace />;
} 