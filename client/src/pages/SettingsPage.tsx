import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, Moon, Sun, Smartphone, Globe, Bell, 
  Shield, Map, ShieldAlert, Check, ChevronRight, Lock, 
  Info, CheckCircle2, Search 
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { indianLanguages, internationalLanguages, languages } from '../data/mockData';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, updateUser } = useAuth();
  const { t, i18n } = useTranslation();

  // Language state initialized from localStorage -> user -> i18n -> 'en'
  const [currentLang, setCurrentLang] = useState<string>(() => {
    return localStorage.getItem('language') || user?.preferredLanguage || i18n.language || 'en';
  });
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');

  // Notification preferences
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('smartride_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return { push: true, email: false, sms: true };
  });

  // Travel preferences (Tourist settings)
  const [offlineMaps, setOfflineMaps] = useState(() => {
    const saved = localStorage.getItem('smartride_offline_maps');
    return saved !== null ? saved === 'true' : true;
  });

  const [emergencyAlerts, setEmergencyAlerts] = useState(() => {
    const saved = localStorage.getItem('smartride_emergency_alerts');
    return saved !== null ? saved === 'true' : true;
  });

  // Privacy setting
  const [privacy, setPrivacy] = useState(() => {
    return localStorage.getItem('smartride_privacy') || user?.settings?.privacy || 'contacts';
  });

  // Modals & feedback
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync language with i18n on mount & when currentLang changes
  useEffect(() => {
    const saved = localStorage.getItem('language') || currentLang || 'en';
    if (i18n.language !== saved) {
      i18n.changeLanguage(saved);
    }
  }, [currentLang, i18n]);

  // Handle language selection
  const handleSelectLanguage = (code: string) => {
    setCurrentLang(code);
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    if (user && updateUser) {
      updateUser({ preferredLanguage: code });
    }
    setIsLangModalOpen(false);
    setLangSearch('');
    showSuccessToast();
  };

  // Handle notification toggle
  const handleToggleNotification = (key: 'push' | 'email' | 'sms') => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('smartride_notifications', JSON.stringify(updated));
    if (user && updateUser) {
      updateUser({
        settings: {
          ...user.settings,
          notifications: updated.push || updated.sms
        }
      });
    }
  };

  // Handle offline maps toggle
  const handleToggleOfflineMaps = () => {
    const next = !offlineMaps;
    setOfflineMaps(next);
    localStorage.setItem('smartride_offline_maps', String(next));
  };

  // Handle emergency alerts toggle
  const handleToggleEmergencyAlerts = () => {
    const next = !emergencyAlerts;
    setEmergencyAlerts(next);
    localStorage.setItem('smartride_emergency_alerts', String(next));
  };

  // Handle privacy change
  const handlePrivacyChange = (val: string) => {
    setPrivacy(val);
    localStorage.setItem('smartride_privacy', val);
    if (user && updateUser) {
      updateUser({
        settings: {
          ...user.settings,
          privacy: val
        }
      });
    }
  };

  const showSuccessToast = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  // Save all settings button
  const handleSaveAll = () => {
    localStorage.setItem('language', currentLang);
    localStorage.setItem('smartride_notifications', JSON.stringify(notifications));
    localStorage.setItem('smartride_offline_maps', String(offlineMaps));
    localStorage.setItem('smartride_emergency_alerts', String(emergencyAlerts));
    localStorage.setItem('smartride_privacy', privacy);

    if (user && updateUser) {
      updateUser({
        preferredLanguage: currentLang,
        settings: {
          ...user.settings,
          theme,
          notifications: notifications.push || notifications.sms,
          privacy
        }
      });
    }

    showSuccessToast();
  };

  // Current language object
  const currentLangObj = languages.find(l => l.code === currentLang) || {
    code: 'en',
    name: 'English',
    nativeName: 'English'
  };

  // Filtered language lists for search in modal
  const filteredIndian = indianLanguages.filter(l => 
    l.name.toLowerCase().includes(langSearch.toLowerCase()) || 
    l.nativeName.toLowerCase().includes(langSearch.toLowerCase())
  );

  const filteredInternational = internationalLanguages.filter(l => 
    l.name.toLowerCase().includes(langSearch.toLowerCase()) || 
    l.nativeName.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <div className="pb-24 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Top Header */}
      <div className="bg-white dark:bg-gray-800 p-4 pt-8 sticky top-0 z-10 shadow-sm flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/account')} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full mr-2 text-gray-900 dark:text-white transition-colors"
            aria-label="Back to Account"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h1>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 max-w-lg mx-auto space-y-6 mt-2">
        {/* Success Alert */}
        {savedSuccess && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-2xl flex items-center space-x-3 text-sm animate-fade-in shadow-sm">
            <CheckCircle2 size={18} className="text-green-600 dark:text-green-400 flex-shrink-0" />
            <span className="font-medium">{t('settings.savedSuccess')}</span>
          </div>
        )}

        {/* 1. Appearance (Theme) */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1 flex items-center">
            <Sun size={14} className="mr-1.5" /> {t('settings.appearance')}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 p-3">
            <div className="grid grid-cols-3 gap-2">
              <button 
                type="button"
                onClick={() => setTheme('light')} 
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all ${
                  theme === 'light' 
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold shadow-sm' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 font-medium'
                }`}
              >
                <Sun size={22} className="mb-2" />
                <span className="text-xs">{t('settings.light')}</span>
              </button>
              
              <button 
                type="button"
                onClick={() => setTheme('dark')} 
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all ${
                  theme === 'dark' 
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold shadow-sm' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 font-medium'
                }`}
              >
                <Moon size={22} className="mb-2" />
                <span className="text-xs">{t('settings.dark')}</span>
              </button>
              
              <button 
                type="button"
                onClick={() => setTheme('system')} 
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all ${
                  theme === 'system' 
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold shadow-sm' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 font-medium'
                }`}
              >
                <Smartphone size={22} className="mb-2" />
                <span className="text-xs">{t('settings.system')}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. Language */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1 flex items-center">
            <Globe size={14} className="mr-1.5" /> {t('settings.language')}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <button
              type="button"
              onClick={() => setIsLangModalOpen(true)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Globe size={20} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{t('settings.preferredLanguage')}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {currentLangObj.name} ({currentLangObj.nativeName})
                  </div>
                </div>
              </div>
              <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-xs">
                <span className="bg-blue-50 dark:bg-blue-900/40 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                  {currentLangObj.nativeName}
                </span>
                <ChevronRight size={18} className="text-gray-400 ml-1.5" />
              </div>
            </button>
          </div>
        </section>

        {/* 3. Notifications */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1 flex items-center">
            <Bell size={14} className="mr-1.5" /> {t('settings.notifications')}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
            {/* Push */}
            <div className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">{t('settings.pushNotifications')}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('settings.pushDesc')}</div>
              </div>
              <button 
                type="button"
                onClick={() => handleToggleNotification('push')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  notifications.push ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label="Toggle Push Notifications"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.push ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">{t('settings.emailAlerts')}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('settings.emailDesc')}</div>
              </div>
              <button 
                type="button"
                onClick={() => handleToggleNotification('email')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  notifications.email ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label="Toggle Email Alerts"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.email ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* SMS */}
            <div className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">{t('settings.smsUpdates')}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('settings.smsDesc')}</div>
              </div>
              <button 
                type="button"
                onClick={() => handleToggleNotification('sms')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  notifications.sms ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label="Toggle SMS Updates"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.sms ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </section>

        {/* 4. Travel Preferences (Tourist Features) */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1 flex items-center">
            <Map size={14} className="mr-1.5" /> {t('settings.touristPreferences')}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
            {/* Offline Maps */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-start space-x-3 pr-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Map size={20} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{t('settings.offlineMaps')}</span>
                    <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      {offlineMaps ? 'Active' : 'Offline'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {t('settings.offlineMapsDesc')}
                  </div>
                </div>
              </div>
              <button 
                type="button"
                onClick={handleToggleOfflineMaps}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none flex-shrink-0 ${
                  offlineMaps ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label="Toggle Offline Maps"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  offlineMaps ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Emergency Assistance */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-start space-x-3 pr-2">
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{t('settings.emergencyAssistance')}</span>
                    <span className="text-[10px] font-semibold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">
                      {emergencyAlerts ? 'Protected' : 'Disabled'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {t('settings.emergencyAssistanceDesc')}
                  </div>
                </div>
              </div>
              <button 
                type="button"
                onClick={handleToggleEmergencyAlerts}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none flex-shrink-0 ${
                  emergencyAlerts ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label="Toggle Emergency Assistance"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emergencyAlerts ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </section>

        {/* 5. Privacy & Security */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1 flex items-center">
            <Shield size={14} className="mr-1.5" /> {t('settings.privacySecurity')}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
            {/* Profile Visibility */}
            <div className="p-4 space-y-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">{t('settings.profileVisibility')}</label>
              <select 
                value={privacy} 
                onChange={(e) => handlePrivacyChange(e.target.value)}
                className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2.5 text-sm"
              >
                <option value="public">Public — Visible to verified travelers</option>
                <option value="contacts">Contacts Only — Visible only to trusted contacts</option>
                <option value="private">Private — Hidden profile</option>
              </select>
            </div>

            {/* Change Password (Demo option) */}
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-left"
            >
              <div className="flex items-center space-x-3">
                <Lock size={18} className="text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.changePassword')}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Account login credentials</div>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 mr-2 text-[11px]">
                  OTP Protected
                </span>
                <ChevronRight size={16} />
              </div>
            </button>
          </div>
        </section>

        {/* 6. About Smart-Ride */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1 flex items-center">
            <Info size={14} className="mr-1.5" /> About Smart-Ride
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 text-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400">Platform</span>
              <span className="font-semibold text-gray-900 dark:text-white">Smart-Ride</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-2">
              <span className="text-gray-500 dark:text-gray-400">Version</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">v1.0.0 (Tourist Release)</span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700 pt-2 text-xs text-gray-500 dark:text-gray-400">
              Smart-Ride is a smart tourist assistance and transit safety platform designed for hassle-free travel across Jaipur and India.
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="pt-2">
          <Button onClick={handleSaveAll} className="w-full py-3.5 shadow-md">
            {t('settings.saveSettings')}
          </Button>
        </div>
      </div>

      {/* Language Selection Modal */}
      <Modal
        isOpen={isLangModalOpen}
        onClose={() => {
          setIsLangModalOpen(false);
          setLangSearch('');
        }}
        title={t('settings.language')}
        size="md"
      >
        <div className="space-y-4">
          {/* Search box */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search language..."
              value={langSearch}
              onChange={(e) => setLangSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
            {/* 1. Fully Supported Languages (English & Hindi) */}
            {([
              { code: 'en', name: 'English', nativeName: 'English' },
              { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
            ].filter(l => 
              l.name.toLowerCase().includes(langSearch.toLowerCase()) || 
              l.nativeName.toLowerCase().includes(langSearch.toLowerCase())
            ).length > 0) && (
              <div>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 px-1 flex items-center justify-between">
                  <span>{t('settings.supportedLanguages')} (Full UI Translation)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">Available</span>
                </h4>
                <div className="space-y-1.5">
                  {[
                    { code: 'en', name: 'English', nativeName: 'English' },
                    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
                  ]
                    .filter(l => 
                      l.name.toLowerCase().includes(langSearch.toLowerCase()) || 
                      l.nativeName.toLowerCase().includes(langSearch.toLowerCase())
                    )
                    .map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => handleSelectLanguage(l.code)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border ${
                          currentLang === l.code 
                            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-semibold shadow-xs'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="font-medium text-base">{l.nativeName}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">({l.name})</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded font-medium border border-emerald-200 dark:border-emerald-800">
                            Full Translation
                          </span>
                        </div>
                        {currentLang === l.code && <Check size={18} className="text-blue-600 dark:text-blue-400" />}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* 2. Indian Languages (Coming Soon) */}
            {filteredIndian.filter(l => l.code !== 'en' && l.code !== 'hi').length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <span>Other Indian Regional Languages</span>
                  <span className="text-[10px] bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 font-normal px-2 py-0.5 rounded-full">Coming Soon</span>
                </h4>
                <div className="space-y-1">
                  {filteredIndian
                    .filter(l => l.code !== 'en' && l.code !== 'hi')
                    .map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => handleSelectLanguage(l.code)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                          currentLang === l.code 
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{l.name}</span>
                          <span className="text-xs text-gray-400 font-normal">({l.nativeName})</span>
                        </div>
                        <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                          Coming Soon
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* 3. International Languages (Coming Soon) */}
            {filteredInternational.filter(l => l.code !== 'en' && l.code !== 'hi').length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <span>International Languages</span>
                  <span className="text-[10px] bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 font-normal px-2 py-0.5 rounded-full">Coming Soon</span>
                </h4>
                <div className="space-y-1">
                  {filteredInternational
                    .filter(l => l.code !== 'en' && l.code !== 'hi')
                    .map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => handleSelectLanguage(l.code)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                          currentLang === l.code 
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{l.name}</span>
                          <span className="text-xs text-gray-400 font-normal">({l.nativeName})</span>
                        </div>
                        <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                          Coming Soon
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {filteredIndian.length === 0 && filteredInternational.length === 0 && (
              <div className="text-center py-6 text-sm text-gray-500">
                No languages found matching "{langSearch}".
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Change Password Demo Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
        size="sm"
      >
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto">
            <Lock size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">OTP-Based Authentication</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              Smart-Ride uses instant mobile OTP verification for enhanced tourist safety and fraud protection. No static password is required for your account.
            </p>
          </div>
          <Button 
            onClick={() => setIsPasswordModalOpen(false)} 
            className="w-full mt-2"
          >
            Understood
          </Button>
        </div>
      </Modal>
    </div>
  );
}
