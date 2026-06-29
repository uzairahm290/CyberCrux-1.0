"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import MainNav from "@/layouts/MainNav";
import Footer from "@/layouts/Footer";
import {
  FiShield, FiZap, FiMap, FiBook, FiTool, FiUsers,
  FiAward, FiBarChart2, FiCheck, FiArrowRight,
  FiTerminal, FiLock, FiActivity, FiServer, FiEye
} from "react-icons/fi";
import {
  BiBrain, BiTrophy, BiTargetLock, BiRocket, BiCodeAlt
} from "react-icons/bi";
import { FaFire, FaAws, FaGoogle, FaMicrosoft, FaSlack, FaStripe, FaCloud } from "react-icons/fa";

/* ─── Variants ─────────────────────────────── */
const fadeUp   = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };
const stagger  = { hidden: { opacity: 0 }, show:  { opacity: 1, transition: { staggerChildren: 0.12 } } };

/* ─── Animated counter ──────────────────────── */
function Counter({ end, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // Quartic ease out
      setVal(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── 3D Tilt Card ──────────────────────────── */
function TiltCard({ children, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative transition-shadow duration-300 hover:shadow-2xl ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}

/* ─── Main Landing Page Component ───────────── */
export default function LandingPage() {
  const [annual, setAnnual] = useState(false);
  
  // Mouse tracking for hero glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] overflow-x-hidden transition-colors duration-300 selection:bg-[#E11D48]/30 selection:text-white">
      <MainNav />

      {/* ── 1. The "Wow" Hero Section ────────────────────────────── */}
      <section 
        className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 flex flex-col items-center justify-center overflow-hidden"
        onMouseMove={handleHeroMouseMove}
      >
        {/* Dynamic Mouse Glow */}
        <motion.div
          className="pointer-events-none absolute w-[800px] h-[800px] rounded-full opacity-40 z-0 hidden md:block"
          style={{
            x: useTransform(mouseX, value => value - 400),
            y: useTransform(mouseY, value => value - 400),
            background: "radial-gradient(circle, rgba(225,29,72,0.12) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />

        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 mix-blend-screen dark:mix-blend-lighten">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-20 animate-orb"
            style={{ background: "radial-gradient(circle, #E11D48 0%, transparent 60%)", filter: "blur(100px)" }}
          />
        </div>

        {/* Grid Background */}
        <div
          className="pointer-events-none absolute inset-0 bg-dot-grid opacity-20 dark:opacity-30 z-0"
          style={{ maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 100%)" }}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(225,29,72,0.3)] bg-[rgba(225,29,72,0.05)] mb-8 backdrop-blur-xl shadow-[0_0_20px_rgba(225,29,72,0.1)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E11D48]"></span>
            </span>
            <span className="text-sm font-semibold text-[#E11D48] tracking-widest uppercase">
              CyberCrux 2.0 is Live
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-6xl sm:text-7xl md:text-[6rem] font-black leading-[1] tracking-tighter mb-8"
          >
            The Ultimate Platform for <br className="hidden md:block" />
            <span
              className="relative inline-block mt-2 px-4"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#F43F5E] via-[#E11D48] to-[#BE123C] blur-2xl opacity-20 rounded-full" />
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[#F43F5E] via-[#E11D48] to-[#BE123C]">
                Security Operations.
              </span>
            </span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            variants={fadeUp}
            className="text-xl md:text-2xl text-[var(--color-muted)] max-w-3xl mx-auto mb-12 leading-relaxed font-light"
          >
            Train your team, test your defenses, and master the art of cybersecurity with our AI-driven simulated environments.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/signup"
              className="group relative overflow-hidden btn-primary w-full sm:w-auto px-8 py-4 text-lg font-bold shadow-[0_0_40px_rgba(225,29,72,0.4)] hover:shadow-[0_0_60px_rgba(225,29,72,0.6)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10 flex items-center gap-2">
                Start Free Trial <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/demo"
              className="group w-full sm:w-auto btn-ghost px-8 py-4 text-lg font-semibold border-[rgba(255,255,255,0.1)] bg-white/5 hover:bg-white/10 backdrop-blur-md"
            >
              <span className="flex items-center gap-2">
                <FiTerminal /> View Demo
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* The Dashboard Screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
          className="relative z-20 w-full max-w-6xl px-4 perspective-1000"
        >
          <div className="relative rounded-t-3xl rounded-b-xl overflow-hidden border border-[var(--color-edge-strong)] shadow-[0_-20px_80px_rgba(225,29,72,0.25)]">
            {/* Browser chrome bar */}
            <div className="h-10 bg-[#0f0f0f] border-b border-[rgba(255,255,255,0.08)] flex items-center px-4 gap-2 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="mx-auto text-xs text-[var(--color-muted)] font-mono flex items-center gap-2">
                <FiLock className="text-[#E11D48]" /> app.cybercrux.io/dashboard
              </div>
            </div>
            {/* Actual dashboard screenshot */}
            <Image
              src="/Dashboard.png"
              alt="CyberCrux Dashboard"
              width={3584}
              height={2002}
              className="w-full h-auto block"
              priority
            />
            {/* Fade out at bottom to blend into page */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-canvas)] via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* ── 2. Trusted By Marquee ────────────────────────────── */}
      <section className="py-10 border-y border-[var(--color-edge)] bg-[var(--color-surface)] relative overflow-hidden z-10">
        <div className="text-center mb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)]">
            Trusted by security teams at industry leaders
          </p>
        </div>
        <div className="relative flex overflow-hidden w-full group">
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[var(--color-surface)] to-transparent z-10" />
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[var(--color-surface)] to-transparent z-10" />
          
          <div className="flex space-x-16 items-center animate-scroll w-max group-hover:[animation-play-state:paused]">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="flex space-x-16 items-center px-8">
                <FaAws className="text-4xl text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors" />
                <FaGoogle className="text-4xl text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors" />
                <FaMicrosoft className="text-4xl text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors" />
                <FaSlack className="text-4xl text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors" />
                <FaStripe className="text-4xl text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors" />
                <FaCloud className="text-4xl text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Asymmetrical Bento Features ───────────────────────── */}
      <section className="py-32 px-6 bg-[var(--color-canvas)] relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--color-ink)] mb-6 tracking-tight">
              A Complete Arsenal for <br />
              <span className="text-[#E11D48]">Modern Defenders.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[var(--color-muted)] text-xl md:text-2xl max-w-3xl mx-auto font-light">
              Everything you need to analyze threats, simulate attacks, and harden your infrastructure in one unified platform.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 max-w-6xl mx-auto">
            {/* Huge Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2 md:row-span-2 rounded-3xl p-8 bg-[var(--color-elevated)] border border-[var(--color-edge)] relative overflow-hidden group hover:border-[rgba(225,29,72,0.4)] transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#E11D48]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-[rgba(225,29,72,0.1)] border border-[rgba(225,29,72,0.2)] flex items-center justify-center mb-6 text-[#E11D48]">
                <BiBrain className="text-3xl" />
              </div>
              <h3 className="text-3xl font-bold text-[var(--color-ink)] mb-4">AI Threat Intelligence</h3>
              <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-8">
                Our proprietary AI analyzes millions of signals daily, providing you with real-time feedback and remediation strategies before vulnerabilities are exploited.
              </p>
              <div className="w-full h-48 rounded-xl bg-[var(--color-canvas)] border border-[var(--color-edge)] p-4 flex items-end relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <div className="w-full flex items-end gap-2 h-full opacity-80">
                  {[40, 70, 30, 90, 50, 80, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-[#E11D48] to-[#F43F5E] rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Medium Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:col-span-2 rounded-3xl p-8 bg-[var(--color-elevated)] border border-[var(--color-edge)] relative overflow-hidden group hover:border-[rgba(225,29,72,0.4)] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] flex items-center justify-center mb-4 text-[#22C55E]">
                <BiCodeAlt className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-ink)] mb-2">Automated Red Teaming</h3>
              <p className="text-base text-[var(--color-muted)]">
                Launch sophisticated, multi-stage attack simulations with a single click to continuously test your defenses.
              </p>
            </motion.div>

            {/* Small Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl p-8 bg-[var(--color-elevated)] border border-[var(--color-edge)] relative overflow-hidden group hover:border-[rgba(225,29,72,0.4)] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.2)] flex items-center justify-center mb-4 text-[#38BDF8]">
                <FiServer className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-ink)] mb-2">Cloud Native</h3>
              <p className="text-sm text-[var(--color-muted)]">Seamless AWS, GCP, and Azure integration.</p>
            </motion.div>

            {/* Small Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-3xl p-8 bg-[var(--color-elevated)] border border-[var(--color-edge)] relative overflow-hidden group hover:border-[rgba(225,29,72,0.4)] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] flex items-center justify-center mb-4 text-[#F59E0B]">
                <FiEye className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-ink)] mb-2">Total Visibility</h3>
              <p className="text-sm text-[var(--color-muted)]">Map your entire attack surface instantly.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4. Interactive How It Works ────────────────────────────── */}
      <section className="py-32 px-6 border-t border-[var(--color-edge)] bg-[var(--color-surface)] relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[var(--color-ink)] mb-6">Built for Speed and Scale.</h2>
            <p className="text-[var(--color-muted)] text-xl max-w-2xl mx-auto">Deploy in minutes, not months. Our agentless architecture means zero friction.</p>
          </div>

          <div className="space-y-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E11D48] before:to-transparent">
            {[
              { step: "01", title: "Connect Infrastructure", desc: "Link your cloud environments or on-prem assets via our read-only API integration. No agents required." },
              { step: "02", title: "Automated Mapping", desc: "Our engine discovers every asset, endpoint, and vulnerability, mapping the exact attack paths hackers would use." },
              { step: "03", title: "Continuous Remediation", desc: "Receive prioritized alerts with actionable code snippets to fix critical flaws before they make headlines." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                {/* Icon Marker */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--color-surface)] bg-[#E11D48] shadow-[0_0_20px_#E11D48] text-white font-bold text-sm absolute left-0 md:left-1/2 -translate-x-1/2 z-10">
                  {item.step}
                </div>
                {/* Content Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-[var(--color-elevated)] border border-[var(--color-edge)] group-hover:border-[#E11D48]/50 transition-colors shadow-lg">
                  <h3 className="text-2xl font-bold text-[var(--color-ink)] mb-3">{item.title}</h3>
                  <p className="text-[var(--color-muted)] leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Pricing ───────────────────────────────────── */}
      <section className="py-32 px-6 bg-[var(--color-canvas)] border-t border-[var(--color-edge)] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[var(--color-ink)] mb-6">Simple, transparent pricing.</h2>
            <p className="text-[var(--color-muted)] text-xl mb-10">Scale your security as you grow. No hidden fees.</p>
            
            <div className="inline-flex items-center p-1 rounded-xl bg-[var(--color-elevated)] border border-[var(--color-edge)]">
              <button onClick={() => setAnnual(false)} className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${!annual ? "bg-[#E11D48] text-white" : "text-[var(--color-muted)]"}`}>Monthly</button>
              <button onClick={() => setAnnual(true)} className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${annual ? "bg-[#E11D48] text-white" : "text-[var(--color-muted)]"}`}>Annually</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="rounded-3xl p-8 bg-[var(--color-elevated)] border border-[var(--color-edge)] flex flex-col mt-4 mb-4">
              <h3 className="text-xl font-bold text-[var(--color-ink)] mb-2">Starter</h3>
              <p className="text-[var(--color-muted)] text-sm mb-6">For small teams starting out.</p>
              <div className="mb-8">
                <span className="text-5xl font-black text-[var(--color-ink)]">${annual ? '29' : '39'}</span>
                <span className="text-[var(--color-muted)]">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {["5 Users", "Basic Vulnerability Scans", "Community Support", "1 Integration"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-[var(--color-muted)]"><FiCheck className="text-[#22C55E]" /> {f}</li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl font-bold text-white bg-[var(--color-surface)] border border-[var(--color-edge)] hover:bg-[#E11D48] transition-colors">Get Started</button>
            </div>

            {/* Pro Plan */}
            <div className="rounded-3xl p-8 bg-gradient-to-b from-[#1A1A24] to-[var(--color-surface)] border border-[#E11D48] shadow-[0_20px_80px_-20px_rgba(225,29,72,0.4)] flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#F43F5E] to-[#E11D48] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">Most Popular</div>
              <h3 className="text-xl font-bold text-[#E11D48] mb-2">Professional</h3>
              <p className="text-[var(--color-muted)] text-sm mb-6">For growing organizations.</p>
              <div className="mb-8">
                <span className="text-5xl font-black text-[var(--color-ink)]">${annual ? '99' : '129'}</span>
                <span className="text-[var(--color-muted)]">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {["Unlimited Users", "Continuous AI Scans", "Priority Support", "All Integrations", "Advanced Reporting"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-[var(--color-ink)]"><FiCheck className="text-[#E11D48]" /> {f}</li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl font-bold text-white bg-[#E11D48] hover:bg-[#BE123C] shadow-lg shadow-[#E11D48]/30 transition-all">Start 14-Day Trial</button>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-3xl p-8 bg-[var(--color-elevated)] border border-[var(--color-edge)] flex flex-col mt-4 mb-4">
              <h3 className="text-xl font-bold text-[var(--color-ink)] mb-2">Enterprise</h3>
              <p className="text-[var(--color-muted)] text-sm mb-6">For mission-critical ops.</p>
              <div className="mb-8">
                <span className="text-5xl font-black text-[var(--color-ink)]">Custom</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {["Dedicated Infrastructure", "Custom SLA", "24/7 Phone Support", "On-Prem Deployment", "Dedicated Success Manager"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-[var(--color-muted)]"><FiCheck className="text-[#22C55E]" /> {f}</li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl font-bold text-white bg-[var(--color-surface)] border border-[var(--color-edge)] hover:bg-[#E11D48] transition-colors">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────── */}
      <section className="py-32 px-6 relative z-10 overflow-hidden bg-[var(--color-surface)] border-t border-[var(--color-edge)]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#E11D48]/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-[var(--color-ink)] leading-tight mb-6 tracking-tight">
              Ready to secure your future?
            </h2>
            <p className="text-[var(--color-muted)] text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light">
              Join the elite security teams protecting the world's most sensitive data.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="btn-primary px-10 py-5 text-lg font-bold shadow-xl shadow-[#E11D48]/30 hover:scale-105 transition-transform">
                Get Started Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
