import React from 'react';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const handleSubmitReport = () => {
    Swal.fire({
      title: 'Submit Daily Report?',
      text: "You are about to submit the oil consumption report.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit!',
      confirmButtonColor: '#2563eb'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Submitted!', 'Report has been queued for sync.', 'success');
      }
    });
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Alert Banner */}
      <div className="alert alert-warning flex items-start p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg">
        <i className="fas fa-exclamation-triangle mr-3 text-lg mt-0.5"></i>
        <div className="flex-1">
          <p className="font-medium">Daily report due in 2 hours</p>
          <p className="text-sm mt-1">Please submit today's oil consumption report by 23:59 UTC</p>
        </div>
        <button 
          onClick={handleSubmitReport}
          className="btn btn-primary text-xs px-3 py-1"
        >
          Submit Now
        </button>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid">
        <div 
          onClick={() => {
            Swal.fire({
              title: 'Main Engine Status',
              html: `
                <div class="text-left">
                  <p><strong>Running Hours:</strong> 12,458 h</p>
                  <p><strong>Last Overhaul:</strong> 8,000 h</p>
                  <p class="text-blue-600 font-bold">Next Overhaul Due: 13,000 h</p>
                </div>
              `,
              icon: 'info',
              confirmButtonText: 'Go to Maintenance Schedule',
              confirmButtonColor: '#2563eb'
            }).then((result) => {
              if (result.isConfirmed) {
                // Assuming you have navigate extracted from useNavigate() hook
                 window.location.href = '/maintenance';
              }
            });
          }}
          className="card stat-card p-4 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm">Total Main Engine Hours</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">12,458 h</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <i className="fas fa-cogs"></i>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-xs text-gray-500">Next overhaul in 542 hours</p>
        </div>

        <div 
          onClick={() => {
            Swal.fire({
              title: 'Fuel Efficiency Data',
              html: `
                <div class="text-left text-sm">
                  <div class="flex justify-between border-b py-2"><span>M/E Consumption:</span> <strong>24.5 MT/day</strong></div>
                  <div class="flex justify-between border-b py-2"><span>A/E Consumption:</span> <strong>3.2 MT/day</strong></div>
                  <div class="flex justify-between py-2 text-green-600"><span>SFOC:</span> <strong>168 g/kWh</strong></div>
                </div>
              `,
              icon: 'success',
              confirmButtonText: 'View Consumption Reports',
              confirmButtonColor: '#10b981'
            }).then((result) => {
              if (result.isConfirmed) {
                 window.location.href = '/reports';
              }
            });
          }}
          className="card stat-card success p-4 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm">Fuel Efficiency</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">98.2%</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <i className="fas fa-leaf"></i>
            </div>
          </div>
          <div className="flex items-center text-xs text-green-600 font-medium">
            <i className="fas fa-arrow-up mr-1"></i>
            <span>2.1% better than fleet avg</span>
          </div>
        </div>

        <div 
          onClick={() => window.location.href = '/alerts'}
          className="card stat-card warning p-4 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm">Pending Alerts</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">3</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
              <i className="fas fa-bell"></i>
            </div>
          </div>
          <p className="text-xs text-red-500 font-medium">1 High Priority Alert</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h3 className="font-semibold">Recent Activities</h3>
            <button 
              onClick={() => {
                Swal.fire({
                  title: 'Activity Options',
                  input: 'radio',
                  inputOptions: {
                    'export': 'Export Activity Logs (CSV)',
                    'filter': 'Filter Events',
                    'clear': 'Clear History'
                  },
                  inputValidator: (value) => {
                    if (!value) {
                      return 'You need to choose an option!'
                    }
                  },
                  inputValue: 'export',
                  showCancelButton: true,
                  confirmButtonText: 'Proceed',
                  confirmButtonColor: '#2563eb'
                }).then((result) => {
                  if (result.isConfirmed) {
                    if(result.value === 'export') {
                      Swal.fire('Exporting...', 'The activity log is being prepared for download.', 'success');
                    } else if (result.value === 'filter') {
                      Swal.fire('Filter', 'Filter modal would open here.', 'info');
                    } else if (result.value === 'clear') {
                      Swal.fire('Cleared', 'Activity history has been cleared.', 'success');
                    }
                  }
                });
              }}
              className="text-blue-100 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
            >
              <i className="fas fa-ellipsis-h"></i>
            </button>
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Event</th>
                  <th className="px-6 py-3 font-medium">Time (UTC)</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr 
                  onClick={() => {
                    Swal.fire({
                      title: 'Sync Details',
                      html: `
                        <div class="text-left text-sm">
                          <p><strong>Report ID:</strong> NR-2023-10-15</p>
                          <p><strong>Status:</strong> <span class="text-green-600">Successfully Synced</span></p>
                          <p><strong>Data Size:</strong> 45 KB</p>
                          <p><strong>Latency:</strong> 240ms</p>
                        </div>
                      `,
                      icon: 'success',
                      confirmButtonText: 'View Reports Log',
                      confirmButtonColor: '#2563eb'
                    }).then((result) => {
                      if (result.isConfirmed) window.location.href = '/reports';
                    });
                  }}
                  className="table-row cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
                        <i className="fas fa-sync-alt text-xs"></i>
                      </div>
                      <span className="font-medium text-gray-800">Noon Report Sync</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">12:05</td>
                  <td className="px-6 py-4"><span className="badge badge-success">Completed</span></td>
                </tr>
                <tr 
                  onClick={() => {
                    Swal.fire({
                      title: 'Satellite Handover',
                      html: `
                        <div class="text-left text-sm">
                          <p><strong>New Satellite:</strong> I-4 F1 APAC</p>
                          <p><strong>Provider:</strong> Inmarsat Fleet Xpress</p>
                          <p><strong>Beam ID:</strong> 1045</p>
                          <p><strong>Signal (SNR):</strong> <span class="text-green-600 font-bold">54 dB (Strong)</span></p>
                        </div>
                      `,
                      icon: 'info',
                      confirmButtonText: 'Bite Test',
                      confirmButtonColor: '#0ea5e9'
                    });
                  }}
                  className="table-row cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center mr-3">
                        <i className="fas fa-wifi text-xs"></i>
                      </div>
                      <span className="font-medium text-gray-800">Satcom Handover</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">10:42</td>
                  <td className="px-6 py-4"><span className="badge badge-success">Stable</span></td>
                </tr>
                 <tr 
                   onClick={() => {
                     Swal.fire({
                       title: 'Critical Alarm: Aux Engine 2',
                       html: `
                         <div class="text-left text-sm bg-red-50 p-3 rounded">
                           <p class="text-red-700 font-bold mb-2">ALARM CODE: AE2-LPS-004</p>
                           <p><strong>Condition:</strong> Low Fuel Pressure</p>
                           <p><strong>Value:</strong> 3.2 Bar (Limit > 3.8 Bar)</p>
                           <p class="mt-2 text-red-600"><strong>Recommended Action:</strong> Check fuel booster pump immediately. Change over to standby filter.</p>
                         </div>
                       `,
                       icon: 'warning',
                       confirmButtonText: 'Go to Maintenance',
                       confirmButtonColor: '#ef4444'
                     }).then((result) => {
                       if (result.isConfirmed) window.location.href = '/maintenance';
                     });
                   }}
                   className="table-row cursor-pointer hover:bg-gray-50 transition-colors"
                 >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center mr-3">
                        <i className="fas fa-exclamation text-xs"></i>
                      </div>
                      <span className="font-medium text-gray-800">Aux Engine 2 Alarm</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">08:15</td>
                  <td className="px-6 py-4"><span className="badge badge-danger">Pending</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Voyage Progress */}
        <div className="card p-6">
          <h3 className="font-bold text-gray-800 mb-4">Voyage Progress</h3>
          <div className="relative pl-4 border-l-2 border-gray-200 space-y-8">
            <div className="relative">
              <span className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></span>
              <h4 className="text-sm font-semibold text-gray-800">Singapore</h4>
              <p className="text-xs text-gray-500">Departure: Oct 12, 08:00 UTC</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[23px] top-0 w-5 h-5 rounded-full bg-blue-600 border-4 border-blue-100 flex items-center justify-center">
                 <i className="fas fa-ship text-[8px] text-white"></i>
              </span>
              <h4 className="text-sm font-semibold text-blue-600">Current Position</h4>
              <p className="text-xs text-gray-500">Malacca Strait</p>
              <div className="mt-2 bg-blue-50 p-2 rounded text-xs text-blue-700">
                ETA: Oct 18, 14:00 UTC
              </div>
            </div>
             <div className="relative">
              <span className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-gray-300 border-2 border-white"></span>
              <h4 className="text-sm font-semibold text-gray-400">Rotterdam</h4>
              <p className="text-xs text-gray-500">Destination</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
