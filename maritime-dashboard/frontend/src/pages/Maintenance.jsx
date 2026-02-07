import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';

const Maintenance = () => {
  const [logs, setLogs] = useState([]);
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [logsRes, vesselsRes] = await Promise.all([
        api.get('/vessel-ops/maintenance'),
        api.get('/vessels')
      ]);
      setLogs(logsRes.data.data);
      setVessels(vesselsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewDetails = (log) => {
    Swal.fire({
      title: 'Maintenance Log Details',
      html: `
        <div class="text-left space-y-4 p-2">
          <div class="flex justify-between border-b pb-2">
            <span class="text-gray-500">Vessel:</span>
            <span class="font-bold text-blue-800">${log.vesselId?.name || 'N/A'}</span>
          </div>
          <div class="flex justify-between border-b pb-2">
            <span class="text-gray-500">Component:</span>
            <span class="font-semibold text-green-600">${log.component}</span>
          </div>
          <div class="flex justify-between border-b pb-2">
            <span class="text-gray-500">Task Title:</span>
            <span class="font-semibold">${log.title}</span>
          </div>
          <div class="flex justify-between border-b pb-2">
            <span class="text-gray-500">Type:</span>
            <span class="badge badge-primary uppercase">${log.type}</span>
          </div>
          <div class="flex justify-between border-b pb-2">
            <span class="text-gray-500">Engine Hours:</span>
            <span class="font-bold">${log.engineHours || 'N/A'} hrs</span>
          </div>
          <div class="flex justify-between border-b pb-2">
            <span class="text-gray-500">Date:</span>
            <span class="font-medium">${new Date(log.datePerformed).toLocaleDateString()}</span>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg mt-4 border">
            <p class="text-[10px] font-bold text-gray-400 uppercase mb-2">Full Description</p>
            <p class="text-sm text-gray-700 whitespace-pre-wrap">${log.description}</p>
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      confirmButtonColor: '#2563eb',
    });
  };

  const handleLogWork = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Log Maintenance Work',
      width: '600px',
      html: `
        <div class="text-left space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Vessel</label>
              <select id="swal-vessel" class="w-full p-2 border rounded-lg text-sm">
                ${vessels.map(v => `<option value="${v._id}">${v.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Component</label>
              <input id="swal-component" type="text" class="w-full p-2 border rounded-lg text-sm" placeholder="e.g. Main Engine">
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Task Title</label>
            <input id="swal-title" type="text" class="w-full p-2 border rounded-lg text-sm" placeholder="Work performed...">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Type</label>
              <select id="swal-type" class="w-full p-2 border rounded-lg text-sm">
                <option>Routine</option>
                <option>Oil Change</option>
                <option>Overhaul</option>
                <option>Breakdown</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Engine Hours</label>
              <input id="swal-hours" type="number" class="w-full p-2 border rounded-lg text-sm">
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Full Description</label>
            <textarea id="swal-desc" class="w-full p-2 border rounded-lg text-sm h-32"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Submit Log',
      preConfirm: () => {
        return {
          vesselId: document.getElementById('swal-vessel').value,
          component: document.getElementById('swal-component').value,
          title: document.getElementById('swal-title').value,
          type: document.getElementById('swal-type').value,
          engineHours: document.getElementById('swal-hours').value,
          description: document.getElementById('swal-desc').value,
        }
      }
    });

    if (formValues) {
      if (!formValues.title || !formValues.component || !formValues.description) {
        Swal.fire('Required fields missing', '', 'error');
        return;
      }
      try {
        const res = await api.post('/vessel-ops/maintenance', formValues);
        if (res.data.success) {
          Swal.fire('Success', 'Maintenance task logged.', 'success');
          fetchData();
        }
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Failed to log work', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Maintenance & PMS</h2>
          <p className="text-gray-500 text-sm">Planned Maintenance System and work logs.</p>
        </div>
        <button onClick={handleLogWork} className="btn btn-primary shadow-lg">
          <i className="fas fa-tools mr-2"></i> Log New Work
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <div className="card overflow-hidden">
              <div className="card-header bg-gray-50 border-b flex justify-between items-center">
                 <h3 className="font-bold text-gray-700">Maintenance Work History</h3>
                 <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold uppercase tracking-widest">Fleet Logs</span>
              </div>
              <div className="p-0">
                 {loading ? (
                   <div className="p-20 text-center"><i className="fas fa-sync fa-spin text-blue-500 text-2xl"></i></div>
                 ) : logs.length > 0 ? (
                   logs.map((log) => (
                    <div key={log._id} className="flex items-start justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                       <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">{log.type}</span>
                            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-bold uppercase">{log.component}</span>
                          </div>
                          <h4 className="font-bold text-gray-800">{log.title}</h4>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{log.description}</p>
                          <div className="mt-2 flex items-center space-x-4 text-[10px] text-gray-400 font-medium">
                            <span><i className="fas fa-ship mr-1"></i> {log.vesselId?.name}</span>
                            <span><i className="fas fa-calendar mr-1"></i> {new Date(log.datePerformed).toLocaleDateString()}</span>
                            {log.engineHours && <span><i className="fas fa-clock mr-1"></i> {log.engineHours} hrs</span>}
                          </div>
                       </div>
                       <div className="ml-4">
                          <button 
                            onClick={() => handleViewDetails(log)}
                            className="text-blue-500 hover:text-blue-700 text-sm font-bold transition-colors"
                          >
                            Details
                          </button>
                       </div>
                    </div>
                   ))
                 ) : (
                   <div className="p-20 text-center text-gray-400 italic">No maintenance logs found.</div>
                 )}
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="card p-6 bg-gradient-to-br from-gray-900 to-blue-900 text-white border-none shadow-xl">
              <h3 className="font-bold uppercase text-[10px] tracking-widest text-blue-300 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                 <div className="bg-white/10 p-3 rounded-lg border border-white/5">
                    <p className="text-xs text-blue-200">Total Logs (30d)</p>
                    <p className="text-2xl font-bold">{logs.length}</p>
                 </div>
                 <div className="bg-white/10 p-3 rounded-lg border border-white/5">
                    <p className="text-xs text-blue-200">Critical Breakdown</p>
                    <p className="text-2xl font-bold text-red-400">{logs.filter(l => l.type === 'Breakdown').length}</p>
                 </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                 <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-500 transition-all uppercase tracking-widest">
                   Export PMS Report
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
