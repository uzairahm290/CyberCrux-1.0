import { FaDiscord, FaLinkedin, FaXTwitter, FaGithub } from "react-icons/fa6";
import { FiShield, FiTerminal } from "react-icons/fi";
import Link from 'next/link';

const footerLinks = {
  Deployment: [
    { label: "Roadmaps",  href: "/roadmap" },
    { label: "Practice",  href: "/practice" },
    { label: "Compete",   href: "/compete" },
    { label: "Labs",      href: "/labs" },
    { label: "Encrypted Archives", href: "/books" },
  ],
  Network: [
    { label: "About Us",  href: "/about-us" },
    { label: "Dev Log",   href: "/blog" },
    { label: "Comms",     href: "/contact" },
  ],
  Protocols: [
    { label: "Privacy",   href: "/privacy" },
    { label: "Terms",     href: "/terms" },
  ],
};

const socials = [
  { icon: FaDiscord,  href: "#", label: "Discord" },
  { icon: FaLinkedin, href: "#", label: "LinkedIn" },
  { icon: FaXTwitter, href: "#", label: "Twitter / X" },
  { icon: FaGithub,   href: "#", label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-edge)] bg-[var(--color-surface)] mt-auto relative overflow-hidden font-sans">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-[radial-gradient(ellipse,rgba(225,29,72,0.1)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 rounded-lg bg-[#E11D48] flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.4)] group-hover:shadow-[0_0_25px_rgba(225,29,72,0.6)] transition-all">
                <FiShield className="text-white text-base" />
              </div>
              <span className="text-[var(--color-ink)] font-bold text-xl tracking-tight group-hover:text-[#E11D48] transition-colors">CyberCrux</span>
            </Link>
            <p className="text-[var(--color-muted)] text-sm leading-relaxed max-w-sm mb-8 font-light">
              The AI-powered tactical proving ground. Execute scenarios, secure assets, and dominate the interview protocol.
            </p>
            <div className="flex gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl border border-[var(--color-edge-strong)] bg-[var(--color-canvas)] flex items-center justify-center text-[var(--color-muted)] hover:text-[#E11D48] hover:border-[#E11D48]/50 hover:bg-[#E11D48]/10 hover:shadow-[0_0_15px_rgba(225,29,72,0.2)] transition-all duration-300 group"
                >
                  <Icon className="text-lg group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-[#E11D48] text-xs font-mono font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <FiTerminal className="text-[10px]" /> {heading}
              </p>
              <ul className="space-y-4">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[var(--color-muted)] text-sm hover:text-[var(--color-ink)] hover:translate-x-1 inline-block transition-all duration-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--color-edge-strong)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--color-faint)] text-xs font-mono uppercase tracking-widest">
            &copy; {new Date().getFullYear()} CYBERCRUX_SYSTEMS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2 text-[#E11D48] text-xs font-mono uppercase tracking-widest bg-[#E11D48]/10 px-3 py-1 rounded-full border border-[#E11D48]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse" />
            NODE STATUS: SECURE
          </div>
        </div>
      </div>
    </footer>
  );
}
