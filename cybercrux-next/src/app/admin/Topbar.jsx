"use client";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useRouter, usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import NavLink from '@/components/ui/NavLink';
import {useEffect } from "react";

const ADMIN_AUTH_KEY = "cybercrux_admin_logged_in";

export default function Topbar() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    
    try {
      // Clear backend session
      await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if backend call fails
    } finally {
      // Clear local storage and redirect
      localStorage.removeItem(ADMIN_AUTH_KEY);
      router.push("/admin/login");
    }
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow border-b border-blue-100">
      <div className="text-lg font-bold text-[#0a2a4d]">Dashboard</div>
      <div className="flex items-center gap-4">
        <FaUserCircle className="text-3xl text-blue-400" />
        <button
          className={`flex items-center gap-2 font-semibold transition-colors ${
            isLoggingOut 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-500 hover:text-blue-700'
          }`}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <FaSignOutAlt /> 
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </header>
  );
} 