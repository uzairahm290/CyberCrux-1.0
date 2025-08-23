import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ADMIN_AUTH_KEY = "cybercrux_admin_logged_in";

export default function RequireAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAdminAuth = async () => {
      try {
        // Check if we have the local flag first
        const hasLocalFlag = localStorage.getItem(ADMIN_AUTH_KEY) === "true";
        
        if (!hasLocalFlag) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify with backend
        const response = await fetch('http://localhost:5000/api/admin/verify', {
          credentials: 'include'
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Backend says not authenticated, clear local flag
          localStorage.removeItem(ADMIN_AUTH_KEY);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Admin auth verification error:', error);
        // Network error, clear local flag for security
        localStorage.removeItem(ADMIN_AUTH_KEY);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdminAuth();
  }, []);

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

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
} 