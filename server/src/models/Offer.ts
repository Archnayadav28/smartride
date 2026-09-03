import mongoose, { Document, Schema } from 'mongoose';

export interface IOffer extends Document {
  title: string;
  description: string;
  discount: string;
  validUntil: Date;
  category?: 'hotel' | 'bus' | 'cab' | 'general';
  code?: string;
  isActive: boolean;
}

const offerSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    discount: { type: String, required: true },
    validUntil: { type: Date, required: true },
    category: { type: String, enum: ['hotel', 'bus', 'cab', 'general'] },
    code: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOffer>('Offer', offerSchema);
