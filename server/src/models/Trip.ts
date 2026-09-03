import mongoose, { Document, Schema } from 'mongoose';

export interface ITrip extends Document {
  userId: mongoose.Types.ObjectId;
  origin: string;
  destination: string;
  date: Date;
  time: string;
  transportType?: 'bus' | 'cab' | 'train' | 'flight';
  provider?: string;
  bookingId?: string;
  seatNumber?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  route?: Record<string, any>;
}

const tripSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    transportType: { type: String, enum: ['bus', 'cab', 'train', 'flight'] },
    provider: String,
    bookingId: String,
    seatNumber: String,
    status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },
    route: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.model<ITrip>('Trip', tripSchema);
