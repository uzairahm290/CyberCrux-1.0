import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DashNav from "./DashNav";
import Footer from "./Footer";
import {
  FaArrowLeft,
  FaShareAlt,
  FaTwitter,
  FaLinkedin,
  FaCopy,
  FaBookmark,
  FaEye,
  FaClock,
  FaUser,
  FaCalendarAlt,
  FaTags,
  FaFacebookF,
  FaHome,
  FaDownload,
  FaLaptop,
  FaCog,
  FaStar,
  FaTools,
  FaGraduationCap,
} from "react-icons/fa";
import { useTheme } from "../ThemeContext";

export default function HomeLabViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [lab, setLab] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const shareUrl = window.location.href;
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  useEffect(() => {
    async function fetchLab() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/blogs/${id}`);
        if (!res.ok) throw new Error("Lab not found");
        const data = await res.json();
        
        // Map the data with proper field mapping and hardcoded values for missing fields
        const mappedLab = {
          ...data,
          // Use existing fields from blogs table
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          author: data.author || "Anonymous",
          author_avatar: data.author_avatar,
          date: data.date,
          read_time: data.read_time || "2-3 hours",
          tags: data.tags,
          featured: data.featured || false,
          views: data.views || 90,
          category: data.category || "general",
          
          // Hardcoded values for missing fields
          setup_time: data.read_time || "2-3 hours", // Use read_time as setup_time
          downloads: data.views || Math.floor(Math.random() * 1000) + 100, // Use views as downloads
          rating: 4.5, // Hardcoded rating
          tools: data.tags ? data.tags.split(',').map(tag => tag.trim()) : ["VirtualBox", "Kali Linux"], // Use tags as tools
          requirements: "8GB RAM, 50GB Storage", // Hardcoded requirements
          skills: data.tags ? data.tags.split(',').map(tag => tag.trim()) : ["Cybersecurity"], // Use tags as skills
          difficulty: "Beginner", // Hardcoded difficulty
          estimated_cost: "$0", // Hardcoded cost
          tutorials: 10, // Hardcoded tutorials count
          practice_scenarios: 5, // Hardcoded scenarios count
          
          // Use date instead of created_at
          created_at: data.date || new Date(),
        };
        
        setLab(mappedLab);
      } catch (err) {
        console.error(err);
        setError("Lab not found");
      } finally {
        setLoading(false);
      }
    }

    async function fetchSuggested() {
      try {
        const res = await fetch(`http://localhost:5000/api/blogs`);
        const all = await res.json();
        const homelabKeywords = [
          'homelab', 'home lab', 'lab setup', 'virtual lab', 'pentesting lab', 
          'security lab', 'testing environment', 'vulnerable', 'practice lab'
        ];
        const homelabBlogs = all.filter(blog => {
          const title = blog.title.toLowerCase();
          return homelabKeywords.some(keyword => title.includes(keyword)) && 
                 String(blog.id) !== String(id);
        }).slice(0, 3);
        
        // Map suggested labs with proper field mapping
        const mappedSuggested = homelabBlogs.map(blog => ({
          ...blog,
          setup_time: blog.read_time || "2-3 hours",
          created_at: blog.date || new Date(),
        }));
        
        setSuggested(mappedSuggested);
      } catch (err) {
        console.error("Suggested labs fetch failed:", err);
      }
    }

    fetchLab();
    fetchSuggested();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  function getExcerpt(html, maxLen = 120) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
        <DashNav />
        <main className="flex items-center justify-center py-20 text-lg">Loading lab...</main>
        <Footer />
      </div>
    );
  }

  if (error || !lab) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
        <DashNav />
        <main className="flex-1 flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHome className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-300 mb-4">Lab Not Found</h2>
            <p className="text-gray-400 mb-8">
              The lab setup you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/labs")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaArrowLeft /> Back to Labs
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <DashNav />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <button
            onClick={() => navigate("/labs")}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300"
          >
            <FaArrowLeft /> Back to Labs
          </button>
        </div>

        <article className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                Lab Setup
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <FaClock className="w-3 h-3" />
                {lab.setup_time || "2-3 hours"}
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <FaDownload className="w-3 h-3" />
                {Number(lab.downloads || 0).toLocaleString()} downloads
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <FaStar className="w-3 h-3 text-yellow-400" />
                {lab.rating || "N/A"}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {lab.title}
            </h1>

            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              {lab.description || getExcerpt(lab.content, 200)}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaHome className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{lab.author || "Anonymous"}</p>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <FaCalendarAlt className="w-3 h-3" />
                    {formatDate(lab.created_at || new Date())}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  <FaBookmark className="w-5 h-5 text-blue-400" />
                </button>
                <div className="relative group">
                  <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                    <FaShareAlt className="w-5 h-5 text-purple-400" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                    <div className="flex gap-2">
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          shareUrl
                        )}&text=${encodeURIComponent(lab.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg transition-colors"
                      >
                        <FaTwitter className="w-4 h-4 text-blue-400" />
                      </a>
                      <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                          shareUrl
                        )}&title=${encodeURIComponent(lab.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg transition-colors"
                      >
                        <FaLinkedin className="w-4 h-4 text-blue-500" />
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-700/20 hover:bg-blue-700/40 rounded-lg transition-colors"
                      >
                        <FaFacebookF className="w-4 h-4 text-blue-600" />
                      </a>
                      <button
                        onClick={handleCopy}
                        className="p-2 bg-gray-500/20 hover:bg-gray-500/40 rounded-lg transition-colors"
                      >
                        <FaCopy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lab Stats */}
          <div className="px-8 py-4 border-b border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-2">
                  <FaTools className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-sm text-gray-400">Tools</p>
                <p className="text-lg font-bold text-white">{lab.tools ? lab.tools.length : 0}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mx-auto mb-2">
                  <FaClock className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-sm text-gray-400">Setup Time</p>
                <p className="text-lg font-bold text-white">{lab.setup_time || "N/A"}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-2">
                  <FaStar className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-sm text-gray-400">Rating</p>
                <p className="text-lg font-bold text-white">{lab.rating || "N/A"}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-cyan-500/20 rounded-full mx-auto mb-2">
                  <FaDownload className="w-6 h-6 text-cyan-400" />
                </div>
                <p className="text-sm text-gray-400">Downloads</p>
                <p className="text-lg font-bold text-white">{Number(lab.downloads || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Requirements */}
          {lab.requirements && (
            <div className="px-8 py-4 border-b border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <FaLaptop className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-gray-300">Requirements:</span>
              </div>
              <p className="text-gray-300">{lab.requirements}</p>
            </div>
          )}

          {/* Skills */}
          {lab.skills && lab.skills.length > 0 && (
            <div className="px-8 py-4 border-b border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <FaGraduationCap className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-gray-300">Skills Covered:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {lab.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Lab Content */}
          <div className="p-8">
            <div
              className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-blue-300 prose-code:text-cyan-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-500/10 prose-blockquote:rounded-r-lg"
              dangerouslySetInnerHTML={{ __html: lab.content }}
            />
          </div>
        </article>

        {/* Suggested Labs */}
        {suggested.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-purple-400">Related Labs</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {suggested.map((s) => (
                <Link to={`/labs/${s.id}`} key={s.id} className="block group">
                  <article className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-medium">
                        Lab Setup
                      </span>
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {s.setup_time || "N/A"}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                      {s.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {getExcerpt(s.content)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <FaHome className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-gray-300">{s.author || "Anonymous"}</span>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(s.created_at || new Date())}</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
} 