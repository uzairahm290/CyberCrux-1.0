import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet, useLocation } from "react-router-dom";
import AdminHome from "./AdminHome";

export default function AdminDashboard() {
  const location = useLocation();
  // Show AdminHome only on /admin
  const isHome = location.pathname === "/admin";
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-0">
          {isHome ? <AdminHome /> : <Outlet />}
        </main>
      </div>
    </div>
  );
} 