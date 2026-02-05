import React from 'react';
import Swal from 'sweetalert2';

const Reports = () => {
  const [reports, setReports] = React.useState([
    { id: 'REP-2023-001', type: 'Noon Report', date: 'Oct 15, 2023', status: 'Approved' },
    { id: 'REP-2023-002', type: 'Oil Record', date: 'Oct 14, 2023', status: 'Pending' },
    { id: 'REP-2023-003', type: 'Arrival Report', date: 'Oct 12, 2023', status: 'Approved' },
  ]);

  const [filterStatus, setFilterStatus] = React.useState('All');

  const handleNewReport = () => {
    Swal.fire({
      title: 'Create New Report',
      html: `
        <div class="text-left">
          <label class="block text-sm font-medium mb-1">Report Type</label>
          <select id="swal-type" class="w-full p-2 border rounded-md mb-4 outline-none focus:ring-2 focus:ring-blue-500">
            <option>Noon Report</option>
            <option>Arrival Report</option>
            <option>Departure Report</option>
            <option>Oil Record Book</option>
          </select>
          <label class="block text-sm font-medium mb-1">Remarks</label>
          <textarea id="swal-remarks" class="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter notes..."></textarea>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Submit Report',
      confirmButtonColor: '#2563eb'
    }).then((result) => {
      if (result.isConfirmed) {
        const newRep = {
          id: `REP-2023-00${reports.length + 1}`,
          type: document.getElementById('swal-type').value,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: 'Pending'
        };
        setReports([newRep, ...reports]);
        Swal.fire('Success', 'Report has been generated and queued for transmission.', 'success');
      }
    });
  };

  const handleView = (report) => {
    Swal.fire({
      title: `Report Details: ${report.id}`,
      html: `
        <div class="text-left space-y-3 p-2">
          <div class="flex justify-between border-b pb-2">
            <span class="text-gray-500">Report Type:</span>
            <span class="font-bold text-blue-800">${report.type}</span>
          </div>
          <div class="flex justify-between border-b pb-2">
            <span class="text-gray-500">Submission Date:</span>
            <span class="font-semibold">${report.date}</span>
          </div>
          <div class="flex justify-between border-b pb-2">
            <span class="text-gray-500">Current Status:</span>
            <span class="badge ${report.status === 'Approved' ? 'badge-success' : 'badge-primary'}">${report.status}</span>
          </div>
          ${report.status === 'Pending' ? '<p class="text-[10px] text-yellow-600 bg-yellow-50 p-2 rounded">This report is awaiting verification. You can update its status now.</p>' : ''}
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      showDenyButton: report.status === 'Pending',
      confirmButtonText: 'Download PDF',
      denyButtonText: 'Approve Report',
      denyButtonColor: '#10b981',
      confirmButtonColor: '#2563eb',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Processing PDF', 'Report is being prepared for download...', 'success');
      } else if (result.isDenied) {
        // Update report status to Approved
        setReports(reports.map(r => r.id === report.id ? { ...r, status: 'Approved' } : r));
        Swal.fire('Report Approved', 'Vessel log has been updated.', 'success');
      }
    });
  };

  const filteredReports = reports.filter(report => {
    if (filterStatus === 'All') return true;
    return report.status === filterStatus;
  });

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Daily Reports</h2>
        <button onClick={handleNewReport} className="btn btn-primary">
          <i className="fas fa-plus mr-2"></i> New Report
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
            <p className="text-sm text-gray-500">Submitted Reports</p>
            <h4 className="text-xl font-bold">{reports.length}</h4>
          </div>
        </div>
        <div 
          onClick={() => setFilterStatus('Pending')}
          className={`card p-6 bg-white flex items-center space-x-4 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${filterStatus === 'Pending' ? 'ring-2 ring-yellow-500' : ''}`}
        >
          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fas fa-clock"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Review</p>
            <h4 className="text-xl font-bold">{reports.filter(r => r.status === 'Pending').length}</h4>
          </div>
        </div>
        <div 
          onClick={() => setFilterStatus('Approved')}
          className={`card p-6 bg-white flex items-center space-x-4 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${filterStatus === 'Approved' ? 'ring-2 ring-green-500' : ''}`}
        >
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fas fa-check-circle"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">Approved Reports</p>
            <h4 className="text-xl font-bold">{reports.filter(r => r.status === 'Approved').length}</h4>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="card-header flex justify-between items-center">
          <h3 className="font-semibold">
            {filterStatus === 'All' ? 'All Reports History' : `${filterStatus} Reports`}
          </h3>
          {filterStatus !== 'All' && (
            <button onClick={() => setFilterStatus('All')} className="text-sm text-blue-600 hover:underline">
              Clear Filter
            </button>
          )}
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-4">Report ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReports.length > 0 ? (
                filteredReports.map((report, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{report.id}</td>
                    <td className="px-6 py-4 text-gray-600">{report.type}</td>
                    <td className="px-6 py-4 text-gray-500">{report.date}</td>
                    <td className="px-6 py-4">
                       <span className={`badge ${report.status === 'Approved' ? 'badge-success' : 'badge-primary'}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleView(report)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No reports found matching "{filterStatus}" status.
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

export default Reports;
