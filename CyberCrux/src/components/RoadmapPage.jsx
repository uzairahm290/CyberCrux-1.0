import React, { useState } from "react";
import DashNav from "./DashNav";
import Footer from "./Footer";
import { FaMap, FaRoute, FaFlagCheckered, FaBook, FaLightbulb, FaRocket, FaSearch, FaStar, FaClock, FaUser, FaEye, FaGraduationCap, FaCertificate } from "react-icons/fa";
import { BiCategory, BiChevronRight } from "react-icons/bi";
import { useTheme } from '../ThemeContext';

// Enhanced roadmaps with more details
const roadmaps = [
  {
    id: 1,
    title: "SOC Analyst Roadmap",
    description: "Step-by-step path to become a Security Operations Center Analyst, from basics to advanced monitoring and incident response.",
    category: "defense",
    difficulty: "Beginner to Advanced",
    duration: "6-12 months",
    author: "Sarah Chen",
    rating: 4.9,
    students: 1247,
    icon: <FaFlagCheckered className="text-blue-400 text-3xl" />,
    featured: true,
    skills: ["SIEM", "Incident Response", "Threat Hunting", "Log Analysis"],
    certifications: ["CompTIA Security+", "SANS GSOC", "CISSP"],
    modules: 12,
    estimatedHours: 200,
  },
  {
    id: 2,
    title: "Penetration Tester Roadmap",
    description: "Learn the skills and tools needed to become a professional penetration tester with hands-on practice.",
    category: "offensive",
    difficulty: "Intermediate to Advanced",
    duration: "8-15 months",
    author: "Mike Rodriguez",
    rating: 4.8,
    students: 892,
    icon: <FaRoute className="text-purple-400 text-3xl" />,
    featured: true,
    skills: ["Web App Testing", "Network Pentesting", "Social Engineering", "Report Writing"],
    certifications: ["OSCP", "CEH", "GPEN"],
    modules: 15,
    estimatedHours: 300,
  },
  {
    id: 3,
    title: "Malware Analyst Roadmap",
    description: "Master malware analysis, reverse engineering, and threat hunting techniques for advanced security roles.",
    category: "analysis",
    difficulty: "Advanced",
    duration: "10-18 months",
    author: "Dr. Emily Watson",
    rating: 4.7,
    students: 567,
    icon: <FaBook className="text-yellow-300 text-3xl" />,
    featured: false,
    skills: ["Static Analysis", "Dynamic Analysis", "Reverse Engineering", "Threat Intelligence"],
    certifications: ["GREM", "CREA", "CFCE"],
    modules: 18,
    estimatedHours: 400,
  },
  {
    id: 4,
    title: "Cloud Security Roadmap",
    description: "Explore cloud security fundamentals and advanced topics for AWS, Azure, and GCP environments.",
    category: "cloud",
    difficulty: "Intermediate to Advanced",
    duration: "6-12 months",
    author: "Alex Thompson",
    rating: 4.6,
    students: 734,
    icon: <FaMap className="text-cyan-400 text-3xl" />,
    featured: false,
    skills: ["AWS Security", "Azure Security", "GCP Security", "Cloud Compliance"],
    certifications: ["AWS Security", "Azure Security", "CCSP"],
    modules: 14,
    estimatedHours: 250,
  },
  {
    id: 5,
    title: "Digital Forensics Roadmap",
    description: "Learn digital forensics methodologies, evidence collection, and analysis for cyber investigations.",
    category: "forensics",
    difficulty: "Intermediate to Advanced",
    duration: "8-14 months",
    author: "David Kim",
    rating: 4.5,
    students: 445,
    icon: <FaBook className="text-green-400 text-3xl" />,
    featured: false,
    skills: ["Evidence Collection", "Memory Analysis", "File System Analysis", "Network Forensics"],
    certifications: ["GCFE", "GCFA", "CFCE"],
    modules: 16,
    estimatedHours: 280,
  },
  {
    id: 6,
    title: "Security Architecture Roadmap",
    description: "Design and implement secure architectures for enterprise environments and applications.",
    category: "architecture",
    difficulty: "Advanced",
    duration: "12-20 months",
    author: "Lisa Wang",
    rating: 4.8,
    students: 298,
    icon: <FaMap className="text-pink-400 text-3xl" />,
    featured: true,
    skills: ["Security Design", "Risk Assessment", "Compliance", "Zero Trust"],
    certifications: ["CISSP", "SABSA", "TOGAF"],
    modules: 20,
    estimatedHours: 350,
  },
];

const categories = [
  { id: 'all', name: 'All Roadmaps', count: roadmaps.length },
  { id: 'defense', name: 'Defense', count: roadmaps.filter(r => r.category === 'defense').length },
  { id: 'offensive', name: 'Offensive', count: roadmaps.filter(r => r.category === 'offensive').length },
  { id: 'analysis', name: 'Analysis', count: roadmaps.filter(r => r.category === 'analysis').length },
  { id: 'cloud', name: 'Cloud', count: roadmaps.filter(r => r.category === 'cloud').length },
  { id: 'forensics', name: 'Forensics', count: roadmaps.filter(r => r.category === 'forensics').length },
  { id: 'architecture', name: 'Architecture', count: roadmaps.filter(r => r.category === 'architecture').length },
];

const guides = [
  {
    title: "How to Choose Your Cybersecurity Path",
    description: "A comprehensive guide to help you select the right roadmap for your interests, skills, and career goals.",
    author: "Career Advisor Team",
    readTime: "8 min read",
    category: "Career Guidance",
    link: "#",
  },
  {
    title: "Top Certifications for Each Roadmap",
    description: "Recommended certifications and resources for every learning path with cost-benefit analysis.",
    author: "Certification Expert",
    readTime: "12 min read",
    category: "Certifications",
    link: "#",
  },
  {
    title: "Building Your Cybersecurity Portfolio",
    description: "Learn how to showcase your skills and projects to stand out in the cybersecurity job market.",
    author: "Portfolio Specialist",
    readTime: "10 min read",
    category: "Career Development",
    link: "#",
  },
];

export default function RoadmapPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileCategoryMenuOpen, setMobileCategoryMenuOpen] = useState(false);
  const { theme } = useTheme();

  // Filter and sort roadmaps
  const filteredRoadmaps = roadmaps
    .filter(roadmap => {
      const matchesCategory = selectedCategory === 'all' || roadmap.category === selectedCategory;
      const matchesSearch = roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           roadmap.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           roadmap.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return b.featured - a.featured;
        case 'rating':
          return b.rating - a.rating;
        case 'students':
          return b.students - a.students;
        case 'newest':
          return b.id - a.id;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const featuredRoadmaps = roadmaps.filter(roadmap => roadmap.featured);

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
                <FaUser className="w-4 h-4" />
                {roadmaps.reduce((total, roadmap) => total + roadmap.students, 0).toLocaleString()} Students
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
                            <span className="text-sm text-gray-300">{roadmap.rating}</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-white line-clamp-2">{roadmap.title}</h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{roadmap.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">{roadmap.author}</span>
                          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105">
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
                    
                    {/* Sort Dropdown */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="featured">Featured First</option>
                      <option value="rating">Highest Rated</option>
                      <option value="students">Most Students</option>
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
                            <span className="text-sm text-gray-400">{roadmap.students.toLocaleString()} students</span>
                          </div>
                          <h3 className="font-bold text-lg mb-2 text-white line-clamp-2">{roadmap.title}</h3>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{roadmap.description}</p>
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
                          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
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
                            <p className="text-gray-400 mb-3">{roadmap.description}</p>
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
                                {roadmap.students.toLocaleString()} students
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
                            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {guides.map((guide, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <FaLightbulb className="text-yellow-400 text-2xl" />
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                      {guide.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-white">{guide.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{guide.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{guide.author}</span>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      {guide.readTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
