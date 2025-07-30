import React, { useState, useEffect } from "react";
import {
  FaUserEdit, 
  FaUser, 
  FaLock, 
  FaTrash, 
  FaSave, 
  FaTimes,
  FaGlobe,
  FaEdit,
  FaCamera,
  FaLinkedinIn,
  FaTwitter,
  FaGithub,
  FaDiscord,
  FaInstagram,
  FaYoutube,
  FaFacebookF
} from "react-icons/fa";
import { MdOutlineEmail, MdOutlineBiotech } from "react-icons/md";
import { BiWorld } from "react-icons/bi";
import { useAuth } from '../AuthContext';
import DashNav from "./DashNav";
import Footer from "./Footer";

const socialPlatforms = [
  { key: 'linkedin', label: 'LinkedIn', icon: <FaLinkedinIn />, color: 'text-blue-500' },
  { key: 'twitter', label: 'Twitter', icon: <FaTwitter />, color: 'text-blue-400' },
  { key: 'github', label: 'GitHub', icon: <FaGithub />, color: 'text-gray-300' },
  { key: 'discord', label: 'Discord', icon: <FaDiscord />, color: 'text-indigo-400' },
  { key: 'instagram', label: 'Instagram', icon: <FaInstagram />, color: 'text-pink-500' },
  { key: 'youtube', label: 'YouTube', icon: <FaYoutube />, color: 'text-red-500' },
  { key: 'facebook', label: 'Facebook', icon: <FaFacebookF />, color: 'text-blue-600' },
  { key: 'website', label: 'Website', icon: <BiWorld />, color: 'text-green-400' }
];

const options = [
  { key: "profile", label: "Profile", icon: <FaUser /> },
  { key: "account", label: "Account", icon: <FaLock /> },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [active, setActive] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("PK");
  
  // Form states
  const [formData, setFormData] = useState({
    username: user?.username || "",
    fullName: "",
    email: user?.email || "",
    biography: "",
    country: "PK",
    socialLinks: {
      linkedin: "",
      twitter: "",
      github: "",
      discord: "",
      instagram: "",
      youtube: "",
      facebook: "",
      website: ""
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    // Load user data when component mounts
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      // Here you would make an API call to update the profile
      console.log('Profile updated:', formData);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      // Here you would make an API call to change password
      console.log('Password changed');
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowDeleteModal(false);
      // Here you would make an API call to delete the account
      console.log('Account deleted');
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <DashNav />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row gap-8 p-6 mt-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4 w-full">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold mb-6 text-center">Settings</h2>
              <div className="space-y-2">
            {options.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setActive(opt.key)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-300 font-medium
                  ${active === opt.key
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                      }
                `}
              >
                    <span className="text-lg">{opt.icon}</span> 
                    {opt.label}
              </button>
            ))}
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
                    <FaUser className="text-blue-400" /> 
                    Profile Settings
                  </h2>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isEditing 
                        ? "bg-gray-600 hover:bg-gray-700 text-white" 
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <FaTimes /> : <FaEdit />}
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img 
                          src="/logo192.png" 
                          alt="Profile" 
                          className="w-24 h-24 rounded-full border-4 border-blue-400 object-cover" 
                        />
                        <button className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition-all duration-300">
                          <FaCamera className="w-4 h-4" />
                        </button>
                      </div>
                    <div>
                        <h3 className="font-semibold text-lg">{user?.username || "User"}</h3>
                        <p className="text-gray-400">Update your profile picture</p>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Username</label>
                        <input 
                          type="text" 
                          name="username"
                          value={formData.username}
                          onChange={handleFormChange}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                        />
                    </div>
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
                    </div>

                    {/* Biography */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <MdOutlineBiotech /> Biography
                      </label>
                      <textarea 
                        name="biography"
                        value={formData.biography}
                        onChange={handleFormChange}
                        placeholder="Tell us about yourself, your interests, and expertise..."
                        rows={4}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none" 
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <FaGlobe /> Country
                      </label>
                        <select
                        name="country"
                        value={formData.country}
                        onChange={handleFormChange}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        >
                          <option value="PK">Pakistan</option>
                          <option value="IN">India</option>
                          <option value="US">United States</option>
                          <option value="GB">United Kingdom</option>
                          <option value="CA">Canada</option>
                          <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        </select>
                    </div>

                    {/* Social Links */}
                    <div>
                      <label className="block text-sm font-medium mb-4">Social Links</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {socialPlatforms.map((platform) => (
                          <div key={platform.key}>
                            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                              <span className={platform.color}>{platform.icon}</span>
                              {platform.label}
                            </label>
                            <input 
                              type="url" 
                              placeholder={`${platform.label} URL`}
                              value={formData.socialLinks[platform.key]}
                              onChange={(e) => handleSocialLinkChange(platform.key, e.target.value)}
                              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                            />
                          </div>
                        ))}
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
                    {/* Profile Display */}
                    <div className="flex items-center gap-6">
                      <img 
                        src="/logo192.png" 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full border-4 border-blue-400 object-cover" 
                      />
                    <div>
                        <h3 className="font-bold text-xl">{formData.fullName || "Full Name"}</h3>
                        <p className="text-gray-400">@{formData.username}</p>
                        <p className="text-sm text-gray-500">{formData.country === "PK" ? "Pakistan" : formData.country}</p>
                      </div>
                    </div>

                    {/* Biography Display */}
                    {formData.biography && (
                    <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <MdOutlineBiotech /> About
                        </h4>
                        <p className="text-gray-300 leading-relaxed">{formData.biography}</p>
                    </div>
                    )}

                    {/* Social Links Display */}
                    <div>
                      <h4 className="font-semibold mb-4">Social Links</h4>
                      <div className="flex flex-wrap gap-3">
                        {socialPlatforms.map((platform) => {
                          const link = formData.socialLinks[platform.key];
                          return link ? (
                            <a
                              key={platform.key}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 ${platform.color}`}
                            >
                              {platform.icon}
                              {platform.label}
                            </a>
                          ) : null;
                        })}
                    </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Account Settings */}
            {active === "account" && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                  <FaLock className="text-blue-400" /> 
                  Account Settings
                </h2>
                
                <div className="space-y-8">
                  {/* Email Section */}
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <MdOutlineEmail className="text-blue-400" /> 
                      Email Address
                    </h3>
                    <div className="flex items-center justify-between">
                  <div>
                        <p className="text-gray-300">{formData.email}</p>
                        <p className="text-sm text-gray-500">Your registered email address</p>
                  </div>
                      <button className="text-blue-400 hover:text-blue-300 transition-colors">
                        Change Email
                      </button>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <FaLock className="text-blue-400" /> 
                      Change Password
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input 
                        type="password" 
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Current Password" 
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                      />
                      <input 
                        type="password" 
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="New Password" 
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                      />
                  </div>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm New Password" 
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 mb-4" 
                    />
                    <button 
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Updating..." : "Update Password"}
                    </button>
                  </div>

                  {/* Delete Account Section */}
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-red-400">
                      <FaTrash /> 
                      Delete Account
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button 
                      onClick={() => setShowDeleteModal(true)}
                      className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrash className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Delete Account</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Deleting..." : "Delete Account"}
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
