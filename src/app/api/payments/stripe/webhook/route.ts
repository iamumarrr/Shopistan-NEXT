import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { Order } from '@/models/Order';
import { connectDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as any;
    const orderId = paymentIntent.metadata.orderId;

    await connectDB();
    const order = await Order.findById(orderId);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentStatus = 'paid';
      order.paymentDetails = {
        transactionId: paymentIntent.id,
        paidAmount: paymentIntent.amount / 100,
        paidAt: new Date(),
      };
      await order.save();
    }
  }

  return NextResponse.json({ received: true });
}
