import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Fuel, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  const handleAction = (type) => {
    Swal.fire({
      title: `${type} Status`,
      text: `Systems check for ${type} is optimal. No issues detected.`,
      icon: 'success',
      confirmButtonColor: '#2563eb'
    });
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Fleet Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back, Captain {user.name}. All systems are currently operational.</p>
      </header>

      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="icon-box" style={{ background: '#dbeafe', color: '#2563eb' }}>
            <Fuel size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Heavy Fuel Oil</p>
            <h3 style={{ fontSize: '1.5rem' }}>450.5 mt</h3>
          </div>
        </div>
        <div className="card stat-card">
          <div className="icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Main Engine Hours</p>
            <h3 style={{ fontSize: '1.5rem' }}>12,458 h</h3>
          </div>
        </div>
        <div className="card stat-card">
          <div className="icon-box" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Pending Alerts</p>
            <h3 style={{ fontSize: '1.5rem' }}>3 Active</h3>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>System Checks</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {['Navigation', 'Communication', 'Bunker System', 'Crew Health'].map(item => (
            <button key={item} onClick={() => handleAction(item)} className="btn btn-outline" style={{ justifyContent: 'space-between', padding: '1rem' }}>
              <span className="flex gap-2 items-center">
                <CheckCircle2 color="#22c55e" size={18} />
                {item}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 'bold' }}>OK</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
