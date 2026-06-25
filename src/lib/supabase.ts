import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export const supabaseAdmin =
  supabaseServiceRoleKey
    ? createClient(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      )
    : null;

export interface User {
  id: string;
  _id: string;
  email?: string;
  name?: string;
  role?: string;
  createdAt?: string;
}

export function mapUser(row: any): User | null {
  if (!row) return null;

  return {
    ...row,
    _id: row.id,
    createdAt: row.created_at,
  };
}


export interface Product {
  id: string;
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  rating: number;
  images: string[];
  numReviews: number;
  featured: boolean;
  createdAt?: string;
}

export function mapProduct(row: any): Product | null {
  if (!row) return null;

  return {
    ...row,
    _id: row.id,
    price: Number(row.price ?? 0),
    rating: Number(row.rating ?? 0),
    images: Array.isArray(row.images) ? row.images : [],
    numReviews: Number(
      row.num_reviews ?? row.numReviews ?? 0
    ),
    featured: Boolean(row.featured),
    createdAt: row.created_at,
  };
}


export interface Order {
  id: string;
  _id: string;
  userId?: string;
  status?: string;
  items: any[];
  shippingAddress: Record<string, any>;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentDetails: Record<string, any>;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt?: string;
  user?: any;
}

export function mapOrder(row: any): Order | null {
  if (!row) return null;

  return {
    ...row,
    _id: row.id,
    id: row.id,
    userId: row.user_id,
    status: row.status,

    items: Array.isArray(row.items)
      ? row.items
      : [],

    shippingAddress:
      row.shipping_address ?? {},

    paymentMethod:
      row.payment_method,

    paymentStatus:
      row.payment_status,

    paymentDetails:
      row.payment_details ?? {},

    itemsPrice: Number(
      row.items_price ?? 0
    ),

    shippingPrice: Number(
      row.shipping_price ?? 0
    ),

    taxPrice: Number(
      row.tax_price ?? 0
    ),

    totalPrice: Number(
      row.total_price ?? 0
    ),

    isPaid: Boolean(
      row.is_paid
    ),

    paidAt: row.paid_at,
    deliveredAt: row.delivered_at,
    createdAt: row.created_at,

    user: row.user ?? null,
  };
}