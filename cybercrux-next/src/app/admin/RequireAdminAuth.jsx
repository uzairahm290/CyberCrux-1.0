"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FaShieldAlt } from "react-icons/fa";

const ADMIN_AUTH_KEY = "cybercrux_admin_logged_in";

export default function RequireAdminAuth({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVerified, setHasVerified] = useState(false);
  const router = useRouter();

  const verifyAdminAuth = useCallback(async () => {
    if (hasVerified) return;
    try {
      setHasVerified(true);
      const hasLocalFlag = localStorage.getItem(ADMIN_AUTH_KEY) === "true";
      if (!hasLocalFlag) {
        setIsAuthenticated(false);
        setIsLoading(false);
        router.replace("/admin/login");
        return;
      }
      const response = await fetch(
        (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555") + "/api/admin/verify",
        { credentials: "include" }
      );
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(ADMIN_AUTH_KEY);
        setIsAuthenticated(false);
        router.replace("/admin/login");
      }
    } catch (error) {
      console.error("Admin auth verification error:", error);
      localStorage.removeItem(ADMIN_AUTH_KEY);
      setIsAuthenticated(false);
      router.replace("/admin/login");
    } finally {
      setIsLoading(false);
    }
  }, [hasVerified, router]);

  useEffect(() => {
    if (!hasVerified) {
      verifyAdminAuth();
    }
  }, [verifyAdminAuth, hasVerified]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808]">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="text-red-500 text-xl animate-pulse" />
          </div>
          <p className="text-white/50 text-sm">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
}
