import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AmritaLogo from '../../components/AmritaLogo';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out');
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard/requests',   label: 'Requests' },
    { to: '/dashboard/returns',    label: 'Returns' },
    { to: '/dashboard/history',    label: 'History' },
    { to: '/dashboard/components', label: 'Component DB' },
  ];

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f2f5' }}>

      {/* Top Navbar */}
      <nav
        className="text-white shadow-md"
        style={{ backgroundColor: '#9B1B4B' }}
      >
        <div className="px-6 flex items-center justify-between">

          {/* Left — Amrita Logo + Lab Name */}
          <div className="flex items-center gap-4 py-3">
            <AmritaLogo size="sm" light={true} />
            <div className="w-px h-8 bg-white opacity-30" />
            <div>
              <p className="text-sm font-bold leading-tight">
                RHISC Lab
              </p>
              <p className="text-xs opacity-70 leading-tight">
                Inventory Management
              </p>
            </div>
          </div>

          {/* Center — Nav Links */}
          <div className="flex items-stretch">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-5 py-5 text-sm font-medium transition-all
                   border-b-2 flex items-center ${
                    isActive
                      ? 'border-white text-white font-semibold'
                      : 'border-transparent text-white opacity-75 hover:opacity-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right — User + Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs opacity-60">Logged in as</p>
              <p className="text-sm font-semibold">
                {user.username || 'Admin'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-sm font-semibold px-4 py-2
                         rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: '#9B1B4B' }}
            >
              Logout
            </button>
          </div>

        </div>
      </nav>

    
      {/* Page Content */}
      <main className="px-6 py-6">
        <Outlet />
      </main>

    </div>
  );
};

export default DashboardLayout;