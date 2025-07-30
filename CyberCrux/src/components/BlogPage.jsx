import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashNav from "./DashNav";
import Footer from "./Footer";
import { useTheme } from '../ThemeContext';
import { 
  FaSearch, 
  FaCalendarAlt, 
  FaUser, 
  FaArrowRight, 
  FaBookmark, 
  FaShare,
  FaTags,
  FaEye,
  FaClock
} from "react-icons/fa";

const blogs = [
  {
    id: 1,
    title: "Getting Started with Cybersecurity: A Complete Beginner's Guide",
    author: "Sarah Chen",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    date: "2024-06-01",
    readTime: "8 min read",
    category: "Beginner",
    tags: ["cybersecurity", "beginners", "guide"],
    excerpt: "Learn the fundamentals of cybersecurity and start your journey into the world of digital security. This comprehensive guide covers everything from basic concepts to practical applications.",
    content: "<h2>Welcome to the World of Cybersecurity!</h2><p>This is a <strong>comprehensive</strong> guide for beginners.</p>",
    featured: true,
    views: 1247
  },
  {
    id: 2,
    title: "Advanced Penetration Testing Techniques for 2024",
    author: "Marcus Rodriguez",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    date: "2024-06-02",
    readTime: "12 min read",
    category: "Advanced",
    tags: ["penetration-testing", "advanced", "security"],
    excerpt: "Explore cutting-edge penetration testing methodologies and tools that are shaping the cybersecurity landscape in 2024.",
    content: "<p>Advanced <em>penetration testing</em> techniques with <a href='https://example.com'>real-world examples</a>.</p>",
    featured: false,
    views: 892
  },
  {
    id: 3,
    title: "Building Secure Web Applications: Best Practices",
    author: "Emily Watson",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    date: "2024-06-10",
    readTime: "15 min read",
    category: "Development",
    tags: ["web-security", "best-practices", "development"],
    excerpt: "Discover essential security practices for building robust and secure web applications that protect against common vulnerabilities.",
    content: "<h2>Secure Web Development</h2><ul><li>Input validation</li><li>Authentication</li><li>Authorization</li></ul>",
    featured: false,
    views: 1567
  },
  {
    id: 4,
    title: "The Future of AI in Cybersecurity: Trends and Predictions",
    author: "Dr. Alex Thompson",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    date: "2024-06-12",
    readTime: "10 min read",
    category: "AI & ML",
    tags: ["artificial-intelligence", "machine-learning", "future"],
    excerpt: "Explore how artificial intelligence is revolutionizing cybersecurity and what the future holds for AI-powered security solutions.",
    content: "<h2>AI Revolution in Security</h2><p>Understanding the <code>AI-powered</code> security landscape.</p>",
    featured: false,
    views: 2034
  },
  {
    id: 5,
    title: "Incident Response: A Step-by-Step Guide for Security Teams",
    author: "Lisa Park",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    date: "2024-06-15",
    readTime: "18 min read",
    category: "Incident Response",
    tags: ["incident-response", "security-operations", "guide"],
    excerpt: "Learn how to effectively respond to security incidents with this comprehensive step-by-step guide for security professionals.",
    content: "<h2>Effective Incident Response</h2><p>Master the art of <strong>incident handling</strong> and response.</p>",
    featured: false,
    views: 1345
  },
  {
    id: 6,
    title: "Cloud Security: Protecting Your Digital Assets",
    author: "David Kim",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    date: "2024-06-18",
    readTime: "14 min read",
    category: "Cloud Security",
    tags: ["cloud-security", "digital-assets", "protection"],
    excerpt: "Navigate the complexities of cloud security and learn how to protect your organization's digital assets in the cloud.",
    content: "<h2>Cloud Security Essentials</h2><p>Secure your <em>cloud infrastructure</em> effectively.</p>",
    featured: false,
    views: 987
  }
];

const categories = [
  { name: "All", value: "all" },
  { name: "Beginner", value: "beginner" },
  { name: "Advanced", value: "advanced" },
  { name: "Development", value: "development" },
  { name: "AI & ML", value: "ai-ml" },
  { name: "Incident Response", value: "incident-response" },
  { name: "Cloud Security", value: "cloud-security" }
];

export default function BlogPage() {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort blogs
  const filtered = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase()) ||
                         blog.author.toLowerCase().includes(search.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || 
                           blog.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date) - new Date(a.date);
      case "views":
        return b.views - a.views;
      case "readTime":
        return parseInt(a.readTime) - parseInt(b.readTime);
      default:
        return 0;
    }
  });

  const featured = sorted.find(blog => blog.featured);
  const latest = sorted.filter(blog => !blog.featured).slice(0, 3);
  const others = sorted.filter(blog => !blog.featured).slice(3);

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, sortBy]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white font-sans relative overflow-x-hidden">
      <DashNav />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 pb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
            CyberCrux Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover insights, tutorials, and the latest trends in cybersecurity from industry experts
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-2xl">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-lg shadow-lg transition-all duration-300"
                placeholder="Search articles, authors, or topics..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.value
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-white/10 backdrop-blur-xl border border-white/20 text-gray-300 hover:text-white hover:bg-white/20"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex justify-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              <option value="date">Sort by Date</option>
              <option value="views">Sort by Views</option>
              <option value="readTime">Sort by Read Time</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

          {/* Featured Blog */}
        {featured && !isLoading && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-blue-400">Featured Article</h2>
            </div>
              <Link to={`/blog/${featured.id}`} className="block group">
              <article className="bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-indigo-900/40 backdrop-blur-xl rounded-3xl border border-white/20 p-8 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-500 cursor-pointer">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                        {featured.category}
                      </span>
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {featured.readTime}
                      </span>
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors">
                      {featured.title}
                    </h3>
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={featured.authorAvatar} 
                          alt={featured.author}
                          className="w-12 h-12 rounded-full border-2 border-blue-400"
                        />
                        <div>
                          <p className="font-medium text-white">{featured.author}</p>
                          <p className="text-sm text-gray-400">{formatDate(featured.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <FaEye className="w-4 h-4" />
                          {featured.views.toLocaleString()}
                        </span>
                        <FaArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-80 flex-shrink-0">
                    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 h-full">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {featured.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-white/10 rounded-lg text-xs text-gray-300">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl transition-colors">
                          <FaBookmark className="w-4 h-4" />
                          Save Article
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl transition-colors">
                          <FaShare className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                  </div>
                </article>
              </Link>
            </section>
          )}

        {/* Latest Articles */}
        {latest.length > 0 && !isLoading && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-6 h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-purple-400">Latest Articles</h2>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              {latest.map((blog, index) => (
                  <Link to={`/blog/${blog.id}`} key={blog.id} className="block group">
                  <article className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-medium">
                        {blog.category}
                      </span>
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {blog.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <img 
                          src={blog.authorAvatar} 
                          alt={blog.author}
                          className="w-8 h-8 rounded-full border border-purple-400"
                        />
                        <div>
                          <p className="text-sm font-medium text-white">{blog.author}</p>
                          <p className="text-xs text-gray-400">{formatDate(blog.date)}</p>
                        </div>
                      </div>
                      <FaArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}

        {/* All Articles Grid */}
        {others.length > 0 && !isLoading && (
            <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-6 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-cyan-400">All Articles</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {others.map(blog => (
                  <Link to={`/blog/${blog.id}`} key={blog.id} className="block group">
                  <article className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5 group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg text-xs font-medium">
                        {blog.category}
                      </span>
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <FaEye className="w-3 h-3" />
                        {blog.views.toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img 
                          src={blog.authorAvatar} 
                          alt={blog.author}
                          className="w-6 h-6 rounded-full border border-cyan-400"
                        />
                        <span className="text-xs text-gray-300">{blog.author}</span>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(blog.date)}</span>
                    </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}

        {/* No Results */}
        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaSearch className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No articles found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
          )}
        </main>

      <Footer />
    </div>
  );
} 