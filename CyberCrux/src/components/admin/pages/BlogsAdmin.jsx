import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

export default function BlogsAdmin() {
  const [search, setSearch] = useState("");
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "First Blog",
      author: "Admin",
      date: "2024-06-01",
      content: "<h2>Welcome to the Blog!</h2><p>This is a <strong>rich</strong> blog post.</p>"
    },
    {
      id: 2,
      title: "Second Blog",
      author: "Admin",
      date: "2024-06-02",
      content: "<p>Another <em>awesome</em> post with <a href='https://example.com'>a link</a>.</p>"
    }
  ]);
  const navigate = useNavigate();

  function handleAdd() {
    navigate("/admin/blogs/new", { state: { blogs } });
  }

  function handleEdit(blog) {
    navigate(`/admin/blogs/edit/${blog.id}`, { state: { blog, blogs } });
  }

  function handleDelete(blogId) {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      setBlogs(blogs => blogs.filter(b => b.id !== blogId));
    }
  }

  const filteredBlogs = blogs.filter(
    b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-1 text-blue-800">Blogs</h2>
          <p className="text-gray-500">Manage blog posts for your platform.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition" onClick={handleAdd}>
          <FaPlus /> Add Blog
        </button>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <div className="relative w-full max-w-xs">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="pl-10 pr-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 w-full bg-white shadow-sm"
            placeholder="Search blogs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="bg-blue-50 text-blue-900 text-left">
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Author</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map(blog => (
              <tr key={blog.id} className="border-b hover:bg-blue-50 transition">
                <td className="p-4 font-semibold text-blue-800">{blog.title}</td>
                <td className="p-4">{blog.author}</td>
                <td className="p-4 text-gray-500">{blog.date}</td>
                <td className="p-4 flex gap-3 justify-center">
                  <button className="text-blue-500 hover:text-blue-700 transition" title="Edit" onClick={() => handleEdit(blog)}><FaEdit /></button>
                  <button className="text-red-500 hover:text-red-700 transition" title="Delete" onClick={() => handleDelete(blog.id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
            {filteredBlogs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">No blogs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 