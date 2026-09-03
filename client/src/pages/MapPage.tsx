import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Navigation, Search, Users, WifiOff } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { crowdService, getCrowdColor } from '../services/crowdService';
import { CrowdData } from '../types';
import CrowdLegend from '../components/CrowdLegend';
import ReportCrowdModal from '../components/ReportCrowdModal';
import { useConnection } from '../contexts/ConnectionContext';
import JaipurBoundary from '../components/JaipurBoundary';

// Fix leafet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

function FullscreenHandler() {
  const map = useMapEvents({
    dblclick() {
      const container = map.getContainer();
      if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          (container as any).webkitRequestFullscreen();
        } else if ((container as any).msRequestFullscreen) {
          (container as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }
    }
  });
  return null;
}

export default function MapPage() {
  const navigate = useNavigate();
  const [center, setCenter] = useState<[number, number]>([26.9124, 75.7873]); // Jaipur center
  const [search, setSearch] = useState('');
  
  // Crowd View State
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCrowdView, setShowCrowdView] = useState(false);
  const [crowdData, setCrowdData] = useState<CrowdData[]>([]);
  const { isOnline } = useConnection();

  useEffect(() => {
    if (showCrowdView && isOnline) {
      crowdService.getCrowdData().then(data => setCrowdData(data));
    }
  }, [showCrowdView, isOnline]);

  const handleReportSubmit = async (intensity: number) => {
    // In a real app, we'd use geolocation to get exact coords
    await crowdService.submitCrowdReport(center[0], center[1], intensity);
    alert('Thank you! Your crowd report has been submitted.');
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Unable to get your location. Please check permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // mock geocoding to Delhi
    if (search.toLowerCase().includes('delhi')) {
      setCenter([28.6139, 77.2090]);
    } else if (search.toLowerCase().includes('mumbai')) {
      setCenter([19.0760, 72.8777]);
    } else if (search.toLowerCase().includes('jaipur')) {
      setCenter([26.9124, 75.7873]);
    }
  };

  return (
    <div className="h-screen w-full relative bg-gray-100">
      <div className="absolute top-4 left-4 right-4 z-[1000] flex gap-2">
        <button onClick={() => navigate(-1)} className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg text-gray-900 dark:text-white hover:bg-gray-50">
          <ArrowLeft size={20} />
        </button>
        <form onSubmit={handleSearch} className="flex-1 flex shadow-lg rounded-xl overflow-hidden">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search location..." 
            className="flex-1 px-4 py-3 outline-none border-0 text-gray-900 dark:bg-gray-800 dark:text-white"
          />
          <button type="submit" className="bg-blue-600 px-4 text-white hover:bg-blue-700">
            <Search size={20} />
          </button>
        </form>
      </div>

      <button
        onClick={() => setShowCrowdView(!showCrowdView)}
        className={`absolute top-20 right-4 z-[1000] p-3 rounded-xl shadow-lg flex items-center gap-2 font-medium transition-colors ${
          showCrowdView 
            ? 'bg-blue-600 text-white' 
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50'
        }`}
      >
        <Users size={20} />
        <span className="hidden sm:inline">Crowd View</span>
      </button>

      {showCrowdView && (
        <button
          onClick={() => setShowReportModal(true)}
          className="absolute top-36 right-4 z-[1000] bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 transition-colors"
        >
          <span className="hidden sm:inline">Report Crowd</span>
        </button>
      )}

      {/* Offline Alert if requested while offline */}
      {showCrowdView && !isOnline && (
        <div className="absolute top-[200px] right-4 z-[1000] bg-orange-100 border border-orange-300 text-orange-800 px-3 py-2 rounded-lg text-xs font-medium flex items-center shadow-md">
          <WifiOff size={14} className="mr-1.5" />
          Crowd information unavailable offline
        </div>
      )}

      <button 
        onClick={handleLocation}
        className="absolute bottom-24 right-4 z-[1000] bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50"
      >
        <Navigation size={24} />
      </button>

      {/* Legend */}
      {showCrowdView && (
        <div className="absolute bottom-24 left-4 z-[1000]">
          <CrowdLegend />
        </div>
      )}

      <ReportCrowdModal 
        isOpen={showReportModal} 
        onClose={() => setShowReportModal(false)} 
        onSubmit={handleReportSubmit} 
      />

      <MapContainer 
        center={center} 
        zoom={11} 
        minZoom={9}
        maxBounds={[
          [26.3, 74.8], // Southwest coordinates of Jaipur district (approx)
          [27.8, 76.3]  // Northeast coordinates
        ]}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={false}
      >
        <FullscreenHandler />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <JaipurBoundary />
        <MapUpdater center={center} />
        
        {/* Base markers */}
        <Marker position={center}>
          <Popup>Selected Location</Popup>
        </Marker>

        {/* Crowd Layer */}
        {showCrowdView && crowdData.map((data) => {
          const color = getCrowdColor(data.crowdLevel);
          // compute minutes ago avoiding NaN if parsing fails
          const timeAgo = Math.max(0, Math.round((Date.now() - new Date(data.updatedAt).getTime()) / 60000));
          
          return (
            <Circle
              key={data.id}
              center={[data.latitude, data.longitude]}
              radius={data.radius}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.45,
                weight: 2
              }}
            >
              <Popup>
                <div className="text-center p-1 min-w-[200px]">
                  <h4 className="font-bold text-gray-900 border-b pb-2 mb-2">{data.name || 'Tourist Location'}</h4>
                  
                  <div className="flex items-center justify-center mb-1">
                    <span 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: color }}
                    ></span>
                    <span className="text-sm font-semibold capitalize">
                      Crowd Level: {data.crowdLevel.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">
                    Estimated Crowd: <span className="font-bold">{Math.round(data.intensity * 100)}%</span>
                  </p>
                  
                  <p className="text-xs text-gray-500 mb-1">
                    Status: <span className="font-semibold">"Estimated"</span>
                  </p>

                  <p className="text-xs text-gray-500 italic mb-2 border-b pb-2">
                    Based on: "Historical + time + day + location popularity"
                  </p>
                  
                  <p className="text-[10px] text-gray-400 mb-2">
                    Last calculated: {new Date(data.updatedAt).toLocaleTimeString()}
                  </p>

                  <p className="text-[9px] leading-tight text-gray-400 bg-gray-50 p-1.5 rounded">
                    Estimated crowd level for demonstration purposes. Actual crowd conditions may vary.
                  </p>
                </div>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
}


