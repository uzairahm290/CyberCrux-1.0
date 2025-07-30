import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PracticeAdmin() {
  const [search, setSearch] = useState("");
  const [practices, setPractices] = useState([
    { id: 1, title: "Web Security MCQs", author: "Admin", date: "2024-06-01" },
    { id: 2, title: "Forensics MCQs", author: "Admin", date: "2024-06-02" },
  ]);
  const navigate = useNavigate();

  function handleAdd() {
    navigate("/admin/practice/new", { state: { practices } });
  }

  function handleEdit(practice) {
    navigate(`/admin/practice/edit/${practice.id}`, { state: { practice, practices } });
  }

  function handleDelete(practiceId) {
    if (window.confirm("Are you sure you want to delete this practice item?")) {
      setPractices(practices => practices.filter(p => p.id !== practiceId));
    }
  }

  const filteredPractices = practices.filter(
    p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-1 text-blue-800">Practice Sets</h2>
          <p className="text-gray-500">Manage MCQ practice sets for your users.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition" onClick={handleAdd}>
          <FaPlus /> Add Practice
        </button>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <div className="relative w-full max-w-xs">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="pl-10 pr-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 w-full bg-white shadow-sm"
            placeholder="Search practice sets..."
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
            {filteredPractices.map(practice => (
              <tr key={practice.id} className="border-b hover:bg-blue-50 transition">
                <td className="p-4 font-medium text-blue-800">{practice.title}</td>
                <td className="p-4">{practice.author}</td>
                <td className="p-4 text-gray-500">{practice.date}</td>
                <td className="p-4 flex gap-3 justify-center">
                  <button className="text-blue-500 hover:text-blue-700 transition" title="Edit" onClick={() => handleEdit(practice)}><FaEdit /></button>
                  <button className="text-red-500 hover:text-red-700 transition" title="Delete" onClick={() => handleDelete(practice.id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
            {filteredPractices.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">No practice sets found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 