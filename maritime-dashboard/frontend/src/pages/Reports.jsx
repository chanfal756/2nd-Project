import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch reports from database
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports');
      if (response.data.success) {
        setReports(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      Swal.fire('Error', 'Failed to load reports from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleNewReport = () => {
    Swal.fire({
      title: 'Create New Report',
      html: `
        <div class="text-left space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Report Type</label>
            <select id="swal-type" class="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Noon Report">Noon Report</option>
              <option value="Arrival Report">Arrival Report</option>
              <option value="Departure Report">Departure Report</option>
              <option value="Oil Record Book">Oil Record Book</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Vessel Name</label>
            <input id="swal-vessel" type="text" class="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. MV North Star" value="MV North Star">
          </div>
          <div id="type-specific-fields" class="space-y-4 pt-2 border-t">
            <!-- Noon Report Fields (Default) -->
            <div class="grid grid-cols-2 gap-2">
              <div>
                 <label class="text-[10px] uppercase text-gray-500">Position</label>
                 <input id="swal-pos" type="text" class="w-full p-1 border rounded text-sm" placeholder="Lat/Long">
              </div>
              <div>
                 <label class="text-[10px] uppercase text-gray-500">Speed (kts)</label>
                 <input id="swal-speed" type="text" class="w-full p-1 border rounded text-sm" placeholder="12.5">
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Remarks/Notes</label>
            <textarea id="swal-remarks" class="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter notes..."></textarea>
          </div>
        </div>
      `,
      didOpen: () => {
        const typeSelect = document.getElementById('swal-type');
        const container = document.getElementById('type-specific-fields');
        
        typeSelect.addEventListener('change', (e) => {
          const type = e.target.value;
          if (type === 'Noon Report') {
            container.innerHTML = `
              <div class="space-y-3">
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="text-[10px] uppercase text-gray-500 font-bold">GPS Position</label>
                    <input id="swal-pos" type="text" class="w-full p-2 border rounded text-xs" placeholder="e.g. 01°23'N 103°45'E">
                  </div>
                  <div>
                    <label class="text-[10px] uppercase text-gray-500 font-bold">Speed (kts)</label>
                    <input id="swal-speed" type="text" class="w-full p-2 border rounded text-xs" placeholder="12.5">
                  </div>
                </div>
                <div>
                  <label class="text-[10px] uppercase text-gray-500 font-bold">Fuel Type</label>
                  <select id="swal-fuel-type" class="w-full p-2 border rounded text-xs">
                    <option>HFO (Heavy Fuel Oil)</option>
                    <option>MGO (Marine Gas Oil)</option>
                    <option>VLSFO (Low Sulfur)</option>
                  </select>
                </div>
              </div>
            `;
          } else if (type === 'Arrival Report' || type === 'Departure Report') {
            container.innerHTML = `
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-[10px] uppercase text-gray-500">Port / Anchorage</label>
                  <input id="swal-port" type="text" class="w-full p-2 border rounded text-sm" placeholder="Port Name">
                </div>
                <div>
                  <label class="text-[10px] uppercase text-gray-500">GPS Coords</label>
                  <input id="swal-pos" type="text" class="w-full p-2 border rounded text-sm" placeholder="Lat/Lon">
                </div>
              </div>
            `;
          } else {
            container.innerHTML = `
              <div class="space-y-3">
                <div>
                  <label class="text-[10px] uppercase text-gray-500 font-bold">Oil Type</label>
                  <select id="swal-oil-type" class="w-full p-2 border rounded text-xs">
                    <option>Main Engine Lube Oil</option>
                    <option>Aux Engine Lube Oil</option>
                    <option>Hydraulic Oil</option>
                    <option>Sludge / Waste Oil</option>
                  </select>
                </div>
                <div>
                  <label class="text-[10px] uppercase text-gray-500 font-bold">Operation / Tank</label>
                  <input id="swal-op" type="text" class="w-full p-2 border rounded text-xs" placeholder="Bunkering / Transfer">
                </div>
              </div>
            `;
          }
        });
      },
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Submit Report',
      confirmButtonColor: '#2563eb'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const reportType = document.getElementById('swal-type').value;
          const vesselName = document.getElementById('swal-vessel').value;
          const remarks = document.getElementById('swal-remarks').value;
          
          let details = { remark: remarks };
          if (reportType === 'Noon Report') {
            details.position = document.getElementById('swal-pos')?.value;
            details.speed = document.getElementById('swal-speed')?.value;
            details.fuelType = document.getElementById('swal-fuel-type')?.value;
          } else if (reportType.includes('Arrival') || reportType.includes('Departure')) {
            details.port = document.getElementById('swal-port')?.value;
            details.position = document.getElementById('swal-pos')?.value;
            details.draft = { forward: document.getElementById('swal-draft')?.value };
          } else {
            details.operation = document.getElementById('swal-op')?.value;
            details.oilType = document.getElementById('swal-oil-type')?.value;
          }

          const response = await api.post('/reports', {
            reportType,
            vesselName,
            details
          });

          if (response.data.success) {
            setReports([response.data.data, ...reports]);
            Swal.fire('Success', 'Report has been saved to database.', 'success');
          }
        } catch (error) {
          console.error('Error creating report:', error);
          Swal.fire('Error', error.response?.data?.message || 'Failed to create report', 'error');
        }
      }
    });
  };

  const handleView = (report) => {
    Swal.fire({
      title: `${report.reportType}`,
      html: `
        <div class="text-left space-y-3 p-2">
          <div class="flex justify-between border-b pb-2">
            <span class="text-gray-500">Reference:</span>
            <span class="font-bold text-blue-800">${report.referenceNumber || report._id.substring(0,8)}</span>
          </div>
          <div class="flex justify-between border-b pb-2">
            <span class="text-gray-500">Vessel:</span>
            <span class="font-semibold">${report.vesselName}</span>
          </div>
          <div class="flex justify-between border-b pb-2">
            <span class="text-gray-500">Date:</span>
            <span class="font-semibold">${new Date(report.reportDate).toLocaleString()}</span>
          </div>
          <div class="flex justify-between border-b pb-2">
            <span class="text-gray-500">Status:</span>
            <span class="badge ${report.status === 'approved' ? 'badge-success' : 'badge-primary'}">${report.status.toUpperCase()}</span>
          </div>
          <div class="flex justify-between border-b pb-2">
            <span class="text-gray-500">Submitted By:</span>
            <div class="text-right">
              <span class="font-semibold block text-gray-800">${report.reportedBy?.name || 'Unknown'}</span>
              <span class="text-[10px] text-gray-400 font-mono">${report.reportedBy?.email || ''}</span>
            </div>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg mt-4">
            <p class="text-xs font-bold text-gray-400 uppercase mb-2">Details</p>
            ${Object.entries(report.details || {}).map(([key, value]) => {
              if (typeof value === 'object') return '';
              return `<div class="flex justify-between text-sm py-1">
                <span class="capitalize text-gray-600">${key}:</span>
                <span class="font-medium">${value || 'N/A'}</span>
              </div>`;
            }).join('')}
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Download PDF',
      confirmButtonColor: '#2563eb',
    });
  };

  const filteredReports = reports.filter(report => {
    const matchesStatus = filterStatus === 'All' || report.status.toLowerCase() === filterStatus.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = report.reportType.toLowerCase().includes(searchLower) || 
                          report.vesselName.toLowerCase().includes(searchLower) ||
                          (report.referenceNumber && report.referenceNumber.toLowerCase().includes(searchLower));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Maritime Reports Log</h2>
          <p className="text-gray-500 text-sm">Manage and view all vessel communications and records.</p>
        </div>
        <button onClick={handleNewReport} className="btn btn-primary">
          <i className="fas fa-plus mr-2"></i> Create Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => setFilterStatus('All')}
          className={`card p-6 bg-white flex items-center space-x-4 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${filterStatus === 'All' ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fas fa-file-invoice"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Records</p>
            <h4 className="text-xl font-bold">{reports.length}</h4>
          </div>
        </div>
        <div 
          onClick={() => setFilterStatus('submitted')}
          className={`card p-6 bg-white flex items-center space-x-4 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${filterStatus === 'submitted' ? 'ring-2 ring-yellow-500' : ''}`}
        >
          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fas fa-clock"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Review</p>
            <h4 className="text-xl font-bold">{reports.filter(r => r.status === 'submitted').length}</h4>
          </div>
        </div>
        <div 
          onClick={() => setFilterStatus('approved')}
          className={`card p-6 bg-white flex items-center space-x-4 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${filterStatus === 'approved' ? 'ring-2 ring-green-500' : ''}`}
        >
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fas fa-check-circle"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">Approved Files</p>
            <h4 className="text-xl font-bold">{reports.filter(r => r.status === 'approved').length}</h4>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="card-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="font-semibold text-lg">
            {filterStatus === 'All' ? 'System History' : `${filterStatus.toUpperCase()} Records`}
          </h3>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-grow">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                placeholder="Search reports..." 
                className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            { (searchTerm || filterStatus !== 'All') && (
              <button 
                onClick={() => {setFilterStatus('All'); setSearchTerm('')}} 
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-all font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        <div className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              Synchronizing with server...
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Ref Number</th>
                  <th className="px-6 py-4">Report Details</th>
                  <th className="px-6 py-4">Reporter</th>
                  <th className="px-6 py-4">Submission</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report, i) => (
                    <tr key={report._id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-blue-700 font-semibold">
                        {report.referenceNumber || report._id.substring(0,8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800">{report.reportType}</span>
                          <span className="text-xs text-gray-500">{report.vesselName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold uppercase">
                            {report.reportedBy?.name?.substring(0,2) || '??'}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{report.reportedBy?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                           <span className="text-sm font-medium text-gray-700">
                            {new Date(report.reportDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(report.reportDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight ${
                           report.status === 'approved' 
                           ? 'bg-green-100 text-green-700' 
                           : 'bg-yellow-100 text-yellow-700 uppercase'
                         }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleView(report)}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white p-2 rounded-lg transition-all"
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <i className="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                        <p className="font-medium">No reports matching your criteria.</p>
                        <p className="text-xs">Try adjusting your filters or search term.</p>
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

export default Reports;
