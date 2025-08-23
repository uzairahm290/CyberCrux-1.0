import React, { useState, useEffect } from "react";
import { FaUserEdit, FaUser, FaLock, FaTrash, FaSave, FaTimes, FaCamera, FaGlobe, FaMapMarkerAlt , FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import DashNav from "./DashNav";
import Footer from "./Footer";
import CountryFlag from "./CountryFlag";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.profile_pic || "/logo192.png");
  const [formData, setFormData] = useState({
    username: user?.username || "",
    fullName: user?.FullName || "",
    profile_pic: user?.profile_pic || "",
    country: user?.country || "",
    description: user?.description || "",
    linkedin_url: user?.linkedin_url || "",
    github_url: user?.github_url || ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  // Custom alert state
  const [customAlert, setCustomAlert] = useState({
    show: false,
    type: 'success', // 'success', 'error', 'warning', 'info'
    message: '',
    title: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/profile', {
          credentials: 'include'
        });
        console.log('Fetch profile response status:', response.status);
        const data = await response.json();
        console.log('Fetch profile data:', data);
        
        if (data.success) {
          const userData = data.user;
          setFormData({
            username: userData.username || "",
            fullName: userData.fullName || "",
            profile_pic: userData.profilePicture || "",
            country: userData.country || "",
            description: userData.description || "",
            linkedin_url: userData.linkedinUrl || "",
            github_url: userData.githubUrl || ""
          });
          setProfilePic(userData.profilePicture || "/logo192.png");
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to user context data
        if (user) {
                  setFormData(prev => ({
          ...prev,
          username: user.username || "",
          fullName: user.FullName || "",
          profile_pic: user.profile_pic || ""
        }));
          setProfilePic(user.profile_pic || "/logo192.png");
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setFormData(prev => ({ ...prev, profile_pic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Custom alert functions
  const showAlert = (type, title, message) => {
    setCustomAlert({
      show: true,
      type,
      title,
      message
    });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setCustomAlert(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const hideAlert = () => {
    setCustomAlert(prev => ({ ...prev, show: false }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      console.log('Updating profile with data:', {
        username: formData.username,
        fullName: formData.fullName,
        profilePicture: formData.profile_pic,
        country: formData.country,
        description: formData.description,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url
      });
      
      const requestBody = {
        username: formData.username,
        fullName: formData.fullName,
        profilePicture: formData.profile_pic,
        country: formData.country,
        description: formData.description,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url
      };
      
      console.log('Request body being sent:', requestBody);
      
      const res = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });
      
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setIsEditing(false);
        showAlert('success', '', 'Profile updated successfully!');
      } else {
        showAlert('error', '', data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showAlert('error', '', 'Error updating profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Password strength validation for new password
    if (name === 'newPassword') {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
      });
    }
  };

  const handleChangePassword = async () => {
    // Password strength validation
    const isPasswordStrong = Object.values(passwordStrength).every(Boolean);
    if (!isPasswordStrong) {
              showAlert('error', '', 'Password must meet all strength requirements');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
              showAlert('error', '', 'New passwords do not match!');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        showAlert('success', '', 'Password changed successfully!');
      } else {
        showAlert('error', '', data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    showAlert('warning', '', 'Are you sure you want to delete your account? This action cannot be undone.');
    setShowConfirmModal(true);
  };

  const confirmDeleteAccount = async () => {
    setShowConfirmModal(false);
    setIsDeleting(true);
    try {
      const res = await fetch('http://localhost:5000/api/user/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      const data = await res.json();
      if (data.success) {
        showAlert('success', '', 'Account deleted successfully');
        setTimeout(() => {
          logout();
          navigate('/');
        }, 2000);
      } else {
        showAlert('error', '', data.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white flex flex-col">
      {/* Custom Alert - Minimal Notification Style */}
      {customAlert.show && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full">
          <div className={`transform transition-all duration-500 ease-out ${
            customAlert.show ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
          }`}>
            <div className={`rounded-2xl shadow-2xl border backdrop-blur-xl ${
              customAlert.type === 'success' ? 'bg-green-500/90 border-green-400/50 text-white' :
              customAlert.type === 'error' ? 'bg-red-500/90 border-red-400/50 text-white' :
              customAlert.type === 'warning' ? 'bg-yellow-500/90 border-yellow-400/50 text-white' :
              'bg-blue-500/90 border-blue-400/50 text-white'
            }`}>
              <div className="flex items-center p-4">
                <div className="flex-shrink-0">
                  {customAlert.type === 'success' && <FaCheckCircle className="h-5 w-5 text-green-100" />}
                  {customAlert.type === 'error' && <FaExclamationTriangle className="h-5 w-5 text-red-100" />}
                  {customAlert.type === 'warning' && <FaExclamationTriangle className="h-5 w-5 text-yellow-100" />}
                  {customAlert.type === 'info' && <FaInfoCircle className="h-5 w-5 text-blue-100" />}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium">{customAlert.message}</p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <button
                    onClick={hideAlert}
                    className="inline-flex text-white/80 hover:text-white focus:outline-none transition-colors p-1 rounded-full hover:bg-white/20"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <DashNav />
      <main className="flex flex-col">
        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row gap-8 p-6 mt-16 mb-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4 w-full">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold mb-6 text-center">Settings</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setActive("profile")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-300 font-medium
                    ${active === "profile"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  <span className="text-lg"><FaUser /></span> Profile
                </button>
              <button
                  onClick={() => setActive("account")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-300 font-medium
                    ${active === "account"
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                      }
                `}
              >
                  <span className="text-lg"><FaLock /></span> Password
              </button>
              <button
                onClick={() => setActive("danger")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-300 font-medium
                  ${active === "danger"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                  }
                `}
              >
                <span className="text-lg"><FaTrash /></span> Danger Zone
              </button>
              </div>
            </div>
          </aside>
          {/* Main Section */}
          <section className="flex-1 space-y-6">
            {/* Profile Settings */}
            {active === "profile" && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <FaUser className="text-blue-400" /> Profile Settings
                  </h2>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isEditing 
                        ? "bg-gray-600 hover:bg-gray-700 text-white" 
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <FaTimes /> : <FaUserEdit />}
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>
                {isEditing ? (
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img 
                          src={profilePic}
                          alt="Profile" 
                          className="w-24 h-24 rounded-full border-4 border-blue-400 object-cover" 
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePicChange}
                          className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                          style={{ zIndex: 2 }}
                        />
                        <button className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition-all duration-300 pointer-events-none">
                          <FaCamera className="w-4 h-4" />
                        </button>
                      </div>
                    <div>
                        <h3 className="font-semibold text-lg">{formData.username || "User"}</h3>
                        <p className="text-gray-400">Update your profile picture</p>
                      </div>
                    </div>
                    {/* Full Name and Username in one line */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input 
                          type="text" 
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleFormChange}
                          placeholder="Enter your full name"
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Username</label>
                        <input 
                          type="text" 
                          name="username"
                          value={formData.username}
                          onChange={handleFormChange}
                          placeholder="Enter your username"
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                        />
                        <p className="text-gray-400 text-xs mt-1">Username must be unique and contain no spaces</p>
                      </div>
                    </div>
                    
                    {/* Country and Email in one line */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Country</label>
                        <input 
                          type="text" 
                          name="country"
                          value={formData.country}
                          onChange={handleFormChange}
                          placeholder="e.g., United States, Pakistan, India"
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input 
                          type="email" 
                          name="email"
                          value={user?.email || ""}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 cursor-not-allowed opacity-60" 
                          disabled
                        />
                        <p className="text-gray-400 text-xs mt-1">Email cannot be changed</p>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        placeholder="Tell others about yourself..."
                        rows="3"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none" 
                      />
                    </div>
                    
                    {/* LinkedIn and GitHub in one line */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className=" text-sm font-medium mb-2 flex items-center gap-2">
                          <FaLinkedin className="text-blue-500" />
                          LinkedIn
                        </label>
                        <input 
                          type="text" 
                          name="linkedin_username"
                          value={formData.linkedin_url ? formData.linkedin_url.replace('https://www.linkedin.com/in/', '') : ''}
                          onChange={(e) => {
                            const username = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              linkedin_url: username ? `https://www.linkedin.com/in/${username}` : ''
                            }));
                          }}
                          placeholder="username"
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                        />
                      </div>
                      
                      <div>
                        <label className=" text-sm font-medium mb-2 flex items-center gap-2">
                          <FaGithub className="text-gray-300" />
                          GitHub
                        </label>
                        <input 
                          type="text" 
                          name="github_username"
                          value={formData.github_url ? formData.github_url.replace('https://github.com/', '') : ''}
                          onChange={(e) => {
                            const username = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              github_url: username ? `https://github.com/${username}` : ''
                            }));
                          }}
                          placeholder="username"
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                        />
                      </div>
                    </div>
                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                      <button 
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <FaSave className="animate-spin" /> : <FaSave />}
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <img 
                        src={profilePic}
                        alt="Profile" 
                        className="w-24 h-24 rounded-full border-4 border-blue-400 object-cover" 
                      />
                    <div className="flex-1">
                        <h3 className="font-bold text-xl">{formData.username}</h3>
                        {formData.country && (
                          <p className="text-gray-400 flex items-center gap-2 mt-1">
                          <CountryFlag 
                          country={formData.country} 
                          size="16px" 
                          height="16px"
                          title={formData.country}
                        />
                        {formData.country}
                          </p>
                        )}
                        {formData.description && (
                          <p className="text-gray-300 mt-2">{formData.description}</p>
                        )}
                    </div>
                    </div>
                    
                    {/* Social Links */}
                    {(formData.linkedin_url || formData.github_url) && (
                      <div className="bg-white/5 rounded-xl p-4">
                        <h4 className="font-semibold mb-3">Social Links</h4>
                        <div className="flex gap-4">
                          {formData.linkedin_url && (
                            <a 
                              href={formData.linkedin_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all duration-300"
                            >
                            <FaLinkedin className="text-grey-500" /> LinkedIn
                            </a>
                          )}
                          {formData.github_url && (
                            <a 
                              href={formData.github_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-all duration-300"
                            >
                              <FaGithub className="text-gray-300" /> GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {/* Password Settings */}
            {active === "account" && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                  <FaLock className="text-blue-400" /> Change Password
                </h2>
                <div className="space-y-8">
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="relative">
                        <input 
                          type={showPasswords.current ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="Current Password" 
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 hover:scale-110 transition-all duration-200 p-1 rounded-full hover:bg-white/10"
                        >
                          {showPasswords.current ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      <div className="relative">
                        <input 
                          type={showPasswords.new ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          onFocus={() => setShowPasswordHint(true)}
                          onBlur={() => setShowPasswordHint(false)}
                          placeholder="New Password" 
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 hover:scale-110 transition-all duration-200 p-1 rounded-full hover:bg-white/10"
                        >
                          {showPasswords.new ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="relative mb-4">
                      <input 
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm New Password" 
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 hover:scale-110 transition-all duration-200 p-1 rounded-full hover:bg-white/10"
                      >
                        {showPasswords.confirm ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                    <button 
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Danger Zone */}
            {active === "danger" && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                  <FaTrash className="text-red-400" /> Danger Zone
                </h2>
                <div className="space-y-8">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-red-400">Delete Account</h3>
                    <p className="text-gray-300 mb-6">
                      Once you delete your account, there is no going back. Please be certain.
                      This will permanently remove all your data including practice progress, badges, and profile information.
                    </p>
                    
                    <div className="space-y-4">
                      <button 
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isDeleting ? "Deleting Account..." : "Delete Account"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      
      {/* Delete Account Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <FaTrash className="w-8 h-8 text-red-400" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">Delete Account</h3>
              
              <div className="text-gray-300 mb-6 text-left space-y-2">
                <p className="text-sm">Are you absolutely sure you want to delete your account?</p>
                <p className="text-xs text-gray-400">This action cannot be undone and will permanently remove:</p>
                <ul className="text-xs text-gray-400 ml-4 space-y-1">
                  <li>• All practice progress</li>
                  <li>• Badges earned</li>
                  <li>• Streaks and statistics</li>
                  <li>• Profile information</li>
                </ul>
                <p className="text-xs text-red-400 font-medium mt-2">This action is irreversible!</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-xl font-medium transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAccount}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
