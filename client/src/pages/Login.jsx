import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import AmritaLogo from '../components/AmritaLogo';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Login successful');
      navigate('/dashboard/requests');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#f0f2f5' }}
    >
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden">

        {/* Maroon Header */}
        <div
          className="flex items-center justify-center py-5 px-8"
          style={{ backgroundColor: '#9B1B4B' }}
        >
          <AmritaLogo size="md" light={true} />
        </div>

        {/* Form Section */}
        <div className="p-8">

          {/* Lab Name */}
          <div className="text-center mb-6">
            <h1 className="text-lg font-bold text-gray-800">
              RHISC Lab
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Inventory Management System
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mb-6" />

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium 
                                text-gray-600 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full border border-gray-200 rounded-lg 
                           px-4 py-2.5 text-sm text-gray-800 bg-gray-50
                           focus:outline-none focus:ring-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium 
                                text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border border-gray-200 rounded-lg 
                           px-4 py-2.5 text-sm text-gray-800 bg-gray-50
                           focus:outline-none focus:ring-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-2.5
                         rounded-lg transition-all text-sm
                         hover:opacity-90 disabled:opacity-60
                         disabled:cursor-not-allowed"
              style={{ backgroundColor: '#9B1B4B' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};

export default Login;