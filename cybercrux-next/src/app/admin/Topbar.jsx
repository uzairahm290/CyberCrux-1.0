"use client";
import { useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const ADMIN_AUTH_KEY = "cybercrux_admin_logged_in";

export default function Topbar() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555") + "/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem(ADMIN_AUTH_KEY);
      router.push("/admin/login");
    }
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-[#0C0C0C] border-b border-white/[0.06] shrink-0">
      <div className="flex items-center gap-2 text-white/60 text-sm">
        <FaShieldAlt className="text-red-500 text-xs" />
        <span>Admin Dashboard</span>
      </div>
      <div className="flex items-center gap-4">
        <FaUserCircle className="text-2xl text-white/30" />
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isLoggingOut
              ? "text-white/20 cursor-not-allowed"
              : "text-white/50 hover:text-red-400"
          }`}
        >
          <FaSignOutAlt />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </header>
  );
}
