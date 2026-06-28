"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSpinner, FaEye, FaDownload, FaStar } from "react-icons/fa";
import Modal from "@/components/Modal";

const inputCls = "w-full bg-[#080808] border border-white/[0.07] rounded-lg px-4 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-red-600/40 transition-colors text-sm";

export default function BooksAdmin() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form, setForm] = useState({
    title: "", author: "", category: "", cover: "", pdf: "",
    description: "", rating: 0, downloads: 0, read_time: "",
    pages: 0, published: "", featured: false
  });

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true); setError(null);
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555") + "/api/books");
      if (!res.ok) throw new Error("Failed to fetch books");
      setBooks(await res.json());
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.description?.toLowerCase().includes(search.toLowerCase())
  );

  function openModal(book = null) {
    setEditingBook(book);
    setForm(book ? {
      title: book.title || "", author: book.author || "", category: book.category || "",
      cover: book.cover || "", pdf: book.pdf || "", description: book.description || "",
      rating: book.rating || 0, downloads: book.downloads || 0, read_time: book.read_time || "",
      pages: book.pages || 0, published: book.published || "", featured: book.featured || false
    } : { title: "", author: "", category: "", cover: "", pdf: "", description: "", rating: 0, downloads: 0, read_time: "", pages: 0, published: "", featured: false });
    setShowModal(true);
  }

  function closeModal() { setShowModal(false); setEditingBook(null); }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const url = editingBook
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"}/api/books/${editingBook.id}`
        : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555") + "/api/books";
      const res = await fetch(url, { method: editingBook ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Failed to save book");
      await fetchBooks(); closeModal();
    } catch (err) { alert("Error: " + err.message); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this book?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"}/api/books/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchBooks();
    } catch (err) { alert("Error: " + err.message); }
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Books Management</h2>
          <p className="text-white/40 text-sm mt-0.5">Manage the book collection for the platform.</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors text-sm">
          <FaPlus /> Add Book
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-3xl text-red-500" />
        </div>
      )}

      {error && (
        <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4 mb-6 text-red-400 text-sm">
          Error loading books: {error} —{" "}
          <button onClick={fetchBooks} className="underline hover:no-underline">Try again</button>
        </div>
      )}

      {/* Search */}
      {!loading && !error && (
        <>
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-sm">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
              <input
                className="w-full bg-[#0F0F0F] border border-white/[0.07] rounded-lg pl-9 pr-4 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-red-600/40 text-sm"
                placeholder="Search books..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <span className="text-white/30 text-sm">{filtered.length} / {books.length}</span>
          </div>

          {/* Table */}
          <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Cover", "Title", "Author", "Category", "Stats", "PDF", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map(book => (
                    <tr key={book.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-4">
                        <img src={book.cover} alt={book.title} className="w-12 h-16 object-cover rounded shadow"
                          onError={e => { e.target.src = "https://img.icons8.com/ios-filled/100/000000/book.png"; }} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-white text-sm max-w-[180px]">{book.title}</div>
                        <div className="text-white/40 text-xs mt-0.5 line-clamp-2">{book.description || "No description"}</div>
                        {book.featured && <span className="inline-block bg-yellow-600/20 text-yellow-400 px-2 py-0.5 rounded text-xs font-medium mt-1">Featured</span>}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-white text-sm">{book.author}</div>
                        {book.published && <div className="text-white/40 text-xs">{book.published}</div>}
                      </td>
                      <td className="px-4 py-4">
                        <span className="bg-red-600/10 text-red-400 px-2.5 py-1 rounded-full text-xs font-medium capitalize">{book.category}</span>
                      </td>
                      <td className="px-4 py-4 space-y-1 text-xs">
                        <div className="flex items-center gap-1 text-white/60"><FaStar className="text-yellow-400 w-3 h-3" />{book.rating || 0}</div>
                        <div className="flex items-center gap-1 text-white/60"><FaDownload className="text-blue-400 w-3 h-3" />{book.downloads || 0}</div>
                        {book.read_time && <div className="flex items-center gap-1 text-white/60"><FaEye className="text-green-400 w-3 h-3" />{book.read_time}</div>}
                      </td>
                      <td className="px-4 py-4">
                        {book.pdf
                          ? <a href={book.pdf} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs underline">View PDF</a>
                          : <span className="text-white/20 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1">
                          <button onClick={() => openModal(book)} className="p-2 text-white/30 hover:text-blue-400 hover:bg-blue-600/10 rounded-lg transition-colors" title="Edit"><FaEdit /></button>
                          <button onClick={() => handleDelete(book.id)} className="p-2 text-white/30 hover:text-red-400 hover:bg-red-600/10 rounded-lg transition-colors" title="Delete"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="py-10 text-center text-white/30 text-sm">{search ? "No books match your search." : "No books available."}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <Modal onClose={closeModal}>
          <h3 className="text-white font-bold text-lg mb-5">{editingBook ? "Edit Book" : "Add Book"}</h3>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className={inputCls} name="title" placeholder="Book Title" value={form.title} onChange={handleChange} required />
              <input className={inputCls} name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
            </div>
            <textarea className={`${inputCls} resize-none`} name="description" placeholder="Book Description" value={form.description} onChange={handleChange} rows={3} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className={inputCls} name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
              <input className={inputCls} name="published" placeholder="Publication Year (e.g., 2024)" value={form.published} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className={inputCls} name="cover" placeholder="Cover Image URL" value={form.cover} onChange={handleChange} required />
              <input className={inputCls} name="pdf" placeholder="PDF URL (optional)" value={form.pdf} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input className={inputCls} name="rating" type="number" step="0.1" min="0" max="5" placeholder="Rating (0–5)" value={form.rating} onChange={handleChange} />
              <input className={inputCls} name="downloads" type="number" min="0" placeholder="Downloads" value={form.downloads} onChange={handleChange} />
              <input className={inputCls} name="pages" type="number" min="0" placeholder="Pages" value={form.pages} onChange={handleChange} />
            </div>
            <input className={inputCls} name="read_time" placeholder="Reading Time (e.g., 6–8 hours)" value={form.read_time} onChange={handleChange} />
            <div className="flex items-center gap-2">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="accent-red-600 w-4 h-4" />
              <label className="text-white/60 text-sm">Featured Book</label>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={closeModal} className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] text-white/70 rounded-lg transition-colors text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors text-sm">{editingBook ? "Update Book" : "Add Book"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
