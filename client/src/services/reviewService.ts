import { Review } from '../types';

export const reviewService = {
  submitReview: async (review: Partial<Review>): Promise<{success: boolean}> => {
    // await api.post('/reviews', review);
    return Promise.resolve({ success: true });
  },
  
  getReviews: async (): Promise<Review[]> => {
    // const res = await api.get('/reviews');
    // return res.data;
    return Promise.resolve([]);
  }
};
