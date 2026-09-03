import React from 'react';
import { Bus, Car, Train, Plane, ArrowRight } from 'lucide-react';

export interface Trip {
  _id: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  provider: string;
  transportType: 'bus' | 'cab' | 'train' | 'flight';
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
}

export default function TripCard({ trip, onClick }: TripCardProps) {
  const getIcon = () => {
    switch (trip.transportType) {
      case 'bus': return <Bus size={20} className="text-blue-500" />;
      case 'cab': return <Car size={20} className="text-green-500" />;
      case 'train': return <Train size={20} className="text-orange-500" />;
      case 'flight': return <Plane size={20} className="text-purple-500" />;
      default: return <Bus size={20} />;
    }
  };

  const getStatusColor = () => {
    switch (trip.status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Calculate days to go
  const daysToGo = Math.ceil((new Date(trip.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-elevated border border-transparent hover:border-accent/40 transition-all duration-500 ease-bespoke cursor-pointer group" onClick={onClick}>
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-primary-50 dark:bg-primary-900/50 rounded-2xl group-hover:scale-105 transition-transform duration-300">
            {getIcon()}
          </div>
          <div>
            <span className="text-[10px] font-medium text-primary-500 dark:text-primary-400 uppercase tracking-widest">{trip.provider}</span>
            <div className={`text-[10px] font-semibold px-2.5 py-1 rounded-full mt-1.5 w-fit uppercase tracking-wider ${getStatusColor()}`}>
              {trip.status}
            </div>
          </div>
        </div>
        {trip.status === 'upcoming' && daysToGo >= 0 && (
          <span className="text-xs font-heading italic text-accent-dark dark:text-accent">
            {daysToGo === 0 ? 'Today' : `${daysToGo} days away`}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex-1">
          <p className="text-xl font-bold text-primary-950 dark:text-white truncate">{trip.origin}</p>
          <p className="text-xs text-primary-500 dark:text-primary-400 mt-1 uppercase tracking-wider">{trip.date}</p>
        </div>
        <div className="px-4 text-primary-300 dark:text-primary-600 group-hover:translate-x-1 transition-transform duration-300">
          <ArrowRight strokeWidth={1.5} size={20} />
        </div>
        <div className="flex-1 text-right">
          <p className="text-xl font-bold text-primary-950 dark:text-white truncate">{trip.destination}</p>
          <p className="text-xs text-primary-500 dark:text-primary-400 mt-1 uppercase tracking-wider">{trip.time}</p>
        </div>
      </div>
    </div>
  );
}
