"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';

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
      const response = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555') + '/api/admin/verify', {
        credentials: 'include'
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(ADMIN_AUTH_KEY);
        setIsAuthenticated(false);
        router.replace("/admin/login");
      }
    } catch (error) {
      console.error('Admin auth verification error:', error);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p>Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
}