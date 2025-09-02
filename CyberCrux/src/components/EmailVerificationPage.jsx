import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import MainNavbar from './MainNav';
import { FiMail, FiCheckCircle, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, error
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const token = searchParams.get('token') || useParams().token;

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }

    // If user is already verified, redirect to dashboard
    if (user.isVerified) {
      navigate('/dashboard');
      return;
    }

    // If there's a token in URL, verify it
    if (token) {
      verifyEmail(token);
    }

    // Start countdown for resend button
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [token, user, navigate]);

  const verifyEmail = async (verificationToken) => {
    setIsVerifying(true);
    try {
      const response = await fetch(`http://localhost:5000/api/auth/verify-email/${verificationToken}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        setVerificationStatus('success');
        // Update user context with verified status
        // You might need to refresh the user data here
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setVerificationStatus('error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const resendVerificationEmail = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: user.email })
      });

      if (response.ok) {
        setCountdown(30);
        // Show success message
        alert('Verification email resent successfully!');
      } else {
        alert('Failed to resend verification email. Please try again.');
      }
    } catch (error) {
      console.error('Resend error:', error);
      alert('Failed to resend verification email. Please try again.');
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const goToLogin = () => {
    logout();
    navigate('/login');
  };

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
        <MainNavbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden pt-20">
          <div className="w-full max-w-md relative z-10">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl px-8 py-10 text-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
                <FiCheckCircle className="text-green-400 text-4xl" />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-green-400">
                Email Verified! 🎉
              </h1>
              <p className="text-gray-300 mb-6">
                Your email has been successfully verified. You now have full access to all CyberCrux features!
              </p>
              <button
                onClick={goToDashboard}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Continue to Dashboard
                <FiArrowRight className="inline ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
        <MainNavbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden pt-20">
          <div className="w-full max-w-md relative z-10">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl px-8 py-10 text-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-6">
                <FiAlertCircle className="text-red-400 text-4xl" />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-red-400">
                Verification Failed
              </h1>
              <p className="text-gray-300 mb-6">
                The verification link appears to be invalid or expired. Please check your email for a fresh link or request a new one.
              </p>
              <div className="space-y-3">
                <button
                  onClick={resendVerificationEmail}
                  disabled={countdown > 0}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
                </button>
                <button
                  onClick={goToLogin}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-white/20"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl px-8 py-10 text-center">
            {/* Header */}
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/20 mb-6 mx-auto">
              <FiMail className="text-blue-400 text-4xl" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Verify Your Email
            </h1>
            
            <p className="text-gray-300 mb-6">
              Welcome to CyberCrux, <strong>{user?.fullName}</strong>! 🎉
            </p>

            <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-blue-300 mb-3">📧 Check Your Email</h3>
              <p className="text-gray-300 text-sm mb-3">
                We've sent a verification link to:
              </p>
              <p className="text-blue-300 font-mono text-sm break-all">
                {user?.email}
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4 mb-6">
              <p className="text-yellow-300 text-sm">
                <strong>⚠️ Important:</strong> You need to verify your email to access all features and participate in competitions.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={resendVerificationEmail}
                disabled={countdown > 0}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
              </button>
              
              <button
                onClick={goToDashboard}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-white/20"
              >
                Continue to Dashboard (Limited Access)
              </button>
              
              <button
                onClick={goToLogin}
                className="w-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-white/10"
              >
                Back to Login
              </button>
            </div>

            <div className="mt-6 text-xs text-gray-400">
              <p>Didn't receive the email? Check your spam folder.</p>
              <p>Make sure you entered the correct email address.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
