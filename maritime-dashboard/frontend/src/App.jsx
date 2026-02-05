import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Inventory from './pages/Inventory';
import Navigation from './pages/Navigation';
import Crew from './pages/Crew';
import Maintenance from './pages/Maintenance';
import AlertsPage from './pages/AlertsPage';
import Settings from './pages/Settings';
import CaptainDashboard from './pages/CaptainDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Layout component to wrap Sidebar and Header
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white flex transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-72 transition-all duration-300">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/captain" element={
            <MainLayout>
              <CaptainDashboard />
            </MainLayout>
          } />
          <Route path="/reports" element={
            <MainLayout>
              <Reports />
            </MainLayout>
          } />
          <Route path="/inventory" element={
            <MainLayout>
              <Inventory />
            </MainLayout>
          } />
          <Route path="/navigation" element={
            <MainLayout>
              <Navigation />
            </MainLayout>
          } />
          <Route path="/crew" element={
            <MainLayout>
              <Crew />
            </MainLayout>
          } />
          <Route path="/maintenance" element={
            <MainLayout>
              <Maintenance />
            </MainLayout>
          } />
          <Route path="/alerts" element={
            <MainLayout>
              <AlertsPage />
            </MainLayout>
          } />
          <Route path="/settings" element={
            <MainLayout>
              <Settings />
            </MainLayout>
          } />
        </Route>

        <Route path="*" element={<div className="p-4">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
