import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: 'admin' | 'customer';
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, minlength: 6 },
    image: { type: String },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);