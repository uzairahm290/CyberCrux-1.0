import React, { useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaLink, FaBook, FaVideo, FaCode, FaSearch, FaTerminal, FaCollection } from 'react-icons/fa';

export default function LearningResourcesEditor({ resources = [], onSave, onCancel }) {
  const [editingResources, setEditingResources] = useState([...resources]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newResource, setNewResource] = useState({
    title: '',
    url: '',
    type: 'guide',
    description: ''
  });

  const resourceTypes = [
    { value: 'guide', label: 'Guide', icon: <FaBook /> },
    { value: 'course', label: 'Course', icon: <FaVideo /> },
    { value: 'tool', label: 'Tool', icon: <FaCode /> },
    { value: 'reference', label: 'Reference', icon: <FaLink /> },
    { value: 'practice', label: 'Practice', icon: <FaTerminal /> },
    { value: 'collection', label: 'Collection', icon: <FaSearch /> }
  ];

  const handleAddResource = () => {
    if (newResource.title && newResource.url) {
      setEditingResources([...editingResources, { ...newResource }]);
      setNewResource({ title: '', url: '', type: 'guide', description: '' });
    }
  };

  const handleEditResource = (index) => {
    setEditingIndex(index);
  };

  const handleSaveResource = (index) => {
    setEditingIndex(null);
  };

  const handleDeleteResource = (index) => {
    const updatedResources = editingResources.filter((_, i) => i !== index);
    setEditingResources(updatedResources);
  };

  const handleUpdateResource = (index, field, value) => {
    const updatedResources = [...editingResources];
    updatedResources[index] = { ...updatedResources[index], [field]: value };
    setEditingResources(updatedResources);
  };

  const handleSave = () => {
    onSave(editingResources);
  };

  const getTypeIcon = (type) => {
    const resourceType = resourceTypes.find(t => t.value === type);
    return resourceType ? resourceType.icon : <FaLink />;
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Learning Resources</h3>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaSave /> Save Resources
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </div>

      {/* Add New Resource */}
      <div className="bg-white/5 rounded-xl p-4 mb-6">
        <h4 className="font-semibold mb-4">Add New Resource</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Resource Title"
            value={newResource.title}
            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            placeholder="Resource URL"
            value={newResource.url}
            onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newResource.type}
            onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {resourceTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <button
            onClick={handleAddResource}
            disabled={!newResource.title || !newResource.url}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus /> Add
          </button>
        </div>
        <textarea
          placeholder="Resource Description (optional)"
          value={newResource.description}
          onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
          className="w-full mt-3 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows="2"
        />
      </div>

      {/* Existing Resources */}
      <div className="space-y-4">
        <h4 className="font-semibold">Current Resources ({editingResources.length})</h4>
        {editingResources.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FaLink className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No learning resources added yet.</p>
            <p className="text-sm">Add resources to help students continue learning after completing this scenario.</p>
          </div>
        ) : (
          editingResources.map((resource, index) => (
            <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                  {getTypeIcon(resource.type)}
                </div>
                
                <div className="flex-1">
                  {editingIndex === index ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={resource.title}
                        onChange={(e) => handleUpdateResource(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="url"
                        value={resource.url}
                        onChange={(e) => handleUpdateResource(index, 'url', e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={resource.type}
                        onChange={(e) => handleUpdateResource(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {resourceTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                      <textarea
                        value={resource.description}
                        onChange={(e) => handleUpdateResource(index, 'description', e.target.value)}
                        placeholder="Resource description"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows="2"
                      />
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold">{resource.title}</h5>
                        <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300 capitalize">
                          {resource.type}
                        </span>
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm break-all"
                      >
                        {resource.url}
                      </a>
                      {resource.description && (
                        <p className="text-gray-400 text-sm mt-2">{resource.description}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {editingIndex === index ? (
                    <button
                      onClick={() => handleSaveResource(index)}
                      className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      title="Save changes"
                    >
                      <FaSave />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditResource(index)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      title="Edit resource"
                    >
                      <FaEdit />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteResource(index)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    title="Delete resource"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resource Type Legend */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h5 className="font-semibold mb-3">Resource Types</h5>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {resourceTypes.map(type => (
            <div key={type.value} className="flex items-center gap-2 text-sm">
              <div className="p-1 bg-blue-500/20 rounded text-blue-400">
                {type.icon}
              </div>
              <span className="text-gray-300">{type.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
