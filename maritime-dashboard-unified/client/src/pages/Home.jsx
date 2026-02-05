import { Link } from 'react-router-dom';
import { Ship, Shield, BarChart3, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <section className="hero">
        <h1>Navigate Your Fleet With Precision</h1>
        <p>The ultimate maritime management dashboard for modern captains and fleet operators. Monitor fuel, crew, and logistics in real-time.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Get Started Free</Link>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.75rem 2rem' }}>Learn More</Link>
            </>
          )}
        </div>
      </section>

      <section className="dashboard-grid" style={{ marginBottom: '4rem' }}>
        <div className="card">
          <div className="icon-box" style={{ background: '#dbeafe', color: '#2563eb' }}>
            <BarChart3 size={24} />
          </div>
          <h3 style={{ margin: '1rem 0 0.5rem' }}>Real-time Analytics</h3>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Monitor fuel consumption and engine hours with granular precision across your entire fleet.</p>
        </div>
        <div className="card">
          <div className="icon-box" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <Shield size={24} />
          </div>
          <h3 style={{ margin: '1rem 0 0.5rem' }}>Secure & Reliable</h3>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Bank-grade encryption for all your maritime data and crew information.</p>
        </div>
        <div className="card">
          <div className="icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Globe size={24} />
          </div>
          <h3 style={{ margin: '1rem 0 0.5rem' }}>Global Sync</h3>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Seamlessly synchronize data across satellites even in the most remote oceanic routes.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
