import React, { useState, useEffect, useRef } from 'react';
import { 
  MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents 
} from 'react-leaflet';
import { 
  Search, Navigation, MapPin, ArrowRight, X, AlertCircle, 
  RotateCcw, Compass, Car, Footprints 
} from 'lucide-react';
import JaipurBoundary from './JaipurBoundary';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom Start (Green) and Destination (Red) Pin Icons
const startIcon = L.divIcon({
  className: 'custom-start-marker',
  html: `<div style="background:#16a34a;color:white;padding:4px 8px;border-radius:16px;font-size:11px;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;border:2px solid white;white-space:nowrap;">
    <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:white;margin-right:5px;"></span>
    Start
  </div>`,
  iconSize: [56, 26],
  iconAnchor: [28, 26],
  popupAnchor: [0, -26]
});

const destIcon = L.divIcon({
  className: 'custom-dest-marker',
  html: `<div style="background:#dc2626;color:white;padding:4px 8px;border-radius:16px;font-size:11px;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;border:2px solid white;white-space:nowrap;">
    <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:white;margin-right:5px;"></span>
    Destination
  </div>`,
  iconSize: [84, 26],
  iconAnchor: [42, 26],
  popupAnchor: [0, -26]
});

// Popular Jaipur Tourist Locations
interface LocationSpot {
  name: string;
  category: string;
  coords: [number, number];
  address: string;
}

const JAIPUR_LOCATIONS: LocationSpot[] = [
  { name: 'Hawa Mahal', category: 'Heritage Monument', coords: [26.9239, 75.8267], address: 'Badi Choupad, Pink City' },
  { name: 'Amer Fort', category: 'Fort & Palace', coords: [26.9855, 75.8513], address: 'Devisinghpura, Amer' },
  { name: 'City Palace', category: 'Royal Residence', coords: [26.9258, 75.8236], address: 'Tulsi Marg, Gangori Bazaar' },
  { name: 'Jantar Mantar', category: 'Astronomy & UNESCO', coords: [26.9248, 75.8246], address: 'Gangori Bazaar, Pink City' },
  { name: 'Nahargarh Fort', category: 'Hilltop Fort', coords: [26.9378, 75.8156], address: 'Aravali Hills, Brahampuri' },
  { name: 'Jaigarh Fort', category: 'Military Fort', coords: [26.9845, 75.8459], address: 'Amer, Jaipur' },
  { name: 'Jal Mahal', category: 'Lake Palace', coords: [26.9535, 75.8462], address: 'Amer Road, Man Sagar Lake' },
  { name: 'Albert Hall Museum', category: 'State Museum', coords: [26.9116, 75.8195], address: 'Ram Niwas Garden' },
  { name: 'Birla Mandir', category: 'Temple', coords: [26.8924, 75.8154], address: 'Jawahar Lal Nehru Marg' },
  { name: 'Bapu Bazaar', category: 'Traditional Market', coords: [26.9189, 75.8239], address: 'Pink City, Jaipur' },
  { name: 'Johari Bazaar', category: 'Gems & Jewelry', coords: [26.9212, 75.8265], address: 'Old City, Jaipur' },
  { name: 'Patrika Gate', category: 'Photography & Garden', coords: [26.8396, 75.8051], address: 'Jawahar Circle' },
  { name: 'Galtaji Temple', category: 'Pilgrimage Site', coords: [26.9161, 75.8577], address: 'Galta Gate, Jaipur' },
  { name: 'Civil Lines', category: 'Central Jaipur', coords: [26.9065, 75.7831], address: 'Civil Lines, Jaipur' },
  { name: 'Jaipur Junction Railway Station', category: 'Transit Hub', coords: [26.9204, 75.7878], address: 'Railway Station Road' },
  { name: 'Sindhi Camp Central Bus Stand', category: 'Bus Terminal', coords: [26.9234, 75.7997], address: 'Station Road' },
  { name: 'Jaipur International Airport', category: 'Airport', coords: [26.8289, 75.8056], address: 'Sanganer, Jaipur' }
];

// Helper to update map view and bounds smoothly
function MapViewHandler({ 
  center, 
  bounds 
}: { 
  center?: [number, number]; 
  bounds?: [[number, number], [number, number]] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    } else if (center) {
      map.setView(center, 13);
    }
  }, [center, bounds, map]);

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
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  });
  return null;
}

export default function MapCard() {
  // Default map position: Jaipur Center
  const defaultJaipurCenter: [number, number] = [26.9124, 75.7873];
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSpot[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<LocationSpot | null>(null);

  // Starting location state
  const [startPointName, setStartPointName] = useState('Current Location (Civil Lines)');
  const [startCoords, setStartCoords] = useState<[number, number]>([26.9065, 75.7831]);
  const [isLocating, setIsLocating] = useState(false);

  // Directions state
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [mapBounds, setMapBounds] = useState<[[number, number], [number, number]] | null>(null);
  const [travelMode, setTravelMode] = useState<'drive' | 'walk'>('drive');

  // Error/Status messages
  const [errorMessage, setErrorMessage] = useState('');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions as user types
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (errorMessage) setErrorMessage('');

    if (!text.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = JAIPUR_LOCATIONS.filter(spot => 
      spot.name.toLowerCase().includes(text.toLowerCase()) ||
      spot.category.toLowerCase().includes(text.toLowerCase()) ||
      spot.address.toLowerCase().includes(text.toLowerCase())
    );

    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  // Select location from suggestion or submit
  const handleSelectSpot = (spot: LocationSpot) => {
    setSelectedDestination(spot);
    setSearchQuery(spot.name);
    setShowSuggestions(false);
    setErrorMessage('');
    // Center map on destination
    setMapBounds(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setErrorMessage('Please enter a destination to search.');
      return;
    }

    const match = JAIPUR_LOCATIONS.find(spot => 
      spot.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (match) {
      handleSelectSpot(match);
    } else {
      setErrorMessage(`Location "${searchQuery}" not found in Jaipur. Please select from suggestions.`);
    }
  };

  // Browser Geolocation for Current Location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setStartCoords([lat, lng]);
        setStartPointName('Your Current GPS Location');
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage('Location permission denied. Using default Jaipur start point.');
        } else {
          setErrorMessage('Unable to retrieve your location. Please check device settings.');
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Calculate & Display Directions
  const handleGetDirections = async () => {
    if (!selectedDestination) {
      setErrorMessage('Please search and select a destination first.');
      return;
    }

    setErrorMessage('');
    const destCoords = selectedDestination.coords;

    // Try fetching driving/walking route from OSRM
    const profile = travelMode === 'walk' ? 'walking' : 'driving';
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/${profile}/${startCoords[1]},${startCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`
      );

      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coords: [number, number][] = route.geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]]
          );
          setRouteCoordinates(coords);
          setRouteInfo({
            distance: (route.distance / 1000).toFixed(1) + ' km',
            duration: Math.round(route.duration / 60) + ' mins'
          });

          setMapBounds([
            [Math.min(startCoords[0], destCoords[0]) - 0.005, Math.min(startCoords[1], destCoords[1]) - 0.005],
            [Math.max(startCoords[0], destCoords[0]) + 0.005, Math.max(startCoords[1], destCoords[1]) + 0.005]
          ]);
          return;
        }
      }
    } catch (err) {
      // Fallback to geodesic navigation if offline or OSRM unavailable
    }

    // Geodesic route calculation fallback
    const R = 6371;
    const dLat = (destCoords[0] - startCoords[0]) * Math.PI / 180;
    const dLon = (destCoords[1] - startCoords[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(startCoords[0] * Math.PI / 180) * Math.cos(destCoords[0] * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = (R * c * 1.25).toFixed(1);
    const mins = Math.max(5, Math.round(Number(dist) * (travelMode === 'walk' ? 12 : 2.5)));

    const midLat = (startCoords[0] + destCoords[0]) / 2 + 0.002;
    const midLng = (startCoords[1] + destCoords[1]) / 2 - 0.002;

    setRouteCoordinates([startCoords, [midLat, midLng], destCoords]);
    setRouteInfo({
      distance: dist + ' km',
      duration: mins + ' mins'
    });

    setMapBounds([
      [Math.min(startCoords[0], destCoords[0]) - 0.008, Math.min(startCoords[1], destCoords[1]) - 0.008],
      [Math.max(startCoords[0], destCoords[0]) + 0.008, Math.max(startCoords[1], destCoords[1]) + 0.008]
    ]);
  };

  // Reset / Clear Route
  const handleClearRoute = () => {
    setRouteCoordinates([]);
    setRouteInfo(null);
    setSelectedDestination(null);
    setSearchQuery('');
    setErrorMessage('');
    setMapBounds(null);
  };

  return (
    <div className="w-full flex flex-col space-y-3 font-sans">
      {/* 1. Location Search Bar at Top of Map */}
      <div ref={searchContainerRef} className="relative z-30">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <div className="absolute left-3.5 text-gray-400 pointer-events-none">
            <Search size={18} />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim()) setShowSuggestions(true);
            }}
            placeholder="Search destination..."
            className="w-full pl-10 pr-20 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-600 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />

          <div className="absolute right-2.5 flex items-center space-x-1">
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full"
              >
                <X size={15} />
              </button>
            )}
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-sm"
            >
              Search
            </button>
          </div>
        </form>

        {/* Autocomplete Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 max-h-56 overflow-y-auto z-50">
            <div className="p-1.5 space-y-0.5">
              {suggestions.map((spot) => (
                <button
                  key={spot.name}
                  type="button"
                  onClick={() => handleSelectSpot(spot)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700/60 transition flex items-start space-x-2.5 group"
                >
                  <MapPin size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {spot.name}
                      </span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.2 rounded font-medium">
                        {spot.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">
                      {spot.address}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error / Notification Banner */}
      {errorMessage && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 px-3 py-2 rounded-xl text-xs flex items-center justify-between shadow-sm animate-fade-in z-20">
          <div className="flex items-center space-x-2">
            <AlertCircle size={15} className="text-amber-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-amber-700 hover:opacity-75 ml-2">
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. Map Container with OpenStreetMap TileLayer & JaipurBoundary */}
      <div className="w-full h-64 md:h-72 relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner z-10">
        <MapContainer 
          center={selectedDestination ? selectedDestination.coords : defaultJaipurCenter} 
          zoom={12} 
          minZoom={9}
          maxBounds={[
            [26.3, 74.8],
            [27.8, 76.3]
          ]}
          maxBoundsViscosity={1.0}
          scrollWheelZoom={true}
          doubleClickZoom={false}
          className="w-full h-full"
        >
          <FullscreenHandler />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <JaipurBoundary />
          <MapViewHandler 
            center={selectedDestination ? selectedDestination.coords : undefined} 
            bounds={mapBounds} 
          />

          {/* Starting Location Marker */}
          <Marker position={startCoords} icon={startIcon}>
            <Popup>
              <div className="text-xs">
                <span className="font-bold text-green-700 block">Starting Point</span>
                <span>{startPointName}</span>
              </div>
            </Popup>
          </Marker>

          {/* Destination Marker */}
          {selectedDestination && (
            <Marker position={selectedDestination.coords} icon={destIcon}>
              <Popup>
                <div className="text-xs">
                  <span className="font-bold text-red-700 block">{selectedDestination.name}</span>
                  <span className="text-gray-500">{selectedDestination.address}</span>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Route Polyline */}
          {routeCoordinates.length > 0 && (
            <Polyline 
              positions={routeCoordinates}
              pathOptions={{
                color: '#2563eb',
                weight: 5,
                opacity: 0.85,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: travelMode === 'walk' ? '4, 8' : undefined
              }}
            />
          )}
        </MapContainer>

        {/* GPS Location Button Floating on Map */}
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          title="Use My Current GPS Location"
          className="absolute bottom-3 right-3 z-[400] bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
        >
          <Navigation size={18} className={isLocating ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* 3. Directions & Journey Control Panel */}
      <div className="bg-gray-50 dark:bg-gray-750/50 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-2.5 text-xs">
        {/* Route Points Overview: Current Location -> Destination */}
        <div className="space-y-1.5">
          {/* Starting Point */}
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0"></span>
            <span className="text-gray-400 font-medium">From:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100 truncate">
              {startPointName}
            </span>
          </div>

          <div className="pl-1 text-gray-300 dark:text-gray-600 text-[10px] leading-none">
            ↓
          </div>

          {/* Destination */}
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0"></span>
            <span className="text-gray-400 font-medium">To:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100 truncate">
              {selectedDestination ? selectedDestination.name : 'Select a destination above'}
            </span>
          </div>
        </div>

        {/* Action Controls & Travel Mode */}
        <div className="pt-2 border-t border-gray-200/70 dark:border-gray-700 flex flex-wrap items-center justify-between gap-2">
          {/* Travel Mode Toggle */}
          <div className="flex bg-white dark:bg-gray-800 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setTravelMode('drive')}
              className={`px-2 py-1 rounded-md flex items-center space-x-1 text-[11px] font-semibold transition ${
                travelMode === 'drive'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
              }`}
            >
              <Car size={13} />
              <span>Drive</span>
            </button>
            <button
              type="button"
              onClick={() => setTravelMode('walk')}
              className={`px-2 py-1 rounded-md flex items-center space-x-1 text-[11px] font-semibold transition ${
                travelMode === 'walk'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
              }`}
            >
              <Footprints size={13} />
              <span>Walk</span>
            </button>
          </div>

          {/* Buttons: Get Directions & Clear */}
          <div className="flex items-center space-x-2">
            {routeInfo && (
              <button
                type="button"
                onClick={handleClearRoute}
                className="px-2.5 py-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 text-xs font-medium flex items-center space-x-1 transition"
              >
                <RotateCcw size={13} />
                <span>Clear</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleGetDirections}
              disabled={!selectedDestination}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition shadow-sm ${
                selectedDestination
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Compass size={14} />
              <span>Get Directions</span>
            </button>
          </div>
        </div>

        {/* Route Stats Summary (when route is calculated) */}
        {routeInfo && (
          <div className="mt-2 p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-[10px] text-gray-400 block">Distance</span>
                <span className="font-extrabold text-blue-700 dark:text-blue-300 text-sm">
                  {routeInfo.distance}
                </span>
              </div>
              <div className="border-l border-blue-200 dark:border-blue-800 pl-4">
                <span className="text-[10px] text-gray-400 block">Est. Time</span>
                <span className="font-extrabold text-blue-700 dark:text-blue-300 text-sm">
                  {routeInfo.duration}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
              Route Active
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

