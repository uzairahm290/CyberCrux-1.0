import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashNav from "./DashNav";
import Footer from "./Footer";
import axios from "axios";
import { useTheme } from "../ThemeContext";

import {
  FaMap, FaRoute, FaFlagCheckered, FaBook, FaLightbulb, FaSearch, FaStar, FaClock,
  FaUser, FaEye, FaGraduationCap
} from "react-icons/fa";
import { BiCategory, BiChevronRight } from "react-icons/bi";

export default function RoadmapPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [guides, setGuides] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileCategoryMenuOpen, setMobileCategoryMenuOpen] = useState(false);
  const [isLoadingGuides, setIsLoadingGuides] = useState(true);
  const { theme } = useTheme();

  const navigate = useNavigate();
  const handleViewRoadmap = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/blogs/${id}/view`);
    } catch (err) {
      // Optionally log error, but still navigate
    }
    navigate(`/roadmap/${id}`);
  };

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs1");
        const roadmapBlogs = res.data
          .filter(blog => blog.title.toLowerCase().includes("roadmap")) // Only "roadmap" titles
          .map((blog, index) => ({
            id: blog.id || index + 1,
            title: blog.title,
            excerpt: blog.excerpt || "No excerpt available",
            content: blog.content || "No content available",
            category: blog.category || "general",
            author: blog.author || "Anonymous",
            author_avatar: blog.author_avatar,
            date: blog.date,
            read_time: blog.read_time || "2-3 hours",
            tags: blog.tags,
            featured: blog.featured || false,
            views: blog.views ?? 90,
            students: blog.views || 0, // Use actual views count instead of random students
            icon: <FaMap className="text-blue-400 text-3xl" />,
            // Hardcoded values for missing fields
            rating: 4.5, // Hardcoded rating
            duration: blog.read_time || "2-3 hours", // Use read_time as duration
            skills: blog.tags ? blog.tags.split(',').map(tag => tag.trim()) : ["Cybersecurity"], // Use tags as skills
            certifications: [], // Hardcoded empty array
            modules: 5, // Hardcoded modules count
            estimatedHours: blog.read_time || "3-4 hours", // Use read_time as estimated hours
          }));
        setRoadmaps(roadmapBlogs);
      } catch (err) {
        console.error("Failed to fetch roadmaps:", err);
      }
    };

    const fetchGuides = async () => {
      try {
        setIsLoadingGuides(true);
        const res = await axios.get("http://localhost:5000/api/blogs");
        const guideKeywords = [
          'guide', 'how to', 'tutorial', 'tips', 'best practices', 
          'career', 'certification', 'portfolio', 'learning', 'resources',
          'beginner', 'advanced', 'fundamentals', 'strategy', 'planning'
        ];
        
        const guideBlogs = res.data
          .filter(blog => {
            const title = blog.title.toLowerCase();
            const content = (blog.content || '').toLowerCase();
            const category = (blog.category || '').toLowerCase();
            
            // Exclude roadmaps
            if (title.includes('roadmap')) return false;
            
            // Include if title or category contains guide keywords
            return guideKeywords.some(keyword => 
              title.includes(keyword) || 
              category.includes(keyword) ||
              content.includes(keyword)
            );
          })
          .map((blog, index) => ({
            id: blog.id || index + 1,
            title: blog.title,
            excerpt: blog.excerpt || (blog.content ? blog.content.substring(0, 150) + "..." : "No excerpt available"),
            author: blog.author || "Anonymous",
            readTime: blog.read_time || "8 min read",
            category: blog.category || "Guide",
            link: `/blog/${blog.id}`,
          }))
          .slice(0, 3); // Limit to 6 guides
        
        setGuides(guideBlogs);
      } catch (err) {
        console.error("Failed to fetch guides:", err);
      } finally {
        setIsLoadingGuides(false);
      }
    };

    fetchRoadmaps();
    fetchGuides();
  }, []);

  const filteredRoadmaps = roadmaps
    .filter(roadmap => {
      const matchesCategory = selectedCategory === 'all' || roadmap.category === selectedCategory;
      const matchesSearch = roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (roadmap.excerpt && roadmap.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (roadmap.author && roadmap.author.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured': return b.featured - a.featured;
        case 'rating': return b.rating - a.rating;
        case 'students': return b.students - a.students; // This now represents views
        case 'newest': return b.id - a.id;
        case 'title': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

  const categories = [
    { id: 'all', name: 'All Roadmaps', count: roadmaps.length },
    ...Array.from(new Set(roadmaps.map(r => r.category))).map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count: roadmaps.filter(r => r.category === category).length,
    }))
  ];

  const featuredRoadmaps = roadmaps.filter(r => r.featured);

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
                <FaMap className="text-2xl text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 pb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Cybersecurity Roadmaps
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Follow curated learning paths to master cybersecurity roles. Explore step-by-step roadmaps, 
              guides, and resources for every journey from beginner to expert.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <FaMap className="w-4 h-4" />
                {roadmaps.length} Roadmaps Available
              </span>
              <span className="flex items-center gap-2">
                <FaEye className="w-4 h-4" />
                {roadmaps.reduce((total, roadmap) => total + roadmap.students, 0).toLocaleString()} Views
              </span>
            </div>
          </div>
        </section>

        {/* Featured Roadmaps Section */}
        {featuredRoadmaps.length > 0 && (
          <section className="px-4 mb-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Featured Roadmaps</h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FaStar className="w-4 h-4 text-yellow-400" />
                  Most Popular
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredRoadmaps.map((roadmap) => (
                  <div
                    key={roadmap.id}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                {roadmap.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                            Featured
                          </span>
                          <div className="flex items-center gap-1">
                            <FaStar className="w-3 h-3 text-yellow-400" />
                            <span className="text-sm text-gray-300">4.5</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-white line-clamp-2">{roadmap.title}</h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{roadmap.excerpt || "No excerpt available"}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">{roadmap.author}</span>
                          <button onClick={() => handleViewRoadmap(roadmap.id)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105">
                            View Roadmap
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
                {/* Search and Filter Bar */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl mb-8">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search roadmaps by title, description, or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="px-4 py-3 bg-blue-600 text-white border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
>
  <option value="featured">Featured First</option>
  <option value="rating">Highest Rated</option>
  <option value="students">Most Views</option>
  <option value="newest">Newest First</option>
  <option value="title">Alphabetical</option>
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
                    Showing {filteredRoadmaps.length} of {roadmaps.length} roadmaps
                  </p>
                </div>

                {/* Roadmaps Grid/List */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRoadmaps.map((roadmap) => (
                      <div
                        key={roadmap.id}
                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
                      >
                        <div className="text-center">
                          <div className="flex justify-center mb-4">
                            {roadmap.icon}
                            
                          </div>
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              <FaStar className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-gray-300">{roadmap.rating}</span>
                            </div>
                            <span className="text-gray-500">•</span>
                            <span className="text-sm text-gray-400">{roadmap.students.toLocaleString()} views</span>
                          </div>
                          <h3 className="font-bold text-lg mb-2 text-white line-clamp-2">{roadmap.title}</h3>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{roadmap.excerpt || "No excerpt available"}</p>
                          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-4">
                            <span className="flex items-center gap-1">
                              <FaUser className="w-3 h-3" />
                              {roadmap.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaClock className="w-3 h-3" />
                              {roadmap.duration}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-4 justify-center">
                            {roadmap.skills.slice(0, 3).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                                {skill}
                              </span>
                            ))}
                        </div>
                            <button onClick={() => handleViewRoadmap(roadmap.id)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                              View Roadmap
                            </button>
                          </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRoadmaps.map((roadmap) => (
                      <div
                        key={roadmap.id}
                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
                      >
                        <div className="flex items-start gap-6">
                          <div className="flex-shrink-0">
                            {roadmap.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-xl text-white">{roadmap.title}</h3>
                              <div className="flex items-center gap-1">
                                <FaStar className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm text-gray-300">{roadmap.rating}</span>
                              </div>
                            </div>
                            <p className="text-gray-400 mb-3">{roadmap.excerpt || "No excerpt available"}</p>
                            <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                              <span className="flex items-center gap-2">
                                <FaUser className="w-4 h-4" />
                                {roadmap.author}
                              </span>
                              <span className="flex items-center gap-2">
                                <FaClock className="w-4 h-4" />
                                {roadmap.duration}
                              </span>
                              <span className="flex items-center gap-2">
                                <FaEye className="w-4 h-4" />
                                {roadmap.students.toLocaleString()} views
                              </span>
                              <span className="flex items-center gap-2">
                                <FaGraduationCap className="w-4 h-4" />
                                {roadmap.modules} modules
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {roadmap.skills.map((skill, index) => (
                                <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <button onClick={() => handleViewRoadmap(roadmap.id)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                              View Roadmap
                            </button>
                          </div>
                        </div>
              </div>
            ))}
                  </div>
                )}

                {/* No Results */}
                {filteredRoadmaps.length === 0 && (
                  <div className="text-center py-12">
                    <FaMap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-300 mb-2">No roadmaps found</h3>
                    <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Guides Section */}
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-white text-center">Guides & Resources</h2>
            {isLoadingGuides ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : guides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {guides.map((guide, index) => (
                  <Link
                    to={guide.link}
                    key={index}
                    className="block group"
                  >
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 cursor-pointer">
                      <div className="flex items-center gap-3 mb-4">
                        <FaLightbulb className="text-yellow-400 text-2xl" />
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                          {guide.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-white group-hover:text-blue-300 transition-colors">{guide.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{guide.excerpt || "No excerpt available"}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{guide.author}</span>
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <FaClock className="w-3 h-3" />
                          {guide.readTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaLightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-300 mb-2">No guides available</h3>
                <p className="text-gray-400">Check back later for helpful guides and resources</p>
              </div>
            )}
          </div>
        </section>

          {/* Call to Action */}
        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-8 border border-white/20 text-center">
              <h2 className="text-2xl font-bold mb-4">Want a custom roadmap or need guidance?</h2>
              <p className="text-gray-300 mb-6">
                Request a new roadmap or ask for personalized learning advice from our experts!
              </p>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Request Roadmap
              </button>
            </div>
          </div>
          </section>
      </div>
      <Footer />
    </div>
  );
}
