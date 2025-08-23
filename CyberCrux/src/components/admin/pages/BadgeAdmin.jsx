import React, { useState, useEffect } from 'react';
import { FaMedal, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaImage, FaCheck, FaCrown } from 'react-icons/fa';

const BadgeAdmin = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    badge_type: 'achievement',
    criteria: '',
    points_required: 0,
    is_active: true
  });

  // Badge type options
  const badgeTypes = [
    { value: 'achievement', label: 'Achievement' },
    { value: 'streak', label: 'Streak' },
    { value: 'practice', label: 'Practice' },
    { value: 'level', label: 'Level' },
    { value: 'special', label: 'Special' }
  ];

  // Fetch all badges
  const fetchBadges = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/badges', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setBadges(data.badges);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      badge_type: 'achievement',
      criteria: '',
      points_required: 0,
      is_active: true
    });
    setEditingBadge(null);
    setShowCreateForm(false);
  };

  // Handle create badge
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/badges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          criteria: formData.criteria ? JSON.parse(formData.criteria) : {}
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchBadges();
        resetForm();
        alert('Badge created successfully!');
      } else {
        alert('Error creating badge: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating badge:', error);
      alert('Error creating badge');
    }
  };

  // Handle edit badge
  const handleEdit = (badge) => {
    setEditingBadge(badge.id);
    setFormData({
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      badge_type: badge.badge_type,
      criteria: JSON.stringify(badge.criteria, null, 2),
      points_required: badge.points_reward || badge.points_required || 0, // Handle both field names
      is_active: badge.is_active
    });
    setShowCreateForm(true);
  };

  // Handle update badge
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/admin/badges/${editingBadge}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          criteria: formData.criteria ? JSON.parse(formData.criteria) : {}
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchBadges();
        resetForm();
        alert('Badge updated successfully!');
      } else {
        alert('Error updating badge: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating badge:', error);
      alert('Error updating badge');
    }
  };

  // Handle delete badge
  const handleDelete = async (badgeId) => {
    if (!confirm('Are you sure you want to delete this badge?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/badges/${badgeId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        fetchBadges();
        alert('Badge deleted successfully!');
      } else {
        alert('Error deleting badge: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting badge:', error);
      alert('Error deleting badge');
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (badgeId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/badges/${badgeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          is_active: !currentStatus
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchBadges();
      } else {
        alert('Error updating badge status: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating badge status:', error);
      alert('Error updating badge status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FaMedal className="text-2xl text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-800">Badge Management</h1>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus /> Create Badge
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingBadge ? 'Edit Badge' : 'Create New Badge'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={editingBadge ? handleUpdate : handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Badge Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Badge Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Badge Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Badge Type
                </label>
                <select
                  name="badge_type"
                  value={formData.badge_type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {badgeTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Icon URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon URL
                </label>
                <input
                  type="url"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/badge-icon.png"
                  required
                />
              </div>

              {/* Points Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points Required
                </label>
                <input
                  type="number"
                  name="points_required"
                  value={formData.points_required}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>

            {/* Criteria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Criteria (JSON)
              </label>
              <textarea
                name="criteria"
                value={formData.criteria}
                onChange={handleInputChange}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder='{"type": "streak", "days": 7}'
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter badge criteria as JSON. Example: {"{"}"type": "streak", "days": 7{"}"}
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                Active Badge
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaSave /> {editingBadge ? 'Update Badge' : 'Create Badge'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Badges List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            All Badges ({badges.length})
          </h2>
        </div>

        {badges.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaMedal className="text-4xl mx-auto mb-4 text-gray-300" />
            <p>No badges found. Create your first badge!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Badge
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
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
                {badges.map((badge) => (
                  <tr key={badge.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {badge.icon ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={badge.icon}
                              alt={badge.name}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className="h-12 w-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center"
                            style={{ display: badge.icon ? 'none' : 'flex' }}
                          >
                            <FaMedal className="text-white text-xl" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {badge.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {badge.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        badge.badge_type === 'achievement' ? 'bg-blue-100 text-blue-800' :
                        badge.badge_type === 'streak' ? 'bg-orange-100 text-orange-800' :
                        badge.badge_type === 'practice' ? 'bg-green-100 text-green-800' :
                        badge.badge_type === 'level' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {badge.badge_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {badge.points_reward || badge.points_required || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(badge.id, badge.is_active)}
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                          badge.is_active 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } transition-colors`}
                      >
                        {badge.is_active ? (
                          <>
                            <FaCheck className="mr-1" /> Active
                          </>
                        ) : (
                          <>
                            <FaTimes className="mr-1" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(badge)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Edit Badge"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(badge.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete Badge"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeAdmin;
