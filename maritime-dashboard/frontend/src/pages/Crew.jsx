import React, { useState } from 'react';
import Swal from 'sweetalert2';

const Crew = () => {
  const [crewList, setCrewList] = useState([
    { name: 'John Smith', rank: 'Master', watch: 'Fixed', rest: 'Optimal', status: 'On Duty' },
    { name: 'Alex Rivera', rank: 'Chief Officer', watch: '04:00 - 08:00', rest: 'Optimal', status: 'On Duty' },
    { name: 'Chen Wei', rank: 'Second Officer', watch: '00:00 - 04:00', rest: 'Warning', status: 'Off Duty' },
    { name: 'Sarah Larson', rank: 'Third Officer', watch: '08:00 - 12:00', rest: 'Optimal', status: 'On Duty' },
    { name: 'Mike Johnson', rank: 'Chief Engineer', watch: 'Fixed', rest: 'Optimal', status: 'Off Duty' },
    { name: 'David Kim', rank: 'Able Seaman', watch: '12:00 - 16:00', rest: 'Critical', status: 'On Duty' },
  ]);

  const [filterStatus, setFilterStatus] = useState('All');

  const handleEdit = (member) => {
    Swal.fire({
      title: `Edit Crew: ${member.name}`,
      html: `
        <div class="text-left">
          <label class="block text-sm font-medium mb-1">Rank</label>
          <input id="swal-rank" class="w-full p-2 border rounded-md mb-4" value="${member.rank}" />
          
          <label class="block text-sm font-medium mb-1">Watch Period</label>
          <input id="swal-watch" class="w-full p-2 border rounded-md mb-4" value="${member.watch}" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      confirmButtonColor: '#2563eb',
      preConfirm: () => {
        return {
          rank: document.getElementById('swal-rank').value,
          watch: document.getElementById('swal-watch').value
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedList = crewList.map(c => 
          c.name === member.name 
            ? { ...c, rank: result.value.rank, watch: result.value.watch } 
            : c
        );
        setCrewList(updatedList);
        Swal.fire('Updated!', `${member.name}'s details have been updated.`, 'success');
      }
    });
  };

  const filteredCrew = crewList.filter(member => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'On Duty') return member.status === 'On Duty';
    if (filterStatus === 'Off Duty') return member.status === 'Off Duty';
    if (filterStatus === 'Rest Warning') return member.rest === 'Warning' || member.rest === 'Critical';
    return true;
  });

  const handleOnboard = () => {
    Swal.fire({
      title: 'Onboard New Crew Member',
      html: `
        <div class="text-left space-y-3">
          <div>
            <label class="block text-sm font-medium mb-1">Full Name</label>
            <input id="new-name" class="w-full p-2 border rounded-md" placeholder="e.g. James Bond" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium mb-1">Rank</label>
              <select id="new-rank" class="w-full p-2 border rounded-md bg-white">
                <option>Deck Cadet</option>
                <option>Able Seaman</option>
                <option>Third Engineer</option>
                <option>Cook</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Status</label>
              <select id="new-status" class="w-full p-2 border rounded-md bg-white">
                <option>On Duty</option>
                <option>Off Duty</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Watch Period</label>
            <input id="new-watch" class="w-full p-2 border rounded-md" placeholder="e.g. 08:00 - 12:00" />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Onboard Crew',
      confirmButtonColor: '#10b981',
      preConfirm: () => {
        const name = document.getElementById('new-name').value;
        const rank = document.getElementById('new-rank').value;
        const status = document.getElementById('new-status').value;
        const watch = document.getElementById('new-watch').value;
        
        if (!name || !watch) {
          Swal.showValidationMessage('Please fill all fields');
          return false;
        }
        return { name, rank, status, watch };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newMember = {
          ...result.value,
          rest: 'Optimal', // Default starting status
        };
        setCrewList([...crewList, newMember]);
        Swal.fire('Onboarded!', `${result.value.name} has been added to the crew list.`, 'success');
      }
    });
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Crew Management</h2>
        <button onClick={handleOnboard} className="btn btn-primary">
          <i className="fas fa-user-plus mr-2"></i> Onboard Crew
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Crew Card */}
        <div 
          onClick={() => setFilterStatus('All')}
          className={`card p-4 flex items-center space-x-4 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${filterStatus === 'All' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
        >
           <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-users"></i>
           </div>
           <div>
             <p className="text-xs text-gray-500">Total Crew</p>
             <h4 className="font-bold">{crewList.length}</h4>
           </div>
        </div>

        {/* On Duty Card */}
        <div 
          onClick={() => setFilterStatus('On Duty')}
          className={`card p-4 flex items-center space-x-4 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${filterStatus === 'On Duty' ? 'ring-2 ring-green-500 bg-green-50' : ''}`}
        >
           <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-user-clock"></i>
           </div>
           <div>
             <p className="text-xs text-gray-500">On Duty</p>
             <h4 className="font-bold">{crewList.filter(c => c.status === 'On Duty').length}</h4>
           </div>
        </div>

        {/* Off Duty Card */}
        <div 
          onClick={() => setFilterStatus('Off Duty')}
          className={`card p-4 flex items-center space-x-4 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${filterStatus === 'Off Duty' ? 'ring-2 ring-gray-500 bg-gray-50' : ''}`}
        >
           <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-bed"></i>
           </div>
           <div>
             <p className="text-xs text-gray-500">Off Duty</p>
             <h4 className="font-bold">{crewList.filter(c => c.status === 'Off Duty').length}</h4>
           </div>
        </div>

        {/* Rest Warning Card */}
        <div 
          onClick={() => setFilterStatus('Rest Warning')}
          className={`card p-4 flex items-center space-x-4 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${filterStatus === 'Rest Warning' ? 'ring-2 ring-red-500 bg-red-50' : ''}`}
        >
           <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-heartbeat"></i>
           </div>
           <div>
             <p className="text-xs text-gray-500">Rest Issues</p>
             <h4 className="font-bold">{crewList.filter(c => c.rest === 'Warning' || c.rest === 'Critical').length}</h4>
           </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h3 className="font-semibold">
            {filterStatus === 'All' ? 'Crew List & Watch Schedule' : `${filterStatus} List`}
          </h3>
          <div className="flex gap-2">
             {filterStatus !== 'All' && (
                <button onClick={() => setFilterStatus('All')} className="text-xs text-blue-600 hover:underline mr-2">Clear Filter</button>
             )}
             <div className="flex bg-white/20 rounded-lg p-1">
               <button 
                 onClick={() => setFilterStatus('On Duty')}
                 className={`px-3 py-1 text-xs font-bold rounded transition-colors ${filterStatus === 'On Duty' ? 'bg-white text-blue-900' : 'text-white hover:bg-white/10'}`}
               >
                 Current Watch
               </button>
               <button 
                 onClick={() => setFilterStatus('All')}
                 className={`px-3 py-1 text-xs font-bold rounded transition-colors ${filterStatus === 'All' ? 'bg-white text-blue-900' : 'text-white hover:bg-white/10'}`}
               >
                 All Crew
               </button>
             </div>
          </div>
        </div>
        <div className="p-0">
           <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                   <th className="px-6 py-3 font-medium">Name</th>
                   <th className="px-6 py-3 font-medium">Rank</th>
                   <th className="px-6 py-3 font-medium">Status</th>
                   <th className="px-6 py-3 font-medium">Watch Period</th>
                   <th className="px-6 py-3 font-medium">Rest Status</th>
                   <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredCrew.length > 0 ? (
                  filteredCrew.map((member, i) => (
                    <tr key={i} className="table-row">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                           <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 font-bold text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                           </div>
                           <span className="font-medium">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{member.rank}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${member.status === 'On Duty' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{member.watch}</td>
                      <td className="px-6 py-4">
                         <span className={`badge ${member.rest === 'Optimal' ? 'badge-success' : member.rest === 'Warning' ? 'badge-warning' : 'badge-danger'}`}>
                           {member.rest}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                         <button 
                          onClick={() => handleEdit(member)} 
                          className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                          title="Edit Crew Member"
                         >
                          <i className="fas fa-edit"></i>
                         </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No crew members found matching "{filterStatus}".
                    </td>
                  </tr>
                )}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default Crew;
