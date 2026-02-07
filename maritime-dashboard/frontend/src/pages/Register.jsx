import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const { name, email, password, confirmPassword } = formData;

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match',
      });
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Welcome aboard!',
        timer: 1500,
        showConfirmButton: false
      });
      
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Registration failed';
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
              <i className="fas fa-user-plus text-3xl text-white"></i>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white animate-bounce"></div>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900 mb-1">
            LubeTrack <span className="text-indigo-600">Marine</span>
          </h2>
          <p className="text-gray-500 font-medium text-sm uppercase tracking-widest">Fleet Registration</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="John Smith"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                minLength="6"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <i className="fas fa-check-circle"></i>
              </span>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                required
                minLength="6"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all transform hover:-translate-y-1 hover:shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-circle-notch fa-spin mr-2"></i> Creating Account...
              </span>
            ) : 'Register'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold">Login here</Link>
        </p>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center space-x-1">
            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em]">POWERED BY</span>
            <span className="text-[14px] font-black tracking-tighter text-indigo-500">RapidBizz</span>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em]">DEVELOPED BY</span>
            <span className="text-[14px] font-black tracking-tighter text-gray-900">
              Triplestack <span className="text-indigo-600 font-black italic">X</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
