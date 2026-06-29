"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BiBrain, BiMicrophone, BiMap, BiBookOpen, BiWrench, BiLaptop,
  BiMedal, BiTrophy, BiNews, BiHomeAlt, BiCode, BiTime,
  BiTargetLock, BiPlay, BiStop, BiChevronRight,
} from "react-icons/bi";
import {
  FaLaptopCode, FaUserTie, FaShieldAlt, FaNetworkWired,
  FaSearch, FaBug, FaMicrophone, FaVideo, FaArrowRight,
  FaPause, FaPlay, FaFire, FaChartLine, FaTrophy, FaStar,
  FaBookmark, FaStop,
} from "react-icons/fa";
import {
  FiBell, FiSettings, FiUser, FiLogOut, FiChevronDown,
  FiShield, FiMenu, FiX, FiClock, FiTerminal, FiZap,
} from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import FloatingChatWidget from "@/components/chatbot/FloatingChatWidget";

/* ── shared nav ── */
const navLinks = [
  { label: "Dashboard",      href: "/dashboard",   icon: BiHomeAlt },
  { label: "Practice",       href: "/practice",    icon: BiBrain },
  { label: "Compete",        href: "/compete",     icon: BiTrophy },
  { label: "Mock Interview", href: "/interviews",  icon: BiMicrophone },
  { label: "Roadmaps",       href: "/roadmap",     icon: BiMap },
  { label: "Labs",           href: "/labs",        icon: BiLaptop },
  { label: "Books",          href: "/books",       icon: BiBookOpen },
  { label: "Tools",          href: "/tools",       icon: BiWrench },
  { label: "Projects",       href: "/projects",    icon: BiCode },
  { label: "Blog",           href: "/blog",        icon: BiNews },
  { label: "Badges",         href: "/badges",      icon: BiMedal },
];

/* ── interview catalogue ── */
const interviewTypes = [
  {
    id: "technical",
    title: "Technical",
    subtitle: "Coding & System Design",
    icon: FaLaptopCode,
    difficulty: "Advanced",
    duration: "45–60 min",
    questions: 15,
    topics: ["Coding Challenges", "System Design", "Algorithm Analysis", "Security Implementation"],
    accent: "#3B82F6",
  },
  {
    id: "behavioral",
    title: "Behavioral",
    subtitle: "STAR Method & Leadership",
    icon: FaUserTie,
    difficulty: "Intermediate",
    duration: "30–45 min",
    questions: 12,
    topics: ["Leadership", "Problem Solving", "Teamwork", "Conflict Resolution"],
    accent: "#22C55E",
  },
  {
    id: "security",
    title: "Security Specialist",
    subtitle: "Threat Analysis & IR",
    icon: FaShieldAlt,
    difficulty: "Expert",
    duration: "60–90 min",
    questions: 20,
    topics: ["Threat Analysis", "Incident Response", "Security Architecture", "Compliance"],
    accent: "#EF4444",
  },
  {
    id: "network",
    title: "Network Security",
    subtitle: "Protocols & Defense",
    icon: FaNetworkWired,
    difficulty: "Advanced",
    duration: "45–75 min",
    questions: 18,
    topics: ["Network Protocols", "Firewall Config", "VPN Setup", "Network Monitoring"],
    accent: "#A78BFA",
  },
  {
    id: "forensics",
    title: "Digital Forensics",
    subtitle: "Evidence & Analysis",
    icon: FaSearch,
    difficulty: "Expert",
    duration: "60–90 min",
    questions: 16,
    topics: ["Evidence Collection", "Memory Analysis", "Disk Forensics", "Tool Usage"],
    accent: "#F97316",
  },
  {
    id: "penetration",
    title: "Pen Testing",
    subtitle: "Vulnerability & Exploitation",
    icon: FaBug,
    difficulty: "Expert",
    duration: "75–120 min",
    questions: 25,
    topics: ["Vulnerability Assessment", "Exploitation", "Post-Exploitation", "Reporting"],
    accent: "#14B8A6",
  },
];

const mockQuestions = {
  technical: [
    { id: 1, question: "Implement a secure password hashing function using bcrypt. Include salt generation and verification.", difficulty: "Hard", timeLimit: 15, points: 50, category: "Cryptography" },
    { id: 2, question: "Design a secure authentication system for a web application. Consider session management, token-based auth, and security best practices.", difficulty: "Advanced", timeLimit: 20, points: 75, category: "System Design" },
    { id: 3, question: "You discover a SQL injection vulnerability in your application. Walk through your approach to identifying, fixing, and preventing such vulnerabilities.", difficulty: "Medium", timeLimit: 12, points: 40, category: "Web Security" },
  ],
  behavioral: [
    { id: 1, question: "Describe a situation where you had to handle a security incident under pressure. What was the situation, your task, the action you took, and the result?", difficulty: "Medium", timeLimit: 8, points: 30, category: "Incident Response" },
    { id: 2, question: "Tell me about a time when you had to lead a team through a major security implementation. How did you handle resistance and ensure successful adoption?", difficulty: "Advanced", timeLimit: 10, points: 35, category: "Leadership" },
    { id: 3, question: "Describe a conflict you had with a colleague during a security project. How did you resolve it and what did you learn?", difficulty: "Medium", timeLimit: 6, points: 25, category: "Team Work" },
  ],
  security: [
    { id: 1, question: "Analyze the security implications of a company implementing a BYOD policy. What are the risks and how would you mitigate them?", difficulty: "Advanced", timeLimit: 15, points: 60, category: "Risk Assessment" },
    { id: 2, question: "You receive an alert about suspicious network activity. Walk through your incident response process from detection to resolution.", difficulty: "Expert", timeLimit: 18, points: 70, category: "Incident Response" },
    { id: 3, question: "Explain how you would ensure GDPR compliance in a data processing system. What technical and organizational measures would you implement?", difficulty: "Advanced", timeLimit: 12, points: 45, category: "Compliance" },
  ],
  network: [
    { id: 1, question: "Explain how you would design a segmented network architecture to prevent lateral movement after a breach.", difficulty: "Advanced", timeLimit: 15, points: 55, category: "Network Design" },
    { id: 2, question: "Walk through the process of configuring a stateful firewall for a corporate DMZ.", difficulty: "Advanced", timeLimit: 12, points: 45, category: "Firewall Config" },
  ],
  forensics: [
    { id: 1, question: "Describe the chain of custody process when collecting digital evidence from a compromised server.", difficulty: "Advanced", timeLimit: 10, points: 40, category: "Evidence Collection" },
    { id: 2, question: "How would you perform a memory dump analysis to detect a running rootkit?", difficulty: "Expert", timeLimit: 18, points: 65, category: "Memory Analysis" },
  ],
  penetration: [
    { id: 1, question: "Describe your methodology for conducting an external black-box penetration test.", difficulty: "Expert", timeLimit: 20, points: 80, category: "Methodology" },
    { id: 2, question: "How would you escalate privileges on a Linux system after gaining initial access with a low-privilege shell?", difficulty: "Expert", timeLimit: 15, points: 70, category: "Exploitation" },
  ],
};

const diffColor = (d) =>
  d === "Expert"       ? "bg-red-900/40 text-red-400 border-red-800/30" :
  d === "Advanced"     ? "bg-orange-900/40 text-orange-400 border-orange-800/30" :
  d === "Intermediate" ? "bg-yellow-900/40 text-yellow-400 border-yellow-800/30" :
                          "bg-green-900/40 text-green-400 border-green-800/30";

const userStats = { totalInterviews: 24, averageScore: 87, streak: 5, improvement: "+12%", typesCompleted: 3 };

const XP_PER_LEVEL = 100;

export default function MockInterviewPage() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const [filterDiff,        setFilterDiff]        = useState("all");
  const [selectedType,      setSelectedType]      = useState(null);
  const [isActive,          setIsActive]          = useState(false);
  const [isPaused,          setIsPaused]          = useState(false);
  const [currentQ,         setCurrentQ]          = useState(0);
  const [timer,             setTimer]             = useState(0);
  const [userAnswer,        setUserAnswer]        = useState("");
  const [interviewHistory,  setInterviewHistory]  = useState([]);

  /* timer */
  useEffect(() => {
    let id;
    if (isActive && !isPaused && timer > 0) {
      id = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(id);
  }, [isActive, isPaused, timer]);

  useEffect(() => {
    const h = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleLogout = async () => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";
    try { await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" }); } catch {}
    logout(); router.push("/login");
  };

  const isActive_ = (href) => pathname === href || (href !== "/" && pathname.startsWith(href));

  const startInterview = (type) => {
    const qs = mockQuestions[type.id] || [];
    setSelectedType(type);
    setCurrentQ(0);
    setTimer((qs[0]?.timeLimit || 10) * 60);
    setUserAnswer("");
    setIsActive(true);
    setIsPaused(false);
  };

  const stopInterview = () => {
    setInterviewHistory(prev => [...prev, {
      type:      selectedType.id,
      title:     selectedType.title,
      score:     Math.floor(Math.random() * 30) + 65,
      questions: (mockQuestions[selectedType.id] || []).length,
    }]);
    setIsActive(false);
    setSelectedType(null);
    setUserAnswer("");
  };

  const nextQuestion = () => {
    const qs = mockQuestions[selectedType.id] || [];
    if (currentQ < qs.length - 1) {
      setCurrentQ(q => q + 1);
      setTimer((qs[currentQ + 1]?.timeLimit || 10) * 60);
      setUserAnswer("");
    } else {
      stopInterview();
    }
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const currentQuestion = selectedType ? (mockQuestions[selectedType.id] || [])[currentQ] : null;
  const totalQs         = selectedType ? (mockQuestions[selectedType.id] || []).length : 0;
  const maxTimer        = currentQuestion ? currentQuestion.timeLimit * 60 : 1;
  const timerPct        = (timer / maxTimer) * 100;

  const filtered = interviewTypes.filter(t => {
    if (filterDiff === "all")          return true;
    if (filterDiff === "intermediate") return t.difficulty === "Intermediate";
    if (filterDiff === "advanced")     return t.difficulty === "Advanced";
    if (filterDiff === "expert")       return t.difficulty === "Expert";
    return true;
  });

  /* ── active interview UI ── */
  if (isActive && selectedType && currentQuestion) {
    return (
      <div className="flex h-screen bg-[#080808] text-white overflow-hidden">
        {/* session bar */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* header */}
          <header className="h-14 flex items-center gap-4 px-5 border-b border-red-900/20 bg-[#0A0A0A] flex-shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${selectedType.accent}20`, border: `1px solid ${selectedType.accent}30` }}
            >
              <selectedType.icon className="text-sm" style={{ color: selectedType.accent }} />
            </div>
            <p className="text-sm font-semibold text-white flex-1">{selectedType.title} Interview</p>

            {/* question dots */}
            <div className="hidden sm:flex items-center gap-1.5">
              {(mockQuestions[selectedType.id] || []).map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
                  i < currentQ ? "bg-green-500" : i === currentQ ? "bg-red-500" : "bg-white/10"
                }`} />
              ))}
            </div>

            {/* timer */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-semibold
              ${timer < 60 ? "bg-red-600/15 border-red-600/30 text-red-400" : "bg-[#141414] border-white/[0.07] text-white"}`}>
              <FiClock className="text-xs" />
              {fmt(timer)}
            </div>

            {/* controls */}
            <div className="flex items-center gap-2">
              <button onClick={() => setIsPaused(p => !p)}
                className="p-2 rounded-lg bg-[#141414] border border-white/[0.07] hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                {isPaused ? <FaPlay className="text-xs" /> : <FaPause className="text-xs" />}
              </button>
              <button onClick={stopInterview}
                className="p-2 rounded-lg bg-red-600/15 border border-red-600/25 hover:bg-red-600/25 transition-colors text-red-400">
                <FaStop className="text-xs" />
              </button>
            </div>
          </header>

          {/* timer bar */}
          <div className="h-0.5 bg-[#1A1A1A]">
            <div
              className={`h-full transition-all duration-1000 ${timer < 60 ? "bg-red-500" : "bg-red-600"}`}
              style={{ width: `${timerPct}%` }}
            />
          </div>

          {/* question + answer */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="max-w-3xl mx-auto space-y-5">

              {/* question card */}
              <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-xl overflow-hidden">
                {/* terminal header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#0A0A0A] border-b border-white/[0.05]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-[11px] text-gray-600 font-mono ml-2">
                    Question {currentQ + 1} of {totalQs} — {currentQuestion.category}
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${diffColor(currentQuestion.difficulty)}`}>
                      {currentQuestion.difficulty}
                    </span>
                    <span className="text-[10px] text-red-400 font-semibold bg-red-600/10 border border-red-600/20 px-2 py-0.5 rounded">
                      {currentQuestion.points} pts
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-relaxed text-gray-200">{currentQuestion.question}</p>
                </div>
              </div>

              {/* answer area */}
              <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-[#0A0A0A] border-b border-white/[0.05]">
                  <FiTerminal className="text-xs text-gray-600" />
                  <span className="text-[11px] text-gray-600 font-mono">your_answer.txt</span>
                  <span className="ml-auto text-[10px] text-gray-700">{userAnswer.length} chars</span>
                </div>
                <textarea
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) { e.preventDefault(); nextQuestion(); } }}
                  placeholder="Type your answer here…  (Ctrl+Enter to submit)"
                  className="w-full h-44 bg-transparent px-5 py-4 text-sm text-gray-200 font-mono placeholder-gray-700 resize-none outline-none leading-relaxed"
                />
              </div>

              {/* action row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-[#141414] border border-white/[0.07] hover:border-white/[0.12] rounded-lg text-xs text-gray-400 hover:text-white transition-colors">
                    <FaMicrophone className="text-xs" /> Audio
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-[#141414] border border-white/[0.07] hover:border-white/[0.12] rounded-lg text-xs text-gray-400 hover:text-white transition-colors">
                    <FaVideo className="text-xs" /> Video
                  </button>
                </div>
                <button
                  onClick={nextQuestion}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-[0_0_16px_rgba(239,68,68,0.2)]"
                >
                  {currentQ < totalQs - 1 ? "Next Question" : "Finish Interview"}
                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── selection UI ── */
  return (
    <div className="flex h-screen bg-[#080808] text-white overflow-hidden">

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ════ SIDEBAR ════ */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex flex-col w-60 flex-shrink-0
        bg-[#0C0C0C] border-r border-red-900/20
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex items-center gap-3 h-16 px-5 border-b border-red-900/15 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-[0_0_16px_rgba(239,68,68,0.45)]">
            <FiShield className="text-white text-sm" />
          </div>
          <span className="text-white font-bold tracking-tight">CyberCrux</span>
          <button className="ml-auto p-1 rounded text-gray-600 hover:text-white lg:hidden" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

        <div className="px-4 py-4 border-b border-red-900/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-red-600/15 border border-red-600/25 flex items-center justify-center text-red-400 font-bold text-sm flex-shrink-0">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.username || "Hacker"}</p>
              <span className="text-[10px] text-red-400 bg-red-600/10 px-1.5 py-0.5 rounded border border-red-600/20">
                {userStats.totalInterviews} sessions
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5 scrollbar-hide">
          {navLinks.map(({ label, href, icon: Icon }) => {
            const active = isActive_(href);
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                  ${active ? "bg-red-600/12 text-red-400 border border-red-600/18" : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]"}`}>
                <Icon className={`text-base shrink-0 ${active ? "text-red-400" : "text-gray-600 group-hover:text-gray-400"}`} />
                <span className="truncate">{label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-2 py-3 border-t border-red-900/10 space-y-0.5">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] transition-colors">
            <FiSettings className="text-base" /> Settings
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-600/10 transition-colors">
            <FiLogOut className="text-base" /> Log out
          </button>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* topbar */}
        <header className="h-16 flex items-center gap-3 px-5 border-b border-red-900/15 bg-[#0A0A0A] flex-shrink-0">
          <button className="lg:hidden p-2 rounded-md text-gray-600 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setSidebarOpen(true)}>
            <FiMenu className="text-base" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-none">Mock Interviews</p>
            <p className="text-[11px] text-gray-600 mt-0.5 hidden sm:block">AI-powered interview simulations</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] border border-orange-600/20 rounded-lg">
            <FaFire className="text-orange-400 text-sm" />
            <span className="text-sm font-bold text-white">{userStats.streak}</span>
            <span className="text-[11px] text-gray-500 hidden sm:inline">streak</span>
          </div>
          <button className="relative p-2 rounded-lg text-gray-600 hover:text-white hover:bg-white/5 transition-colors">
            <FiBell className="text-base" />
          </button>
          <div className="relative" ref={userMenuRef}>
            <button onClick={() => setUserMenuOpen(o => !o)}
              className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-white/5 transition-colors focus:outline-none">
              <div className="w-7 h-7 rounded-full bg-red-600/15 border border-red-600/25 flex items-center justify-center text-red-400 text-xs font-bold">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <FiChevronDown className={`text-[11px] text-gray-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#101010] border border-red-900/20 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-1.5 z-50">
                <div className="px-3 py-2 border-b border-red-900/10 mb-1">
                  <p className="text-xs font-semibold text-white truncate">{user?.username}</p>
                  <p className="text-[11px] text-gray-600 truncate">{user?.email}</p>
                </div>
                {[
                  { icon: FiUser, label: "Profile", href: `/profile/${user?.username}` },
                  { icon: FiSettings, label: "Settings", href: "/settings" },
                ].map(({ icon: Icon, label, href }) => (
                  <Link key={href} href={href} onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                    <Icon className="text-sm" /> {label}
                  </Link>
                ))}
                <div className="my-1 h-px bg-red-900/10" />
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-600/10 transition-colors">
                  <FiLogOut className="text-sm" /> Log out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">

          {/* ── stats strip ── */}
          <div className="border-b border-white/[0.05] bg-[#0A0A0A] px-5 py-3">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: "Sessions",        value: userStats.totalInterviews, accent: "#EF4444" },
                { label: "Avg Score",       value: `${userStats.averageScore}%`, accent: "#22C55E" },
                { label: "Day Streak",      value: userStats.streak,          accent: "#F97316" },
                { label: "Types Completed", value: userStats.typesCompleted,  accent: "#A78BFA" },
                { label: "Improvement",     value: userStats.improvement,     accent: "#FBBF24" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-base font-bold" style={{ color: s.accent }}>{s.value}</p>
                  <p className="text-[10px] text-gray-600">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 space-y-5">

            {/* ── main two-column layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* interview type list (2/3 wide) */}
              <div className="lg:col-span-2 space-y-4">

                {/* filter row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-gray-600 mr-1">Filter:</span>
                  {["all", "intermediate", "advanced", "expert"].map(f => (
                    <button key={f}
                      onClick={() => setFilterDiff(f)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all
                        ${filterDiff === f
                          ? "bg-red-600/15 text-red-400 border-red-600/20"
                          : "bg-[#0F0F0F] text-gray-500 border-white/[0.06] hover:text-gray-300 hover:border-white/[0.10]"
                        }`}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>

                {/* interview type list */}
                <div className="bg-[#0F0F0F] border border-white/[0.05] rounded-xl overflow-hidden">
                  {/* column header */}
                  <div className="grid grid-cols-[1fr_6rem_5rem_5rem_7rem] gap-0 px-5 py-3 border-b border-white/[0.04] bg-[#0A0A0A]">
                    {["Interview Type", "Difficulty", "Duration", "Questions", ""].map((h, i) => (
                      <p key={i} className={`text-[10px] font-semibold text-gray-600 uppercase tracking-wider ${i > 0 ? "text-center" : ""}`}>
                        {h}
                      </p>
                    ))}
                  </div>

                  {/* rows */}
                  <div className="divide-y divide-white/[0.03]">
                    {filtered.map((type) => (
                      <div key={type.id}
                        className="grid grid-cols-[1fr_6rem_5rem_5rem_7rem] gap-0 px-5 py-4 items-center hover:bg-white/[0.025] transition-colors group">

                        {/* name + icon */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: `${type.accent}14`, border: `1px solid ${type.accent}25` }}>
                            <type.icon className="text-sm" style={{ color: type.accent }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-200 group-hover:text-white truncate">{type.title}</p>
                            <p className="text-[11px] text-gray-600 truncate">{type.subtitle}</p>
                          </div>
                        </div>

                        {/* difficulty */}
                        <div className="text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${diffColor(type.difficulty)}`}>
                            {type.difficulty}
                          </span>
                        </div>

                        {/* duration */}
                        <div className="text-center">
                          <p className="text-xs text-gray-400">{type.duration}</p>
                        </div>

                        {/* questions */}
                        <div className="text-center">
                          <p className="text-xs font-semibold text-gray-300">{type.questions}</p>
                        </div>

                        {/* launch */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => startInterview(type)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[11px] font-semibold rounded-lg transition-colors shadow-[0_0_10px_rgba(239,68,68,0.15)] hover:shadow-[0_0_16px_rgba(239,68,68,0.3)]"
                          >
                            <FaPlay className="text-[9px]" /> Launch
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* topic chips for expanded info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filtered.slice(0, 2).map(type => (
                    <div key={type.id} className="bg-[#0F0F0F] border border-white/[0.05] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{ background: `${type.accent}14` }}>
                          <type.icon className="text-xs" style={{ color: type.accent }} />
                        </div>
                        <p className="text-xs font-semibold text-gray-300">{type.title} — Topics</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {type.topics.map((t, i) => (
                          <span key={i} className="text-[10px] px-2 py-1 bg-white/[0.04] border border-white/[0.06] text-gray-500 rounded-md">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* right intel panel (1/3) */}
              <div className="space-y-4">

                {/* score card */}
                <div className="bg-[#0F0F0F] border border-white/[0.05] rounded-xl p-5">
                  <p className="text-[11px] text-gray-600 uppercase tracking-wider mb-4">Your Performance</p>
                  <div className="flex items-end gap-3 mb-4">
                    <p className="text-4xl font-black text-white">{userStats.averageScore}<span className="text-lg text-gray-600">%</span></p>
                    <p className="text-xs text-green-400 mb-1.5">{userStats.improvement} vs last month</p>
                  </div>
                  {/* mini score bar */}
                  <div className="space-y-2">
                    {[
                      { label: "Technical",  score: 92 },
                      { label: "Behavioral", score: 85 },
                      { label: "Security",   score: 88 },
                    ].map(s => (
                      <div key={s.label}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] text-gray-500">{s.label}</p>
                          <p className="text-[10px] font-semibold text-gray-300">{s.score}%</p>
                        </div>
                        <div className="h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${s.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* recent sessions */}
                <div className="bg-[#0F0F0F] border border-white/[0.05] rounded-xl p-5">
                  <p className="text-[11px] text-gray-600 uppercase tracking-wider mb-4">Recent Sessions</p>
                  {interviewHistory.length > 0 ? (
                    <div className="space-y-3">
                      {[...interviewHistory].reverse().slice(0, 4).map((h, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#141414] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                            <FiZap className="text-xs text-red-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-300 truncate">{h.title}</p>
                            <p className="text-[10px] text-gray-600">{h.questions} questions</p>
                          </div>
                          <span className={`text-[11px] font-bold ${
                            h.score >= 85 ? "text-green-400" :
                            h.score >= 70 ? "text-yellow-400" : "text-red-400"
                          }`}>{h.score}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <FiZap className="text-2xl text-gray-700 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">No sessions yet</p>
                      <p className="text-[10px] text-gray-700 mt-1">Launch an interview to get started</p>
                    </div>
                  )}
                </div>

                {/* quick tip */}
                <div className="bg-red-600/8 border border-red-900/25 rounded-xl p-4">
                  <p className="text-[11px] font-semibold text-red-400 mb-1.5">Pro Tip</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Start with <span className="text-gray-300 font-medium">Behavioral</span> sessions to warm up before tackling Expert-level technical interviews.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <FloatingChatWidget />
    </div>
  );
}
