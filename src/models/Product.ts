import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  featured: boolean;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, index: true },
    brand: { type: String },
    images: [{ type: String, required: true }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', description: 'text' });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);