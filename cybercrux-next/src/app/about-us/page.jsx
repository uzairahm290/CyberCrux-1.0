"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { BiBrain, BiRocket, BiShield, BiGroup } from 'react-icons/bi';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import { FiTerminal, FiCrosshair, FiCpu, FiRadio, FiCheckCircle } from 'react-icons/fi';
import MainNav from "@/layouts/MainNav";
import Footer from "@/layouts/Footer";

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

const values = [
  {
    icon: <BiBrain />,
    title: "AI Protocol Integration",
    description: "Advanced heuristics provide actionable feedback, eliminating redundant study loops.",
  },
  {
    icon: <BiShield />,
    title: "Combat Readiness",
    description: "Our primary directive is ensuring operators are battle-ready for intense technical interviews.",
  },
  {
    icon: <BiRocket />,
    title: "Open Access",
    description: "Critical intel should not be paywalled. Core resources remain freely accessible.",
  },
  {
    icon: <BiGroup />,
    title: "Decentralized Intel",
    description: "A community-driven network sharing real-time tactical updates from the field.",
  }
];

const team = [
  {
    name: "Hassan Ali",
    role: "Lead Architect",
    callsign: "GHOST_PROTOCOL",
    description: "Architecting the core infrastructure and neural pathways of the CyberCrux platform.",
    image: "/hacker.png",
    social: { linkedin: "#", github: "#", twitter: "#" }
  },
  {
    name: "Ayesha Khan",
    role: "Comms Director",
    callsign: "ECHO_ACTUAL",
    description: "Maintaining global communications and orchestrating community intel drops.",
    image: "/logo.png",
    social: { linkedin: "#", github: "#", twitter: "#" }
  },
  {
    name: "Usman Zafar",
    role: "Simulations Lead",
    callsign: "PROXY_ZERO",
    description: "Designing the high-stress, real-world CTF scenarios to forge elite operators.",
    image: "/hacker.png",
    social: { linkedin: "#", github: "#", twitter: "#" }
  },
  {
    name: "Sara Ahmed",
    role: "Interface Designer",
    callsign: "NEON_VIPER",
    description: "Constructing the tactical HUDs and fluid interfaces that power our command centers.",
    image: "/logo.png",
    social: { linkedin: "#", github: "#", twitter: "#" }
  }
];

export default function AboutUs() {
  const [step, setStep] = useState(0);

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] selection:bg-[#E11D48]/30 overflow-hidden font-sans">
      <MainNav />
      
      {/* ── Mission Briefing Hero ── */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-dot-grid opacity-20" style={{ maskImage: "radial-gradient(circle at center, black 10%, transparent 80%)" }} />
          <div className="absolute top-1/2 left-1/2 w-[100vw] h-[100vw] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(225,29,72,0.05)_0%,transparent_60%)] animate-[spin_10s_linear_infinite]" />
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E11D48]/30 bg-[#E11D48]/10 backdrop-blur-xl mb-8 font-mono">
            <FiRadio className="text-[#E11D48] animate-pulse" />
            <span className="text-sm font-semibold text-[#E11D48] tracking-widest uppercase">Encrypted Transmission</span>
          </div>

          <div className="text-4xl md:text-6xl font-black mb-8 tracking-tighter min-h-[120px] md:min-h-[80px] text-[#E11D48]">
            {step === 0 && <TypewriterText text="> DECRYPTING DOSSIER..." delay={0.2} onComplete={() => setTimeout(() => setStep(1), 500)} />}
            {step === 1 && <TypewriterText text="> INITIATING OPERATION CYBERCRUX." onComplete={() => setTimeout(() => setStep(2), 500)} />}
            {step === 2 && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[var(--color-ink)]">Task Force CyberCrux</motion.span>}
          </div>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: step === 2 ? 1 : 0 }} 
            className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto font-light leading-relaxed"
          >
            We are operators building the ultimate proving ground. Our mission: forge raw talent into interview-ready cybersecurity professionals capable of defending global networks.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Mission Log (Timeline) ── */}
      <section className="py-24 px-6 relative z-10 bg-[var(--color-surface)]/30 border-t border-[var(--color-edge)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <FiTerminal className="text-[#E11D48] text-3xl" />
            <h2 className="text-3xl font-black uppercase tracking-widest text-[var(--color-ink)]">System Log / Directives</h2>
          </div>

          <div className="relative border-l-2 border-[#E11D48]/20 pl-8 space-y-16 font-mono">
            {/* Log Entry 1 */}
            <div className="relative">
              <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#E11D48] border-4 border-[var(--color-canvas)]" />
              <div className="text-sm text-[#E11D48] mb-2 font-bold tracking-widest">TIMESTAMP: 0001 // THE OBSERVATION</div>
              <h3 className="text-2xl font-bold text-[var(--color-ink)] mb-4 font-sans">A Flaw in the Architecture</h3>
              <p className="text-[var(--color-muted)] font-sans leading-relaxed">
                Standard education protocols were failing. Raw recruits possessed theoretical intel but lacked the tactical, hands-on experience required to survive real-world technical interrogations (interviews). The system needed an overhaul.
              </p>
            </div>

            {/* Log Entry 2 */}
            <div className="relative">
              <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[var(--color-surface)] border-2 border-[#E11D48]" />
              <div className="text-sm text-[#E11D48] mb-2 font-bold tracking-widest">TIMESTAMP: 0002 // THE DEPLOYMENT</div>
              <h3 className="text-2xl font-bold text-[var(--color-ink)] mb-4 font-sans">Operation: Crucible</h3>
              <p className="text-[var(--color-muted)] font-sans leading-relaxed">
                We deployed an AI-driven sandbox. Combining scenario-based interrogation, localized virtual labs, and complete operational roadmaps. A single nexus point designed to accelerate combat readiness.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                {['Zero-cost access established', 'AI Voice analysis online', 'Mission roadmaps compiled'].map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm text-[var(--color-faint)]">
                    <FiCheckCircle className="text-[#22C55E]" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cinematic Team Dossiers ── */}
      <section className="py-32 px-6 relative z-10 border-t border-[var(--color-edge)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[var(--color-ink)] mb-6">The Operators.</h2>
            <p className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto font-light">
              Architects of the crucible. Highly specialized assets executing the CyberCrux directive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="group relative rounded-2xl bg-[var(--color-surface)]/50 backdrop-blur-xl border border-[var(--color-edge-strong)] overflow-hidden">
                {/* ID Badge Header */}
                <div className="h-2 bg-[#E11D48]" />
                <div className="p-6 pb-0">
                  <div className="text-[10px] text-[var(--color-faint)] font-mono tracking-widest uppercase mb-4 flex justify-between">
                    <span>ID: {Math.random().toString(36).substring(2, 8)}</span>
                    <span className="text-[#E11D48]">CLEARANCE: ALPHA</span>
                  </div>
                  
                  {/* Portrait with Scanner Effect */}
                  <div className="relative w-32 h-32 mx-auto mb-6 rounded-lg overflow-hidden border border-[var(--color-edge)] bg-[var(--color-elevated)]">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                    {/* Scanner line on hover */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-[#E11D48] shadow-[0_0_10px_#E11D48] opacity-0 group-hover:opacity-100 group-hover:animate-scan" />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-[var(--color-ink)]">{member.name}</h3>
                    <p className="text-xs font-mono text-[#E11D48] tracking-widest mt-1 mb-4">{member.callsign}</p>
                    <p className="text-[var(--color-muted)] text-sm mb-6 min-h-[60px]">{member.description}</p>
                  </div>
                </div>

                {/* Social Links Slide Up */}
                <div className="bg-[var(--color-elevated)] border-t border-[var(--color-edge)] p-4 flex justify-center gap-6 translate-y-2 opacity-50 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <a href={member.social.linkedin} className="text-[var(--color-muted)] hover:text-[#E11D48] transition-colors"><FaLinkedin className="text-xl" /></a>
                  <a href={member.social.github} className="text-[var(--color-muted)] hover:text-[#E11D48] transition-colors"><FaGithub className="text-xl" /></a>
                  <a href={member.social.twitter} className="text-[var(--color-muted)] hover:text-[#E11D48] transition-colors"><FaTwitter className="text-xl" /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Data-Driven Core Values ── */}
      <section className="py-24 px-6 relative z-10 bg-gradient-to-t from-[var(--color-surface)] to-[var(--color-canvas)] border-t border-[var(--color-edge)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-widest text-[#E11D48] mb-4">Core Directives</h2>
            <p className="text-[var(--color-muted)]">The foundational protocols driving our logic.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, i) => (
              <div key={i} className="relative flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-elevated)] border border-[var(--color-edge-strong)] flex items-center justify-center text-2xl text-[var(--color-muted)] group-hover:text-[#E11D48] group-hover:border-[#E11D48] transition-colors mb-6 shadow-lg relative z-10">
                  {val.icon}
                </div>
                {/* Connecting lines for desktop */}
                {i !== values.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] right-[-40%] h-px bg-gradient-to-r from-[#E11D48]/30 to-transparent z-0" />
                )}
                <h3 className="text-lg font-bold text-[var(--color-ink)] mb-2">{val.title}</h3>
                <p className="text-sm text-[var(--color-muted)] px-4">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
