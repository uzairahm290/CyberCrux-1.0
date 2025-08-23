import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaEye, FaEyeSlash, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { BiCategory, BiTime, BiTargetLock, BiDiamond } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function PracticeAdmin() {
  const [search, setSearch] = useState("");
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [categories, setCategories] = useState([]);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchScenarios();
    fetchCategories();
  }, []);

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/practice/scenarios", {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setScenarios(data.data);
      } else {
        console.error("Failed to fetch scenarios:", data.message);
      }
    } catch (error) {
      console.error("Error fetching scenarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/practice/categories", {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Set default categories if API is not available
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

  // Filter scenarios based on search and filters
  const filtered = scenarios.filter(scenario => {
    const matchesSearch = scenario.title.toLowerCase().includes(search.toLowerCase()) ||
                         (scenario.description && scenario.description.toLowerCase().includes(search.toLowerCase())) ||
                         (scenario.short_description && scenario.short_description.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = filterCategory === "all" || scenario.category === filterCategory;
    const matchesDifficulty = filterDifficulty === "all" || scenario.difficulty === filterDifficulty;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && scenario.is_active) ||
                         (filterStatus === "inactive" && !scenario.is_active);
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  });

  const handleAdd = () => {
    navigate("/admin/practice/new");
  };

  const handleEdit = (scenario) => {
    console.log("Editing scenario:", scenario);
    console.log("Scenario ID:", scenario.id);
    console.log("Scenario title:", scenario.title);
    navigate(`/admin/practice/edit/${scenario.id}`, { state: { scenario } });
  };

  const handleView = (scenario) => {
    navigate(`/admin/practice/view/${scenario.id}`, { state: { scenario } });
  };

  const handleManageQuestions = async (scenario) => {
    setSelectedScenario(scenario);
    setShowQuestionsModal(true);
    await fetchQuestions(scenario.id);
  };

  const fetchQuestions = async (scenarioId) => {
    try {
      setQuestionsLoading(true);
      const response = await fetch(`http://localhost:5000/api/questions/scenario/${scenarioId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setQuestions(data.data || []);
      } else {
        console.error('Failed to fetch questions:', data.message);
        setQuestions([]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      try {
        const response = await fetch(`http://localhost:5000/api/questions/${questionId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Refresh questions list
          await fetchQuestions(selectedScenario.id);
          alert("Question deleted successfully!");
        } else {
          alert("Failed to delete question: " + data.message);
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        alert("An error occurred while deleting the question.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this scenario? This action cannot be undone.")) {
      try {
        const res = await fetch(`http://localhost:5000/api/practice/scenarios/${id}`, {
          method: "DELETE",
          credentials: 'include'
        });
  
        const result = await res.json();
        if (result.success) {
          fetchScenarios(); // Refresh the list after successful deletion
          alert("Scenario deleted successfully!");
        } else {
          console.error("Failed to delete scenario:", result.message);
          alert("Failed to delete scenario: " + result.message);
        }
      } catch (error) {
        console.error("Error deleting scenario:", error);
        alert("An error occurred while deleting the scenario.");
      }
    }
  };
  
  const toggleActiveStatus = async (scenario) => {
    try {
      const res = await fetch(`http://localhost:5000/api/practice/scenarios/${scenario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          ...scenario,
          is_active: !scenario.is_active,
        }),
      });

      const result = await res.json();
      if (result.success) {
        fetchScenarios(); // Refresh the list
        alert(`Scenario ${scenario.is_active ? 'deactivated' : 'activated'} successfully!`);
      } else {
        alert("Failed to update scenario status: " + result.message);
      }
    } catch (error) {
      console.error("Error updating scenario status:", error);
      alert("An error occurred while updating the scenario status.");
    }
  };

  const toggleFeaturedStatus = async (scenario) => {
    try {
      const res = await fetch(`http://localhost:5000/api/practice/scenarios/${scenario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          ...scenario,
          is_featured: !scenario.is_featured,
        }),
      });

      const result = await res.json();
      if (result.success) {
        fetchScenarios(); // Refresh the list
        alert(`Scenario ${scenario.is_featured ? 'unfeatured' : 'featured'} successfully!`);
      } else {
        alert("Failed to update featured status: " + result.message);
      }
    } catch (error) {
      console.error("Error updating featured status:", error);
      alert("An error occurred while updating the featured status.");
    }
  };



  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-green-100 text-green-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ];
    const index = category?.charCodeAt(0) % colors.length;
    return colors[index] || colors[0];
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-1 text-blue-800">Practice Scenarios Management</h2>
          <p className="text-gray-500">Manage practice scenarios, questions, and learning resources.</p>
        </div>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold shadow transition"
          onClick={handleAdd}
        >
          <FaPlus /> Add New Scenario
        </button>
        <button
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold shadow transition"
          onClick={() => {
            if (scenarios.length > 0) {
              const firstScenario = scenarios[0];
              console.log("Testing edit with first scenario:", firstScenario);
              handleEdit(firstScenario);
            } else {
              alert("No scenarios available to test edit");
            }
          }}
        >
          Test Edit
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="pl-10 pr-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 w-full bg-white shadow-sm"
            placeholder="Search scenarios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <select
          className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.key_name} value={cat.key_name}>
              {cat.label}
            </option>
          ))}
        </select>

        <select
          className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
        >
          <option value="all">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <BiCategory className="text-blue-600 text-xl" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Scenarios</p>
              <p className="text-2xl font-bold text-blue-800">{scenarios.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <FaEye className="text-green-600 text-xl" />
            <div>
              <p className="text-sm text-green-600 font-medium">Active Scenarios</p>
              <p className="text-2xl font-bold text-green-800">
                {scenarios.filter(s => s.is_active).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2">
            <FaStar className="text-purple-600 text-xl" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Featured</p>
              <p className="text-2xl font-bold text-purple-800">
                {scenarios.filter(s => s.is_featured).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2">
            <BiDiamond className="text-orange-600 text-xl" />
            <div>
              <p className="text-sm text-orange-600 font-medium">Total Points</p>
              <p className="text-2xl font-bold text-orange-800">
                {scenarios.reduce((sum, s) => sum + (s.points || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-blue-50 text-blue-900 text-left">
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Difficulty</th>
              <th className="p-4 font-semibold text-center">Points</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((scenario) => (
              <tr key={scenario.id} className="border-b hover:bg-blue-50 transition">
                <td className="p-4">
                  <div>
                    <div className="font-medium text-blue-800">{scenario.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {scenario.short_description || scenario.description || "No description"}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <BiTime className="w-3 h-3" />
                      {scenario.time_estimate || "N/A"} min
                      <BiTargetLock className="w-3 h-3" />
                      {scenario.questions_count || 0} questions
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(scenario.category)}`}>
                    {scenario.category}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                    {scenario.difficulty}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <BiDiamond className="text-blue-500 w-4 h-4" />
                    <span className="font-semibold">{scenario.points}</span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => toggleActiveStatus(scenario)}
                      className={`px-2 py-1 rounded text-xs font-medium transition ${
                        scenario.is_active 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                      title={scenario.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {scenario.is_active ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    <button
                      onClick={() => toggleFeaturedStatus(scenario)}
                      className={`px-2 py-1 rounded text-xs font-medium transition ${
                        scenario.is_featured 
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      title={scenario.is_featured ? 'Unfeature' : 'Feature'}
                    >
                      {scenario.is_featured ? <FaStar /> : <FaStarHalfAlt />}
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2 justify-center">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition p-2 rounded hover:bg-blue-50"
                      title="View Details"
                      onClick={() => handleView(scenario)}
                    >
                      <FaEye />
                    </button>
                  <button
                      className="text-green-500 hover:text-green-700 transition p-2 rounded hover:bg-green-50"
                    title="Edit"
                    onClick={() => handleEdit(scenario)}
                  >
                    <FaEdit />
                  </button>
                  <button
                      className="text-purple-500 hover:text-purple-700 transition p-2 rounded hover:bg-purple-50"
                      title="Manage Questions"
                      onClick={() => handleManageQuestions(scenario)}
                  >
                    <BiTargetLock />
                  </button>
                  <button
                      className="text-red-500 hover:text-red-700 transition p-2 rounded hover:bg-red-50"
                    title="Delete"
                    onClick={() => handleDelete(scenario.id)}
                  >
                    <FaTrash />
                  </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  {loading ? "Loading scenarios..." : "No scenarios found matching your criteria."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Questions Management Modal */}
      {showQuestionsModal && selectedScenario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Manage Questions</h2>
                  <p className="text-blue-100 mt-1">
                    {selectedScenario.title} - {questions.length} questions
                  </p>
                </div>
                <button
                  onClick={() => setShowQuestionsModal(false)}
                  className="text-white hover:text-blue-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Add New Question Button */}
              <div className="mb-6">
                <button
                  onClick={() => navigate(`/admin/practice/${selectedScenario.id}/questions/new`)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
                >
                  <FaPlus /> Add New Question
                </button>
              </div>

              {/* Questions List */}
              {questionsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading questions...</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BiTargetLock className="text-4xl mx-auto mb-2 text-gray-300" />
                  <p>No questions found for this scenario.</p>
                  <p className="text-sm">Click "Add New Question" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                              Q{index + 1}
                            </span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                              {question.points} pts
                            </span>
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                              Order: {question.question_order}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900 mb-2">{question.question_text}</p>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Answer:</strong> {question.correct_answer}
                          </p>
                          {question.explanation && (
                            <p className="text-sm text-gray-600">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => navigate(`/admin/practice/${selectedScenario.id}/questions/edit/${question.id}`, {
                              state: { question: question }
                            })}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition"
                            title="Edit Question"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition"
                            title="Delete Question"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowQuestionsModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
