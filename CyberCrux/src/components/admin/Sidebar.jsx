import { FaBook, FaMap, FaTools, FaHome, FaList, FaBlog, FaPuzzlePiece, FaBars, FaProjectDiagram, FaGamepad, FaMedal, FaBell, FaUserTie } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", icon: <FaHome />, to: "/admin" },
  { label: "Blogs", icon: <FaBlog />, to: "/admin/blogs" },
  { label: "Roadmaps", icon: <FaMap />, to: "/admin/roadmaps" },
  { label: "Books", icon: <FaBook />, to: "/admin/books" },
  { label: "Practice", icon: <FaPuzzlePiece />, to: "/admin/practice" },
  { label: "Tools", icon: <FaTools />, to: "/admin/tools" },
  { label: "Tool Practice", icon: <FaGamepad />, to: "/admin/tool-practice" },
  { label: "HomeLabs", icon: <FaList />, to: "/admin/homelabs" },
  { label: "Projects", icon: <FaProjectDiagram />, to: "/admin/projects" },
  { label: "Mock Interviews", icon: <FaUserTie />, to: "/admin/mock-interviews" },
  { label: "Badges", icon: <FaMedal />, to: "/admin/badges" },
  { label: "Notifications", icon: <FaBell />, to: "/admin/notifications" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  return (
    <aside className={`bg-[#0a2a4d] text-white ${open ? "w-64" : "w-20"} min-h-screen flex flex-col shadow-lg transition-all duration-200`}>
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <img src="/src/assets/logo.png" alt="Logo" className="h-8 w-8" />
          {open && <span className="text-xl font-bold tracking-wide">CyberCrux</span>}
        </div>
        <button className="md:hidden block text-2xl" onClick={() => setOpen(o => !o)}>
          <FaBars />
        </button>
      </div>
      <nav className="flex-1 flex flex-col gap-2 px-2">
        {navItems.map(item => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition text-base ${
                isActive ? "bg-blue-600 text-white shadow-lg" : "hover:bg-[#14305c] text-white/80"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {open && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
} 