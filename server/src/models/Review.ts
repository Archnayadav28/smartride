import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  rating: number;
  category: 'app' | 'booking' | 'maps' | 'support' | 'overall';
  comment?: string;
}

const reviewSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    category: { type: String, enum: ['app', 'booking', 'maps', 'support', 'overall'], required: true },
    comment: String,
  },
  { timestamps: true }
);

export default mongoose.model<IReview>('Review', reviewSchema);
