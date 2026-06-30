"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BiBrain, BiLaptop, BiMedal, BiHomeAlt, BiMap, BiBookOpen,
  BiWrench, BiNews, BiCode, BiMicrophone, BiTrophy,
} from "react-icons/bi";
import {
  FaUser, FaLock, FaTrash, FaSave, FaCamera,
  FaLinkedin, FaGithub, FaFire, FaCheckCircle, FaTimesCircle,
} from "react-icons/fa";
import {
  FiBell, FiSettings, FiUser, FiLogOut, FiChevronDown,
  FiShield, FiMenu, FiX, FiEye, FiEyeOff, FiEdit2,
} from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import CountryFlag from "@/components/ui/CountryFlag";

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

const XP_PER_LEVEL = 100;

export default function SettingsPage() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const [activeTab,        setActiveTab]        = useState("profile");
  const [isEditing,        setIsEditing]        = useState(false);
  const [isLoading,        setIsLoading]        = useState(false);
  const [isDeleting,       setIsDeleting]       = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [profilePic,       setProfilePic]       = useState(user?.profile_pic || "");
  const [toast,            setToast]            = useState(null);

  const [userStats, setUserStats] = useState({ totalPoints: 0, currentStreak: 0, level: 1 });

  const [formData, setFormData] = useState({
    username: user?.username || "",
    fullName: user?.FullName || "",
    profile_pic: user?.profile_pic || "",
    country: user?.country || "",
    description: user?.description || "",
    linkedin_url: user?.linkedin_url || "",
    github_url: user?.github_url || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordStrength, setPasswordStrength] = useState({
    length: false, uppercase: false, lowercase: false, number: false, symbol: false,
  });

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API}/api/user/profile`, { credentials: "include" });
        const data = await res.json();
        if (data.success) {
          const u = data.user;
          setFormData({
            username:     u.username || "",
            fullName:     u.fullName || "",
            profile_pic:  u.profilePicture || "",
            country:      u.country || "",
            description:  u.description || "",
            linkedin_url: u.linkedinUrl || "",
            github_url:   u.githubUrl || "",
          });
          setProfilePic(u.profilePicture || "");
        }
      } catch {
        if (user) {
          setFormData((p) => ({ ...p, username: user.username || "", fullName: user.FullName || "" }));
          setProfilePic(user.profile_pic || "");
        }
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    Promise.allSettled([
      fetch(`${API}/api/practice/stats`, { credentials: "include" }),
      fetch(`${API}/api/streak/user-streak/${user.id}`),
    ]).then(async ([sRes, stRes]) => {
      if (sRes.status === "fulfilled") {
        const d = await sRes.value.json();
        if (d.success) {
          const pts = d.data.overview?.total_points_earned || 0;
          setUserStats((p) => ({ ...p, totalPoints: pts, level: Math.floor(pts / XP_PER_LEVEL) + 1 }));
        }
      }
      if (stRes.status === "fulfilled") {
        const d = await stRes.value.json();
        if (d.streak) setUserStats((p) => ({ ...p, currentStreak: d.streak.current_streak || 0 }));
      }
    });
  }, [user]);

  useEffect(() => {
    const h = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = async () => {
    try { await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" }); } catch {}
    logout();
    router.push("/login");
  };

  const isActive = (href) => pathname === href || (href !== "/" && pathname.startsWith(href));

  const handleFormChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
      setFormData((p) => ({ ...p, profile_pic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const res  = await fetch(`${API}/api/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username:       formData.username,
          fullName:       formData.fullName,
          profilePicture: formData.profile_pic,
          country:        formData.country,
          description:    formData.description,
          linkedin_url:   formData.linkedin_url,
          github_url:     formData.github_url,
        }),
      });
      const data = await res.json();
      if (data.success) { setIsEditing(false); showToast("success", "Profile updated successfully!"); }
      else showToast("error", data.message || "Failed to update profile");
    } catch (err) {
      showToast("error", "Error updating profile: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((p) => ({ ...p, [name]: value }));
    if (name === "newPassword") {
      setPasswordStrength({
        length:    value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number:    /\d/.test(value),
        symbol:    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
      });
    }
  };

  const handleUpdatePassword = async () => {
    if (!Object.values(passwordStrength).every(Boolean)) {
      showToast("error", "Password must meet all strength requirements");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("error", "New passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const res  = await fetch(`${API}/api/auth/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        showToast("success", "Password changed successfully!");
      } else {
        showToast("error", data.message || "Failed to change password");
      }
    } catch { showToast("error", "Network error"); }
    finally { setIsLoading(false); }
  };

  const confirmDeleteAccount = async () => {
    setShowConfirmModal(false);
    setIsDeleting(true);
    try {
      const res  = await fetch(`${API}/api/user/account`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Account deleted");
        setTimeout(() => { logout(); router.push("/"); }, 2000);
      } else {
        showToast("error", data.message || "Failed to delete account");
      }
    } catch { showToast("error", "Network error"); }
    finally { setIsDeleting(false); }
  };

  const xpInLevel  = userStats.totalPoints % XP_PER_LEVEL;
  const xpProgress = (xpInLevel / XP_PER_LEVEL) * 100;

  const inputCls = "w-full px-3 py-2.5 bg-[#0A0A0F] border border-white/[0.07] hover:border-white/[0.12] focus:border-red-600/40 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-colors";
  const labelCls = "block text-xs font-medium text-gray-400 mb-1.5";

  const strengthItems = [
    { key: "length",    label: "8+ characters" },
    { key: "uppercase", label: "Uppercase letter" },
    { key: "lowercase", label: "Lowercase letter" },
    { key: "number",    label: "Number" },
    { key: "symbol",    label: "Symbol" },
  ];

  return (
    <div className="flex h-screen bg-[#080808] text-white overflow-hidden">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] animate-slide-right">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium
            ${toast.type === "success"
              ? "bg-green-900/80 border-green-700/40 text-green-300"
              : "bg-red-900/80 border-red-700/40 text-red-300"
            }`}>
            {toast.type === "success"
              ? <FaCheckCircle className="text-green-400 flex-shrink-0" />
              : <FaTimesCircle className="text-red-400 flex-shrink-0" />
            }
            {toast.message}
            <button onClick={() => setToast(null)} className="ml-1 text-gray-500 hover:text-white transition-colors">
              <FiX className="text-xs" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile overlay */}
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
          <button className="ml-auto p-1 rounded text-gray-600 hover:text-white lg:hidden transition-colors" onClick={() => setSidebarOpen(false)}>
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
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-red-400 font-medium bg-red-600/10 px-1.5 py-0.5 rounded border border-red-600/20">
                  LVL {userStats.level}
                </span>
                <span className="text-[10px] text-gray-600">{userStats.totalPoints} XP</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
              <span>{xpInLevel} / {XP_PER_LEVEL} XP to Level {userStats.level + 1}</span>
            </div>
            <div className="h-1 bg-[#1C1C1C] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-700" style={{ width: `${Math.max(2, xpProgress)}%` }} />
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5 scrollbar-hide">
          {navLinks.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
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
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 bg-red-600/12 border border-red-600/18 transition-colors">
            <FiSettings className="text-base" /> Settings
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-600/10 transition-colors">
            <FiLogOut className="text-base" /> Log out
          </button>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-16 flex items-center gap-3 px-5 border-b border-red-900/15 bg-[#0A0A0A] flex-shrink-0">
          <button className="lg:hidden p-2 rounded-md text-gray-600 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setSidebarOpen(true)}>
            <FiMenu className="text-base" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-none">Account Settings</p>
            <p className="text-[11px] text-gray-600 mt-0.5 hidden sm:block">Manage your profile and security</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] border border-orange-600/20 rounded-lg">
            <FaFire className="text-orange-400 text-sm" />
            <span className="text-sm font-bold text-white">{userStats.currentStreak}</span>
            <span className="text-[11px] text-gray-500 hidden sm:inline">streak</span>
          </div>
          <button className="relative p-2 rounded-lg text-gray-600 hover:text-white hover:bg-white/5 transition-colors">
            <FiBell className="text-base" />
          </button>
          <div className="relative" ref={userMenuRef}>
            <button onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-white/5 transition-colors focus:outline-none">
              <div className="w-7 h-7 rounded-full bg-red-600/15 border border-red-600/25 flex items-center justify-center text-red-400 text-xs font-bold">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <FiChevronDown className={`text-[11px] text-gray-500 transition-transform duration-150 ${userMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#101010] border border-red-900/20 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-1.5 z-50">
                <div className="px-3 py-2 border-b border-red-900/10 mb-1">
                  <p className="text-xs font-semibold text-white truncate">{user?.username}</p>
                  <p className="text-[11px] text-gray-600 truncate">{user?.email}</p>
                </div>
                {[
                  { icon: FiUser,     label: "Profile",  href: `/profile/${user?.username}` },
                  { icon: FiSettings, label: "Settings", href: "/settings" },
                ].map(({ icon: Icon, label, href }) => (
                  <Link key={href} href={href} onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                    <Icon className="text-sm" /> {label}
                  </Link>
                ))}
                <div className="my-1 h-px bg-red-900/10" />
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-600/10 transition-colors">
                  <FiLogOut className="text-sm" /> Log out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5">
          <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-5">

            {/* Settings Tabs */}
            <aside className="w-full lg:w-48 flex-shrink-0">
              <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-xl p-2">
                <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider px-3 py-2">Settings</p>
                {[
                  { key: "profile",  icon: FiUser,     label: "Profile" },
                  { key: "password", icon: FaLock,     label: "Password" },
                  { key: "danger",   icon: FaTrash,    label: "Danger Zone" },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                      ${activeTab === key
                        ? key === "danger"
                          ? "bg-red-600/15 text-red-400 border border-red-600/20"
                          : "bg-red-600/15 text-red-400 border border-red-600/20"
                        : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]"
                      }`}
                  >
                    <Icon className="text-base flex-shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </aside>

            {/* Tab Content */}
            <div className="flex-1 min-w-0">

              {/* ── Profile Tab ── */}
              {activeTab === "profile" && (
                <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-xl">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-red-400" />
                      <h2 className="text-sm font-semibold text-white">Profile Settings</h2>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                        ${isEditing
                          ? "bg-white/[0.05] text-gray-400 hover:text-white border border-white/[0.07]"
                          : "bg-red-600/10 text-red-400 border border-red-600/20 hover:bg-red-600/20"
                        }`}
                    >
                      {isEditing ? <><FiX className="text-xs" /> Cancel</> : <><FiEdit2 className="text-xs" /> Edit</>}
                    </button>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-red-600/10 border-2 border-red-600/20 overflow-hidden flex items-center justify-center">
                          {profilePic
                            ? <img src={profilePic} alt="Avatar" className="w-full h-full object-cover" />
                            : <FaUser className="text-red-400 text-xl" />
                          }
                        </div>
                        {isEditing && (
                          <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg">
                            <FaCamera className="text-white text-[10px]" />
                            <input type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" />
                          </label>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{formData.username || "—"}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        {formData.country && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <CountryFlag country={formData.country} size="14px" height="12px" title={formData.country} />
                            <span className="text-xs text-gray-500">{formData.country}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className={labelCls}>Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleFormChange} placeholder="Your full name" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleFormChange} placeholder="username" className={inputCls} />
                            <p className="text-[10px] text-gray-600 mt-1">No spaces, must be unique</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className={labelCls}>Country</label>
                            <input type="text" name="country" value={formData.country} onChange={handleFormChange} placeholder="e.g. Pakistan, India" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Email</label>
                            <input type="email" value={user?.email || ""} disabled className={`${inputCls} opacity-40 cursor-not-allowed`} />
                            <p className="text-[10px] text-gray-600 mt-1">Cannot be changed</p>
                          </div>
                        </div>

                        <div>
                          <label className={labelCls}>Bio</label>
                          <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Tell others about yourself..." rows={3} className={`${inputCls} resize-none`} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className={`${labelCls} flex items-center gap-1.5`}>
                              <FaLinkedin className="text-[#0A66C2]" /> LinkedIn username
                            </label>
                            <input
                              type="text"
                              placeholder="yourname"
                              value={formData.linkedin_url ? formData.linkedin_url.replace("https://www.linkedin.com/in/", "") : ""}
                              onChange={(e) => setFormData((p) => ({ ...p, linkedin_url: e.target.value ? `https://www.linkedin.com/in/${e.target.value}` : "" }))}
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className={`${labelCls} flex items-center gap-1.5`}>
                              <FaGithub className="text-gray-300" /> GitHub username
                            </label>
                            <input
                              type="text"
                              placeholder="yourname"
                              value={formData.github_url ? formData.github_url.replace("https://github.com/", "") : ""}
                              onChange={(e) => setFormData((p) => ({ ...p, github_url: e.target.value ? `https://github.com/${e.target.value}` : "" }))}
                              className={inputCls}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={handleSaveProfile}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                          >
                            <FaSave className={isLoading ? "animate-spin" : ""} />
                            {isLoading ? "Saving…" : "Save Changes"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        {formData.description && (
                          <p className="text-sm text-gray-400 leading-relaxed">{formData.description}</p>
                        )}
                        {(formData.linkedin_url || formData.github_url) && (
                          <div>
                            <p className="text-[11px] text-gray-500 mb-2 uppercase tracking-wider font-semibold">Social Links</p>
                            <div className="flex flex-wrap gap-2">
                              {formData.linkedin_url && (
                                <a href={formData.linkedin_url} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2]/10 border border-[#0A66C2]/20 rounded-lg text-xs text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors">
                                  <FaLinkedin /> LinkedIn
                                </a>
                              )}
                              {formData.github_url && (
                                <a href={formData.github_url} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-xs text-gray-300 hover:bg-white/[0.08] transition-colors">
                                  <FaGithub /> GitHub
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                        {!formData.description && !formData.linkedin_url && !formData.github_url && (
                          <p className="text-xs text-gray-600">No additional info — click Edit to add a bio and social links.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Password Tab ── */}
              {activeTab === "password" && (
                <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-xl">
                  <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.05]">
                    <FaLock className="text-red-400 text-sm" />
                    <h2 className="text-sm font-semibold text-white">Change Password</h2>
                  </div>
                  <div className="p-5 space-y-4">
                    {[
                      { key: "current", name: "currentPassword", label: "Current Password",     placeholder: "••••••••" },
                      { key: "new",     name: "newPassword",     label: "New Password",         placeholder: "••••••••" },
                      { key: "confirm", name: "confirmPassword", label: "Confirm New Password", placeholder: "••••••••" },
                    ].map(({ key, name, label, placeholder }) => (
                      <div key={key}>
                        <label className={labelCls}>{label}</label>
                        <div className="relative">
                          <input
                            type={showPasswords[key] ? "text" : "password"}
                            name={name}
                            value={passwordData[name]}
                            onChange={handlePasswordChange}
                            placeholder={placeholder}
                            className={`${inputCls} pr-10`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords((p) => ({ ...p, [key]: !p[key] }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                          >
                            {showPasswords[key] ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Strength */}
                    {passwordData.newPassword && (
                      <div className="bg-[#0A0A0F] border border-white/[0.06] rounded-lg p-4">
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Password Strength</p>
                        <div className="grid grid-cols-2 gap-2">
                          {strengthItems.map(({ key, label }) => (
                            <div key={key} className="flex items-center gap-2">
                              {passwordStrength[key]
                                ? <FaCheckCircle className="text-green-500 text-xs flex-shrink-0" />
                                : <FaTimesCircle className="text-gray-700 text-xs flex-shrink-0" />
                              }
                              <span className={`text-[11px] ${passwordStrength[key] ? "text-green-400" : "text-gray-600"}`}>
                                {label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleUpdatePassword}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                    >
                      {isLoading ? "Updating…" : "Update Password"}
                    </button>
                  </div>
                </div>
              )}

              {/* ── Danger Zone ── */}
              {activeTab === "danger" && (
                <div className="bg-[#0F0F0F] border border-red-900/30 rounded-xl">
                  <div className="flex items-center gap-2 px-5 py-4 border-b border-red-900/20">
                    <FaTrash className="text-red-400 text-sm" />
                    <h2 className="text-sm font-semibold text-red-400">Danger Zone</h2>
                  </div>
                  <div className="p-5">
                    <div className="bg-red-950/30 border border-red-900/30 rounded-xl p-5">
                      <p className="text-sm font-semibold text-red-400 mb-2">Delete Account</p>
                      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                        This will permanently delete your account including all practice progress, badges, streaks, and profile data. This action cannot be undone.
                      </p>
                      <button
                        onClick={() => setShowConfirmModal(true)}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-600/40 text-red-400 text-xs font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? "Deleting…" : "Delete My Account"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111118] border border-red-900/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-red-400" />
            </div>
            <h3 className="text-base font-bold text-white text-center mb-2">Delete Account?</h3>
            <p className="text-xs text-gray-500 text-center mb-2">This will permanently remove:</p>
            <ul className="text-xs text-gray-600 space-y-1 mb-5 mx-auto max-w-[200px]">
              {["All practice progress", "Badges earned", "Streaks & statistics", "Profile information"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-red-500/60 flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-red-400 text-center font-medium mb-5">This action is irreversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 bg-white/[0.05] border border-white/[0.08] text-gray-400 hover:text-white text-xs font-semibold rounded-lg transition-all">
                Cancel
              </button>
              <button onClick={confirmDeleteAccount}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
