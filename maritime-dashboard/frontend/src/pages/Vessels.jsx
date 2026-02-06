import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';

const Vessels = () => {
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVessels = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vessels');
      if (response.data.success) {
        setVessels(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching vessels:', error);
      Swal.fire('Error', 'Failed to load vessel registry', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVessels();
  }, []);

  const handleRegister = () => {
    Swal.fire({
      title: 'Vessel Registration',
      html: `
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border-4 border-white">
            <i class="fas fa-ship text-2xl"></i>
          </div>
          <p class="text-gray-500 text-sm">Fill in the official details to register the vessel in the fleet registry.</p>
        </div>
        <div class="text-left space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Vessel Name</label>
              <input id="v-name" type="text" class="w-full p-2 border rounded-lg text-sm" placeholder="e.g. MV North Star">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">IMO Number</label>
              <input id="v-imo" type="text" class="w-full p-2 border rounded-lg text-sm" placeholder="7 Digits">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Vessel Type</label>
              <select id="v-type" class="w-full p-2 border rounded-lg text-sm">
                <option>Tanker</option>
                <option>Container</option>
                <option>Bulk Carrier</option>
                <option>General Cargo</option>
                <option>Passenger</option>
                <option>Tug</option>
                <option>Offshore Support</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Flag</label>
              <input id="v-flag" type="text" class="w-full p-2 border rounded-lg text-sm" placeholder="e.g. Panama">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">MMSI</label>
              <input id="v-mmsi" type="text" class="w-full p-2 border rounded-lg text-sm" placeholder="9 Digits">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Year Built</label>
              <input id="v-year" type="number" class="w-full p-2 border rounded-lg text-sm" value="2020">
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Owner / Company</label>
            <input id="v-owner" type="text" class="w-full p-2 border rounded-lg text-sm" placeholder="Shipping Co. Ltd">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Register Vessel',
      confirmButtonColor: '#2563eb',
      preConfirm: () => {
        const data = {
          name: document.getElementById('v-name').value,
          imo: document.getElementById('v-imo').value,
          type: document.getElementById('v-type').value,
          flag: document.getElementById('v-flag').value,
          mmsi: document.getElementById('v-mmsi').value,
          yearBuilt: document.getElementById('v-year').value,
          owner: document.getElementById('v-owner').value,
        };
        if (!data.name || !data.imo || !data.type || !data.flag) {
          Swal.showValidationMessage('Please fill in all required fields');
        }
        return data;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.post('/vessels', result.value);
          if (response.data.success) {
            setVessels([response.data.data, ...vessels]);
            Swal.fire('Success', 'Vessel successfully registered in the system.', 'success');
          }
        } catch (error) {
          const message = error.response?.data?.message || error.message || 'Registration failed';
          Swal.fire({
            title: 'Registration Error',
            text: message,
            icon: 'error',
            confirmButtonColor: '#2563eb'
          });
        }
      }
    });
  };

  const handleEdit = (vessel) => {
    Swal.fire({
      title: 'Update Vessel Info',
      html: `
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border-4 border-white">
            <i class="fas fa-edit text-2xl"></i>
          </div>
          <p class="text-gray-500 text-sm">Update official vessel registry information.</p>
        </div>
        <div class="text-left space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Vessel Name</label>
              <input id="v-name" type="text" class="w-full p-2 border rounded-lg text-sm" value="${vessel.name}">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">IMO Number</label>
              <input id="v-imo" type="text" class="w-full p-2 border rounded-lg text-sm" value="${vessel.imo}" readonly>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Vessel Type</label>
              <select id="v-type" class="w-full p-2 border rounded-lg text-sm">
                <option ${vessel.type === 'Tanker' ? 'selected' : ''}>Tanker</option>
                <option ${vessel.type === 'Container' ? 'selected' : ''}>Container</option>
                <option ${vessel.type === 'Bulk Carrier' ? 'selected' : ''}>Bulk Carrier</option>
                <option ${vessel.type === 'General Cargo' ? 'selected' : ''}>General Cargo</option>
                <option ${vessel.type === 'Passenger' ? 'selected' : ''}>Passenger</option>
                <option ${vessel.type === 'Tug' ? 'selected' : ''}>Tug</option>
                <option ${vessel.type === 'Offshore Support' ? 'selected' : ''}>Offshore Support</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Status</label>
              <select id="v-status" class="w-full p-2 border rounded-lg text-sm">
                <option ${vessel.status === 'Active' ? 'selected' : ''}>Active</option>
                <option ${vessel.status === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                <option ${vessel.status === 'Decommissioned' ? 'selected' : ''}>Decommissioned</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Owner / Company</label>
            <input id="v-owner" type="text" class="w-full p-2 border rounded-lg text-sm" value="${vessel.owner || ''}" placeholder="Shipping Co. Ltd">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Update Registry',
      confirmButtonColor: '#2563eb',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedData = {
            name: document.getElementById('v-name').value,
            type: document.getElementById('v-type').value,
            status: document.getElementById('v-status').value,
            owner: document.getElementById('v-owner').value,
          };
          
          const response = await api.put(`/vessels/${vessel._id}`, updatedData);
          if (response.data.success) {
            setVessels(vessels.map(v => v._id === vessel._id ? response.data.data : v));
            Swal.fire('Updated', 'Vessel registry has been updated.', 'success');
          }
        } catch (error) {
          Swal.fire('Error', error.response?.data?.message || 'Update failed', 'error');
        }
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Deregister Vessel?',
      text: "This action will remove the vessel from the official fleet registry.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Deregister'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/vessels/${id}`);
          if (response.status === 200) {
            setVessels(vessels.filter(v => v._id !== id));
            Swal.fire('Removed', 'Vessel has been removed from registry.', 'success');
          }
        } catch (error) {
          Swal.fire('Denied', error.response?.data?.message || 'Only administrators can remove vessels.', 'error');
        }
      }
    });
  };

  const handleView = async (vessel) => {
    let alerts = [];
    try {
      const res = await api.get(`/alerts?vesselId=${vessel._id}`);
      if (res.data.success) alerts = res.data.data;
    } catch (err) {
      console.error("Alerts fetch failed");
    }

    Swal.fire({
      title: vessel.name,
      width: '600px',
      html: `
        <div class="text-center mb-6">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform -rotate-3">
            <i class="fas fa-ship text-3xl"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800">${vessel.name}</h3>
          <p class="text-xs text-gray-400 uppercase tracking-widest mt-1">${vessel.type} • ${vessel.flag}</p>
        </div>
        <div class="grid grid-cols-2 gap-4 text-left p-2">
          <div class="space-y-3">
            <div class="flex justify-between border-b pb-1">
              <span class="text-[10px] text-gray-400 uppercase font-bold">IMO Number</span>
              <span class="text-xs font-bold text-blue-800">${vessel.imo}</span>
            </div>
            <div class="flex justify-between border-b pb-1">
              <span class="text-[10px] text-gray-400 uppercase font-bold">MMSI</span>
              <span class="text-xs font-semibold">${vessel.mmsi || 'N/A'}</span>
            </div>
            <div class="flex justify-between border-b pb-1">
              <span class="text-[10px] text-gray-400 uppercase font-bold">Vessel Type</span>
              <span class="text-xs font-bold text-blue-600">${vessel.type}</span>
            </div>
            <div class="flex justify-between border-b pb-1">
              <span class="text-[10px] text-gray-400 uppercase font-bold">Status</span>
              <span class="text-xs font-bold ${vessel.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}">${vessel.status}</span>
            </div>
          </div>
          <div class="bg-gray-50 rounded-xl p-3 border border-gray-100">
             <div class="flex items-center space-x-2 text-blue-700 font-bold mb-3 border-b border-blue-100 pb-2">
               <i class="fas fa-bell text-xs"></i>
               <span class="text-[10px] uppercase tracking-wider">Current Vessel Alerts</span>
             </div>
             <div class="max-h-[150px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                ${alerts.length > 0 ? alerts.map(a => `
                  <div class="p-2 rounded-lg bg-white border-l-4 ${a.priority === 'urgent' ? 'border-red-500' : a.priority === 'high' ? 'border-yellow-500' : 'border-blue-500'} shadow-sm">
                    <p class="text-[10px] font-bold text-gray-800 line-clamp-1">${a.title}</p>
                    <p class="text-[9px] text-gray-500 line-clamp-2">${a.message || a.content}</p>
                    <p class="text-[8px] text-gray-400 mt-1">${new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                `).join('') : '<p class="text-center py-4 text-[10px] text-gray-400">No active alerts for this vessel.</p>'}
             </div>
          </div>
        </div>
        <div class="mt-4 p-3 bg-blue-50 rounded-xl flex justify-between items-center text-left">
           <div>
             <p class="text-[10px] text-blue-400 uppercase font-bold">Registry Info</p>
             <p class="text-[9px] text-blue-600 font-medium">Owner: ${vessel.owner || 'N/A'}</p>
           </div>
           <div class="text-right">
             <p class="text-[9px] text-blue-400 italic">Added: ${new Date(vessel.createdAt).toLocaleDateString()}</p>
             <p class="text-[9px] text-blue-400 italic">Updated: ${new Date(vessel.updatedAt).toLocaleDateString()}</p>
           </div>
        </div>
      `,
      confirmButtonText: 'Close Details',
      confirmButtonColor: '#2563eb',
    });
  };

  const filteredVessels = vessels.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.imo.includes(searchTerm)
  );

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vessel Registry</h2>
          <p className="text-gray-500 text-sm">Official registration and management of fleet vessels.</p>
        </div>
        <button onClick={handleRegister} className="btn btn-primary shadow-lg shadow-blue-200">
          <i className="fas fa-ship mr-2"></i> Register New Vessel
        </button>
      </div>

      <div className="card overflow-hidden border-none shadow-xl">
        <div className="p-6 bg-white border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"></i>
            <input 
              type="text" 
              placeholder="Search by name or IMO..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
             <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
               {vessels.length} Total Vessels
             </span>
          </div>
        </div>

        <div className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center text-gray-400">
              <div className="animate-pulse flex flex-col items-center">
                <i className="fas fa-anchor text-4xl mb-4 text-blue-100"></i>
                <p>Loading registry...</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4">Vessel Description</th>
                  <th className="px-6 py-4">Identification</th>
                  <th className="px-6 py-4">Flag / Origin</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVessels.length > 0 ? (
                  filteredVessels.map((vessel) => (
                    <tr key={vessel._id} className="hover:bg-blue-50/20 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => handleView(vessel)}>
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
                            <i className="fas fa-ship text-sm"></i>
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{vessel.name}</p>
                            <p className="text-xs text-gray-400">{vessel.type} • Built {vessel.yearBuilt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                             <span className="text-[10px] font-bold text-gray-400 uppercase w-10">IMO:</span>
                             <span className="text-xs font-mono font-bold text-gray-700">{vessel.imo}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                             <span className="text-[10px] font-bold text-gray-400 uppercase w-10">MMSI:</span>
                             <span className="text-xs font-mono text-gray-500">{vessel.mmsi || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center space-x-2">
                           <span className="text-sm font-medium text-gray-700">{vessel.flag}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                          vessel.status === 'Active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {vessel.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex justify-center items-center gap-1">
                           <button 
                            onClick={() => handleView(vessel)}
                            className="w-8 h-8 flex items-center justify-center text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                            title="View Info"
                           >
                             <i className="fas fa-eye text-sm"></i>
                           </button>
                           <button 
                            onClick={() => handleEdit(vessel)}
                            className="w-8 h-8 flex items-center justify-center text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Edit Registry"
                           >
                             <i className="fas fa-edit text-sm"></i>
                           </button>
                           <button 
                            onClick={() => handleDelete(vessel._id)}
                            className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove Vessel"
                           >
                             <i className="fas fa-trash-alt text-sm"></i>
                           </button>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-gray-400">
                      <div className="flex flex-col items-center">
                        <i className="fas fa-search text-4xl mb-4 opacity-20"></i>
                        <p className="font-medium text-gray-500">No vessels found.</p>
                        <p className="text-xs">Start by registering your first fleet vessel.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vessels;
