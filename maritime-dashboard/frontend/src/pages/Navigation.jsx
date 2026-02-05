import React from 'react';

const Navigation = () => {
  return (
    <div className="space-y-6 fade-in h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Navigation & Routing</h2>
        <div className="flex space-x-2">
           <button className="btn btn-secondary"><i className="fas fa-print mr-2"></i> Print Plan</button>
           <button className="btn btn-primary"><i className="fas fa-route mr-2"></i> Update Path</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="lg:col-span-2 card bg-gray-900 overflow-hidden min-h-[400px] relative flex items-center justify-center border-none">
          <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
          <div className="text-center z-10">
            <div className="text-blue-500 mb-4">
              <i className="fas fa-map-marked-alt text-6xl pulse-slow"></i>
            </div>
            <h3 className="text-white text-xl font-bold">Interactive Maritime Map</h3>
            <p className="text-gray-400 mt-2">Charts loading... System active.</p>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between">
            <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg text-white border border-white/10">
              <p className="text-[10px] text-blue-400 uppercase font-bold">Current Lat/Long</p>
              <p className="text-sm font-mono tracking-widest">1.3521° N, 103.8198° E</p>
            </div>
            <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg text-white border border-white/10 text-right">
              <p className="text-[10px] text-blue-400 uppercase font-bold">Next Waypoint</p>
              <p className="text-sm font-mono tracking-widest">In 4.2 nm</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-gray-800 mb-4">Course Info</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-gray-500">Heading (Gyro)</span>
                <span className="font-mono font-bold">285.5°</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-gray-500">Speed Over Ground</span>
                <span className="font-mono font-bold text-blue-600">12.5 kn</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-gray-500">Drift</span>
                <span className="font-mono font-bold">0.8 kn / 12°</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Under Keel Clear.</span>
                <span className="font-mono font-bold text-green-600">45.0 m</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-gray-800 mb-4">Weather at Location</h3>
            <div className="flex items-center space-x-4 mb-6">
               <div className="text-4xl text-yellow-500"><i className="fas fa-sun"></i></div>
               <div>
                 <p className="text-3xl font-bold">28°C</p>
                 <p className="text-sm text-gray-500">Sunny, Slight Sea</p>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Wind Speed</p>
                  <p className="font-bold">12 knots</p>
               </div>
               <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Wave Height</p>
                  <p className="font-bold">1.2 m</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
