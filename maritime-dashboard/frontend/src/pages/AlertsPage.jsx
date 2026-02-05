import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, level: 'High', msg: 'Main Engine Cylinder 4 Exhaust Temp High', source: 'ER Monitoring', time: '10 mins ago', icon: 'fa-exclamation-circle', color: 'red' },
    { id: 2, level: 'Medium', msg: 'Daily Report Submission Overdue (2h)', source: 'Operations', time: '1 hour ago', icon: 'fa-clock', color: 'yellow' },
    { id: 3, level: 'Low', msg: 'Satellite Connection Handover Successful', source: 'Comms', time: '3 hours ago', icon: 'fa-info-circle', color: 'blue' },
    { id: 4, level: 'High', msg: 'Low Fuel Pressure Alarm - Aux Engine 2', source: 'Fuel System', time: '08:15 UTC', icon: 'fa-exclamation-triangle', color: 'red' },
  ]);

  const handleAcknowledge = (id) => {
    Swal.fire({
      title: 'Acknowledge Alert?',
      text: "This will remove the alert from the active list.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, acknowledge it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setAlerts(alerts.filter(alert => alert.id !== id));
        Swal.fire(
          'Acknowledged!',
          'The alert has been cleared.',
          'success'
        );
      }
    });
  };

  const handleDetails = (alert) => {
    let recommendation = '';
    
    switch(alert.source) {
      case 'Operations':
        recommendation = 'Verify daily logged data with the Chief Officer. Ensure submission before 1200 UTC to avoid compliance flags.';
        break;
      case 'Fuel System':
        recommendation = 'Check booster pump discharge pressure and duplex filter differential. Switch to standby filter if P > 0.5 bar.';
        break;
      case 'ER Monitoring':
        recommendation = 'Investigate local exhaust gas pyrometer. If reading confirms high temp, reduce engine load immediately and inspect fuel injector.';
        break;
      case 'Comms':
        recommendation = 'Routine automated log entry. No physical intervention required unless signal strength drops below -85dBm.';
        break;
      default:
        recommendation = 'Monitor situation. Acknowledgement logs user interaction with this alert.';
    }

    Swal.fire({
      title: 'Alert Details',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Message:</strong> ${alert.msg}</p>
          <div class="grid grid-cols-2 gap-2 text-sm mb-3">
            <div><strong>Source:</strong> ${alert.source}</div>
            <div><strong>Time:</strong> ${alert.time}</div>
            <div><strong>Priority:</strong> <span class="uppercase font-bold text-${alert.color === 'yellow' ? 'yellow-600' : alert.color === 'red' ? 'red-600' : 'blue-600'}">${alert.level}</span></div>
          </div>
          <hr class="my-3 border-gray-200"/>
          <p class="text-sm text-gray-600">
            <strong>System Recommendation:</strong><br/>
            ${recommendation}
          </p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      confirmButtonColor: '#3085d6',
    });
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">System Alerts & Notifications</h2>
        <button className="btn btn-secondary" onClick={() => setAlerts([])}>Clear All Non-Critical</button>
      </div>

      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className={`flex items-start p-4 bg-white border-l-4 rounded-r-lg shadow-sm border-${alert.color}-500 transition-all duration-300 hover:shadow-md`}>
               <div className={`text-${alert.color}-500 text-xl mr-4 mt-1`}>
                  <i className={`fas ${alert.icon}`}></i>
               </div>
               <div className="flex-1">
                  <div className="flex justify-between">
                     <p className="font-bold text-gray-800">{alert.msg}</p>
                     <span className="text-xs text-gray-400 font-medium">{alert.time}</span>
                  </div>
                  <div className="flex items-center mt-1 space-x-3">
                     <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">{alert.source}</span>
                     <span className="text-xs text-gray-300">•</span>
                     <span className={`text-xs font-bold text-${alert.color}-600 uppercase`}>{alert.level} Priority</span>
                  </div>
               </div>
               <div className="ml-4 flex space-x-2">
                  <button 
                    onClick={() => handleAcknowledge(alert.id)}
                    className="p-2 hover:bg-green-50 rounded-lg text-gray-400 hover:text-green-600 transition-colors" 
                    title="Acknowledge"
                  >
                    <i className="fas fa-check"></i>
                  </button>
                  <button 
                    onClick={() => handleDetails(alert)}
                    className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors" 
                    title="Details"
                  >
                    <i className="fas fa-external-link-alt text-sm"></i>
                  </button>
               </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-green-500 text-5xl mb-4"><i className="fas fa-check-circle"></i></div>
            <h3 className="text-xl font-bold text-gray-800">All Clear</h3>
            <p className="text-gray-500">No active alerts at this time.</p>
          </div>
        )}
      </div>

      <div className="text-center py-12">
         <p className="text-gray-400 text-sm">No older notifications to show</p>
      </div>
    </div>
  );
};

export default AlertsPage;
