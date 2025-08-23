import MainNavbar from "./MainNav";
import Footer from "./Footer";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiUserPlus, FiEye, FiEyeOff } from "react-icons/fi";
import DOMPurify from 'dompurify';

export default function () {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    // Don't sanitize fullName field to allow spaces, but sanitize other fields
    if (name === 'fullName') {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: sanitizeInput(value) }));
    }

    // Password strength validation
    if (name === 'password') {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Basic validation
    const { username, fullName, email, password, confirmPassword } = formData;
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Full name, email, and password are required');
      setLoading(false);
      return;
    }
    if (fullName.length > 100 || email.length > 100 || password.length > 100) {
      setError('Input too long');
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    // Password strength validation
    const isPasswordStrong = Object.values(passwordStrength).every(Boolean);
    if (!isPasswordStrong) {
      setError('Password must meet all strength requirements');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // For cookies if using sessions
        body: JSON.stringify({
          username: sanitizeInput(formData.username),
          fullName: sanitizeInput(formData.fullName),
          email: sanitizeInput(formData.email),
          password: sanitizeInput(formData.password),
          confirmPassword: sanitizeInput(formData.confirmPassword)
        }),
      });
  
      // Check if response is OK (status 200-299)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
            if (!data.success) {
        throw new Error(data.message || 'Signup failed');
      }

      setSuccess(data.message + (data.username ? ` - Your username is: ${data.username}` : ''));
      setFormData({
        username: '',
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
  
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Signup error:', err);
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
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl px-8 py-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-6 shadow-lg">
                <FiUserPlus className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Create Account
              </h1>
              <p className="text-gray-300">Start your cybersecurity journey today</p>
            </div>

            {/* Error / Success messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-xl text-red-300 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-400/30 rounded-xl text-green-300 text-sm">
                {success}
              </div>
            )}

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-200">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-200">
                  Username (Optional)
                  <span className="text-xs text-gray-400 ml-2">Leave empty for auto-generation</span>
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="johndoe123 (optional)"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-200">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  value={formData.email}
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
                    placeholder="Create a strong password"
                    className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setShowPasswordHint(true)}
                    onBlur={() => setShowPasswordHint(false)}
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
                {showPasswordHint && !formData.password && (
                  <div className="mt-2 text-xs text-gray-400 bg-white/5 rounded-lg p-2">
                    💡 Password must be at least 8 characters with uppercase, lowercase, number, and special character
                  </div>
                )}
                
                {/* Password Strength Indicator - Only show when password is weak or there's an error */}
                {(formData.password && !Object.values(passwordStrength).every(Boolean)) && (
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
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
                {loading ? "Creating Account..." : "Create Account"}
              </button>
              
              <div className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                  Log In
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
