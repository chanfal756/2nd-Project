import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/alerts');
      if (response.data.success) {
        setAlerts(response.data.data);
      }
    } catch (error) {
      console.error('Fetch alerts failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAcknowledge = async (id) => {
    try {
      const response = await api.put(`/alerts/${id}/acknowledge`);
      if (response.data.success) {
        setAlerts(alerts.map(a => a._id === id ? { ...a, acknowledgedBy: [...(a.acknowledgedBy || []), 'ME'] } : a));
        Swal.fire({
          icon: 'success',
          title: 'Acknowledged',
          text: 'You have successfully acknowledged this command update.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to acknowledge alert', 'error');
    }
  };

  const handleDetails = (alert) => {
    Swal.fire({
      title: 'Broadcast Details',
      html: `
        <div class="text-left">
          <p class="mb-2 text-lg font-bold text-blue-900 uppercase">Headline: ${alert.title}</p>
          <div class="bg-gray-50 p-4 rounded-lg mb-4 text-gray-700 italic border-l-4 border-blue-200">
             "${alert.message || alert.content}"
          </div>
          <div class="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div class="flex flex-col">
              <span class="text-gray-400 uppercase">Origin</span>
              <span>${alert.category} / ${alert.createdBy?.role || 'Admin'}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-400 uppercase">Vessel Assignment</span>
              <span class="text-blue-600">${alert.vessel?.name || 'GLOBAL FLEET'}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-400 uppercase">Posted At</span>
              <span>${new Date(alert.createdAt).toLocaleString()}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-400 uppercase">Priority Status</span>
              <span class="uppercase ${alert.priority === 'urgent' ? 'text-red-600' : alert.priority === 'high' ? 'text-yellow-600' : 'text-blue-600'}">${alert.priority}</span>
            </div>
          </div>
          <hr class="my-4 border-gray-100"/>
          <p class="text-[10px] text-gray-400 text-center">Reference ID: ${alert._id}</p>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true
    });
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">System Alerts & Notifications</h2>
          <p className="text-gray-500 text-sm">Real-time command center updates and vessel broadcasts.</p>
        </div>
        <div className="flex space-x-2">
           <button 
             onClick={fetchAlerts}
             className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200"
           >
             <i className="fas fa-sync-alt mr-2"></i> Refresh
           </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
             <div className="animate-spin text-blue-600 text-3xl mb-4"><i className="fas fa-circle-notch"></i></div>
             <p className="text-gray-500 font-medium">Synchronizing fleet alerts...</p>
          </div>
        ) : alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert._id} className={`flex items-start p-4 bg-white border-l-4 rounded-r-lg shadow-sm ${alert.priority === 'urgent' ? 'border-red-500' : alert.priority === 'high' ? 'border-yellow-500' : 'border-blue-500'} transition-all hover:bg-gray-50`}>
               <div className={`${alert.priority === 'urgent' ? 'text-red-500' : alert.priority === 'high' ? 'text-yellow-500' : 'text-blue-500'} text-xl mr-4 mt-1`}>
                  <i className={`fas ${alert.priority === 'urgent' ? 'fa-exclamation-triangle' : 'fa-info-circle'}`}></i>
               </div>
               <div className="flex-1">
                  <div className="flex justify-between">
                     <p className="font-bold text-gray-800 uppercase tracking-tight">{alert.title}</p>
                     <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-bold">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">{alert.message || alert.content}</p>
                  <div className="flex items-center mt-2 space-x-3">
                     <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                       <i className="fas fa-ship mr-1"></i> {alert.vessel?.name || 'GLOBAL'}
                     </span>
                     <span className="text-xs text-gray-200">|</span>
                     <span className={`text-[10px] font-bold uppercase ${alert.priority === 'urgent' ? 'text-red-600' : 'text-gray-500'}`}>{alert.category}</span>
                  </div>
               </div>
               <div className="ml-4 flex items-center space-x-2">
                  <button 
                    onClick={() => handleAcknowledge(alert._id)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors" 
                  >
                    <i className="fas fa-check-double italic"></i>
                    <span>ACK</span>
                  </button>
                  <button 
                    onClick={() => handleDetails(alert)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" 
                  >
                    <i className="fas fa-external-link-alt text-sm"></i>
                  </button>
               </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-200">
            <div className="text-green-500 text-5xl mb-4"><i className="fas fa-check-circle"></i></div>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight text-gradient">All Clear</h3>
            <p className="text-gray-500 max-w-xs mx-auto text-sm">Your fleet is operating normally. No active alerts from the Captain's Command Center.</p>
          </div>
        )}
      </div>

      <div className="text-center py-8">
         <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">End of fleet broadcast logs</p>
      </div>
    </div>
  );
};

export default AlertsPage;
