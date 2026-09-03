import { mockOffers } from '../data/mockData';
import { Offer } from '../types';

export const offerService = {
  getOffers: async (): Promise<Offer[]> => {
    return Promise.resolve(mockOffers);
  }
};
