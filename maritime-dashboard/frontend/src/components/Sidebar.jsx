import { NavLink, useNavigate } from 'react-router-dom';
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
          <div className="flex items-center space-x-3">
            <div className="ship-icon">
              <i className="fas fa-ship"></i>
            </div>
            <div>
              <h1 className="font-bold text-lg dark:text-gray-100">Captain Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">MV Ocean Star</p>
              <div className="flex items-center mt-1">
                <span className="status-indicator status-online"></span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-tachometer-alt w-6 mr-3"></i>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-file-alt w-6 mr-3"></i>
            <span>Daily Report</span>
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
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-blue-600 dark:text-blue-400"></i>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm truncate dark:text-gray-200">{user.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{user.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt text-gray-600 dark:text-gray-400"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
