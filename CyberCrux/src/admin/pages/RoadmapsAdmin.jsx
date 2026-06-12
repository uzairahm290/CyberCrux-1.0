import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import Modal from "../components/Modal";

// Demo blogs list (in real app, fetch from backend or context)
const blogs = [
  { id: 1, title: "First Blog", author: "Admin" },
  { id: 2, title: "Second Blog", author: "Admin" },
  { id: 3, title: "Red Teaming Roadmap", author: "Alice" },
];

export default function RoadmapsAdmin() {
  const [search, setSearch] = useState("");
  const [roadmaps, setRoadmaps] = useState([
    { id: 1, title: "SOC Analyst Roadmap", author: "Admin", date: "2024-06-01" },
    { id: 2, title: "Penetration Tester Roadmap", author: "Admin", date: "2024-06-02" },
    { id: 3, title: "Cloud Security Roadmap", author: "Alice", date: "2024-06-03" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(blogs[0]?.id || "");

  const filteredRoadmaps = roadmaps.filter(
    r => r.title.toLowerCase().includes(search.toLowerCase()) || r.author.toLowerCase().includes(search.toLowerCase())
  );

  function handleModalOpen() {
    setSelectedBlogId(blogs[0]?.id || "");
    setShowModal(true);
  }

  function handleModalClose() {
    setShowModal(false);
  }

  function handleAddRoadmap(e) {
    e.preventDefault();
    const blog = blogs.find(b => b.id === Number(selectedBlogId));
    if (!blog) return;
    setRoadmaps(rms => [
      ...rms,
      {
        id: blog.id, // assign blog id as roadmap id
        title: blog.title,
        author: blog.author,
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    setShowModal(false);
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-1 text-blue-800">Roadmaps</h2>
          <p className="text-gray-500">Manage learning roadmaps for your users.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition" onClick={handleModalOpen}>
          <FaPlus /> Add Roadmap
        </button>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <div className="relative w-full max-w-xs">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="pl-10 pr-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 w-full bg-white shadow-sm"
            placeholder="Search roadmaps..."
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
            {filteredRoadmaps.map(roadmap => (
              <tr key={roadmap.id} className="border-b hover:bg-blue-50 transition">
                <td className="p-4 font-medium text-blue-800">{roadmap.title}</td>
                <td className="p-4">{roadmap.author}</td>
                <td className="p-4 text-gray-500">{roadmap.date}</td>
                <td className="p-4 flex gap-3 justify-center">
                  <button className="text-blue-500 hover:text-blue-700 transition" title="Edit"><FaEdit /></button>
                  <button className="text-red-500 hover:text-red-700 transition" title="Delete"><FaTrash /></button>
                </td>
              </tr>
            ))}
            {filteredRoadmaps.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">No roadmaps found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal onClose={handleModalClose}>
          <h3 className="text-xl font-bold mb-4">Add Roadmap</h3>
          <form className="flex flex-col gap-4" onSubmit={handleAddRoadmap}>
            <label className="font-semibold">Select Blog</label>
            <select
              className="border p-2 rounded"
              value={selectedBlogId}
              onChange={e => setSelectedBlogId(e.target.value)}
              required
            >
              {blogs.map(blog => (
                <option key={blog.id} value={blog.id}>
                  {blog.title} (ID: {blog.id})
                </option>
              ))}
            </select>
            <div className="flex gap-2 justify-end mt-2">
              <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={handleModalClose}>Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
} 