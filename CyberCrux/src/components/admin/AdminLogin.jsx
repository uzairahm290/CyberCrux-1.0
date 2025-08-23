import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_AUTH_KEY = "cybercrux_admin_logged_in";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/verify', {
          credentials: 'include'
        });
        
        if (response.ok) {
          navigate("/admin/blogs");
        }
      } catch (error) {
        // Not authenticated, stay on login page
      }
    };

    checkAdminAuth();
  }, [navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setError(""); // Clear error when user types
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Set local flag for frontend routing
        localStorage.setItem(ADMIN_AUTH_KEY, "true");
        navigate("/admin/blogs");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6 border border-blue-200"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-2">Admin Login</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <input
            className="border border-gray-300 p-3 rounded-lg text-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            required
            disabled={loading}
          />
          <input
            className="border border-gray-300 p-3 rounded-lg text-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Password"
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
          className={`w-full font-bold py-3 rounded-lg transition ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          } text-white`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="text-center text-sm text-gray-600">
          <p>🔒 Secure admin access</p>
          <p>Rate limited • Session based • HTTP-only cookies</p>
        </div>
      </form>
    </div>
  );
} 