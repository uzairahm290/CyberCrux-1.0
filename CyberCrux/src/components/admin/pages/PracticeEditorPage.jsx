import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaTimes, FaPlus, FaTrash, FaEye, FaStar, FaCheckCircle } from "react-icons/fa";
import { BiCategory, BiTime, BiTargetLock, BiDiamond, BiBrain, BiCode } from "react-icons/bi";

const PracticeEditorPage = () => {
  console.log("PracticeEditorPage component rendering...");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("scenario");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [componentError, setComponentError] = useState(null);

  // States for Category
  const [category, setCategory] = useState({
    key_name: "",
    label: "",
    description: "",
    color_gradient: "from-blue-500 to-cyan-500"
  });

  // States for Scenario
  const [scenario, setScenario] = useState({
    title: "",
    category: "",
    difficulty: "Medium",
    time_estimate: "",
    questions_count: "",
    points: "",
    description: "",
    short_description: "",
    tags: [],
    is_featured: false,
    is_active: true,
    file_url: ""
  });

  // States for Question
  const [question, setQuestion] = useState({
    scenario_id: "",
    question_text: "",
    correct_answer: "",
    points: "10",
    explanation: "",
    question_order: "0"
  });

  const [categories, setCategories] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [newTag, setNewTag] = useState("");


  // Fetch categories and scenarios
  useEffect(() => {
    console.log("PracticeEditorPage useEffect running...");
    try {
      fetchCategories();
      fetchScenarios();
    } catch (error) {
      console.error("Error in useEffect:", error);
      setComponentError(error.message);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/practice/categories", {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        // Set default categories if API fails
        setCategories([
          { key_name: "web", label: "Web Security" },
          { key_name: "network", label: "Network Security" },
          { key_name: "forensics", label: "Digital Forensics" },
          { key_name: "crypto", label: "Cryptography" },
          { key_name: "malware", label: "Malware Analysis" },
          { key_name: "incident", label: "Incident Response" }
        ]);
      }
      } catch (error) {
      console.error("Error fetching categories:", error);
      // Set fallback categories
      setCategories([
        { key_name: "web", label: "Web Security" },
        { key_name: "network", label: "Network Security" },
        { key_name: "forensics", label: "Digital Forensics" },
        { key_name: "crypto", label: "Cryptography" },
        { key_name: "malware", label: "Malware Analysis" },
        { key_name: "incident", label: "Incident Response" }
      ]);
    }
  };

  const fetchScenarios = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/practice/scenarios", {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setScenarios(data.data);
      }
    } catch (error) {
      console.error("Error fetching scenarios:", error);
    }
  };

  // Category handlers
  const handleCategoryChange = (field, value) => {
    setCategory(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCategory = async () => {
    if (!category.key_name || !category.label) {
      setErrorMessage("Please fill in all required fields for category");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/practice/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category)
      });

      const data = await res.json();
      if (data.success) {
      setSuccessMessage("Category added successfully!");
      setCategory({
        key_name: "",
        label: "",
        description: "",
          color_gradient: "from-blue-500 to-cyan-500"
      });
        fetchCategories(); // Refresh categories
      setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(data.message || "Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setErrorMessage("An error occurred while adding the category");
    } finally {
      setLoading(false);
    }
  };

  // Scenario handlers
  const handleScenarioChange = (field, value) => {
    setScenario(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !scenario.tags.includes(newTag.trim())) {
      setScenario(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setScenario(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddScenario = async () => {
    if (!scenario.title || !scenario.category || !scenario.difficulty || !scenario.points) {
      setErrorMessage("Please fill in all required fields for scenario");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...scenario,
        points: parseInt(scenario.points),
        time_estimate: scenario.time_estimate ? parseInt(scenario.time_estimate) : null,
        questions_count: scenario.questions_count ? parseInt(scenario.questions_count) : null
      };

      const res = await fetch("http://localhost:5000/api/practice/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(submitData)
      });

      const data = await res.json();
      if (data.success) {
      setSuccessMessage("Scenario added successfully!");
      setScenario({
        title: "",
        category: "",
          difficulty: "Medium",
        time_estimate: "",
          questions_count: "",
          points: "",
        description: "",
          short_description: "",
          tags: [],
        is_featured: false,
        is_active: true,
          file_url: ""
        });
        fetchScenarios(); // Refresh scenarios
      setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(data.message || "Failed to add scenario");
      }
    } catch (error) {
      console.error("Error adding scenario:", error);
      setErrorMessage("An error occurred while adding the scenario");
    } finally {
      setLoading(false);
    }
  };

  // Question handlers
  const handleQuestionChange = (field, value) => {
    setQuestion(prev => ({ ...prev, [field]: value }));
  };



  const handleAddQuestion = async () => {
    if (!question.scenario_id || !question.question_text || !question.correct_answer || !question.points) {
      setErrorMessage("Please fill in all required fields for question");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...question,
        points: parseInt(question.points),
        question_order: question.question_order ? parseInt(question.question_order) : 0
      };

      const res = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(submitData)
      });

      const data = await res.json();
      if (data.success) {
      setSuccessMessage("Question added successfully!");
      setQuestion({
        scenario_id: "",
        question_text: "",
        correct_answer: "",
        points: "10",
        explanation: "",
        question_order: "0"
      });
      setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(data.message || "Failed to add question");
      }
    } catch (error) {
      console.error("Error adding question:", error);
      setErrorMessage("An error occurred while adding the question");
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  // Show error if component failed to load
  if (componentError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Component Error</h2>
          <p className="text-gray-700 mb-4">{componentError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Content Management</h1>
                <p className="text-gray-600">Add and manage practice categories, scenarios, and questions</p>
              </div>
              <button
                onClick={() => navigate("/admin/practice")}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                <FaTimes /> Back to Practice Admin
              </button>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  {successMessage}
                </div>
                <button onClick={clearMessages} className="text-green-500 hover:text-green-700">
                  <FaTimes />
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaTimes className="text-red-500" />
                  {errorMessage}
                </div>
                <button onClick={clearMessages} className="text-red-500 hover:text-red-700">
                  <FaTimes />
                </button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "category" 
                  ? "border-blue-500 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("category")}
            >
              <BiCategory className="inline mr-2" />
              Add Category
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "scenario" 
                  ? "border-blue-500 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("scenario")}
            >
              <BiBrain className="inline mr-2" />
              Add Scenario
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "question" 
                  ? "border-blue-500 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("question")}
            >
              <BiCode className="inline mr-2" />
              Add Question
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {activeTab === "category" && (
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                  <BiCategory className="text-blue-500" />
                  Add Practice Category
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Name <span className="text-red-500">*</span>
                    </label>
          <input
            type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="e.g., python-basics"
            value={category.key_name}
                      onChange={(e) => handleCategoryChange("key_name", e.target.value)}
          />
                    <p className="text-sm text-gray-500 mt-1">Unique identifier for the category</p>
        </div>
                  
        <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Label <span className="text-red-500">*</span>
                    </label>
          <input
            type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="e.g., Python Basics"
            value={category.label}
                      onChange={(e) => handleCategoryChange("label", e.target.value)}
          />
                    <p className="text-sm text-gray-500 mt-1">User-friendly display name</p>
        </div>
      </div>
      
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Describe this category..."
          rows="3"
          value={category.description}
                    onChange={(e) => handleCategoryChange("description", e.target.value)}
        ></textarea>
      </div>
      
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color Gradient</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            value={category.color_gradient}
                    onChange={(e) => handleCategoryChange("color_gradient", e.target.value)}
                  >
                    <option value="from-blue-500 to-cyan-500">Blue to Cyan</option>
                    <option value="from-purple-500 to-pink-500">Purple to Pink</option>
                    <option value="from-green-500 to-emerald-500">Green to Emerald</option>
                    <option value="from-orange-500 to-red-500">Orange to Red</option>
                    <option value="from-indigo-500 to-purple-500">Indigo to Purple</option>
                    <option value="from-teal-500 to-cyan-500">Teal to Cyan</option>
                  </select>
      </div>
      
      <button
        onClick={handleAddCategory}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition flex items-center gap-2"
      >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <FaPlus />
                  )}
        Add Category
      </button>
    </div>
            )}

            {activeTab === "scenario" && (
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                  <BiBrain className="text-purple-500" />
                  Add Practice Scenario
                </h2>
                
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
        <input
          type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Enter scenario title"
          value={scenario.title}
                        onChange={(e) => handleScenarioChange("title", e.target.value)}
        />
      </div>
      
      <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
    value={scenario.category}
                        onChange={(e) => handleScenarioChange("category", e.target.value)}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            value={scenario.difficulty}
                        onChange={(e) => handleScenarioChange("difficulty", e.target.value)}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Enter points value"
                        min="1"
                        value={scenario.points}
                        onChange={(e) => handleScenarioChange("points", e.target.value)}
                      />
      </div>
      
        <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Estimate (minutes)
                      </label>
          <input
            type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Estimated completion time"
                        min="1"
                        value={scenario.time_estimate}
                        onChange={(e) => handleScenarioChange("time_estimate", e.target.value)}
          />
        </div>
                    
        <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Questions Count
                      </label>
          <input
            type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Number of questions"
                        min="1"
                        value={scenario.questions_count}
                        onChange={(e) => handleScenarioChange("questions_count", e.target.value)}
                      />
                    </div>
        </div>
      </div>
      
                {/* Description */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Description</h3>
                  <div className="space-y-4">
        <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
          <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Brief description (displayed in lists)"
                        maxLength="200"
                        value={scenario.short_description}
                        onChange={(e) => handleScenarioChange("short_description", e.target.value)}
          />
        </div>
        <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
        <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Detailed description of the scenario"
          rows="4"
          value={scenario.description}
                        onChange={(e) => handleScenarioChange("description", e.target.value)}
        ></textarea>
                    </div>
                  </div>
      </div>
      
                {/* Additional Settings */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Additional Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">File URL</label>
        <input
                        type="url"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Optional file attachment URL"
                        value={scenario.file_url}
                        onChange={(e) => handleScenarioChange("file_url", e.target.value)}
        />
      </div>
      
                    <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={scenario.is_active}
                          onChange={(e) => handleScenarioChange("is_active", e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Active (visible to users)</span>
        </label>
                      
        <label className="flex items-center">
          <input
            type="checkbox"
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={scenario.is_featured}
                          onChange={(e) => handleScenarioChange("is_featured", e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Featured (highlighted)</span>
        </label>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Tags</h3>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    {scenario.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {scenario.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm"
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
      
      <button
        onClick={handleAddScenario}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition flex items-center gap-2"
      >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <FaPlus />
                  )}
        Add Scenario
      </button>
    </div>
            )}

            {activeTab === "question" && (
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                  <BiCode className="text-green-500" />
                  Add Practice Question
                </h2>
                
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Scenario <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
    value={question.scenario_id}
                        onChange={(e) => handleQuestionChange("scenario_id", e.target.value)}
                      >
                        <option value="">Select a scenario</option>
    {scenarios.map((s) => (
      <option key={s.id} value={s.id}>
        {s.title}
      </option>
    ))}
          </select>
      </div>
      
        <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Order <span className="text-red-500">*</span>
                      </label>
          <input
            type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Order of this question"
                        min="0"
                        value={question.question_order}
                        onChange={(e) => handleQuestionChange("question_order", e.target.value)}
          />
        </div>
                    
        <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Points <span className="text-red-500">*</span>
                      </label>
          <input
            type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Points for this question"
                        min="1"
                        value={question.points}
                        onChange={(e) => handleQuestionChange("points", e.target.value)}
          />
        </div>
                  </div>
                </div>

                {/* Question Content */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Question Content</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Text <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Enter the question..."
                        rows="4"
                        value={question.question_text}
                        onChange={(e) => handleQuestionChange("question_text", e.target.value)}
                      ></textarea>
      </div>
      

      
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correct Answer <span className="text-red-500">*</span>
                      </label>
        <input
          type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Enter correct answer"
          value={question.correct_answer}
                        onChange={(e) => handleQuestionChange("correct_answer", e.target.value)}
        />
      </div>
      
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
        <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Explain why this is the correct answer..."
          rows="3"
          value={question.explanation}
                        onChange={(e) => handleQuestionChange("explanation", e.target.value)}
        ></textarea>
      </div>
                  </div>
          </div>
          
                
      
      <button
        onClick={handleAddQuestion}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition flex items-center gap-2"
      >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <FaPlus />
                  )}
        Add Question
      </button>
    </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeEditorPage;