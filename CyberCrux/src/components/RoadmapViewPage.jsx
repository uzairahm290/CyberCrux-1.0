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
  FaMap,
  FaRoute,
  FaFlagCheckered,
  FaGraduationCap,
  FaStar,
} from "react-icons/fa";
import { useTheme } from "../ThemeContext";

export default function RoadmapViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [roadmap, setRoadmap] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const shareUrl = window.location.href;
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/blogs/${id}`);
        if (!res.ok) throw new Error("Roadmap not found");
        const data = await res.json();
        
        // Map the data with proper field mapping and hardcoded values for missing fields
        const mappedRoadmap = {
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
          duration: data.read_time || "2-3 hours", // Use read_time as duration
          rating: 4.5, // Hardcoded rating
          modules: 5, // Hardcoded modules count
          skills: data.tags ? data.tags.split(',').map(tag => tag.trim()) : ["Cybersecurity"], // Use tags as skills
          certifications: [], // Hardcoded empty array
          estimatedHours: data.read_time || "3-4 hours", // Use read_time as estimated hours
          students: data.views || 0, // Use views as students count
          
          // Use date instead of created_at
          created_at: data.date || new Date(),
        };
        
        setRoadmap(mappedRoadmap);
        
        // Increment view count
        try {
          await fetch(`http://localhost:5000/api/blogs/${id}/view`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } catch (viewErr) {
          console.error("Failed to increment view count:", viewErr);
        }
      } catch (err) {
        console.error(err);
        setError("Roadmap not found");
      } finally {
        setLoading(false);
      }
    }

    async function fetchSuggested() {
      try {
        const res = await fetch(`http://localhost:5000/api/blogs`);
        const all = await res.json();
        const roadmapBlogs = all.filter(blog => 
          blog.title.toLowerCase().includes("roadmap") && 
          String(blog.id) !== String(id)
        ).slice(0, 3);
        
        // Map suggested roadmaps with proper field mapping
        const mappedSuggested = roadmapBlogs.map(blog => ({
          ...blog,
          duration: blog.read_time || "2-3 hours",
          created_at: blog.date || new Date(),
        }));
        
        setSuggested(mappedSuggested);
      } catch (err) {
        console.error("Suggested roadmaps fetch failed:", err);
      }
    }

    fetchRoadmap();
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
        <main className="flex items-center justify-center py-20 text-lg">Loading roadmap...</main>
        <Footer />
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
        <DashNav />
        <main className="flex-1 flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaMap className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-300 mb-4">Roadmap Not Found</h2>
            <p className="text-gray-400 mb-8">
              The roadmap you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/roadmap")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaArrowLeft /> Back to Roadmaps
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
            onClick={() => navigate("/roadmap")}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300"
          >
            <FaArrowLeft /> Back to Roadmaps
          </button>
        </div>

        <article className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                Roadmap
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <FaClock className="w-3 h-3" />
                {roadmap.duration || "N/A"}
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <FaEye className="w-3 h-3" />
                {Number(roadmap.views || 0).toLocaleString()} views
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <FaStar className="w-3 h-3 text-yellow-400" />
                {roadmap.rating || "N/A"}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {roadmap.title}
            </h1>

            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              {roadmap.excerpt || getExcerpt(roadmap.content, 200)}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaMap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{roadmap.author || "Anonymous"}</p>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <FaCalendarAlt className="w-3 h-3" />
                    {formatDate(roadmap.created_at || new Date())}
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
                        )}&text=${encodeURIComponent(roadmap.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg transition-colors"
                      >
                        <FaTwitter className="w-4 h-4 text-blue-400" />
                      </a>
                      <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                          shareUrl
                        )}&title=${encodeURIComponent(roadmap.title)}`}
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

          {/* Roadmap Stats */}
          <div className="px-8 py-4 border-b border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-2">
                  <FaGraduationCap className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-sm text-gray-400">Modules</p>
                <p className="text-lg font-bold text-white">{roadmap.modules || 0}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mx-auto mb-2">
                  <FaClock className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-sm text-gray-400">Duration</p>
                <p className="text-lg font-bold text-white">{roadmap.duration || "N/A"}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-2">
                  <FaStar className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-sm text-gray-400">Rating</p>
                <p className="text-lg font-bold text-white">{roadmap.rating || "N/A"}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-cyan-500/20 rounded-full mx-auto mb-2">
                  <FaUser className="w-6 h-6 text-cyan-400" />
                </div>
                <p className="text-sm text-gray-400">Views</p>
                <p className="text-lg font-bold text-white">{Number(roadmap.views || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          {roadmap.skills && roadmap.skills.length > 0 && (
            <div className="px-8 py-4 border-b border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <FaTags className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-gray-300">Skills Covered:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {roadmap.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Roadmap Content */}
          <div className="p-8">
            <div
              className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-blue-300 prose-code:text-cyan-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-500/10 prose-blockquote:rounded-r-lg"
              dangerouslySetInnerHTML={{ __html: roadmap.content }}
            />
          </div>
        </article>

        {/* Suggested Roadmaps */}
        {suggested.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-purple-400">Related Roadmaps</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {suggested.map((s) => (
                <Link to={`/roadmap/${s.id}`} key={s.id} className="block group">
                  <article className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-medium">
                        Roadmap
                      </span>
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {s.duration || "N/A"}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                      {s.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {s.excerpt || getExcerpt(s.content)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <FaMap className="w-3 h-3 text-white" />
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