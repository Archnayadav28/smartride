import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, PhoneCall, Lightbulb } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import GreetingCard from '../components/GreetingCard';
import ProfileCompletion from '../components/ProfileCompletion';
import MapCard from '../components/MapCard';
import TripCard from '../components/TripCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { mockTrips } from '../data/mockData';
import { offlineStorage } from '../services/offlineStorage';
import { calculateProfileCompletion } from '../utils/profileCompletion';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [showMapModal, setShowMapModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [routeData, setRouteData] = useState({ from: 'City Center', to: 'Amer Fort' });
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          setDownloadComplete(true);
          offlineStorage.saveRoute({ id: Date.now().toString(), origin: routeData.from, destination: routeData.to, downloadedAt: new Date().toISOString(), coordinates: [] });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <main className="pb-24 pt-6 px-5 max-w-2xl mx-auto bg-transparent min-h-screen font-sans">
      <header className="space-y-8 animate-stagger-1">
        <GreetingCard name={user?.name || 'Traveler'} />
        <ProfileCompletion 
          completion={calculateProfileCompletion(user)} 
          onComplete={() => navigate('/profile/complete')} 
        />
      </header>

      <section className="mt-12 animate-stagger-2">
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow p-6 overflow-hidden relative group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 dark:bg-primary-900/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <h2 className="text-2xl font-bold text-primary-950 dark:text-white mb-4 relative z-10">Your Journey</h2>
          
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-sm">
            <MapCard />
          </div>
          
          <div className="mt-6 flex items-end justify-between relative z-10">
            <div>
              <p className="text-lg font-medium text-primary-900 dark:text-primary-100 tracking-tight">Jaipur Region</p>
              <p className="text-sm text-primary-500 dark:text-primary-400 mt-1">Offline map recommended</p>
            </div>
            <button 
              onClick={() => setShowMapModal(true)}
              className="px-5 py-2.5 bg-primary-950 text-white dark:bg-white dark:text-primary-950 rounded-xl font-medium text-sm transition-all duration-300 ease-bespoke hover:bg-accent hover:text-primary-950 flex items-center shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8 animate-stagger-3">
        <section className="md:col-span-7 space-y-4">
          <div className="flex justify-between items-baseline mb-2">
            <h2 className="text-xl font-bold text-primary-950 dark:text-white">Upcoming Trips</h2>
            <button onClick={() => navigate('/bookings')} className="text-sm text-accent-dark dark:text-accent font-medium hover:underline underline-offset-4 transition-all">View All</button>
          </div>
          <div className="space-y-4">
            {mockTrips.slice(0, 2).map((trip) => (
              <article key={trip._id} className="transition-transform duration-300 hover:scale-[1.01]">
                <TripCard trip={trip} onClick={() => navigate(`/trip/${trip._id}`)} />
              </article>
            ))}
          </div>
        </section>

        <section className="md:col-span-5 grid grid-cols-2 gap-4 auto-rows-[minmax(100px,auto)]">
          <button 
            onClick={() => navigate('/help')}
            className="col-span-2 bg-white dark:bg-gray-800 p-5 rounded-3xl flex flex-col items-start justify-center cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow hover:shadow-lg group border border-transparent hover:border-primary-100 text-left"
          >
            <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-red-500 dark:text-red-400 stroke-[1.5]" />
            </div>
            <h3 className="font-medium text-lg text-primary-950 dark:text-white">Emergency</h3>
            <p className="text-xs text-primary-500 mt-1">Tap for immediate assistance</p>
          </button>
          
          <button 
            onClick={() => navigate('/help')}
            className="bg-white dark:bg-gray-800 p-5 rounded-3xl flex flex-col items-start justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow hover:shadow-lg group border border-transparent hover:border-primary-100"
          >
            <PhoneCall className="w-5 h-5 text-primary-600 dark:text-primary-400 mb-2 stroke-[1.5] group-hover:rotate-12 transition-transform" />
            <span className="font-medium text-sm text-primary-900 dark:text-primary-100">Helpline</span>
          </button>
          
          <button 
            onClick={() => navigate('/help')}
            className="bg-white dark:bg-gray-800 p-5 rounded-3xl flex flex-col items-start justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow hover:shadow-lg group border border-transparent hover:border-primary-100"
          >
            <Lightbulb className="w-5 h-5 text-accent dark:text-accent-dark mb-2 stroke-[1.5] group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm text-primary-900 dark:text-primary-100">Tips</span>
          </button>
        </section>
      </div>

      <Modal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        title="Download Offline Map"
      >
        <div className="space-y-4 pt-4">
          <Input 
            label="From" 
            value={routeData.from} 
            onChange={(e) => setRouteData({ ...routeData, from: e.target.value })} 
          />
          <Input 
            label="To" 
            value={routeData.to} 
            onChange={(e) => setRouteData({ ...routeData, to: e.target.value })} 
          />
          
          {downloading ? (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-center text-sm text-gray-500">Downloading... {progress}%</p>
            </div>
          ) : downloadComplete ? (
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-green-600 dark:text-green-400 font-medium">Offline Map Ready ✓</p>
              <p className="text-xs text-gray-500 mt-1">You can now view this route without internet.</p>
            </div>
          ) : (
            <Button onClick={handleDownload} className="w-full">
              Download Route Map (45 MB)
            </Button>
          )}
        </div>
      </Modal>
    </main>
  );
}
