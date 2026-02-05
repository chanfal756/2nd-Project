import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../services/api';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { name: 'Captain', email: '' });
  const [loading, setLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: localStorage.getItem('darkMode') === 'true',
    language: 'en',
    timezone: 'UTC'
  });

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [settings.darkMode]);

  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    vessel: user.vessel || '',
    idNumber: user.idNumber || ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/update', profileData);
      const updatedUser = res.data.data.user;
      
      // Update local storage and state
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your account information has been synchronized.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || 'Server error while updating profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout',
      text: "Are you sure you want to exit?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  };

  return (
    <div className="space-y-6 fade-in">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Settings & Preferences</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Account Settings */}
          <div className="card p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
              <i className="fas fa-user-circle mr-2 text-blue-600"></i>
              Account Information
            </h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Vessel Name</label>
                <input 
                  type="text" 
                  value={profileData.vessel}
                  onChange={(e) => setProfileData({...profileData, vessel: e.target.value})} 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="MV Ocean Star"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">ID Number</label>
                <input 
                  type="text" 
                  value={profileData.idNumber}
                  onChange={(e) => setProfileData({...profileData, idNumber: e.target.value})} 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="MAR-4321"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Role</label>
                <input 
                  type="text" 
                  defaultValue={user.role || 'Captain'} 
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className={`btn btn-primary mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Notification Settings */}
          <div className="card p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
              <i className="fas fa-bell mr-2 text-blue-600"></i>
              Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                { id: 'notifications', label: 'Push Notifications', desc: 'Receive alerts and updates' },
                { id: 'emailAlerts', label: 'Email Alerts', desc: 'Get critical alerts via email' },
                { id: 'darkMode', label: 'Dark Mode', desc: 'Enable darker color scheme' },
              ].map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{setting.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{setting.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings[setting.id]}
                      onChange={(e) => setSettings({...settings, [setting.id]: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* System Settings */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-cog mr-2 text-blue-600"></i>
              System Preferences
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Language</label>
                <select 
                  value={settings.language}
                  onChange={(e) => setSettings({...settings, language: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Timezone</label>
                <select 
                  value={settings.timezone}
                  onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="EST">EST (Eastern Standard Time)</option>
                  <option value="PST">PST (Pacific Standard Time)</option>
                  <option value="GMT">GMT (Greenwich Mean Time)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <div className="card p-6 bg-gradient-to-br from-blue-900 to-blue-700 text-white border-none">
            <div className="text-center mb-4">
              <div 
                onClick={() => {
                  const hasImage = !!user.profileImage;
                  
                  Swal.fire({
                    title: 'Profile Photo',
                    text: hasImage ? 'What would you like to do?' : 'Upload a profile picture',
                    icon: 'info',
                    showCancelButton: true,
                    cancelButtonText: 'Cancel',
                    showDenyButton: hasImage,
                    denyButtonText: 'Choose from Gallery',
                    denyButtonColor: '#10b981',
                    confirmButtonText: hasImage ? 'View Photo' : 'Choose from Gallery',
                    confirmButtonColor: hasImage ? '#2563eb' : '#10b981',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      if (hasImage) {
                        // View Photo
                        Swal.fire({
                          imageUrl: user.profileImage,
                          imageAlt: 'Profile Photo',
                          showConfirmButton: false,
                          background: 'rgba(0,0,0,0.95)',
                          customClass: {
                            image: 'rounded-lg border-4 border-white shadow-2xl max-h-[80vh]'
                          }
                        });
                      } else {
                        // Trigger upload if no image but confirm clicked
                        triggerUpload();
                      }
                    } else if (result.isDenied) {
                      // Choose from Gallery (Deny button used for second action)
                      triggerUpload();
                    }
                  });

                  const triggerUpload = () => {
                    Swal.fire({
                      title: 'Select Image',
                      input: 'file',
                      inputAttributes: {
                        'accept': 'image/*',
                        'aria-label': 'Upload your profile picture'
                      },
                      showCancelButton: true,
                      confirmButtonText: 'Upload',
                      confirmButtonColor: '#2563eb'
                    }).then((res) => {
                      if (res.isConfirmed && res.value) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const newUrl = e.target.result;
                          const updatedUser = { ...user, profileImage: newUrl };
                          setUser(updatedUser);
                          localStorage.setItem('user', JSON.stringify(updatedUser));
                          Swal.fire('Success', 'Profile photo updated!', 'success');
                        };
                        reader.readAsDataURL(res.value);
                      }
                    });
                  };
                }}
                className="w-24 h-24 bg-white/20 hover:bg-white/30 cursor-pointer rounded-full mx-auto flex items-center justify-center mb-4 transition-all duration-300 relative group overflow-hidden border-4 border-black shadow-xl"
              >
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <i className="fas fa-user text-4xl group-hover:hidden text-gray-800"></i>
                )}
                <div className="absolute inset-0 bg-black/40 items-center justify-center group-hover:flex hidden transition-opacity duration-300">
                  <i className="fas fa-camera text-2xl text-white"></i>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="inline-block px-4 py-1.5 bg-white rounded-lg shadow-md border-2 border-black">
                  <h4 className="font-bold text-xl text-black tracking-tight">{user.name}</h4>
                </div>
              </div>

              <div className="inline-block px-4 py-1.5 bg-white rounded-full border-2 border-black shadow-sm">
                <p className="text-black text-xs font-mono font-bold">
                  ID: <span className="text-black">{user.idNumber || 'USR-2024-889'}</span>
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full bg-white text-blue-900 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => Swal.fire('Export Started', 'Your data archive is being prepared. You will be notified when it is ready for download.', 'success')}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
              >
                <i className="fas fa-download mr-2 text-blue-600"></i>
                Export Data
              </button>
              <button 
                onClick={() => {
                  Swal.fire({
                    title: 'Privacy Settings',
                    html: `
                      <div class="text-left">
                        <label class="flex items-center space-x-2 cursor-pointer mb-2">
                          <input type="checkbox" checked class="form-checkbox">
                          <span>Make profile visible to other vessels</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" class="form-checkbox">
                          <span>Share anonymous usage data</span>
                        </label>
                      </div>
                    `,
                    confirmButtonText: 'Save Preferences'
                  }).then((res) => {
                    if (res.isConfirmed) Swal.fire('Saved', 'Privacy preferences updated.', 'success');
                  });
                }}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
              >
                <i className="fas fa-shield-alt mr-2 text-green-600"></i>
                Privacy Settings
              </button>
              <button 
                onClick={() => {
                  Swal.fire({
                    title: 'Support Request',
                    input: 'textarea',
                    inputLabel: 'Describe your issue',
                    inputPlaceholder: 'Type your message here...',
                    showCancelButton: true,
                    confirmButtonText: 'Submit Ticket'
                  }).then((res) => {
                    if (res.isConfirmed && res.value) {
                      Swal.fire('Ticket Created', 'Support team has been notified. Ticket #9921', 'success');
                    }
                  });
                }}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
              >
                <i className="fas fa-life-ring mr-2 text-yellow-600"></i>
                Help & Support
              </button>
            </div>
          </div>

          <div className="card p-6 bg-gray-50">
            <h4 className="font-bold text-gray-800 text-sm mb-2">System Version</h4>
            <p className="text-xs text-gray-500">Maritime Dashboard v2.1.0</p>
            <p className="text-xs text-gray-500 mt-1">Last Updated: Jan 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
