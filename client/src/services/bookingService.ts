import { mockBookings } from '../data/mockData';
import { Booking } from '../types';

export const bookingService = {
  getBookings: async (): Promise<Booking[]> => {
    return Promise.resolve(mockBookings);
  },
  
  createBooking: async (bookingData: Partial<Booking>): Promise<Booking> => {
    const newBooking = { ...bookingData, _id: Date.now().toString(), bookingReference: 'REF-' + Date.now() } as Booking;
    return Promise.resolve(newBooking);
  }
};
