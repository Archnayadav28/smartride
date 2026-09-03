import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  age: number;
  country: string;
  countryCode: string;
  mobile: string;
  gender?: string;
  identityType: 'aadhaar' | 'passport';
  identityMasked: string;
  identityHash: string;
  preferredLanguage: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    mobile: string;
  };
  emergencyContacts?: Array<{
    name: string;
    relationship: string;
    mobile: string;
  }>;
  email?: string;
  profilePhoto?: string;
  address?: string;
  dateOfBirth?: Date;
  travelPreferences: string[];
  settings: {
    theme: string;
    notifications: boolean;
    privacy: string;
  };
  otp?: string;
  otpExpiry?: Date;
  isVerified: boolean;
  profileCompletion: number;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    country: { type: String, required: true },
    countryCode: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    identityType: { type: String, enum: ['aadhaar', 'passport'], required: true },
    identityMasked: { type: String, required: true },
    identityHash: { type: String, required: true },
    preferredLanguage: { type: String, default: 'en' },
    emergencyContact: {
      name: String,
      relationship: String,
      mobile: String,
    },
    emergencyContacts: [
      {
        name: String,
        relationship: String,
        mobile: String,
      }
    ],
    email: String,
    profilePhoto: String,
    address: String,
    dateOfBirth: Date,
    travelPreferences: [String],
    settings: {
      theme: { type: String, default: 'light' },
      notifications: { type: Boolean, default: true },
      privacy: { type: String, default: 'standard' },
    },
    otp: String,
    otpExpiry: Date,
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.virtual('profileCompletion').get(function (this: IUser) {
  const fields = ['name', 'age', 'country', 'mobile', 'identityType', 'email', 'profilePhoto', 'address', 'gender', 'emergencyContact'];
  let filled = 0;
  fields.forEach(field => {
    if (this[field as keyof IUser]) filled++;
  });
  return Math.round((filled / fields.length) * 100);
});

export default mongoose.model<IUser>('User', userSchema);
