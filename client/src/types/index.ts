export interface User {
  _id: string;
  name: string;
  age: number;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say' | string;
  country: string;
  countryCode: string;
  mobile: string;
  identityType: 'aadhaar' | 'passport';
  identityMasked: string;
  preferredLanguage: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    mobile: string;
  };
  emergencyContacts?: Array<{
    name: string;
    relationship: string;
    mobile: string;
  }>;
  email?: string;
  profilePhoto?: string;
  address?: string;
  dateOfBirth?: string;
  travelPreferences?: string[];
  settings: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    privacy: string;
  };
  profileCompletion: number;
  isVerified: boolean;
}

export interface TripRecord {
  id: string;
  purpose: string;
  visitedBefore: boolean;
  arrivalDate: string;
  departureDate: string;
  travelType: 'Alone' | 'With Group';
  groupSize?: number;
  groupHeadName?: string;
  groupHeadContact?: string;
  createdAt: string;
}

export interface Guide {
  id: string;
  name: string;
  avatarInitial: string;
  photo?: string;
  location: string;
  languages: string[];
  category: string;
  shortDescription: string;
  about: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  pricePerDay: number;
  availability: string;
  badge?: string;
}

export interface GuideBooking {
  id: string;
  guideId: string;
  guideName: string;
  touristName: string;
  contactNumber: string;
  destination: string;
  tourDate: string;
  numberOfTourists: number;
  preferredLanguage: string;
  specialRequirements?: string;
  totalPrice: number;
  status: string;
  bookedAt: string;
}

export interface Trip {
  _id: string;
  userId: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  transportType: 'bus' | 'cab' | 'train' | 'flight';
  provider: string;
  bookingId: string;
  seatNumber?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface Booking {
  _id: string;
  userId: string;
  type: 'bus' | 'cab' | 'hotel' | 'flight';
  provider: string;
  origin?: string;
  destination?: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  amount: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  bookingReference: string;
  details?: Record<string, unknown>;
}

export interface Offer {
  _id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  category: 'hotel' | 'bus' | 'cab' | 'general';
  code?: string;
}

export interface Review {
  _id: string;
  userId: string;
  rating: number;
  category: 'app' | 'booking' | 'maps' | 'support' | 'overall';
  comment: string;
  createdAt: string;
}

export interface EmergencyContact {
  service: string;
  number: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Country {
  name: string;
  code: string;
  dialCode: string;
  identityType: 'aadhaar' | 'passport';
  identityLabel: string;
}

export interface OfflineRoute {
  id: string;
  origin: string;
  destination: string;
  downloadedAt: string;
  coordinates: [number, number][];
  mapTiles?: string[];
}

export type CrowdLevel = 'low' | 'medium' | 'high' | 'very-high';

export interface CrowdData {
  id: string;
  latitude: number;
  longitude: number;
  intensity: number; // 0.0 to 1.0
  name?: string;
  crowdLevel: CrowdLevel;
  radius: number; // in meters
  updatedAt: string;
}


