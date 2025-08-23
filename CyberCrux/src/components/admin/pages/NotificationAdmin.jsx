import React, { useState } from 'react';
import { FaBell, FaPaperPlane, FaCheckCircle, FaTimes } from 'react-icons/fa';

const NotificationAdmin = () => {
  const [formData, setFormData] = useState({
    type: 'system',
    title: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const notificationTypes = [
    { value: 'system', label: 'System Update', icon: '🔧' },
    { value: 'achievement', label: 'Achievement', icon: '🏆' },
    { value: 'scenario', label: 'Scenario', icon: '🎯' },
    { value: 'badge', label: 'Badge', icon: '⭐' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in both title and message');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/admin/notifications/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(`Notification sent successfully to ${data.usersNotified} users!`);
        setFormData({
          type: 'system',
          title: '',
          message: ''
        });
      } else {
        setErrorMessage(data.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1 text-blue-800">Broadcast Notifications</h2>
          <p className="text-gray-500">Send notifications to all users on the platform.</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaTimes className="text-red-500" />
              {errorMessage}
            </div>
            <button onClick={clearMessages} className="text-red-500 hover:text-red-700">
              <FaTimes />
            </button>
          </div>
        )}

        {/* Notification Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Notification Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                required
              >
                {notificationTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Enter notification title"
                required
                maxLength={100}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Enter notification message"
                rows={4}
                required
                maxLength={500}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.message.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaPaperPlane />
                  Send Notification to All Users
                </>
              )}
            </button>
          </form>
        </div>

        {/* Information Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FaBell className="text-blue-500 text-xl mt-1" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">How it works</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• <strong>System:</strong> Platform updates, maintenance, new features</li>
                <li>• <strong>Achievement:</strong> Milestones, competitions, special events</li>
                <li>• <strong>Scenario:</strong> New practice scenarios, challenges</li>
                <li>• <strong>Badge:</strong> New badges, special achievements</li>
              </ul>
              <p className="text-blue-600 text-xs mt-2">
                Notifications will be sent to all active users and appear in their notification center.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationAdmin;