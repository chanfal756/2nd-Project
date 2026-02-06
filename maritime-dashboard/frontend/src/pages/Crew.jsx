import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';

const Crew = () => {
  const [crew, setCrew] = useState([]);
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [crewRes, vesselsRes] = await Promise.all([
        api.get('/crew'),
        api.get('/vessels')
      ]);
      
      if (crewRes.data.success) setCrew(crewRes.data.data);
      if (vesselsRes.data.success) setVessels(vesselsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire('Error', 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegister = () => {
    if (vessels.length === 0) {
      return Swal.fire('No Vessels', 'Please register a vessel first before adding crew.', 'warning');
    }

    Swal.fire({
      title: 'Crew Registration',
      html: `
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
            <i class="fas fa-user-plus text-2xl"></i>
          </div>
          <p class="text-xs text-gray-500">Official embarkation record for new crew member.</p>
        </div>
        <div class="text-left space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">First Name</label>
              <input id="c-fname" type="text" class="w-full p-2 bg-gray-50 border rounded-lg text-sm">
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Last Name</label>
              <input id="c-lname" type="text" class="w-full p-2 bg-gray-50 border rounded-lg text-sm">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Rank</label>
              <select id="c-rank" class="w-full p-2 bg-gray-50 border rounded-lg text-sm">
                <option>Captain</option>
                <option>Chief Officer</option>
                <option>Second Officer</option>
                <option>Third Officer</option>
                <option>Chief Engineer</option>
                <option>Second Engineer</option>
                <option>AB Seaman</option>
                <option>OS Seaman</option>
                <option>Cook</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Employee ID</label>
              <input id="c-empid" type="text" class="w-full p-2 bg-gray-50 border rounded-lg text-sm" placeholder="EMP123">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
             <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Assigned Vessel</label>
              <select id="c-vessel" class="w-full p-2 bg-gray-50 border rounded-lg text-sm">
                ${vessels.map(v => `<option value="${v._id}">${v.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nationality</label>
              <input id="c-nation" type="text" class="w-full p-2 bg-gray-50 border rounded-lg text-sm">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Passport No.</label>
              <input id="c-passport" type="text" class="w-full p-2 bg-gray-50 border rounded-lg text-sm">
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Joining Date</label>
              <input id="c-joining" type="date" class="w-full p-2 bg-gray-50 border rounded-lg text-sm" value="${new Date().toISOString().split('T')[0]}">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 pb-2">
            <div>
               <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Seaman Book No.</label>
               <input id="c-seaman" type="text" class="w-full p-2 bg-gray-50 border rounded-lg text-sm">
            </div>
            <div>
               <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Date of Birth</label>
               <input id="c-dob" type="date" class="w-full p-2 bg-gray-50 border rounded-lg text-sm">
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Register Crew',
      confirmButtonColor: '#2563eb',
      preConfirm: () => {
        const data = {
          firstName: document.getElementById('c-fname').value,
          lastName: document.getElementById('c-lname').value,
          rank: document.getElementById('c-rank').value,
          employeeId: document.getElementById('c-empid').value,
          vessel: document.getElementById('c-vessel').value,
          nationality: document.getElementById('c-nation').value,
          passportNumber: document.getElementById('c-passport').value,
          seamanBookNumber: document.getElementById('c-seaman').value,
          dateOfBirth: document.getElementById('c-dob').value,
          joiningDate: document.getElementById('c-joining').value,
        };
        if (!data.firstName || !data.lastName || !data.employeeId || !data.vessel) {
          Swal.showValidationMessage('Please fill in required fields');
        }
        return data;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.post('/crew', result.value);
          if (response.data.success) {
            setCrew([response.data.data, ...crew]);
            Swal.fire('Signed On', 'Crew member has been registered and assigned to vessel.', 'success');
          }
        } catch (error) {
          Swal.fire('Error', error.response?.data?.message || 'Registration failed', 'error');
        }
      }
    });
  };

  const handleEdit = (member) => {
    Swal.fire({
      title: 'Update Crew Profile',
      html: `
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
            <i class="fas fa-user-edit text-2xl"></i>
          </div>
          <p class="text-xs text-gray-500">Updating profile for ${member.fullName}</p>
        </div>
        <div class="text-left space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Rank</label>
              <select id="c-rank" class="w-full p-2 border rounded-lg text-sm">
                <option ${member.rank === 'Captain' ? 'selected' : ''}>Captain</option>
                <option ${member.rank === 'Chief Officer' ? 'selected' : ''}>Chief Officer</option>
                <option ${member.rank === 'Chief Engineer' ? 'selected' : ''}>Chief Engineer</option>
                <option ${member.rank === 'AB Seaman' ? 'selected' : ''}>AB Seaman</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Service Status</label>
              <select id="c-status" class="w-full p-2 border rounded-lg text-sm">
                <option ${member.status === 'On Board' ? 'selected' : ''}>On Board</option>
                <option ${member.status === 'On Leave' ? 'selected' : ''}>On Leave</option>
                <option ${member.status === 'Standby' ? 'selected' : ''}>Standby</option>
                <option ${member.status === 'Resigned' ? 'selected' : ''}>Resigned</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Vessel Reassignment</label>
            <select id="c-vessel" class="w-full p-2 border rounded-lg text-sm">
               ${vessels.map(v => `<option value="${v._id}" ${member.vessel?._id === v._id ? 'selected' : ''}>${v.name}</option>`).join('')}
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      confirmButtonColor: '#2563eb',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedData = {
            rank: document.getElementById('c-rank').value,
            status: document.getElementById('c-status').value,
            vessel: document.getElementById('c-vessel').value,
          };
          const response = await api.put(`/crew/${member._id}`, updatedData);
          if (response.data.success) {
            setCrew(crew.map(c => c._id === member._id ? { ...response.data.data, vessel: vessels.find(v => v._id === updatedData.vessel) } : c));
            Swal.fire('Updated', 'Profile updated successfully.', 'success');
          }
        } catch (error) {
          Swal.fire('Error', error.response?.data?.message || 'Update failed', 'error');
        }
      }
    });
  };

  const handleLeave = (id) => {
    Swal.fire({
      title: 'Crew Member Departure?',
      text: "This will update status to 'On Leave' and remove from current manifest.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Confirm'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.put(`/crew/${id}`, { status: 'On Leave' });
          fetchData();
          Swal.fire('Updated', 'Crew status updated.', 'success');
        } catch (error) {
          Swal.fire('Error', 'Action failed', 'error');
        }
      }
    });
  };

  const filteredCrew = crew.filter(c => 
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 fade-in">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Crew Manifest</h2>
          <p className="text-gray-500 text-sm">Official records of all personnel currently serving on fleet vessels.</p>
        </div>
        <button onClick={handleRegister} className="btn btn-primary shadow-lg shadow-blue-200">
          <i className="fas fa-user-plus mr-2"></i> Register New Crew
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 bg-white flex items-center space-x-4 border-l-4 border-blue-500">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl shadow-inner">
            <i className="fas fa-users"></i>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Crew</p>
            <h4 className="text-xl font-bold text-gray-800">{crew.length}</h4>
          </div>
        </div>
        <div className="card p-6 bg-white flex items-center space-x-4 border-l-4 border-green-500">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-xl shadow-inner">
            <i className="fas fa-ship"></i>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">On Board</p>
            <h4 className="text-xl font-bold text-gray-800">{crew.filter(c => c.status === 'On Board').length}</h4>
          </div>
        </div>
        {/* ... more stats if needed ... */}
      </div>

      <div className="card border-none shadow-xl overflow-hidden">
        <div className="p-6 bg-white border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"></i>
                <input 
                    type="text" 
                    placeholder="Search by name or ID..." 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-all hover:bg-gray-200">
                  <i className="fas fa-filter mr-2"></i> Filter
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-all hover:bg-gray-200">
                  <i className="fas fa-download mr-2"></i> Export Manifest
                </button>
            </div>
        </div>

        <div className="p-0 overflow-x-auto">
          {loading ? (
             <div className="p-20 text-center text-gray-400">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-sm font-medium">Updating personnel registry...</p>
             </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b">
                <tr>
                  <th className="px-6 py-4">Crew Member Profile</th>
                  <th className="px-6 py-4">Assigned Vessel</th>
                  <th className="px-6 py-4">ID / Documents</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCrew.length > 0 ? (
                  filteredCrew.map((member) => (
                    <tr key={member._id} className="hover:bg-blue-50/20 transition-all group">
                       <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold shadow-sm">
                            {member.firstName[0]}{member.lastName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{member.fullName}</p>
                            <p className="text-[11px] text-blue-600 font-semibold uppercase">{member.rank}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center space-x-2">
                            <i className="fas fa-ship text-gray-300 text-[10px]"></i>
                            <span className="text-sm font-medium text-gray-700">{member.vessel?.name || 'Unassigned'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="space-y-1">
                            <p className="text-[11px] text-gray-500 font-mono"><span className="text-gray-300 uppercase mr-1">EMP:</span> {member.employeeId}</p>
                            <p className="text-[11px] text-gray-500 font-mono"><span className="text-gray-300 uppercase mr-1">PPS:</span> {member.passportNumber}</p>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight uppercase ${
                           member.status === 'On Board' 
                           ? 'bg-green-100 text-green-700' 
                           : 'bg-yellow-100 text-yellow-700'
                         }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex justify-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => handleEdit(member)} className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-600 hover:text-white transition-all">
                              <i className="fas fa-pen text-xs"></i>
                            </button>
                            <button onClick={() => handleLeave(member._id)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                              <i className="fas fa-plane-departure text-xs"></i>
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                   <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                       <i className="fas fa-users-slash text-4xl text-gray-100 mb-4"></i>
                       <p className="text-gray-400 text-sm">No crew records found.</p>
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

export default Crew;
