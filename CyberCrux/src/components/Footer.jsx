// src/components/Footer.jsx
import { FaDiscord, FaLinkedin, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-white/10 backdrop-blur-xl border-t border-white/10 shadow-inner shadow-blue-500/10 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between gap-2 sm:gap-0 px-2 sm:px-6 py-4">
      <span className="text-white/70 text-center text-xs sm:text-sm font-semibold tracking-wide">
        &#169; CyberCrux 2025
      </span>
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs opacity-80 items-center">
        <Link to="/terms" className="text-blue-300 hover:text-blue-400 transition-colors duration-200 font-medium">Terms of Use</Link>
        <Link to="/privacy" className="text-blue-300 hover:text-blue-400 transition-colors duration-200 font-medium">Privacy Policy</Link>
        <Link to="/contact" className="text-blue-300 hover:text-blue-400 transition-colors duration-200 font-medium">Contact Us</Link>
      </div>
      <div className="flex gap-3 sm:gap-5 items-center mt-1">
        <a href="#" className="group rounded-full p-1 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-white/20 hover:bg-gradient-to-tr hover:from-blue-400 hover:to-purple-400 hover:shadow-[0_0_16px_2px_rgba(63,169,245,0.4)] transition-all duration-200 flex items-center justify-center scale-100 hover:scale-110">
          <FaDiscord className="text-white text-xl group-hover:text-white transition-colors duration-200" />
        </a>
        <a href="#" className="group rounded-full p-1 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-white/20 hover:bg-gradient-to-tr hover:from-blue-400 hover:to-purple-400 hover:shadow-[0_0_16px_2px_rgba(63,169,245,0.4)] transition-all duration-200 flex items-center justify-center scale-100 hover:scale-110">
          <FaLinkedin className="text-white text-xl group-hover:text-white transition-colors duration-200" />
        </a>
        <a href="#" className="group rounded-full p-1 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-white/20 hover:bg-gradient-to-tr hover:from-blue-400 hover:to-purple-400 hover:shadow-[0_0_16px_2px_rgba(63,169,245,0.4)] transition-all duration-200 flex items-center justify-center scale-100 hover:scale-110">
          <FaXTwitter className="text-white text-xl group-hover:text-white transition-colors duration-200" />
        </a>
        <a href="#" className="group rounded-full p-1 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-white/20 hover:bg-gradient-to-tr hover:from-blue-400 hover:to-purple-400 hover:shadow-[0_0_16px_2px_rgba(63,169,245,0.4)] transition-all duration-200 flex items-center justify-center scale-100 hover:scale-110">
          <FaInstagram className="text-white text-xl group-hover:text-white transition-colors duration-200" />
        </a>
      </div>
    </footer>
  );
}