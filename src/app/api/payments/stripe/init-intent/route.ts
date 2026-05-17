import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { Product } from '@/models/Product';
import { connectDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();
    if (!items?.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });

    await connectDB();
    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) subtotal += product.price * item.quantity;
    }

    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.1;
    const amount = Math.round((subtotal + shipping + tax) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
