import React, { useState, useEffect } from "react";
import DashNav from "./DashNav";
import Footer from "./Footer";
import ToolPracticeGame from "./ToolPracticeGame";
import {
  FaWrench, FaTerminal, FaLock, FaNetworkWired, FaBug, FaUpload, FaRocket,
  FaSearch, FaStar, FaDownload, FaEye, FaCode, FaBook, FaPlay
} from "react-icons/fa";
import DOMPurify from "dompurify";
import { BiCategory, BiChevronRight } from "react-icons/bi";
import { useTheme } from '../ThemeContext';

const iconMap = {
  FaNetworkWired,
  FaBug,
  FaLock,
  FaCode,
  FaPlay,
  FaBook,
  FaTerminal,
  FaUpload,
  FaRocket,
  FaSearch,
  FaStar,
  FaDownload,
  FaEye,
  FaWrench, // fallback
};

export default function ToolsPage() {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', name: 'All Tools', count: 0 }]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileCategoryMenuOpen, setMobileCategoryMenuOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const { theme } = useTheme();

  // Fetch all tools
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:5000/api/tools')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch tools');
        return res.json();
      })
      .then((data) => {
        setTools(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Fetch dynamic categories based on tools
  useEffect(() => {
    fetch('http://localhost:5000/api/tools/categories')
      .then(res => res.json())
      .then(data => {
        const dynamicCategories = [
          { id: 'all', name: 'All Tools', count: tools.length },
          ...data.map(cat => ({
            id: cat.toLowerCase(),
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            count: tools.filter(t => t.category?.toLowerCase() === cat.toLowerCase()).length
          }))
        ];
        setCategories(dynamicCategories);
      })
      .catch(err => console.error('Failed to fetch categories', err));
  }, [tools]);

  // Tool practice game handlers
  const handlePracticeClick = (tool) => {
    setSelectedTool(tool);
    setShowGame(true);
  };

  const handleGameComplete = (score) => {
    console.log(`Game completed with score: ${score}`);
    // You can add additional logic here like updating user stats
  };

  const handleCloseGame = () => {
    setShowGame(false);
    setSelectedTool(null);
  };

  // Filter and sort tools
  const filteredTools = tools
    .filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'newest':
          return b.id - a.id;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const featuredTools = tools.filter(tool => tool.featured);


  // Modal for tool details
  function ToolDetailModal({ tool, onClose }) {
    if (!tool) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-6 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative border border-white/20">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl">
              {/* Render icon by name if needed, fallback to FaWrench */}
              {iconMap[tool.icon] ? React.createElement(iconMap[tool.icon], { className: "text-blue-400 text-2xl" }) : <FaWrench className="text-blue-400 text-2xl" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">{tool.name}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FaStar className="w-3 h-3 text-yellow-400" />
                <span>{tool.rating}</span>
                <span className="mx-2">•</span>
                <span>{tool.downloads?.toLocaleString() || 0} downloads</span>
              </div>
            </div>
          </div>
          <p className="text-gray-300 mb-3 text-sm">{tool.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">{tool.type}</span>
            <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">{tool.difficulty}</span>
            <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">{tool.license}</span>
            {tool.platforms && tool.platforms.map((p) => (
              <span key={p} className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">{p}</span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
            <div>
              <span className="font-semibold text-white">Author:</span> <span className="text-gray-300">{tool.author}</span>
            </div>
          </div>
          {tool.website && (
            <div className="mb-3 text-sm">
              <span className="font-semibold text-white">Website:</span> 
              <a href={tool.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline ml-1">{tool.website}</a>
            </div>
          )}
          <div className="mb-4 p-4 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m-9 4h18" />
              </svg>
              How to Use
            </h3>
            <div
              className="prose prose-invert max-w-none text-gray-300 leading-relaxed tracking-wide text-sm"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tool.how_to_use || "") }}
            />
          </div>
</div>  
</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <DashNav />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="text-center py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaWrench className="text-2xl text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 pb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Cybersecurity Tools
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Explore, learn, and master essential cybersecurity tools. From network scanners to web security 
              platforms, find the perfect tools for your security testing needs.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <FaWrench className="w-4 h-4" />
                {tools.length} Tools Available
              </span>
              <span className="flex items-center gap-2">
                <FaDownload className="w-4 h-4" />
                {tools.reduce((total, tool) => total + (tool.downloads || 0), 0).toLocaleString()} Downloads
              </span>
            </div>
          </div>
        </section>

        {/* Featured Tools Section */}
        {featuredTools.length > 0 && (
          <section className="px-4 mb-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Featured Tools</h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FaStar className="w-4 h-4 text-yellow-400" />
                  Most Popular
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {/* Render icon by name if needed, or use a default icon */}
                        {iconMap[tool.icon] ? React.createElement(iconMap[tool.icon], { className: "text-3xl text-blue-400" }) : <FaWrench className="text-3xl text-blue-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                            Featured
                          </span>
                          <div className="flex items-center gap-1">
                            <FaStar className="w-3 h-3 text-yellow-400" />
                            <span className="text-sm text-gray-300">{tool.rating}</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-white line-clamp-2">{tool.name}</h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{tool.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">{tool.type}</span>
                          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105"
                            onClick={() => { setSelectedTool(tool); setShowModal(true); }}
                          >
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Desktop Sidebar */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl sticky top-8">
                  <h3 className="text-xl font-bold mb-6 text-white">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                          selectedCategory === category.id
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Category Menu Button */}
              <div className="lg:hidden fixed top-1/2 right-98 transform -translate-y-1/2 z-40">
                <button
                  onClick={() => setMobileCategoryMenuOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-110"
                  aria-label="Open Categories"
                >
                  <BiCategory className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Category Menu Overlay */}
              {mobileCategoryMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setMobileCategoryMenuOpen(false)}>
                  <div 
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 w-64 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transform transition-all duration-300 ease-in-out"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Categories</h3>
                        <button
                          onClick={() => setMobileCategoryMenuOpen(false)}
                          className="text-white hover:text-blue-400 transition-colors p-1"
                          aria-label="Close Categories"
                        >
                          <BiChevronRight className="w-4 h-4 rotate-180" />
                        </button>
                      </div>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => {
                              setSelectedCategory(category.id);
                              setMobileCategoryMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-300 ${
                              selectedCategory === category.id
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <span className="font-medium text-sm">{category.name}</span>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                              {category.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Content Area */}
              <div className="lg:col-span-3">
                {/* Loading/Error States */}
                {loading && (
                  <div className="text-center py-12">
                    <span className="text-xl text-gray-300">Loading tools...</span>
                  </div>
                )}
                {error && (
                  <div className="text-center py-12">
                    <span className="text-xl text-red-400">{error}</span>
                  </div>
                )}
                {!loading && !error && (
                  <>
                {/* Search and Filter Bar */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl mb-8">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search tools by name, description, or type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Sort Dropdown */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                          className="px-4 py-3 bg-white text-blue-900 border border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="featured">Featured First</option>
                      <option value="rating">Highest Rated</option>
                      <option value="downloads">Most Downloaded</option>
                      <option value="newest">Newest First</option>
                      <option value="name">Alphabetical</option>
                    </select>

                    {/* View Mode Toggle */}
                    <div className="flex bg-white/10 rounded-xl p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-2 rounded-lg transition-all ${
                          viewMode === 'grid' 
                            ? 'bg-blue-500 text-white' 
                            : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        Grid
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-2 rounded-lg transition-all ${
                          viewMode === 'list' 
                            ? 'bg-blue-500 text-white' 
                            : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        List
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-400">
                    Showing {filteredTools.length} of {tools.length} tools
                  </p>
                </div>

                {/* Tools Grid/List */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTools.map((tool) => (
                      <div
                        key={tool.id}
                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
                      >
                        <div className="text-center">
                          <div className="flex justify-center mb-4">
                                {iconMap[tool.icon] ? React.createElement(iconMap[tool.icon], { className: "text-3xl text-blue-400" }) : <FaWrench className="text-3xl text-blue-400" />}
                          </div>
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              <FaStar className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-gray-300">{tool.rating}</span>
                            </div>
                            <span className="text-gray-500">•</span>
                                <span className="text-sm text-gray-400">{(tool.downloads || 0).toLocaleString()} downloads</span>
                          </div>
                          <h3 className="font-bold text-lg mb-2 text-white line-clamp-2">{tool.name}</h3>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{tool.description}</p>
                          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-4">
                            <span className="px-2 py-1 bg-white/10 rounded-full">
                              {tool.type}
                            </span>
                            <span className="px-2 py-1 bg-white/10 rounded-full">
                              {tool.difficulty}
                            </span>
                          </div>
                          <div className="flex gap-2">
                                <button
                                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105"
                                  onClick={() => { setSelectedTool(tool); setShowModal(true); }}
                                >
                              Learn More
                            </button>
                            <button 
                              onClick={() => handlePracticeClick(tool)}
                              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1"
                            >
                              <FaPlay className="w-3 h-3" />
                              Practice
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTools.map((tool) => (
                      <div
                        key={tool.id}
                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
                      >
                        <div className="flex items-start gap-6">
                          <div className="flex-shrink-0">
                                {iconMap[tool.icon] ? React.createElement(iconMap[tool.icon], { className: "text-3xl text-blue-400" }) : <FaWrench className="text-3xl text-blue-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-xl text-white">{tool.name}</h3>
                              <div className="flex items-center gap-1">
                                <FaStar className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm text-gray-300">{tool.rating}</span>
                              </div>
                            </div>
                            <p className="text-gray-400 mb-3">{tool.description}</p>
                            <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                              <span className="flex items-center gap-2">
                                    {/* FaUser may not be imported, fallback to author name only */}
                                {tool.author}
                              </span>
                              <span className="flex items-center gap-2">
                                <FaEye className="w-4 h-4" />
                                    {(tool.downloads || 0).toLocaleString()} downloads
                              </span>
                              <span className="flex items-center gap-2">
                                <FaBook className="w-4 h-4" />
                                {tool.tutorials} tutorials
                              </span>
                              <span className="flex items-center gap-2">
                                <FaPlay className="w-4 h-4" />
                                {tool.practiceScenarios} scenarios
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                                {tool.type}
                              </span>
                              <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                                {tool.difficulty}
                              </span>
                              <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                                {tool.license}
                              </span>
                            </div>
                            <div className="flex gap-3">
                                  <button
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    onClick={() => { setSelectedTool(tool); setShowModal(true); }}
                                  >
                                Learn More
                              </button>
                              <button 
                                onClick={() => handlePracticeClick(tool)}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                              >
                                <FaPlay className="w-4 h-4" />
                                Practice
                              </button>
                            </div>
                          </div>
                </div>
              </div>
            ))}
          </div>
                )}
                {/* No Results */}
                {filteredTools.length === 0 && (
                  <div className="text-center py-12">
                    <FaWrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-300 mb-2">No tools found</h3>
                    <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                  </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
      {showModal && (
        <ToolDetailModal tool={selectedTool} onClose={() => { setShowModal(false); setSelectedTool(null); }} />
      )}
      
      {/* Tool Practice Game Modal */}
      {showGame && selectedTool && (
        <ToolPracticeGame
          toolName={selectedTool.name}
          onGameComplete={handleGameComplete}
          onClose={handleCloseGame}
        />
      )}
    </div>
  );
} 