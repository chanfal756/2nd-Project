import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Captain' };
  const [apiConnected, setApiConnected] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    const checkConnection = async () => {
      try {
        await axios.get('http://127.0.0.1:5000/health');
        setApiConnected(true);
      } catch (err) {
        setApiConnected(false);
      }
    };
    checkConnection();
    
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: true 
  });

  const dateString = currentTime.toLocaleDateString([], { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <header className="ship-header shadow-md">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Captain's Dashboard</h2>
            <div className="flex items-center space-x-2">
              <p className="text-blue-200 text-sm">Welcome back, {user.name}</p>
              <span className={`flex items-center text-[10px] px-2 py-0.5 rounded-full ${apiConnected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${apiConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
                {apiConnected ? 'Attached' : 'Searching for Backend...'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Date & Time */}
            <div className="hidden md:block bg-blue-800/30 px-4 py-2 rounded-lg text-white">
              <div className="flex items-center space-x-2">
                <i className="far fa-clock"></i>
                <div>
                  <p className="text-sm font-medium">{timeString}</p>
                  <p className="text-xs text-blue-300">{dateString}</p>
                </div>
              </div>
            </div>
            
            {/* Weather */}
            <div 
              onClick={() => {
                Swal.fire({
                  title: '',
                  html: `
                    <div class="weather-ios-container text-left text-white overflow-hidden -mt-8">
                      <div class="weather-ios-header text-center mb-6 pt-4">
                        <h2 class="text-2xl font-semibold mb-0">Malacca Strait</h2>
                        <p class="text-6xl font-thin my-2">28°</p>
                        <p class="text-lg font-medium opacity-80">Clear</p>
                        <div class="flex justify-center space-x-2 text-sm">
                          <span>H:31°</span>
                          <span>L:24°</span>
                        </div>
                      </div>

                      <div class="weather-ios-scroll mb-6 p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                        <p class="text-xs uppercase font-bold opacity-60 mb-3 border-b border-white/10 pb-2">7-Day Forecast</p>
                        <div class="space-y-4">
                          ${[
                            { day: 'Today', icon: 'fa-sun', condition: 'Sunny', high: 31, low: 24, text: 'text-yellow-300' },
                            { day: 'Fri', icon: 'fa-cloud-sun', condition: 'Partly Cloudy', high: 30, low: 23, text: 'text-blue-200' },
                            { day: 'Sat', icon: 'fa-cloud-rain', condition: 'Showers', high: 27, low: 22, text: 'text-blue-400' },
                            { day: 'Sun', icon: 'fa-sun', condition: 'Sunny', high: 32, low: 25, text: 'text-yellow-300' },
                            { day: 'Mon', icon: 'fa-sun', condition: 'Clear', high: 31, low: 24, text: 'text-yellow-300' },
                            { day: 'Tue', icon: 'fa-cloud', condition: 'Cloudy', high: 28, low: 23, text: 'text-gray-300' },
                            { day: 'Wed', icon: 'fa-bolt', condition: 'Storms', high: 26, low: 21, text: 'text-purple-300' },
                          ].map(item => `
                            <div class="flex items-center justify-between">
                              <span class="w-12 font-medium">${item.day}</span>
                              <div class="flex-1 flex items-center justify-center">
                                <i class="fas ${item.icon} ${item.text} text-lg"></i>
                              </div>
                              <div class="flex items-center space-x-3">
                                <span class="w-8 text-right opacity-60">${item.low}°</span>
                                <div class="w-24 h-1.5 bg-white/20 rounded-full relative overflow-hidden">
                                  <div class="absolute left-1/4 right-1/4 h-full bg-gradient-to-r from-blue-400 to-yellow-400 rounded-full"></div>
                                </div>
                                <span class="w-8 font-bold">${item.high}°</span>
                              </div>
                            </div>
                          `).join('')}
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-4">
                        <div class="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                          <p class="text-[10px] uppercase font-bold opacity-60 mb-1 flex items-center">
                            <i class="fas fa-wind mr-1"></i> Wind
                          </p>
                          <p class="text-xl font-semibold">12 kts</p>
                          <p class="text-xs opacity-60">North Easterly</p>
                        </div>
                        <div class="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                          <p class="text-[10px] uppercase font-bold opacity-60 mb-1 flex items-center">
                            <i class="fas fa-droplet mr-1"></i> Humidity
                          </p>
                          <p class="text-xl font-semibold">64%</p>
                          <p class="text-xs opacity-60">Dew point is 21°</p>
                        </div>
                      </div>
                    </div>
                  `,
                  showConfirmButton: false,
                  showCloseButton: true,
                  width: '450px',
                  background: 'linear-gradient(to bottom, #2b6cb0, #2c5282)',
                  customClass: {
                    container: 'weather-ios-modal',
                    popup: 'rounded-[40px] border border-white/20 shadow-2xl overflow-hidden'
                  }
                });
              }}
              className="hidden md:block bg-blue-800/30 px-4 py-2 rounded-lg text-white cursor-pointer hover:bg-blue-700/50 transition-all border border-blue-400/20 active:scale-95"
            >
              <div className="flex items-center space-x-2">
                <i className="fas fa-sun text-yellow-300"></i>
                <div>
                  <p className="text-sm font-medium">28°C / 82°F</p>
                  <p className="text-xs text-blue-300">Clear, 12 knots</p>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button 
                onClick={() => {
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
                    confirmButtonColor: '#2563eb',
                    preConfirm: () => {
                      return {
                        type: document.getElementById('swal-type').value,
                        remarks: document.getElementById('swal-remarks').value
                      }
                    }
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire('Success', 'Report has been generated and queued for transmission.', 'success');
                    }
                  });
                }}
                className="btn btn-primary bg-white text-blue-900 border-none hover:bg-blue-50"
              >
                <i className="fas fa-plus mr-2"></i> New Report
              </button>
              <button 
                onClick={() => {
                  Swal.fire({
                    title: '<div class="text-left font-bold text-lg mb-2">Vessel Alerts</div>',
                    html: `
                      <div class="text-left space-y-3">
                        <div class="p-3 bg-red-50 border-l-4 border-red-500 rounded flex items-start gap-3">
                          <i class="fas fa-exclamation-circle text-red-500 mt-1"></i>
                          <div>
                            <p class="font-bold text-sm text-red-800">Aux Engine 2 Service Tank Low</p>
                            <p class="text-xs text-red-600">Level below 15% - Transfer required</p>
                            <p class="text-[10px] text-gray-400 mt-1">20 mins ago</p>
                          </div>
                        </div>
                        <div class="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded flex items-start gap-3">
                          <i class="fas fa-clock text-yellow-600 mt-1"></i>
                          <div>
                            <p class="font-bold text-sm text-yellow-800">Noon Report Overdue</p>
                            <p class="text-xs text-yellow-700">Reporting window closes and sync is pending</p>
                            <p class="text-[10px] text-gray-400 mt-1">1 hour ago</p>
                          </div>
                        </div>
                        <div class="p-3 bg-blue-50 border-l-4 border-blue-500 rounded flex items-start gap-3">
                          <i class="fas fa-info-circle text-blue-500 mt-1"></i>
                          <div>
                            <p class="font-bold text-sm text-blue-800">Weather Update</p>
                            <p class="text-xs text-blue-600">Winds increasing to 25 knots in Malacca Strait</p>
                            <p class="text-[10px] text-gray-400 mt-1">2 hours ago</p>
                          </div>
                        </div>
                        <button class="w-full mt-4 py-2 text-xs font-bold text-gray-500 hover:text-blue-600 border-t border-gray-100 uppercase tracking-widest">
                          Mark all as read
                        </button>
                      </div>
                    `,
                    showConfirmButton: false,
                    showCloseButton: true,
                    width: '400px',
                    padding: '1.5rem',
                    background: '#fff'
                  });
                }}
                className="btn btn-secondary relative bg-blue-800/30 text-white hover:bg-blue-700/50 border-none"
              >
                <i className="fas fa-bell"></i>
                <span className="notification-dot"></span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Ship Status Bar */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button 
            onClick={() => Swal.fire('System Health', 'All critical systems are functioning within normal parameters.', 'success')}
            className="badge badge-success cursor-pointer hover:opacity-80 transition-opacity border-none focus:outline-none"
          >
            <i className="fas fa-check-circle mr-1"></i> All Systems OK
          </button>
          <button 
            onClick={() => {
              Swal.fire({
                title: 'Update Navigation Status',
                input: 'radio',
                inputOptions: {
                  'underway': 'Underway using Engine',
                  'anchor': 'At Anchor',
                  'moored': 'Moored to Buoy/Dock',
                  'drifting': 'Drifting'
                },
                inputValue: 'underway',
                showCancelButton: true,
                confirmButtonText: 'Update Status'
              }).then((result) => {
                if(result.isConfirmed) {
                  Swal.fire('Status Updated', `Vessel status changed to: ${result.value.toUpperCase()}`, 'success');
                }
              });
            }}
            className="badge badge-primary cursor-pointer hover:bg-blue-200 transition-colors border-none focus:outline-none"
          >
            <i className="fas fa-anchor mr-1"></i> Underway
          </button>
          <button 
            onClick={() => {
              Swal.fire({
                title: 'Detailed Position',
                html: `
                  <div class="text-left font-mono bg-gray-50 p-3 rounded">
                    <p class="mb-1"><strong>Lat:</strong> 01° 21.123' N</p>
                    <p class="mb-1"><strong>Long:</strong> 103° 49.188' E</p>
                    <p><strong>COG:</strong> 115°</p>
                  </div>
                `,
                icon: 'info'
              });
            }}
            className="badge badge-primary cursor-pointer hover:bg-blue-200 transition-colors border-none focus:outline-none"
          >
            <i className="fas fa-map-marker-alt mr-1"></i> Position: 1.3521° N, 103.8198° E
          </button>
          <button 
             onClick={() => {
               Swal.fire({
                 title: 'Speed Logistics',
                 html: `
                   <div class="text-left font-mono bg-gray-50 p-3 rounded">
                     <p class="mb-1"><strong>STW (Water):</strong> 12.8 kts</p>
                     <p class="mb-1"><strong>SOG (Ground):</strong> 12.5 kts</p>
                     <p><strong>Current:</strong> 0.3 kts <span class="text-red-500">(Against)</span></p>
                   </div>
                 `,
                 icon: 'info'
               });
             }}
             className="badge badge-primary cursor-pointer hover:bg-blue-200 transition-colors border-none focus:outline-none"
          >
            <i className="fas fa-tachometer-alt mr-1"></i> Speed: 12.5 knots
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
