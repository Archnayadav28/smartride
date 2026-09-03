import React, { useState, useEffect } from 'react';
import { 
  Compass, MapPin, Star, Clock, Languages, Award, 
  Calendar, Users, Phone, CheckCircle2, Search, Filter, 
  ChevronRight, Shield, X, Sparkles, BookOpen
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { mockGuides } from '../data/mockData';
import { Guide, GuideBooking } from '../types';
import { useAuth } from '../contexts/AuthContext';

const CATEGORIES = [
  'All',
  'Local Sightseeing',
  'Historical & Cultural',
  'Adventure',
  'Food & Local Experiences',
  'Family Tours',
  'Nature & Wildlife'
];

const LANGUAGES = [
  'All',
  'English',
  'Hindi',
  'French',
  'German',
  'Spanish',
  'Gujarati'
];

export default function OffersPage() {
  const { user } = useAuth();

  // Search & Filter State
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [activeTab, setActiveTab] = useState<'explore' | 'myBookings'>('explore');

  // Modals state
  const [viewingGuide, setViewingGuide] = useState<Guide | null>(null);
  const [bookingGuide, setBookingGuide] = useState<Guide | null>(null);

  // Booking Form State
  const [touristName, setTouristName] = useState(user?.name || '');
  const [contactNumber, setContactNumber] = useState(user?.mobile || '');
  const [destination, setDestination] = useState('');
  const [tourDate, setTourDate] = useState('');
  const [numberOfTourists, setNumberOfTourists] = useState<number>(1);
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Guide Bookings storage
  const [myBookings, setMyBookings] = useState<GuideBooking[]>(() => {
    const saved = localStorage.getItem('smartride_guide_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'GB-71829',
        guideId: 'g1',
        guideName: 'Rajveer Singh Rathore',
        touristName: user?.name || 'Archna',
        contactNumber: user?.mobile || '9876543210',
        destination: 'Amer Fort & Nahargarh Sanctuary',
        tourDate: '2026-09-08',
        numberOfTourists: 2,
        preferredLanguage: 'English',
        specialRequirements: 'Interested in royal architecture and photo spots',
        totalPrice: 1800,
        status: 'Confirmed (Demo)',
        bookedAt: '2026-09-02T11:00:00.000Z'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('smartride_guide_bookings', JSON.stringify(myBookings));
  }, [myBookings]);

  // Open booking modal prefilling destination
  const handleOpenBooking = (guide: Guide) => {
    setViewingGuide(null);
    setBookingGuide(guide);
    setDestination(guide.location);
    setPreferredLanguage(guide.languages[0] || 'English');
    setTouristName(user?.name || '');
    setContactNumber(user?.mobile || '');
    setBookingErrors({});
  };

  // Validation
  const validateBooking = () => {
    const errs: Record<string, string> = {};
    if (!touristName.trim()) errs.touristName = 'Tourist name is required';
    if (!contactNumber.trim()) errs.contactNumber = 'Contact number is required';
    else if (contactNumber.trim().length < 7) errs.contactNumber = 'Enter a valid phone number';
    if (!destination.trim()) errs.destination = 'Destination is required';
    if (!tourDate) errs.tourDate = 'Tour date is required';
    if (!numberOfTourists || numberOfTourists < 1) errs.numberOfTourists = 'At least 1 tourist required';
    setBookingErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Booking
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBooking() || !bookingGuide) return;

    const newBooking: GuideBooking = {
      id: `GB-${Math.floor(10000 + Math.random() * 90000)}`,
      guideId: bookingGuide.id,
      guideName: bookingGuide.name,
      touristName: touristName.trim(),
      contactNumber: contactNumber.trim(),
      destination: destination.trim(),
      tourDate,
      numberOfTourists: Number(numberOfTourists),
      preferredLanguage,
      specialRequirements: specialRequirements.trim(),
      totalPrice: bookingGuide.pricePerDay,
      status: 'Confirmed (Demo)',
      bookedAt: new Date().toISOString()
    };

    setMyBookings(prev => [newBooking, ...prev]);
    setSuccessMessage(`Guide booking confirmed successfully for ${bookingGuide.name}! Booking Ref: ${newBooking.id}`);
    setBookingGuide(null);
    setSpecialRequirements('');

    // Switch to my bookings tab to show the record
    setActiveTab('myBookings');

    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  // Filtered guides list
  const filteredGuides = mockGuides.filter((g) => {
    const matchesSearch = 
      !searchLocation.trim() ||
      g.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
      g.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
      g.category.toLowerCase().includes(searchLocation.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'All' || g.category === selectedCategory;

    const matchesLanguage = 
      selectedLanguage === 'All' || g.languages.includes(selectedLanguage);

    return matchesSearch && matchesCategory && matchesLanguage;
  });

  return (
    <div className="pb-24 pt-6 px-4 max-w-5xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Compass className="mr-2 text-blue-600 dark:text-blue-400" size={26} />
            Find a Guide
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Explore your destination with a local guide.
          </p>
        </div>

        {/* Tab Toggle: Explore vs My Booked Guides */}
        <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'explore'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
            }`}
          >
            Available Guides ({mockGuides.length})
          </button>
          <button
            onClick={() => setActiveTab('myBookings')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 ${
              activeTab === 'myBookings'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
            }`}
          >
            <span>My Booked Guides</span>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.2 rounded-full text-[10px]">
              {myBookings.length}
            </span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 px-4 py-3.5 rounded-2xl flex items-center justify-between text-sm shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-emerald-700 hover:opacity-75">
            <X size={16} />
          </button>
        </div>
      )}

      {/* VIEW: AVAILABLE GUIDES */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Destination / Location Search */}
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Search destination or guide..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Language Filter */}
              <div>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="All">All Languages</option>
                  {LANGUAGES.filter(l => l !== 'All').map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              {/* Guide Category Dropdown */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>Category: {cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Quick Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-gray-400 font-semibold uppercase text-[11px] flex items-center pr-1 flex-shrink-0">
                <Filter size={12} className="mr-1" /> Category:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Guide Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top: Avatar, Name, Rating */}
                  <div className="flex items-start space-x-3.5 mb-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-inner">
                      {guide.avatarInitial}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">
                          {guide.name}
                        </h3>
                      </div>

                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center mt-0.5">
                        <MapPin size={12} className="mr-1 flex-shrink-0" />
                        <span className="truncate">{guide.location}</span>
                      </p>

                      <div className="flex items-center space-x-2 mt-1">
                        <span className="flex items-center text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">
                          <Star size={12} className="fill-amber-400 mr-1" />
                          {guide.rating}
                        </span>
                        <span className="text-[11px] text-gray-400">({guide.reviewsCount} reviews)</span>
                        <span className="text-[11px] text-gray-400">• {guide.experienceYears} yrs exp</span>
                      </div>
                    </div>
                  </div>

                  {/* Specialization Badge */}
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {guide.category}
                    </span>
                    {guide.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center">
                        <Shield size={10} className="mr-1" /> {guide.badge}
                      </span>
                    )}
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                    {guide.shortDescription}
                  </p>

                  {/* Spoken Languages */}
                  <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <Languages size={13} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{guide.languages.join(', ')}</span>
                  </div>
                </div>

                {/* Bottom Card Footer: Price & Actions */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs text-gray-400 block">Fee</span>
                      <span className="text-base font-extrabold text-gray-900 dark:text-white">
                        ₹{guide.pricePerDay.toLocaleString()}
                        <span className="text-xs font-normal text-gray-400"> / day</span>
                      </span>
                    </div>

                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                      {guide.availability}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setViewingGuide(guide)}
                      className="w-full py-2 px-3 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleOpenBooking(guide)}
                      className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                    >
                      Book Guide
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredGuides.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
              <Compass className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3 animate-pulse" />
              <h3 className="font-bold text-gray-800 dark:text-gray-200 text-base">No guides found</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                No guides match your current filter criteria. Try resetting the category or searching for another location.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedLanguage('All');
                  setSearchLocation('');
                }}
                className="mt-4 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW: MY BOOKED GUIDES */}
      {activeTab === 'myBookings' && (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Booked Guides</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Official guide bookings registered for your travel safety and support
              </p>
            </div>
            <button
              onClick={() => setActiveTab('explore')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              + Book Another Guide
            </button>
          </div>

          {myBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                      {b.id}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full flex items-center">
                      <Shield size={12} className="mr-1" /> {b.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base mt-2">
                    Guide: {b.guideName}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-0.5">
                    <MapPin size={12} className="mr-1 text-blue-500" />
                    {b.destination}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Total Fee</span>
                  <span className="text-base font-extrabold text-gray-900 dark:text-white">
                    ₹{b.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl text-gray-600 dark:text-gray-300">
                <div>
                  <span className="text-gray-400 block text-[11px]">Tour Date</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{b.tourDate}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Group Size</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{b.numberOfTourists} Tourist(s)</span>
                </div>
                <div className="mt-1">
                  <span className="text-gray-400 block text-[11px]">Tourist Contact</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{b.contactNumber}</span>
                </div>
                <div className="mt-1">
                  <span className="text-gray-400 block text-[11px]">Language</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{b.preferredLanguage}</span>
                </div>
              </div>

              {b.specialRequirements && (
                <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50/50 dark:bg-blue-900/10 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <span className="font-semibold text-blue-800 dark:text-blue-300 block mb-0.5">Special Requests:</span>
                  {b.specialRequirements}
                </div>
              )}
            </div>
          ))}

          {myBookings.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl">
              <Compass className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">No guide bookings yet</p>
              <button
                onClick={() => setActiveTab('explore')}
                className="mt-3 px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl"
              >
                Browse Guides
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: VIEW PROFILE */}
      {viewingGuide && (
        <Modal
          isOpen={!!viewingGuide}
          onClose={() => setViewingGuide(null)}
          title="Guide Profile"
          size="md"
        >
          <div className="space-y-4 pt-1">
            {/* Guide Header */}
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-md">
                {viewingGuide.avatarInitial}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {viewingGuide.name}
                  </h3>
                  {viewingGuide.badge && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 px-2 py-0.5 rounded-full">
                      {viewingGuide.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center mt-0.5">
                  <MapPin size={13} className="mr-1" />
                  {viewingGuide.location}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="flex items-center text-xs font-bold text-amber-500">
                    <Star size={13} className="fill-amber-400 mr-1" />
                    {viewingGuide.rating} ({viewingGuide.reviewsCount} reviews)
                  </span>
                  <span className="text-xs text-gray-400">• {viewingGuide.experienceYears} Years Exp</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Specialization</span>
                <span className="font-bold text-gray-900 dark:text-white">{viewingGuide.category}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Availability</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{viewingGuide.availability}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl col-span-2">
                <span className="text-gray-400 block text-[11px]">Languages Spoken</span>
                <span className="font-bold text-gray-900 dark:text-white">{viewingGuide.languages.join(', ')}</span>
              </div>
            </div>

            {/* About the Guide */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                About the Guide
              </h4>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 bg-blue-50/40 dark:bg-blue-900/10 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                {viewingGuide.about}
              </p>
            </div>

            {/* Price & Book Button */}
            <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
              <div>
                <span className="text-xs text-gray-400 block">Standard Rate</span>
                <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                  ₹{viewingGuide.pricePerDay.toLocaleString()}
                  <span className="text-xs font-normal text-gray-400"> / day</span>
                </span>
              </div>

              <button
                onClick={() => handleOpenBooking(viewingGuide)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Book This Guide
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2: BOOK GUIDE FORM */}
      {bookingGuide && (
        <Modal
          isOpen={!!bookingGuide}
          onClose={() => setBookingGuide(null)}
          title={`Book Guide: ${bookingGuide.name}`}
          size="md"
        >
          <form onSubmit={handleConfirmBooking} className="space-y-4 pt-1">
            {/* Guide Mini Summary */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-xs">
              <div>
                <span className="font-bold text-blue-900 dark:text-blue-200 block">{bookingGuide.name}</span>
                <span className="text-blue-700 dark:text-blue-300">{bookingGuide.category}</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-blue-900 dark:text-blue-200 block">₹{bookingGuide.pricePerDay} / day</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{bookingGuide.availability}</span>
              </div>
            </div>

            {/* Tourist Name */}
            <div>
              <Input
                label="Tourist Name *"
                type="text"
                placeholder="Enter your full name"
                value={touristName}
                onChange={(e) => {
                  setTouristName(e.target.value);
                  if (bookingErrors.touristName) setBookingErrors(prev => ({ ...prev, touristName: '' }));
                }}
                error={bookingErrors.touristName}
              />
            </div>

            {/* Contact Number */}
            <div>
              <Input
                label="Contact Number *"
                type="tel"
                placeholder="Mobile number for guide coordination"
                value={contactNumber}
                onChange={(e) => {
                  setContactNumber(e.target.value);
                  if (bookingErrors.contactNumber) setBookingErrors(prev => ({ ...prev, contactNumber: '' }));
                }}
                error={bookingErrors.contactNumber}
                icon={<Phone size={16} />}
              />
            </div>

            {/* Destination */}
            <div>
              <Input
                label="Destination / Meeting Location *"
                type="text"
                placeholder="e.g. Amber Fort main gate, City Palace courtyard"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  if (bookingErrors.destination) setBookingErrors(prev => ({ ...prev, destination: '' }));
                }}
                error={bookingErrors.destination}
                icon={<MapPin size={16} />}
              />
            </div>

            {/* Tour Date & Number of Tourists */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  label="Tour / Guide Date *"
                  type="date"
                  value={tourDate}
                  onChange={(e) => {
                    setTourDate(e.target.value);
                    if (bookingErrors.tourDate) setBookingErrors(prev => ({ ...prev, tourDate: '' }));
                  }}
                  error={bookingErrors.tourDate}
                  icon={<Calendar size={16} />}
                />
              </div>

              <div>
                <Input
                  label="Number of Tourists *"
                  type="number"
                  min="1"
                  value={numberOfTourists.toString()}
                  onChange={(e) => {
                    setNumberOfTourists(e.target.value ? Number(e.target.value) : 1);
                    if (bookingErrors.numberOfTourists) setBookingErrors(prev => ({ ...prev, numberOfTourists: '' }));
                  }}
                  error={bookingErrors.numberOfTourists}
                  icon={<Users size={16} />}
                />
              </div>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preferred Language *
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {bookingGuide.languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Special Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Special Requirements <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={2}
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                placeholder="e.g. Photography focus, dietary constraints, slow pace for seniors"
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button type="submit" className="w-full py-3.5 font-bold shadow-md">
                Confirm Guide Booking
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

