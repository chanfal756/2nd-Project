import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Maintenance = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([
    { id: 1, task: 'Main Engine Injector Inspection', system: 'Propulsion', due: 'In 2 days', priority: 'High', status: 'Pending' },
    { id: 2, task: 'Emergency Gen. Load Test', system: 'Emergency', due: 'In 3 days', priority: 'Medium', status: 'Pending' },
    { id: 3, task: 'Fire Pump Annual Service', system: 'Safety', due: 'In 5 days', priority: 'High', status: 'Pending' },
    { id: 4, task: 'A/C Condenser Cleaning', system: 'Auxiliary', due: 'In 6 days', priority: 'Low', status: 'Pending' },
  ]);

  const [orderStatus, setOrderStatus] = useState('Pending'); // 'Pending' (needs order) or 'Placed'

  const handleTelemetry = () => {
    Swal.fire({
      title: 'Engine Telemetry - Live Data',
      width: '600px',
      html: `
        <div class="text-left font-mono text-sm bg-black text-green-400 p-4 rounded-lg">
          <div class="mb-2 border-b border-green-800 pb-2">DATA SOURCE: MAIN ENGINE CONTROL UNIT (MECU-A)</div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-gray-500">CYLINDER EXHAUST TEMPS</div>
              <div class="flex justify-between"><span>CYL 1:</span> <span>382°C</span></div>
              <div class="flex justify-between"><span>CYL 2:</span> <span>384°C</span></div>
              <div class="flex justify-between"><span class="text-red-500">CYL 3:</span> <span class="text-red-500 animate-pulse">385°C ▲</span></div>
              <div class="flex justify-between"><span>CYL 4:</span> <span>380°C</span></div>
              <div class="flex justify-between"><span>CYL 5:</span> <span>381°C</span></div>
              <div class="flex justify-between"><span>CYL 6:</span> <span>383°C</span></div>
            </div>
            
            <div>
              <div class="text-gray-500">SYSTEM PRESSURES</div>
              <div class="flex justify-between"><span>SCAVENGE AIR:</span> <span>2.8 Bar</span></div>
              <div class="flex justify-between"><span>LUBE OIL:</span> <span>4.2 Bar</span></div>
              <div class="flex justify-between"><span>JACKET WATER:</span> <span>3.5 Bar</span></div>
              <div class="flex justify-between"><span>FUEL OIL:</span> <span>7.8 Bar</span></div>
              <div class="mt-4 text-gray-500">TURBOCHARGER</div>
              <div class="flex justify-between"><span>RPM:</span> <span>12,450</span></div>
              <div class="flex justify-between"><span>VIB:</span> <span>4.2 mm/s</span></div>
            </div>
          </div>
          <div class="mt-4 border-t border-green-800 pt-2 text-xs text-center animate-pulse">
            ● LIVE STREAM ACTIVE
          </div>
        </div>
      `,
      confirmButtonText: 'Close Telemetry',
      confirmButtonColor: '#374151'
    });
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Maintenance Schedule</h2>
        <div className="flex space-x-2">
           <button onClick={() => navigate('/inventory')} className="btn btn-secondary">PMS Inventory</button>
           <button className="btn btn-primary"><i className="fas fa-tools mr-2"></i> Log Work</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <div className="card">
              <div className="card-header">
                 <h3 className="font-semibold">Upcoming Tasks (Next 7 Days)</h3>
              </div>
              <div className="p-0">
                 {tasks.map((job) => (
                   <div key={job.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                         <div className={`mt-1 w-2 h-2 rounded-full ${job.priority === 'High' ? 'bg-red-500' : job.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                         <div>
                            <p className="font-bold text-gray-800">{job.task}</p>
                            <p className="text-xs text-gray-500">{job.system} • Due {job.due}</p>
                         </div>
                      </div>
                      
                      {job.status === 'Pending' ? (
                        <button 
                          onClick={() => handleStartTask(job)}
                          className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm font-bold transition-colors"
                        >
                          Start
                        </button>
                      ) : (
                        <span className="text-orange-500 bg-orange-50 px-3 py-1 rounded text-xs font-bold border border-orange-100 animate-pulse">
                          In Progress
                        </span>
                      )}
                   </div>
                 ))}
              </div>
           </div>

           <div className={`card p-6 text-white border-none transition-colors duration-500 ${orderStatus === 'Placed' ? 'bg-green-700' : 'bg-blue-900'}`}>
              <div className="flex items-center justify-between">
                 <div>
                    <h4 className="text-lg font-bold">Critical Spare Parts</h4>
                    <p className={`text-sm ${orderStatus === 'Placed' ? 'text-green-100' : 'text-blue-200'}`}>
                      {orderStatus === 'Placed' ? 'Replenishment Order #PO-2024-889 Pending' : '3 items below minimum threshold'}
                    </p>
                 </div>
                 <i className={`fas ${orderStatus === 'Placed' ? 'fa-check-circle text-green-400' : 'fa-boxes text-blue-400'} text-4xl opacity-50`}></i>
              </div>
              <div className="mt-6 flex space-x-4">
                 {orderStatus === 'Pending' ? (
                   <button 
                     onClick={() => {
                       Swal.fire({
                         title: 'Critical Spares Order',
                         html: `
                           <div class="text-left bg-gray-50 p-3 rounded">
                             <div class="flex justify-between border-b pb-2 mb-2">
                               <span>Main Engine Piston Rings</span>
                               <span className="font-bold">2 Sets</span>
                             </div>
                             <div class="flex justify-between border-b pb-2 mb-2">
                               <span>Aux. Diesel Fuel Filters</span>
                               <span className="font-bold">12 Units</span>
                             </div>
                             <div class="flex justify-between">
                               <span>Hydraulic Seal Kits</span>
                               <span className="font-bold">4 Kits</span>
                             </div>
                           </div>
                         `,
                         confirmButtonText: 'Confirm Purchase Order',
                         showCancelButton: true,
                         confirmButtonColor: '#2563eb'
                       }).then(res => {
                         if(res.isConfirmed) {
                           setOrderStatus('Placed');
                           Swal.fire('Ordered!', 'Purchase Order #PO-2024-889 created.', 'success');
                         }
                       });
                     }}
                     className="flex-1 bg-white text-blue-900 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors"
                   >
                     Order Now
                   </button>
                 ) : (
                   <button 
                     onClick={() => Swal.fire('Order Status', 'PO-2024-889 is currently being processed by HQ. ETA: 3 Days.', 'info')}
                     className="flex-1 bg-white text-green-900 py-2 rounded-lg font-bold text-sm hover:bg-green-50 transition-colors"
                   >
                     Track Order
                   </button>
                 )}
                 <button 
                   onClick={() => navigate('/inventory')}
                   className={`flex-1 text-white py-2 rounded-lg font-bold text-sm transition-colors ${orderStatus === 'Placed' ? 'bg-green-800 hover:bg-green-900' : 'bg-blue-800 hover:bg-blue-700'}`}
                 >
                   View Stock
                 </button>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="card p-6">
              <h3 className="font-bold text-gray-800 mb-6 uppercase text-xs tracking-wider">Engine Performance</h3>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-xs mb-1 font-bold">
                       <span>ME LOAD</span>
                       <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                       <div className="bg-blue-600 h-full" style={{ width: '85%' }}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs mb-1 font-bold">
                       <span>SCAVENGE AIR TEMP</span>
                       <span>42°C</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                       <div className="bg-green-500 h-full" style={{ width: '60%' }}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs mb-1 font-bold text-red-600">
                       <span>CYL 3 EXH. GAS TEMP</span>
                       <span>385°C</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                       <div className="bg-red-500 h-full" style={{ width: '92%' }}></div>
                    </div>
                 </div>
               </div>
               <div className="mt-8 pt-6 border-t border-gray-100">
                  <button onClick={handleTelemetry} className="w-full text-blue-600 font-bold text-sm hover:underline">View Full Telemetry →</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Maintenance;
