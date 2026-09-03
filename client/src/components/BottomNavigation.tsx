import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, Compass, HelpCircle, User } from 'lucide-react';

export default function BottomNavigation() {
  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Trip Information', icon: ClipboardList, path: '/bookings' },
    { label: 'Guides', icon: Compass, path: '/offers' },
    { label: 'Help', icon: HelpCircle, path: '/help' },
    { label: 'Account', icon: User, path: '/account' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <div className={`flex flex-col items-center p-1 px-4 rounded-lg ${isActive ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                <item.icon size={20} className={isActive ? 'text-primary-600' : ''} />
                <span className="text-xs font-medium mt-1">{item.label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
