import React, { useState } from "react";
import DashNav from "./DashNav";
import Footer from "./Footer";
import { FaWrench, FaTerminal, FaLock, FaNetworkWired, FaBug, FaUpload, FaRocket, FaSearch, FaStar, FaDownload, FaEye, FaCode, FaBook, FaPlay } from "react-icons/fa";
import { BiCategory, BiChevronRight } from "react-icons/bi";
import { useTheme } from '../ThemeContext';

// Enhanced tools with more details
const tools = [
  {
    id: 1,
    name: "Nmap",
    description: "Network discovery and security auditing tool for network exploration and security scanning.",
    category: "network",
    type: "Network Scanner",
    author: "Gordon Lyon",
    rating: 4.9,
    downloads: 15420,
    icon: <FaNetworkWired className="text-blue-400 text-3xl" />,
    featured: true,
    difficulty: "Beginner",
    platforms: ["Linux", "Windows", "macOS"],
    license: "Open Source",
    website: "https://nmap.org",
    commands: ["nmap -sS 192.168.1.1", "nmap -A -T4 scanme.nmap.org"],
    tutorials: 15,
    practiceScenarios: 8,
  },
  {
    id: 2,
    name: "Metasploit",
    description: "Penetration testing framework for finding, exploiting, and validating vulnerabilities.",
    category: "exploitation",
    type: "Penetration Testing",
    author: "Rapid7",
    rating: 4.8,
    downloads: 8920,
    icon: <FaBug className="text-pink-400 text-3xl" />,
    featured: true,
    difficulty: "Intermediate",
    platforms: ["Linux", "Windows"],
    license: "Proprietary",
    website: "https://metasploit.com",
    commands: ["msfconsole", "use exploit/windows/smb/ms17_010_eternalblue"],
    tutorials: 12,
    practiceScenarios: 10,
  },
  {
    id: 3,
    name: "John the Ripper",
    description: "Fast password cracker for Unix, Windows, and more with support for hundreds of hash types.",
    category: "password",
    type: "Password Cracker",
    author: "Openwall",
    rating: 4.7,
    downloads: 5670,
    icon: <FaLock className="text-yellow-300 text-3xl" />,
    featured: false,
    difficulty: "Intermediate",
    platforms: ["Linux", "Windows", "macOS"],
    license: "Open Source",
    website: "https://www.openwall.com/john/",
    commands: ["john --wordlist=wordlist.txt hash.txt", "john --show hash.txt"],
    tutorials: 8,
    practiceScenarios: 6,
  },
  {
    id: 4,
    name: "Wireshark",
    description: "Network protocol analyzer for real-time traffic analysis and packet inspection.",
    category: "network",
    type: "Protocol Analyzer",
    author: "Wireshark Foundation",
    rating: 4.6,
    downloads: 12340,
    icon: <FaNetworkWired className="text-green-400 text-3xl" />,
    featured: false,
    difficulty: "Beginner",
    platforms: ["Linux", "Windows", "macOS"],
    license: "Open Source",
    website: "https://wireshark.org",
    commands: ["wireshark -i eth0", "tshark -r capture.pcap"],
    tutorials: 20,
    practiceScenarios: 12,
  },
  {
    id: 5,
    name: "Burp Suite",
    description: "Web application security testing platform for finding vulnerabilities in web apps.",
    category: "web",
    type: "Web Security",
    author: "PortSwigger",
    rating: 4.8,
    downloads: 7890,
    icon: <FaBug className="text-orange-400 text-3xl" />,
    featured: true,
    difficulty: "Intermediate",
    platforms: ["Linux", "Windows", "macOS"],
    license: "Proprietary",
    website: "https://portswigger.net/burp",
    commands: ["burpsuite", "java -jar burpsuite.jar"],
    tutorials: 18,
    practiceScenarios: 15,
  },
  {
    id: 6,
    name: "Hashcat",
    description: "Advanced password recovery tool with GPU acceleration and extensive hash support.",
    category: "password",
    type: "Password Recovery",
    author: "Hashcat Team",
    rating: 4.7,
    downloads: 4560,
    icon: <FaLock className="text-purple-400 text-3xl" />,
    featured: false,
    difficulty: "Advanced",
    platforms: ["Linux", "Windows", "macOS"],
    license: "Open Source",
    website: "https://hashcat.net",
    commands: ["hashcat -m 0 -a 0 hash.txt wordlist.txt", "hashcat -m 1000 -a 3 hash.txt ?a?a?a?a"],
    tutorials: 10,
    practiceScenarios: 8,
  },
  {
    id: 7,
    name: "Aircrack-ng",
    description: "Complete suite of tools for wireless network security assessment and penetration testing.",
    category: "wireless",
    type: "Wireless Security",
    author: "Aircrack-ng Team",
    rating: 4.5,
    downloads: 3450,
    icon: <FaNetworkWired className="text-cyan-400 text-3xl" />,
    featured: false,
    difficulty: "Intermediate",
    platforms: ["Linux"],
    license: "Open Source",
    website: "https://aircrack-ng.org",
    commands: ["airmon-ng start wlan0", "airodump-ng wlan0mon"],
    tutorials: 14,
    practiceScenarios: 9,
  },
  {
    id: 8,
    name: "SQLMap",
    description: "Automated SQL injection and database takeover tool for web application testing.",
    category: "web",
    type: "SQL Injection",
    author: "SQLMap Team",
    rating: 4.6,
    downloads: 6780,
    icon: <FaCode className="text-red-400 text-3xl" />,
    featured: false,
    difficulty: "Intermediate",
    platforms: ["Linux", "Windows", "macOS"],
    license: "Open Source",
    website: "https://sqlmap.org",
    commands: ["sqlmap -u 'http://target.com/page?id=1'", "sqlmap -u 'http://target.com' --dbs"],
    tutorials: 16,
    practiceScenarios: 11,
  },
];

const categories = [
  { id: 'all', name: 'All Tools', count: tools.length },
  { id: 'network', name: 'Network', count: tools.filter(t => t.category === 'network').length },
  { id: 'web', name: 'Web Security', count: tools.filter(t => t.category === 'web').length },
  { id: 'password', name: 'Password', count: tools.filter(t => t.category === 'password').length },
  { id: 'exploitation', name: 'Exploitation', count: tools.filter(t => t.category === 'exploitation').length },
  { id: 'wireless', name: 'Wireless', count: tools.filter(t => t.category === 'wireless').length },
];

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileCategoryMenuOpen, setMobileCategoryMenuOpen] = useState(false);
  const { theme } = useTheme();

  // Filter and sort tools
  const filteredTools = tools
    .filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.type.toLowerCase().includes(searchQuery.toLowerCase());
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
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const featuredTools = tools.filter(tool => tool.featured);

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
                {tools.reduce((total, tool) => total + tool.downloads, 0).toLocaleString()} Downloads
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
                {tool.icon}
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
                          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105">
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
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            {tool.icon}
                          </div>
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              <FaStar className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-gray-300">{tool.rating}</span>
                            </div>
                            <span className="text-gray-500">•</span>
                            <span className="text-sm text-gray-400">{tool.downloads.toLocaleString()} downloads</span>
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
                            <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105">
                              Learn More
                            </button>
                            <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1">
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
                            {tool.icon}
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
                                <FaUser className="w-4 h-4" />
                                {tool.author}
                              </span>
                              <span className="flex items-center gap-2">
                                <FaEye className="w-4 h-4" />
                                {tool.downloads.toLocaleString()} downloads
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
                              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                                Learn More
                              </button>
                              <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
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
              </div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-8 border border-white/20 text-center">
              <FaUpload className="text-4xl text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Upload or Manage Your Tools Content</h2>
              <p className="text-gray-300 mb-6">
                Coming soon: Add your own tool writeups, guides, or command practice modules to share with the community!
              </p>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg" disabled>
                Upload Tool (Coming Soon)
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
} 