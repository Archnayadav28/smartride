import { CrowdData, CrowdLevel } from '../types';

export const CROWD_THRESHOLDS = {
  LOW: 0.30,
  MEDIUM: 0.55,
  HIGH: 0.75,
  VERY_HIGH: 1.00
};

export const getCrowdLevel = (intensity: number): CrowdLevel => {
  if (intensity <= CROWD_THRESHOLDS.LOW) return 'low';
  if (intensity <= CROWD_THRESHOLDS.MEDIUM) return 'medium';
  if (intensity <= CROWD_THRESHOLDS.HIGH) return 'high';
  return 'very-high';
};

export const getCrowdColor = (level: CrowdLevel): string => {
  switch (level) {
    case 'low': return '#22c55e'; // Green
    case 'medium': return '#eab308'; // Yellow
    case 'high': return '#f97316'; // Orange
    case 'very-high': return '#ef4444'; // Red
    default: return '#22c55e';
  }
};

type LocationType = 'attraction' | 'market' | 'museum' | 'park';

interface TouristLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  basePopularity: number; // 0-100
  type: LocationType;
  radius: number;
}

const TOURIST_LOCATIONS: TouristLocation[] = [
  // Jaipur
  { id: 'j1', name: 'Amber Fort', latitude: 26.9855, longitude: 75.8513, basePopularity: 90, type: 'attraction', radius: 800 },
  { id: 'j2', name: 'Hawa Mahal', latitude: 26.9239, longitude: 75.8267, basePopularity: 85, type: 'attraction', radius: 400 },
  { id: 'j3', name: 'City Palace', latitude: 26.9255, longitude: 75.8236, basePopularity: 80, type: 'attraction', radius: 500 },
  { id: 'j4', name: 'Jantar Mantar', latitude: 26.9247, longitude: 75.8245, basePopularity: 70, type: 'museum', radius: 350 },
  { id: 'j5', name: 'Jal Mahal', latitude: 26.9673, longitude: 75.8456, basePopularity: 85, type: 'attraction', radius: 600 },
  { id: 'j6', name: 'Bapu Bazaar', latitude: 26.9184, longitude: 75.8256, basePopularity: 75, type: 'market', radius: 450 },

  // Ahmedabad
  { id: 'a1', name: 'Sabarmati Ashram', latitude: 23.0607, longitude: 72.5806, basePopularity: 75, type: 'museum', radius: 500 },
  { id: 'a2', name: 'Kankaria Lake', latitude: 23.0063, longitude: 72.6026, basePopularity: 80, type: 'park', radius: 800 },
  { id: 'a3', name: 'Adalaj Stepwell', latitude: 23.1667, longitude: 72.5801, basePopularity: 65, type: 'attraction', radius: 300 },

  // Delhi
  { id: 'd1', name: 'India Gate', latitude: 28.6129, longitude: 77.2295, basePopularity: 95, type: 'park', radius: 600 },
  { id: 'd2', name: 'Red Fort', latitude: 28.6562, longitude: 77.2410, basePopularity: 90, type: 'attraction', radius: 500 },
  { id: 'd3', name: 'Connaught Place', latitude: 28.6304, longitude: 77.2177, basePopularity: 85, type: 'market', radius: 700 },

  // Mumbai
  { id: 'm1', name: 'Gateway of India', latitude: 18.9220, longitude: 72.8347, basePopularity: 95, type: 'attraction', radius: 400 },
  { id: 'm2', name: 'Juhu Beach', latitude: 19.0988, longitude: 72.8265, basePopularity: 85, type: 'park', radius: 800 }
];

/**
 * Calculates a dynamic, deterministic crowd score (0-100) based on factors:
 * 1. Base popularity
 * 2. Day of week (weekends higher)
 * 3. Time of day (peaks vary by location type)
 */
const calculateEstimatedScore = (loc: TouristLocation, date: Date): number => {
  const hour = date.getHours();
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = (day === 0 || day === 6);
  const isFriday = (day === 5);

  let score = loc.basePopularity;

  // Day factor
  if (isWeekend) score += 20;
  else if (isFriday) score += 10;
  else score -= 10;

  // Time factor based on location type
  let timeMultiplier = 1.0;
  
  if (hour < 6) {
    timeMultiplier = 0.1; // Night/Early morning is empty
  } else if (loc.type === 'market') {
    if (hour >= 17 && hour <= 21) timeMultiplier = 1.2; // Evening peak
    else if (hour >= 11 && hour < 17) timeMultiplier = 0.8;
    else timeMultiplier = 0.3;
  } else if (loc.type === 'museum') {
    if (hour >= 10 && hour <= 15) timeMultiplier = 1.1; // Daytime peak
    else if (hour > 17) timeMultiplier = 0.1; // Closed in evening usually
    else timeMultiplier = 0.6;
  } else if (loc.type === 'park') {
    if (hour >= 16 && hour <= 19) timeMultiplier = 1.2; // Evening peak
    else if (hour >= 6 && hour <= 8) timeMultiplier = 0.9; // Morning walk peak
    else timeMultiplier = 0.6;
  } else {
    // General attraction
    if (hour >= 11 && hour <= 16) timeMultiplier = 1.1; // Afternoon peak
    else if (hour >= 9 && hour < 11) timeMultiplier = 0.9;
    else if (hour > 18) timeMultiplier = 0.4;
  }

  score = score * timeMultiplier;

  // Clamp between 5 and 100
  return Math.max(5, Math.min(100, score));
};

export const getEstimatedCrowdData = (): CrowdData[] => {
  const now = new Date();
  
  return TOURIST_LOCATIONS.map(loc => {
    const score = calculateEstimatedScore(loc, now);
    const intensity = score / 100;
    
    return {
      id: loc.id,
      name: loc.name,
      latitude: loc.latitude,
      longitude: loc.longitude,
      intensity: intensity,
      crowdLevel: getCrowdLevel(intensity),
      radius: loc.radius,
      updatedAt: now.toISOString()
    };
  });
};

export const crowdService = {
  /**
   * Fetches crowd data for the given map bounds.
   * Architecture ready to be replaced with: return api.get('/crowds')
   */
  getCrowdData: async (): Promise<CrowdData[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return getEstimatedCrowdData();
  },

  submitCrowdReport: async (latitude: number, longitude: number, intensity: number): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Submitted crowd report:', { latitude, longitude, intensity });
    return { success: true };
  }
};

