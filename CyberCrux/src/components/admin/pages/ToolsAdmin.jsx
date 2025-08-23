import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

export default function ToolsAdmin() {
  const [tools, setTools] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    type: "",
    author: "",
    rating: 0,
    downloads: 0,
    featured: false,
    difficulty: "",
    license: "",
    website: "",
    commands: "[]",
    platforms: "[]",
    tutorials: 0,
    practiceScenarios: 0,
    icon: "",
    how_to_use: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const loadTools = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tools");
      setTools(res.data);
    } catch (err) {
      console.error("Error loading tools:", err);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tools/search", {
        params: { category, search }
      });
      setTools(res.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      type: "",
      author: "",
      rating: 0,
      downloads: 0,
      featured: false,
      difficulty: "",
      license: "",
      website: "",
      commands: "[]",
      platforms: "[]",
      tutorials: 0,
      practiceScenarios: 0,
      icon: "",
      how_to_use: ""
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        rating: parseFloat(formData.rating),
        downloads: parseInt(formData.downloads),
        tutorials: parseInt(formData.tutorials),
        practiceScenarios: parseInt(formData.practiceScenarios),
        featured: formData.featured === true || formData.featured === "true",
        commands: JSON.parse(formData.commands || "[]"),
        platforms: JSON.parse(formData.platforms || "[]"),
        how_to_use: formData.how_to_use || ""
      };

      delete payload.learn_more;

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/tools/${editId}`, payload);
      } else {
        await axios.post("http://localhost:5000/api/tools", payload);
      }

      await loadTools();
      resetForm();
    } catch (error) {
      console.error("Failed to submit tool:", error);
      alert("Make sure JSON fields (commands/platforms) are valid.");
    }
  };

  const handleEdit = (tool) => {
    setFormData({
      ...tool,
      commands: JSON.stringify(tool.commands || []),
      platforms: JSON.stringify(tool.platforms || []),
      how_to_use: tool.how_to_use || ""
    });
    setIsEditing(true);
    setEditId(tool.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tools/${id}`);
      await loadTools();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-700">Tools Admin</h2>
        <button onClick={resetForm} className="text-sm bg-gray-200 px-3 py-1 rounded">
          Clear
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {Object.entries(formData).map(([key, value]) => (
          key === "how_to_use" ? (
            <textarea
              key={key}
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={key}
              className="border p-2 rounded min-h-[80px]"
            />
          ) : key === "featured" ? (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                name={key}
                checked={value}
                onChange={handleChange}
              />
              Featured
            </label>
          ) : (
            <input
              key={key}
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={key}
              className="border p-2 rounded"
            />
          )
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isEditing ? "Update Tool" : "Add Tool"}
      </button>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-full max-w-sm"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All</option>
          <option value="Recon">Recon</option>
          <option value="Exploitation">Exploitation</option>
        </select>
        <button
          onClick={handleSearch}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-blue-50">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2">Author</th>
            <th className="p-2">Category</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool) => (
            <tr key={tool.id} className="border-t">
              <td className="p-2 font-medium text-blue-700">{tool.name}</td>
              <td className="p-2 text-center">{tool.author}</td>
              <td className="p-2 text-center">{tool.category}</td>
              <td className="p-2 text-center flex gap-2 justify-center">
                <button
                  onClick={() => handleEdit(tool)}
                  className="text-blue-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(tool.id)}
                  className="text-red-600"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
