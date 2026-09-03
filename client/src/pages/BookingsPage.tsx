import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, Users, User, CheckCircle2, 
  MapPin, Shield, Info, AlertCircle, FileText, Phone 
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { mockBookings } from '../data/mockData';
import { TripRecord } from '../types';

export default function BookingsPage() {
  const { t } = useTranslation();
  // Form State
  const [purpose, setPurpose] = useState('');
  const [visitedBefore, setVisitedBefore] = useState<'yes' | 'no' | ''>('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [travelType, setTravelType] = useState<'alone' | 'group'>('alone');
  
  // Group details state
  const [groupSize, setGroupSize] = useState<number | ''>('');
  const [groupHeadName, setGroupHeadName] = useState('');
  const [groupHeadContact, setGroupHeadContact] = useState('');

  // Feedback & validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Stored Trip Records
  const [records, setRecords] = useState<TripRecord[]>(() => {
    const saved = localStorage.getItem('smartride_trip_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    // Default initial tourist travel record for Jaipur visit
    return [
      {
        id: 'TR-10291',
        purpose: 'Exploring heritage architecture, Amer Fort, City Palace, and local handicraft bazaars',
        visitedBefore: false,
        arrivalDate: '2026-09-01',
        departureDate: '2026-09-06',
        travelType: 'Alone',
        createdAt: '2026-09-01T10:00:00.000Z'
      }
    ];
  });

  // Save records to localStorage whenever they update
  useEffect(() => {
    localStorage.setItem('smartride_trip_records', JSON.stringify(records));
  }, [records]);

  // Validation handler
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!purpose.trim()) {
      newErrors.purpose = 'Purpose of travel is required';
    }

    if (!visitedBefore) {
      newErrors.visitedBefore = 'Please select whether you have visited this place before';
    }

    if (!arrivalDate) {
      newErrors.arrivalDate = 'Arrival date is required';
    }

    if (!departureDate) {
      newErrors.departureDate = 'Departure date is required';
    } else if (arrivalDate && new Date(departureDate) < new Date(arrivalDate)) {
      newErrors.departureDate = 'Departure date cannot be before arrival date';
    }

    if (travelType === 'group') {
      if (!groupSize || Number(groupSize) < 2) {
        newErrors.groupSize = 'Please enter at least 2 people for group travel';
      }
      if (!groupHeadName.trim()) {
        newErrors.groupHeadName = 'Group head name is required';
      }
      if (!groupHeadContact.trim()) {
        newErrors.groupHeadContact = 'Group head contact number is required';
      } else if (groupHeadContact.trim().length < 7) {
        newErrors.groupHeadContact = 'Please enter a valid contact number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSaveTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newRecord: TripRecord = {
      id: `TR-${Math.floor(10000 + Math.random() * 90000)}`,
      purpose: purpose.trim(),
      visitedBefore: visitedBefore === 'yes',
      arrivalDate,
      departureDate,
      travelType: travelType === 'alone' ? 'Alone' : 'With Group',
      groupSize: travelType === 'group' ? Number(groupSize) : undefined,
      groupHeadName: travelType === 'group' ? groupHeadName.trim() : undefined,
      groupHeadContact: travelType === 'group' ? groupHeadContact.trim() : undefined,
      createdAt: new Date().toISOString()
    };

    setRecords(prev => [newRecord, ...prev]);
    setSuccessMessage('Trip information saved successfully.');

    // Clear form
    setPurpose('');
    setVisitedBefore('');
    setArrivalDate('');
    setDepartureDate('');
    setTravelType('alone');
    setGroupSize('');
    setGroupHeadName('');
    setGroupHeadContact('');
    setErrors({});

    // Dismiss message after 4 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-lg mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen font-sans space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('bookings.title')}</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {t('bookings.subtitle')}
        </p>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3.5 rounded-2xl flex items-center space-x-3 text-sm animate-fade-in shadow-sm">
          <CheckCircle2 size={20} className="text-green-600 dark:text-green-400 flex-shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* 1. Trip Information Form Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-2.5 mb-5 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">{t('bookings.newRecord')}</h2>
            <p className="text-xs text-gray-400">Keeps your travel itinerary on official record</p>
          </div>
        </div>

        <form onSubmit={handleSaveTrip} className="space-y-4">
          {/* A. Purpose of Travel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Purpose of Travel *
            </label>
            <textarea
              rows={3}
              value={purpose}
              onChange={(e) => {
                setPurpose(e.target.value);
                if (errors.purpose) setErrors(prev => ({ ...prev, purpose: '' }));
              }}
              placeholder="Enter your purpose of travel"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            {errors.purpose && (
              <p className="mt-1 text-xs text-red-500">{errors.purpose}</p>
            )}
          </div>

          {/* B. Previous Visit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Previous Visit *
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Have you visited this place before?</p>
            <div className="grid grid-cols-2 gap-3">
              <label 
                className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-semibold ${
                  visitedBefore === 'yes'
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="visitedBefore"
                  value="yes"
                  checked={visitedBefore === 'yes'}
                  onChange={() => {
                    setVisitedBefore('yes');
                    if (errors.visitedBefore) setErrors(prev => ({ ...prev, visitedBefore: '' }));
                  }}
                  className="sr-only"
                />
                <span>Yes</span>
              </label>

              <label 
                className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-semibold ${
                  visitedBefore === 'no'
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="visitedBefore"
                  value="no"
                  checked={visitedBefore === 'no'}
                  onChange={() => {
                    setVisitedBefore('no');
                    if (errors.visitedBefore) setErrors(prev => ({ ...prev, visitedBefore: '' }));
                  }}
                  className="sr-only"
                />
                <span>No</span>
              </label>
            </div>
            {errors.visitedBefore && (
              <p className="mt-1 text-xs text-red-500">{errors.visitedBefore}</p>
            )}
          </div>

          {/* C & D. Arrival Date & Departure Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                label="Arrival Date *"
                type="date"
                value={arrivalDate}
                onChange={(e) => {
                  setArrivalDate(e.target.value);
                  if (errors.arrivalDate) setErrors(prev => ({ ...prev, arrivalDate: '' }));
                }}
                error={errors.arrivalDate}
                icon={<Calendar size={16} />}
              />
            </div>

            <div>
              <Input
                label="Departure Date *"
                type="date"
                min={arrivalDate}
                value={departureDate}
                onChange={(e) => {
                  setDepartureDate(e.target.value);
                  if (errors.departureDate) setErrors(prev => ({ ...prev, departureDate: '' }));
                }}
                error={errors.departureDate}
                icon={<Calendar size={16} />}
              />
            </div>
          </div>

          {/* E. Travel Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Traveling *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label 
                className={`flex items-center justify-center space-x-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-semibold ${
                  travelType === 'alone'
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="travelType"
                  value="alone"
                  checked={travelType === 'alone'}
                  onChange={() => setTravelType('alone')}
                  className="sr-only"
                />
                <User size={16} />
                <span>Alone</span>
              </label>

              <label 
                className={`flex items-center justify-center space-x-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-semibold ${
                  travelType === 'group'
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="travelType"
                  value="group"
                  checked={travelType === 'group'}
                  onChange={() => setTravelType('group')}
                  className="sr-only"
                />
                <Users size={16} />
                <span>With Group</span>
              </label>
            </div>
          </div>

          {/* Group-specific fields (F, G, H) */}
          {travelType === 'group' && (
            <div className="space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 animate-fade-in">
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                <Users size={14} className="text-blue-600 dark:text-blue-400" />
                <span>Group Details</span>
              </div>

              {/* F. Number of People in Group */}
              <div>
                <Input
                  label="Number of People in Group *"
                  type="number"
                  min="2"
                  placeholder="e.g. 4"
                  value={groupSize.toString()}
                  onChange={(e) => {
                    setGroupSize(e.target.value ? Number(e.target.value) : '');
                    if (errors.groupSize) setErrors(prev => ({ ...prev, groupSize: '' }));
                  }}
                  error={errors.groupSize}
                />
              </div>

              {/* G. Group Head Name */}
              <div>
                <Input
                  label="Group Head Name *"
                  type="text"
                  placeholder="Enter full name of group leader"
                  value={groupHeadName}
                  onChange={(e) => {
                    setGroupHeadName(e.target.value);
                    if (errors.groupHeadName) setErrors(prev => ({ ...prev, groupHeadName: '' }));
                  }}
                  error={errors.groupHeadName}
                />
              </div>

              {/* H. Group Head Contact Number */}
              <div>
                <Input
                  label="Group Head Contact Number *"
                  type="tel"
                  placeholder="e.g. +91 9876543210"
                  value={groupHeadContact}
                  onChange={(e) => {
                    setGroupHeadContact(e.target.value);
                    if (errors.groupHeadContact) setErrors(prev => ({ ...prev, groupHeadContact: '' }));
                  }}
                  error={errors.groupHeadContact}
                  icon={<Phone size={16} />}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <Button type="submit" className="w-full py-3.5 shadow-md">
              Save Trip Information
            </Button>
          </div>
        </form>
      </div>

      {/* 2. Saved Booking / Travel Data Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('bookings.myBookings')}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Saved travel information kept on record for safety and emergency coordination
            </p>
          </div>
          <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full">
            {records.length} Saved
          </span>
        </div>

        {/* List of Registered Trip Records */}
        <div className="space-y-3">
          {records.map((rec) => (
            <div 
              key={rec.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                      {rec.id}
                    </span>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
                      <Shield size={12} className="mr-1" /> Safety Tracked
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base mt-2">
                    {rec.purpose}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl">
                <div>
                  <span className="text-gray-400 block text-[11px]">Arrival</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{rec.arrivalDate}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Departure</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{rec.departureDate}</span>
                </div>
                <div className="mt-1">
                  <span className="text-gray-400 block text-[11px]">Previous Visit</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {rec.visitedBefore ? 'Yes (Repeat Visitor)' : 'No (First Visit)'}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="text-gray-400 block text-[11px]">Traveling</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {rec.travelType}
                  </span>
                </div>
              </div>

              {rec.travelType === 'With Group' && rec.groupHeadName && (
                <div className="text-xs text-gray-600 dark:text-gray-300 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Group Size:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{rec.groupSize} Members</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Group Head:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{rec.groupHeadName}</span>
                  </div>
                  {rec.groupHeadContact && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Contact:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{rec.groupHeadContact}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Existing Travel / Booking Records (Display Only - No Booking Buttons) */}
        <div className="pt-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
            <Info size={14} />
            <span>Transit & Stay Logs On Record</span>
          </div>

          <div className="space-y-3">
            {mockBookings.map((b) => (
              <div 
                key={b._id} 
                className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                      {b.type} Record
                    </span>
                    <h4 className="font-bold text-gray-900 dark:text-white mt-1 text-sm">{b.provider}</h4>
                  </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                  <p>Ref: <span className="font-medium text-gray-700 dark:text-gray-300">{b.bookingReference}</span></p>
                  <p>Date: <span className="font-medium text-gray-700 dark:text-gray-300">{b.date || b.checkIn}</span></p>
                  {b.origin && b.destination && (
                    <p className="flex items-center text-gray-600 dark:text-gray-400 pt-1">
                      <MapPin size={12} className="mr-1 text-blue-500 flex-shrink-0" />
                      <span>{b.origin} → {b.destination}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

