import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, Compass, HelpCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const MainLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/home', icon: <Home size={24} />, label: 'Home' },
    { to: '/bookings', icon: <ClipboardList size={24} />, label: 'Trip Information' },
    { to: '/offers', icon: <Compass size={24} />, label: 'Guides' },
    { to: '/help', icon: <HelpCircle size={24} />, label: 'Help' },
    { to: '/account', icon: <User size={24} />, label: 'Account' },
  ];

  return (
    <div className="flex h-screen bg-[#F4F5F7] dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-40">
        <div className="p-8 pb-4">
          <h1 className="text-3xl font-heading font-semibold text-primary-950 dark:text-white tracking-tight">SmartRide<span className="text-accent">.</span></h1>
        </div>
        <nav className="flex-1 px-4 mt-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-4 px-5 py-3.5 rounded-2xl transition-all duration-300 ease-bespoke group ${
                  isActive
                    ? 'bg-primary-950 dark:bg-white text-white dark:text-primary-950 font-medium shadow-elevated translate-x-2'
                    : 'text-primary-500 hover:text-primary-900 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:translate-x-1'
                }`
              }
            >
              <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                {item.icon}
              </div>
              <span className="tracking-wide text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-6 border-t border-primary-100 dark:border-primary-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-4 w-full px-5 py-3 rounded-2xl text-primary-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-300 group"
          >
            <LogOut strokeWidth={1.5} size={22} className="group-hover:rotate-12 transition-transform" />
            <span className="text-sm tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 scroll-smooth">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-elevated rounded-3xl flex justify-around p-2 z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'text-primary-950 dark:text-white bg-primary-50 dark:bg-primary-800/50 scale-105' 
                  : 'text-primary-400 hover:text-primary-700 dark:text-primary-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {React.cloneElement(item.icon as React.ReactElement, { strokeWidth: isActive ? 2 : 1.5, size: 22 })}
                <span className={`text-[10px] mt-1.5 tracking-wider font-medium ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden mt-0 transition-all'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
