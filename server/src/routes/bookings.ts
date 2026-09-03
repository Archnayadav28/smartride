import { Router, Response } from 'express';
import Booking from '../models/Booking';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const query: any = { userId: req.user.id };
    if (status) query.status = status;
    
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const bookingReference = 'BK' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
    const booking = new Booking({
      ...req.body,
      userId: req.user.id,
      bookingReference
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
