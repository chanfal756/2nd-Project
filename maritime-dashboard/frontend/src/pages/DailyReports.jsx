import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';

const DailyReports = () => {
  const [vessels, setVessels] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vesselId: '',
    date: new Date().toISOString().split('T')[0],
    rob_hfo: '',
    rob_mgo: '',
    rob_lube_oil: '',
    consumption_hfo: '',
    consumption_mgo: '',
    me_hours: '',
    ae_hours: '',
    average_speed: '',
    weather_condition: 'Good',
    remarks: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vesselsRes, reportsRes] = await Promise.all([
        api.get('/vessels'),
        api.get('/vessel-ops/fuel-reports')
      ]);
      setVessels(vesselsRes.data.data);
      setReports(reportsRes.data.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/vessel-ops/fuel-reports', formData);
      if (res.data.success) {
        Swal.fire('Success', 'Daily report submitted successfully', 'success');
        setShowForm(false);
        fetchData();
        setFormData({
          vesselId: '',
          date: new Date().toISOString().split('T')[0],
          rob_hfo: '',
          rob_mgo: '',
          rob_lube_oil: '',
          consumption_hfo: '',
          consumption_mgo: '',
          me_hours: '',
          ae_hours: '',
          average_speed: '',
          weather_condition: 'Good',
          remarks: ''
        });
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Submission failed', 'error');
    }
  };

  const handleViewReport = (report) => {
    Swal.fire({
      title: `<span class="text-blue-600">Noon Report Detail</span>`,
      width: '600px',
      html: `
        <div class="text-left font-sans">
          <div class="flex justify-between items-center mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div>
              <p class="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Vessel Name</p>
              <h3 class="text-xl font-bold text-blue-900">${report.vesselId?.name}</h3>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Report Date</p>
              <p class="text-sm font-bold text-blue-900">${new Date(report.date).toLocaleDateString()}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6 mb-6">
            <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <h4 class="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center">
                <i class="fas fa-gas-pump mr-2 text-blue-500"></i> Consumption (24h)
              </h4>
              <div class="space-y-2">
                <div class="flex justify-between border-b border-gray-200 pb-1">
                  <span class="text-sm text-gray-600">HFO:</span>
                  <span class="text-sm font-bold text-orange-600">${report.consumption_hfo} MT</span>
                </div>
                <div class="flex justify-between border-b border-gray-200 pb-1">
                  <span class="text-sm text-gray-600">MGO:</span>
                  <span class="text-sm font-bold text-orange-600">${report.consumption_mgo} MT</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Avg Speed:</span>
                  <span class="text-sm font-bold">${report.average_speed || 'N/A'} kts</span>
                </div>
              </div>
            </div>

            <div class="p-4 bg-blue-50/30 rounded-xl border border-blue-100">
              <h4 class="text-xs font-bold text-blue-400 uppercase mb-3 flex items-center">
                <i class="fas fa-warehouse mr-2 text-blue-500"></i> ROB Levels
              </h4>
              <div class="space-y-2">
                <div class="flex justify-between border-b border-blue-100 pb-1">
                  <span class="text-sm text-gray-600">HFO:</span>
                  <span class="text-sm font-bold text-blue-700">${report.rob_hfo} MT</span>
                </div>
                <div class="flex justify-between border-b border-blue-100 pb-1">
                  <span class="text-sm text-gray-600">MGO:</span>
                  <span class="text-sm font-bold text-blue-700">${report.rob_mgo} MT</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Lube Oil:</span>
                  <span class="text-sm font-bold text-blue-700">${report.rob_lube_oil || 'N/A'} MT</span>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 mb-6">
             <div class="text-center p-2 rounded bg-gray-50">
               <p class="text-[9px] text-gray-400 uppercase font-bold">ME Hours</p>
               <p class="font-bold text-sm">${report.me_hours || 'N/A'}</p>
             </div>
             <div class="text-center p-2 rounded bg-gray-50">
               <p class="text-[9px] text-gray-400 uppercase font-bold">AE Hours</p>
               <p class="font-bold text-sm">${report.ae_hours || 'N/A'}</p>
             </div>
             <div class="text-center p-2 rounded bg-gray-50">
               <p class="text-[9px] text-gray-400 uppercase font-bold">Weather</p>
               <p class="font-bold text-sm text-blue-600">${report.weather_condition}</p>
             </div>
          </div>

          <div class="p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-sm">
            <h4 class="text-[10px] font-bold text-yellow-600 uppercase mb-1">Remarks/Observations</h4>
            <p class="text-yellow-800 leading-relaxed italic">${report.remarks || 'No remarks provided for this report.'}</p>
          </div>
        </div>
      `,
      confirmButtonText: 'Print/Download',
      confirmButtonColor: '#2563eb',
      showCloseButton: true,
      cancelButtonText: 'Close',
      showCancelButton: true,
      cancelButtonColor: '#6b7280'
    });
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Fuel & Oil Reporting</h2>
          <p className="text-gray-500 text-sm">Official daily consumption and ROB tracking.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'} shadow-lg`}
        >
          {showForm ? 'Cancel Report' : <><i className="fas fa-plus mr-2"></i> Submit Noon Report</>}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 bg-gradient-to-br from-white to-blue-50 border-blue-100 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Vessel</label>
                <select 
                  className="w-full p-2.5 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                  value={formData.vesselId}
                  onChange={(e) => setFormData({...formData, vesselId: e.target.value})}
                  required
                >
                  <option value="">Select Vessel...</option>
                  {vessels.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Report Date</label>
                <input 
                  type="date"
                  className="w-full p-2.5 border rounded-lg bg-white shadow-sm"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Weather Condition</label>
                <select 
                  className="w-full p-2.5 border rounded-lg bg-white shadow-sm"
                  value={formData.weather_condition}
                  onChange={(e) => setFormData({...formData, weather_condition: e.target.value})}
                >
                  <option>Good</option>
                  <option>Moderate</option>
                  <option>Rough</option>
                  <option>Heavy Storm</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t">
              <div className="space-y-4">
                <h4 className="font-bold text-blue-800 flex items-center"><i className="fas fa-gas-pump mr-2"></i> ROB (REMAINING ON BOARD)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">HFO (MT)</label>
                    <input type="number" step="0.1" className="w-full p-2 border rounded" value={formData.rob_hfo} onChange={e => setFormData({...formData, rob_hfo: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">MGO (MT)</label>
                    <input type="number" step="0.1" className="w-full p-2 border rounded" value={formData.rob_mgo} onChange={e => setFormData({...formData, rob_mgo: e.target.value})} required />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-orange-800 flex items-center"><i className="fas fa-tachometer-alt mr-2"></i> CONSUMPTION (LAST 24H)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">HFO (MT)</label>
                    <input type="number" step="0.1" className="w-full p-2 border rounded" value={formData.consumption_hfo} onChange={e => setFormData({...formData, consumption_hfo: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">MGO (MT)</label>
                    <input type="number" step="0.1" className="w-full p-2 border rounded" value={formData.consumption_mgo} onChange={e => setFormData({...formData, consumption_mgo: e.target.value})} required />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <label className="block text-xs font-medium text-gray-500">ME Hours</label>
                <input type="number" className="w-full p-2 border rounded" value={formData.me_hours} onChange={e => setFormData({...formData, me_hours: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">AE Hours</label>
                <input type="number" className="w-full p-2 border rounded" value={formData.ae_hours} onChange={e => setFormData({...formData, ae_hours: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Avg Speed (kts)</label>
                <input type="number" step="0.1" className="w-full p-2 border rounded" value={formData.average_speed} onChange={e => setFormData({...formData, average_speed: e.target.value})} />
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 shadow-md">
                  Submit Final Report
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden border-none shadow-xl bg-white">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center font-bold text-gray-700 text-sm">
           <span>Fleet Reporting Log</span>
           <span className="text-xs text-blue-600 uppercase tracking-tighter">Live Updates</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-6 py-3 text-left">Vessel</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-right">HFO Cons</th>
                <th className="px-6 py-3 text-right">MGO Cons</th>
                <th className="px-6 py-3 text-right">ROB HFO</th>
                <th className="px-6 py-3 text-right">Speed</th>
                <th className="px-6 py-3 text-center">Weather</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((r) => (
                <tr key={r._id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-blue-900">{r.vesselId?.name}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right font-medium text-orange-600">{r.consumption_hfo} MT</td>
                  <td className="px-6 py-4 text-right font-medium text-orange-600">{r.consumption_mgo} MT</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">{r.rob_hfo} MT</td>
                  <td className="px-6 py-4 text-right">{r.average_speed} kts</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      r.weather_condition === 'Good' ? 'bg-green-100 text-green-700' : 
                      r.weather_condition === 'Rough' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {r.weather_condition}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleViewReport(r)}
                      className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-all"
                    >
                      <i className="fas fa-eye mr-1"></i> View
                    </button>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center text-gray-400 italic">
                    No daily reports found. Submit your first report to see it here.
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

export default DailyReports;
