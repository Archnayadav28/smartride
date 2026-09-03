import { User } from '../types';

/**
 * Single source of truth for calculating tourist profile completion percentage.
 * Evaluates the 10 essential profile fields:
 * - Full Name
 * - Age
 * - Gender
 * - Country
 * - Address
 * - Mobile Number
 * - Emergency Contact
 * - Email Address
 * - Date of Birth
 * - Profile Photo
 */
export const calculateProfileCompletion = (user: User | null): number => {
  if (!user) return 0;

  // If user profile is already explicitly completed
  if (user.profileCompletion && user.profileCompletion >= 100) {
    return 100;
  }

  // Check essential profile fields
  const fields = [
    Boolean(user.name?.trim()),
    Boolean(user.age),
    Boolean(user.gender),
    Boolean(user.country?.trim()),
    Boolean(user.address?.trim()),
    Boolean(user.mobile?.trim()),
    Boolean(user.emergencyContact?.name?.trim() || (user.emergencyContacts && user.emergencyContacts.length > 0)),
    Boolean(user.email?.trim()),
    Boolean(user.dateOfBirth),
    Boolean(user.profilePhoto)
  ];

  const filledCount = fields.filter(Boolean).length;
  const percentage = Math.round((filledCount / fields.length) * 100);

  // If all key completion requirements (Email, Date of Birth, Emergency Contact) are filled, guarantee 100%
  if (user.email?.trim() && user.dateOfBirth && (user.emergencyContact?.name?.trim() || (user.emergencyContacts && user.emergencyContacts.length > 0))) {
    return 100;
  }

  return percentage;
};
