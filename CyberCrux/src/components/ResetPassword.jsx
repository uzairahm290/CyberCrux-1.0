import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MainNavbar from "./MainNav";
import Footer from "./Footer";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordStrength({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
      symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
    });
  };

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({
        text: "Passwords do not match",
        isError: true
      });
      return;
    }

    // Password strength validation
    const isPasswordStrong = Object.values(passwordStrength).every(Boolean);
    if (!isPasswordStrong) {
      setMessage({
        text: "Password must meet all strength requirements",
        isError: true
      });
      return;
    }

    setLoading(true);
    setMessage({ text: "", isError: false });

    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );
      setMessage({
        text: response.data.message,
        isError: false
      });
      // Redirect to login after successful reset
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to reset password",
        isError: true
      });
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
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl px-8 py-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-6 shadow-lg">
                <FiLock className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold mb-2 pb-1 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Reset Password
              </h1>
              <p className="text-gray-300">Enter your new password below.</p>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-xl text-sm ${
                message.isError 
                  ? "bg-red-500/10 border border-red-400/30 text-red-300" 
                  : "bg-green-500/10 border border-green-400/30 text-green-300"
              }`}>
                {message.text}
              </div>
            )}

            {/* Form */}
            <form className="space-y-6" onSubmit={handleReset}>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-200">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onFocus={() => setShowPasswordHint(true)}
                    onBlur={() => setShowPasswordHint(false)}
                    className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
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
                
                {/* Password Requirements Hint - Show briefly on focus */}
                {showPasswordHint && !password && (
                  <div className="mt-2 text-xs text-gray-400 bg-white/5 rounded-lg p-2">
                    💡 Password must be at least 8 characters with uppercase, lowercase, number, and special character
                  </div>
                )}
                
                {/* Password Strength Indicator - Only show when password is weak or there's an error */}
                {(password && !Object.values(passwordStrength).every(Boolean)) && (
                  <div className="mt-3 space-y-2">
                    <div className="text-xs text-gray-400 mb-2">Password must contain:</div>
                    <div className="space-y-1">
                      <div className={`flex items-center text-xs ${passwordStrength.length ? 'text-green-400' : 'text-red-400'}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.length ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        At least 8 characters
                      </div>
                      <div className={`flex items-center text-xs ${passwordStrength.uppercase ? 'text-green-400' : 'text-red-400'}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.uppercase ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        One uppercase letter (A-Z)
                      </div>
                      <div className={`flex items-center text-xs ${passwordStrength.lowercase ? 'text-green-400' : 'text-red-400'}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.lowercase ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        One lowercase letter (a-z)
                      </div>
                      <div className={`flex items-center text-xs ${passwordStrength.number ? 'text-green-400' : 'text-red-400'}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.number ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        One number (0-9)
                      </div>
                      <div className={`flex items-center text-xs ${passwordStrength.symbol ? 'text-green-400' : 'text-red-400'}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.symbol ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        One special character (!@#$%^&*)
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-200">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 hover:scale-110 transition-all duration-200 p-1 rounded-full hover:bg-white/10"
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                )}
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}