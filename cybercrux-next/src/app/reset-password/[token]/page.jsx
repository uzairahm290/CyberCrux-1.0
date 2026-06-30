"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiTerminal, FiShield, FiChevronRight, FiCheck } from "react-icons/fi";
import DOMPurify from "dompurify";

/* ── Typewriter Effect Component ── */
function TypewriterText({ text, delay = 0, onComplete }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let timeout;
    let i = 0;
    const type = () => {
      if (i < text.length) {
        setDisplayed((prev) => prev + text.charAt(i));
        i++;
        timeout = setTimeout(type, 30 + Math.random() * 50);
      } else if (onComplete) {
        onComplete();
      }
    };
    const startDelay = setTimeout(type, delay * 1000);
    return () => {
      clearTimeout(startDelay);
      clearTimeout(timeout);
    };
  }, [text, delay, onComplete]);

  return <span>{displayed}<span className="animate-pulse">_</span></span>;
}

export default function ResetPassword() {
  const router = useRouter();
  const { token } = useParams();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const sanitize = (v) => typeof v === "string" ? DOMPurify.sanitize(v, { ALLOWED_TAGS: [], ALLOWED_ATTR: [], KEEP_CONTENT: true }).trim() : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!password || !confirmPassword) return setError("New passcodes required.");
    if (password !== confirmPassword) return setError("Passcodes do not match.");

    setLoading(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";
      const res = await fetch(`${API}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: sanitize(password), confirmPassword: sanitize(confirmPassword) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to finalize recovery protocol");
      setSuccess("Identity recovery complete. Access restored.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err.message || "Failed to finalize recovery protocol");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] flex items-center justify-center relative overflow-hidden font-mono selection:bg-[#E11D48]/30">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-dot-grid opacity-20 dark:opacity-40" style={{ maskImage: "radial-gradient(circle at center, black 10%, transparent 80%)" }} />
        <div className="absolute top-1/2 left-1/2 w-[200vw] h-[200vw] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_90deg_at_50%_50%,rgba(225,29,72,0.1)_0%,transparent_50%)] animate-[spin_4s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,#E11D48_0%,transparent_60%)] opacity-10 filter blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 sm:p-12 rounded-3xl bg-[var(--color-surface)]/40 backdrop-blur-3xl border border-[var(--color-edge-strong)] shadow-[0_0_80px_rgba(225,29,72,0.1)] overflow-hidden group"
      >
        <div className="absolute inset-0 rounded-3xl border border-[#E11D48]/0 group-hover:border-[#E11D48]/30 transition-all duration-700 pointer-events-none box-shadow-[0_0_20px_rgba(225,29,72,0)] group-hover:shadow-[0_0_40px_rgba(225,29,72,0.2)]" />
        
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-6 relative">
            <div className="absolute inset-0 bg-[#E11D48]/20 blur-xl rounded-full" />
            <div className="w-14 h-14 rounded-full border border-[#E11D48]/50 flex items-center justify-center bg-[var(--color-elevated)] relative z-10">
              <FiShield className="text-[#E11D48] text-2xl" />
            </div>
          </div>
          <div className="text-sm text-[#E11D48] flex flex-col gap-1 items-center justify-center min-h-[40px]">
            {step === 0 && (
              <TypewriterText text="> Finalizing recovery protocol..." delay={0.2} onComplete={() => setTimeout(() => setStep(1), 500)} />
            )}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[var(--color-ink)] font-sans font-bold text-2xl">
                Set New Passcode
              </motion.div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
              <div className="px-4 py-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-sm text-[#EF4444] font-sans flex items-center gap-2">
                <FiTerminal className="shrink-0" /> {error}
              </div>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
              <div className="px-4 py-3 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 text-sm text-[#4ADE80] font-sans flex items-center gap-2">
                <FiCheck className="shrink-0" /> {success}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
          <div className="relative group/field">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full bg-transparent border-0 border-b border-[var(--color-edge-strong)] py-3 pl-2 pr-10 text-[var(--color-ink)] focus:ring-0 focus:border-[#E11D48] transition-colors peer"
              placeholder=" "
            />
            <label className="absolute left-2 top-3 text-[var(--color-muted)] text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#E11D48] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#E11D48] pointer-events-none">
              New Passcode
            </label>
            <div className="absolute bottom-0 left-0 h-[2px] bg-[#E11D48] w-0 peer-focus:w-full transition-all duration-500 ease-out" />
          </div>

          <div className="relative group/field">
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full bg-transparent border-0 border-b border-[var(--color-edge-strong)] py-3 pl-2 pr-10 text-[var(--color-ink)] focus:ring-0 focus:border-[#E11D48] transition-colors peer"
              placeholder=" "
            />
            <label className="absolute left-2 top-3 text-[var(--color-muted)] text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#E11D48] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#E11D48] pointer-events-none">
              Verify Passcode
            </label>
            <div className="absolute bottom-0 left-0 h-[2px] bg-[#E11D48] w-0 peer-focus:w-full transition-all duration-500 ease-out" />
          </div>

          <button
            type="submit"
            disabled={loading || step === 0}
            className="w-full relative overflow-hidden bg-[var(--color-elevated)] border border-[var(--color-edge-strong)] hover:border-[#E11D48]/50 hover:shadow-[0_0_20px_rgba(225,29,72,0.3)] text-[var(--color-ink)] py-4 rounded-xl font-bold tracking-widest uppercase text-sm transition-all group/btn disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            <div className="absolute inset-0 bg-[#E11D48]/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-[#E11D48]" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FiLock className="text-[#E11D48]" /> Update Identity
                </>
              )}
            </span>
          </button>
        </form>

      </motion.div>
      
      <div className="absolute bottom-6 text-[10px] text-[var(--color-faint)] tracking-widest uppercase">
        CYBERCRUX_SYSTEMS // SECURE_NODE_V2.0
      </div>
    </div>
  );
}