import { openDB, IDBPDatabase } from 'idb';
import { OfflineRoute } from '../types';

const DB_NAME = 'SmartRideDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('routes')) {
          db.createObjectStore('routes', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('mapTiles')) {
          db.createObjectStore('mapTiles', { keyPath: 'url' });
        }
      },
    });
  }
  return dbPromise;
};

export const offlineStorage = {
  saveRoute: async (route: OfflineRoute) => {
    const db = await initDB();
    await db.put('routes', route);
  },
  getRoutes: async (): Promise<OfflineRoute[]> => {
    const db = await initDB();
    return await db.getAll('routes');
  },
  getRoute: async (id: string): Promise<OfflineRoute | undefined> => {
    const db = await initDB();
    return await db.get('routes', id);
  },
  deleteRoute: async (id: string) => {
    const db = await initDB();
    await db.delete('routes', id);
  }
};
