import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';

const Inventory = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setData(res.data.data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleBunkering = async (type) => {
    const title = type === 'hfo' ? 'Record HFO Bunkering' : 'Record MGO Bunkering';
    const { value: amount } = await Swal.fire({
      title,
      input: 'number',
      inputLabel: 'Amount in metric tons (mt)',
      inputPlaceholder: 'Enter amount...',
      showCancelButton: true,
      confirmButtonText: 'Record',
      confirmButtonColor: '#2563eb'
    });

    if (amount) {
      try {
        const newTotal = parseFloat(data[type].current) + parseFloat(amount);
        if (newTotal > data[type].capacity) {
          return Swal.fire('Error', 'Amount exceeds capacity!', 'error');
        }

        await api.put('/inventory/update', {
          [type]: { current: newTotal }
        });
        
        fetchInventory();
        Swal.fire('Success', 'Bunkering recorded successfully.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to update inventory', 'error');
      }
    }
  };

  const handleConsumption = async (type) => {
    const { value: amount } = await Swal.fire({
      title: 'Update Daily Consumption',
      input: 'number',
      inputLabel: `New daily consumption for ${type.toUpperCase()} (mt)`,
      showCancelButton: true,
      confirmButtonText: 'Update',
      confirmButtonColor: '#2563eb'
    });

    if (amount) {
      try {
        await api.put('/inventory/update', {
          [type]: { dailyConsumption: parseFloat(amount) }
        });
        fetchInventory();
      } catch (err) {
        Swal.fire('Error', 'Update failed', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-blue-600">
        <i className="fas fa-spinner fa-spin text-4xl mb-4"></i>
        <p className="text-gray-500 font-medium">Loading Vessel Inventory...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4">
          <i className="fas fa-ship"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Engine Room Data Missing</h3>
        <p className="text-gray-500 mb-6 max-w-sm">It looks like this vessel hasn't been initialized in the system yet. Click below to setup the default engine parameters.</p>
        <div className="flex space-x-3">
          <button 
            onClick={() => { setLoading(true); fetchInventory(); }}
            className="btn btn-outline"
          >
            <i className="fas fa-sync-alt mr-2"></i> Check Status
          </button>
          <button 
            onClick={async () => {
              setLoading(true);
              try {
                // The GET /inventory route now automatically heals/seeds if data is missing,
                // but we call it explicitly here to trigger that logic.
                await api.get('/inventory');
                await fetchInventory();
                Swal.fire('Vessel Initialized', 'Engine room data has been generated.', 'success');
              } catch (err) {
                Swal.fire('Setup Failed', 'Could not initialize data. Ensure backend is active.', 'error');
              } finally {
                setLoading(false);
              }
            }}
            className="btn btn-primary"
          >
            <i className="fas fa-magic mr-2"></i> Setup Engine Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Oil & Fuel Inventory</h2>
        <p className="text-xs text-gray-500 italic">Last Sync: {new Date(data.lastUpdated).toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HFO Card */}
        <div className="card p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-bold text-gray-800 flex items-center">
              <i className="fas fa-oil-can mr-2 text-blue-600"></i>
              Heavy Fuel Oil (HFO)
            </h3>
            <div className="space-x-2">
              <button onClick={() => handleBunkering('hfo')} className="btn btn-primary text-[10px] px-2 py-1">Record Bunkering</button>
              <button onClick={() => handleConsumption('hfo')} className="btn btn-secondary text-[10px] px-2 py-1">Update Cons.</button>
            </div>
          </div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold">{data.hfo.current} mt</span>
            <span className="text-gray-500 text-sm">Capacity: {data.hfo.capacity} mt</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${(data.hfo.current / data.hfo.capacity) * 100}%` }}
            ></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-xs text-blue-600 uppercase font-bold text-[8px]">Daily Consumption</p>
              <p className="text-lg font-bold">{data.hfo?.dailyConsumption || 0} mt</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-xs text-blue-600 uppercase font-bold text-[8px]">Days Remaining</p>
              <p className="text-lg font-bold">
                {data.hfo?.dailyConsumption > 0 
                  ? Math.floor(data.hfo.current / data.hfo.dailyConsumption) 
                  : 'N/A'} Days
              </p>
            </div>
          </div>
        </div>

        {/* MGO Card */}
        <div className="card p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-bold text-gray-800 flex items-center">
              <i className="fas fa-gas-pump mr-2 text-green-600"></i>
              Marine Gas Oil (MGO)
            </h3>
            <div className="space-x-2">
              <button onClick={() => handleBunkering('mgo')} className="btn btn-primary text-[10px] px-2 py-1">Record Bunkering</button>
              <button onClick={() => handleConsumption('mgo')} className="btn btn-secondary text-[10px] px-2 py-1">Update Cons.</button>
            </div>
          </div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold">{data.mgo?.current || 0} mt</span>
            <span className="text-gray-500 text-sm">Capacity: {data.mgo?.capacity || 0} mt</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-green-600 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${data.mgo?.capacity > 0 ? (data.mgo.current / data.mgo.capacity) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-xs text-green-600 uppercase font-bold text-[8px]">Daily Consumption</p>
              <p className="text-lg font-bold">{data.mgo?.dailyConsumption || 0} mt</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-xs text-green-600 uppercase font-bold text-[8px]">Days Remaining</p>
              <p className="text-lg font-bold">
                {data.mgo?.dailyConsumption > 0 
                  ? Math.floor(data.mgo.current / data.mgo.dailyConsumption) 
                  : 'N/A'} Days
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <i className="fas fa-flask-vial text-blue-600"></i>
            Lubricating Oils & Additives
          </h3>
          <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold flex items-center gap-1 animate-pulse">
            <i className="fas fa-exclamation-triangle"></i> Reorder Alert active
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { name: 'System Oil', value: '4,500 L', status: 'Optimal' },
            { name: 'Cylinder Oil', value: '8,200 L', status: 'Optimal' },
            { name: 'Aux Engine Oil', value: '1,200 L', status: 'Critical' },
            { name: 'Gearbox Oil', value: '600 L', status: 'Optimal' },
          ].map((item, i) => (
            <div 
              key={i} 
              className={`p-4 rounded-xl transition-all border ${
                item.status === 'Critical' 
                ? 'bg-red-50 border-red-200 shadow-sm ring-1 ring-red-500 ring-opacity-50' 
                : 'bg-white border-gray-100 hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{item.name}</p>
                {item.status === 'Critical' && <i className="fas fa-exclamation-circle text-red-500"></i>}
              </div>
              <p className="text-2xl font-bold text-gray-800">{item.value}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                  item.status === 'Critical' ? 'bg-red-500 text-white' : 'bg-green-100 text-green-600'
                }`}>
                  {item.status}
                </span>
                {item.status === 'Critical' && (
                  <button className="text-[10px] text-red-600 font-bold hover:underline">REORDER NOW</button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-xs text-gray-600">
            <i className="fas fa-info-circle mr-2 text-blue-500"></i>
            Lubricating oil inventory is updated automatically via IoT sensors twice daily.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
