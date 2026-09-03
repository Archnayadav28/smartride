import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Camera, Plus, Trash2, CheckCircle2, 
  User, ShieldAlert, Heart, Calendar, Mail, Phone 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../services/api';

interface AdditionalContact {
  id: string;
  name: string;
  relationship: string;
  mobile: string;
}

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [profilePhoto, setProfilePhoto] = useState<string>(user?.profilePhoto || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [dob, setDob] = useState<string>(() => {
    if (user?.dateOfBirth) {
      return typeof user.dateOfBirth === 'string' 
        ? user.dateOfBirth.split('T')[0] 
        : new Date(user.dateOfBirth).toISOString().split('T')[0];
    }
    return '';
  });

  // Primary emergency contact (preserved from registration)
  const [primaryContact, setPrimaryContact] = useState({
    name: user?.emergencyContact?.name || '',
    relationship: user?.emergencyContact?.relationship || 'Parent',
    mobile: user?.emergencyContact?.mobile || ''
  });

  // Additional emergency contacts
  const [additionalContacts, setAdditionalContacts] = useState<AdditionalContact[]>(() => {
    if (user?.emergencyContacts && Array.isArray(user.emergencyContacts)) {
      return user.emergencyContacts.map((c, index) => ({
        id: (c as any).id || String(index + 1),
        name: c.name || '',
        relationship: c.relationship || 'Friend',
        mobile: c.mobile || ''
      }));
    }
    return [];
  });

  // UI / Feedback states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Today's date for max date of birth
  const today = new Date().toISOString().split('T')[0];

  // Photo selection & preview handler
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: 'Please select a valid image file.' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'Image size must be under 5MB.' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        setErrors(prev => ({ ...prev, photo: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new additional emergency contact
  const handleAddContact = () => {
    const newContact: AdditionalContact = {
      id: Date.now().toString(),
      name: '',
      relationship: 'Friend',
      mobile: ''
    };
    setAdditionalContacts(prev => [...prev, newContact]);
  };

  // Remove additional contact
  const handleRemoveContact = (id: string) => {
    setAdditionalContacts(prev => prev.filter(c => c.id !== id));
  };

  // Update additional contact field
  const handleUpdateContact = (id: string, field: keyof AdditionalContact, value: string) => {
    setAdditionalContacts(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  // Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Validate date of birth
    if (!dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const selected = new Date(dob);
      const current = new Date();
      if (selected > current) {
        newErrors.dob = 'Date of birth cannot be in the future';
      }
    }

    // Validate emergency contacts if any filled
    additionalContacts.forEach((c, idx) => {
      if (!c.name.trim()) {
        newErrors[`contact_name_${idx}`] = 'Contact name is required';
      }
      if (!c.mobile.trim()) {
        newErrors[`contact_mobile_${idx}`] = 'Mobile number is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save profile handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSuccessMessage('');

    try {
      const updatedData = {
        email: email.trim(),
        profilePhoto,
        dateOfBirth: dob,
        emergencyContact: primaryContact.name ? primaryContact : undefined,
        emergencyContacts: additionalContacts.map(c => ({
          name: c.name.trim(),
          relationship: c.relationship,
          mobile: c.mobile.trim()
        })),
        profileCompletion: 100
      };

      // 1. Update Auth Context and LocalStorage
      updateUser(updatedData);

      // 2. Call backend if available
      try {
        await api.put('/user/profile', updatedData);
      } catch (err) {
        // Backend optional in demo mode
      }

      setSuccessMessage('Profile updated successfully.');

      // Return to My Account after brief confirmation
      setTimeout(() => {
        navigate('/account');
      }, 1200);
    } catch (err) {
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-24 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
      {/* Sticky Header */}
      <div className="bg-white dark:bg-gray-800 p-4 pt-8 sticky top-0 z-10 shadow-sm flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <button 
            type="button"
            onClick={() => navigate('/account')} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full mr-2 text-gray-900 dark:text-white transition-colors"
            aria-label="Back to Account"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Complete Profile</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Add personal details to reach 100% completion</p>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-6 mt-2">
        {/* Success Alert */}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-2xl flex items-center space-x-3 text-sm animate-fade-in shadow-sm">
            <CheckCircle2 size={18} className="text-green-600 dark:text-green-400 flex-shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. Profile Photo Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-4xl font-bold border-4 border-white dark:border-gray-700 shadow-md">
                {profilePhoto ? (
                  <img 
                    src={profilePhoto} 
                    alt={user?.name || 'Avatar'} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span>{user?.name?.charAt(0) || 'U'}</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors border-2 border-white dark:border-gray-800"
                aria-label="Upload Photo"
              >
                <Camera size={16} />
              </button>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoChange} 
              accept="image/*" 
              className="hidden" 
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {profilePhoto ? 'Change Photo' : 'Upload Photo'}
            </button>
            <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG or WEBP up to 5MB</p>

            {errors.photo && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.photo}</p>
            )}
          </div>

          {/* 2. Basic Information (Email & DOB) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
              Essential Contact & Birth Details
            </h2>

            {/* Email */}
            <Input
              label="Email Address *"
              type="email"
              placeholder="e.g. yourname@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              error={errors.email}
              icon={<Mail size={18} />}
              required
            />

            {/* Date of Birth */}
            <Input
              label="Date of Birth *"
              type="date"
              max={today}
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                if (errors.dob) setErrors(prev => ({ ...prev, dob: '' }));
              }}
              error={errors.dob}
              icon={<Calendar size={18} />}
              required
            />
          </div>

          {/* 3. Emergency Contacts */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Emergency & Family Contacts
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Trusted people who will receive instant SOS alerts
                </p>
              </div>
              <ShieldAlert size={20} className="text-red-500" />
            </div>

            {/* Primary Emergency Contact (from Registration) */}
            <div className="bg-gray-50 dark:bg-gray-700/40 p-4 rounded-xl space-y-3 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart size={16} className="text-red-500" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Primary Emergency Contact
                  </span>
                </div>
                <span className="text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                  Primary
                </span>
              </div>

              <Input
                label="Contact Name"
                placeholder="e.g. Rajesh Sharma"
                value={primaryContact.name}
                onChange={(e) => setPrimaryContact({ ...primaryContact, name: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Relationship
                  </label>
                  <select
                    value={primaryContact.relationship}
                    onChange={(e) => setPrimaryContact({ ...primaryContact, relationship: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Parent">Parent</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Child">Child</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <Input
                  label="Mobile Number"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={primaryContact.mobile}
                  onChange={(e) => setPrimaryContact({ ...primaryContact, mobile: e.target.value })}
                />
              </div>
            </div>

            {/* Additional Emergency Contacts */}
            {additionalContacts.map((contact, index) => (
              <div 
                key={contact.id} 
                className="bg-gray-50 dark:bg-gray-700/40 p-4 rounded-xl space-y-3 border border-gray-200 dark:border-gray-600 relative animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Additional Contact #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveContact(contact.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center text-xs"
                    title="Remove Contact"
                  >
                    <Trash2 size={15} className="mr-1" /> Remove
                  </button>
                </div>

                <div>
                  <Input
                    label="Contact Name *"
                    placeholder="Full name"
                    value={contact.name}
                    onChange={(e) => handleUpdateContact(contact.id, 'name', e.target.value)}
                    error={errors[`contact_name_${index}`]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Relationship
                    </label>
                    <select
                      value={contact.relationship}
                      onChange={(e) => handleUpdateContact(contact.id, 'relationship', e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Parent">Parent</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Friend">Friend</option>
                      <option value="Child">Child</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Input
                      label="Mobile Number *"
                      type="tel"
                      placeholder="Mobile number"
                      value={contact.mobile}
                      onChange={(e) => handleUpdateContact(contact.id, 'mobile', e.target.value)}
                      error={errors[`contact_mobile_${index}`]}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Contact Button */}
            <button
              type="button"
              onClick={handleAddContact}
              className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm font-semibold flex items-center justify-center space-x-2"
            >
              <Plus size={18} />
              <span>+ Add Emergency Contact</span>
            </button>
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500 text-center">{errors.submit}</p>
          )}

          {/* 4. Save Profile Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 shadow-md text-base"
            >
              {saving ? 'Saving Profile...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
