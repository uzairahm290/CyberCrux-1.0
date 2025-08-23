import MainNavbar from "./MainNav";
import Footer from "./Footer";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";
import DOMPurify from 'dompurify';
import { useAuth } from '../AuthContext';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Sanitize input using DOMPurify
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    }).trim();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: sanitizeInput(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    const { emailOrUsername, password } = formData;
    if (!emailOrUsername.trim() || !password.trim()) {
      setError("Both fields are required");
      setLoading(false);
      return;
    }
    if (emailOrUsername.length > 100 || password.length > 100) {
      setError("Input too long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          emailOrUsername: sanitizeInput(formData.emailOrUsername),
          password: sanitizeInput(formData.password)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Success logic - set user in context
      login(data.user);
      navigate("/dashboard");

    } catch (err) {
      setError(err.message || "Login failed");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <MainNavbar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl px-8 py-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-6 shadow-lg">
                <FiLogIn className="text-white text-2xl" />
          </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
              <p className="text-gray-300">Log in to your CyberCrux account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-xl text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-200">
                  Username or Email
                </label>
              <input
                type="text"
                name="emailOrUsername"
                placeholder="example@gmail.com"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                value={formData.emailOrUsername}
                onChange={handleChange}
                required
              />
            </div>
              
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-200">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 hover:scale-110 transition-all duration-200 p-1 rounded-full hover:bg-white/10"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
            </div>
              
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot Password?
                </Link>
            </div>
              
            <button
              type="submit"
              disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading && (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              )}
              {loading ? "Logging in..." : "Log In"}
            </button>
              
              <div className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                  Sign up
                </Link>
            </div>
              
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-white/20"></div>
                <span className="px-4 text-gray-400 text-sm">OR</span>
                <div className="flex-grow border-t border-white/20"></div>
            </div>
              
            <button
              type="button"
              onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                className="w-full py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <FcGoogle className="text-lg" />
              Continue with Google
            </button>
          </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
