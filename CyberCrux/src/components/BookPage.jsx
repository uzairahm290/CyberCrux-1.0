import React, { useState, useEffect } from 'react';
import DashNav from './DashNav';
import Footer from './Footer';
import { FaBook, FaDownload, FaSearch, FaFilter, FaStar, FaClock, FaUser, FaEye } from 'react-icons/fa';
import { BiCategory, BiChevronRight } from 'react-icons/bi';
import { useTheme } from '../ThemeContext';

// Default categories structure (will be populated from API)
const defaultCategories = [
  { id: 'all', name: 'All Books', icon: <FaBook className="w-4 h-4" />, count: 0 },
  { id: 'beginner', name: 'Beginner', icon: <FaBook className="w-4 h-4" />, count: 0 },
  { id: 'intermediate', name: 'Intermediate', icon: <FaBook className="w-4 h-4" />, count: 0 },
  { id: 'advanced', name: 'Advanced', icon: <FaBook className="w-4 h-4" />, count: 0 },
  { id: 'tools', name: 'Tools', icon: <FaBook className="w-4 h-4" />, count: 0 },
  { id: 'forensics', name: 'Forensics', icon: <FaBook className="w-4 h-4" />, count: 0 },
];

// Default books structure (will be populated from API)
const defaultBooks = [
  {
    id: 1,
    title: 'Cybersecurity Essentials',
    description: 'A comprehensive guide for beginners in cybersecurity covering fundamental concepts, threats, and defense strategies.',
    category: 'beginner',
    author: 'Sarah Chen',
    cover: 'https://img.icons8.com/ios-filled/100/000000/book.png',
    pdf: '#',
    rating: 4.8,
    downloads: 1247,
    readTime: '6-8 hours',
    pages: 320,
    published: '2024',
    featured: true,
  },
  {
    id: 2,
    title: 'Advanced Penetration Testing',
    description: 'Deep dive into advanced pentesting techniques, methodologies, and real-world scenarios for experienced security professionals.',
    category: 'advanced',
    author: 'Mike Rodriguez',
    cover: 'https://i.postimg.cc/wMTyrVT0/48992298.jpg',
    pdf: '#',
    rating: 4.9,
    downloads: 892,
    readTime: '10-12 hours',
    pages: 450,
    published: '2024',
    featured: true,
  },
  {
    id: 3,
    title: 'Digital Forensics Handbook',
    description: 'Learn the basics of digital forensics, evidence collection, and analysis techniques for cyber investigations.',
    category: 'forensics',
    author: 'Dr. Emily Watson',
    cover: 'https://img.icons8.com/ios-filled/100/000000/book.png',
    pdf: '#',
    rating: 4.7,
    downloads: 567,
    readTime: '8-10 hours',
    pages: 380,
    published: '2023',
    featured: false,
  },
  {
    id: 4,
    title: 'Hacking Tools Explained',
    description: 'Comprehensive overview of popular cybersecurity tools, their usage, and best practices for ethical hacking.',
    category: 'tools',
    author: 'Alex Thompson',
    cover: 'https://img.icons8.com/ios-filled/100/000000/book.png',
    pdf: '#',
    rating: 4.6,
    downloads: 734,
    readTime: '5-7 hours',
    pages: 280,
    published: '2024',
    featured: false,
  },
  {
    id: 5,
    title: 'Network Security Fundamentals',
    description: 'Essential concepts and practices for securing network infrastructure and protecting against cyber threats.',
    category: 'intermediate',
    author: 'David Kim',
    cover: 'https://img.icons8.com/ios-filled/100/000000/book.png',
    pdf: '#',
    rating: 4.5,
    downloads: 445,
    readTime: '7-9 hours',
    pages: 350,
    published: '2023',
    featured: false,
  },
  {
    id: 6,
    title: 'Web Application Security',
    description: 'Comprehensive guide to securing web applications, covering OWASP Top 10 and modern security practices.',
    category: 'intermediate',
    author: 'Lisa Wang',
    cover: 'https://img.icons8.com/ios-filled/100/000000/book.png',
    pdf: '#',
    rating: 4.8,
    downloads: 623,
    readTime: '8-10 hours',
    pages: 400,
    published: '2024',
    featured: true,
  },
  {
    id: 7,
    title: 'Cloud Security Architecture',
    description: 'Advanced strategies for securing cloud environments across AWS, Azure, and Google Cloud platforms.',
    category: 'advanced',
    author: 'James Wilson',
    cover: 'https://img.icons8.com/ios-filled/100/000000/book.png',
    pdf: '#',
    rating: 4.7,
    downloads: 389,
    readTime: '9-11 hours',
    pages: 420,
    published: '2024',
    featured: false,
  },
  {
    id: 8,
    title: 'Red Team Operations',
    description: 'Comprehensive guide to red team methodologies, tactics, and techniques for advanced security testing.',
    category: 'ethical-hacking',
    author: 'Maria Garcia',
    cover: 'https://img.icons8.com/ios-filled/100/000000/book.png',
    pdf: '#',
    rating: 4.9,
    downloads: 298,
    readTime: '12-15 hours',
    pages: 500,
    published: '2024',
    featured: true,
  },
];

const BookPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [mobileCategoryMenuOpen, setMobileCategoryMenuOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  // Fetch books and categories from API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching books from API...');
      
      // Fetch books
      const booksResponse = await fetch('http://localhost:5000/api/books');
      console.log('📚 Books response status:', booksResponse.status);
      
      if (!booksResponse.ok) {
        const errorText = await booksResponse.text();
        throw new Error(`Failed to fetch books: ${booksResponse.status} - ${errorText}`);
      }
      
      const booksData = await booksResponse.json();
      console.log('✅ Books fetched successfully:', booksData.length, 'books');
      
      // Fetch categories
      console.log('🔍 Fetching categories from API...');
      const categoriesResponse = await fetch('http://localhost:5000/api/books/categories');
      console.log('📂 Categories response status:', categoriesResponse.status);
      
      if (!categoriesResponse.ok) {
        const errorText = await categoriesResponse.text();
        throw new Error(`Failed to fetch categories: ${categoriesResponse.status} - ${errorText}`);
      }
      
      const categoriesData = await categoriesResponse.json();
      console.log('✅ Categories fetched successfully:', categoriesData.length, 'categories');
      
      // Transform categories data to include icons
      const transformedCategories = categoriesData.map(cat => ({
        ...cat,
        icon: <FaBook className="w-4 h-4" />
      }));
      
      setBooks(booksData);
      setCategories(transformedCategories);
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError(`Connection Error: ${err.message}. Please make sure the backend server is running on http://localhost:5000`);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    fetchData();
  }, []);

  // Filter and sort books
  const filteredBooks = books
    .filter(book => {
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchQuery.toLowerCase());
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
          return b.published - a.published;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const featuredBooks = books.filter(book => book.featured);

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
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-300">Loading books...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md">
              <div className="text-red-400 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-white mb-2">Error Loading Books</h2>
              <p className="text-gray-300 mb-4 text-sm">{error}</p>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    fetchData();
                  }} 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                >
                  Try Again
                </button>
                <div className="text-xs text-gray-400">
                  <p>Make sure:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Backend server is running on port 5000</li>
                    <li>Database is connected and accessible</li>
                    <li>Books table exists with data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content - Only show when not loading and no error */}
        {!loading && !error && (
          <>
            {/* Hero Section */}
            <section className="text-center py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaBook className="text-2xl text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 pb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Cybersecurity Books
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Expand your knowledge with our curated collection of cybersecurity books. 
              From beginner guides to advanced techniques, find the perfect resource for your learning journey.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <FaBook className="w-4 h-4" />
                {books.length} Books Available
              </span>
              <span className="flex items-center gap-2">
                <FaDownload className="w-4 h-4" />
                {books.reduce((total, book) => total + book.downloads, 0).toLocaleString()} Downloads
              </span>
            </div>
          </div>
        </section>

        {/* Featured Books Section */}
        {featuredBooks.length > 0 && (
          <section className="px-4 mb-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Featured Books</h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FaStar className="w-4 h-4 text-yellow-400" />
                  Most Popular
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded-lg shadow-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                            Featured
                          </span>
                          <div className="flex items-center gap-1">
                            <FaStar className="w-3 h-3 text-yellow-400" />
                            <span className="text-sm text-gray-300">{book.rating}</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-white line-clamp-2">{book.title}</h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{book.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">{book.author}</span>
                          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105">
                            Download
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
                        <div className="flex items-center gap-3">
                          {category.icon}
                          <span className="font-medium">{category.name}</span>
                        </div>
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
                            <div className="flex items-center gap-2">
                              {category.icon}
                              <span className="font-medium text-sm">{category.name}</span>
                            </div>
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
                        placeholder="Search books by title, author, or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Sort Dropdown */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="featured" className='text-black'>Featured First</option>
                      <option value="rating" className='text-black'>Highest Rated</option>
                      <option value="downloads" className='text-black'>Most Downloaded</option>
                      <option value="newest" className='text-black'>Newest First</option>
                      <option value="title" className='text-black'>Alphabetical</option>
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
                    Showing {filteredBooks.length} of {books.length} books
                  </p>
                </div>

                {/* Books Grid/List */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredBooks.map((book) => (
                      <div
                        key={book.id}
                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 flex flex-col h-full"
                      >
                        <div className="text-center flex-1 flex flex-col">
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-24 h-32 object-cover rounded-lg shadow-lg mx-auto mb-4"
                          />
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              <FaStar className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-gray-300">{book.rating}</span>
                            </div>
                            <span className="text-gray-500">•</span>
                            <span className="text-sm text-gray-400">{book.downloads.toLocaleString()} downloads</span>
                          </div>
                          <h3 className="font-bold text-lg mb-2 text-white line-clamp-2">{book.title}</h3>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">{book.description}</p>
                          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-4">
                            <span className="flex items-center gap-1">
                              <FaUser className="w-3 h-3" />
                              {book.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaClock className="w-3 h-3" />
                              {book.readTime}
                            </span>
                          </div>
                          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg mt-auto">
                            Download PDF
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBooks.map((book) => (
                      <div
                        key={book.id}
                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
                      >
                        <div className="flex items-start gap-6">
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-20 h-28 object-cover rounded-lg shadow-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0 flex flex-col">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-xl text-white">{book.title}</h3>
                              <div className="flex items-center gap-1">
                                <FaStar className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm text-gray-300">{book.rating}</span>
                              </div>
                            </div>
                            <p className="text-gray-400 mb-3 flex-1">{book.description}</p>
                            <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                              <span className="flex items-center gap-2">
                                <FaUser className="w-4 h-4" />
                                {book.author}
                              </span>
                              <span className="flex items-center gap-2">
                                <FaClock className="w-4 h-4" />
                                {book.readTime}
                              </span>
                              <span className="flex items-center gap-2">
                                <FaEye className="w-4 h-4" />
                                {book.downloads.toLocaleString()} downloads
                              </span>
                              <span className="flex items-center gap-2">
                                <BiCategory className="w-4 h-4" />
                                {book.pages} pages
                              </span>
                            </div>
                            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg self-start">
                              Download PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {filteredBooks.length === 0 && (
                  <div className="text-center py-12">
                    <FaBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-300 mb-2">No books found</h3>
                    <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </div>
            </div>
        </div>
        </section>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookPage; 