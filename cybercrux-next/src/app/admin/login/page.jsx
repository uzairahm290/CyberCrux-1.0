"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaShieldAlt, FaLock } from "react-icons/fa";

const ADMIN_AUTH_KEY = "cybercrux_admin_logged_in";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const response = await fetch(
          (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555") + "/api/admin/verify",
          { credentials: "include" }
        );
        if (response.ok) {
          router.push("/admin/blogs");
        }
      } catch {
        // not authenticated
      }
    };
    checkAdminAuth();
  }, [router]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555") + "/api/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem(ADMIN_AUTH_KEY, "true");
        router.push("/admin/blogs");
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808]">
      <div className="w-full max-w-md px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-red-600/20 border border-red-600/30 rounded-2xl flex items-center justify-center mb-4">
            <FaShieldAlt className="text-red-500 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-white/40 text-sm mt-1">CyberCrux Control Panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-8 flex flex-col gap-5"
        >
          {error && (
            <div className="bg-red-600/10 border border-red-600/20 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-sm font-medium">Username</label>
            <input
              className="bg-[#080808] border border-white/[0.07] rounded-lg px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-red-600/40 transition-colors"
              placeholder="admin"
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-sm font-medium">Password</label>
            <input
              className="bg-[#080808] border border-white/[0.07] rounded-lg px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-red-600/40 transition-colors"
              placeholder="••••••••"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-lg transition-colors ${
              loading
                ? "bg-white/[0.05] text-white/30 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            <FaLock className="text-sm" />
            {loading ? "Verifying..." : "Login"}
          </button>

          <p className="text-center text-xs text-white/20">
            Session-based · HTTP-only cookies · Rate limited
          </p>
        </form>
      </div>
    </div>
  );
}
