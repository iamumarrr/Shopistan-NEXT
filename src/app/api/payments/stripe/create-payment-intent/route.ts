import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { Order } from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await req.json();
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Amount must be in cents
    const amount = Math.round(order.totalPrice * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { orderId: order._id.toString() },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Stripe Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
