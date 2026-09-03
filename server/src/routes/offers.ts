import { Router, Request, Response } from 'express';
import Offer from '../models/Offer';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const offers = await Offer.find({ isActive: true, validUntil: { $gte: new Date() } });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
