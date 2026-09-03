import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import seedData from './utils/seedData';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import tripRoutes from './routes/trips';
import bookingRoutes from './routes/bookings';
import offerRoutes from './routes/offers';
import reviewRoutes from './routes/reviews';
import helpRoutes from './routes/help';
import mapRoutes from './routes/maps';

dotenv.config();

const app: Application = express();

// Security and Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(async () => {
      console.log('Connected to MongoDB');
      await seedData();
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
} else {
  console.warn('WARNING: MONGODB_URI not set. Running in in-memory/demo mode without a real database.');
}

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running normally.' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/maps', mapRoutes);

// Global Error Handler
app.use(errorHandler);

// Serve static frontend in production
const projectRoot = path.resolve();

if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  // Serve static files from the client's dist directory
  app.use(express.static(path.join(projectRoot, '../client/dist')));

  // Any route that doesn't start with /api will be handled by the React app
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(projectRoot, '../client/dist', 'index.html'));
  });
}

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
