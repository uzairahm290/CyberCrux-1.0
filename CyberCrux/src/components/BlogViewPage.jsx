import { useParams, useNavigate, Link } from "react-router-dom";
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
  FaWhatsapp
} from "react-icons/fa";
import { useTheme } from '../ThemeContext';

// Mock blog data (should be replaced with real data/fetch in production)
const blogs = [
  {
    id: 1,
    title: "Getting Started with Cybersecurity: A Complete Beginner's Guide",
    author: "Sarah Chen",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    date: "2024-06-01",
    readTime: "8 min read",
    category: "Beginner",
    tags: ["cybersecurity", "beginners", "guide", "security"],
    excerpt: "Learn the fundamentals of cybersecurity and start your journey into the world of digital security. This comprehensive guide covers everything from basic concepts to practical applications.",
    content: `
      <h2>Welcome to the World of Cybersecurity!</h2>
      <p>Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes.</p>
      
      <h3>Why Cybersecurity Matters</h3>
      <p>In today's interconnected world, everyone benefits from advanced cyber defense programs. At an individual level, a cybersecurity attack can result in everything from identity theft, to extortion attempts, to the loss of important data like family photos. Everyone relies on critical infrastructure like power plants, hospitals, and financial service companies. Securing these and other organizations is essential to keeping our society functioning.</p>
      
      <h3>Key Concepts in Cybersecurity</h3>
      <ul>
        <li><strong>Confidentiality:</strong> Ensuring that information is accessible only to those authorized to have access</li>
        <li><strong>Integrity:</strong> Maintaining and assuring the accuracy and completeness of data</li>
        <li><strong>Availability:</strong> Ensuring that authorized users have access to information when needed</li>
      </ul>
      
      <h3>Common Types of Cyber Threats</h3>
      <p>Understanding the types of threats you might face is the first step in protecting yourself:</p>
      <ul>
        <li><strong>Malware:</strong> Malicious software designed to harm systems or steal data</li>
        <li><strong>Phishing:</strong> Fraudulent attempts to obtain sensitive information</li>
        <li><strong>Ransomware:</strong> Malware that encrypts files and demands payment for decryption</li>
        <li><strong>Social Engineering:</strong> Manipulating people into revealing confidential information</li>
      </ul>
      
      <h3>Getting Started: Basic Security Practices</h3>
      <p>Here are some fundamental practices to get you started on your cybersecurity journey:</p>
      <ol>
        <li>Use strong, unique passwords for each account</li>
        <li>Enable two-factor authentication wherever possible</li>
        <li>Keep your software and systems updated</li>
        <li>Be cautious with email attachments and links</li>
        <li>Regularly backup your important data</li>
      </ol>
      
      <h3>Next Steps</h3>
      <p>This is just the beginning of your cybersecurity journey. As you progress, you'll learn about more advanced topics like network security, ethical hacking, and incident response. Remember, cybersecurity is a continuous learning process, and staying informed about the latest threats and defenses is crucial.</p>
    `,
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
    tags: ["penetration-testing", "advanced", "security", "ethical-hacking"],
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
    tags: ["web-security", "best-practices", "development", "owasp"],
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
    tags: ["artificial-intelligence", "machine-learning", "future", "automation"],
    excerpt: "Explore how artificial intelligence is revolutionizing cybersecurity and what the future holds for AI-powered security solutions.",
    content: "<h2>AI Revolution in Security</h2><p>Understanding the <code>AI-powered</code> security landscape.</p>",
    featured: false,
    views: 2034
  }
];

export default function BlogViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogs.find((b) => String(b.id) === String(id));
  const { theme } = useTheme();

  // Social share handlers
  const shareUrl = window.location.href;
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    // You could add a toast notification here instead of alert
    alert("Link copied to clipboard!");
  };

  // Suggested blogs (exclude current, pick 3 others)
  const suggested = blogs.filter((b) => String(b.id) !== String(id)).slice(0, 3);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
        <DashNav />
        <main className="flex-1 flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaEye className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-300 mb-4">Blog Not Found</h2>
            <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
            <button 
              onClick={() => navigate('/blog')} 
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaArrowLeft /> Back to Blog
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Helper to get a short excerpt from HTML content
  function getExcerpt(html, maxLen = 120) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <DashNav />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-10">
          {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300"
          >
            <FaArrowLeft /> Back to Blog
          </button>
          </div>

        {/* Main Blog Content */}
        <article className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Blog Header */}
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                {blog.category}
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <FaClock className="w-3 h-3" />
                {blog.readTime}
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <FaEye className="w-3 h-3" />
                {blog.views.toLocaleString()} views
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {blog.title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              {blog.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src={blog.authorAvatar} 
                  alt={blog.author}
                  className="w-12 h-12 rounded-full border-2 border-blue-400"
                />
                <div>
                  <p className="font-semibold text-white">{blog.author}</p>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <FaCalendarAlt className="w-3 h-3" />
                    {formatDate(blog.date)}
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
                  {/* Share Dropdown */}
                  <div className="absolute right-0 top-full mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                    <div className="flex gap-2">
                      <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg transition-colors">
                        <FaTwitter className="w-4 h-4 text-blue-400" />
                      </a>
                      <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg transition-colors">
                        <FaLinkedin className="w-4 h-4 text-blue-500" />
                      </a>
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-700/20 hover:bg-blue-700/40 rounded-lg transition-colors">
                        <FaFacebookF className="w-4 h-4 text-blue-600" />
                      </a>
                      <button onClick={handleCopy} className="p-2 bg-gray-500/20 hover:bg-gray-500/40 rounded-lg transition-colors">
                        <FaCopy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="px-8 py-4 border-b border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <FaTags className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-gray-300">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Blog Content */}
          <div className="p-8">
            <div 
              className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-blue-300 prose-code:text-cyan-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-500/10 prose-blockquote:rounded-r-lg"
              dangerouslySetInnerHTML={{ __html: blog.content }} 
            />
        </div>
        </article>

        {/* Suggested Blogs Section */}
        {suggested.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-purple-400">Related Articles</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {suggested.map((s) => (
                <Link to={`/blog/${s.id}`} key={s.id} className="block group">
                  <article className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-medium">
                        {s.category}
                      </span>
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {s.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                      {s.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {s.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img 
                          src={s.authorAvatar} 
                          alt={s.author}
                          className="w-6 h-6 rounded-full border border-purple-400"
                        />
                        <span className="text-xs text-gray-300">{s.author}</span>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(s.date)}</span>
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