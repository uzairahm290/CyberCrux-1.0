// src/components/Footer.jsx
import { FaDiscord, FaLinkedin, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full bg-black/50 backdrop-blur-3xl border-t border-white/5 shadow-inner shadow-cyan-500/5 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between gap-2 sm:gap-0 px-2 sm:px-6 py-4">
      <span className="text-white/50 text-center text-xs sm:text-sm font-semibold tracking-wide">
        &#169; CyberCrux 2025
      </span>
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs opacity-80 items-center">
        <Link to="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 font-medium">Terms of Use</Link>
        <Link to="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 font-medium">Privacy Policy</Link>
        <Link to="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 font-medium">Contact Us</Link>
      </div>
      <div className="flex gap-3 sm:gap-5 items-center mt-1">
        <a href="#" className="group rounded-full p-1 bg-gradient-to-tr from-cyan-500/10 to-fuchsia-500/10 border border-white/10 hover:bg-gradient-to-tr hover:from-cyan-400 hover:to-fuchsia-400 hover:shadow-[0_0_16px_2px_rgba(6,182,212,0.4)] transition-all duration-300 flex items-center justify-center scale-100 hover:scale-110">
          <FaDiscord className="text-white text-xl group-hover:text-white transition-colors duration-200" />
        </a>
        <a href="#" className="group rounded-full p-1 bg-gradient-to-tr from-cyan-500/10 to-fuchsia-500/10 border border-white/10 hover:bg-gradient-to-tr hover:from-cyan-400 hover:to-fuchsia-400 hover:shadow-[0_0_16px_2px_rgba(6,182,212,0.4)] transition-all duration-300 flex items-center justify-center scale-100 hover:scale-110">
          <FaLinkedin className="text-white text-xl group-hover:text-white transition-colors duration-200" />
        </a>
        <a href="#" className="group rounded-full p-1 bg-gradient-to-tr from-cyan-500/10 to-fuchsia-500/10 border border-white/10 hover:bg-gradient-to-tr hover:from-cyan-400 hover:to-fuchsia-400 hover:shadow-[0_0_16px_2px_rgba(6,182,212,0.4)] transition-all duration-300 flex items-center justify-center scale-100 hover:scale-110">
          <FaXTwitter className="text-white text-xl group-hover:text-white transition-colors duration-200" />
        </a>
        <a href="#" className="group rounded-full p-1 bg-gradient-to-tr from-cyan-500/10 to-fuchsia-500/10 border border-white/10 hover:bg-gradient-to-tr hover:from-cyan-400 hover:to-fuchsia-400 hover:shadow-[0_0_16px_2px_rgba(6,182,212,0.4)] transition-all duration-300 flex items-center justify-center scale-100 hover:scale-110">
          <FaInstagram className="text-white text-xl group-hover:text-white transition-colors duration-200" />
        </a>
      </div>
    </footer>
  );
}