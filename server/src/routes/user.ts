import { Router, Response } from 'express';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-identityHash -otp -otpExpiry');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const updatableFields = ['email', 'profilePhoto', 'address', 'gender', 'dateOfBirth', 'travelPreferences', 'emergencyContact', 'emergencyContacts', 'preferredLanguage'];
    const updateData: any = {};
    
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-identityHash -otp -otpExpiry');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/settings', async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
       res.status(404).json({ error: 'User not found' });
       return;
    }
    user.settings = { ...user.settings, ...req.body };
    await user.save();
    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
