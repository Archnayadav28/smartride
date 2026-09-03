import { mockTrips } from '../data/mockData';
import { Trip } from '../types';

export const tripService = {
  getTrips: async (): Promise<Trip[]> => {
    // const res = await api.get('/trips');
    // return res.data;
    return Promise.resolve(mockTrips);
  },
  
  getTrip: async (id: string): Promise<Trip | undefined> => {
    return Promise.resolve(mockTrips.find(t => t._id === id));
  },
  
  createTrip: async (tripData: Partial<Trip>): Promise<Trip> => {
    const newTrip = { ...tripData, _id: Date.now().toString() } as Trip;
    return Promise.resolve(newTrip);
  }
};
