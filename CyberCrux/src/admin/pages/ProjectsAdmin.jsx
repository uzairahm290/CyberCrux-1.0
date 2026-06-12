import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

export default function ProjectsAdmin() {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([
    { id: 1, name: "SIEM Integration", owner: "Admin", date: "2024-06-01", status: "Active" },
    { id: 2, name: "Red Team Lab", owner: "Alice", date: "2024-06-02", status: "Planning" },
    { id: 3, name: "Cloud Security Portal", owner: "Bob", date: "2024-06-03", status: "Completed" },
  ]);

  const filteredProjects = projects.filter(
    p => p.name.toLowerCase().includes(search.toLowerCase()) || p.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-1 text-blue-800">Projects</h2>
          <p className="text-gray-500">Manage platform projects and initiatives.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition">
          <FaPlus /> Add Project
        </button>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <div className="relative w-full max-w-xs">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="pl-10 pr-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 w-full bg-white shadow-sm"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="bg-blue-50 text-blue-900 text-left">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Owner</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map(project => (
              <tr key={project.id} className="border-b hover:bg-blue-50 transition">
                <td className="p-4 font-medium text-blue-800">{project.name}</td>
                <td className="p-4">{project.owner}</td>
                <td className="p-4 text-gray-500">{project.date}</td>
                <td className="p-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : project.status === "Planning"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                  }`}>{project.status}</span>
                </td>
                <td className="p-4 flex gap-3 justify-center">
                  <button className="text-blue-500 hover:text-blue-700 transition" title="Edit"><FaEdit /></button>
                  <button className="text-red-500 hover:text-red-700 transition" title="Delete"><FaTrash /></button>
                </td>
              </tr>
            ))}
            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">No projects found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 