import { mockEmergencyContacts, mockFAQs } from '../data/mockData';
import { EmergencyContact, FAQ } from '../types';

export const helpService = {
  getEmergencyContacts: async (countryCode: string = 'IN'): Promise<EmergencyContact[]> => {
    return Promise.resolve(mockEmergencyContacts[countryCode] || mockEmergencyContacts['default']);
  },
  
  getFAQs: async (): Promise<FAQ[]> => {
    return Promise.resolve(mockFAQs);
  }
};
