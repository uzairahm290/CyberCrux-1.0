import React, { useState } from "react";
import DashNav from "./DashNav";
import Footer from "./Footer";
import { FaProjectDiagram, FaSearch, FaStar, FaClock, FaUser, FaEye, FaCode, FaGithub, FaExternalLinkAlt, FaUsers, FaHeart, FaShare, FaPlus, FaFilter, FaLaptop, FaMobile, FaServer } from "react-icons/fa";
import { BiCategory, BiChevronRight } from "react-icons/bi";
import { useTheme } from '../ThemeContext';

// Enhanced projects with more details
const projects = [
  {
    id: 1,
    title: "SIEM Dashboard",
    description: "A comprehensive Security Information and Event Management dashboard for real-time threat monitoring and incident response.",
    category: "defense",
    type: "Web Application",
    author: "Sarah Chen",
    rating: 4.9,
    views: 1247,
    likes: 89,
    collaborators: 5,
    icon: <FaServer className="text-blue-400 text-3xl" />,
    featured: true,
    technologies: ["React", "Node.js", "Elasticsearch", "Docker"],
    skills: ["SIEM", "Threat Detection", "Dashboard Design", "API Integration"],
    difficulty: "Advanced",
    estimatedTime: "3-4 months",
    github: "https://github.com/example/siem-dashboard",
    demo: "https://demo.example.com",
    status: "Completed",
    lastUpdated: "2024-01-15",
  },
  {
    id: 2,
    title: "Penetration Testing Framework",
    description: "An automated penetration testing framework with modular architecture for comprehensive security assessments.",
    category: "offensive",
    type: "CLI Tool",
    author: "Mike Rodriguez",
    rating: 4.8,
    views: 892,
    likes: 67,
    collaborators: 3,
    icon: <FaCode className="text-purple-400 text-3xl" />,
    featured: true,
    technologies: ["Python", "Docker", "PostgreSQL", "Redis"],
    skills: ["Penetration Testing", "Automation", "API Development", "Security Tools"],
    difficulty: "Advanced",
    estimatedTime: "4-6 months",
    github: "https://github.com/example/pentest-framework",
    demo: null,
    status: "In Progress",
    lastUpdated: "2024-01-10",
  },
  {
    id: 3,
    title: "Malware Analysis Platform",
    description: "A web-based platform for analyzing malware samples with automated detection and reporting capabilities.",
    category: "analysis",
    type: "Web Application",
    author: "Dr. Emily Watson",
    rating: 4.7,
    views: 567,
    likes: 45,
    collaborators: 4,
    icon: <FaServer className="text-yellow-300 text-3xl" />,
    featured: false,
    technologies: ["Vue.js", "Python", "MongoDB", "AWS"],
    skills: ["Malware Analysis", "Reverse Engineering", "Cloud Security", "Machine Learning"],
    difficulty: "Advanced",
    estimatedTime: "5-7 months",
    github: "https://github.com/example/malware-platform",
    demo: "https://malware.example.com",
    status: "Completed",
    lastUpdated: "2023-12-20",
  },
  {
    id: 4,
    title: "Network Security Monitor",
    description: "Real-time network traffic analysis and anomaly detection system for enterprise environments.",
    category: "defense",
    type: "Desktop Application",
    author: "Alex Thompson",
    rating: 4.6,
    views: 734,
    likes: 52,
    collaborators: 2,
    icon: <FaServer className="text-green-400 text-3xl" />,
    featured: false,
    technologies: ["C++", "Qt", "SQLite", "Libpcap"],
    skills: ["Network Security", "Traffic Analysis", "Anomaly Detection", "C++ Development"],
    difficulty: "Intermediate",
    estimatedTime: "2-3 months",
    github: "https://github.com/example/network-monitor",
    demo: null,
    status: "Completed",
    lastUpdated: "2024-01-05",
  },
  {
    id: 5,
    title: "Mobile Security Scanner",
    description: "Android and iOS application security scanner with vulnerability assessment and reporting.",
    category: "mobile",
    type: "Mobile App",
    author: "David Kim",
    rating: 4.5,
    views: 445,
    likes: 38,
    collaborators: 3,
    icon: <FaMobile className="text-cyan-400 text-3xl" />,
    featured: false,
    technologies: ["React Native", "Node.js", "MongoDB", "Docker"],
    skills: ["Mobile Security", "App Development", "Vulnerability Assessment", "Cross-platform"],
    difficulty: "Intermediate",
    estimatedTime: "3-4 months",
    github: "https://github.com/example/mobile-scanner",
    demo: "https://mobile.example.com",
    status: "In Progress",
    lastUpdated: "2024-01-12",
  },
  {
    id: 6,
    title: "Cloud Security Assessment Tool",
    description: "Automated cloud security assessment tool for AWS, Azure, and GCP with compliance reporting.",
    category: "cloud",
    type: "CLI Tool",
    author: "Lisa Wang",
    rating: 4.7,
    views: 623,
    likes: 41,
    collaborators: 4,
    icon: <FaServer className="text-orange-400 text-3xl" />,
    featured: false,
    technologies: ["Python", "Terraform", "AWS SDK", "Azure SDK"],
    skills: ["Cloud Security", "DevOps", "Infrastructure as Code", "Compliance"],
    difficulty: "Intermediate",
    estimatedTime: "2-3 months",
    github: "https://github.com/example/cloud-assessment",
    demo: null,
    status: "Completed",
    lastUpdated: "2023-12-15",
  },
];

const categories = [
  { id: 'all', name: 'All Projects', count: projects.length },
  { id: 'defense', name: 'Defense', count: projects.filter(p => p.category === 'defense').length },
  { id: 'offensive', name: 'Offensive', count: projects.filter(p => p.category === 'offensive').length },
  { id: 'analysis', name: 'Analysis', count: projects.filter(p => p.category === 'analysis').length },
  { id: 'mobile', name: 'Mobile', count: projects.filter(p => p.category === 'mobile').length },
  { id: 'cloud', name: 'Cloud', count: projects.filter(p => p.category === 'cloud').length },
];

const projectTypes = [
  { id: 'all', name: 'All Types', count: projects.length },
  { id: 'web', name: 'Web Application', count: projects.filter(p => p.type === 'Web Application').length },
  { id: 'cli', name: 'CLI Tool', count: projects.filter(p => p.type === 'CLI Tool').length },
  { id: 'desktop', name: 'Desktop Application', count: projects.filter(p => p.type === 'Desktop Application').length },
  { id: 'mobile', name: 'Mobile App', count: projects.filter(p => p.type === 'Mobile App').length },
];

export default function ProjectPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileCategoryMenuOpen, setMobileCategoryMenuOpen] = useState(false);
  const { theme } = useTheme();

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesType = selectedType === 'all' || project.type === selectedType;
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesType && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return b.featured - a.featured;
        case 'rating':
          return b.rating - a.rating;
        case 'views':
          return b.views - a.views;
        case 'newest':
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const featuredProjects = projects.filter(project => project.featured);

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
                <FaProjectDiagram className="text-2xl text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 pb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Cybersecurity Projects
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Showcase your cybersecurity skills with real-world projects. Build, collaborate, and contribute 
              to the community while building your portfolio.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <FaProjectDiagram className="w-4 h-4" />
                {projects.length} Projects Available
              </span>
              <span className="flex items-center gap-2">
                <FaUsers className="w-4 h-4" />
                {projects.reduce((total, project) => total + project.collaborators, 0)} Collaborators
              </span>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        {featuredProjects.length > 0 && (
          <section className="px-4 mb-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Featured Projects</h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FaStar className="w-4 h-4 text-yellow-400" />
                  Most Popular
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {project.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                            Featured
                          </span>
                          <div className="flex items-center gap-1">
                            <FaStar className="w-3 h-3 text-yellow-400" />
                            <span className="text-sm text-gray-300">{project.rating}</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-white line-clamp-2">{project.title}</h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">{project.author}</span>
                          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105">
                            View Project
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
                  <div className="space-y-2 mb-6">
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
                  
                  <h3 className="text-xl font-bold mb-6 text-white">Project Types</h3>
                  <div className="space-y-2">
                    {projectTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                          selectedType === type.id
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="font-medium">{type.name}</span>
                        <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                          {type.count}
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
                        placeholder="Search projects by title, description, or author..."
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
                      <option value="views">Most Viewed</option>
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
                    Showing {filteredProjects.length} of {projects.length} projects
                  </p>
                </div>

                {/* Projects Grid/List */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
                      >
                        <div className="text-center">
                          <div className="flex justify-center mb-4">
                            {project.icon}
                          </div>
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              <FaStar className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-gray-300">{project.rating}</span>
                            </div>
                            <span className="text-gray-500">•</span>
                            <span className="text-sm text-gray-400">{project.views.toLocaleString()} views</span>
                          </div>
                          <h3 className="font-bold text-lg mb-2 text-white line-clamp-2">{project.title}</h3>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-4">
                            <span className="px-2 py-1 bg-white/10 rounded-full">
                              {project.type}
                            </span>
                            <span className="px-2 py-1 bg-white/10 rounded-full">
                              {project.difficulty}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-4 justify-center">
                            {project.technologies.slice(0, 3).map((tech, index) => (
                              <span key={index} className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105">
                              View Project
                            </button>
                            {project.github && (
                              <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105">
                                <FaGithub className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
                      >
                        <div className="flex items-start gap-6">
                          <div className="flex-shrink-0">
                            {project.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-xl text-white">{project.title}</h3>
                              <div className="flex items-center gap-1">
                                <FaStar className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm text-gray-300">{project.rating}</span>
                              </div>
                            </div>
                            <p className="text-gray-400 mb-3">{project.description}</p>
                            <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                              <span className="flex items-center gap-2">
                                <FaUser className="w-4 h-4" />
                                {project.author}
                              </span>
                              <span className="flex items-center gap-2">
                                <FaEye className="w-4 h-4" />
                                {project.views.toLocaleString()} views
                              </span>
                              <span className="flex items-center gap-2">
                                <FaUsers className="w-4 h-4" />
                                {project.collaborators} collaborators
                              </span>
                              <span className="flex items-center gap-2">
                                <FaClock className="w-4 h-4" />
                                {project.estimatedTime}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.technologies.map((tech, index) => (
                                <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-3">
                              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                                View Project
                              </button>
                              {project.github && (
                                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                                  <FaGithub className="w-4 h-4" />
                                  GitHub
                                </button>
                              )}
                              {project.demo && (
                                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                                  <FaExternalLinkAlt className="w-4 h-4" />
                                  Demo
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {filteredProjects.length === 0 && (
                  <div className="text-center py-12">
                    <FaProjectDiagram className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-300 mb-2">No projects found</h3>
                    <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-8 border border-white/20 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to showcase your skills?</h2>
              <p className="text-gray-300 mb-6">
                Create and share your cybersecurity projects with the community. Build your portfolio and collaborate with other security professionals!
              </p>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto">
                <FaPlus className="w-4 h-4" />
                Create New Project
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
} 