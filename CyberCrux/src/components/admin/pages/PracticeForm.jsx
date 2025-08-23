import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSave, FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { BiCategory, BiTime, BiTargetLock, BiDiamond } from "react-icons/bi";

export default function PracticeForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = location.state?.scenario;
  const scenario = location.state?.scenario || {};

  // Add error boundary
  if (!location.state && isEditing) {
    console.error("No scenario data provided for editing");
    return (
      <div className="p-6 md:p-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error: No Scenario Data</h2>
          <p className="text-gray-600 mb-6">No scenario data was provided for editing. Please go back and try again.</p>
          <button
            onClick={() => navigate("/admin/practice")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to Practice Admin
          </button>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    title: scenario.title || "",
    category: scenario.category || "",
    difficulty: scenario.difficulty || "Medium",
    time_estimate: scenario.time_estimate || "",
    questions_count: scenario.questions_count || "",
    points: scenario.points || "",
    description: scenario.description || "",
    short_description: scenario.short_description || "",
    is_featured: scenario.is_featured || false,
    is_active: scenario.is_active !== undefined ? scenario.is_active : true,
    file_url: scenario.file_url || "",
    tags: (() => {
      try {
        if (!scenario.tags) return [];
        if (Array.isArray(scenario.tags)) return scenario.tags;
        if (typeof scenario.tags === 'string') {
          const parsed = JSON.parse(scenario.tags);
          return Array.isArray(parsed) ? parsed : [];
        }
        return [];
      } catch (error) {
        console.error('Error parsing tags:', error);
        return [];
      }
    })()
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [newTag, setNewTag] = useState("");

  // Debug logging - only run once when component mounts
  useEffect(() => {
    console.log("PracticeForm mounted");
    console.log("Location state:", location.state);
    console.log("Is editing:", isEditing);
    console.log("Scenario:", scenario);
    console.log("Form data initialized:", formData);
  }, []); // Empty dependency array - only run once

  // Check if we have valid scenario data for editing
  useEffect(() => {
    if (isEditing && (!scenario.id || !scenario.title)) {
      console.error("Invalid scenario data for editing:", scenario);
      alert("Invalid scenario data. Redirecting back to practice admin.");
      navigate("/admin/practice");
    }
  }, [isEditing, scenario, navigate]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/practice/categories", {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        // Set default categories if API is not available
        setCategories([
          { key_name: "web", label: "Web Security" },
          { key_name: "network", label: "Network Security" },
          { key_name: "forensics", label: "Digital Forensics" },
          { key_name: "crypto", label: "Cryptography" },
          { key_name: "malware", label: "Malware Analysis" },
          { key_name: "incident", label: "Incident Response" },
          { key_name: "python", label: "Python Security" },
          { key_name: "reverse", label: "Reverse Engineering" },
          { key_name: "webapp", label: "Web Application Security" },
          { key_name: "mobile", label: "Mobile Security" }
        ]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Set comprehensive default categories
      setCategories([
        { key_name: "web", label: "Web Security" },
        { key_name: "network", label: "Network Security" },
        { key_name: "forensics", label: "Digital Forensics" },
        { key_name: "crypto", label: "Cryptography" },
        { key_name: "malware", label: "Malware Analysis" },
        { key_name: "incident", label: "Incident Response" },
        { key_name: "python", label: "Python Security" },
        { key_name: "reverse", label: "Reverse Engineering" },
        { key_name: "webapp", label: "Web Application Security" },
        { key_name: "mobile", label: "Mobile Security" },
        { key_name: "cloud", label: "Cloud Security" },
        { key_name: "iot", label: "IoT Security" }
      ]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.difficulty || !formData.points) {
      alert("Please fill in all required fields (Title, Category, Difficulty, Points)");
      return;
    }

    // Validate points and time estimate
    if (formData.points < 1) {
      alert("Points must be at least 1");
      return;
    }

    if (formData.time_estimate && formData.time_estimate < 1) {
      alert("Time estimate must be at least 1 minute");
      return;
    }

    if (formData.questions_count && formData.questions_count < 1) {
      alert("Questions count must be at least 1");
      return;
    }

    setLoading(true);
    try {
      const url = isEditing 
        ? `http://localhost:5000/api/practice/scenarios/${scenario.id}`
        : "http://localhost:5000/api/practice/scenarios";
      
      const method = isEditing ? "PUT" : "POST";
      
      // Prepare the data, ensuring all fields are properly formatted
      const submitData = {
        ...formData,
        points: parseInt(formData.points),
        time_estimate: formData.time_estimate ? parseInt(formData.time_estimate) : null,
        questions_count: formData.questions_count ? parseInt(formData.questions_count) : null,
        tags: Array.isArray(formData.tags) ? formData.tags : []
      };
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(submitData),
      });

      const result = await res.json();
      
      if (result.success) {
        alert(isEditing ? "Scenario updated successfully!" : "Scenario created successfully!");
        navigate("/admin/practice");
      } else {
        alert("Failed to save scenario: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving scenario:", error);
      alert("An error occurred while saving the scenario. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/practice");
  };

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {categoriesLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading form...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1 text-blue-800">
                  {isEditing ? "Edit Practice Scenario" : "Add New Practice Scenario"}
                </h2>
                <p className="text-gray-500">
                  {isEditing ? "Update the scenario details below" : "Fill in the details to create a new practice scenario"}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log("Current form data:", formData);
                    console.log("Will submit to:", isEditing ? `PUT /api/practice/scenarios/${scenario.id}` : "POST /api/practice/scenarios");
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold shadow transition"
                >
                  Test Submit
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2 rounded-lg font-semibold shadow transition"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <FaSave />
                  )}
                  {isEditing ? "Update" : "Create"} Scenario
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Enter scenario title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.key_name} value={cat.key_name}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      required
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="points"
                      value={formData.points}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Enter points value"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Estimate (minutes)
                    </label>
                    <input
                      type="number"
                      name="time_estimate"
                      value={formData.time_estimate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Estimated completion time"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Questions Count
                    </label>
                    <input
                      type="number"
                      name="questions_count"
                      value={formData.questions_count}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Number of questions"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Description</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description
                    </label>
                    <input
                      type="text"
                      name="short_description"
                      value={formData.short_description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Brief description (displayed in lists)"
                      maxLength="200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Detailed description of the scenario"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Settings */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Additional Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      File URL
                    </label>
                    <input
                      type="url"
                      name="file_url"
                      value={formData.file_url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Optional file attachment URL"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Active (visible to users)</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured (highlighted)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Tags</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
