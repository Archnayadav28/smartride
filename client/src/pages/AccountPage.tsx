import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Settings, Edit3, Star, LogOut, ShieldCheck, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProfileCompletion from '../components/ProfileCompletion';
import Button from '../components/ui/Button';
import { calculateProfileCompletion } from '../utils/profileCompletion';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const completionPercentage = calculateProfileCompletion(user);

  return (
    <div className="pb-20 pt-6 px-4 max-w-lg mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm flex flex-col items-center mb-6 relative border border-gray-100 dark:border-gray-700">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-inner overflow-hidden relative">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.name?.charAt(0) || 'U'
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
          <MapPin size={14} className="mr-1" /> {user.country}
        </div>
        <ShieldCheck className="absolute top-4 right-4 text-green-500 w-6 h-6" />
      </div>

      <div className="mb-6">
        <ProfileCompletion 
          completion={completionPercentage} 
          onComplete={() => navigate('/profile/complete')} 
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mb-6 border border-gray-100 dark:border-gray-700 space-y-4">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t('account.personalInfo')}</h3>
        <div className="grid grid-cols-3 text-sm border-b border-gray-100 dark:border-gray-700 pb-3">
          <span className="text-gray-500 col-span-1">{t('account.age')}</span>
          <span className="font-medium dark:text-white col-span-2">{user.age || t('account.notSet')}</span>
        </div>
        <div className="grid grid-cols-3 text-sm border-b border-gray-100 dark:border-gray-700 pb-3">
          <span className="text-gray-500 col-span-1">{t('account.gender')}</span>
          <span className="font-medium dark:text-white col-span-2">{user.gender || t('account.notSet')}</span>
        </div>
        <div className="grid grid-cols-3 text-sm border-b border-gray-100 dark:border-gray-700 pb-3">
          <span className="text-gray-500 col-span-1">{t('account.address')}</span>
          <span className="font-medium dark:text-white col-span-2">{user.address || t('account.notSet')}</span>
        </div>
        {user.email && (
          <div className="grid grid-cols-3 text-sm border-b border-gray-100 dark:border-gray-700 pb-3">
            <span className="text-gray-500 col-span-1">{t('account.email')}</span>
            <span className="font-medium dark:text-white col-span-2 truncate">{user.email}</span>
          </div>
        )}
        {user.dateOfBirth && (
          <div className="grid grid-cols-3 text-sm border-b border-gray-100 dark:border-gray-700 pb-3">
            <span className="text-gray-500 col-span-1">{t('account.birthDate')}</span>
            <span className="font-medium dark:text-white col-span-2">
              {typeof user.dateOfBirth === 'string' ? user.dateOfBirth.split('T')[0] : new Date(user.dateOfBirth).toLocaleDateString()}
            </span>
          </div>
        )}
        <div className="grid grid-cols-3 text-sm border-b border-gray-100 dark:border-gray-700 pb-3">
          <span className="text-gray-500 col-span-1">{t('account.mobile')}</span>
          <span className="font-medium dark:text-white col-span-2">{user.mobile}</span>
        </div>
        <div className="grid grid-cols-3 text-sm border-b border-gray-100 dark:border-gray-700 pb-3">
          <span className="text-gray-500 col-span-1">{t('account.identity')}</span>
          <span className="font-medium dark:text-white col-span-2 flex items-center">
            XXXX-XXXX-{user.identityMasked?.slice(-4) || 'XXXX'}
            <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-400">{t('account.verified')}</span>
          </span>
        </div>
        <div className="grid grid-cols-3 text-sm">
          <span className="text-gray-500 col-span-1">{t('account.language')}</span>
          <span className="font-medium dark:text-white col-span-2 capitalize">{user.preferredLanguage || 'English'}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700 overflow-hidden">
        <button onClick={() => navigate('/profile/edit')} className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
          <div className="flex items-center">
            <Edit3 className="w-5 h-5 text-gray-500 mr-3" />
            <span className="font-medium text-gray-900 dark:text-white">{t('account.editProfile')}</span>
          </div>
        </button>
        <button onClick={() => navigate('/account/settings')} className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
          <div className="flex items-center">
            <Settings className="w-5 h-5 text-gray-500 mr-3" />
            <span className="font-medium text-gray-900 dark:text-white">{t('account.settings')}</span>
          </div>
        </button>
        <button onClick={() => navigate('/account/review')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-gray-500 mr-3" />
            <span className="font-medium text-gray-900 dark:text-white">{t('account.review')}</span>
          </div>
        </button>
      </div>

      <Button onClick={handleLogout} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 py-3">
        <LogOut className="w-5 h-5 mr-2" /> {t('account.logout')}
      </Button>
    </div>
  );
}
