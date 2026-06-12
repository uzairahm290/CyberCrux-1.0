import React, { useState, useEffect, useCallback } from "react";
import MainNav from "../../layouts/MainNav";
import Footer from "../../layouts/Footer";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Particles from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";
import {
  BiBrain, BiMicrophone, BiMap, BiBookOpen, BiWrench, BiLaptop, BiCode, BiTrophy, BiRocket, BiCheck, BiGroup, BiMedal, BiPlay, BiUser
} from 'react-icons/bi';
import { FaFire, FaUser } from 'react-icons/fa';
import { Link } from "react-router-dom";

// Hook for mouse tracking (Spotlight effect)
function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = ev => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return mousePosition;
}

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const mousePosition = useMousePosition();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const features = [
    { icon: BiBrain, title: "AI Explanations", desc: "Instant, clear answers for every scenario." },
    { icon: BiMicrophone, title: "Mock AI Interviews", desc: "Voice-based, real interview practice." },
    { icon: BiMap, title: "Roadmaps", desc: "Step-by-step learning paths for every role." },
    { icon: BiBookOpen, title: "Free Books", desc: "Download top cybersecurity books." },
    { icon: BiWrench, title: "Gamified Tools", desc: "Hands-on labs and tool mastery." },
    { icon: BiLaptop, title: "Home Labs", desc: "Build labs, boost your resume." },
    { icon: BiCode, title: "Project Ideas", desc: "Showcase-worthy project suggestions." },
    { icon: BiTrophy, title: "CTF (Coming Soon)", desc: "Compete in Capture The Flag events." },
  ];

  const testimonials = [
    { name: "Aarav S.", text: "CyberCrux made me interview-ready in weeks! The AI interviews are a game changer.", avatar: <FaUser className="w-8 h-8 text-blue-400" /> },
    { name: "Priya K.", text: "The scenario questions are so real. I landed my first SOC job thanks to CyberCrux!", avatar: <FaUser className="w-8 h-8 text-pink-400" /> },
    { name: "Rohan M.", text: "Streaks and leaderboards kept me motivated. Best cybersecurity prep platform!", avatar: <FaUser className="w-8 h-8 text-green-400" /> },
  ];

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div className="flex flex-col bg-black text-white min-h-screen font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      <MainNav />
      
      {/* Interactive Cursor Spotlight */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
        }}
      />

      {/* Particle Network Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 z-0"
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "grab" },
            },
            modes: { grab: { distance: 150, links: { opacity: 0.5 } } }
          },
          particles: {
            color: { value: "#3b82f6" },
            links: { color: "#8b5cf6", distance: 150, enable: true, opacity: 0.2, width: 1 },
            move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 0.5, straight: false },
            number: { density: { enable: true, area: 800 }, value: 40 },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 2 } },
          },
          detectRetina: true,
        }}
      />

      {/* Dynamic Animated Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/20 blur-[150px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-fuchsia-600/20 blur-[150px]"
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] py-16 px-4 text-center">
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-4xl mx-auto flex flex-col items-center">
          
          <motion.div variants={fadeInUp} className="mb-6 relative group">
            {/* Animated Conic Border for Badge */}
            <div className="absolute -inset-[1px] bg-[conic-gradient(from_0deg,transparent_0_340deg,#06b6d4_360deg)] animate-spin-slow rounded-full opacity-50"></div>
            <div className="relative flex items-center gap-3 px-4 py-2 rounded-full bg-black/80 backdrop-blur-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <span className="text-sm font-medium tracking-wide text-cyan-100 uppercase">
                Next-Gen Cybersecurity Platform
              </span>
            </div>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white">
              Master Security.
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
              Zero Distractions.
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl font-light leading-relaxed">
            Stop watching tutorials. Experience highly interactive, sandboxed practice labs and realistic AI interviews to land your dream security job.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="w-full max-w-md relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <form className="relative flex flex-col sm:flex-row gap-2 bg-black/80 backdrop-blur-xl p-2 rounded-2xl border border-white/5 shadow-2xl">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)} 
                placeholder="Enter your email address" 
                className="w-full px-4 py-3 bg-transparent text-white placeholder:text-gray-500 focus:outline-none text-base" 
              />
              <Link to="/signup" className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95">
                <BiRocket className="w-5 h-5" />
                <span>Initialize</span>
              </Link>
            </form>
          </motion.div>

        </motion.div>
      </section>

      {/* BENTO BOX FEATURES GRID */}
      <section className="relative z-10 py-32 px-4 border-t border-white/5 bg-black/50 backdrop-blur-3xl">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">The Arsenal</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">Equip yourself with the tools designed to get you hired.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div 
                key={f.title} 
                variants={scaleUp}
                whileHover={{ y: -5 }}
                className={`relative group ${i === 0 || i === 3 ? 'md:col-span-2' : ''}`}
              >
                {/* Conic Gradient Animated Border */}
                <div className="absolute -inset-[1px] rounded-3xl bg-[conic-gradient(from_0deg,transparent_0_240deg,#06b6d4_300deg,#d946ef_360deg)] opacity-0 group-hover:opacity-100 animate-spin-slow transition-opacity duration-500 blur-sm"></div>
                <div className="absolute -inset-[1px] rounded-3xl bg-[conic-gradient(from_0deg,transparent_0_240deg,#06b6d4_300deg,#d946ef_360deg)] opacity-0 group-hover:opacity-100 animate-spin-slow transition-opacity duration-500"></div>
                
                {/* Inner Card */}
                <div className="relative h-full bg-black border border-white/10 rounded-3xl p-8 overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                    <f.icon className="w-32 h-32 text-cyan-400" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/20">
                      <f.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="font-bold text-2xl mb-3 text-white">{f.title}</h3>
                    <p className="text-gray-400 font-light text-lg">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* GAMIFICATION SECTION */}
      <section className="relative z-10 py-32 px-4 border-t border-white/5 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500">Level Up Your Skills</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">Learning shouldn't be boring. Build your streak, earn exclusive badges, and climb the global leaderboards.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={fadeInUp} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center relative z-10">
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FaFire className="w-16 h-16 mx-auto mb-6 text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]" />
                </motion.div>
                <h3 className="font-bold text-2xl mb-4 text-white">Streaks</h3>
                <p className="text-gray-400 mb-6 font-light">Consistency is key. Don't break your daily practice streak.</p>
                <span className="inline-block bg-orange-500/20 border border-orange-500/30 text-orange-300 px-4 py-1.5 rounded-full font-medium text-sm">🔥 7 Day Streak</span>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center relative z-10">
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <BiGroup className="w-16 h-16 mx-auto mb-6 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                </motion.div>
                <h3 className="font-bold text-2xl mb-4 text-white">Leaderboards</h3>
                <p className="text-gray-400 mb-6 font-light">Compete globally against other hackers for the top spot.</p>
                <span className="inline-block bg-blue-500/20 border border-blue-500/30 text-blue-300 px-4 py-1.5 rounded-full font-medium text-sm">#8 Global Rank</span>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center relative z-10">
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                >
                  <BiMedal className="w-16 h-16 mx-auto mb-6 text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.5)]" />
                </motion.div>
                <h3 className="font-bold text-2xl mb-4 text-white">Achievements</h3>
                <p className="text-gray-400 mb-6 font-light">Unlock legendary badges by completing tough challenges.</p>
                <span className="inline-block bg-pink-500/20 border border-pink-500/30 text-pink-300 px-4 py-1.5 rounded-full font-medium text-sm">⭐ 25 Badges Earned</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 py-32 px-4 overflow-hidden">
        {/* Animated background lines */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="inline-block p-[2px] rounded-3xl bg-gradient-to-b from-blue-500/50 to-purple-500/10 shadow-2xl shadow-blue-500/20 mb-8">
            <div className="bg-slate-950 px-8 py-16 sm:px-16 sm:py-20 rounded-[22px]">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">Join the Next Generation of Hackers</h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light">Stop reading textbooks. Start hacking, practicing, and proving your skills.</p>
              <Link 
                to="/signup" 
                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-slate-950 rounded-xl font-bold text-lg hover:scale-105 transition-transform duration-300"
              >
                <BiRocket className="w-6 h-6" />
                Launch Your Career
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
