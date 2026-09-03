import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

export default function ProfileEditPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age?.toString() || '',
    gender: user?.gender || '',
    email: user?.email || '',
    address: user?.address || '',
  });
  
  const [preferences, setPreferences] = useState<string[]>(user?.travelPreferences || []);
  const prefOptions = ['Adventure', 'Culture', 'Nature', 'Food', 'Shopping', 'Relaxation'];

  const togglePreference = (pref: string) => {
    if (preferences.includes(pref)) {
      setPreferences(preferences.filter(p => p !== pref));
    } else {
      setPreferences([...preferences, pref]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateUser({
        ...user,
        name: formData.name,
        age: parseInt(formData.age),
        email: formData.email,
        gender: formData.gender,
        address: formData.address,
        travelPreferences: preferences
      });
      navigate(-1);
    }
  };

  if (!user) return null;

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 p-4 pt-8 sticky top-0 z-10 shadow-sm flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full mr-2 text-gray-900 dark:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold dark:text-white">Edit Profile</h1>
        </div>
        <Button onClick={handleSave} size="sm" className="flex items-center">
          <Save size={16} className="mr-1" /> Save
        </Button>
      </div>

      <div className="p-4 max-w-lg mx-auto mt-2">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Editable Info</h2>
            <Input 
              label="Full Name" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Age" 
                type="number" 
                value={formData.age} 
                onChange={(e) => setFormData({...formData, age: e.target.value})} 
                required
              />
              <Input 
                label="Email" 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>
            <Input 
              label="Address" 
              value={formData.address} 
              onChange={(e) => setFormData({...formData, address: e.target.value})} 
            />
            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
                { value: 'Prefer not to say', label: 'Prefer not to say' }
              ]}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Travel Preferences</h2>
            <div className="flex flex-wrap gap-2">
              {prefOptions.map(pref => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => togglePreference(pref)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    preferences.includes(pref) 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Non-editable Info</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Mobile Number</label>
                <div className="font-medium text-gray-700 dark:text-gray-300">{user.mobile}</div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Country</label>
                <div className="font-medium text-gray-700 dark:text-gray-300">{user.country}</div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Identity ID</label>
                <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  XXXX-XXXX-{user.identityMasked?.slice(-4) || 'XXXX'}
                  <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 italic">Contact support to change these details.</p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
