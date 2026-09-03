import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

// POST /register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, age, country, countryCode, mobile, identityType, identityNumber, gender, address } = req.body;
    
    if (!name || !age || !country || !countryCode || !mobile || !identityType || !identityNumber) {
       res.status(400).json({ error: 'All fields are required' });
       return;
    }

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
       res.status(400).json({ error: 'User with this mobile number already exists' });
       return;
    }

    const identityHash = await bcrypt.hash(identityNumber, 10);
    const identityMasked = 'XXXX-XXXX-' + identityNumber.slice(-4);
    const otp = process.env.DEMO_OTP || '123456';
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    const user = new User({
      name, age, country, countryCode, mobile, identityType, identityHash, identityMasked, otp, otpExpiry,
      gender, address
    });

    await user.save();
    console.log(`[DEMO] OTP for ${mobile} is ${otp}`);

    res.status(201).json({ message: 'User registered, OTP sent', mobile });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /send-otp
router.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body;
    const user = await User.findOne({ mobile });
    
    if (!user) {
       res.status(404).json({ error: 'User not found' });
       return;
    }

    const otp = process.env.DEMO_OTP || Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    console.log(`[DEMO] OTP for ${mobile} is ${otp}`);
    res.json({ message: 'OTP sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// POST /verify-otp
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { mobile, otp } = req.body;
    const user = await User.findOne({ mobile });

    if (!user) {
       res.status(404).json({ error: 'User not found' });
       return;
    }

    if (user.otp !== otp || (user.otpExpiry && user.otpExpiry < new Date())) {
       res.status(400).json({ error: 'Invalid or expired OTP' });
       return;
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ message: 'Verified successfully', token, user: { id: user._id, name: user.name, mobile: user.mobile, gender: user.gender, address: user.address } });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// POST /login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body;
    const user = await User.findOne({ mobile });
    
    if (!user) {
       res.status(404).json({ error: 'User not found' });
       return;
    }

    const otp = process.env.DEMO_OTP || Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    console.log(`[DEMO] OTP for ${mobile} is ${otp}`);
    res.json({ message: 'OTP sent', mobile });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /logout
router.post('/logout', (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
