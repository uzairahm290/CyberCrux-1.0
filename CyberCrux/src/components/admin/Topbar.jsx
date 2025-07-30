import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ADMIN_AUTH_KEY = "cybercrux_admin_logged_in";

export default function Topbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    navigate("/admin/login");
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow border-b border-blue-100">
      <div className="text-lg font-bold text-[#0a2a4d]">Dashboard</div>
      <div className="flex items-center gap-4">
        <FaUserCircle className="text-3xl text-blue-400" />
        <button
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700 font-semibold"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </header>
  );
} 