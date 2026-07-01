"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiLoader, FiTerminal, FiShield, FiChevronRight } from "react-icons/fi";

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

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const [status, setStatus] = useState("loading");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!token) {
      setStatus("idle");
      return;
    }
    const verify = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";
        const res = await fetch(`${API}/api/auth/verify-email?token=${token}`, { method: "GET" });
        if (res.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
      }
    };
    verify();
  }, [token]);

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
        className="relative z-10 w-full max-w-md p-8 sm:p-12 rounded-3xl bg-[var(--color-surface)]/40 backdrop-blur-3xl border border-[var(--color-edge-strong)] shadow-[0_0_80px_rgba(225,29,72,0.1)] overflow-hidden group text-center"
      >
        <div className="absolute inset-0 rounded-3xl border border-[#E11D48]/0 group-hover:border-[#E11D48]/30 transition-all duration-700 pointer-events-none box-shadow-[0_0_20px_rgba(225,29,72,0)] group-hover:shadow-[0_0_40px_rgba(225,29,72,0.2)]" />
        
        <div className="flex justify-center mb-6 relative">
          <div className="absolute inset-0 bg-[#E11D48]/20 blur-xl rounded-full" />
          <div className="w-16 h-16 rounded-full border border-[#E11D48]/50 flex items-center justify-center bg-[var(--color-elevated)] relative z-10">
            {status === "loading" && <FiLoader className="text-[#E11D48] text-3xl animate-spin" />}
            {status === "success" && <FiCheckCircle className="text-[#22C55E] text-3xl" />}
            {status === "error" && <FiXCircle className="text-[#EF4444] text-3xl" />}
            {status === "idle" && <FiShield className="text-[#E11D48] text-3xl" />}
          </div>
        </div>

        <div className="text-sm text-[#E11D48] flex flex-col gap-1 items-center justify-center min-h-[40px] mb-8">
          {step === 0 && (
            <TypewriterText text="> Validating transmission vector..." delay={0.2} onComplete={() => setTimeout(() => setStep(1), 500)} />
          )}
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[var(--color-ink)] font-sans font-bold text-2xl">
              Verification Protocol
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {status === "loading" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[var(--color-muted)] font-sans">
              Analyzing token matrix...
            </motion.div>
          )}
          
          {status === "success" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <p className="text-[var(--color-muted)] font-sans">
                Transmission vector verified. Identity confirmed.
              </p>
              <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/30 hover:bg-[#E11D48] hover:text-white transition-colors font-bold uppercase tracking-wider text-sm font-sans">
                Authenticate Now <FiChevronRight />
              </Link>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="px-4 py-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-sm text-[#EF4444] font-sans flex items-center justify-center gap-2">
                <FiTerminal className="shrink-0" /> Invalid or expired token.
              </div>
              <p className="text-[var(--color-muted)] font-sans text-sm">
                Request a new verification protocol if necessary.
              </p>
              <Link href="/login" className="text-[#E11D48] hover:text-[#BE123C] transition-colors font-sans text-sm inline-flex items-center gap-1">
                <FiChevronRight className="rotate-180" /> Return to Login
              </Link>
            </motion.div>
          )}

          {status === "idle" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <p className="text-[var(--color-muted)] font-sans">
                Verification protocol dispatched. Awaiting confirmation from your transmission vector (email).
              </p>
              <Link href="/login" className="text-[#E11D48] hover:text-[#BE123C] transition-colors font-sans text-sm inline-flex items-center gap-1">
                <FiChevronRight className="rotate-180" /> Return to Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="absolute bottom-6 text-[10px] text-[var(--color-faint)] tracking-widest uppercase">
        CYBERCRUX_SYSTEMS // SECURE_NODE_V2.0
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-canvas)] flex items-center justify-center"><FiLoader className="text-[#E11D48] text-3xl animate-spin" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
