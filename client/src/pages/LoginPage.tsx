import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, MapPin } from 'lucide-react';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { countries } from '../data/countries';
import { languages, mockUser } from '../data/mockData';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    country: '',
    address: '',
    mobileNumber: '',
    identityId: '',
    preferredLanguage: 'en',
    hasEmergencyContact: false,
    contactName: '',
    contactRelationship: '',
    contactMobile: ''
  });
  
  const [countryCode, setCountryCode] = useState('+91');
  const [identityType, setIdentityType] = useState<'aadhaar' | 'passport'>('aadhaar');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.country) {
      const selected = countries.find(c => c.code === formData.country || c.name === formData.country);
      if (selected) {
        setCountryCode(selected.dialCode || '');
        setIdentityType(selected.code === 'IN' ? 'aadhaar' : 'passport');
      }
    }
  }, [formData.country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    else if (parseInt(formData.age) < 1 || parseInt(formData.age) > 120) newErrors.age = 'Age must be between 1 and 120';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile Number is required';
    if (!formData.identityId.trim()) newErrors.identityId = `${identityType} is required`;
    
    if (formData.hasEmergencyContact) {
      if (!formData.contactName.trim()) newErrors.contactName = 'Contact Name is required';
      if (!formData.contactRelationship) newErrors.contactRelationship = 'Relationship is required';
      if (!formData.contactMobile.trim()) newErrors.contactMobile = 'Contact Mobile is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await authService.register({
        ...formData,
        name: formData.fullName,
        age: Number(formData.age),
        gender: formData.gender,
        address: formData.address,
        mobile: `${countryCode}${formData.mobileNumber}`,
        identityType
      });
      // Store temp data for OTP
      localStorage.setItem('tempRegistrationData', JSON.stringify({
        ...formData,
        name: formData.fullName,
        mobileNumber: formData.mobileNumber,
        countryCode,
        identityType
      }));
      navigate('/otp-verification');
    } catch (err) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
              <MapPin size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to SmartRide</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Your Smart Travel & Safety Companion</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Age"
                name="age"
                type="number"
                min={1}
                max={120}
                value={formData.age}
                onChange={handleChange}
                error={errors.age}
                required
              />
              <Select
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                error={errors.country}
                options={countries.map(c => ({ value: c.name, label: c.name }))}
                required
              />
            </div>

            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              error={errors.gender}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
                { value: 'Prefer not to say', label: 'Prefer not to say' }
              ]}
              required
            />

            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              placeholder="Enter your address"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number *</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                  {countryCode}
                </span>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter mobile number"
                />
              </div>
              {errors.mobileNumber && <p className="mt-1 text-sm text-red-500">{errors.mobileNumber}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Identity ID *</label>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {identityType}
                </span>
              </div>
              <Input
                name="identityId"
                value={formData.identityId}
                onChange={handleChange}
                error={errors.identityId}
                placeholder={`Enter ${identityType} Number`}
                required
              />
            </div>

            <Select
              label="Preferred Language"
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
              options={languages.map(l => ({ value: l.code, label: l.name }))}
            />

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
                  Would you like to add a family or emergency contact? <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasEmergencyContact: true })}
                    className={`px-3 py-1 text-sm rounded-md ${formData.hasEmergencyContact ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasEmergencyContact: false })}
                    className={`px-3 py-1 text-sm rounded-md ${!formData.hasEmergencyContact ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                  >
                    No
                  </button>
                </div>
              </div>

              {formData.hasEmergencyContact && (
                <div className="space-y-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <Input
                    label="Contact Name"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    error={errors.contactName}
                  />
                  <Select
                    label="Relationship"
                    name="contactRelationship"
                    value={formData.contactRelationship}
                    onChange={handleChange}
                    error={errors.contactRelationship}
                    options={[
                      { value: 'Parent', label: 'Parent' },
                      { value: 'Spouse', label: 'Spouse' },
                      { value: 'Sibling', label: 'Sibling' },
                      { value: 'Friend', label: 'Friend' },
                      { value: 'Other', label: 'Other' }
                    ]}
                  />
                  <Input
                    label="Contact Mobile Number"
                    name="contactMobile"
                    type="tel"
                    value={formData.contactMobile}
                    onChange={handleChange}
                    error={errors.contactMobile}
                  />
                </div>
              )}
            </div>

            {errors.submit && <p className="text-sm text-red-500 text-center">{errors.submit}</p>}

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Create Account'}
            </Button>

            <button
              type="button"
              onClick={() => {
                login(mockUser, 'demo-jwt-token');
                navigate('/home');
              }}
              className="w-full mt-3 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              Explore Complete Website (Demo Mode) →
            </button>
            
            <div className="mt-4 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 text-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-green-500" />
              <span>Your identity information is encrypted and never stored in plain text.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
