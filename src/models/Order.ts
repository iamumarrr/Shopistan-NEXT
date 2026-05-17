import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type PaymentMethod = 'COD' | 'STRIPE';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: any[];
  shippingAddress: any;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentDetails?: {
    transactionId?: string;
    paidAmount?: number;
    paidAt?: Date;
    note?: string;
  };
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  isPaid: boolean;
  paidAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        image: String,
        price: Number,
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    shippingAddress: {
      fullName: String, street: String, city: String, state: String,
      zip: String, country: String, phone: String,
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'STRIPE'],
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentDetails: {
      transactionId: String,
      paidAmount: Number,
      paidAt: Date,
      note: String,
    },
    itemsPrice: Number,
    shippingPrice: Number,
    taxPrice: Number,
    totalPrice: Number,
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);