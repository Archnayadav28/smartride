import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, Compass, HelpCircle, User, LogOut, Shield, MapPin } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  // Mock logout
  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Trip Information', icon: ClipboardList, path: '/bookings' },
    { label: 'Guides', icon: Compass, path: '/offers' },
    { label: 'Help', icon: HelpCircle, path: '/help' },
    { label: 'Account', icon: User, path: '/account' },
  ];

  return (
    <div className="hidden md:flex md:flex-col fixed left-0 top-0 w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-40">
      <div className="p-6">
        <div className="flex items-center space-x-2 text-primary-600 mb-2">
          <div className="relative flex items-center justify-center w-10 h-10">
             <Shield className="absolute" size={32} />
             <MapPin className="absolute text-white" size={16} />
          </div>
          <span className="text-2xl font-bold">SmartRide</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Smart Tourism & Safety</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
}
