import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// Mock route data storage
const savedRoutes = new Map();

router.post('/download-route', (req: AuthRequest, res: Response) => {
  const { origin, destination } = req.body;
  const routeId = 'route_' + Date.now();
  
  const mockRoute = {
    id: routeId,
    origin,
    destination,
    coordinates: [
      { lat: 28.6139, lng: 77.2090 }, // Delhi
      { lat: 27.1751, lng: 78.0421 }  // Agra
    ],
    distance: '233 km',
    duration: '4 hours'
  };
  
  savedRoutes.set(routeId, mockRoute);
  res.json(mockRoute);
});

router.get('/:routeId', (req: AuthRequest, res: Response) => {
  const route = savedRoutes.get(req.params.routeId);
  if (!route) {
     res.status(404).json({ error: 'Route not found' });
     return;
  }
  res.json(route);
});

export default router;
