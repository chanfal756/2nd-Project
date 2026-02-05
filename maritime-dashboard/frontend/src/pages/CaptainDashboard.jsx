import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const CaptainDashboard = () => {
  const [updates, setUpdates] = useState([
    {
      id: 1,
      title: 'Navigation Status Update',
      content: 'Entering Malacca Strait. Standard watchkeeping procedures in effect. Weather clear, visibility good.',
      timestamp: '2 hours ago',
      category: 'Navigation',
      priority: 'normal'
    },
    {
      id: 2,
      title: 'Engine Maintenance Note',
      content: 'Aux Engine 2 fuel pressure stabilized after filter change. Monitoring continues.',
      timestamp: '5 hours ago',
      category: 'Engineering',
      priority: 'high'
    }
  ]);

  const [newUpdate, setNewUpdate] = useState({ title: '', content: '', category: 'General', priority: 'normal' });

  const handleAddUpdate = (e) => {
    e.preventDefault();
    if (!newUpdate.title || !newUpdate.content) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }

    const update = {
      ...newUpdate,
      id: Date.now(),
      timestamp: 'Just now'
    };

    setUpdates([update, ...updates]);
    setNewUpdate({ title: '', content: '', category: 'General', priority: 'normal' });
    
    Swal.fire({
      icon: 'success',
      title: 'Update Posted',
      text: 'Your command update has been broadcast to the crew.',
      timer: 2000,
      showConfirmButton: false
    });
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Captain's Command Center</h2>
        <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400">
          Vessel Status: Underway
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Post New Update */}
        <div className="lg:col-span-1">
          <div className="card p-6 dark:bg-gray-800 dark:border-gray-700 sticky top-6">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <i className="fas fa-edit mr-2 text-blue-600"></i>
              Post Command Update
            </h3>
            <form onSubmit={handleAddUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Headline</label>
                <input 
                  type="text" 
                  value={newUpdate.title}
                  onChange={(e) => setNewUpdate({...newUpdate, title: e.target.value})}
                  placeholder="E.g., Weather Warning"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
                <select 
                  value={newUpdate.category}
                  onChange={(e) => setNewUpdate({...newUpdate, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="General">General</option>
                  <option value="Navigation">Navigation</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Safety">Safety</option>
                  <option value="Security">Security</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Priority</label>
                <div className="flex space-x-2 mt-1">
                  {['normal', 'high', 'urgent'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewUpdate({...newUpdate, priority: p})}
                      className={`flex-1 py-1.5 px-2 rounded-md text-xs font-bold uppercase transition-all ${
                        newUpdate.priority === p 
                        ? (p === 'urgent' ? 'bg-red-600 text-white' : p === 'high' ? 'bg-yellow-500 text-white' : 'bg-blue-600 text-white')
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Message Content</label>
                <textarea 
                  value={newUpdate.content}
                  onChange={(e) => setNewUpdate({...newUpdate, content: e.target.value})}
                  rows="4"
                  placeholder="Enter detailed instructions or updates..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <i className="fas fa-paper-plane mr-2"></i>
                Post Broadcast
              </button>
            </form>
          </div>
        </div>

        {/* Update Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-700 dark:text-gray-300 uppercase text-sm tracking-widest">Recent Broadcasts</h3>
            <span className="text-xs text-gray-400">{updates.length} logs total</span>
          </div>

          {updates.map((update) => (
            <div key={update.id} className="card p-5 dark:bg-gray-800 dark:border-gray-700 group hover:border-blue-300 dark:hover:border-blue-800 transition-all border-l-4" style={{ borderLeftColor: update.priority === 'urgent' ? '#ef4444' : update.priority === 'high' ? '#f59e0b' : '#3b82f6' }}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      update.category === 'Navigation' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' :
                      update.category === 'Engineering' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {update.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">{update.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition-colors">{update.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed">{update.content}</p>
                </div>
                {update.priority === 'urgent' && (
                  <div className="animate-pulse">
                    <i className="fas fa-exclamation-circle text-red-500"></i>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[8px] text-white">CP</div>
                  <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[8px] text-gray-600">JD</div>
                  <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[8px] text-gray-400">+5</div>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  <i className="far fa-comment-alt mr-1"></i> 3 Acknowledgements
                </button>
              </div>
            </div>
          ))}

          {updates.length === 0 && (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              <i className="fas fa-clipboard-list text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">No updates posted yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptainDashboard;
