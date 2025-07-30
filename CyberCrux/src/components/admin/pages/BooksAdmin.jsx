import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSpinner, FaEye, FaDownload, FaStar } from "react-icons/fa";
import Modal from "../components/Modal";

export default function BooksAdmin() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form, setForm] = useState({ 
    title: "", 
    author: "", 
    category: "", 
    cover: "", 
    pdf: "", 
    description: "",
    rating: 0,
    downloads: 0,
    read_time: "",
    pages: 0,
    published: "",
    featured: false
  });

  // Fetch books from API
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/books');
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(
    b => b.title.toLowerCase().includes(search.toLowerCase()) || 
         b.author.toLowerCase().includes(search.toLowerCase()) ||
         b.description?.toLowerCase().includes(search.toLowerCase())
  );

  function handleModalOpen(book = null) {
    if (book) {
      // Editing existing book
      setEditingBook(book);
      setForm({
        title: book.title || "",
        author: book.author || "",
        category: book.category || "",
        cover: book.cover || "",
        pdf: book.pdf || "",
        description: book.description || "",
        rating: book.rating || 0,
        downloads: book.downloads || 0,
        read_time: book.read_time || "",
        pages: book.pages || 0,
        published: book.published || "",
        featured: book.featured || false
      });
    } else {
      // Adding new book
      setEditingBook(null);
      setForm({
        title: "",
        author: "",
        category: "",
        cover: "",
        pdf: "",
        description: "",
        rating: 0,
        downloads: 0,
        read_time: "",
        pages: 0,
        published: "",
        featured: false
      });
    }
    setShowModal(true);
  }

  function handleModalClose() {
    setShowModal(false);
    setEditingBook(null);
  }

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ 
      ...f, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const url = editingBook 
        ? `http://localhost:5000/api/books/${editingBook.id}`
        : 'http://localhost:5000/api/books';
      
      const method = editingBook ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Failed to save book');
      
      // Refresh books list
      await fetchBooks();
    setShowModal(false);
      setEditingBook(null);
    } catch (err) {
      console.error('Error saving book:', err);
      alert('Error saving book: ' + err.message);
    }
  }

  async function handleDeleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete book');
      
      // Refresh books list
      await fetchBooks();
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Error deleting book: ' + err.message);
    }
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-1 text-blue-800">Books Management</h2>
          <p className="text-gray-500">Manage your book collection for the platform.</p>
        </div>
        <button 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition" 
          onClick={() => handleModalOpen()}
        >
          <FaPlus /> Add Book
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading books...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-800">
            <span className="text-lg">⚠️</span>
            <p className="font-medium">Error loading books: {error}</p>
          </div>
          <button 
            onClick={fetchBooks}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-6">
        <div className="relative w-full max-w-xs">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="pl-10 pr-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 w-full bg-white shadow-sm"
            placeholder="Search books by title, author, or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredBooks.length} of {books.length} books
        </div>
      </div>
      {/* Books Table */}
      {!loading && !error && (
      <div className="overflow-x-auto rounded-xl shadow bg-white">
          <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="bg-blue-50 text-blue-900 text-left">
              <th className="p-4 font-semibold">Cover</th>
                <th className="p-4 font-semibold">Title & Description</th>
              <th className="p-4 font-semibold">Author</th>
              <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Stats</th>
              <th className="p-4 font-semibold">PDF</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map(book => (
              <tr key={book.id} className="border-b hover:bg-blue-50 transition">
                  <td className="p-4">
                    <img 
                      src={book.cover} 
                      alt={book.title} 
                      className="w-16 h-20 object-cover rounded shadow"
                      onError={(e) => {
                        e.target.src = 'https://img.icons8.com/ios-filled/100/000000/book.png';
                      }}
                    />
                  </td>
                  <td className="p-4">
                    <div className="max-w-xs">
                      <div className="font-medium text-blue-800 mb-1">{book.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {book.description || 'No description available'}
                      </div>
                      {book.featured && (
                        <span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold mt-1">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{book.author}</div>
                    {book.published && (
                      <div className="text-sm text-gray-500">{book.published}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                      {book.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400 w-3 h-3" />
                        <span>{book.rating || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaDownload className="text-blue-400 w-3 h-3" />
                        <span>{book.downloads || 0}</span>
                      </div>
                      {book.read_time && (
                        <div className="flex items-center gap-1">
                          <FaEye className="text-green-400 w-3 h-3" />
                          <span>{book.read_time}</span>
                        </div>
                      )}
                      {book.pages && (
                        <div className="text-gray-500">{book.pages} pages</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {book.pdf ? (
                      <a 
                        href={book.pdf} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-500 hover:underline text-sm"
                      >
                        View PDF
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      <button 
                        className="text-blue-500 hover:text-blue-700 transition p-1" 
                        title="Edit"
                        onClick={() => handleModalOpen(book)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700 transition p-1" 
                        title="Delete"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                </td>
              </tr>
            ))}
            {filteredBooks.length === 0 && (
              <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-400">
                    {search ? 'No books found matching your search.' : 'No books available.'}
                  </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}
      {showModal && (
        <Modal onClose={handleModalClose}>
          <h3 className="text-xl font-bold mb-4">
            {editingBook ? 'Edit Book' : 'Add Book'}
          </h3>
          <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border p-2 rounded"
              name="title"
                placeholder="Book Title"
              value={form.title}
              onChange={handleFormChange}
              required
            />
            <input
              className="border p-2 rounded"
              name="author"
              placeholder="Author"
              value={form.author}
              onChange={handleFormChange}
              required
            />
            </div>
            
            <textarea
              className="border p-2 rounded"
              name="description"
              placeholder="Book Description"
              value={form.description}
              onChange={handleFormChange}
              rows={3}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="border p-2 rounded"
                name="category"
                placeholder="Category (e.g., beginner, advanced, forensics, etc.)"
                value={form.category}
                onChange={handleFormChange}
                required
              />
              <input
                className="border p-2 rounded"
                name="published"
                placeholder="Publication Year (e.g., 2024)"
                value={form.published}
                onChange={handleFormChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border p-2 rounded"
              name="cover"
              placeholder="Cover Image URL"
              value={form.cover}
              onChange={handleFormChange}
              required
            />
            <input
              className="border p-2 rounded"
              name="pdf"
              placeholder="PDF URL (optional)"
              value={form.pdf}
              onChange={handleFormChange}
            />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                className="border p-2 rounded"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="Rating (0-5)"
                value={form.rating}
                onChange={handleFormChange}
              />
              <input
                className="border p-2 rounded"
                name="downloads"
                type="number"
                min="0"
                placeholder="Downloads Count"
                value={form.downloads}
                onChange={handleFormChange}
              />
              <input
                className="border p-2 rounded"
                name="pages"
                type="number"
                min="0"
                placeholder="Number of Pages"
                value={form.pages}
                onChange={handleFormChange}
              />
            </div>
            
            <input
              className="border p-2 rounded"
              name="read_time"
              placeholder="Reading Time (e.g., 6-8 hours)"
              value={form.read_time}
              onChange={handleFormChange}
            />
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleFormChange}
                className="w-4 h-4"
              />
              <label className="text-sm">Featured Book</label>
            </div>
            
            <div className="flex gap-2 justify-end mt-4">
              <button 
                type="button" 
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition" 
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {editingBook ? 'Update Book' : 'Add Book'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
} 