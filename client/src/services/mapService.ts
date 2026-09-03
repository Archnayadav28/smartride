import { OfflineRoute } from '../types';

export const mapService = {
  downloadRoute: async (routeId: string): Promise<OfflineRoute> => {
    return Promise.resolve({
      id: routeId,
      origin: 'A',
      destination: 'B',
      downloadedAt: new Date().toISOString(),
      coordinates: [[0, 0], [1, 1]]
    });
  },
  
  getSavedRoute: async (routeId: string): Promise<OfflineRoute | null> => {
    return Promise.resolve(null);
  }
};
