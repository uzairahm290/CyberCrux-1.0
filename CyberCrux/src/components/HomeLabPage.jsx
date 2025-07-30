import React, { useState } from "react";
import DashNav from "./DashNav";
import Footer from "./Footer";
import { FaHome, FaNetworkWired, FaServer, FaBook, FaLightbulb, FaRocket, FaCloud, FaSearch, FaStar, FaClock, FaUser, FaEye, FaDownload, FaLaptop, FaCog } from "react-icons/fa";
import { BiCategory, BiChevronRight } from "react-icons/bi";
import { useTheme } from '../ThemeContext';

// Enhanced labs with more details
const labs = [
  {
    id: 1,
    title: "Basic Pentesting Lab",
    description: "Set up a simple virtual lab for web and network pentesting using free tools and vulnerable applications.",
    category: "pentesting",
    difficulty: "Beginner",
    author: "Sarah Chen",
    rating: 4.8,
    downloads: 1247,
    setupTime: "2-3 hours",
    requirements: "8GB RAM, 50GB Storage",
    icon: <FaNetworkWired className="text-blue-400 text-3xl" />,
    featured: true,
    tools: ["VirtualBox", "Kali Linux", "DVWA", "Metasploitable"],
    skills: ["Network Scanning", "Web Testing", "Vulnerability Assessment"],
    estimatedCost: "$0",
    tutorials: 12,
    practiceScenarios: 8,
  },
  {
    id: 2,
    title: "Active Directory Lab",
    description: "Build a Windows AD environment for practicing privilege escalation, lateral movement, and domain attacks.",
    category: "windows",
    difficulty: "Intermediate",
    author: "Mike Rodriguez",
    rating: 4.7,
    downloads: 892,
    setupTime: "4-6 hours",
    requirements: "16GB RAM, 100GB Storage",
    icon: <FaServer className="text-purple-400 text-3xl" />,
    featured: true,
    tools: ["VirtualBox", "Windows Server", "Windows 10", "BloodHound"],
    skills: ["AD Enumeration", "Privilege Escalation", "Lateral Movement"],
    estimatedCost: "$0",
    tutorials: 15,
    practiceScenarios: 12,
  },
  {
    id: 3,
    title: "Malware Analysis Lab",
    description: "Create a safe, isolated lab for analyzing malware samples and learning reverse engineering techniques.",
    category: "malware",
    difficulty: "Advanced",
    author: "Dr. Emily Watson",
    rating: 4.6,
    downloads: 567,
    setupTime: "3-4 hours",
    requirements: "16GB RAM, 80GB Storage",
    icon: <FaBook className="text-yellow-300 text-3xl" />,
    featured: false,
    tools: ["VMware", "Windows 10", "IDA Pro", "Process Monitor"],
    skills: ["Static Analysis", "Dynamic Analysis", "Reverse Engineering"],
    estimatedCost: "$200",
    tutorials: 18,
    practiceScenarios: 10,
  },
  {
    id: 4,
    title: "Cloud Security Lab",
    description: "Experiment with AWS, Azure, or GCP for hands-on cloud security practice and misconfiguration testing.",
    category: "cloud",
    difficulty: "Intermediate",
    author: "Alex Thompson",
    rating: 4.5,
    downloads: 734,
    setupTime: "1-2 hours",
    requirements: "Internet Connection, Cloud Account",
    icon: <FaCloud className="text-cyan-400 text-3xl" />,
    featured: false,
    tools: ["AWS CLI", "Azure CLI", "Terraform", "CloudGoat"],
    skills: ["Cloud Security", "IAM", "Network Security"],
    estimatedCost: "$50/month",
    tutorials: 14,
    practiceScenarios: 9,
  },
  {
    id: 5,
    title: "IoT Security Lab",
    description: "Build an IoT security testing environment with vulnerable devices and network protocols.",
    category: "iot",
    difficulty: "Intermediate",
    author: "David Kim",
    rating: 4.4,
    downloads: 445,
    setupTime: "5-7 hours",
    requirements: "Raspberry Pi, IoT Devices, Network Switch",
    icon: <FaNetworkWired className="text-green-400 text-3xl" />,
    featured: false,
    tools: ["Raspberry Pi", "Wireshark", "Nmap", "IoT Security Tools"],
    skills: ["IoT Protocols", "Device Security", "Network Analysis"],
    estimatedCost: "$150",
    tutorials: 10,
    practiceScenarios: 6,
  },
  {
    id: 6,
    title: "Mobile Security Lab",
    description: "Set up an environment for mobile application security testing on Android and iOS platforms.",
    category: "mobile",
    difficulty: "Intermediate",
    author: "Lisa Wang",
    rating: 4.6,
    downloads: 623,
    setupTime: "2-3 hours",
    requirements: "Android Device, iOS Device, Computer",
    icon: <FaServer className="text-pink-400 text-3xl" />,
    featured: false,
    tools: ["Android Studio", "Xcode", "Burp Suite", "Frida"],
    skills: ["Mobile App Testing", "API Security", "Reverse Engineering"],
    estimatedCost: "$100",
    tutorials: 16,
    practiceScenarios: 11,
  },
];

const categories = [
  { id: 'all', name: 'All Labs', count: labs.length },
  { id: 'pentesting', name: 'Pentesting', count: labs.filter(l => l.category === 'pentesting').length },
  { id: 'windows', name: 'Windows', count: labs.filter(l => l.category === 'windows').length },
  { id: 'malware', name: 'Malware', count: labs.filter(l => l.category === 'malware').length },
  { id: 'cloud', name: 'Cloud', count: labs.filter(l => l.category === 'cloud').length },
  { id: 'iot', name: 'IoT', count: labs.filter(l => l.category === 'iot').length },
  { id: 'mobile', name: 'Mobile', count: labs.filter(l => l.category === 'mobile').length },
];

const guides = [
  {
    title: "How to Set Up a Virtual Lab",
    description: "Step-by-step guide to building your first home lab using VirtualBox and free ISOs with security best practices.",
    author: "Lab Setup Expert",
    readTime: "15 min read",
    category: "Setup Guide",
    link: "#",
  },
  {
    title: "Top Free Tools for Home Labs",
    description: "A curated list of essential free tools for every cybersecurity home lab with installation guides.",
    author: "Tool Specialist",
    readTime: "12 min read",
    category: "Tools",
    link: "#",
  },
  {
    title: "Lab Security Best Practices",
    description: "Learn how to secure your home lab environment and prevent accidental exposure to the internet.",
    author: "Security Expert",
    readTime: "10 min read",
    category: "Security",
    link: "#",
  },
];

export default function HomeLabPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileCategoryMenuOpen, setMobileCategoryMenuOpen] = useState(false);
  const { theme } = useTheme();

  // Filter and sort labs
  const filteredLabs = labs
    .filter(lab => {
      const matchesCategory = selectedCategory === 'all' || lab.category === selectedCategory;
      const matchesSearch = lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lab.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return b.featured - a.featured;
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'newest':
          return b.id - a.id;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const featuredLabs = labs.filter(lab => lab.featured);

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
                <FaHome className="text-2xl text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 pb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Home Lab Setups
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Build, experiment, and learn with your own cybersecurity home lab. Explore ready-to-go setups, 
              guides, and resources for every skill level and budget.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <FaHome className="w-4 h-4" />
                {labs.length} Lab Setups Available
              </span>
              <span className="flex items-center gap-2">
                <FaDownload className="w-4 h-4" />
                {labs.reduce((total, lab) => total + lab.downloads, 0).toLocaleString()} Downloads
              </span>
            </div>
          </div>
        </section>

        {/* Featured Labs Section */}
        {featuredLabs.length > 0 && (
          <section className="px-4 mb-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Featured Labs</h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FaStar className="w-4 h-4 text-yellow-400" />
                  Most Popular
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredLabs.map((lab) => (
                  <div
                    key={lab.id}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                {lab.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                            Featured
                          </span>
                          <div className="flex items-center gap-1">
                            <FaStar className="w-3 h-3 text-yellow-400" />
                            <span className="text-sm text-gray-300">{lab.rating}</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-white line-clamp-2">{lab.title}</h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{lab.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">{lab.author}</span>
                          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105">
                            View Details
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
                        placeholder="Search labs by title, description, or author..."
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
                      <option value="downloads">Most Downloaded</option>
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
                    Showing {filteredLabs.length} of {labs.length} labs
                  </p>
                </div>

                {/* Labs Grid/List */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredLabs.map((lab) => (
                      <div
                        key={lab.id}
                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
                      >
                        <div className="text-center">
                          <div className="flex justify-center mb-4">
                            {lab.icon}
                          </div>
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              <FaStar className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-gray-300">{lab.rating}</span>
                            </div>
                            <span className="text-gray-500">•</span>
                            <span className="text-sm text-gray-400">{lab.downloads.toLocaleString()} downloads</span>
                          </div>
                          <h3 className="font-bold text-lg mb-2 text-white line-clamp-2">{lab.title}</h3>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{lab.description}</p>
                          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-4">
                            <span className="px-2 py-1 bg-white/10 rounded-full">
                              {lab.difficulty}
                            </span>
                            <span className="px-2 py-1 bg-white/10 rounded-full">
                              {lab.setupTime}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-4 justify-center">
                            {lab.skills.slice(0, 2).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                                {skill}
                              </span>
                            ))}
                          </div>
                          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredLabs.map((lab) => (
                      <div
                        key={lab.id}
                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
                      >
                        <div className="flex items-start gap-6">
                          <div className="flex-shrink-0">
                            {lab.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-xl text-white">{lab.title}</h3>
                              <div className="flex items-center gap-1">
                                <FaStar className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm text-gray-300">{lab.rating}</span>
                              </div>
                            </div>
                            <p className="text-gray-400 mb-3">{lab.description}</p>
                            <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                              <span className="flex items-center gap-2">
                                <FaUser className="w-4 h-4" />
                                {lab.author}
                              </span>
                              <span className="flex items-center gap-2">
                                <FaClock className="w-4 h-4" />
                                {lab.setupTime}
                              </span>
                              <span className="flex items-center gap-2">
                                <FaEye className="w-4 h-4" />
                                {lab.downloads.toLocaleString()} downloads
                              </span>
                              <span className="flex items-center gap-2">
                                <FaLaptop className="w-4 h-4" />
                                {lab.requirements}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {lab.skills.map((skill, index) => (
                                <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                              View Details
                            </button>
                          </div>
                        </div>
              </div>
            ))}
                  </div>
                )}

                {/* No Results */}
                {filteredLabs.length === 0 && (
                  <div className="text-center py-12">
                    <FaHome className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-300 mb-2">No labs found</h3>
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
              <h2 className="text-2xl font-bold mb-4">Have a cool lab setup or want a new guide?</h2>
              <p className="text-gray-300 mb-6">
                Share your home lab ideas or request a guide and help the community grow!
              </p>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Submit Your Lab
              </button>
            </div>
          </div>
          </section>
      </div>
      <Footer />
    </div>
  );
} 