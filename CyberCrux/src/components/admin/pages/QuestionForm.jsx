import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaArrowLeft, FaSave, FaTrash } from "react-icons/fa";

export default function QuestionForm() {
  const navigate = useNavigate();
  const { scenarioId, questionId } = useParams();
  const location = useLocation();
  const isEditing = !!questionId;
  
  const [formData, setFormData] = useState({
    question_text: "",
    correct_answer: "",
    points: 1,
    explanation: "",
    question_order: 1
  });
  
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState(null);
  const [existingQuestions, setExistingQuestions] = useState([]);

  useEffect(() => {
    fetchScenario();
    fetchExistingQuestions();
    
    if (isEditing && location.state?.question) {
      setFormData(location.state.question);
    }
  }, [scenarioId, questionId, location.state]);

  // If editing and no question data in state, fetch the question data
  useEffect(() => {
    if (isEditing && questionId && !location.state?.question) {
      fetchQuestionData();
    }
  }, [isEditing, questionId, location.state]);

  const fetchScenario = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/practice/scenarios/${scenarioId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setScenario(data.data);
      }
    } catch (error) {
      console.error('Error fetching scenario:', error);
    }
  };

  const fetchExistingQuestions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions/scenario/${scenarioId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setExistingQuestions(data.data || []);
        // Set next order number for new questions
        if (!isEditing) {
          const maxOrder = Math.max(...data.data.map(q => q.question_order || 0), 0);
          setFormData(prev => ({ ...prev, question_order: maxOrder + 1 }));
        }
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchQuestionData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions/${questionId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setFormData(data.data);
      } else {
        console.error('Failed to fetch question data:', data.message);
        alert('Failed to load question data. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching question data:', error);
      alert('Error loading question data. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'points' || name === 'question_order' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing 
        ? `http://localhost:5000/api/questions/${questionId}`
        : 'http://localhost:5000/api/questions';
      
      const method = isEditing ? 'PUT' : 'POST';
      const body = { ...formData, scenario_id: parseInt(scenarioId) };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        alert(isEditing ? "Question updated successfully!" : "Question added successfully!");
        navigate(`/admin/practice`);
      } else {
        alert("Failed to save question: " + data.message);
      }
    } catch (error) {
      console.error('Error saving question:', error);
      alert("An error occurred while saving the question.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    
    if (window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      try {
        const response = await fetch(`http://localhost:5000/api/questions/${questionId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
          alert("Question deleted successfully!");
          navigate(`/admin/practice`);
        } else {
          alert("Failed to delete question: " + data.message);
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        alert("An error occurred while deleting the question.");
      }
    }
  };

  if (!scenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/admin/practice`)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
            >
              <FaArrowLeft /> Back to Practice Admin
            </button>
            <div className="h-6 w-px bg-gray-600"></div>
            <div>
              <h1 className="text-3xl font-bold">
                {isEditing ? 'Edit Question' : 'Add New Question'}
              </h1>
              <p className="text-gray-300 mt-1">
                {scenario.title}
              </p>
            </div>
          </div>
          
          {isEditing && (
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              <FaTrash /> Delete Question
            </button>
          )}
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Question Text */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Question Text *
                </label>
                <textarea
                  name="question_text"
                  value={formData.question_text}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter the question text..."
                />
              </div>

              {/* Correct Answer */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Correct Answer *
                </label>
                <textarea
                  name="correct_answer"
                  value={formData.correct_answer}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter the correct answer..."
                />
              </div>

              {/* Points */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Points *
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Points for this question"
                />
              </div>

              {/* Question Order */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Question Order *
                </label>
                <input
                  type="number"
                  name="question_order"
                  value={formData.question_order}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Order in scenario"
                />
              </div>

              {/* Explanation */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Explanation (Optional)
                </label>
                <textarea
                  name="explanation"
                  value={formData.explanation}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Explain why this is the correct answer..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(`/admin/practice`)}
                className="px-6 py-3 text-gray-300 hover:text-white font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition ${
                  loading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <FaSave />
                {loading ? 'Saving...' : (isEditing ? 'Update Question' : 'Add Question')}
              </button>
            </div>
          </form>

          {/* Existing Questions Preview */}
          {existingQuestions.length > 0 && (
            <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4">Current Questions in This Scenario</h3>
              <div className="space-y-3">
                {existingQuestions
                  .sort((a, b) => (a.question_order || 0) - (b.question_order || 0))
                  .map((question, index) => (
                    <div key={question.id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full font-medium">
                          Q{question.question_order || index + 1}
                        </span>
                        <span className="text-white font-medium">
                          {question.question_text.length > 60 
                            ? question.question_text.substring(0, 60) + '...' 
                            : question.question_text
                          }
                        </span>
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          {question.points} pts
                        </span>
                      </div>
                      {isEditing && question.id === parseInt(questionId) && (
                        <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                          Currently Editing
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
