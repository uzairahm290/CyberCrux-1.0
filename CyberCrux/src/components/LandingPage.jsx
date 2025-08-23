import React, { useRef, useEffect, useState } from "react";
import MainNav from "./MainNav";
import Footer from "./Footer";
import {
  BiBrain, BiMicrophone, BiMap, BiBookOpen, BiWrench, BiLaptop, BiCode, BiTrophy, BiRocket, BiCheck, BiGroup, BiMedal, BiAward, BiPlay, BiUser, BiStar
} from 'react-icons/bi';
import { FaFire, FaUser } from 'react-icons/fa';
import { Link } from "react-router-dom";

// Intersection observer hook for scroll animations
function useInView(threshold = 0.2) {
  const ref = useRef();
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export default function LandingPage() {
  // Hero animation
  const [heroRef, heroInView] = useInView(0.3);
  const [howRef, howInView] = useInView(0.2);
  const [featuresRef, featuresInView] = useInView(0.2);
  const [aiRef, aiInView] = useInView(0.2);
  const [roadmapRef, roadmapInView] = useInView(0.2);
  const [gameRef, gameInView] = useInView(0.2);
  const [testRef, testInView] = useInView(0.2);
  const [ctaRef, ctaInView] = useInView(0.2);

  // Email state
  const [email, setEmail] = useState("");

  // Features data
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

  // Testimonials (fake for now)
  const testimonials = [
    { name: "Aarav S.", text: "CyberCrux made me interview-ready in weeks! The AI interviews are a game changer.", avatar: <FaUser className="w-8 h-8 text-blue-400" /> },
    { name: "Priya K.", text: "The scenario questions are so real. I landed my first SOC job thanks to CyberCrux!", avatar: <FaUser className="w-8 h-8 text-pink-400" /> },
    { name: "Rohan M.", text: "Streaks and leaderboards kept me motivated. Best cybersecurity prep platform!", avatar: <FaUser className="w-8 h-8 text-green-400" /> },
  ];

  return (
    <div className="flex flex-col bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <MainNav />
      {/* HERO SECTION */}
      <section ref={heroRef} className="relative flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className={`relative z-10 transition-all duration-1000 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}> 
          {/* Premium badge with live indicator */}
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-200 font-semibold tracking-wide text-xs uppercase border border-blue-400/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              The Ultimate Cybersecurity Handbook
            </span>
          </div>
          
          {/* Main heading with enhanced typography */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-3 sm:mb-4 leading-tight px-2">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              Crack Cybersecurity
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent animate-gradient delay-500">
              Interviews
            </span>
          </h1>
          
          {/* Enhanced description with highlights */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-4 sm:mb-6 max-w-3xl mx-auto px-4 leading-relaxed">
            Master scenario-based questions, AI voice interviews, and comprehensive learning resources. Everything you need to succeed in cybersecurity.
          </p>
          
          {/* Enhanced form with better styling */}
          <form className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-lg mx-auto px-4 mb-6">
            <div className="relative w-full sm:w-72">
            <input
              type="email"
              required
              value={email}
                onChange={e => setEmail(e.target.value)} 
                placeholder="Enter your email" 
                className="w-full px-4 py-3 rounded-xl border border-blue-400/30 bg-white/10 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm backdrop-blur-sm transition-all duration-300" 
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <Link 
              to="/signup"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-600 text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 w-full sm:w-auto justify-center backdrop-blur-sm"
            >
              <BiRocket className="w-4 h-4 animate-pulse" />
              Join Free
            </Link>
          </form>
          
          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <BiCheck className="w-4 h-4 text-blue-400" />
              <span>10K+ Students</span>
            </div>
            <div className="flex items-center gap-2">
              <BiCheck className="w-4 h-4 text-blue-400" />
              <span>500+ Scenarios</span>
            </div>
            <div className="flex items-center gap-2">
              <BiCheck className="w-4 h-4 text-blue-400" />
              <span>Free Forever</span>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
        
        {/* Futuristic SVG background */}
        <svg className="absolute left-0 top-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 1440 320">
          <path fill="#6366f1" fillOpacity="0.2" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
        </svg>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section ref={howRef} className="py-20 px-4 bg-gradient-to-b from-blue-950/60 to-transparent">
        <div className={`max-w-5xl mx-auto grid md:grid-cols-4 gap-8 text-center transition-all duration-1000 ${howInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}> 
          <div>
            <BiCheck className="w-10 h-10 mx-auto mb-3 text-blue-400" />
            <h3 className="font-bold text-lg mb-2">1. Practice Scenarios</h3>
            <p className="text-gray-400">Tackle real-world questions and get instant feedback.</p>
        </div>
          <div>
            <BiMicrophone className="w-10 h-10 mx-auto mb-3 text-purple-400" />
            <h3 className="font-bold text-lg mb-2">2. Mock AI Interviews</h3>
            <p className="text-gray-400">Simulate interviews with voice AI and boost your confidence.</p>
              </div>
          <div>
            <BiMap className="w-10 h-10 mx-auto mb-3 text-green-400" />
            <h3 className="font-bold text-lg mb-2">3. Follow Roadmaps</h3>
            <p className="text-gray-400">Structured learning paths and resources for every goal.</p>
              </div>
          <div>
            <BiTrophy className="w-10 h-10 mx-auto mb-3 text-yellow-400" />
            <h3 className="font-bold text-lg mb-2">4. Track & Compete</h3>
            <p className="text-gray-400">Earn streaks, badges, and climb the leaderboard.</p>
              </div>
            </div>
      </section>

      {/* FEATURES GRID SECTION */}
      <section ref={featuresRef} className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 pb-5 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">All-in-One Cybersecurity Prep</h2>
          <div className={`grid md:grid-cols-4 gap-8 transition-all duration-1000 ${featuresInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}> 
            {features.map((f, i) => (
              <div key={f.title} className="bg-white/10 border border-blue-400/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl hover:shadow-blue-400/20 transition group hover:scale-105">
                <f.icon className="w-10 h-10 mb-4 text-blue-400 group-hover:text-purple-400 transition" />
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-300 text-sm">{f.desc}</p>
              </div>
            ))}
              </div>
            </div>
      </section>

      {/* AI INTERVIEW DEMO SECTION */}
      <section ref={aiRef} className="py-20 px-4 bg-gradient-to-b from-purple-900/60 to-transparent">
        <div className={`max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 transition-all duration-1000 ${aiInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}> 
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Try a Mock AI Interview</h2>
            <p className="text-gray-300 mb-6">Experience a sample voice interview with instant AI feedback. Practice, learn, and improve—risk free.</p>
            <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-white shadow-lg hover:scale-105 transition"><BiPlay className="w-5 h-5" />Try Now</Link>
              </div>
          <div className="flex-1 bg-white/10 border border-purple-400/20 rounded-2xl p-6 shadow-xl">
            {/* Fake chat UI */}
            <div className="space-y-3">
              <div className="flex gap-2 items-start">
                <BiMicrophone className="w-7 h-7 text-purple-400 mt-1" />
                <div className="bg-purple-500/20 rounded-xl px-4 py-2 text-left">Tell me about a time you handled a security incident.</div>
              </div>
              <div className="flex gap-2 items-start flex-row-reverse">
                <BiUser className="w-7 h-7 text-blue-400 mt-1" />
                <div className="bg-blue-500/20 rounded-xl px-4 py-2 text-left">I led the response to a phishing attack, coordinated with IT, and improved our email filters.</div>
              </div>
              <div className="flex gap-2 items-start">
                <BiMicrophone className="w-7 h-7 text-purple-400 mt-1" />
                <div className="bg-purple-500/20 rounded-xl px-4 py-2 text-left">Great! What would you do differently next time?</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAPS SECTION */}
      <section ref={roadmapRef} className="py-24 px-4">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${roadmapInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}> 
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Choose Your Path</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <div className="flex-1 bg-white/10 border border-green-400/20 rounded-2xl p-8 shadow-xl text-center">
              <BiMap className="w-10 h-10 mx-auto mb-3 text-red-400" />
              <h3 className="font-bold text-lg mb-2">Red Team</h3>
              <p className="text-gray-300 mb-4">Offensive security, pentesting, and ethical hacking. Follow the roadmap and resources to become a Red Teamer.</p>
              <Link to="/roadmap" className="inline-block px-6 py-2 bg-gradient-to-r from-red-500 to-red-400 rounded-xl text-white font-semibold hover:scale-105 transition">View Roadmap</Link>
            </div>
            <div className="flex-1 bg-white/10 border border-blue-400/20 rounded-2xl p-8 shadow-xl text-center">
              <BiMap className="w-10 h-10 mx-auto mb-3 text-blue-400" />
              <h3 className="font-bold text-lg mb-2">Blue Team</h3>
              <p className="text-gray-300 mb-4">Defensive security, SOC, and incident response. Get the full learning path and resources for Blue Team roles.</p>
              <Link to="/roadmap" className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl text-white font-semibold hover:scale-105 transition">View Roadmap</Link>
            </div>
          </div>
        </div>
      </section>

      {/* GAMIFICATION & COMMUNITY SECTION */}
      <section ref={gameRef} className="py-20 px-4 bg-gradient-to-b from-blue-950/60 to-transparent">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${gameInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}> 
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">Level Up with Streaks & Community</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 border border-yellow-400/20 rounded-2xl p-8 text-center shadow-xl">
              <FaFire className="w-10 h-10 mx-auto mb-3 text-orange-400" />
              <h3 className="font-bold text-lg mb-2">Streaks</h3>
              <p className="text-gray-300 mb-2">Stay consistent and earn rewards for daily learning.</p>
              <span className="inline-block bg-orange-500/20 text-orange-300 px-4 py-1 rounded-full font-semibold">🔥 7 Day Streak</span>
            </div>
            <div className="bg-white/10 border border-blue-400/20 rounded-2xl p-8 text-center shadow-xl">
              <BiGroup className="w-10 h-10 mx-auto mb-3 text-blue-400" />
              <h3 className="font-bold text-lg mb-2">Leaderboard</h3>
              <p className="text-gray-300 mb-2">Compete with others and climb the global leaderboard.</p>
              <span className="inline-block bg-blue-500/20 text-blue-300 px-4 py-1 rounded-full font-semibold">#8 This Week</span>
            </div>
            <div className="bg-white/10 border border-pink-400/20 rounded-2xl p-8 text-center shadow-xl">
              <BiMedal className="w-10 h-10 mx-auto mb-3 text-pink-400" />
              <h3 className="font-bold text-lg mb-2">Achievements</h3>
              <p className="text-gray-300 mb-2">Unlock badges and show off your progress.</p>
              <span className="inline-block bg-pink-500/20 text-pink-300 px-4 py-1 rounded-full font-semibold">⭐ 25 Badges</span>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section ref={testRef} className="py-24 px-4">
        <div className={`max-w-5xl mx-auto transition-all duration-1000 ${testInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}> 
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/10 border border-blue-400/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl">
                <div className="mb-4">{t.avatar}</div>
                <p className="text-gray-200 mb-3">“{t.text}”</p>
                <span className="text-blue-300 font-semibold">{t.name}</span>
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section ref={ctaRef} className="py-20 px-4 bg-gradient-to-b from-purple-900/60 to-transparent">
        <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${ctaInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}> 
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">Join CyberCrux and unlock your cybersecurity career. Free forever. No credit card required.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-white text-xl shadow-lg hover:scale-105 transition"><BiRocket className="w-6 h-6" />Start Now</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
