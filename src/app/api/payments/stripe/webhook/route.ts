import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as any;
    const orderId = paymentIntent.metadata.orderId;

    const { error } = await supabaseAdmin
      .from('orders')
      .update({
        is_paid: true,
        paid_at: new Date().toISOString(),
        payment_status: 'paid',
        payment_details: {
          transactionId: paymentIntent.id,
          paidAmount: paymentIntent.amount / 100,
          paidAt: new Date().toISOString(),
        },
      })
      .eq('id', orderId);

    if (error) {
      console.error('Order update error:', error.message);
    }
  }

  return NextResponse.json({ received: true });
}
