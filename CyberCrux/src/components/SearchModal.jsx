import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaTimes, FaBook, FaLaptop, FaTools, FaBrain, FaMap, FaNewspaper } from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';

export default function SearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const searchInputRef = useRef(null);

  // Sample data for search (in a real app, this would come from API)
  const searchData = {
    scenarios: [
      { id: 1, title: 'Phishing Attack Response', type: 'scenario', category: 'Web Security', difficulty: 'Medium', points: 50 },
      { id: 2, title: 'Ransomware Incident Handling', type: 'scenario', category: 'Incident Response', difficulty: 'Hard', points: 75 },
      { id: 3, title: 'Network Traffic Analysis', type: 'scenario', category: 'Network Security', difficulty: 'Easy', points: 30 },
      { id: 4, title: 'SQL Injection Detection', type: 'scenario', category: 'Web Security', difficulty: 'Medium', points: 45 },
      { id: 5, title: 'Malware Analysis Lab', type: 'scenario', category: 'Malware Analysis', difficulty: 'Hard', points: 100 },
    ],
    books: [
      { id: 1, title: 'Cybersecurity Essentials', type: 'book', author: 'Sarah Chen', category: 'Beginner' },
      { id: 2, title: 'Advanced Penetration Testing', type: 'book', author: 'Mike Rodriguez', category: 'Advanced' },
      { id: 3, title: 'Digital Forensics Handbook', type: 'book', author: 'Dr. Emily Watson', category: 'Forensics' },
      { id: 4, title: 'Network Security Fundamentals', type: 'book', author: 'Alex Thompson', category: 'Intermediate' },
    ],
    tools: [
      { id: 1, title: 'Nmap', type: 'tool', category: 'Network Scanning', description: 'Network discovery and security auditing' },
      { id: 2, title: 'Metasploit', type: 'tool', category: 'Penetration Testing', description: 'Penetration testing framework' },
      { id: 3, title: 'Wireshark', type: 'tool', category: 'Network Analysis', description: 'Network protocol analyzer' },
      { id: 4, title: 'Burp Suite', type: 'tool', category: 'Web Security', description: 'Web application security testing' },
    ],
    labs: [
      { id: 1, title: 'Basic Pentesting Lab', type: 'lab', category: 'Penetration Testing', difficulty: 'Beginner' },
      { id: 2, title: 'Active Directory Lab', type: 'lab', category: 'Windows Security', difficulty: 'Intermediate' },
      { id: 3, title: 'Cloud Security Lab', type: 'lab', category: 'Cloud Security', difficulty: 'Advanced' },
    ],
    blogs: [
      { id: 1, title: 'Zero-Day Vulnerabilities: Understanding the Threat Landscape', type: 'blog', author: 'Sarah Chen', category: 'Threat Intelligence' },
      { id: 2, title: 'Building a Home Security Lab: A Complete Guide', type: 'blog', author: 'Mike Rodriguez', category: 'Learning' },
      { id: 3, title: 'The Future of AI in Cybersecurity Defense', type: 'blog', author: 'Dr. Emily Watson', category: 'AI & ML' },
    ],
    roadmaps: [
      { id: 1, title: 'SOC Analyst Roadmap', type: 'roadmap', category: 'Career Path', difficulty: 'Beginner to Advanced' },
      { id: 2, title: 'Penetration Tester Roadmap', type: 'roadmap', category: 'Career Path', difficulty: 'Intermediate to Advanced' },
      { id: 3, title: 'Cloud Security Roadmap', type: 'roadmap', category: 'Career Path', difficulty: 'Intermediate' },
    ]
  };

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const performSearch = () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        const query = searchQuery.toLowerCase();
        const results = [];

        // Search across all data types
        Object.values(searchData).forEach(categoryData => {
          categoryData.forEach(item => {
            const matchesTitle = item.title.toLowerCase().includes(query);
            const matchesAuthor = item.author?.toLowerCase().includes(query);
            const matchesCategory = item.category?.toLowerCase().includes(query);
            const matchesDescription = item.description?.toLowerCase().includes(query);

            if (matchesTitle || matchesAuthor || matchesCategory || matchesDescription) {
              results.push(item);
            }
          });
        });

        setSearchResults(results);
        setIsLoading(false);
      }, 300);
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const getIconForType = (type) => {
    switch (type) {
      case 'scenario': return <FaBrain className="w-5 h-5 text-blue-400" />;
      case 'book': return <FaBook className="w-5 h-5 text-green-400" />;
      case 'tool': return <FaTools className="w-5 h-5 text-purple-400" />;
      case 'lab': return <FaLaptop className="w-5 h-5 text-orange-400" />;
      case 'blog': return <FaNewspaper className="w-5 h-5 text-cyan-400" />;
      case 'roadmap': return <FaMap className="w-5 h-5 text-pink-400" />;
      default: return <BiSearch className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRouteForType = (type, id) => {
    switch (type) {
      case 'scenario': return `/practice`;
      case 'book': return `/books`;
      case 'tool': return `/tools`;
      case 'lab': return `/labs`;
      case 'blog': return `/blog`;
      case 'roadmap': return `/roadmap`;
      default: return '/';
    }
  };

  const filteredResults = activeTab === 'all' 
    ? searchResults 
    : searchResults.filter(result => result.type === activeTab);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Search CyberCrux</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FaTimes className="w-5 h-5 text-white" />
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search scenarios, books, tools, labs, blogs, roadmaps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              All ({searchResults.length})
            </button>
            <button
              onClick={() => setActiveTab('scenario')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'scenario' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Scenarios ({searchResults.filter(r => r.type === 'scenario').length})
            </button>
            <button
              onClick={() => setActiveTab('book')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'book' 
                  ? 'bg-green-500 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Books ({searchResults.filter(r => r.type === 'book').length})
            </button>
            <button
              onClick={() => setActiveTab('tool')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'tool' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Tools ({searchResults.filter(r => r.type === 'tool').length})
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'lab' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Labs ({searchResults.filter(r => r.type === 'lab').length})
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'blog' 
                  ? 'bg-cyan-500 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Blogs ({searchResults.filter(r => r.type === 'blog').length})
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'roadmap' 
                  ? 'bg-pink-500 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Roadmaps ({searchResults.filter(r => r.type === 'roadmap').length})
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-96">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
              <p className="text-gray-400 mt-2">Searching...</p>
            </div>
          ) : searchQuery.trim() === '' ? (
            <div className="p-8 text-center">
              <BiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Start typing to search across all content</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No results found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {filteredResults.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={getRouteForType(result.type, result.id)}
                  onClick={onClose}
                  className="block p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getIconForType(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-1 line-clamp-1">
                        {result.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                        {result.author && (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                            {result.author}
                          </span>
                        )}
                        {result.category && (
                          <span className="px-2 py-1 bg-white/10 rounded-full text-xs">
                            {result.category}
                          </span>
                        )}
                        {result.difficulty && (
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            result.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                            result.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {result.difficulty}
                          </span>
                        )}
                        {result.points && (
                          <span className="text-green-400 font-semibold">
                            +{result.points} pts
                          </span>
                        )}
                      </div>
                      {result.description && (
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 