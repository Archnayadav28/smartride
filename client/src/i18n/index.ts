import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        bookings: 'Trip Information',
        offers: 'Guides',
        help: 'Help & Safety',
        account: 'Account',
        logout: 'Logout'
      },
      home: {
        greeting: 'Hello, {{name}}',
        welcomeBack: 'Welcome back, {{name}}.',
        welcomeBackGuest: 'Welcome back.',
        curatedJourneys: 'Curated journeys and safe travels await.',
        goodMorning: 'Good Morning',
        goodAfternoon: 'Good Afternoon',
        goodEvening: 'Good Evening',
        goodNight: 'Good Night',
        subtitle: 'Where do you want to go?',
        profileStatus: 'Profile Complete',
        completeProfile: 'Complete Profile',
        yourJourney: 'Your Journey',
        yourRoute: 'Your Route',
        jaipurRegion: 'Jaipur Region',
        offlineMapRecommended: 'Offline map recommended',
        download: 'Download',
        downloadOffline: 'Download Offline Map',
        emergency: 'Emergency',
        emergencyDesc: 'Tap for immediate assistance',
        helpline: 'Helpline',
        helplineDesc: '24/7 tourist safety support',
        tips: 'Tips',
        tipsDesc: 'Safety advice & local guidance'
      },
      auth: {
        welcome: 'Welcome to SmartRide',
        subtitle: 'Your Smart Travel & Safety Companion',
        fullName: 'Full Name',
        age: 'Age',
        country: 'Country',
        mobile: 'Mobile Number',
        identityType: 'Identity Type',
        identityId: 'Identity ID',
        language: 'Preferred Language',
        emergencyContact: 'Emergency Contact (Optional)',
        register: 'Register',
        verifyOtp: 'Verify OTP',
        otpSent: 'OTP sent successfully',
        resendOtp: 'Resend OTP',
        verify: 'Verify'
      },
      bookings: {
        title: 'Trip Information',
        subtitle: 'Keep your travel details safely recorded for your journey.',
        bus: 'Bus',
        cab: 'Cab',
        hotel: 'Hotel',
        bookNow: 'Book Now',
        upcoming: 'Upcoming',
        completed: 'Completed',
        cancelled: 'Cancelled',
        myBookings: 'Travel Records',
        newRecord: 'Register Travel Details'
      },
      offers: {
        title: 'Explore Jaipur',
        subtitle: 'Discover Jaipur with a local tourist guide.'
      },
      help: {
        title: 'Help & Safety',
        emergency: 'Emergency Contacts',
        helpline: 'Helpline',
        howToUse: 'How to use SmartRide',
        faq: 'FAQs',
        reportIssue: 'Report an Issue',
        safetyTips: 'Safety Tips'
      },
      account: {
        title: 'Account',
        personalInfo: 'Personal Information',
        age: 'Age',
        gender: 'Gender',
        address: 'Address',
        email: 'Email',
        birthDate: 'Birth Date',
        mobile: 'Mobile Number',
        identity: 'Identity ID',
        language: 'Preferred Language',
        verified: 'Verified',
        notSet: 'Not set',
        settings: 'Settings',
        review: 'Submit Review',
        editProfile: 'Edit Profile',
        profileCompletion: 'Profile Completion',
        logout: 'Logout'
      },
      settings: {
        title: 'Settings',
        language: 'Language',
        preferredLanguage: 'Preferred Language',
        theme: 'Theme',
        appearance: 'Appearance',
        notifications: 'Notifications',
        pushNotifications: 'Push Notifications',
        pushDesc: 'Safety alerts',
        emailAlerts: 'Email Alerts',
        emailDesc: 'Booking receipts and travel itineraries',
        smsUpdates: 'SMS Updates',
        smsDesc: 'Security verification OTPs and urgent safety notices',
        touristPreferences: 'Tourist Travel Preferences',
        offlineMaps: 'Offline Maps Preload',
        offlineMapsDesc: 'Preload and cache Jaipur regional routes for travel without cellular network',
        emergencyAssistance: 'Emergency Assistance',
        emergencyAssistanceDesc: 'Send quick SOS coordinates to Rajasthan tourist helpline & local police',
        privacySecurity: 'Privacy & Security',
        privacy: 'Privacy',
        profileVisibility: 'Profile Visibility',
        security: 'Security',
        changePassword: 'Change Password',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
        saveSettings: 'Save Settings',
        savedSuccess: 'Settings saved successfully!',
        supportedLanguages: 'Supported Languages'
      },
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        submit: 'Submit',
        online: 'You are online',
        offline: 'You are offline',
        back: 'Back',
        next: 'Next',
        search: 'Search',
        logout: 'Logout'
      }
    }
  },
  hi: {
    translation: {
      nav: {
        home: 'होम',
        bookings: 'यात्रा विवरण',
        offers: 'गाइड्स',
        help: 'सहायता व सुरक्षा',
        account: 'खाता',
        logout: 'लॉगआउट'
      },
      home: {
        greeting: 'नमस्ते, {{name}}',
        welcomeBack: 'वापसी पर स्वागत है, {{name}}।',
        welcomeBackGuest: 'स्वागत है।',
        curatedJourneys: 'आपकी सुरक्षित एवं सुखद यात्रा की प्रतीक्षा है।',
        goodMorning: 'शुभ प्रभात',
        goodAfternoon: 'शुभ दोपहर',
        goodEvening: 'शुभ संध्या',
        goodNight: 'शुभ रात्रि',
        subtitle: 'आप कहाँ जाना चाहते हैं?',
        profileStatus: 'प्रोफाइल पूर्ण',
        completeProfile: 'प्रोफाइल पूरी करें',
        yourJourney: 'आपकी यात्रा',
        yourRoute: 'आपका मार्ग',
        jaipurRegion: 'जयपुर क्षेत्र',
        offlineMapRecommended: 'ऑफ़लाइन मानचित्र अनुशंसित',
        download: 'डाउनलोड',
        downloadOffline: 'ऑफ़लाइन मानचित्र डाउनलोड करें',
        emergency: 'आपातकालीन',
        emergencyDesc: 'तुरंत सहायता के लिए टैप करें',
        helpline: 'हेल्पलाइन',
        helplineDesc: '24/7 पर्यटक सुरक्षा सहायता',
        tips: 'सुझाव',
        tipsDesc: 'सुरक्षा सलाह व स्थानीय मार्गदर्शन'
      },
      auth: {
        welcome: 'स्मार्ट-राइड में आपका स्वागत है',
        subtitle: 'आपका स्मार्ट यात्रा और सुरक्षा साथी',
        fullName: 'पूरा नाम',
        age: 'आयु',
        country: 'देश',
        mobile: 'मोबाइल नंबर',
        identityType: 'पहचान प्रकार',
        identityId: 'पहचान पत्र (आईडी)',
        language: 'पसंदीदा भाषा',
        emergencyContact: 'आपातकालीन संपर्क (वैकल्पिक)',
        register: 'पंजीकरण करें',
        verifyOtp: 'ओटीपी सत्यापित करें',
        otpSent: 'ओटीपी सफलतापूर्वक भेजा गया',
        resendOtp: 'ओटीपी पुनः भेजें',
        verify: 'सत्यापित करें'
      },
      bookings: {
        title: 'यात्रा विवरण',
        subtitle: 'अपनी यात्रा के विवरण सुरक्षित रूप से रिकॉर्ड रखें।',
        bus: 'बस',
        cab: 'कैब',
        hotel: 'होटल',
        bookNow: 'अभी बुक करें',
        upcoming: 'आगामी',
        completed: 'पूर्ण',
        cancelled: 'रद्द',
        myBookings: 'यात्रा रिकॉर्ड्स',
        newRecord: 'यात्रा विवरण दर्ज करें'
      },
      offers: {
        title: 'जयपुर घूमें',
        subtitle: 'स्थानीय टूरिस्ट गाइड के साथ जयपुर का भ्रमण करें।'
      },
      help: {
        title: 'सहायता व सुरक्षा',
        emergency: 'आपातकालीन संपर्क',
        helpline: 'हेल्पलाइन',
        howToUse: 'स्मार्ट-राइड का उपयोग कैसे करें',
        faq: 'अक्सर पूछे जाने वाले प्रश्न',
        reportIssue: 'समस्या की शिकायत करें',
        safetyTips: 'सुरक्षा सुझाव'
      },
      account: {
        title: 'खाता',
        personalInfo: 'व्यक्तिगत जानकारी',
        age: 'आयु',
        gender: 'लिंग',
        address: 'पता',
        email: 'ईमेल',
        birthDate: 'जन्म तिथि',
        mobile: 'मोबाइल नंबर',
        identity: 'पहचान पत्र (आईडी)',
        language: 'पसंदीदा भाषा',
        verified: 'सत्यापित',
        notSet: 'दर्ज नहीं',
        settings: 'सेटिंग्स',
        review: 'समीक्षा दें',
        editProfile: 'प्रोफाइल संपादित करें',
        profileCompletion: 'प्रोफाइल पूर्णता',
        logout: 'लॉगआउट'
      },
      settings: {
        title: 'सेटिंग्स',
        language: 'भाषा',
        preferredLanguage: 'पसंदीदा भाषा',
        theme: 'थीम',
        appearance: 'रंगरूप (थीम)',
        notifications: 'सूचनाएं (नोटिफिकेशन)',
        pushNotifications: 'पुश नोटिफिकेशन',
        pushDesc: 'सुरक्षा अलर्ट',
        emailAlerts: 'ईमेल अलर्ट',
        emailDesc: 'बुकिंग रसीदें और यात्रा विवरण',
        smsUpdates: 'एसएमएस अपडेट',
        smsDesc: 'सुरक्षा सत्यापन ओटीपी और तत्काल सूचनाएं',
        touristPreferences: 'पर्यटक यात्रा प्राथमिकताएं',
        offlineMaps: 'ऑफ़लाइन मानचित्र प्रीलोड',
        offlineMapsDesc: 'नेटवर्क के बिना यात्रा के लिए जयपुर के मार्गों को सहेजें',
        emergencyAssistance: 'आपातकालीन सहायता',
        emergencyAssistanceDesc: 'राजस्थान पर्यटक हेल्पलाइन और स्थानीय पुलिस को तत्काल एसओएस भेजें',
        privacySecurity: 'गोपनीयता और सुरक्षा',
        privacy: 'गोपनीयता',
        profileVisibility: 'प्रोफाइल दृश्यता',
        security: 'सुरक्षा',
        changePassword: 'पासवर्ड बदलें',
        light: 'लाइट',
        dark: 'डार्क',
        system: 'सिस्टम',
        saveSettings: 'सेटिंग्स सहेजें',
        savedSuccess: 'सेटिंग्स सफलतापूर्वक सहेजी गईं!',
        supportedLanguages: 'समर्थित भाषाएं'
      },
      common: {
        loading: 'लोड हो रहा है...',
        error: 'एक त्रुटि हुई',
        success: 'सफलता',
        cancel: 'रद्द करें',
        save: 'सहेजें',
        submit: 'जमा करें',
        online: 'आप ऑनलाइन हैं',
        offline: 'आप ऑफ़लाइन हैं',
        back: 'वापस',
        next: 'आगे',
        search: 'खोजें',
        logout: 'लॉगआउट'
      }
    }
  }
};

const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Always synchronize localStorage whenever language changes anywhere
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;

