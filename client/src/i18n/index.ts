import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        bookings: 'Bookings',
        offers: 'Offers',
        help: 'Help',
        account: 'Account'
      },
      home: {
        greeting: 'Hello, {{name}}',
        subtitle: 'Where do you want to go?',
        profileStatus: 'Profile Complete',
        completeProfile: 'Complete Profile',
        yourRoute: 'Your Route',
        downloadOffline: 'Download Offline Maps',
        upcomingTrip: 'Upcoming Trip'
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
        title: 'Bookings',
        bus: 'Bus',
        cab: 'Cab',
        hotel: 'Hotel',
        bookNow: 'Book Now',
        upcoming: 'Upcoming',
        completed: 'Completed',
        cancelled: 'Cancelled',
        myBookings: 'My Bookings'
      },
      offers: {
        title: 'Offers'
      },
      help: {
        title: 'Help',
        emergency: 'Emergency Contacts',
        helpline: 'Helpline',
        howToUse: 'How to use SmartRide',
        faq: 'FAQs',
        reportIssue: 'Report an Issue',
        safetyTips: 'Safety Tips'
      },
      account: {
        title: 'Account',
        settings: 'Settings',
        review: 'Write a Review',
        editProfile: 'Edit Profile',
        profileCompletion: 'Profile Completion'
      },
      settings: {
        language: 'Language',
        theme: 'Theme',
        notifications: 'Notifications',
        privacy: 'Privacy',
        security: 'Security',
        light: 'Light',
        dark: 'Dark',
        system: 'System'
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
        search: 'Search'
      }
    }
  },
  hi: {
    translation: {
      nav: {
        home: 'मुख्य पृष्ठ',
        bookings: 'बुकिंग',
        offers: 'ऑफ़र',
        help: 'मदद',
        account: 'खाता'
      },
      // ... partial for brevity
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

export default i18n;
