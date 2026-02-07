import { NavLink, useNavigate } from 'react-router-dom';
import { Ship } from 'lucide-react';
import Swal from 'sweetalert2';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Captain', role: 'user' };
  
  const handleLogout = () => {
    Swal.fire({
      title: 'Logout',
      text: "Are you sure you want to exit?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  };

  return (
    <div className="desktop-menu w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block h-screen fixed left-0 top-0 overflow-y-auto transition-colors duration-300">
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div 
            onClick={() => navigate('/settings')}
            className="group flex items-center space-x-3 cursor-pointer p-2 -m-2 rounded-xl transition-all duration-300"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none transition-transform group-hover:scale-110 duration-300">
                <Ship className="text-white" size={24} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300 leading-none">
                LubeTrack
              </h1>
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-1 ml-0.5">
                Marine Systems
              </span>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-tachometer-alt w-6 mr-3"></i>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/captain" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-anchor w-6 mr-3"></i>
            <span>Command Center</span>
          </NavLink>
          <NavLink to="/vessels" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-ship w-6 mr-3"></i>
            <span>Vessel Registry</span>
          </NavLink>
          <NavLink to="/fleet" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-chart-line w-6 mr-3"></i>
            <span>Fleet Management</span>
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-file-alt w-6 mr-3"></i>
            <span>Voyage Reports</span>
          </NavLink>
          <NavLink to="/daily-reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-gas-pump w-6 mr-3"></i>
            <span>Fuel & Oil Reporting</span>
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-oil-can w-6 mr-3"></i>
            <span>Oil Inventory</span>
          </NavLink>
          <NavLink to="/navigation" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-map-marked-alt w-6 mr-3"></i>
            <span>Navigation</span>
          </NavLink>
          <NavLink to="/crew" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-users w-6 mr-3"></i>
            <span>Crew Management</span>
          </NavLink>
          <NavLink to="/maintenance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-tools w-6 mr-3"></i>
            <span>Maintenance</span>
          </NavLink>
          <NavLink to="/alerts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-bell w-6 mr-3"></i>
            <span>Alerts</span>
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full pulse">3</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-cog w-6 mr-3"></i>
            <span>Settings</span>
          </NavLink>
        </nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
          <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-indigo-600 dark:text-indigo-400"></i>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm truncate dark:text-gray-100">{user.name}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">{user.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50 flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-1">
              <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Powered by</span>
              <span className="text-[11px] font-black tracking-tighter text-indigo-500 dark:text-indigo-400">RapidBizz</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Developed by</span>
              <span className="text-[11px] font-black tracking-tight text-gray-800 dark:text-gray-200">
                Triplestack <span className="text-indigo-600 dark:text-indigo-400 italic font-black">X</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
