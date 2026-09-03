import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

// Mock hook since it's not provided yet
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
};

export default function ConnectionStatus() {
  const isOnline = useOnlineStatus();
  const [showOnline, setShowOnline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowOnline(true);
      const timer = setTimeout(() => setShowOnline(false), 3000);
      setWasOffline(false);
      return () => clearTimeout(timer);
    } else if (!isOnline) {
      setWasOffline(true);
    }
  }, [isOnline, wasOffline]);

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 w-full z-[100] bg-amber-500 text-white p-2 flex items-center justify-center space-x-2 animate-in slide-in-from-top-full duration-300">
        <WifiOff size={20} />
        <span className="font-medium text-sm">You're offline - Downloaded maps are still available</span>
      </div>
    );
  }

  if (showOnline) {
    return (
      <div className="fixed top-0 left-0 w-full z-[100] bg-green-500 text-white p-2 flex items-center justify-center space-x-2 animate-in slide-in-from-top-full duration-300">
        <Wifi size={20} />
        <span className="font-medium text-sm">Back online</span>
      </div>
    );
  }

  return null;
}
