"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  BiBrain, BiMicrophone, BiMap, BiBookOpen, BiWrench, BiLaptop, BiCode, BiRocket, BiCheck, BiMedal, BiAward, BiPlay, BiTrendingUp
} from 'react-icons/bi';
import { FaFire, FaUser, FaArrowRight, FaCrosshairs } from 'react-icons/fa';
import { FiShield, FiCpu, FiActivity, FiCrosshair, FiTerminal } from 'react-icons/fi';
import MainNav from "@/layouts/MainNav";
import Footer from "@/layouts/Footer";

/* ─── 3D Tilt Card Component ─── */
function TiltCard({ children, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative group ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}

const features = [
  {
    id: 'scenarios',
    title: 'Scenario-Based Intel',
    subtitle: 'Real Interview Protocols',
    description: 'Engage with realistic cybersecurity scenarios designed to emulate intense interview environments. Gain tactical feedback from our proprietary AI.',
    icon: <BiBrain />,
    metrics: ['500+ Scenarios', 'Real-time AI Analysis'],
    colSpan: 'md:col-span-2'
  },
  {
    id: 'ai-interviews',
    title: 'Voice Interrogation AI',
    subtitle: 'Verbal Defense Practice',
    description: 'Interface directly with our advanced Voice AI. Simulate high-pressure interview environments to harden your verbal responses.',
    icon: <BiMicrophone />,
    metrics: ['Low Latency', 'Tone Analysis'],
    colSpan: 'md:col-span-1'
  },
  {
    id: 'roadmaps',
    title: 'Tactical Roadmaps',
    subtitle: 'Career Progression Paths',
    description: 'Access classified learning paths detailing exact resource coordinates for every cybersecurity role.',
    icon: <BiMap />,
    metrics: ['15+ Pathways', 'Verified Assets'],
    colSpan: 'md:col-span-1'
  },
  {
    id: 'labs',
    title: 'Infrastructure Labs',
    subtitle: 'Deploy and Defend',
    description: 'Construct resilient home labs. Our step-by-step blueprints allow you to build resume-worthy architectures safely.',
    icon: <BiLaptop />,
    metrics: ['25+ Blueprints', 'Cloud Native'],
    colSpan: 'md:col-span-2'
  },
  {
    id: 'tools',
    title: 'Gamified Toolkits',
    subtitle: 'Weaponize Your Skills',
    description: 'Master industry-standard penetration testing tools within our interactive, gamified sandbox environments.',
    icon: <BiWrench />,
    metrics: ['Interactive', 'Safe Sandbox'],
    colSpan: 'md:col-span-1'
  },
  {
    id: 'books',
    title: 'Encrypted Archives',
    subtitle: 'Top-Tier Literature',
    description: 'Download freely available cybersecurity literature. A curated collection to reinforce your theoretical foundation.',
    icon: <BiBookOpen />,
    metrics: ['50+ Volumes', 'PDF / EPUB'],
    colSpan: 'md:col-span-2'
  }
];

export default function FeaturesPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] selection:bg-[#E11D48]/30 selection:text-white overflow-hidden">
      <MainNav />
      
      {/* ── Hero: The Holographic Blueprint ── */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center justify-center min-h-[70vh]">
        {/* Holographic Background Elements */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid opacity-20" style={{ maskImage: "radial-gradient(circle at center, black 10%, transparent 80%)" }} />
          
          {/* Blueprint Rings */}
          <motion.div 
            animate={{ rotateZ: 360 }} 
            transition={{ duration: 60, ease: "linear", repeat: Infinity }}
            className="absolute w-[800px] h-[800px] rounded-full border border-[#E11D48]/10"
            style={{ borderStyle: 'dashed' }}
          />
          <motion.div 
            animate={{ rotateZ: -360 }} 
            transition={{ duration: 80, ease: "linear", repeat: Infinity }}
            className="absolute w-[600px] h-[600px] rounded-full border border-[#E11D48]/20"
          />
          <div className="absolute w-px h-[1000px] bg-gradient-to-b from-transparent via-[#E11D48]/30 to-transparent" />
          <div className="absolute h-px w-[1000px] bg-gradient-to-r from-transparent via-[#E11D48]/30 to-transparent" />
          
          <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,#E11D48_0%,transparent_50%)] opacity-10 filter blur-[80px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E11D48]/30 bg-[#E11D48]/10 backdrop-blur-xl mb-8">
            <FiCrosshair className="text-[#E11D48] animate-spin-slow" />
            <span className="text-sm font-semibold text-[#E11D48] tracking-widest uppercase">System Capabilities Matrix</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">
            The Complete Arsenal for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F43F5E] via-[#E11D48] to-[#BE123C]">
              Modern Operators.
            </span>
          </h1>
          <p className="text-xl text-[var(--color-muted)] mb-12 font-light">
            Equip yourself with elite, AI-driven tools. Simulate the pressure. Hard-wire your responses. Ace the interview.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-sm text-[var(--color-ink)] font-mono border border-[var(--color-edge-strong)] bg-[var(--color-surface)]/50 px-4 py-2 rounded-lg">
              <FiTerminal className="text-[#E11D48]" /> STATUS: ONLINE
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-ink)] font-mono border border-[var(--color-edge-strong)] bg-[var(--color-surface)]/50 px-4 py-2 rounded-lg">
              <FiActivity className="text-[#22C55E]" /> LATENCY: 12ms
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Asymmetrical Bento Grid Arsenal ── */}
      <section className="py-24 px-6 relative z-10 bg-[var(--color-canvas)] border-t border-[var(--color-edge)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <TiltCard key={feature.id} className={feature.colSpan}>
                <div className="h-full p-8 rounded-3xl bg-[var(--color-elevated)] border border-[var(--color-edge-strong)] hover:border-[#E11D48]/50 transition-colors relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E11D48]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-[#E11D48]/10 border border-[#E11D48]/20 flex items-center justify-center mb-6 text-[#E11D48] text-3xl">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--color-ink)] mb-2">{feature.title}</h3>
                    <p className="text-sm font-mono text-[#E11D48] uppercase tracking-wider mb-4">{feature.subtitle}</p>
                    <p className="text-[var(--color-muted)] leading-relaxed mb-8">{feature.description}</p>
                  </div>
                  
                  <div className="relative z-10 flex gap-4 mt-auto">
                    {feature.metrics.map(m => (
                      <div key={m} className="px-3 py-1 rounded-md bg-[var(--color-canvas)] border border-[var(--color-edge)] text-xs text-[var(--color-faint)] font-mono">
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gamification Radar Dashboard ── */}
      <section className="py-32 px-6 relative z-10 border-t border-[var(--color-edge)] bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-canvas)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-black text-[var(--color-ink)] mb-6">Operate with Precision.</h2>
            <p className="text-xl text-[var(--color-muted)] mb-10 font-light">
              Track your telemetry. Maintain streaks to build resilience. Climb the global ladder to prove your superiority in the field.
            </p>
            
            <div className="space-y-6">
              {[
                { title: 'Telemetry Streaks', desc: 'Maintain daily engagement protocols.', icon: <FaFire className="text-[#F59E0B]" />, val: '7 Day Streak' },
                { title: 'Global Ladder', desc: 'Compare combat readiness against peers.', icon: <BiMedal className="text-[#38BDF8]" />, val: 'Rank #8' },
                { title: 'Asset Badges', desc: 'Unlock specialized tactical certifications.', icon: <BiAward className="text-[#A855F7]" />, val: '25 Assets' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-elevated)] border border-[var(--color-edge)]">
                  <div className="w-12 h-12 rounded-lg bg-[var(--color-canvas)] flex items-center justify-center text-xl border border-[var(--color-edge)]">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[var(--color-ink)]">{item.title}</h4>
                    <p className="text-sm text-[var(--color-muted)]">{item.desc}</p>
                  </div>
                  <div className="px-3 py-1 rounded bg-[var(--color-canvas)] border border-[var(--color-edge)] text-xs font-mono font-bold text-[var(--color-ink)]">
                    {item.val}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-md relative perspective-1000">
            <motion.div 
              animate={{ rotateZ: 360 }}
              transition={{ duration: 20, ease: "linear", repeat: Infinity }}
              className="w-full aspect-square rounded-full border border-[#E11D48]/30 relative flex items-center justify-center bg-[radial-gradient(circle,rgba(225,29,72,0.05)_0%,transparent_70%)]"
            >
              <div className="w-3/4 h-3/4 rounded-full border border-[#E11D48]/20 absolute" style={{ borderStyle: 'dashed' }} />
              <div className="w-1/2 h-1/2 rounded-full border border-[#E11D48]/40 absolute" />
              {/* Radar sweep */}
              <div className="absolute top-1/2 left-1/2 w-1/2 h-2 origin-left bg-gradient-to-r from-transparent to-[#E11D48] opacity-50 blur-[2px]" />
              
              <FiShield className="text-[#E11D48] text-6xl relative z-10 drop-shadow-[0_0_15px_rgba(225,29,72,0.8)]" />
              
              {/* Fake target blips */}
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#22C55E] rounded-full shadow-[0_0_10px_#22C55E]" />
              <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-[#E11D48] rounded-full shadow-[0_0_10px_#E11D48]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-32 px-6 relative z-10 text-center border-t border-[var(--color-edge)]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#E11D48]/10 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl font-black text-[var(--color-ink)] mb-6">Initialize Deployment.</h2>
          <p className="text-xl text-[var(--color-muted)] mb-10 max-w-2xl mx-auto">
            Join the ranks of thousands of security professionals actively hardening their skillsets on our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="group relative overflow-hidden bg-[#E11D48] px-8 py-4 rounded-xl text-white font-bold tracking-widest uppercase text-sm hover:shadow-[0_0_40px_rgba(225,29,72,0.4)] transition-all">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10 flex items-center gap-2">
                <FiCrosshair /> Engage System
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}