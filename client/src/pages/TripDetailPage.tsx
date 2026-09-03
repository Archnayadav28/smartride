import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ShieldAlert, Navigation } from 'lucide-react';
import MapCard from '../components/MapCard';
import Button from '../components/ui/Button';
import { mockTrips } from '../data/mockData';

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const trip = mockTrips.find(t => t._id === id) || mockTrips[0];

  if (!trip) return <div className="p-8 text-center">Trip not found</div>;

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-blue-600 text-white p-4 pt-8 sticky top-0 z-10 shadow-md">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-blue-700 rounded-full mr-2">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Trip Details</h1>
        </div>
        <div className="px-2 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{trip.origin}</h2>
            <Navigation className="opacity-50 transform rotate-90" />
            <h2 className="text-2xl font-bold">{trip.destination}</h2>
          </div>
          <p className="text-blue-100 text-sm mt-1">{trip.date} at {trip.time}</p>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        
        {/* Status Badge */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex justify-between items-center border border-gray-100 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400 font-medium">Status</span>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            trip.status === 'upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' :
            trip.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {trip.status}
          </span>
        </div>

        {/* Details Grid */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm grid grid-cols-2 gap-4 border border-gray-100 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Provider</p>
            <p className="font-bold text-gray-900 dark:text-white">{trip.provider || 'SmartRide Services'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Booking ID</p>
            <p className="font-bold text-gray-900 dark:text-white">{trip._id.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</p>
            <p className="font-bold text-gray-900 dark:text-white capitalize">{trip.transportType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</p>
            <p className="font-bold text-gray-900 dark:text-white">Paid</p>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Route Map</h3>
          <div className="rounded-xl overflow-hidden h-48 mb-4 border border-gray-200 dark:border-gray-700">
            <MapCard />
          </div>
          <Button variant="outline" className="w-full flex items-center justify-center">
            <Download size={18} className="mr-2" /> Download Offline Route Map
          </Button>
        </div>

        {/* Support Section */}
        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-red-800 dark:text-red-400 flex items-center">
              <ShieldAlert size={18} className="mr-2" /> Local Emergency
            </h3>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1">Police: 100 • Ambulance: 108</p>
          </div>
          <Button size="sm" className="bg-red-600 hover:bg-red-700 border-0">SOS Call</Button>
        </div>

      </div>
    </div>
  );
}
