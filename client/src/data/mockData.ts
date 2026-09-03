import { Trip, Booking, Offer, EmergencyContact, FAQ, User, Guide } from '../types';

export const mockTrips: Trip[] = [
  { _id: 't1', userId: 'u1', origin: 'Jaipur', destination: 'Ahmedabad', date: '2026-08-27', time: '10:00 AM', transportType: 'bus', provider: 'RSRTC', bookingId: 'b1', status: 'upcoming' },
  { _id: 't2', userId: 'u1', origin: 'Delhi', destination: 'Mumbai', date: '2026-09-05', time: '02:00 PM', transportType: 'flight', provider: 'Air India', bookingId: 'b2', status: 'upcoming' }
];

export const mockGuides: Guide[] = [
  {
    id: 'g1',
    name: 'Rajveer Singh Rathore',
    avatarInitial: 'R',
    location: 'Amer & Jaipur Heritage Circuit',
    languages: ['English', 'Hindi', 'French'],
    category: 'Historical & Cultural',
    shortDescription: 'Licensed Rajasthan heritage storyteller specializing in Amber Fort secret passages & Rajput dynasty lore.',
    about: 'Rajveer is a government-licensed tourist guide with over 10 years of expertise leading foreign dignitaries and cultural travelers through Jaipur palaces, stepwells, and royal armories. He speaks fluent French, English, and Hindi.',
    experienceYears: 10,
    rating: 4.9,
    reviewsCount: 148,
    pricePerDay: 1800,
    availability: 'Available Today',
    badge: 'Govt Certified'
  },
  {
    id: 'g2',
    name: 'Pooja Sharma',
    avatarInitial: 'P',
    location: 'Old City & Bazaars, Jaipur',
    languages: ['English', 'Hindi', 'Gujarati'],
    category: 'Food & Local Experiences',
    shortDescription: 'Local culinary historian and textile trail expert through Johari Bazaar & traditional street food lanes.',
    about: 'Born and raised inside the walled Pink City, Pooja takes visitors off the beaten tourist path to experience secret sweet shops, gem cutters, blue pottery kilns, and royal Rajasthani thali secrets.',
    experienceYears: 6,
    rating: 4.9,
    reviewsCount: 112,
    pricePerDay: 1400,
    availability: 'Available Today',
    badge: 'Culinary Specialist'
  },
  {
    id: 'g3',
    name: 'Vikramaditya Meena',
    avatarInitial: 'V',
    location: 'Nahargarh & Aravali Hills',
    languages: ['English', 'Hindi'],
    category: 'Adventure',
    shortDescription: 'Mountain trek leader, sunrise cycling guide, and ancient watchtower trail explorer.',
    about: 'Vikram leads thrilling morning treks across the Aravali mountain ridges overlooking Jaipur, organizing cycling expeditions to Nahargarh ramparts and dry riverbed stepwells with full safety gear.',
    experienceYears: 7,
    rating: 4.8,
    reviewsCount: 89,
    pricePerDay: 2000,
    availability: 'Available this Week',
    badge: 'First Aid Certified'
  },
  {
    id: 'g4',
    name: 'Sunita Shekhawat',
    avatarInitial: 'S',
    location: 'City Palace & Hawa Mahal',
    languages: ['English', 'Hindi', 'German'],
    category: 'Family Tours',
    shortDescription: 'Engaging, child-friendly storyteller bringing royal legends, puppets, and astronomy alive.',
    about: 'Sunita specializes in comfortable, relaxed tours for families and senior travelers. Her interactive storytelling at Jantar Mantar observatory and royal courtyards delights guests of all generations.',
    experienceYears: 9,
    rating: 5.0,
    reviewsCount: 124,
    pricePerDay: 1600,
    availability: 'Available Today',
    badge: 'Top Rated'
  },
  {
    id: 'g5',
    name: 'Kailash Chand Verma',
    avatarInitial: 'K',
    location: 'Jaipur & Central Sights',
    languages: ['English', 'Hindi', 'Spanish'],
    category: 'Local Sightseeing',
    shortDescription: 'Veteran guide offering comprehensive full-day city tours covering all major landmarks smoothly.',
    about: 'With 12 years of continuous guiding across Rajasthan, Kailash offers seamless city itineraries combining Hawa Mahal, Jal Mahal, Birla Mandir, and Albert Hall Museum with personalized photo spots.',
    experienceYears: 12,
    rating: 4.8,
    reviewsCount: 195,
    pricePerDay: 1500,
    availability: 'Available Today',
    badge: 'Senior Guide'
  },
  {
    id: 'g6',
    name: 'Harshvardhan Joshi',
    avatarInitial: 'H',
    location: 'Jhalana Leopard Reserve & Nahargarh',
    languages: ['English', 'Hindi'],
    category: 'Nature & Wildlife',
    shortDescription: 'Wildlife naturalist and safari tracker specializing in urban leopards and migrant birds.',
    about: 'Harshvardhan is an avid wildlife photographer and certified naturalist leading morning and twilight safaris at Jhalana leopard sanctuary, with deep knowledge of local flora and raptors.',
    experienceYears: 8,
    rating: 4.9,
    reviewsCount: 76,
    pricePerDay: 2200,
    availability: 'Available this Week',
    badge: 'Wildlife Naturalist'
  }
];

export const mockBookings: Booking[] = [
  { _id: 'b1', userId: 'u1', type: 'bus', provider: 'RSRTC', origin: 'Jaipur', destination: 'Ahmedabad', date: '2026-08-27', amount: 800, status: 'confirmed', bookingReference: 'RSRTC-1234' },
  { _id: 'b2', userId: 'u1', type: 'flight', provider: 'Air India', origin: 'Delhi', destination: 'Mumbai', date: '2026-09-05', amount: 5000, status: 'confirmed', bookingReference: 'AI-5678' },
  { _id: 'b3', userId: 'u1', type: 'hotel', provider: 'Taj Palace', checkIn: '2026-08-28', checkOut: '2026-08-30', date: '2026-08-28', amount: 15000, status: 'completed', bookingReference: 'TAJ-9012' },
  { _id: 'b4', userId: 'u1', type: 'cab', provider: 'Uber', origin: 'Airport', destination: 'Hotel', date: '2026-08-28', amount: 500, status: 'completed', bookingReference: 'UBR-3456' },
  { _id: 'b5', userId: 'u1', type: 'bus', provider: 'VRL', origin: 'Pune', destination: 'Bangalore', date: '2026-07-10', amount: 1200, status: 'cancelled', bookingReference: 'VRL-7890' }
];

export const mockOffers: Offer[] = [
  { _id: 'o1', title: 'Hotel Discount', description: 'Get 20% off on all hotel bookings', discount: '20%', validUntil: '2026-12-31', category: 'hotel', code: 'HOTEL20' },
  { _id: 'o2', title: 'Bus Offer', description: 'Flat Rs. 100 off on bus tickets', discount: 'Rs. 100', validUntil: '2026-10-15', category: 'bus', code: 'BUS100' },
  { _id: 'o3', title: 'Cab Deal', description: 'First ride free up to Rs. 200', discount: 'Rs. 200', validUntil: '2026-11-30', category: 'cab', code: 'CABFREE' },
  { _id: 'o4', title: 'Weekend Special', description: 'Extra 10% off on weekend travels', discount: '10%', validUntil: '2026-09-30', category: 'general', code: 'WKND10' }
];

export const mockEmergencyContacts: Record<string, EmergencyContact[]> = {
  IN: [
    { service: 'Police', number: '100', description: 'National Police Helpline' },
    { service: 'Ambulance', number: '102', description: 'National Ambulance Helpline' },
    { service: 'Fire', number: '101', description: 'National Fire Helpline' },
    { service: 'Women Helpline', number: '1091', description: 'National Women Helpline' }
  ],
  US: [
    { service: 'Emergency', number: '911', description: 'All Emergencies' }
  ],
  UK: [
    { service: 'Emergency', number: '999', description: 'All Emergencies' },
    { service: 'Non-Emergency', number: '111', description: 'Medical Non-Emergency' }
  ],
  default: [
    { service: 'International Emergency', number: '112', description: 'Standard Emergency Number' }
  ]
};

export const mockFAQs: FAQ[] = [
  { question: 'How do I book a ticket?', answer: 'Go to the Bookings tab, select your transport type, enter details, and proceed to payment.' },
  { question: 'Can I cancel my booking?', answer: 'Yes, you can cancel from the My Bookings section. Cancellation policies apply.' },
  { question: 'How do I use offline maps?', answer: 'Go to Account > Offline Maps to download maps for your destination before traveling.' },
  { question: 'Is my data secure?', answer: 'Yes, we use industry-standard encryption to protect your personal and payment details.' },
  { question: 'How do I contact support?', answer: 'You can reach us through the Help section or email support@smartride.com.' },
  { question: 'What forms of payment are accepted?', answer: 'We accept credit/debit cards, UPI, and popular mobile wallets.' },
  { question: 'Can I change my language preference?', answer: 'Yes, go to Account > Settings > Language to change it.' },
  { question: 'How do I update my profile?', answer: 'Go to Account > Edit Profile to update your information.' }
];

export const mockUser: User = {
  _id: 'u1',
  name: 'Archna',
  age: 28,
  gender: 'Female',
  address: 'Civil Lines, Jaipur, Rajasthan',
  country: 'India',
  countryCode: 'IN',
  mobile: '9876543210',
  identityType: 'aadhaar',
  identityMasked: 'XXXX-XXXX-1234',
  preferredLanguage: 'en',
  email: '',
  profilePhoto: '',
  dateOfBirth: '',
  emergencyContact: {
    name: 'Rajesh Yadav',
    relationship: 'Parent',
    mobile: '+91 9876543211'
  },
  emergencyContacts: [],
  settings: {
    theme: 'system',
    notifications: true,
    privacy: 'standard'
  },
  profileCompletion: 70,
  isVerified: true
};

export const indianLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' }
];

export const internationalLanguages = [
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' }
];

export const languages = [...indianLanguages, ...internationalLanguages];
