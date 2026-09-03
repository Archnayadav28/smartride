import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Compass, MapPin, Calendar, Clock, Users, CheckCircle2, 
  Search, X, Sparkles, Trash2, ArrowRight, Info
} from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { mockDestinations } from '../data/mockData';
import { DestinationPlace, GuideRequest } from '../types';

export default function OffersPage() {
  const { t } = useTranslation();
  // Navigation Tabs: 'explore' or 'myRequests'
  const [activeTab, setActiveTab] = useState<'explore' | 'myRequests'>('explore');

  // Search filter for Jaipur places
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedPlace, setSelectedPlace] = useState<DestinationPlace | null>(null);
  const [bookingPlace, setBookingPlace] = useState<DestinationPlace | null>(null);

  // Guide Booking Form State
  const [guideDate, setGuideDate] = useState('');
  const [guideTime, setGuideTime] = useState('10:00');
  const [numberOfPeople, setNumberOfPeople] = useState<number>(2);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Saved Guide Requests in LocalStorage
  const [savedRequests, setSavedRequests] = useState<GuideRequest[]>(() => {
    const saved = localStorage.getItem('smartride_guide_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    // Default demo request for demonstration
    return [
      {
        id: 'GR-10492',
        destination: 'Amber Fort',
        destinationLocation: 'Amer, Jaipur',
        destinationImage: '/places/amber-fort.jpg',
        date: '2026-09-12',
        time: '10:00 AM',
        numberOfPeople: 2,
        createdAt: new Date().toISOString()
      }
    ];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('smartride_guide_requests', JSON.stringify(savedRequests));
  }, [savedRequests]);

  // Today's date for datepicker min attribute
  const todayDate = new Date().toISOString().split('T')[0];

  // Filter Jaipur places by search query
  const filteredPlaces = mockDestinations.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open Place Details Modal
  const handleCardClick = (place: DestinationPlace) => {
    setSelectedPlace(place);
  };

  // Open Book Guide Modal from details modal
  const handleOpenBookGuide = (place: DestinationPlace) => {
    setSelectedPlace(null);
    setBookingPlace(place);
    // Initialize form defaults
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setGuideDate(tomorrow.toISOString().split('T')[0]);
    setGuideTime('10:00');
    setNumberOfPeople(2);
    setFormErrors({});
  };

  // Validate and submit guide request
  const handleConfirmRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingPlace) return;

    const errors: Record<string, string> = {};

    if (!guideDate) {
      errors.guideDate = 'Please select a date for your guide.';
    } else if (guideDate < todayDate) {
      errors.guideDate = 'Please choose today or a future date.';
    }

    if (!guideTime) {
      errors.guideTime = 'Please select a time.';
    }

    if (!numberOfPeople || numberOfPeople < 1) {
      errors.numberOfPeople = 'Number of people must be at least 1.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Format display time
    let formattedTime = guideTime;
    const [hStr, mStr] = guideTime.split(':');
    if (hStr && mStr) {
      const h = parseInt(hStr, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 || 12;
      formattedTime = `${displayH}:${mStr} ${ampm}`;
    }

    // Create new Guide Request
    const newRequest: GuideRequest = {
      id: `GR-${Math.floor(10000 + Math.random() * 90000)}`,
      destination: bookingPlace.name,
      destinationLocation: bookingPlace.location,
      destinationImage: bookingPlace.image,
      date: guideDate,
      time: formattedTime,
      numberOfPeople: Number(numberOfPeople),
      createdAt: new Date().toISOString()
    };

    setSavedRequests(prev => [newRequest, ...prev]);
    setBookingPlace(null);
    setSuccessMessage('Guide request saved successfully!');
    setActiveTab('myRequests');

    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  // Delete / cancel saved request
  const handleDeleteRequest = (id: string) => {
    setSavedRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-7xl mx-auto min-h-screen font-sans space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
            <Compass size={14} />
            <span>Jaipur Tourist Guide Service</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {t('offers.title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('offers.subtitle')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl border border-gray-200/80 dark:border-gray-700 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'explore'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            Explore Jaipur Places ({mockDestinations.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('myRequests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'myRequests'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <span>My Guide Requests</span>
            {savedRequests.length > 0 && (
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {savedRequests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3.5 rounded-2xl flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center space-x-3 text-sm">
            <CheckCircle2 size={20} className="text-green-600 dark:text-green-400 flex-shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-green-600 hover:opacity-75">
            <X size={16} />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 1: EXPLORE JAIPUR PLACES                              */}
      {/* ========================================================= */}
      {activeTab === 'explore' && (
        <div className="space-y-6 animate-fade-in">
          {/* Search bar */}
          <div className="relative max-w-md">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Jaipur places, forts, palaces..."
              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-gray-700 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Jaipur Places Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => handleCardClick(place)}
                className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Place Photo */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Place name on photo */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-xl font-extrabold drop-shadow-sm leading-tight">
                      {place.name}
                    </h3>
                    <div className="flex items-center text-xs text-gray-200 drop-shadow-sm mt-0.5">
                      <MapPin size={12} className="mr-1 flex-shrink-0 text-blue-300" />
                      <span className="truncate">{place.location}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                    {place.description}
                  </p>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center">
                      View Details & Guide <ArrowRight size={13} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                      Guide Available
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPlaces.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6">
              <Compass size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="font-bold text-gray-800 dark:text-gray-200">No Jaipur places found</h3>
              <p className="text-xs text-gray-500 mt-1">Try a different monument or landmark keyword.</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs text-blue-600 font-semibold hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: MY GUIDE REQUESTS                                  */}
      {/* ========================================================= */}
      {activeTab === 'myRequests' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                My Guide Requests
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Saved tourist guide requests recorded for your Jaipur visit
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
            >
              <span>+ Book Another Jaipur Place</span>
            </button>
          </div>

          {savedRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
                >
                  <div>
                    {/* Header: Place Name & ID */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {req.destinationImage && (
                          <img
                            src={req.destinationImage}
                            alt={req.destination}
                            className="w-12 h-12 rounded-2xl object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
                          />
                        )}
                        <div>
                          <h3 className="font-extrabold text-base text-gray-900 dark:text-white leading-snug">
                            {req.destination}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-0.5">
                            <MapPin size={11} className="mr-1 text-blue-500 flex-shrink-0" />
                            <span className="truncate">{req.destinationLocation}</span>
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-md">
                        {req.id}
                      </span>
                    </div>

                    {/* Request Details */}
                    <div className="bg-gray-50 dark:bg-gray-750/60 p-3 rounded-2xl space-y-2 text-xs">
                      <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                        <span className="text-gray-400 flex items-center">
                          <Calendar size={13} className="mr-1.5 text-blue-500" /> Date
                        </span>
                        <span className="font-bold">{req.date}</span>
                      </div>

                      <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                        <span className="text-gray-400 flex items-center">
                          <Clock size={13} className="mr-1.5 text-blue-500" /> Time
                        </span>
                        <span className="font-bold">{req.time}</span>
                      </div>

                      <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                        <span className="text-gray-400 flex items-center">
                          <Users size={13} className="mr-1.5 text-blue-500" /> Number of People
                        </span>
                        <span className="font-bold">{req.numberOfPeople} {req.numberOfPeople === 1 ? 'Person' : 'People'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
                      <CheckCircle2 size={13} className="mr-1" /> Request Saved
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(req.id)}
                      className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded-lg transition flex items-center space-x-1"
                      title="Cancel Request"
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6">
              <Compass size={44} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="font-bold text-gray-800 dark:text-gray-200 text-base">No saved guide requests yet</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Select any Jaipur tourist place from the catalog and request a guide for your visit.
              </p>
              <Button
                onClick={() => setActiveTab('explore')}
                className="mt-4 text-xs font-bold py-2.5 px-5"
              >
                Explore Jaipur Places
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. JAIPUR PLACE DETAILS MODAL                             */}
      {/* ========================================================= */}
      {selectedPlace && (
        <Modal
          isOpen={!!selectedPlace}
          onClose={() => setSelectedPlace(null)}
          title={selectedPlace.name}
        >
          <div className="space-y-4">
            {/* Large Place Photo */}
            <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-inner">
              <img
                src={selectedPlace.image}
                alt={selectedPlace.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-600 text-white rounded-md mb-1 inline-block">
                  Jaipur Landmark
                </span>
                <h2 className="text-2xl font-black">{selectedPlace.name}</h2>
                <div className="flex items-center text-xs text-gray-200 mt-0.5">
                  <MapPin size={13} className="mr-1 text-blue-300" />
                  <span>{selectedPlace.location}</span>
                </div>
              </div>
            </div>

            {/* Place Description */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                About this Place
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedPlace.description}
              </p>
            </div>

            {/* Highlights */}
            {selectedPlace.highlights && selectedPlace.highlights.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                  <Sparkles size={12} className="mr-1 text-amber-500" /> Key Highlights
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPlace.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Informational callout */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 p-3 rounded-2xl flex items-start space-x-2.5 text-xs text-blue-900 dark:text-blue-200">
              <Info size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <span>
                A verified local guide will accompany your tour of {selectedPlace.name}, explain historical architecture, and assist with tourist safety.
              </span>
            </div>

            {/* Book a Guide Button */}
            <div className="pt-2">
              <Button
                type="button"
                onClick={() => handleOpenBookGuide(selectedPlace)}
                className="w-full py-3.5 font-bold shadow-md flex items-center justify-center space-x-2 text-sm"
              >
                <Compass size={16} />
                <span>Book a Guide</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================= */}
      {/* 3. BOOK A GUIDE MODAL FORM                                */}
      {/* ========================================================= */}
      {bookingPlace && (
        <Modal
          isOpen={!!bookingPlace}
          onClose={() => setBookingPlace(null)}
          title="Book a Guide"
        >
          <form onSubmit={handleConfirmRequest} className="space-y-4">
            {/* A. Destination: Automatically filled with selected Jaipur place */}
            <div className="bg-blue-50/80 dark:bg-blue-900/20 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900/40 flex items-center space-x-3">
              <img
                src={bookingPlace.image}
                alt={bookingPlace.name}
                className="w-14 h-14 rounded-xl object-cover border border-white dark:border-gray-700 flex-shrink-0 shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400 block">
                  Destination (Jaipur Place)
                </span>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white truncate">
                  {bookingPlace.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center truncate">
                  <MapPin size={11} className="mr-1 text-blue-500" />
                  {bookingPlace.location}
                </p>
              </div>
            </div>

            {/* B. Date: "When do you need a guide?" */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                When do you need a guide? *
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Calendar size={16} />
                </div>
                <input
                  type="date"
                  min={todayDate}
                  value={guideDate}
                  onChange={(e) => {
                    setGuideDate(e.target.value);
                    if (formErrors.guideDate) setFormErrors({ ...formErrors, guideDate: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    formErrors.guideDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                />
              </div>
              {formErrors.guideDate && (
                <p className="text-xs text-red-500 mt-1">{formErrors.guideDate}</p>
              )}
            </div>

            {/* C. Time: "What time do you need the guide?" */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                What time do you need the guide? *
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Clock size={16} />
                </div>
                <input
                  type="time"
                  value={guideTime}
                  onChange={(e) => {
                    setGuideTime(e.target.value);
                    if (formErrors.guideTime) setFormErrors({ ...formErrors, guideTime: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    formErrors.guideTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                />
              </div>
              {formErrors.guideTime && (
                <p className="text-xs text-red-500 mt-1">{formErrors.guideTime}</p>
              )}
            </div>

            {/* D. Number of People: "How many people are travelling?" */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                How many people are travelling? *
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Users size={16} />
                </div>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={numberOfPeople}
                  onChange={(e) => {
                    setNumberOfPeople(Math.max(1, parseInt(e.target.value, 10) || 1));
                    if (formErrors.numberOfPeople) setFormErrors({ ...formErrors, numberOfPeople: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    formErrors.numberOfPeople ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                />
              </div>
              {formErrors.numberOfPeople && (
                <p className="text-xs text-red-500 mt-1">{formErrors.numberOfPeople}</p>
              )}
            </div>

            {/* 4. Summary Before Confirmation */}
            <div className="bg-gray-50 dark:bg-gray-750 p-3.5 rounded-2xl border border-gray-200/80 dark:border-gray-700 space-y-2 text-xs">
              <span className="font-bold text-gray-500 uppercase tracking-wider block text-[10px]">
                Request Summary
              </span>
              <div className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
                <div>
                  <span className="text-gray-400 block text-[10px]">Place:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{bookingPlace.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Date:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{guideDate || 'Not selected'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Time:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{guideTime || 'Not selected'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Number of People:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{numberOfPeople} {numberOfPeople === 1 ? 'Person' : 'People'}</span>
                </div>
              </div>
            </div>

            {/* Confirm Guide Request Button */}
            <div className="pt-2">
              <Button type="submit" className="w-full py-3.5 font-bold shadow-md text-sm">
                Confirm Guide Request
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
