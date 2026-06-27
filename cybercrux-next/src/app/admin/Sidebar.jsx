"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBook, FaMap, FaTools, FaHome, FaList, FaBlog,
  FaPuzzlePiece, FaBars, FaProjectDiagram, FaGamepad,
  FaMedal, FaBell, FaUserTie, FaChevronLeft, FaShieldAlt
} from "react-icons/fa";

const navItems = [
  { label: "Dashboard", icon: FaHome, to: "/admin" },
  { label: "Blogs", icon: FaBlog, to: "/admin/blogs" },
  { label: "Roadmaps", icon: FaMap, to: "/admin/roadmaps" },
  { label: "Books", icon: FaBook, to: "/admin/books" },
  { label: "Practice", icon: FaPuzzlePiece, to: "/admin/practice" },
  { label: "Tools", icon: FaTools, to: "/admin/tools" },
  { label: "Tool Practice", icon: FaGamepad, to: "/admin/tool-practice" },
  { label: "HomeLabs", icon: FaList, to: "/admin/homelabs" },
  { label: "Projects", icon: FaProjectDiagram, to: "/admin/projects" },
  { label: "Mock Interviews", icon: FaUserTie, to: "/admin/mock-interviews" },
  { label: "Badges", icon: FaMedal, to: "/admin/badges" },
  { label: "Notifications", icon: FaBell, to: "/admin/notifications" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (to) => {
    if (to === "/admin") return pathname === "/admin";
    return pathname.startsWith(to);
  };

  return (
    <aside
      className={`${open ? "w-60" : "w-16"} bg-[#0C0C0C] border-r border-white/[0.06] flex flex-col transition-all duration-200 shrink-0`}
      style={{ minHeight: "100vh" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.06]">
        {open ? (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center">
              <FaShieldAlt className="text-white text-xs" />
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-none">CyberCrux</div>
              <div className="text-red-500 text-xs font-medium">Admin Panel</div>
            </div>
          </div>
        ) : (
          <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center mx-auto">
            <FaShieldAlt className="text-white text-xs" />
          </div>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          className="text-white/40 hover:text-white/80 transition-colors p-1 rounded"
        >
          {open ? <FaChevronLeft className="text-xs" /> : <FaBars className="text-xs" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, to }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              href={to}
              title={!open ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                active
                  ? "bg-red-600/15 text-red-400 border-l-2 border-red-500"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.04] border-l-2 border-transparent"
              }`}
            >
              <Icon className={`shrink-0 ${active ? "text-red-400" : "text-white/40"} ${open ? "text-sm" : "text-base mx-auto"}`} />
              {open && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
