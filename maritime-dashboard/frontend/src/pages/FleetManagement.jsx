import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { 
  Ship, 
  FileText, 
  BarChart3, 
  Download, 
  Settings, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Plus,
  ShieldCheck,
  TrendingUp,
  History
} from 'lucide-react';
import Swal from 'sweetalert2';

const FleetManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [fleetData, setFleetData] = useState({
    vessels: [],
    analytics: { vessels: [], reports: [], fuelTrend: [] },
    thresholds: []
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFleetData();
  }, []);

  const fetchFleetData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [vesselsRes, analyticsRes, thresholdsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/fleet/vessels', config),
        axios.get('http://localhost:5000/api/fleet/analytics', config),
        axios.get('http://localhost:5000/api/fleet/thresholds', config)
      ]);

      setFleetData({
        vessels: vesselsRes.data.data,
        analytics: analyticsRes.data.data,
        thresholds: thresholdsRes.data.data
      });
    } catch (error) {
      console.error('Error fetching fleet data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to load fleet data. Please try again later.',
        background: '#1f2937',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (type) => {
    Swal.fire({
      title: 'Generating Report...',
      text: `Your ${type.toUpperCase()} report is being prepared.`,
      timer: 2000,
      showConfirmButton: false,
      background: '#1f2937',
      color: '#fff',
      didOpen: () => {
        Swal.showLoading();
      }
    });
  };

  const handleViewDetails = (vessel) => {
    Swal.fire({
      title: `<span class="text-2xl font-bold">${vessel.name}</span>`,
      html: `
        <div class="text-left space-y-4 p-2">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-gray-500 uppercase font-bold">IMO Number</p>
              <p class="text-sm dark:text-gray-300">${vessel.imo || 'N/A'}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase font-bold">Vessel Type</p>
              <p class="text-sm dark:text-gray-300">${vessel.type || 'N/A'}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase font-bold">Status</p>
              <p class="text-sm dark:text-gray-300 font-semibold">${vessel.status || 'N/A'}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase font-bold">Flag</p>
              <p class="text-sm dark:text-gray-300">${vessel.flag || 'N/A'}</p>
            </div>
          </div>
          <hr class="border-gray-700" />
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold">Last Known Position</p>
            <p class="text-sm dark:text-gray-300">
              ${vessel.lastPosition ? `Lat: ${vessel.lastPosition.lat}, Lon: ${vessel.lastPosition.lon}` : 'Location data currently unavailable'}
            </p>
          </div>
          ${vessel.owner ? `
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold">Owner / Manager</p>
            <p class="text-sm dark:text-gray-300">${vessel.owner}</p>
          </div>
          ` : ''}
        </div>
      `,
      background: '#111827',
      color: '#fff',
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'Close',
      width: '32rem',
      showCloseButton: true,
      customClass: {
        popup: 'rounded-xl border border-gray-700 shadow-2xl'
      }
    });
  };

  const filteredVessels = fleetData.vessels.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.imo.includes(searchTerm) ||
    v.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fleet Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor, analyze and manage your entire fleet efficiency.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleExport('compliance')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-lg"
          >
            <Download size={18} />
            <span>Export Compliance</span>
          </button>
          <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Fleet Overview', icon: Ship },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'reports', label: 'Report Verification', icon: FileText },
          { id: 'thresholds', label: 'Thresholds', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Stats Cards */}
                <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard 
                    label="Total Vessels" 
                    value={fleetData.vessels.length} 
                    icon={Ship} 
                    color="blue" 
                    onClick={() => {
                      setSearchTerm('');
                      document.getElementById('vessel-list')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />
                  <StatCard 
                    label="Active Now" 
                    value={fleetData.vessels.filter(v => v.status === 'Active').length} 
                    icon={CheckCircle2} 
                    color="green" 
                    onClick={() => {
                      setSearchTerm('Active');
                      document.getElementById('vessel-list')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />
                  <StatCard 
                    label="In Maintenance" 
                    value={fleetData.vessels.filter(v => v.status === 'Maintenance').length} 
                    icon={Clock} 
                    color="yellow" 
                    onClick={() => {
                      setSearchTerm('Maintenance');
                      document.getElementById('vessel-list')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />
                  <StatCard 
                    label="Urgent Alerts" 
                    value="3" 
                    icon={AlertTriangle} 
                    color="red" 
                    onClick={() => window.location.href = '/alerts'}
                  />
                </div>

                {/* Vessel List */}
                <div id="vessel-list" className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Active Vessels</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search vessel or IMO..."
                        className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4 font-medium">Vessel Name</th>
                          <th className="px-6 py-4 font-medium">IMO Number</th>
                          <th className="px-6 py-4 font-medium">Type</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium">Last Position</th>
                          <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredVessels.map(vessel => (
                          <tr key={vessel._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                                  <Ship size={16} />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">{vessel.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{vessel.imo}</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{vessel.type}</td>
                            <td className="px-6 py-4">
                              <StatusBadge status={vessel.status} />
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                              {vessel.lastPosition ? `${vessel.lastPosition.lat}, ${vessel.lastPosition.lon}` : 'Unknown'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => handleViewDetails(vessel)}
                                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium text-sm transition-colors"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <TrendingUp className="text-indigo-500" /> Fuel Consumption Trend (Last 30 Days)
                    </h3>
                    <Chart
                      options={{
                        chart: { id: 'fuel-trend', toolbar: { show: false }, background: 'transparent' },
                        theme: { mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light' },
                        colors: ['#6366f1'],
                        xaxis: { categories: (fleetData.analytics.fuelTrend || []).map(f => f._id) },
                        stroke: { curve: 'smooth' }
                      }}
                      series={[{ name: 'Consumption (MT)', data: (fleetData.analytics.fuelTrend || []).map(f => f.totalFuel) }]}
                      type="area"
                      height={250}
                    />
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Ship className="text-indigo-500" /> Fleet Status Distribution
                    </h3>
                    <Chart
                      options={{
                        chart: { type: 'donut', background: 'transparent' },
                        theme: { mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light' },
                        labels: (fleetData.analytics.vessels || []).map(v => v._id),
                        colors: ['#10b981', '#f59e0b', '#6366f1', '#ef4444'],
                        legend: { position: 'bottom' }
                      }}
                      series={(fleetData.analytics.vessels || []).map(v => v.count)}
                      type="donut"
                      height={250}
                    />
                  </div>
                </div>

                {/* Performance Summaries */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-lg">
                        <ShieldCheck size={20} />
                      </div>
                      <h4 className="font-semibold">Compliance Status</h4>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">94%</div>
                    <p className="text-xs text-gray-500">All vessels MARPOL compliant</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                        <History size={20} />
                      </div>
                      <h4 className="font-semibold">Verification Speed</h4>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">2.4h</div>
                    <p className="text-xs text-gray-500">Average report approval time</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 rounded-lg">
                        <TrendingUp size={20} />
                      </div>
                      <h4 className="font-semibold">Active Fleet Efficiency</h4>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">91.8%</div>
                    <p className="text-xs text-gray-500">Resource utilization score</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="font-semibold">Pending Verification</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">5 New</span>
                </div>
                <div className="p-8 text-center text-gray-500">
                  <FileText className="mx-auto mb-4 text-gray-300" size={48} />
                  <p>No reports currently pending your review.</p>
                </div>
              </div>
            )}

            {activeTab === 'thresholds' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Alert Thresholds</h3>
                    <p className="text-sm text-gray-500">Global rules for automated fleet monitoring.</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all">
                    <Plus size={18} />
                    <span>New Rule</span>
                  </button>
                </div>
                <div className="p-6">
                  {fleetData.thresholds.length === 0 ? (
                    <div className="text-center py-12">
                      <Settings className="mx-auto mb-4 text-gray-300" size={48} />
                      <p className="text-gray-500">No thresholds configured. Create your first monitoring rule.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {fleetData.thresholds.map(rule => (
                        <div key={rule._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                           {/* Threshold item detail */}
                           <h4 className="font-medium text-gray-900 dark:text-white capitalize">{rule.parameter.replace('_', ' ')}</h4>
                           <div className="mt-2 text-sm text-gray-500">
                              <span className="font-bold text-indigo-600">{rule.min || 0}</span> to <span className="font-bold text-indigo-600">{rule.max || 'inf'}</span> {rule.unit}
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, onClick }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
    >
      <div className="flex items-center justify-between pointer-events-none">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    'Active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Maintenance': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Decommissioned': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    'default': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.default}`}>
      {status}
    </span>
  );
};

export default FleetManagement;
