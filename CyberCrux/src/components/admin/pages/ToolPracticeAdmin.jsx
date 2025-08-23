import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { BiBrain } from 'react-icons/bi';

const ToolPracticeAdmin = () => {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingScenario, setEditingScenario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTool, setFilterTool] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [availableTools, setAvailableTools] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    tool_name: '',
    scenario_title: '',
    scenario_description: '',
    difficulty: 'Easy',
    correct_command: '',
    command_pieces: '',
    explanation: '',
    is_active: true
  });

  useEffect(() => {
    fetchScenarios();
    fetchTools();
  }, []);

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/tool-practice/scenarios?admin=true');
      const data = await response.json();
      
      if (data.success) {
        setScenarios(data.data);
      } else {
        setError('Failed to load scenarios');
      }
    } catch (err) {
      setError('Error loading scenarios');
      console.error('Error fetching scenarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTools = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tools');
      const data = await response.json();
      
      console.log('Tools API response:', data);
      
      // The tools API returns an array directly, not {success: true, data: [...]}
      if (Array.isArray(data)) {
        const toolNames = [...new Set(data.map(tool => tool.name))];
        console.log('Available tool names:', toolNames);
        setAvailableTools(toolNames);
      } else {
        console.error('Unexpected tools API response format:', data);
      }
    } catch (err) {
      console.error('Error fetching tools:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Parse command pieces
      let parsedCommandPieces;
      try {
        parsedCommandPieces = JSON.parse(formData.command_pieces);
      } catch (err) {
        alert('Command pieces must be a valid JSON array (e.g., ["nmap", "-v", "10.10.10.10"])');
        return;
      }

      const url = editingScenario 
        ? `http://localhost:5000/api/tool-practice/scenarios/${editingScenario.id}`
        : 'http://localhost:5000/api/tool-practice/scenarios';
      
      const method = editingScenario ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          command_pieces: parsedCommandPieces
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShowModal(false);
        setEditingScenario(null);
        resetForm();
        fetchScenarios();
      } else {
        alert(data.message || 'Failed to save scenario');
      }
    } catch (err) {
      console.error('Error saving scenario:', err);
      alert('Error saving scenario');
    }
  };

  const handleEdit = (scenario) => {
    setEditingScenario(scenario);
    setFormData({
      tool_name: scenario.tool_name,
      scenario_title: scenario.scenario_title,
      scenario_description: scenario.scenario_description,
      difficulty: scenario.difficulty,
      correct_command: scenario.correct_command,
      command_pieces: JSON.stringify(scenario.command_pieces, null, 2),
      explanation: scenario.explanation || '',
      is_active: scenario.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scenario?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/tool-practice/scenarios/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        fetchScenarios();
      } else {
        alert(data.message || 'Failed to delete scenario');
      }
    } catch (err) {
      console.error('Error deleting scenario:', err);
      alert('Error deleting scenario');
    }
  };

  const resetForm = () => {
    setFormData({
      tool_name: '',
      scenario_title: '',
      scenario_description: '',
      difficulty: 'Easy',
      correct_command: '',
      command_pieces: '',
      explanation: '',
      is_active: true
    });
  };

  const openNewModal = () => {
    setEditingScenario(null);
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingScenario(null);
    resetForm();
  };

  // Filter scenarios
  const filteredScenarios = scenarios.filter(scenario => {
    const matchesSearch = scenario.scenario_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scenario.tool_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTool = !filterTool || scenario.tool_name === filterTool;
    const matchesDifficulty = !filterDifficulty || scenario.difficulty === filterDifficulty;
    
    return matchesSearch && matchesTool && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tool Practice Scenarios</h1>
          <p className="text-gray-600">Manage practice scenarios for cybersecurity tools</p>
        </div>
        <button
          onClick={openNewModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus className="w-4 h-4" />
          Add Scenario
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search scenarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tool</label>
            <select
              value={filterTool}
              onChange={(e) => setFilterTool(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Tools</option>
              {availableTools.map(tool => (
                <option key={tool} value={tool}>{tool}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterTool('');
                setFilterDifficulty('');
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <FaTimes className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Scenarios Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scenario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tool
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredScenarios.map((scenario) => (
                <tr key={scenario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {scenario.scenario_title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {scenario.scenario_description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{scenario.tool_name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(scenario.difficulty)}`}>
                      {scenario.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      scenario.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {scenario.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(scenario)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(scenario.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredScenarios.length === 0 && (
          <div className="text-center py-8">
            <BiBrain className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No scenarios found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {scenarios.length === 0 ? 'Get started by creating a new scenario.' : 'Try adjusting your filters.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingScenario ? 'Edit Scenario' : 'Add New Scenario'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tool Name *
                    </label>
                    <select
                      required
                      value={formData.tool_name}
                      onChange={(e) => setFormData({...formData, tool_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a tool</option>
                      {availableTools.map(tool => (
                        <option key={tool} value={tool}>{tool}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty *
                    </label>
                    <select
                      required
                      value={formData.difficulty}
                      onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scenario Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.scenario_title}
                    onChange={(e) => setFormData({...formData, scenario_title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Basic Port Scan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scenario Description *
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={formData.scenario_description}
                    onChange={(e) => setFormData({...formData, scenario_description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what the user needs to accomplish..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Command *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.correct_command}
                    onChange={(e) => setFormData({...formData, correct_command: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    placeholder="e.g., nmap -v 10.10.10.10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Command Pieces (JSON Array) *
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={formData.command_pieces}
                    onChange={(e) => setFormData({...formData, command_pieces: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    placeholder='["nmap", "-v", "10.10.10.10"]'
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter as JSON array. Each piece will be draggable in the game.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Explanation
                  </label>
                  <textarea
                    rows="3"
                    value={formData.explanation}
                    onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Explain why this command works..."
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingScenario ? 'Update Scenario' : 'Create Scenario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolPracticeAdmin; 