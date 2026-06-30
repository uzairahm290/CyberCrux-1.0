"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BiHomeAlt, BiBrain, BiTrophy, BiMicrophone, BiMap, BiLaptop,
  BiBookOpen, BiWrench, BiCode, BiNews, BiMedal, BiSearch, BiStar,
} from "react-icons/bi";
import {
  FiBell, FiSettings, FiUser, FiLogOut, FiChevronDown,
  FiShield, FiMenu, FiX, FiGithub, FiExternalLink,
} from "react-icons/fi";
import {
  FaFire, FaHeart, FaEye, FaStar, FaGithub, FaExternalLinkAlt,
  FaProjectDiagram, FaUsers, FaClock, FaServer, FaCode, FaMobile,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import FloatingChatWidget from "@/components/chatbot/FloatingChatWidget";

// ─── Nav links ────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Dashboard",      href: "/dashboard",  Icon: BiHomeAlt    },
  { label: "Practice",       href: "/practice",   Icon: BiBrain      },
  { label: "Compete",        href: "/compete",    Icon: BiTrophy     },
  { label: "Mock Interview", href: "/interviews", Icon: BiMicrophone },
  { label: "Roadmaps",       href: "/roadmap",    Icon: BiMap        },
  { label: "Labs",           href: "/labs",       Icon: BiLaptop     },
  { label: "Books",          href: "/books",      Icon: BiBookOpen   },
  { label: "Tools",          href: "/tools",      Icon: BiWrench     },
  { label: "Projects",       href: "/projects",   Icon: BiCode       },
  { label: "Blog",           href: "/blog",       Icon: BiNews       },
  { label: "Badges",         href: "/badges",     Icon: BiMedal      },
];

// ─── Projects data ─────────────────────────────────────────────────────────────
const projects = [
  {
    id: 1,
    title: "SIEM Dashboard",
    description: "A comprehensive Security Information and Event Management dashboard for real-time threat monitoring and incident response.",
    category: "defense",
    type: "Web Application",
    author: "Sarah Chen",
    rating: 4.9,
    views: 1247,
    likes: 89,
    collaborators: 5,
    icon: <FaServer className="text-blue-400 text-3xl" />,
    featured: true,
    technologies: ["React", "Node.js", "Elasticsearch", "Docker"],
    skills: ["SIEM", "Threat Detection", "Dashboard Design", "API Integration"],
    difficulty: "Advanced",
    estimatedTime: "3-4 months",
    github: "https://github.com/example/siem-dashboard",
    demo: "https://demo.example.com",
    status: "Completed",
    lastUpdated: "2024-01-15",
  },
  {
    id: 2,
    title: "Penetration Testing Framework",
    description: "An automated penetration testing framework with modular architecture for comprehensive security assessments.",
    category: "offensive",
    type: "CLI Tool",
    author: "Mike Rodriguez",
    rating: 4.8,
    views: 892,
    likes: 67,
    collaborators: 3,
    icon: <FaCode className="text-purple-400 text-3xl" />,
    featured: true,
    technologies: ["Python", "Docker", "PostgreSQL", "Redis"],
    skills: ["Penetration Testing", "Automation", "API Development", "Security Tools"],
    difficulty: "Advanced",
    estimatedTime: "4-6 months",
    github: "https://github.com/example/pentest-framework",
    demo: null,
    status: "In Progress",
    lastUpdated: "2024-01-10",
  },
  {
    id: 3,
    title: "Malware Analysis Platform",
    description: "A web-based platform for analyzing malware samples with automated detection and reporting capabilities.",
    category: "analysis",
    type: "Web Application",
    author: "Dr. Emily Watson",
    rating: 4.7,
    views: 567,
    likes: 45,
    collaborators: 4,
    icon: <FaServer className="text-yellow-300 text-3xl" />,
    featured: false,
    technologies: ["Vue.js", "Python", "MongoDB", "AWS"],
    skills: ["Malware Analysis", "Reverse Engineering", "Cloud Security", "Machine Learning"],
    difficulty: "Advanced",
    estimatedTime: "5-7 months",
    github: "https://github.com/example/malware-platform",
    demo: "https://malware.example.com",
    status: "Completed",
    lastUpdated: "2023-12-20",
  },
  {
    id: 4,
    title: "Network Security Monitor",
    description: "Real-time network traffic analysis and anomaly detection system for enterprise environments.",
    category: "defense",
    type: "Desktop Application",
    author: "Alex Thompson",
    rating: 4.6,
    views: 734,
    likes: 52,
    collaborators: 2,
    icon: <FaServer className="text-green-400 text-3xl" />,
    featured: false,
    technologies: ["C++", "Qt", "SQLite", "Libpcap"],
    skills: ["Network Security", "Traffic Analysis", "Anomaly Detection", "C++ Development"],
    difficulty: "Intermediate",
    estimatedTime: "2-3 months",
    github: "https://github.com/example/network-monitor",
    demo: null,
    status: "Completed",
    lastUpdated: "2024-01-05",
  },
  {
    id: 5,
    title: "Mobile Security Scanner",
    description: "Android and iOS application security scanner with vulnerability assessment and reporting.",
    category: "monitoring",
    type: "Mobile App",
    author: "David Kim",
    rating: 4.5,
    views: 445,
    likes: 38,
    collaborators: 3,
    icon: <FaMobile className="text-cyan-400 text-3xl" />,
    featured: false,
    technologies: ["React Native", "Node.js", "MongoDB", "Docker"],
    skills: ["Mobile Security", "App Development", "Vulnerability Assessment", "Cross-platform"],
    difficulty: "Intermediate",
    estimatedTime: "3-4 months",
    github: "https://github.com/example/mobile-scanner",
    demo: "https://mobile.example.com",
    status: "In Progress",
    lastUpdated: "2024-01-12",
  },
  {
    id: 6,
    title: "Cloud Security Assessment Tool",
    description: "Automated cloud security assessment tool for AWS, Azure, and GCP with compliance reporting.",
    category: "monitoring",
    type: "CLI Tool",
    author: "Lisa Wang",
    rating: 4.7,
    views: 623,
    likes: 41,
    collaborators: 4,
    icon: <FaServer className="text-orange-400 text-3xl" />,
    featured: false,
    technologies: ["Python", "Terraform", "AWS SDK", "Azure SDK"],
    skills: ["Cloud Security", "DevOps", "Infrastructure as Code", "Compliance"],
    difficulty: "Intermediate",
    estimatedTime: "2-3 months",
    github: "https://github.com/example/cloud-assessment",
    demo: null,
    status: "Completed",
    lastUpdated: "2023-12-15",
  },
];

const FILTER_CATEGORIES = [
  { id: "all",        label: "All"        },
  { id: "defense",    label: "Defense"    },
  { id: "offensive",  label: "Offensive"  },
  { id: "analysis",   label: "Analysis"   },
  { id: "monitoring", label: "Monitoring" },
];

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ open, onClose, user, onLogout }) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-60 bg-[#0C0C0C] border-r border-red-900/20
          flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-red-900/20">
          <FiShield className="text-red-500 text-xl flex-shrink-0" />
          <span className="font-bold text-white text-lg tracking-wide">CyberCrux</span>
          <button className="ml-auto lg:hidden text-gray-400 hover:text-white" onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-b border-red-900/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-600/15 border border-red-600/25 flex items-center justify-center flex-shrink-0">
              <span className="text-red-400 font-semibold text-sm">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.username || "User"}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email || "member"}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {NAV_LINKS.map(({ label, href, Icon }) => {
            const active = pathname === href || pathname?.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150
                  ${active
                    ? "bg-red-600/12 text-red-400 border border-red-600/18"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                  }
                `}
              >
                <Icon className="text-base flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-red-500 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 pt-3 border-t border-red-900/20 space-y-0.5">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all"
          >
            <FiSettings className="text-base" />
            <span>Settings</span>
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-600/8 transition-all"
          >
            <FiLogOut className="text-base" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({ onMenuClick, user, streak }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);
  const router  = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout?.();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-[#0A0A0A] border-b border-red-900/15 flex items-center px-4 gap-3 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-400 hover:text-white transition-colors p-1"
      >
        <FiMenu size={20} />
      </button>

      <h1 className="text-white font-semibold text-base">Projects</h1>
      <div className="flex-1" />

      {streak > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
          <FaFire className="text-orange-400 text-xs" />
          <span className="text-orange-300 text-xs font-semibold">{streak}d</span>
        </div>
      )}

      <button className="relative text-gray-400 hover:text-white transition-colors p-2">
        <FiBell size={18} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
      </button>

      <div className="relative" ref={dropRef}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-red-600/15 border border-red-600/25 flex items-center justify-center">
            <span className="text-red-400 font-semibold text-xs">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <FiChevronDown
            size={14}
            className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-44 bg-[#111] border border-red-900/20 rounded-xl shadow-2xl overflow-hidden z-50">
            <div className="px-3 py-2.5 border-b border-red-900/10">
              <p className="text-white text-sm font-medium truncate">{user?.username || "User"}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
            <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
              <FiUser size={14} /> Profile
            </Link>
            <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
              <FiSettings size={14} /> Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-600/8 transition-all"
            >
              <FiLogOut size={14} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────
function DifficultyBadge({ level }) {
  const map = {
    Advanced:     "bg-red-500/15 text-red-400 border-red-500/25",
    Intermediate: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
    Beginner:     "bg-green-500/15 text-green-400 border-green-500/25",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${map[level] || map.Beginner}`}>
      {level}
    </span>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, onAuthorClick }) {
  const statusColor =
    project.status === "Completed"
      ? "bg-green-500/15 text-green-400 border-green-500/25"
      : "bg-yellow-500/15 text-yellow-400 border-yellow-500/25";

  const categoryColors = {
    defense:    "bg-blue-500/12 text-blue-400",
    offensive:  "bg-red-500/12 text-red-400",
    analysis:   "bg-purple-500/12 text-purple-400",
    monitoring: "bg-orange-500/12 text-orange-400",
    mobile:     "bg-cyan-500/12 text-cyan-400",
    cloud:      "bg-sky-500/12 text-sky-400",
  };

  return (
    <div className="bg-[#0E0E0E] border border-red-900/15 rounded-xl p-5 flex flex-col gap-4 hover:border-red-700/30 hover:bg-[#101010] transition-all duration-200 group">
      {/* Top badges */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColor}`}>
            {project.status}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[project.category] || "bg-gray-500/12 text-gray-400"}`}>
            {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
          </span>
        </div>
        {project.featured && (
          <FaStar className="text-yellow-400 text-sm flex-shrink-0" title="Featured" />
        )}
      </div>

      {/* Title + type tag */}
      <div>
        <h3 className="text-white font-bold text-base group-hover:text-red-300 transition-colors line-clamp-1 mb-1">
          {project.title}
        </h3>
        <span className="text-xs px-1.5 py-0.5 bg-white/5 text-gray-500 rounded font-mono">
          {project.type}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{project.description}</p>

      {/* Tech stack chips */}
      <div className="flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <span key={tech} className="text-xs px-2 py-0.5 bg-[#1A1A1A] border border-white/8 text-gray-400 rounded-md">
            {tech}
          </span>
        ))}
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><FaEye className="text-gray-600" />{project.views.toLocaleString()}</span>
        <span className="flex items-center gap-1"><FaHeart className="text-gray-600" />{project.likes}</span>
        <span className="flex items-center gap-1"><FaUsers className="text-gray-600" />{project.collaborators}</span>
        <span className="flex items-center gap-1"><FaClock className="text-gray-600" />{project.estimatedTime}</span>
      </div>

      {/* Footer: links + difficulty */}
      <div className="flex items-center justify-between pt-1 border-t border-red-900/10">
        <div className="flex items-center gap-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/8 text-gray-300 hover:text-white rounded-lg text-xs transition-all"
            >
              <FaGithub size={12} /> GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 text-red-400 rounded-lg text-xs transition-all"
            >
              <FaExternalLinkAlt size={10} /> Demo
            </a>
          )}
        </div>
        <DifficultyBadge level={project.difficulty} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [sidebarOpen,        setSidebarOpen]        = useState(false);
  const [selectedCategory,   setSelectedCategory]   = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [searchQuery,        setSearchQuery]         = useState("");

  const handleLogout = async () => {
    await logout?.();
    router.push("/login");
  };

  const handleUsernameClick = (author) => {
    router.push(`/profile/${encodeURIComponent(author)}`);
  };

  const filteredProjects = projects.filter((p) => {
    const matchCat  = selectedCategory === "all" || p.category === selectedCategory;
    const matchDiff = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
    const q         = searchQuery.toLowerCase();
    const matchQ    = !q || p.title.toLowerCase().includes(q) ||
                      p.description.toLowerCase().includes(q) ||
                      p.author.toLowerCase().includes(q);
    return matchCat && matchDiff && matchQ;
  });

  const totalCollaborators = projects.reduce((s, p) => s + p.collaborators, 0);
  const uniqueCategories   = [...new Set(projects.map((p) => p.category))].length;

  return (
    <div className="flex h-screen bg-[#080808] text-white overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          streak={user?.streakDays || 0}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Projects", value: projects.length },
              { label: "Categories",     value: uniqueCategories },
              { label: "Contributors",   value: totalCollaborators },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#0C0C0C] border border-red-900/15 rounded-xl px-5 py-4">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Filter row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {FILTER_CATEGORIES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    selectedCategory === id
                      ? "bg-red-600/15 text-red-400 border-red-600/30"
                      : "bg-transparent text-gray-400 border-red-900/15 hover:text-gray-200 hover:border-red-900/30"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            {/* Difficulty filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-[#0C0C0C] border border-red-900/15 text-gray-300 text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:border-red-600/40"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d} className="bg-[#111]">{d}</option>
              ))}
            </select>

            {/* Search */}
            <div className="relative">
              <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0C0C0C] border border-red-900/15 text-gray-300 placeholder-gray-600 text-sm pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-red-600/40 w-48"
              />
            </div>
          </div>

          {/* Count */}
          <p className="text-xs text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>

          {/* 2-column grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onAuthorClick={handleUsernameClick}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FaProjectDiagram className="text-4xl text-gray-700 mb-4" />
              <p className="text-gray-400 font-medium">No projects found</p>
              <p className="text-gray-600 text-sm mt-1">Try adjusting your filters or search</p>
            </div>
          )}
        </main>
      </div>

      <FloatingChatWidget />
    </div>
  );
}
