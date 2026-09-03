import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'bus' | 'cab' | 'hotel';
  provider?: string;
  origin?: string;
  destination?: string;
  date?: Date;
  checkIn?: Date;
  checkOut?: Date;
  amount?: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  bookingReference: string;
  details?: Record<string, any>;
}

const bookingSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['bus', 'cab', 'hotel'], required: true },
    provider: String,
    origin: String,
    destination: String,
    date: Date,
    checkIn: Date,
    checkOut: Date,
    amount: Number,
    status: { type: String, enum: ['confirmed', 'completed', 'cancelled'], default: 'confirmed' },
    bookingReference: { type: String, unique: true },
    details: Object,
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', bookingSchema);
